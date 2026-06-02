import { Component } from './component';

type SpriteComponentAttributes = {
  width?: number;
  height?: number;
  color?: string;
};

export class SpriteComponent extends Component {
  width: number;
  height: number;
  color: string; // TODO: Remove color, add texture

  constructor(attrs: SpriteComponentAttributes = {}) {
    super();
    const { width = 50, height = 50, color = '#000' } = attrs;

    this.width = width;
    this.height = height;
    this.color = color;
  }
}
