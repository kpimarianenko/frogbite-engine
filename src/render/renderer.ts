export interface Renderer {
  clear(): void;
  render(): void;
  resize(w: number, h: number): void;
}
