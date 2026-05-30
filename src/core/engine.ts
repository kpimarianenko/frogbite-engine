import { MILLIS_IN_SECOND } from '@/constants/time';
import { Time } from './time';
import { EventBus } from './events';

export class Engine {
  private lastTime = 0;
  private tickAccumulator = 0;

  private readonly TICK_RATE = 60;
  private readonly TICK_TIME_STEP = 1 / this.TICK_RATE;

  time = new Time();
  events = new EventBus();

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(dt: number) {
    // TODO
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tick(dt: number) {
    // TODO
  }

  render() {
    // TODO
  }
}
