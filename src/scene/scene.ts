import type { RenderCommand } from '@/render/render-command';
import type { Camera } from './camera';
import type { Entity } from './entity';
import { Transform } from './transform';

export class Scene {
  camera: Camera;
  entities: Entity[] = [];

  constructor(camera: Camera) {
    this.camera = camera;
  }

  add(entity: Entity) {
    this.entities.push(entity);
  }

  remove(/* entity: Entity */) {
    // TODO: Entity removal logic. Add UUID maybe?
  }

  buildRenderQueue(): RenderCommand[] {
    return this.entities.reduce<RenderCommand[]>((acc, entity) => {
      if (!entity.render || !entity.visible) {
        return acc;
      }

      const projectedPosition = this.camera.project(entity.transform.position);
      const transform = new Transform(
        projectedPosition,
        entity.transform.rotation,
        entity.transform.scale
      );

      switch (entity.render.type) {
        case 'sprite': {
          acc.push({
            type: 'sprite',
            transform,
            width: entity.render.width,
            height: entity.render.height,
            color: entity.render.color,
          });
          return acc;
        }
        case 'mesh': {
          acc.push({
            type: 'mesh',
            transform,
            vertices: entity.render.vertices,
          });
          return acc;
        }
      }
    }, []);
  }

  onEnter?(): void;

  onExit?(): void;
}
