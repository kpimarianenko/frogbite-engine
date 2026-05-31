import type { Entity } from './entity';

export class Scene {
  entities: Entity[] = [];

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
