enum NativeMouseButton {
  Left = 0,
  Middle = 1,
  Right = 2,
}

export class InputManager {
  private keys = new Set<string>();
  private mouseButtons = new Set<string>();

  constructor() {
    window.addEventListener('keydown', e => this.keys.add(e.code));
    window.addEventListener('keyup', e => this.keys.delete(e.code));

    window.addEventListener('mousedown', e => this.mouseButtons.add(this.mapMouseButton(e.button)));
    window.addEventListener('mouseup', e =>
      this.mouseButtons.delete(this.mapMouseButton(e.button))
    );
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

  isDown(key: string) {
    return this.keys.has(key) || this.mouseButtons.has(key);
  }
}
