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
    hat: '/assets/hat.png',
    box: '/assets/box.png',
    grass: '/assets/grass.png',
    walk: '/assets/walk.png',
  });

  const scene = new Scene();
  const camera = new OrthographicCamera();
  const lightBox = new Entity();
  const heavyBox = new Entity();
  const floor = new Entity();

  floor.addComponent(new SpriteComponent({ width: 20, height: 1, texture: 'grass' }));
  floor.addComponent(
    new RigidBodyComponent({
      isStatic: true,
      restitution: 0.8,
      shape: {
        type: ShapeType.Box,
        width: 100,
        height: 1,
        depth: 0,
      },
    })
  );
  floor.setPosition(0, 1, 0);

  lightBox.addComponent(new SpriteComponent({ width: 1, height: 1, texture: 'box' }));
  lightBox.addComponent(
    new RigidBodyComponent({
      mass: 1,
      friction: 0.5,
      shape: {
        type: ShapeType.Box,
        width: 1,
        height: 1,
        depth: 0,
      },
    })
  );
  lightBox.setPosition(-1, -1, 0);

  heavyBox.addComponent(
    new SpriteComponent({
      width: 1,
      height: 1,
      texture: 'walk',
      animation: {
        current: 'walk',
        frameWidth: 32,
        frameHeight: 32,
        sequences: {
          walk: {
            texture: 'walk',
            frameCount: 6,
            fps: 12,
            loop: true,
          },
        },
      },
    })
  );
  heavyBox.addComponent(
    new RigidBodyComponent({
      mass: 2,
      friction: 0.1,
      restitution: 0.5,
      shape: {
        type: ShapeType.Box,
        width: 1,
        height: 1,
        depth: 0,
      },
    })
  );
  heavyBox.setPosition(1, -1, 0);

  const hat = new Entity();

  hat.addComponent(new SpriteComponent({ width: 1, height: 1, texture: 'hat' }));
  hat.setPosition(0, -1, 0);
  lightBox.addChild(hat);

  const impulse = 3;

  lightBox.getComponent(RigidBodyComponent)?.applyImpulse(-impulse, 0, 0);
  heavyBox.getComponent(RigidBodyComponent)?.applyImpulse(impulse, 0, 0);

  scene.addChild(lightBox);
  scene.addChild(heavyBox);
  scene.addChild(floor);

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
