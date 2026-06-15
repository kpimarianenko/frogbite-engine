import { half } from '@/math';
import type { Actor } from './physics-engine';
import { ShapeType } from './shapes';

export type AABB = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export const getAABB = (actor: Actor): AABB => {
  if (actor.body.shape.type !== ShapeType.Box) {
    throw new Error(`Cannot retrieve AABB for shape type ${actor.body.shape.type}`);
  }

  const { x, y } = actor.entity.worldMatrix.getTranslation();
  const hw = half(actor.body.shape.width);
  const hh = half(actor.body.shape.height);

  return {
    minX: x - hw,
    minY: y - hh,
    maxX: x + hw,
    maxY: y + hh,
  };
};

export const aabbIntersects = (a: AABB, b: AABB): boolean =>
  a.minX < b.maxX && a.maxX > b.minX && a.minY < b.maxY && a.maxY > b.minY;
