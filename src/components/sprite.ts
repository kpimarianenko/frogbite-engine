import { Component } from './component';

type SpriteComponentOptions = {
  width?: number;
  height?: number;
  color?: string;
  texture?: string;
};

export class SpriteComponent extends Component {
  width: number;
  height: number;
  color: string;
  texture: string | null;

  constructor(options: SpriteComponentOptions = {}) {
    super();
    const { width = 50, height = 50, color = '#444', texture = null } = options;

    this.width = width;
    this.height = height;
    this.color = color;
    this.texture = texture;
  }
}
