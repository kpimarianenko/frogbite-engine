import type { RenderData } from '@/components';

export class Entity {
  transform = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  };

  renderData: RenderData | null = null;
  visible = true;

  constructor(renderData: RenderData | null = null) {
    this.renderData = renderData;
  }
}
