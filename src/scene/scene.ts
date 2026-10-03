import type { Component, ComponentConstructor } from '@/components';
import type { System } from '@/core/system';
import type { Camera } from './camera';
import { Entity } from './entity';
import { EntityFactory } from './entity-factory';
import type { EntityPrefab } from './prefab';

export class Scene {
  entities: Entity[] = [];
  cameras: Camera[] = [];
  systems: System[] = [];

  private pendingRemovals = new Set<Entity>();

  instantiate(prefab: EntityPrefab) {
    const entity = EntityFactory.create(prefab);

    this.addChild(entity);
    return entity;
  }

  addChild(entity: Entity) {
    // TODO: Should check if entity already belongs to this or another scene
    if (entity.parent) {
      throw new Error('Cannot add a child entity directly to a Scene');
    }

    this.entities.push(entity);
  }

  addCamera(camera: Camera) {
    this.cameras.push(camera);
  }

  addSystem(system: System) {
    this.systems.push(system);
  }

  removeEntity(entity: Entity) {
    this.pendingRemovals.add(entity);
  }

  flushRemovals() {
    for (const entity of this.pendingRemovals) {
      if (this.hasPendingAncestor(entity)) {
        continue;
      }

      const parent = entity.parent;

      if (parent) {
        parent.removeChild(entity);
      } else {
        const index = this.entities.indexOf(entity);

        if (index >= 0) {
          this.entities.splice(index, 1);
        }
      }

      entity.destroy();
    }

    this.pendingRemovals.clear();
  }

  removeCamera(camera: Camera) {
    const index = this.cameras.indexOf(camera);

    if (index >= 0) {
      this.cameras.splice(index, 1);
    }
  }

  removeSystem(system: System) {
    const index = this.systems.indexOf(system);

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

  private hasPendingAncestor(entity: Entity) {
    let current = entity.parent;

    while (current) {
      if (this.pendingRemovals.has(current)) {
        return true;
      }

      current = current.parent;
    }

    return false;
  }
}
