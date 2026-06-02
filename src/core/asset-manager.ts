export class AssetManager {
  private textures = new Map<string, HTMLImageElement>();
  private pending = new Map<string, Promise<HTMLImageElement>>();

  async load(key: string, url: string): Promise<HTMLImageElement> {
    if (this.textures.has(key)) {
      return this.textures.get(key)!;
    }

    if (this.pending.has(key)) {
      return this.pending.get(key)!;
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.textures.set(key, img);
        this.pending.delete(key);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load texture: ${url}`));
      img.src = url;
    });

    this.pending.set(key, promise);
    return promise;
  }

  async loadAll(assets: Record<string, string>): Promise<void> {
    await Promise.all(Object.entries(assets).map(([key, url]) => this.load(key, url)));
  }

  get(key: string): HTMLImageElement | null {
    return this.textures.get(key) ?? null;
  }

  has(key: string): boolean {
    return this.textures.has(key);
  }

  unload(key: string): void {
    this.textures.delete(key);
    this.pending.delete(key);
  }
}
