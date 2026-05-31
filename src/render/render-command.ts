export type SpriteRenderCommand = {
  type: 'sprite';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export type MeshRenderCommand = {
  type: 'mesh';
  x: number;
  y: number;
  z: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  vertices: number[];
};

export type RenderCommand = SpriteRenderCommand | MeshRenderCommand;
