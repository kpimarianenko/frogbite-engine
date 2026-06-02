import type { Entity } from '@/scene';

export abstract class PhysicsEngine {
  abstract step(bodies: Entity[], dt: number): void;
  abstract setGravity(x: number, y: number, z: number): void;
}
