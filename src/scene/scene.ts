import type { RenderCommand } from '@/render/render-command';
import type { Camera } from './camera';
import type { Entity } from './entity';

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

      switch (entity.render.type) {
        case 'sprite': {
          acc.push({
            type: 'sprite',
            x: projectedPosition.x,
            y: projectedPosition.y,
            width: entity.render.width,
            height: entity.render.height,
            color: entity.render.color,
          });
          return acc;
        }
        case 'mesh': {
          acc.push({
            type: 'mesh',
            x: projectedPosition.x,
            y: projectedPosition.y,
            z: projectedPosition.z,
            rotationX: entity.transform.rotation.x,
            rotationY: entity.transform.rotation.y,
            rotationZ: entity.transform.rotation.z,
            scaleX: entity.transform.scale.x,
            scaleY: entity.transform.scale.y,
            scaleZ: entity.transform.scale.z,
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
