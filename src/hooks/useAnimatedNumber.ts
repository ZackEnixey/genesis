import { useEffect, useRef, useState } from "react";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Smoothly animates towards `target` over `seconds` (ease-out), for drawings that are
 * recomputed in JavaScript rather than animated by CSS. Very large jumps only animate
 * the last `maxDistance`, and reduced-motion users get no animation.
 */
export function useAnimatedNumber(target: number, seconds: number, maxDistance: number): number {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const distance = target - valueRef.current;
    if (reduceMotion || seconds <= 0 || distance === 0) {
      valueRef.current = target;
      setValue(target);
      return;
    }
    const from = Math.abs(distance) > maxDistance ? target - Math.sign(distance) * maxDistance : valueRef.current;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (seconds * 1000));
      const next = from + (target - from) * easeOutCubic(t);
      valueRef.current = next;
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, seconds, maxDistance]);

  return value;
}
