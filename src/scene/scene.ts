import type { Camera } from './camera';
import type { Entity } from './entity';

export class Scene {
  entities: Entity[] = [];
  cameras: Camera[] = [];

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  addCamera(camera: Camera) {
    this.cameras.push(camera);
  }

  removeEntity(/* entity: Entity */) {
    // TODO: Entity removal logic. Add UUID maybe?
  }

  removeCamera(/* camera: Camera */) {
    // TODO: Camera removal logic. Add UUID maybe?
  }

  query(predicate: (entity: Entity) => boolean) {
    return this.entities.filter(predicate);
  }

  onEnter?(): void;

  onExit?(): void;
}
