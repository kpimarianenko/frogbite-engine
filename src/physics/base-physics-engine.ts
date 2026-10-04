import type { Scene } from '@/scene';

export abstract class PhysicsEngine {
  abstract step(scene: Scene, dt: number): void;
  abstract setGravity(x: number, y: number, z: number): void;
}
