import type { RenderComponent } from '@/components';

export class Entity {
  transform = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  };

  render: RenderComponent | null = null;
  visible = true;

  constructor(render: RenderComponent | null = null) {
    this.render = render;
  }
}
