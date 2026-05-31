import './reset.css';
import { Engine } from './core/engine';
import { CanvasRenderer } from './render/canvas-renderer';
import { handleRendererResize } from './render/utils';
import { Scene } from './scene/scene';
import { Entity } from './scene/entity';
import { SpriteRenderData } from './scene/sprite-render-data';
import { InputManager } from './core/input';
import type { System } from './core/system';
import { Camera } from './scene/camera';

class MovementSystem implements System {
  private v = 500;
  private cv = 20;

  update(scene: Scene, dt: number, input: InputManager): void {
    scene.camera.transform.position.x += this.cv * dt;

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
const scene = new Scene(new Camera());

scene.add(new Entity(new SpriteRenderData()));

handleRendererResize(renderer, () => ({
  width: window.innerWidth,
  height: window.innerHeight,
}));

const engine = new Engine(renderer, scene, input);

engine.addSystem(new MovementSystem());
engine.start();
