import { MILLIS_IN_SECOND } from '@/constants/time';
import type { Renderer } from '@/render/renderer';
import type { Scene } from '@/scene/scene';
import type { InputManager } from './input';
import type { System } from './system';
import { Time } from './time';
import { EventBus } from './events';

export class Engine {
  private lastTime = 0;
  private tickAccumulator = 0;

  private readonly TICK_RATE = 60;
  private readonly TICK_TIME_STEP = 1 / this.TICK_RATE;

  time = new Time();
  events = new EventBus();
  renderer: Renderer;
  scene: Scene;
  input: InputManager;
  systems: System[] = [];

  constructor(renderer: Renderer, initialScene: Scene, input: InputManager) {
    this.renderer = renderer;
    this.scene = initialScene;
    this.scene.onEnter?.();
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
      system.update(this.scene, dt, this.input);
    }

    this.input.update();
  }

  tick(dt: number) {
    for (const system of this.systems) {
      system.tick?.(this.scene, dt, this.input);
    }
  }

  render() {
    this.renderer.render(this.scene);
  }

  setScene(scene: Scene) {
    this.scene.onExit?.();
    this.scene = scene;
    this.scene.onEnter?.();
  }

  addSystem(system: System) {
    this.systems.push(system);
  }
}
