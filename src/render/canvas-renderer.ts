import type { Scene } from '@/scene/scene';
import type { Entity } from '@/scene/entity';
import type { SpriteRenderData } from '@/scene/sprite-render-data';
import type { MeshRenderData } from '@/scene/mesh-render-data';
import type { Vector2D, Vector3D } from '@/math/vector';
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

      const position = scene.camera.project(entity.transform.position);

      this.drawEntity(entity, position);
    }
  }

  drawEntity(entity: Entity, position: Vector3D) {
    const renderable = entity.render;

    if (!renderable) {
      return;
    }

    switch (renderable.type) {
      case 'sprite': {
        this.drawSprite(renderable, position);
        break;
      }
      case 'mesh': {
        this.drawMesh(renderable, position);
        break;
      }
    }
  }

  // TODO: Implement rotation, scale logic. Implement textures loading
  private drawSprite(sprite: SpriteRenderData, pos: Vector2D) {
    this.ctx.fillStyle = sprite.color;
    this.ctx.fillRect(pos.x, pos.y, sprite.width, sprite.height);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  drawMesh(mesh: MeshRenderData, pos: Vector3D) {
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
