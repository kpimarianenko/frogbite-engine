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

  query(predicate: (entity: Entity) => boolean) {
    return this.entities.filter(predicate);
  }

  onEnter?(): void;

  onExit?(): void;
}
