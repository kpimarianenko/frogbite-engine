import type { Vector3D } from '@/math/vector';
import type { Transform } from './transform';

export class Camera {
  transform: Transform = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0, y: 0, z: 0 },
  };

  project(v: Vector3D): Vector3D {
    return {
      x: v.x - this.transform.position.x,
      y: v.y - this.transform.position.y,
      z: v.z - this.transform.position.z,
    };
  }
}
