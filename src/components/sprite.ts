import type { SpriteAnimation, SpriteAnimationState } from '@/core/animation';
import { Component } from './component';

export type SpriteAnimationConfig = SpriteAnimationState & {
  sequences: Record<string, SpriteAnimation>;
  frameWidth: number;
  frameHeight: number;
};

export type SpriteComponentOptions = {
  width?: number;
  height?: number;
  color?: string;
  texture?: string;
  repeat?: {
    width: number;
    height: number;
  };
  animation?: {
    sequences: Record<string, SpriteAnimation>;
    frameWidth: number;
    frameHeight: number;
    current?: string | null;
    autoplay?: boolean;
  };
};

export class SpriteComponent extends Component {
  width: number;
  height: number;
  color: string;
  texture: string | null;
  repeat: null | {
    width: number;
    height: number;
  };
  animation: SpriteAnimationConfig | null;

  constructor(options: SpriteComponentOptions = {}) {
    super();
    const {
      width = 50,
      height = 50,
      color = '#444',
      texture = null,
      repeat = null,
      animation = null,
    } = options;

    this.width = width;
    this.height = height;
    this.color = color;
    this.texture = texture;
    this.repeat = repeat;
    this.animation = animation && {
      sequences: animation.sequences,
      frameWidth: animation.frameWidth,
      frameHeight: animation.frameHeight,
      current: animation.current ?? null,
      playing: animation.autoplay ?? true,
      frame: 0,
      elapsed: 0,
    };
  }

  get currentAnimation(): SpriteAnimation | null {
    if (!this.animation?.current) {
      return null;
    }

    return this.animation.sequences[this.animation.current] ?? null;
  }
}
