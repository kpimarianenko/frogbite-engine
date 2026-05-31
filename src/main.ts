import './reset.css';
import { Engine } from './core/engine';
import { CanvasRenderer } from './render/canvas-renderer';
import { handleRendererResize } from './render/utils';
import { Scene } from './scene/scene';
import { Entity } from './scene/entity';
import { SpriteRenderData } from './scene/sprite-render-data';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const renderer = new CanvasRenderer(canvas);
const scene = new Scene();

scene.add(new Entity(new SpriteRenderData()));

handleRendererResize(renderer, () => ({
  width: window.innerWidth,
  height: window.innerHeight,
}));

const engine = new Engine(renderer, scene);

engine.start();
