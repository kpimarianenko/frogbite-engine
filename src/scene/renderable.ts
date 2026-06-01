export class SpriteRenderData {
  type = 'sprite' as const;
  width: number;
  height: number;
  color: string; // TODO: Remove color, add texture

  constructor(attrs: { width?: number; height?: number; color?: string } = {}) {
    const { width = 50, height = 50, color = '#000' } = attrs;

    this.width = width;
    this.height = height;
    this.color = color;
  }
}

export class MeshRenderData {
  type = 'mesh' as const;
  vertices: number[] = [];
  indices: number[] = [];
}

export type Renderable = SpriteRenderData | MeshRenderData;
