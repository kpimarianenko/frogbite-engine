export type SpriteAnimation = {
  texture: string;
  frameCount: number; // TODO: User should not define framecount explicitly
  fps: number;
  loop: boolean;
};
