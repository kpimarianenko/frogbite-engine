import { Vector3D } from '@/math/vector';

export class Transform {
  position;
  rotation;
  scale;

  constructor(position = new Vector3D(), rotation = new Vector3D(), scale = new Vector3D(1, 1, 1)) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }
}
