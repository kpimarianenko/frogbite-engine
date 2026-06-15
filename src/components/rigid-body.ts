import type { Vector3D } from '@/math';
import type { PhysicsShape } from '@/physics';
import { Component } from './component';

export type RigidBodyOptions = {
  shape: PhysicsShape;
  mass?: number;
  restitution?: number;
  friction?: number;
  isStatic?: boolean;
  mode?: '2d' | '3d';
};

export class RigidBodyComponent extends Component {
  shape: PhysicsShape;
  mass: number;
  restitution: number;
  friction: number;
  isStatic: boolean;
  isGrounded = false;
  mode: '2d' | '3d';

  velocity: Vector3D = { x: 0, y: 0, z: 0 };
  acceleration: Vector3D = { x: 0, y: 0, z: 0 };
  force: Vector3D = { x: 0, y: 0, z: 0 };

  constructor(options: RigidBodyOptions) {
    super();
    const {
      shape,
      mass = 1,
      restitution = 0.5,
      friction = 0.1,
      isStatic = false,
      mode = '2d',
    } = options;

    this.shape = shape;
    this.mass = mass;
    this.restitution = restitution;
    this.friction = friction;
    this.isStatic = isStatic;
    this.mode = mode;
  }

  applyForce(x: number, y: number, z: number) {
    if (this.isStatic) {
      return;
    }

    this.force.x += x;
    this.force.y += y;
    this.force.z += z;
  }

  applyImpulse(x: number, y: number, z: number) {
    if (this.isStatic) {
      return;
    }

    this.velocity.x += x / this.mass;
    this.velocity.y += y / this.mass;
    this.velocity.z += z / this.mass;
  }
}
