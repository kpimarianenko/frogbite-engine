import { Component } from './component';

type SpriteComponentOptions = {
  width?: number;
  height?: number;
  color?: string;
};

export class SpriteComponent extends Component {
  width: number;
  height: number;
  color: string; // TODO: Remove color, add texture

  constructor(options: SpriteComponentOptions = {}) {
    super();
    const { width = 50, height = 50, color = '#000' } = options;

    this.width = width;
    this.height = height;
    this.color = color;
  }
}
