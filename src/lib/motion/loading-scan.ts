import { animate } from 'motion';

/** A single, cancellable Motion indicator for work that is actually pending. */
export function startLoadingScanline(bar: HTMLElement): () => void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    bar.style.width = '100%';
    return () => bar.style.removeProperty('width');
  }

  const animation = animate(
    bar,
    { transform: ['translateX(-100%)', 'translateX(280%)'] },
    { duration: 1.1, ease: 'easeInOut', repeat: Infinity },
  );

  return () => {
    animation.stop();
    bar.style.removeProperty('transform');
  };
}
