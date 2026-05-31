import type { Renderable } from './renderable';
import { Transform } from './transform';

export class Entity {
  transform = new Transform();
  render: Renderable | null = null;
  visible = true;

  constructor(render: Renderable | null = null) {
    this.render = render;
  }
}
