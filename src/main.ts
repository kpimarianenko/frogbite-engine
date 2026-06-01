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
import { half } from './math/helpers';

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
const scene = new Scene();

const entity = new Entity(new SpriteRenderData());

entity.transform.position.x = 60;
entity.transform.position.y = 60;
entity.transform.scale.x = 0.5;
entity.transform.scale.y = 2;
entity.transform.rotation.z = half(Math.PI);

scene.addEntity(entity);
scene.addCamera(new Camera());

handleRendererResize(renderer, () => ({
  width: window.innerWidth,
  height: window.innerHeight,
}));

const engine = new Engine(renderer, input);

engine.addScene(scene);
engine.addSystem(new MovementSystem());
engine.start();
