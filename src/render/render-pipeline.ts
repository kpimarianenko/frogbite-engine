import type { Camera, Scene } from '@/scene';
import type { RenderCommand } from './render-command';

export class RenderPipeline {
  build(scene: Scene, camera: Camera) {
    const entities = scene.query(e => !!e.renderData && e.visible);

    return entities.map<RenderCommand>(entity => {
      const { transform } = entity;
      const projectedPosition = camera.project(transform.position);
      const renderData = entity.renderData!;
      const renderTransform = {
        position: projectedPosition,
        rotation: transform.rotation,
        scale: transform.scale,
      };

      switch (renderData.type) {
        case 'sprite': {
          return {
            type: 'sprite',
            viewport: camera.viewport,
            transform: renderTransform,
            width: renderData.width,
            height: renderData.height,
            color: renderData.color,
          };
        }
        case 'mesh': {
          return {
            type: 'mesh',
            viewport: camera.viewport,
            transform: renderTransform,
            vertices: renderData.vertices,
          };
        }
      }
    });
  }
}
