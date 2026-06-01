import type { Scene } from '@/scene';
import type { InputManager } from './input';

export type SystemContext = {
  scene: Scene;
  input: InputManager;
  dt: number;
};

export interface System {
  update(context: SystemContext): void;
  tick?(context: SystemContext): void;
}
