import type { Viewport } from '@/scene';

type BaseRenderCommand = {
  viewport: Viewport;
};

export enum RenderCommandType {
  Sprite = 'sprite',
  Mesh = 'mesh',
}

export type SpriteRenderCommand = BaseRenderCommand & {
  type: RenderCommandType.Sprite;
  mvMatrix: Float32Array;
  width: number;
  height: number;
  color: string;
};

export type MeshRenderCommand = BaseRenderCommand & {
  type: RenderCommandType.Mesh;
  mvpMatrix: Float32Array;
  vertices: number[];
};

export type RenderCommand = SpriteRenderCommand | MeshRenderCommand;
