import { Vector3D } from '@/math/vector';
import { Transform } from './transform';

export class Camera {
  transform = new Transform();

  project(v: Vector3D): Vector3D {
    return new Vector3D(
      v.x - this.transform.position.x,
      v.y - this.transform.position.y,
      v.z - this.transform.position.z
    );
  }
}
