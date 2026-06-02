export enum ShapeType {
  Box = 'box',
  Sphere = 'sphere',
  Capsule = 'capsule',
}

export type BoxShape = {
  type: ShapeType.Box;
  width: number;
  height: number;
  depth: number;
};

export type SphereShape = {
  type: ShapeType.Sphere;
  radius: number;
};

export type CapsuleShape = {
  type: ShapeType.Capsule;
  height: number;
  radius: number;
};

export type PhysicsShape = BoxShape | SphereShape | CapsuleShape;
