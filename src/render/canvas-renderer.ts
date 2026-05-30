import type { Renderer } from './renderer';

export class CanvasRenderer implements Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  get context() {
    return this.ctx;
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
  }

  // TODO: Pass object pool and implement correct rendering system
  render(): void {
    this.ctx.fillStyle = '#F00';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  resize(w: number, h: number) {
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;

    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
  }
}
