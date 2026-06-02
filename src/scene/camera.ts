import { Matrix4x4, type Vector3D } from '@/math';

export type Viewport = {
  width: number;
  height: number;
  x: number;
  y: number;
  normalized: boolean;
};

export interface Camera {
  viewport: Viewport;
  getPosition(): Readonly<Vector3D>;
  setPosition(x: number, y: number, z: number): void;
  getProjectionMatrix(): Float32Array;
  getViewMatrix(): Float32Array;
}

export class OrthographicCamera implements Camera {
  zoom: number = 1;
  viewport: Viewport;
  private position: Vector3D = { x: 0, y: 0, z: 0 };
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

  getViewMatrix() {
    if (!this.viewMatrix) {
      this.viewMatrix = Matrix4x4.translation(
        -this.position.x,
        -this.position.y,
        -this.position.z
      ).data;
    }

    return this.viewMatrix;
  }

  getProjectionMatrix() {
    if (!this.projectionMatrix) {
      const { width, height } = this.viewport;

      this.projectionMatrix = Matrix4x4.orthographic(0, width, height, 0, -1, 1).data;
    }

    return this.projectionMatrix;
  }
}
