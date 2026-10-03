import { RigidBodyComponent, SpriteComponent } from '@/components';
import { Entity } from './entity';
import type { EntityPrefab } from './prefab';

export class EntityFactory {
  static create(prefab: EntityPrefab): Entity {
    const entity = new Entity();

    if (prefab.position) {
      entity.setPosition(prefab.position.x, prefab.position.y, prefab.position.z);
    }

    if (prefab.scale) {
      entity.setScale(prefab.scale.x, prefab.scale.y, prefab.scale.z);
    }

    if (prefab.rotation) {
      entity.setRotation(prefab.rotation.x, prefab.rotation.y, prefab.rotation.z);
    }

    if (prefab.sprite) {
      entity.addComponent(new SpriteComponent(prefab.sprite));
    }

    if (prefab.rigidBody) {
      entity.addComponent(new RigidBodyComponent(prefab.rigidBody));
    }

    prefab.children?.forEach(childPrefab => {
      const childEntity = this.create(childPrefab);

      entity.addChild(childEntity);
    });

    return entity;
  }
}
