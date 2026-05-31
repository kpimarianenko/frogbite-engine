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

  onEnter?(): void;

  onExit?(): void;
}
