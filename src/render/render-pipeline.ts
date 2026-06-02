import { SpriteComponent } from '@/components';
import { Matrix4x4 } from '@/math';
import type { Camera, Scene } from '@/scene';
import type { RenderCommand } from './render-command';

export class RenderPipeline {
  build(scene: Scene, camera: Camera) {
    const entities = scene.query(SpriteComponent);
    const view = camera.getViewMatrix();
    const projection = camera.getProjectionMatrix();

    const viewMat = new Matrix4x4(view);
    const projectionMat = new Matrix4x4(projection);

    return entities.map<RenderCommand>(entity => {
      const sprite = entity.getComponent(SpriteComponent)!;
      const mv = Matrix4x4.multiply(viewMat, entity.worldMatrix);
      const mvp = Matrix4x4.multiply(projectionMat, mv);

      return {
        type: 'sprite',
        viewport: camera.viewport,
        viewMatrix: mv.data,
        worldMatrix: mvp.data,
        width: sprite.width,
        height: sprite.height,
        color: sprite.color,
      };

      // case 'mesh': {
      //   return {
      //     type: 'mesh',
      //     viewport: camera.viewport,
      //     viewMatrix: mv.data,
      //     worldMatrix: mvp.data,
      //     vertices: render.vertices,
      //   };
      // }
    });
  }
}
