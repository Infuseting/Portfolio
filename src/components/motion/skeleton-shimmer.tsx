import { motion, useReducedMotion } from 'motion/react';

export function SkeletonShimmer({ active = true }: { active?: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      aria-hidden="true"
      className="metrics-card__shimmer"
      initial={{ x: '-100%' }}
      animate={{ x: reduceMotion || !active ? '-100%' : '100%' }}
      transition={reduceMotion || !active ? { duration: 0 } : { duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
    />
  );
}
