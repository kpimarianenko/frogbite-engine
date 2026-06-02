import { Matrix4x4 } from '@/math';
import type { Camera, Scene } from '@/scene';
import type { RenderCommand } from './render-command';

export class RenderPipeline {
  build(scene: Scene, camera: Camera) {
    const entities = scene.query(e => !!e.render && e.visible);
    const view = camera.getViewMatrix();
    const projection = camera.getProjectionMatrix();

    const viewMat = new Matrix4x4(view);
    const projectionMat = new Matrix4x4(projection);

    return entities.map<RenderCommand>(entity => {
      const render = entity.render!;
      const mv = Matrix4x4.multiply(viewMat, entity.worldMatrix);
      const mvp = Matrix4x4.multiply(projectionMat, mv);

      switch (render.type) {
        case 'sprite': {
          return {
            type: 'sprite',
            viewport: camera.viewport,
            viewMatrix: mv.data,
            worldMatrix: mvp.data,
            width: render.width,
            height: render.height,
            color: render.color,
          };
        }
        case 'mesh': {
          return {
            type: 'mesh',
            viewport: camera.viewport,
            viewMatrix: mv.data,
            worldMatrix: mvp.data,
            vertices: render.vertices,
          };
        }
      }
    });
  }
}
