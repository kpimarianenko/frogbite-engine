import type { Vector3D } from '@/math';
import type { Viewport } from './viewport';

export interface BaseCamera {
  readonly id: string;
  viewport: Viewport;
  getPosition(): Readonly<Vector3D>;
  setPosition(x: number, y: number, z: number): void;
  getProjectionMatrix(): Float32Array;
  getViewMatrix(): Float32Array;
}
