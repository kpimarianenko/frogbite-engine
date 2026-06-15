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
  const camera = new OrthographicCamera();
  const player = new Entity();
  const tile = new Entity();

  player.addComponent(new SpriteComponent({ width: 1.6, height: 1.6, texture: 'player' }));
  player.addComponent(
    new RigidBodyComponent({
      shape: {
        type: ShapeType.Box,
        width: 1.6,
        height: 1.6,
        depth: 0,
      },
    })
  );
  player.setPosition(0, -1, 0);

  tile.addComponent(new SpriteComponent({ width: 1, height: 1, texture: 'tile' }));
  tile.addComponent(
    new RigidBodyComponent({
      isStatic: true,
      shape: {
        type: ShapeType.Box,
        width: 1,
        height: 1,
        depth: 0,
      },
    })
  );
  tile.setPosition(0, 1, 0);

  scene.addEntity(player);
  scene.addEntity(tile);
  scene.addCamera(camera);
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
