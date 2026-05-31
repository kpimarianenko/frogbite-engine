import type { Scene } from '@/scene/scene';
import type { RenderCommand } from './render-command';

export class RenderPipeline {
  build(scene: Scene) {
    const entities = scene.query(e => !!e.render && e.visible);

    return entities.map<RenderCommand>(entity => {
      const { transform } = entity;
      const projectedPosition = scene.camera.project(transform.position);
      const renderData = entity.render!;
      const renderTransform = {
        position: projectedPosition,
        rotation: transform.rotation,
        scale: transform.scale,
      };

      switch (renderData.type) {
        case 'sprite': {
          return {
            type: 'sprite',
            transform: renderTransform,
            width: renderData.width,
            height: renderData.height,
            color: renderData.color,
          };
        }
        case 'mesh': {
          return {
            type: 'mesh',
            transform: renderTransform,
            vertices: renderData.vertices,
          };
        }
      }
    });
  }
}
