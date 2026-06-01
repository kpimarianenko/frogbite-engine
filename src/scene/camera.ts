import type { Vector3D } from '@/math/vector';
import type { Transform } from './transform';

export type Viewport = {
  width: number;
  height: number;
  x: number;
  y: number;
  normalized: boolean;
};

export class Camera {
  viewport: Viewport;
  transform: Transform = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0, y: 0, z: 0 },
  };

  constructor(viewport: Viewport = { width: 1, height: 1, x: 0, y: 0, normalized: true }) {
    this.viewport = viewport;
  }

  project(v: Vector3D): Vector3D {
    return {
      x: v.x - this.transform.position.x,
      y: v.y - this.transform.position.y,
      z: v.z - this.transform.position.z,
    };
  }
}
