import type { Renderable } from './renderable';

export class Entity {
  transform = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0, y: 0, z: 0 },
  };

  render: Renderable | null = null;
  visible = true;

  constructor(render: Renderable | null = null) {
    this.render = render;
  }
}
