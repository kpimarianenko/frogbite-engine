import { RigidBodyComponent, type RigidBodyOptions } from '@/components';
import type { Vector3D } from '@/math';
import type { Entity } from '@/scene';
import { PhysicsEngine } from './base-engine';

export class FrogbitePhysicsEngine extends PhysicsEngine {
  private bodies: Entity[] = [];
  private gravity: Vector3D = { x: 0, y: 9.81, z: 0 };

  setGravity(x: number, y: number, z: number) {
    this.gravity = { x, y, z };
  }

  addBody(entity: Entity, options: RigidBodyOptions) {
    entity.addComponent(new RigidBodyComponent(options));
  }

  removeBody(entity: Entity): void {
    const index = this.bodies.indexOf(entity);

    if (index >= 0) {
      this.bodies.splice(index, 1);
    }

    entity.removeComponent(RigidBodyComponent);
  }

  step(dt: number) {
    this.integrate(dt);
    this.detectCollisions();
  }

  private integrate(dt: number) {
    for (const entity of this.bodies) {
      const body = entity.getComponent(RigidBodyComponent)!;

      if (body.isStatic) {
        continue;
      }

      body.acceleration.x = body.force.x / body.mass + this.gravity.x;
      body.acceleration.y = body.force.y / body.mass + this.gravity.y;
      body.acceleration.z = body.force.z / body.mass + this.gravity.z;

      body.velocity.x += body.acceleration.x * dt;
      body.velocity.y += body.acceleration.y * dt;
      body.velocity.z += body.acceleration.z * dt;

      entity.translate(body.velocity.x * dt, body.velocity.y * dt, body.velocity.z * dt);

      body.force.x = 0;
      body.force.y = 0;
      body.force.z = 0;
    }
  }

  private detectCollisions() {
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        // const a = this.bodies[i];
        // const b = this.bodies[j];
        // TODO: collision detection + response
      }
    }
  }
}
