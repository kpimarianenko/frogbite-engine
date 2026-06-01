import type { Camera, Scene } from '@/scene';
import type { RenderCommand } from './render-command';

export class RenderPipeline {
  build(scene: Scene, camera: Camera) {
    const entities = scene.query(e => !!e.render && e.visible);

    return entities.map<RenderCommand>(entity => {
      const { transform } = entity;
      const projectedPosition = camera.project(transform.position);
      const render = entity.render!;
      const renderTransform = {
        position: projectedPosition,
        rotation: transform.rotation,
        scale: transform.scale,
      };

      switch (render.type) {
        case 'sprite': {
          return {
            type: 'sprite',
            viewport: camera.viewport,
            transform: renderTransform,
            width: render.width,
            height: render.height,
            color: render.color,
          };
        }
        case 'mesh': {
          return {
            type: 'mesh',
            viewport: camera.viewport,
            transform: renderTransform,
            vertices: render.vertices,
          };
        }
      }
    });
  }
}
