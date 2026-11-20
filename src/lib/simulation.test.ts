import { describe, expect, it } from "vitest";
import { addMonths, fromDayNumber, toDayNumber } from "./gregorian.ts";
import { litMoonPath } from "./moonPhasePath.ts";
import {
  EARTH_DEGREES_PER_DAY,
  EPOCH_DAY,
  MOON_ANGLE_BY_HEBREW_DAY,
  computeSimulation,
  earthOrbitDegForDay,
  leapYearsSinceReference,
  shortestRotation,
  moonPhaseForHebrewDay,
  stepDate,
} from "./simulation.ts";

const day = (year: number, month: number, d: number) => toDayNumber({ year, month, day: d });
const mod360 = (deg: number) => ((deg % 360) + 360) % 360;

/** Port of the 2022 `checkIsLeapYear().numberOfLeapYearsSince1940` table (valid for years ≥ 5700). */
function legacyLeapCount(hebrewYear: number): number {
  const table: Record<number, number> = { 2: 0, 3: 1, 4: 1, 5: 1, 6: 2, 7: 2, 8: 3, 9: 3, 10: 3, 11: 4, 12: 4, 13: 4, 14: 5, 15: 5, 16: 5, 17: 6, 18: 6 };
  return Math.floor(Math.abs(5700 - hebrewYear) / 19) * 7 + (table[hebrewYear % 19] ?? 0);
}

describe("characterisation: matches the 2022 formulas", () => {
  it("leap-year count equals the legacy table for every year 5700-5900", () => {
    for (let y = 5700; y <= 5900; y++) expect(leapYearsSinceReference(y)).toBe(legacyLeapCount(y));
  });

  it("Earth orbit angle = days × 0.9856° (legacy sign) + 35°", () => {
    const n = day(1990, 6, 15);
    const legacyValue = -(n - EPOCH_DAY); // legacy simulationNumberOfDays
    expect(computeSimulation(n).earthOrbitDeg).toBeCloseTo(legacyValue * EARTH_DEGREES_PER_DAY + 35, 9);
  });

  it("Moon orientation (mod 360) follows the legacy Hebrew-day table", () => {
    for (const n of [day(1985, 1, 1), day(2024, 3, 11), day(2026, 11, 20)]) {
      const frame = computeSimulation(n);
      const legacy = -(MOON_ANGLE_BY_HEBREW_DAY[frame.hebrew.day - 1] ?? 0) + 135;
      expect(mod360(frame.moonOrbitDeg)).toBeCloseTo(mod360(legacy), 9);
    }
  });
});

describe("computeSimulation", () => {
  it("is deterministic, the same date always gives the same angles", () => {
    const n = day(2001, 9, 11);
    expect(computeSimulation(n)).toEqual(computeSimulation(n));
  });

  it("moves the Moon one full turn backwards per Hebrew month", () => {
    const a = computeSimulation(day(2024, 4, 9)); // 1 Nisan
    const b = computeSimulation(day(2024, 5, 9)); // 1 Iyyar
    expect(a.hebrew.day).toBe(1);
    expect(b.hebrew.day).toBe(1);
    expect(b.moonOrbitDeg - a.moonOrbitDeg).toBe(-360);
  });

  it("handles dates before the 1940 reference date", () => {
    const frame = computeSimulation(day(1935, 7, 4));
    expect(frame.daysSinceEpoch).toBeLessThan(0);
    expect(frame.hebrew.year).toBe(5695);
  });
});

describe("stepping", () => {
  it("steps by calendar day, month and year", () => {
    const start = day(2024, 1, 31);
    expect(fromDayNumber(stepDate(start, "day", 1))).toEqual({ year: 2024, month: 2, day: 1 });
    expect(fromDayNumber(stepDate(start, "month", 1))).toEqual({ year: 2024, month: 2, day: 29 });
    expect(fromDayNumber(stepDate(start, "year", -1))).toEqual({ year: 2023, month: 1, day: 31 });
    expect(fromDayNumber(addMonths(day(2024, 12, 15), 1))).toEqual({ year: 2025, month: 1, day: 15 });
  });
});

describe("moon phase", () => {
  it("names the phases by Hebrew day", () => {
    expect(moonPhaseForHebrewDay(1)).toBe("newMoon");
    expect(moonPhaseForHebrewDay(8)).toBe("firstQuarter");
    expect(moonPhaseForHebrewDay(15)).toBe("fullMoon");
    expect(moonPhaseForHebrewDay(22)).toBe("lastQuarter");
    expect(moonPhaseForHebrewDay(27)).toBe("waningCrescent");
  });

  it("draws a half-lit disc at first quarter and a full disc at full moon", () => {
    // At exactly 90° the terminator is a straight line (x-radius 0).
    expect(litMoonPath(90, 50)).toMatch(/^M 50 0 A 50 50 0 0 1 50 100 A 0 50 0 0 [01] 50 0 Z$/);
    expect(litMoonPath(45, 50)).toContain("0 0 0 50 0"); // waxing crescent bulges right
    expect(litMoonPath(135, 50)).toContain("0 0 1 50 0"); // waxing gibbous bulges left
    // Full moon: one half via the limb, the other half via a full-width terminator, in opposite directions.
    const full = litMoonPath(180, 50).match(/A 50 50 0 0 ([01]) 50 100 A 50 50 0 0 ([01]) 50 0/);
    expect(full).not.toBeNull();
    expect(full?.[1]).toBe(full?.[2]);
  });
});

describe("sky rotation helpers", () => {
  it("normalises rotations to the shortest equivalent", () => {
    expect(shortestRotation(370)).toBe(10);
    expect(shortestRotation(-190)).toBe(170);
    expect(shortestRotation(180)).toBe(180);
  });

  it("the orbit turns about one degree per day", () => {
    const n = day(2000, 1, 1);
    expect(earthOrbitDegForDay(n) - earthOrbitDegForDay(n + 1)).toBeCloseTo(EARTH_DEGREES_PER_DAY, 9);
  });
});
