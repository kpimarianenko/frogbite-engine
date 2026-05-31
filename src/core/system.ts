import type { Scene } from '@/scene/scene';
import type { InputManager } from './input';
import type { Camera } from '@/scene/camera';

export type SystemContext = {
  scene: Scene;
  input: InputManager;
  cameras: Camera[];
  dt: number;
};

export interface System {
  update(context: SystemContext): void;
  tick?(context: SystemContext): void;
}
