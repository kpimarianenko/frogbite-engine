import type { Component, ComponentConstructor } from '@/components';
import type { System } from '@/core/system';
import type { Camera } from './camera';
import { Entity } from './entity';

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

  removeEntity(entity: Entity) {
    const index = this.entities.findIndex(e => e.id === entity.id);

    if (index >= 0) {
      this.entities.splice(index, 1);
    }
  }

  removeCamera(camera: Camera) {
    const index = this.cameras.findIndex(c => c === camera);

    if (index >= 0) {
      this.cameras.splice(index, 1);
    }
  }

  removeSystem(system: System) {
    const index = this.systems.findIndex(s => s === system);

    if (index >= 0) {
      this.systems.splice(index, 1);
    }
  }

  getRootEntities() {
    return this.entities;
  }

  // TODO: Redesign query system. Maybe add some kind of indexing for better performance?
  query<T extends Component[]>(...types: { [K in keyof T]: ComponentConstructor<T[K]> }): Entity[] {
    const result: Entity[] = [];

    const visit = (entity: Entity) => {
      if (types.every(type => entity.hasComponent(type))) {
        result.push(entity);
      }

      for (const child of entity.children) {
        visit(child);
      }
    };

    for (const root of this.getRootEntities()) {
      visit(root);
    }

    return result;
  }

  onEnter?(): void;

  onExit?(): void;
}
