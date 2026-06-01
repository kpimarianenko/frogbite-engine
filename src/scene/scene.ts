import type { System } from '@/core/system';
import type { Camera } from './camera';
import type { Entity } from './entity';

export class Scene {
  entities: Entity[] = [];
  cameras: Camera[] = [];
  systems: System[] = [];

  update() {
    for (const root of this.getRootEntities()) {
      root.updateWorldTransform();
    }
  }

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  addCamera(camera: Camera) {
    this.cameras.push(camera);
  }

  addSystem(system: System) {
    this.systems.push(system);
  }

  removeEntity(/* entity: Entity */) {
    // TODO: Entity removal logic. Add UUID maybe?
  }

  removeCamera(/* camera: Camera */) {
    // TODO: Camera removal logic. Add UUID maybe?
  }

  getRootEntities() {
    return this.query(entity => !entity.parent);
  }

  query(predicate: (entity: Entity) => boolean) {
    return this.entities.filter(predicate);
  }

  onEnter?(): void;

  onExit?(): void;
}
