import { useEffect, useState, useMemo } from "react";
import { useMotionValue, useSpring, useReducedMotion } from "motion/react";

interface AnimatedNumberProps {
  value: number;
  startFrom?: number;
  format?: (val: number) => string;
  className?: string;
  decimals?: number;
  stiffness?: number;
  damping?: number;
}

export function AnimatedNumber({
  value,
  startFrom,
  format,
  className,
  decimals = 0,
  stiffness = 90,
  damping = 18,
}: AnimatedNumberProps) {
  const shouldReduceMotion = useReducedMotion();
  const initialValue = startFrom !== undefined ? startFrom : 0;
  
  const defaultFormat = useMemo(() => {
    return (val: number) => {
      if (decimals > 0) {
        return val.toFixed(decimals);
      }
      return Math.round(val).toLocaleString();
    };
  }, [decimals]);

  const activeFormat = format || defaultFormat;
  const [display, setDisplay] = useState(activeFormat(shouldReduceMotion ? value : initialValue));

  const motionValue = useMotionValue(shouldReduceMotion ? value : initialValue);
  const spring = useSpring(motionValue, {
    stiffness,
    damping,
    mass: 0.6,
  });

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplay(activeFormat(value));
      return;
    }
    motionValue.set(value);
  }, [value, motionValue, shouldReduceMotion, activeFormat]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(activeFormat(latest));
    });

    return () => unsubscribe();
  }, [spring, activeFormat, shouldReduceMotion]);

  return <span className={className}>{display}</span>;
}
