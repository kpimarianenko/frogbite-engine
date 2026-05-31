import type { Transform } from '@/scene/transform';

export type SpriteRenderCommand = {
  type: 'sprite';
  transform: Transform;
  width: number;
  height: number;
  color: string;
};

export type MeshRenderCommand = {
  type: 'mesh';
  transform: Transform;
  vertices: number[];
};

export type RenderCommand = SpriteRenderCommand | MeshRenderCommand;
