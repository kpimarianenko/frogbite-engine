export class MeshRenderData {
  type = 'mesh' as const;

  vertices: number[] = [];
  indices: number[] = [];
}
