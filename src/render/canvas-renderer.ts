import type { AssetManager } from '@/core/asset-manager';
import { half } from '@/math';
import type { Viewport } from '@/scene';
import type { RenderCommand, SpriteRenderCommand } from './render-command';
import type { Renderer } from './renderer';

export class CanvasRenderer implements Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private assets: AssetManager;

  constructor(canvas: HTMLCanvasElement, assets: AssetManager) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = false;
    this.assets = assets;
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
    this.ctx.imageSmoothingEnabled = false;
  }

  private execute(commands: RenderCommand[]) {
    for (const command of commands) {
      switch (command.type) {
        case 'sprite': {
          this.drawSprite(command);
          break;
        }
        case 'mesh': {
          throw new Error('Mesh rendering is not supported in CanvasRenderer');
        }
      }
    }
  }

  private drawSprite(command: SpriteRenderCommand) {
    const { mvMatrix: m, viewport } = command;
    const { x: vpX, y: vpY, width: vpWidth, height: vpHeight } = this.resolveViewport(viewport);

    const cx = vpX + half(vpWidth);
    const cy = vpY + half(vpHeight);

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(vpX, vpY, vpWidth, vpHeight);
    this.ctx.clip();

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    this.ctx.setTransform(m[0], m[1], m[4], m[5], m[12] + cx, m[13] + cy);

    if (command.animation) {
      const img = this.assets.get('walk')!;
      const columns = Math.floor(img.width / command.animation.frameWidth);
      const sourceX = (command.animation.frame % columns) * command.animation.frameWidth;
      const sourceY = Math.floor(command.animation.frame / columns) * command.animation.frameHeight;

      this.ctx.drawImage(
        img,
        sourceX,
        sourceY,
        command.animation.frameWidth,
        command.animation.frameHeight,
        -half(command.width),
        -half(command.height),
        command.width,
        command.height
      );
    } else if (command.texture) {
      const img = this.assets.get(command.texture);

      if (img) {
        if (command.repeat) {
          const pattern = this.ctx.createPattern(img, 'repeat');

          if (pattern) {
            const scaleX = command.repeat.width / img.width;
            const scaleY = command.repeat.height / img.height;
            const offsetX = -half(command.repeat.width);
            const offsetY = -half(command.repeat.height);

            // TODO: replace translate with anchor point
            pattern.setTransform(new DOMMatrix().translate(offsetX, offsetY).scale(scaleX, scaleY));

            this.ctx.fillStyle = pattern;
            this.ctx.fillRect(
              -half(command.width),
              -half(command.height),
              command.width,
              command.height
            );
          }
        } else {
          this.ctx.drawImage(
            img,
            -half(command.width),
            -half(command.height),
            command.width,
            command.height
          );
        }
      } else {
        this.ctx.fillStyle = command.color;
        this.ctx.fillRect(
          -half(command.width),
          -half(command.height),
          command.width,
          command.height
        );
      }
    } else {
      this.ctx.fillStyle = command.color;
      this.ctx.fillRect(-half(command.width), -half(command.height), command.width, command.height);
    }

    this.ctx.restore();
  }

  private resolveViewport(viewport: Viewport) {
    return viewport.normalized
      ? {
          x: this.canvas.width * viewport.x,
          y: this.canvas.height * viewport.y,
          width: this.canvas.width * viewport.width,
          height: this.canvas.height * viewport.height,
        }
      : viewport;
  }
}
