/**
 * Geometry of the spiral view: the Earth's path drawn as a helix around the Sun's path
 * through space, seen in perspective. The Earth and Sun lead at the front; the spiral
 * behind them is history, trailing back into the distance. The future is not drawn: it
 * is created as time moves on. Positions are in a 1000 × 620 drawing; `days` is measured
 * from the displayed date (negative = the past).
 */
import { EARTH_DEGREES_PER_DAY } from "./simulation.ts";

export const SPIRAL_WIDTH = 1000;
export const SPIRAL_HEIGHT = 620;
export const SUN = { x: 300, y: 385 } as const;
/** Where the history of the Sun's path disappears into the distance. */
export const VANISHING = { x: 940, y: 140 } as const;
/** Radius of the nearest loop, and how round the loops look. */
export const LOOP_RADIUS = 240;
export const LOOP_SQUASH = 0.85;
/** Perspective: a loop this many days in the past is drawn at half size. */
export const PERSPECTIVE_DAYS = 420;
/** How much history is drawn. */
export const HISTORY_DAYS = 6 * 365;

export interface Point {
  x: number;
  y: number;
}

/** Size factor: 1 now, smaller the further back in the past. */
export function scaleAt(days: number): number {
  return 1 / (1 + Math.max(0, -days) / PERSPECTIVE_DAYS);
}

/** Centre of the loop (the Sun's position) at a given time. */
export function centreAt(days: number): Point {
  const u = 1 - scaleAt(days);
  return { x: SUN.x + (VANISHING.x - SUN.x) * u, y: SUN.y + (VANISHING.y - SUN.y) * u };
}

/**
 * Point on the spiral. `earthAngleNow` is the Earth's angle around the Sun today, as in
 * the circular view. The spiral is drawn mirrored left-to-right so the Earth travels
 * clockwise, heading on into the new loop it is drawing; January stays at the top.
 */
export function spiralPoint(days: number, earthAngleNow: number): Point & { scale: number } {
  const scale = scaleAt(days);
  const centre = centreAt(days);
  const angle = ((earthAngleNow - days * EARTH_DEGREES_PER_DAY) * Math.PI) / 180;
  return {
    x: centre.x - LOOP_RADIUS * scale * Math.cos(angle),
    y: centre.y + LOOP_RADIUS * LOOP_SQUASH * scale * Math.sin(angle),
    scale,
  };
}

/** History fades gently with age; the future is not drawn yet. */
export function opacityAt(days: number): number {
  if (days > 0) return 0;
  const far = Math.min(1, (HISTORY_DAYS + days) / 240);
  return Math.max(0, Math.min(1, Math.pow(scaleAt(days), 0.55)) * far);
}
