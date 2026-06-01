import type { RenderComponent, Transform } from '@/components';

const defaultTransform = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
};

export class Entity {
  id: string = crypto.randomUUID();
  transform = structuredClone(defaultTransform);
  worldTransform = structuredClone(defaultTransform);

  parent: Entity | null = null;
  children: Entity[] = [];

  render: RenderComponent | null = null;
  visible = true;

  constructor(render: RenderComponent | null = null) {
    this.render = render;
  }

  addChild(child: Entity) {
    child.parent = this;
    this.children.push(child);
  }

  removeChild(child: Entity) {
    const index = this.children.findIndex(c => c.id === child.id);

    if (index >= 0) {
      child.parent = null;
      this.children.splice(index, 1);
    }
  }

  updateWorldTransform(parentWorldTransform?: Transform) {
    if (parentWorldTransform) {
      this.worldTransform.position = {
        x: parentWorldTransform.position.x + this.transform.position.x,
        y: parentWorldTransform.position.y + this.transform.position.y,
        z: parentWorldTransform.position.z + this.transform.position.z,
      };

      this.worldTransform.rotation = {
        x: parentWorldTransform.rotation.x + this.transform.rotation.x,
        y: parentWorldTransform.rotation.y + this.transform.rotation.y,
        z: parentWorldTransform.rotation.z + this.transform.rotation.z,
      };

      this.worldTransform.scale = {
        x: parentWorldTransform.scale.x * this.transform.scale.x,
        y: parentWorldTransform.scale.y * this.transform.scale.y,
        z: parentWorldTransform.scale.z * this.transform.scale.z,
      };
    } else {
      this.worldTransform = structuredClone(this.transform);
    }

    for (const child of this.children) {
      child.updateWorldTransform(this.worldTransform);
    }
  }
}
