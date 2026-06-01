import './reset.css';
import { Engine } from './core/engine';
import { CanvasRenderer } from './render/canvas-renderer';
import { handleRendererResize } from './render/utils';
import { Scene } from './scene/scene';
import { Entity } from './scene/entity';
import { SpriteRenderData } from './scene/renderable';
import { InputManager } from './core/input';
import type { System, SystemContext } from './core/system';
import { Camera } from './scene/camera';

class MovementSystem implements System {
  private v = 500;
  private cv = 5;

  update({ scene, input, dt }: SystemContext): void {
    for (const camera of scene.cameras) {
      camera.transform.position.x += this.cv * dt;
    }

    for (const entity of scene.entities) {
      if (input.isDown('KeyW')) {
        entity.transform.position.y -= this.v * dt;
      }

      if (input.isDown('KeyS')) {
        entity.transform.position.y += this.v * dt;
      }

      if (input.isDown('KeyA')) {
        entity.transform.position.x -= this.v * dt;
      }

      if (input.isDown('KeyD')) {
        entity.transform.position.x += this.v * dt;
      }
    }
  }
}

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const input = new InputManager();
const renderer = new CanvasRenderer(canvas);

const sceneA = new Scene();

sceneA.addCamera(
  new Camera({
    width: 0.5,
    height: 1,
    x: 0,
    y: 0,
    normalized: true,
  })
);

const entityA = new Entity(new SpriteRenderData({ color: 'red' }));

entityA.transform.position.x = 60;
entityA.transform.position.y = 60;

sceneA.addEntity(entityA);

const sceneB = new Scene();

sceneB.addCamera(
  new Camera({
    width: 0.5,
    height: 1,
    x: 0.5,
    y: 0,
    normalized: true,
  })
);

const entityB = new Entity(new SpriteRenderData({ color: 'blue' }));

entityB.transform.position.x = 60;
entityB.transform.position.y = 60;

sceneB.addEntity(entityB);
sceneB.addSystem(new MovementSystem());

handleRendererResize(renderer, () => ({
  width: window.innerWidth,
  height: window.innerHeight,
}));

const engine = new Engine(renderer, input);

engine.addScene(sceneA);
engine.addScene(sceneB);
engine.start();
