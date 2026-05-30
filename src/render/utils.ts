import type { Renderer } from './renderer';

export const handleRendererResize = (
  renderer: Renderer,
  getSize: () => { width: number; height: number }
) => {
  const handler = () => {
    const { width, height } = getSize();

    renderer.resize(width, height);
  };

  window.addEventListener('resize', handler);
  handler();

  return () => window.removeEventListener('resize', handler);
};
