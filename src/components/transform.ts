import type { Vector3D } from '@/math';
import { Component } from './component';

export type TransformComponentOptions = {
  position?: Vector3D;
  rotation?: Vector3D;
  scale?: Vector3D;
};

export class TransformComponent extends Component {
  position: Vector3D;
  rotation: Vector3D;
  scale: Vector3D;

  constructor(options: TransformComponentOptions = {}) {
    super();
    const {
      position = { x: 0, y: 0, z: 0 },
      rotation = { x: 0, y: 0, z: 0 },
      scale = { x: 1, y: 1, z: 1 },
    } = options;

    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }
}
