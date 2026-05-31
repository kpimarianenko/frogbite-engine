export class SpriteRenderData {
  type = 'sprite' as const;
  width = 50;
  height = 50;
  color = '#000'; // TODO: Remove color, add texture
}

export class MeshRenderData {
  type = 'mesh' as const;
  vertices: number[] = [];
  indices: number[] = [];
}

export type Renderable = SpriteRenderData | MeshRenderData;
