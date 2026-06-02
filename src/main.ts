import './reset.css';
import { SpriteComponent } from '@/components';
import { Engine } from '@/core/engine';
import { InputManager } from '@/core/input';
import type { System, SystemContext } from '@/core/system';
import { CanvasRenderer, handleRendererResize } from '@/render';
import { Entity, OrthographicCamera, Scene } from '@/scene';
import { AssetManager } from './core/asset-manager';
import { half } from './math';

class MovementSystem implements System {
  readonly id: string = crypto.randomUUID();
  private v = 500;

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
  const entity = new Entity();

  entity.addComponent(new SpriteComponent({ width: 160, height: 160, texture: 'player' }));
  entity.setPosition(half(window.innerWidth), half(window.innerHeight), 0);
  scene.addEntity(entity);
  scene.addCamera(camera);
  scene.addSystem(new MovementSystem());

  const engine = new Engine(renderer, input);

  handleRendererResize(renderer, () => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));

  engine.addScene(scene);
  engine.start();
};

// eslint-disable-next-line no-console
main().catch(console.error);
