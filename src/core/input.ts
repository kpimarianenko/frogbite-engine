enum NativeMouseButton {
  Left = 0,
  Middle = 1,
  Right = 2,
}

export class InputManager {
  private keys = new Set<string>();

  private pressed = new Set<string>();
  private released = new Set<string>();

  constructor() {
    window.addEventListener('keydown', e => this.onKeyPressed(e.code));
    window.addEventListener('keyup', e => this.onKeyReleased(e.code));
    window.addEventListener('mousedown', e => this.onKeyPressed(this.mapMouseButton(e.button)));
    window.addEventListener('mouseup', e => this.onKeyReleased(this.mapMouseButton(e.button)));
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

  isDown(key: string) {
    return this.keys.has(key);
  }

  wasPressed(key: string) {
    return this.pressed.has(key);
  }

  wasReleased(key: string) {
    return this.released.has(key);
  }

  update() {
    this.pressed.clear();
    this.released.clear();
  }
}
