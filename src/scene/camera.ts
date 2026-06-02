import { half, Matrix4x4, type Vector3D } from '@/math';

export type Viewport = {
  width: number;
  height: number;
  x: number;
  y: number;
  normalized: boolean;
};

export enum CameraType {
  Orthographic = 'orthographic',
  Perspective = 'perspective',
}

interface BaseCamera {
  viewport: Viewport;
  getPosition(): Readonly<Vector3D>;
  setPosition(x: number, y: number, z: number): void;
  getProjectionMatrix(): Float32Array;
  getViewMatrix(): Float32Array;
}

export class OrthographicCamera implements BaseCamera {
  viewport: Viewport;
  readonly type = CameraType.Orthographic as const;

  private position: Vector3D = { x: 0, y: 0, z: 0 };
  private rotation: number = 0;
  private zoom: number = 1;

  private viewMatrix: Float32Array | null = null;
  private projectionMatrix: Float32Array | null = null;

  constructor(viewport: Viewport) {
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
      const t = Matrix4x4.translation(-this.position.x, -this.position.y, -this.position.z);
      const r = Matrix4x4.rotationZ(-this.rotation);
      const s = Matrix4x4.scale(this.zoom, this.zoom, this.zoom);

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

// TODO: Implement perspective camera
export class PerspectiveCamera implements BaseCamera {
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

export type Camera = OrthographicCamera | PerspectiveCamera;
