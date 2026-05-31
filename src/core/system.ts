import type { Scene } from '@/scene/scene';
import type { InputManager } from './input';

export interface System {
  update(scene: Scene, dt: number, input: InputManager): void;
  tick?(scene: Scene, dt: number, input: InputManager): void;
}
