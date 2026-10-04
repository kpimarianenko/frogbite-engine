import type { BaseCamera } from './base-camera';
import { CameraType } from './camera-type';
import type { Viewport } from './viewport';

// TODO: Implement perspective camera
export class PerspectiveCamera implements BaseCamera {
  readonly id: string = crypto.randomUUID();
  viewport: Viewport;
  readonly type = CameraType.Perspective as const;

  constructor(viewport: Viewport) {
    this.viewport = viewport;
  }

  getPosition() {
    return { x: 0, y: 0, z: 0 };
  }

  setPosition() {}

  getProjectionMatrix() {
    return new Float32Array(0);
  }

  getViewMatrix() {
    return new Float32Array(0);
  }
}
