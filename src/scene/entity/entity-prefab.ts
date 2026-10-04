import type {
  RigidBodyComponentOptions,
  SpriteComponentOptions,
  TransformComponentOptions,
} from '@/components';

export type EntityPrefab = TransformComponentOptions & {
  sprite?: SpriteComponentOptions;
  rigidBody?: RigidBodyComponentOptions;
  children?: EntityPrefab[];
};
