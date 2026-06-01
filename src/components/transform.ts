import type { Vector3D } from '@/math';

export type Transform = {
  position: Vector3D;
  rotation: Vector3D;
  scale: Vector3D;
};

export const defaultTransform = (): Transform => ({
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
});
