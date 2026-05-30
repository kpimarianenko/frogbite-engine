export class Time {
  deltaTime = 0;
  elapsedTime = 0;

  update(delta: number) {
    this.deltaTime = delta;
    this.elapsedTime += delta;
  }
}
