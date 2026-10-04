import type { OrthographicCamera } from './orthographic-camera';
import type { PerspectiveCamera } from './perspective-camera';

export * from './camera-type';
export * from './viewport';
export * from './orthographic-camera';
export * from './perspective-camera';

export type Camera = OrthographicCamera | PerspectiveCamera;
