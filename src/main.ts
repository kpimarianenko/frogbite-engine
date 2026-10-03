import './reset.css';
import { RigidBodyComponent } from '@/components';
import { FrogbiteEngine } from '@/core/engine';
import { InputManager } from '@/core/input';
import type { System, SystemContext } from '@/core/system';
import { CanvasRenderer, handleRendererResize } from '@/render';
import { Entity, OrthographicCamera, Scene } from '@/scene';
import { AssetManager } from './core/asset-manager';
import { FrogbitePhysicsEngine } from './physics';

class MovementSystem implements System {
  readonly id: string = crypto.randomUUID();
  private entity: Entity;
  private v = 5;

  constructor(entity: Entity) {
    this.entity = entity;
  }

  update({ input, dt }: SystemContext): void {
    if (input.isDown('KeyW')) {
      this.entity.translate(0, -this.v * dt, 0);
    }

    if (input.isDown('KeyS')) {
      this.entity.translate(0, this.v * dt, 0);
    }

    if (input.isDown('KeyA')) {
      this.entity.translate(-this.v * dt, 0, 0);
    }

    if (input.isDown('KeyD')) {
      this.entity.translate(this.v * dt, 0, 0);
    }
  }
}

const main = async () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const input = new InputManager();
  const assets = new AssetManager('/assets/manifest.json');
  const renderer = new CanvasRenderer(canvas, assets);

  const scene = new Scene();
  const camera = new OrthographicCamera();

  await assets.load();

  const floorPrefab = assets.getPrefab('floor');
  const playerPrefab = assets.getPrefab('player');
  const boxPrefab = assets.getPrefab('box');

  scene.instantiate(floorPrefab);
  const player = scene.instantiate(playerPrefab);
  const box = scene.instantiate(boxPrefab);

  const impulse = 3;

  box.getComponent(RigidBodyComponent)?.applyImpulse(-impulse, 0, 0);
  player.getComponent(RigidBodyComponent)?.applyImpulse(impulse, 0, 0);

  scene.addCamera(camera);
  scene.addSystem(new MovementSystem(player));

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
