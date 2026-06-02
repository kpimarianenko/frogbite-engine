import { defaultTransform, type RenderComponent } from '@/components';
import { Matrix4x4 } from '@/math';

export class Entity {
  id: string = crypto.randomUUID();
  transform = defaultTransform();

  localMatrix: Matrix4x4 = Matrix4x4.identity();
  worldMatrix: Matrix4x4 = Matrix4x4.identity();

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

  updateLocalMatrix() {
    const { position, rotation, scale } = this.transform;

    this.localMatrix = Matrix4x4.trs(position, rotation, scale);
  }

  updateWorldTransform(parentWorldMatrix?: Matrix4x4) {
    if (this.dirty) {
      this.updateLocalMatrix();

      this.worldMatrix = parentWorldMatrix
        ? Matrix4x4.multiply(parentWorldMatrix, this.localMatrix)
        : this.localMatrix;

      this.dirty = false;
    }

    for (const child of this.children) {
      child.updateWorldTransform(this.worldMatrix);
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
