import { RigidBodyComponent, SpriteComponent } from '@/components';
import { MILLIS_IN_SECOND } from '@/constants/time';
import type { PhysicsEngine } from '@/physics';
import { RenderPipeline } from '@/render';
import type { Renderer } from '@/render';
import type { Scene } from '@/scene';
import type { AssetManager } from './assets';
import { AudioManager } from './audio';
import { EventBus } from './events';
import { InputManager } from './input';
import { Time } from './time';

export class FrogbiteEngine {
  time = new Time();
  events = new EventBus();
  input = new InputManager();
  audio = new AudioManager();
  renderPipeline = new RenderPipeline();
  renderer: Renderer;
  scenes: Scene[] = [];
  assets: AssetManager;
  physics: PhysicsEngine | null;

  private lastTime = 0;
  private tickAccumulator = 0;

  private readonly TICK_RATE = 60;
  private readonly TICK_TIME_STEP = 1 / this.TICK_RATE;
  private readonly MAX_DT = 0.1;

  constructor(renderer: Renderer, assets: AssetManager, physics: PhysicsEngine | null = null) {
    this.renderer = renderer;
    this.assets = assets;
    this.physics = physics;
  }

  start() {
    requestAnimationFrame(t => {
      this.lastTime = t;
      requestAnimationFrame(this.loop);
    });
  }

  update(dt: number) {
    for (const scene of this.scenes) {
      for (const system of scene.systems) {
        system.update({
          scene,
          input: this.input,
          assets: this.assets,
          audio: this.audio,
          dt,
        });
      }
    }

    this.input.update();
  }

  tick(dt: number) {
    for (const scene of this.scenes) {
      const bodies = scene.query(RigidBodyComponent);

      this.physics?.step(bodies, dt);

      for (const system of scene.systems) {
        system.tick?.({
          scene,
          input: this.input,
          assets: this.assets,
          audio: this.audio,
          dt,
        });
      }
    }
  }

  render() {
    this.renderer.clear();

    for (const scene of this.scenes) {
      for (const camera of scene.cameras) {
        this.renderer.render(this.renderPipeline.build(scene, camera));
      }
    }
  }

  addScene(scene: Scene) {
    this.scenes.push(scene);
  }

  private loop = (t: number) => {
    const dt = Math.min((t - this.lastTime) / MILLIS_IN_SECOND, this.MAX_DT);

    this.lastTime = t;
    this.tickAccumulator += dt;
    this.time.update(dt);

    while (this.tickAccumulator >= this.TICK_TIME_STEP) {
      this.tick(this.TICK_TIME_STEP);
      this.tickAccumulator -= this.TICK_TIME_STEP;
    }

    this.update(dt);
    this.updateAnimations(dt);

    for (const scene of this.scenes) {
      scene.flushRemovals();
    }

    this.render();
    requestAnimationFrame(this.loop);
  };

  private updateAnimations(dt: number) {
    for (const scene of this.scenes) {
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
}
