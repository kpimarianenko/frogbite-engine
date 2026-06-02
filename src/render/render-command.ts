import type { Viewport } from '@/scene';

type BaseRenderCommand = {
  viewport: Viewport;
  viewMatrix: Float32Array;
  worldMatrix: Float32Array;
};

export type SpriteRenderCommand = BaseRenderCommand & {
  type: 'sprite';
  width: number;
  height: number;
  color: string;
};

export type MeshRenderCommand = BaseRenderCommand & {
  type: 'mesh';
  vertices: number[];
};

export type RenderCommand = SpriteRenderCommand | MeshRenderCommand;
