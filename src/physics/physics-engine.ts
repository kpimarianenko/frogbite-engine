import { RigidBodyComponent } from '@/components';
import type { Vector3D } from '@/math';
import type { Entity } from '@/scene';
import { aabbIntersects, getAABB } from './aabb';
import { PhysicsEngine } from './base-physics-engine';
import { ShapeType } from './shapes';

export type CollisionInfo = {
  normal: Vector3D;
  depth: number;
};

export type Actor = {
  entity: Entity;
  body: RigidBodyComponent;
};

export class FrogbitePhysicsEngine extends PhysicsEngine {
  private readonly POSITION_CORRECTION_PERCENT = 0.8;
  private readonly POSITION_CORRECTION_SLOP = 0.01;
  private readonly GROUNDED_NORMAL_THRESHOLD = 0.5;

  private gravity: Vector3D = { x: 0, y: 9.81, z: 0 };

  setGravity(x: number, y: number, z: number) {
    this.gravity = { x, y, z };
  }

  step(bodies: Entity[], dt: number) {
    this.integrate(bodies, dt);
    this.updateBodiesWorldTransforms(bodies);
    this.detectCollisions(bodies);
  }

  private updateBodiesWorldTransforms(bodies: Entity[]) {
    for (const entity of bodies) {
      entity.updateWorldTransform();
    }
  }

  private integrate(bodies: Entity[], dt: number) {
    for (const entity of bodies) {
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

  private detectCollisions(bodies: Entity[]) {
    const actors: Actor[] = bodies.map(entity => ({
      entity,
      body: entity.getComponent(RigidBodyComponent)!,
    }));

    for (let i = 0; i < actors.length; i++) {
      for (let j = i + 1; j < actors.length; j++) {
        const a = actors[i];
        const b = actors[j];

        if (a.body.isStatic && b.body.isStatic) {
          continue;
        }

        const collision = this.getCollisionByEntityType(a, b);

        if (collision) {
          this.resolveCollision(a, b, collision);
        }
      }
    }
  }

  private getCollisionByEntityType(a: Actor, b: Actor): CollisionInfo | null {
    if (a.body.shape.type === ShapeType.Box && b.body.shape.type === ShapeType.Box) {
      return this.boxToBoxCollision(a, b);
    } else {
      return null;
    }
  }

  private boxToBoxCollision(a: Actor, b: Actor) {
    const aAabb = getAABB(a);
    const bAabb = getAABB(b);

    if (!aabbIntersects(aAabb, bAabb)) {
      return null;
    }

    const overlapX = Math.min(aAabb.maxX - bAabb.minX, bAabb.maxX - aAabb.minX);
    const overlapY = Math.min(aAabb.maxY - bAabb.minY, bAabb.maxY - aAabb.minY);

    if (overlapX < overlapY) {
      return {
        normal: { x: aAabb.minX < bAabb.minX ? -1 : 1, y: 0, z: 0 },
        depth: overlapX,
      };
    }

    return {
      normal: { x: 0, y: aAabb.minY < bAabb.minY ? -1 : 1, z: 0 },
      depth: overlapY,
    };
  }

  private resolveCollision(a: Actor, b: Actor, collision: CollisionInfo) {
    this.applyPositionCorrection(a, b, collision.normal, collision.depth);
    this.applyGroundedFlags(a.body, b.body, collision.normal);
    this.applyImpulse(a.body, b.body, collision.normal);
  }

  private applyPositionCorrection(a: Actor, b: Actor, normal: Vector3D, depth: number) {
    const correctionDepth =
      Math.max(depth - this.POSITION_CORRECTION_SLOP, 0) * this.POSITION_CORRECTION_PERCENT;

    if (a.body.isStatic) {
      b.entity.translate(-normal.x * correctionDepth, -normal.y * correctionDepth, 0);
      return;
    }

    if (b.body.isStatic) {
      a.entity.translate(normal.x * correctionDepth, normal.y * correctionDepth, 0);
      return;
    }

    const totalMass = a.body.mass + b.body.mass;
    const ratioA = b.body.mass / totalMass;
    const ratioB = a.body.mass / totalMass;

    a.entity.translate(normal.x * correctionDepth * ratioA, normal.y * correctionDepth * ratioA, 0);
    b.entity.translate(
      -normal.x * correctionDepth * ratioB,
      -normal.y * correctionDepth * ratioB,
      0
    );
  }

  private applyGroundedFlags(
    bodyA: RigidBodyComponent,
    bodyB: RigidBodyComponent,
    normal: Vector3D
  ) {
    if (bodyB.isStatic && normal.y < -this.GROUNDED_NORMAL_THRESHOLD) {
      bodyA.isGrounded = true;
    }

    if (bodyA.isStatic && normal.y > this.GROUNDED_NORMAL_THRESHOLD) {
      bodyB.isGrounded = true;
    }
  }

  private applyImpulse(bodyA: RigidBodyComponent, bodyB: RigidBodyComponent, normal: Vector3D) {
    const relativeVelocity = {
      x: bodyA.velocity.x - bodyB.velocity.x,
      y: bodyA.velocity.y - bodyB.velocity.y,
    };

    const velocityAlongNormal = relativeVelocity.x * normal.x + relativeVelocity.y * normal.y;

    if (velocityAlongNormal > 0) {
      return;
    }

    const restitution = Math.min(bodyA.restitution, bodyB.restitution);
    const invMassA = bodyA.isStatic ? 0 : 1 / bodyA.mass;
    const invMassB = bodyB.isStatic ? 0 : 1 / bodyB.mass;
    const impulseMagnitude = (-(1 + restitution) * velocityAlongNormal) / (invMassA + invMassB);

    if (!bodyA.isStatic) {
      bodyA.velocity.x += impulseMagnitude * invMassA * normal.x;
      bodyA.velocity.y += impulseMagnitude * invMassA * normal.y;

      if (bodyB.isStatic) {
        this.clampVelocityAlongNormal(bodyA, normal);
      }
    }

    if (!bodyB.isStatic) {
      bodyB.velocity.x -= impulseMagnitude * invMassB * normal.x;
      bodyB.velocity.y -= impulseMagnitude * invMassB * normal.y;

      if (bodyA.isStatic) {
        this.clampVelocityAlongNormal(bodyB, normal);
      }
    }
  }

  private clampVelocityAlongNormal(body: RigidBodyComponent, normal: Vector3D) {
    const dot = body.velocity.x * normal.x + body.velocity.y * normal.y;

    if (dot < 0) {
      body.velocity.x -= dot * normal.x;
      body.velocity.y -= dot * normal.y;
    }
  }
}
