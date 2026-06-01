import { defaultTransform, type RenderComponent, type Transform } from '@/components';

export class Entity {
  id: string = crypto.randomUUID();
  transform = defaultTransform();
  worldTransform = defaultTransform();

  parent: Entity | null = null;
  children: Entity[] = [];

  render: RenderComponent | null = null;
  visible = true;
  protected dirty = true;

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
    if (this.dirty) {
      if (parentWorldTransform) {
        this.worldTransform.position.x =
          parentWorldTransform.position.x + this.transform.position.x;
        this.worldTransform.position.y =
          parentWorldTransform.position.y + this.transform.position.y;
        this.worldTransform.position.z =
          parentWorldTransform.position.z + this.transform.position.z;

        this.worldTransform.rotation.x =
          parentWorldTransform.rotation.x + this.transform.rotation.x;
        this.worldTransform.rotation.y =
          parentWorldTransform.rotation.y + this.transform.rotation.y;
        this.worldTransform.rotation.z =
          parentWorldTransform.rotation.z + this.transform.rotation.z;

        this.worldTransform.scale.x = parentWorldTransform.scale.x * this.transform.scale.x;
        this.worldTransform.scale.y = parentWorldTransform.scale.y * this.transform.scale.y;
        this.worldTransform.scale.z = parentWorldTransform.scale.z * this.transform.scale.z;
      } else {
        this.worldTransform.position.x = this.transform.position.x;
        this.worldTransform.position.y = this.transform.position.y;
        this.worldTransform.position.z = this.transform.position.z;

        this.worldTransform.rotation.x = this.transform.rotation.x;
        this.worldTransform.rotation.y = this.transform.rotation.y;
        this.worldTransform.rotation.z = this.transform.rotation.z;

        this.worldTransform.scale.x = this.transform.scale.x;
        this.worldTransform.scale.y = this.transform.scale.y;
        this.worldTransform.scale.z = this.transform.scale.z;
      }

      this.dirty = false;
    }

    for (const child of this.children) {
      child.updateWorldTransform(this.worldTransform);
    }
  }

  setPosition(x: number, y: number, z: number) {
    this.transform.position.x = x;
    this.transform.position.y = y;
    this.transform.position.z = z;
    this.markAsDirty();
  }

  translate(x: number, y: number, z: number) {
    this.transform.position.x += x;
    this.transform.position.y += y;
    this.transform.position.z += z;
    this.markAsDirty();
  }

  setRotation(x: number, y: number, z: number) {
    this.transform.rotation.x = x;
    this.transform.rotation.y = y;
    this.transform.rotation.z = z;
    this.markAsDirty();
  }

  rotate(x: number, y: number, z: number) {
    this.transform.rotation.x += x;
    this.transform.rotation.y += y;
    this.transform.rotation.z += z;
    this.markAsDirty();
  }

  setScale(x: number, y: number, z: number) {
    this.transform.scale.x = x;
    this.transform.scale.y = y;
    this.transform.scale.z = z;
    this.markAsDirty();
  }

  scaleBy(x: number, y: number, z: number) {
    this.transform.scale.x *= x;
    this.transform.scale.y *= y;
    this.transform.scale.z *= z;
    this.markAsDirty();
  }

  markAsDirty() {
    if (this.dirty) return;

    this.dirty = true;

    for (const child of this.children) {
      child.markAsDirty();
    }
  }
}
