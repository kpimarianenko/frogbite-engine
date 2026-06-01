import type { Scene } from '@/scene/scene';
import type { RenderCommand } from './render-command';
import type { Camera } from '@/scene/camera';

export class RenderPipeline {
  build(scene: Scene, camera: Camera) {
    const entities = scene.query(e => !!e.render && e.visible);

    return entities.map<RenderCommand>(entity => {
      const { transform } = entity;
      const projectedPosition = camera.project(transform.position);
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
