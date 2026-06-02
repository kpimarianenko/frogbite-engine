import { Component, type ComponentConstructor, TransformComponent } from '@/components';
import { Matrix4x4 } from '@/math';

export class Entity {
  readonly transform: TransformComponent;

  localMatrix: Matrix4x4 = Matrix4x4.identity();
  worldMatrix: Matrix4x4 = Matrix4x4.identity();

  parent: Entity | null = null;
  children: Entity[] = [];

  visible = true;
  protected dirty = true;

  private components = new Map<ComponentConstructor, Component>();

  constructor() {
    this.transform = new TransformComponent();
    this.addComponent(this.transform);
  }

  addChild(child: Entity) {
    child.parent = this;
    this.children.push(child);
  }

  removeChild(child: Entity) {
    const index = this.children.indexOf(child);

    if (index >= 0) {
      child.parent = null;
      this.children.splice(index, 1);
    }
  }

  addComponent(component: Component) {
    component.entity = this;
    this.components.set(component.constructor as new (...args: unknown[]) => Component, component);
  }

  getComponent<T extends Component>(type: ComponentConstructor<T>): T | null {
    return (this.components.get(type) as T) ?? null;
  }

  hasComponent<T extends Component>(type: ComponentConstructor<T>): boolean {
    return this.components.has(type);
  }

  removeComponent<T extends Component>(type: ComponentConstructor<T>): void {
    this.components.delete(type);
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
