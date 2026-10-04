import { SpriteComponent } from '@/components';
import type { Scene } from '@/scene';

export class AnimationManager {
  update(scene: Scene, dt: number): void {
    for (const entity of scene.query(SpriteComponent)) {
      const sprite = entity.getComponent(SpriteComponent)!;

      if (!sprite.animation || !sprite.currentAnimation) {
        continue;
      }

      const animation = sprite.currentAnimation;

      if (!animation || !animation.frameCount) {
        continue;
      }

      sprite.animation.elapsed += dt;
      const frameDuration = 1 / animation.fps;

      while (sprite.animation.elapsed >= frameDuration) {
        sprite.animation.elapsed -= frameDuration;
        sprite.animation.frame++;

        if (sprite.animation.frame >= animation.frameCount) {
          if (animation.loop) {
            sprite.animation.frame = 0;
          } else {
            sprite.animation.frame = animation.frameCount - 1;
            sprite.animation.playing = false;
            break;
          }
        }
      }
    }
  }
}
