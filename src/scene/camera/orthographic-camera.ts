import { half, Matrix4x4, type Vector3D } from '@/math';
import type { BaseCamera } from './base-camera';
import { CameraType } from './camera-type';
import type { Viewport } from './viewport';

export class OrthographicCamera implements BaseCamera {
  readonly id: string = crypto.randomUUID();
  viewport: Viewport;
  readonly type = CameraType.Orthographic as const;

  private position: Vector3D = { x: 0, y: 0, z: 0 };
  private rotation = 0;
  private zoom = 1;
  private pixelsPerUnit = 100; // TODO: Should probably be calculated based on screen dimensions

  private viewMatrix: Float32Array | null = null;
  private projectionMatrix: Float32Array | null = null;

  constructor(viewport: Viewport = { x: 0, y: 0, width: 1, height: 1, normalized: true }) {
    this.viewport = viewport;
  }

  getPosition() {
    return this.position;
  }

  setPosition(x: number, y: number, z: number) {
    this.position = { x, y, z };
    this.viewMatrix = null;
  }

  getZoom() {
    return this.zoom;
  }

  setZoom(zoom: number) {
    this.zoom = zoom;
    this.projectionMatrix = null;
  }

  getRotation() {
    return this.rotation;
  }

  setRotation(angle: number) {
    this.rotation = angle;
    this.viewMatrix = null;
  }

  getViewMatrix() {
    if (!this.viewMatrix) {
      const scale = this.pixelsPerUnit * this.zoom;
      const t = Matrix4x4.translation(-this.position.x, -this.position.y, -this.position.z);
      const r = Matrix4x4.rotationZ(-this.rotation);
      const s = Matrix4x4.scale(scale, scale, 1);

      this.viewMatrix = Matrix4x4.multiply(s, Matrix4x4.multiply(r, t)).data;
    }

    return this.viewMatrix;
  }

  getProjectionMatrix() {
    if (!this.projectionMatrix) {
      const { width, height } = this.viewport;
      const hw = half(width) / this.zoom;
      const hh = half(height) / this.zoom;

      this.projectionMatrix = Matrix4x4.orthographic(-hw, hw, hh, -hh, -1, 1).data;
    }

    return this.projectionMatrix;
  }
}
