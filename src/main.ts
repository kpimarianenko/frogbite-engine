import './reset.css';
import { Engine } from './core/engine';
import { CanvasRenderer } from './render/canvas-renderer';
import { handleRendererResize } from './render/utils';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const renderer = new CanvasRenderer(canvas);

handleRendererResize(renderer, () => ({
  width: window.innerWidth,
  height: window.innerHeight,
}));

const engine = new Engine(renderer);

engine.start();
