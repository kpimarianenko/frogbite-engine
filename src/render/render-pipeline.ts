import { MeshComponent, SpriteComponent } from '@/components';
import { Matrix4x4 } from '@/math';
import type { Camera, Scene } from '@/scene';
import { type RenderCommand, RenderCommandType } from './render-command';

export class RenderPipeline {
  build(scene: Scene, camera: Camera) {
    const commands: RenderCommand[] = [];
    const viewMat = new Matrix4x4(camera.getViewMatrix());
    const projMat = new Matrix4x4(camera.getProjectionMatrix());

    for (const entity of scene.query(SpriteComponent)) {
      const sprite = entity.getComponent(SpriteComponent)!;
      const mv = Matrix4x4.multiply(viewMat, entity.worldMatrix);

      commands.push({
        type: RenderCommandType.Sprite,
        viewport: camera.viewport,
        mvMatrix: mv.data,
        width: sprite.width,
        height: sprite.height,
        color: sprite.color,
        texture: sprite.texture,
      });
    }

    for (const entity of scene.query(MeshComponent)) {
      const mesh = entity.getComponent(MeshComponent)!;
      const mv = Matrix4x4.multiply(viewMat, entity.worldMatrix);
      const mvp = Matrix4x4.multiply(projMat, mv);

      commands.push({
        type: RenderCommandType.Mesh,
        viewport: camera.viewport,
        mvpMatrix: mvp.data,
        vertices: mesh.vertices,
      });
    }

    return commands;
  }
}
