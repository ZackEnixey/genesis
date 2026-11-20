/**
 * Geometry of the Sun-Earth-Moon model.
 *
 * These formulas and constants are carried over from the original 2022 implementation
 * so the model looks exactly as before. Two things changed deliberately:
 *  - Every angle is now derived from the date alone. The old Moon accumulated ±360°
 *    in a ref during render, so extra re-renders (e.g. resizing) added spurious turns.
 *  - Dates before the 1940 reference date now work (the old code mirrored them).
 */
import { addMonths, addYears, toDayNumber, type DayNumber } from "./gregorian.ts";
import { gregorianToHebrew, hebrewYearOnJanuaryFirst, isHebrewLeapYear, type HebrewDateDetails } from "./hebrew.ts";

/** Reference new moon: 11 March 1940. All angles are measured from this day. */
export const EPOCH_DAY: DayNumber = toDayNumber({ year: 1940, month: 3, day: 11 });

/** 360° / 365.25 days. */
export const EARTH_DEGREES_PER_DAY = 0.98562628336;
/** Rotation offset that aligns the Earth with the seasons ring artwork. */
export const EARTH_ORBIT_OFFSET_DEG = 35;

/** Drift of the Hebrew months ring against the Gregorian ring, per day. */
export const HEBREW_RING_DRIFT_DEG_PER_DAY = 0.02925555555;
/** The ring jumps back by one (29-day) month for every Hebrew leap year. */
export const HEBREW_RING_LEAP_SHIFT_DEG = 29;
export const HEBREW_RING_OFFSET_DEG = 24;
/** The leap-year count uses the date 65 days earlier (original calibration). */
export const HEBREW_RING_LEAP_LOOKBACK_DAYS = 65;
export const HEBREW_RING_REFERENCE_YEAR = 5700;

export const MOON_ORBIT_OFFSET_DEG = 135;
/** Moon's angle around the Earth for each day of the Hebrew month (index 0 = day 1). */
export const MOON_ANGLE_BY_HEBREW_DAY = [
  0, 12, 24, 37, 49, 61, 73, 85, 98, 110, 122, 134, 146, 158, 180,
  195, 207, 219, 231, 244, 256, 268, 280, 293, 305, 317, 329, 341, 353, 357,
] as const;

export type StepUnit = "day" | "month" | "year";

export const TRANSITION_SECONDS: Record<StepUnit | "jump", number> = {
  day: 1,
  month: 3,
  year: 5,
  jump: 1,
};

/**
 * Signed number of Hebrew leap years between the reference year 5700 and `year`:
 * leap years in (5700, year] for later years, negative count in (year, 5700] for earlier.
 */
export function leapYearsSinceReference(year: number): number {
  let count = 0;
  if (year >= HEBREW_RING_REFERENCE_YEAR) {
    for (let y = HEBREW_RING_REFERENCE_YEAR + 1; y <= year; y++) if (isHebrewLeapYear(y)) count++;
  } else {
    for (let y = year + 1; y <= HEBREW_RING_REFERENCE_YEAR; y++) if (isHebrewLeapYear(y)) count--;
  }
  return count;
}

export type MoonPhaseKey =
  | "newMoon"
  | "waxingCrescent"
  | "firstQuarter"
  | "waxingGibbous"
  | "fullMoon"
  | "waningGibbous"
  | "lastQuarter"
  | "waningCrescent";

export function moonPhaseForHebrewDay(day: number): MoonPhaseKey {
  if (day <= 1 || day >= 30) return "newMoon";
  if (day <= 6) return "waxingCrescent";
  if (day <= 8) return "firstQuarter";
  if (day <= 13) return "waxingGibbous";
  if (day <= 16) return "fullMoon";
  if (day <= 21) return "waningGibbous";
  if (day <= 23) return "lastQuarter";
  return "waningCrescent";
}

/** Phase angle in degrees (0 = new, 180 = full), using the middle of the Hebrew day. */
export function moonPhaseAngle(day: number): number {
  const SYNODIC_MONTH_DAYS = 29.530588;
  return (((day - 0.5) / SYNODIC_MONTH_DAYS) * 360) % 360;
}

export interface SimulationFrame {
  dayNumber: DayNumber;
  daysSinceEpoch: number;
  hebrew: HebrewDateDetails;
  /** Rotation of the Sun→Earth arm. */
  earthOrbitDeg: number;
  /** Earth's spin about its own axis (one turn per day). */
  earthSpinDeg: number;
  /** Rotation of the Hebrew months ring. */
  hebrewRingDeg: number;
  /** Moon's rotation around the Earth (inside the Earth's frame). */
  moonOrbitDeg: number;
  moonPhase: MoonPhaseKey;
}

const epochAbsoluteMonth = () => gregorianToHebrew(EPOCH_DAY).absoluteMonth;

export function earthOrbitDegForDay(dayNumber: DayNumber): number {
  return -(dayNumber - EPOCH_DAY) * EARTH_DEGREES_PER_DAY + EARTH_ORBIT_OFFSET_DEG;
}

/** Shortest equivalent rotation, in (-180°, 180°]. */
export function shortestRotation(deg: number): number {
  const a = ((deg % 360) + 360) % 360;
  return a > 180 ? a - 360 : a;
}

export function computeSimulation(dayNumber: DayNumber): SimulationFrame {
  const daysSinceEpoch = dayNumber - EPOCH_DAY;
  const hebrew = gregorianToHebrew(dayNumber);

  const earthOrbitDeg = earthOrbitDegForDay(dayNumber);
  const earthSpinDeg = -daysSinceEpoch * 360;

  const leapYears = leapYearsSinceReference(
    hebrewYearOnJanuaryFirst(dayNumber - HEBREW_RING_LEAP_LOOKBACK_DAYS),
  );
  const hebrewRingDeg =
    HEBREW_RING_DRIFT_DEG_PER_DAY * daysSinceEpoch -
    HEBREW_RING_LEAP_SHIFT_DEG * leapYears -
    HEBREW_RING_OFFSET_DEG;

  // One full turn per Hebrew month keeps the animation moving forward in time.
  const monthsSinceEpoch = hebrew.absoluteMonth - epochAbsoluteMonth();
  const moonOrbitDeg =
    -360 * monthsSinceEpoch - (MOON_ANGLE_BY_HEBREW_DAY[hebrew.day - 1] ?? 0) + MOON_ORBIT_OFFSET_DEG;

  return {
    dayNumber,
    daysSinceEpoch,
    hebrew,
    earthOrbitDeg,
    earthSpinDeg,
    hebrewRingDeg,
    moonOrbitDeg,
    moonPhase: moonPhaseForHebrewDay(hebrew.day),
  };
}

export function stepDate(dayNumber: DayNumber, unit: StepUnit, direction: 1 | -1): DayNumber {
  if (unit === "day") return dayNumber + direction;
  if (unit === "month") return addMonths(dayNumber, direction);
  return addYears(dayNumber, direction);
}
