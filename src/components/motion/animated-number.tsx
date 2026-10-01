import { useEffect, useRef, useMemo } from "react";
import { useMotionValue, useSpring, useReducedMotion } from "motion/react";

interface AnimatedNumberProps {
  value: number;
  startFrom?: number;
  start?: boolean;
  format?: (val: number) => string;
  className?: string;
  decimals?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
}

// Hoisted NumberFormat instances to avoid creating objects on every tick (js-hoist-intl)
const integerFormatter = new Intl.NumberFormat();
const createDecimalFormatter = (decimals: number) =>
  new Intl.NumberFormat(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

export function AnimatedNumber({
  value,
  startFrom,
  start = true,
  format,
  className,
  decimals = 0,
  stiffness = 85,
  damping = 18,
  mass = 0.6,
}: AnimatedNumberProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const initialValue = startFrom !== undefined ? startFrom : 0;

  const defaultFormat = useMemo(() => {
    const formatter = decimals > 0 ? createDecimalFormatter(decimals) : integerFormatter;
    return (val: number) => formatter.format(decimals > 0 ? val : Math.round(val));
  }, [decimals]);

  const activeFormat = format || defaultFormat;
  const targetValue = shouldReduceMotion ? value : (start ? value : initialValue);

  const motionValue = useMotionValue(targetValue);
  const spring = useSpring(motionValue, {
    stiffness,
    damping,
    mass,
  });

  // Direct DOM updates on animation frames (rerender-use-ref-transient-values)
  useEffect(() => {
    if (shouldReduceMotion) {
      if (spanRef.current) {
        spanRef.current.textContent = activeFormat(value);
      }
      return;
    }

    if (start) {
      motionValue.set(value);
    } else {
      motionValue.set(initialValue);
      if (spanRef.current) {
        spanRef.current.textContent = activeFormat(initialValue);
      }
    }
  }, [value, start, motionValue, shouldReduceMotion, activeFormat, initialValue]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const unsubscribe = spring.on("change", (latest) => {
      if (spanRef.current) {
        spanRef.current.textContent = activeFormat(latest);
      }
    });

    return () => unsubscribe();
  }, [spring, activeFormat, shouldReduceMotion]);

  // Initial text rendered server-side and client-side without layout shift (CLS = 0)
  return (
    <span ref={spanRef} className={className}>
      {activeFormat(targetValue)}
    </span>
  );
}
