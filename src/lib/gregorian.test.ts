import { describe, expect, it } from "vitest";
import {
  addMonths,
  clampDayNumber,
  daysInGregorianMonth,
  fromDayNumber,
  isValidGregorianDate,
  MAX_DAY_NUMBER,
  MIN_DAY_NUMBER,
  toDayNumber,
  todayDayNumber,
} from "./gregorian.ts";

describe("Gregorian helpers", () => {
  it("knows month lengths, including leap-year February", () => {
    expect(daysInGregorianMonth(2023, 2)).toBe(28);
    expect(daysInGregorianMonth(2024, 2)).toBe(29);
    expect(daysInGregorianMonth(1900, 2)).toBe(28);
    expect(daysInGregorianMonth(2000, 2)).toBe(29);
    expect(daysInGregorianMonth(2023, 4)).toBe(30);
    expect(daysInGregorianMonth(2023, 12)).toBe(31);
  });

  it("validates dates", () => {
    expect(isValidGregorianDate({ year: 2023, month: 2, day: 29 })).toBe(false);
    expect(isValidGregorianDate({ year: 2024, month: 2, day: 29 })).toBe(true);
    expect(isValidGregorianDate({ year: 2024, month: 13, day: 1 })).toBe(false);
  });

  it("round-trips day numbers", () => {
    expect(toDayNumber({ year: 1970, month: 1, day: 1 })).toBe(0);
    for (const date of [{ year: 1900, month: 3, day: 1 }, { year: 2024, month: 2, day: 29 }, { year: 2100, month: 12, day: 31 }]) {
      expect(fromDayNumber(toDayNumber(date))).toEqual(date);
    }
  });

  it("uses the local calendar date for today", () => {
    expect(fromDayNumber(todayDayNumber(new Date(2026, 10, 20, 23, 59)))).toEqual({ year: 2026, month: 11, day: 20 });
  });

  it("clamps to the supported range", () => {
    expect(clampDayNumber(MIN_DAY_NUMBER - 10)).toBe(MIN_DAY_NUMBER);
    expect(clampDayNumber(MAX_DAY_NUMBER + 10)).toBe(MAX_DAY_NUMBER);
  });

  it("clamps the day when adding months", () => {
    expect(fromDayNumber(addMonths(toDayNumber({ year: 2023, month: 1, day: 31 }), 1))).toEqual({ year: 2023, month: 2, day: 28 });
  });
});
