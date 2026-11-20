import { useEffect, useRef, useState, type RefObject } from "react";
import { playRumble } from "../lib/rumble.ts";
import { HEBREW_RING_DRIFT_DEG_PER_DAY } from "../lib/simulation.ts";

export interface LeapJump {
  id: number;
  /** +1 when time moves forward across the correction, -1 when stepping back. */
  direction: 1 | -1;
}

const SHAKE: Keyframe[] = [
  { transform: "translate(0, 0)" },
  { transform: "translate(-7px, 2px) rotate(-0.4deg)" },
  { transform: "translate(6px, -2px) rotate(0.35deg)" },
  { transform: "translate(-5px, 1px) rotate(-0.25deg)" },
  { transform: "translate(4px, -1px) rotate(0.2deg)" },
  { transform: "translate(-2px, 0)" },
  { transform: "translate(0, 0)" },
];

/**
 * Detects the moment the Hebrew months fall back by one month (the leap-month correction):
 * beyond the slow daily drift, the Hebrew ring jumps by about 29°. When it happens the
 * given element shakes and a soft rumble plays.
 */
export function useLeapJump(dayNumber: number, hebrewRingDeg: number, shakeRef: RefObject<HTMLElement | null>) {
  const previous = useRef({ dayNumber, hebrewRingDeg });
  const [jump, setJump] = useState<LeapJump | null>(null);

  useEffect(() => {
    const prev = previous.current;
    previous.current = { dayNumber, hebrewRingDeg };
    const drift = HEBREW_RING_DRIFT_DEG_PER_DAY * (dayNumber - prev.dayNumber);
    const correction = hebrewRingDeg - prev.hebrewRingDeg - drift;
    if (Math.abs(correction) < 10) return;
    setJump({ id: Date.now(), direction: correction < 0 ? 1 : -1 });
    playRumble();
    const element = shakeRef.current;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (element && typeof element.animate === "function" && !reduceMotion) {
      element.animate(SHAKE, { duration: 900, easing: "ease-out" });
    }
    const timer = window.setTimeout(() => setJump(null), 3200);
    return () => window.clearTimeout(timer);
  }, [dayNumber, hebrewRingDeg, shakeRef]);

  return jump;
}

