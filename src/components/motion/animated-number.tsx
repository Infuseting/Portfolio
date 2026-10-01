import { useEffect, useState, useMemo } from "react";
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
  const [display, setDisplay] = useState(
    activeFormat(shouldReduceMotion ? value : (start ? value : initialValue))
  );

  const motionValue = useMotionValue(
    shouldReduceMotion ? value : (start ? value : initialValue)
  );

  const spring = useSpring(motionValue, {
    stiffness,
    damping,
    mass,
  });

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplay(activeFormat(value));
      return;
    }

    if (start) {
      motionValue.set(value);
    } else {
      motionValue.set(initialValue);
      setDisplay(activeFormat(initialValue));
    }
  }, [value, start, motionValue, shouldReduceMotion, activeFormat, initialValue]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(activeFormat(latest));
    });

    return () => unsubscribe();
  }, [spring, activeFormat, shouldReduceMotion]);

  return <span className={className}>{display}</span>;
}
