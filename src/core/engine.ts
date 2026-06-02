import { MILLIS_IN_SECOND } from '@/constants/time';
import type { PhysicsEngine } from '@/physics';
import { RenderPipeline } from '@/render';
import type { Renderer } from '@/render';
import type { Scene } from '@/scene';
import { EventBus } from './events';
import type { InputManager } from './input';
import { Time } from './time';

export class FrogbiteEngine {
  time = new Time();
  events = new EventBus();
  renderPipeline = new RenderPipeline();
  renderer: Renderer;
  scenes: Scene[] = [];
  input: InputManager;
  physics: PhysicsEngine;

  private lastTime = 0;
  private tickAccumulator = 0;

  private readonly TICK_RATE = 60;
  private readonly TICK_TIME_STEP = 1 / this.TICK_RATE;

  constructor(renderer: Renderer, input: InputManager, physics: PhysicsEngine) {
    this.renderer = renderer;
    this.input = input;
    this.physics = physics;
  }

  start() {
    requestAnimationFrame(this.loop);
  }

  update(dt: number) {
    for (const scene of this.scenes) {
      for (const system of scene.systems) {
        system.update({
          scene,
          input: this.input,
          dt,
        });
      }
    }

    this.input.update();
  }

  tick(dt: number) {
    this.physics?.step(dt);

    for (const scene of this.scenes) {
      for (const system of scene.systems) {
        system.tick?.({
          scene,
          input: this.input,
          dt,
        });
      }
    }
  }

  render() {
    this.renderer.clear();

    for (const scene of this.scenes) {
      scene.update();

      for (const camera of scene.cameras) {
        this.renderer.render(this.renderPipeline.build(scene, camera));
      }
    }
  }

  addScene(scene: Scene) {
    this.scenes.push(scene);
  }

  private loop = (t: number) => {
    const dt = (t - this.lastTime) / MILLIS_IN_SECOND;

    this.lastTime = t;
    this.tickAccumulator += dt;
    this.time.update(dt);

    while (this.tickAccumulator >= this.TICK_TIME_STEP) {
      this.tick(this.TICK_TIME_STEP);
      this.tickAccumulator -= this.TICK_TIME_STEP;
    }

    this.update(dt);
    this.render();
    requestAnimationFrame(this.loop);
  };
}
