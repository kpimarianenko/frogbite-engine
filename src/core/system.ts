import type { Scene } from '@/scene';
import type { AssetManager } from './assets';
import type { AudioManager } from './audio';
import type { InputManager } from './input';

export type SystemContext = {
  scene: Scene;
  input: InputManager;
  assets: AssetManager;
  audio: AudioManager;
  dt: number;
};

export interface System {
  update(context: SystemContext): void;
  tick?(context: SystemContext): void;
}
