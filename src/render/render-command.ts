import type { Transform } from '@/components/transform';
import type { Viewport } from '@/scene';

export type SpriteRenderCommand = {
  type: 'sprite';
  viewport: Viewport;
  transform: Transform;
  width: number;
  height: number;
  color: string;
};

export type MeshRenderCommand = {
  type: 'mesh';
  viewport: Viewport;
  transform: Transform;
  vertices: number[];
};

export type RenderCommand = SpriteRenderCommand | MeshRenderCommand;
