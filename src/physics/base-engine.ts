import type { RigidBodyOptions } from '@/components';
import type { Entity } from '@/scene';

export abstract class PhysicsEngine {
  abstract step(dt: number): void;
  abstract addBody(entity: Entity, options: RigidBodyOptions): void;
  abstract removeBody(entity: Entity): void;
  abstract setGravity(x: number, y: number, z: number): void;
}
