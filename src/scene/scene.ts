import type { Entity } from './entity';

export class Scene {
  entities: Entity[] = [];

  add(entity: Entity) {
    this.entities.push(entity);
  }

  remove(/* entity: Entity */) {
    // TODO: Entity removal logic. Add UUID maybe?
  }

  onEnter?(): void;

  onExit?(): void;
}
