import './reset.css';
import { SpriteComponent } from '@/components';
import { Engine } from '@/core/engine';
import { InputManager } from '@/core/input';
import type { System, SystemContext } from '@/core/system';
import { CanvasRenderer, handleRendererResize } from '@/render';
import { Entity, OrthographicCamera, Scene } from '@/scene';

class MovementSystem implements System {
  private v = 500;
  private cv = 5;

  update({ scene, input, dt }: SystemContext): void {
    for (const camera of scene.cameras) {
      camera.position.x += this.cv * dt;
    }

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

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const input = new InputManager();
const renderer = new CanvasRenderer(canvas);

const sceneA = new Scene();

sceneA.addCamera(
  new OrthographicCamera({
    width: 0.5,
    height: 1,
    x: 0,
    y: 0,
    normalized: true,
  })
);

const entityA = new Entity(new SpriteComponent({ color: 'red' }));

entityA.transform.position.x = 60;
entityA.transform.position.y = 60;

sceneA.addEntity(entityA);

const sceneB = new Scene();

sceneB.addCamera(
  new OrthographicCamera({
    width: 0.5,
    height: 1,
    x: 0.5,
    y: 0,
    normalized: true,
  })
);

const entityB = new Entity(new SpriteComponent({ color: 'blue' }));

entityB.transform.position.x = 60;
entityB.transform.position.y = 60;

const entityBChild = new Entity(new SpriteComponent({ width: 20, height: 20, color: 'red' }));

entityBChild.transform.position.x = 20;
entityBChild.transform.position.y = 20;

entityB.addChild(entityBChild);

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
