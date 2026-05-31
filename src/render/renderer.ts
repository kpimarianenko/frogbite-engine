import type { RenderCommand } from './render-command';

export interface Renderer {
  clear(): void;
  render(commands: RenderCommand[]): void;
  resize(w: number, h: number): void;
}
