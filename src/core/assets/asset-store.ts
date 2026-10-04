export class AssetStore<T> {
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
