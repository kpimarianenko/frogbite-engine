import type { Scene } from '@/scene/scene';

export interface Renderer {
  clear(): void;
  render(scene: Scene): void;
  resize(w: number, h: number): void;
}
