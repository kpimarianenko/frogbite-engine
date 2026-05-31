import type { Vector2D } from '@/math/vector';

enum NativeMouseButton {
  Left = 0,
  Middle = 1,
  Right = 2,
}

export class InputManager {
  private keys = new Set<string>();
  private pressed = new Set<string>();
  private released = new Set<string>();
  private mousePos: Vector2D = { x: 0, y: 0 };
  private mouseDelta: Vector2D = { x: 0, y: 0 };
  private wheelDelta = 0;

  constructor() {
    window.addEventListener('keydown', e => this.onKeyPressed(e.code));
    window.addEventListener('keyup', e => this.onKeyReleased(e.code));
    window.addEventListener('mousedown', e => this.onKeyPressed(this.mapMouseButton(e.button)));
    window.addEventListener('mouseup', e => this.onKeyReleased(this.mapMouseButton(e.button)));
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('wheel', this.onWheel);
  }

  private mapMouseButton(button: number) {
    switch (button) {
      case NativeMouseButton.Left: {
        return 'MouseLeft';
      }
      case NativeMouseButton.Middle: {
        return 'MouseMiddle';
      }
      case NativeMouseButton.Right: {
        return 'MouseRight';
      }
      default: {
        return `Mouse${button + 1}`;
      }
    }
  }

  private onKeyPressed(key: string) {
    if (!this.keys.has(key)) {
      this.pressed.add(key);
    }

    this.keys.add(key);
  }

  private onKeyReleased(key: string) {
    this.keys.delete(key);
    this.released.add(key);
  }

  private onMouseMove = (e: MouseEvent) => {
    const dx = e.clientX - this.mousePos.x;
    const dy = e.clientY - this.mousePos.y;

    this.mousePos.x = e.clientX;
    this.mousePos.y = e.clientY;

    this.mouseDelta.x += dx;
    this.mouseDelta.y += dy;
  };

  private onWheel = (e: WheelEvent) => {
    this.wheelDelta += e.deltaY;
  };

  isDown(key: string) {
    return this.keys.has(key);
  }

  wasPressed(key: string) {
    return this.pressed.has(key);
  }

  wasReleased(key: string) {
    return this.released.has(key);
  }

  getMousePosition() {
    return this.mousePos;
  }

  getMouseDelta() {
    return this.mouseDelta;
  }

  getWheelDelta() {
    return this.wheelDelta;
  }

  update() {
    this.pressed.clear();
    this.released.clear();

    this.mouseDelta.x = 0;
    this.mouseDelta.y = 0;
    this.wheelDelta = 0;
  }
}
