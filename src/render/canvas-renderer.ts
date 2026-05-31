import type { Scene } from '@/scene/scene';
import type { Renderer } from './renderer';
import type { MeshRenderCommand, RenderCommand, SpriteRenderCommand } from './render-command';

export class CanvasRenderer implements Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  get context() {
    return this.ctx;
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
  }

  render(scene: Scene): void {
    this.clear();

    const renderCommands = scene.buildRenderQueue();

    this.execute(renderCommands);
  }

  execute(commands: RenderCommand[]) {
    for (const command of commands) {
      switch (command.type) {
        case 'sprite': {
          this.drawSprite(command);
          break;
        }
        case 'mesh': {
          this.drawMesh(command);
          break;
        }
      }
    }
  }

  // TODO: Implement rotation, scale logic. Implement textures loading
  private drawSprite(command: SpriteRenderCommand) {
    this.ctx.fillStyle = command.color;
    this.ctx.fillRect(command.x, command.y, command.width, command.height);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  drawMesh(command: MeshRenderCommand) {
    // TODO: Implement 3D logic
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  resize(w: number, h: number) {
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;

    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
  }
}
