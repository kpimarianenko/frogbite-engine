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
  viewMatrix: Float32Array;
  width: number;
  height: number;
  color: string;
};

export type MeshRenderCommand = BaseRenderCommand & {
  type: RenderCommandType.Mesh;
  worldMatrix: Float32Array; // TODO: Rename?
  vertices: number[];
};

export type RenderCommand = SpriteRenderCommand | MeshRenderCommand;
