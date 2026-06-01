import { MILLIS_IN_SECOND } from '@/constants/time';
import type { Renderer } from '@/render/renderer';
import { RenderPipeline } from '@/render/render-pipeline';
import type { InputManager } from './input';
import type { System } from './system';
import { Time } from './time';
import { EventBus } from './events';
import type { Scene } from '@/scene/scene';

export class Engine {
  private lastTime = 0;
  private tickAccumulator = 0;

  private readonly TICK_RATE = 60;
  private readonly TICK_TIME_STEP = 1 / this.TICK_RATE;

  time = new Time();
  events = new EventBus();
  renderPipeline = new RenderPipeline();
  renderer: Renderer;
  scenes: Scene[] = [];
  input: InputManager;
  systems: System[] = [];

  constructor(renderer: Renderer, input: InputManager) {
    this.renderer = renderer;
    this.input = input;
  }

  start() {
    requestAnimationFrame(this.loop);
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

  update(dt: number) {
    for (const system of this.systems) {
      for (const scene of this.scenes) {
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
    for (const system of this.systems) {
      for (const scene of this.scenes) {
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
      for (const camera of scene.cameras) {
        this.renderer.render(this.renderPipeline.build(scene, camera));
      }
    }
  }

  addScene(scene: Scene) {
    this.scenes.push(scene);
  }

  addSystem(system: System) {
    this.systems.push(system);
  }
}
