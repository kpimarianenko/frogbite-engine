import type { Scene } from '@/scene/scene';
import type { Entity } from '@/scene/entity';
import type { SpriteRenderData } from '@/scene/sprite-render-data';
import type { MeshRenderData } from '@/scene/mesh-render-data';
import type { Renderer } from './renderer';

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

    for (const entity of scene.entities) {
      if (!entity.render || !entity.visible) {
        continue;
      }

      this.drawEntity(entity);
    }
  }

  drawEntity(entity: Entity) {
    const renderable = entity.render;

    if (!renderable) {
      return;
    }

    switch (renderable.type) {
      case 'sprite': {
        this.drawSprite(entity, renderable);
        break;
      }
      case 'mesh': {
        this.drawMesh(entity, renderable);
        break;
      }
    }
  }

  // TODO: Implement rotation, scale logic. Implement textures loading
  private drawSprite(entity: Entity, sprite: SpriteRenderData) {
    const { x, y } = entity.transform.position;

    this.ctx.fillStyle = sprite.color;
    this.ctx.fillRect(x, y, sprite.width, sprite.height);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  drawMesh(entity: Entity, mesh: MeshRenderData) {
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
