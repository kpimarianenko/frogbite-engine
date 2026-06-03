import './reset.css';
import { RigidBodyComponent, SpriteComponent } from '@/components';
import { FrogbiteEngine } from '@/core/engine';
import { InputManager } from '@/core/input';
import type { System, SystemContext } from '@/core/system';
import { CanvasRenderer, handleRendererResize } from '@/render';
import { Entity, OrthographicCamera, Scene } from '@/scene';
import { AssetManager } from './core/asset-manager';
import { FrogbitePhysicsEngine, ShapeType } from './physics';

class MovementSystem implements System {
  readonly id: string = crypto.randomUUID();
  private v = 5;

  update({ scene, input, dt }: SystemContext): void {
    for (const entity of scene.entities) {
      if (input.isDown('KeyW')) {
        entity.translate(0, -this.v * dt, 0);
      }

      if (input.isDown('KeyS')) {
        entity.translate(0, this.v * dt, 0);
      }

      if (input.isDown('KeyA')) {
        entity.translate(-this.v * dt, 0, 0);
      }

      if (input.isDown('KeyD')) {
        entity.translate(this.v * dt, 0, 0);
      }
    }
  }
}

const main = async () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const input = new InputManager();
  const assets = new AssetManager();
  const renderer = new CanvasRenderer(canvas, assets);

  await assets.loadAll({
    player: '/assets/player.png',
    tile: '/assets/tile.png',
  });

  const scene = new Scene();
  const cameraA = new OrthographicCamera({
    x: 0,
    y: 0,
    width: 0.5,
    height: 1,
    normalized: true,
  });
  const cameraB = new OrthographicCamera({
    x: 0.5,
    y: 0,
    width: 0.5,
    height: 1,
    normalized: true,
  });
  const entity = new Entity();

  entity.addComponent(new SpriteComponent({ width: 1.6, height: 1.6, texture: 'player' }));
  entity.addComponent(
    new RigidBodyComponent({
      shape: {
        type: ShapeType.Box,
        width: 1.6,
        height: 1.6,
        depth: 0,
      },
    })
  );
  scene.addEntity(entity);
  scene.addCamera(cameraA);
  scene.addCamera(cameraB);
  scene.addSystem(new MovementSystem());

  const physics = new FrogbitePhysicsEngine();
  const engine = new FrogbiteEngine(renderer, input, physics);

  handleRendererResize(renderer, () => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));

  engine.addScene(scene);
  engine.start();
};

// eslint-disable-next-line no-console
main().catch(console.error);
