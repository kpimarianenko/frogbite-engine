import type { EntityPrefab } from '@/scene/prefab';

interface AssetManifest {
  textures?: Record<string, string>;
  prefabs?: Record<string, string>;
}

class AssetStore<T> {
  private assets = new Map<string, T>();
  private pending = new Map<string, Promise<T>>();

  async load(key: string, loader: () => Promise<T>): Promise<T> {
    const asset = this.assets.get(key);

    if (asset) {
      return asset;
    }

    const pending = this.pending.get(key);

    if (pending) {
      return pending;
    }

    const promise = loader()
      .then(asset => {
        this.assets.set(key, asset);
        this.pending.delete(key);
        return asset;
      })
      .catch(error => {
        this.pending.delete(key);
        throw error;
      });

    this.pending.set(key, promise);

    return promise;
  }

  get(key: string): T | null {
    return this.assets.get(key) ?? null;
  }

  has(key: string): boolean {
    return this.assets.has(key);
  }

  unload(key: string): void {
    this.assets.delete(key);
    this.pending.delete(key);
  }
}

export class AssetManager {
  private textures = new AssetStore<HTMLImageElement>();
  private prefabs = new AssetStore<EntityPrefab>();

  private manifestPath: string;
  private manifest: AssetManifest | null;

  constructor(manifestPath: string) {
    this.manifestPath = manifestPath;
    this.manifest = null;
  }

  async load() {
    await this.loadManifest();

    await Promise.all([this.loadTextures(), this.loadPrefabs()]);
  }

  async loadManifest() {
    const response = await fetch(this.manifestPath);

    if (!response.ok) {
      throw new Error(`Failed to load asset manifest: ${this.manifestPath}`);
    }

    this.manifest = (await response.json()) as AssetManifest;
  }

  async loadTextures() {
    await Promise.all(
      Object.entries(this.manifest?.textures ?? {}).map(([key, url]) => this.loadTexture(key, url))
    );
  }

  async loadPrefabs() {
    await Promise.all(
      Object.entries(this.manifest?.prefabs ?? {}).map(([key, url]) => this.loadPrefab(key, url))
    );
  }

  async loadTexture(key: string, path: string) {
    return await this.textures.load(
      key,
      () =>
        new Promise((resolve, reject) => {
          const img = new Image();

          img.onload = () => resolve(img);
          img.onerror = () => {
            reject(new Error(`Failed to load texture: ${path}`));
          };

          img.src = path;
        })
    );
  }

  async loadPrefab(key: string, path: string) {
    return this.prefabs.load(key, async () => {
      const response = await fetch(path);

      if (!response.ok) {
        throw new Error(`Failed to load prefab: ${path}`);
      }

      return response.json() as Promise<EntityPrefab>;
    });
  }

  getTexture(key: string) {
    const texture = this.textures.get(key);

    if (!texture) {
      throw new Error(`Texture not found: ${key}`);
    }

    return texture;
  }

  getPrefab(key: string) {
    const prefab = this.prefabs.get(key);

    if (!prefab) {
      throw new Error(`Prefab not found: ${key}`);
    }

    return prefab;
  }
}
