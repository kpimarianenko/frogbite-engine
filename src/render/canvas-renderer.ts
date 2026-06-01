import { half } from '@/math';
import type { MeshRenderCommand, RenderCommand, SpriteRenderCommand } from './render-command';
import type { Renderer } from './renderer';

export class CanvasRenderer implements Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
  }

  get context() {
    return this.ctx;
  }

  render(commands: RenderCommand[]): void {
    this.execute(commands);
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

  private execute(commands: RenderCommand[]) {
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

  private drawSprite(command: SpriteRenderCommand) {
    const { transform, viewport } = command;
    const { position, rotation, scale } = transform;

    const {
      x: vpX,
      y: vpY,
      width: vpWidth,
      height: vpHeight,
    } = viewport.normalized
      ? {
          x: this.canvas.width * viewport.x,
          y: this.canvas.height * viewport.y,
          width: this.canvas.width * viewport.width,
          height: this.canvas.height * viewport.height,
        }
      : viewport;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(vpX, vpY, vpWidth, vpHeight);
    this.ctx.clip();

    this.ctx.translate(position.x + vpX, position.y + vpY);
    this.ctx.rotate(rotation.z);
    this.ctx.scale(scale.x, scale.y);

    this.ctx.fillStyle = command.color;
    this.ctx.fillRect(-half(command.width), -half(command.height), command.width, command.height);

    this.ctx.restore();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private drawMesh(command: MeshRenderCommand) {
    // TODO: Implement 3D logic
  }
}
