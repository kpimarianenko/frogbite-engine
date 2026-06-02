import type { Vector3D } from './vector';

/* eslint-disable @typescript-eslint/no-magic-numbers */
export class Matrix4x4 {
  static readonly SIZE = 16;
  static readonly DIM = 4;
  data: Float32Array;

  constructor(data?: Float32Array) {
    // prettier-ignore
    this.data = data ?? new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  static identity() {
    return new Matrix4x4();
  }

  // TODO: add "out" parameter to avoid allocations in hot path
  static multiply(matA: Matrix4x4, matB: Matrix4x4): Matrix4x4 {
    const result = new Float32Array(Matrix4x4.SIZE);
    const a = matA.data;
    const b = matB.data;

    for (let col = 0; col < Matrix4x4.DIM; col++) {
      for (let row = 0; row < Matrix4x4.DIM; row++) {
        result[col * Matrix4x4.DIM + row] =
          a[0 * Matrix4x4.DIM + row] * b[col * Matrix4x4.DIM + 0] +
          a[1 * Matrix4x4.DIM + row] * b[col * Matrix4x4.DIM + 1] +
          a[2 * Matrix4x4.DIM + row] * b[col * Matrix4x4.DIM + 2] +
          a[3 * Matrix4x4.DIM + row] * b[col * Matrix4x4.DIM + 3];
      }
    }

    return new Matrix4x4(result);
  }

  static translation(x: number, y: number, z: number): Matrix4x4 {
    const m = Matrix4x4.identity();

    m.data[12] = x;
    m.data[13] = y;
    m.data[14] = z;
    return m;
  }

  static rotationZ(angle: number): Matrix4x4 {
    const m = Matrix4x4.identity();
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    m.data[0] = c;
    m.data[4] = -s;
    m.data[1] = s;
    m.data[5] = c;
    return m;
  }

  static rotationX(angle: number): Matrix4x4 {
    const m = Matrix4x4.identity();
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    m.data[5] = c;
    m.data[9] = -s;
    m.data[6] = s;
    m.data[10] = c;
    return m;
  }

  static rotationY(angle: number): Matrix4x4 {
    const m = Matrix4x4.identity();
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    m.data[0] = c;
    m.data[8] = s;
    m.data[2] = -s;
    m.data[10] = c;
    return m;
  }

  static scale(x: number, y: number, z: number): Matrix4x4 {
    const m = Matrix4x4.identity();

    m.data[0] = x;
    m.data[5] = y;
    m.data[10] = z;
    return m;
  }

  // TODO: add "out" parameter to avoid allocations in hot path
  static trs(translation: Vector3D, rotation: Vector3D, scale: Vector3D): Matrix4x4 {
    const t = Matrix4x4.translation(translation.x, translation.y, translation.z);
    const r = Matrix4x4.multiply(
      Matrix4x4.rotationZ(rotation.z),
      Matrix4x4.multiply(Matrix4x4.rotationY(rotation.y), Matrix4x4.rotationX(rotation.x))
    );
    const s = Matrix4x4.scale(scale.x, scale.y, scale.z);

    return Matrix4x4.multiply(t, Matrix4x4.multiply(r, s));
  }

  static orthographic(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Matrix4x4 {
    const m = Matrix4x4.identity();

    m.data[0] = 2 / (right - left);
    m.data[5] = 2 / (top - bottom);
    m.data[10] = -2 / (far - near);
    m.data[12] = -(right + left) / (right - left);
    m.data[13] = -(top + bottom) / (top - bottom);
    m.data[14] = -(far + near) / (far - near);

    return m;
  }
}
/* eslint-enable @typescript-eslint/no-magic-numbers */
