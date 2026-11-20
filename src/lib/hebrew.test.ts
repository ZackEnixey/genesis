import { describe, expect, it } from "vitest";
import { MAX_DAY_NUMBER, MIN_DAY_NUMBER, toDayNumber } from "./gregorian.ts";
import {
  getHebrewYearInfo,
  gregorianToHebrew,
  hebrewToGregorian,
  isHebrewLeapYear,
  monthKeysForYear,
  type HebrewDate,
} from "./hebrew.ts";

const day = (year: number, month: number, d: number) => toDayNumber({ year, month, day: d });

describe("Gregorian → Hebrew", () => {
  // Reference values cross-checked with hebcal.com.
  const cases: Array<[[number, number, number], HebrewDate]> = [
    [[1948, 5, 14], { year: 5708, month: "iyyar", day: 5 }],
    [[2000, 1, 1], { year: 5760, month: "tevet", day: 23 }],
    [[2023, 3, 1], { year: 5783, month: "adar", day: 8 }],
    [[2024, 2, 10], { year: 5784, month: "adar1", day: 1 }],
    [[2024, 3, 10], { year: 5784, month: "adar1", day: 30 }],
    [[2024, 3, 11], { year: 5784, month: "adar2", day: 1 }],
    [[2024, 4, 9], { year: 5784, month: "nisan", day: 1 }],
    [[2024, 10, 3], { year: 5785, month: "tishrei", day: 1 }],
    [[2026, 11, 20], { year: 5787, month: "kislev", day: 10 }],
  ];

  it.each(cases)("%j is %j", ([y, m, d], expected) => {
    const result = gregorianToHebrew(day(y, m, d));
    expect({ year: result.year, month: result.month, day: result.day }).toEqual(expected);
  });

  it("does not depend on the time zone of the Date (pure day numbers)", () => {
    expect(gregorianToHebrew(day(2024, 4, 9)).day).toBe(1);
  });
});

describe("Hebrew → Gregorian", () => {
  it("converts known dates", () => {
    expect(hebrewToGregorian({ year: 5708, month: "iyyar", day: 5 })).toEqual({ ok: true, dayNumber: day(1948, 5, 14) });
    expect(hebrewToGregorian({ year: 5784, month: "adar2", day: 14 })).toEqual({ ok: true, dayNumber: day(2024, 3, 24) });
  });

  it("rejects Adar in a leap year and Adar I/II in a common year", () => {
    expect(hebrewToGregorian({ year: 5784, month: "adar", day: 1 })).toEqual({ ok: false, reason: "monthNotInYear", isLeap: true });
    expect(hebrewToGregorian({ year: 5783, month: "adar1", day: 1 })).toEqual({ ok: false, reason: "monthNotInYear", isLeap: false });
  });

  it("rejects day 30 in a 29-day month", () => {
    const result = hebrewToGregorian({ year: 5784, month: "tevet", day: 30 });
    expect(result).toEqual({ ok: false, reason: "dayOutOfRange", monthLength: 29 });
  });

  it("rejects years outside the supported range", () => {
    expect(hebrewToGregorian({ year: 100000, month: "nisan", day: 1 })).toEqual({ ok: false, reason: "yearOutOfRange" });
  });
});

describe("year structure", () => {
  it("knows the 19-year leap cycle", () => {
    const leapInCycle = [3, 6, 8, 11, 14, 17, 19];
    for (let n = 1; n <= 19; n++) expect(isHebrewLeapYear(5700 + n)).toBe(leapInCycle.includes(n));
  });

  it("builds 12 or 13 months that add up to a valid year length", () => {
    for (let year = 5660; year <= 5860; year++) {
      const info = getHebrewYearInfo(year);
      expect(info.months.map((m) => m.key)).toEqual(monthKeysForYear(year));
      const length = info.months.reduce((sum, m) => sum + m.length, 0);
      expect(info.isLeap ? [383, 384, 385] : [353, 354, 355]).toContain(length);
    }
  });
});

describe("round trip", () => {
  it("Hebrew → Gregorian is the exact inverse of Gregorian → Hebrew for every day 1900-2100", () => {
    let checked = 0;
    for (let n = MIN_DAY_NUMBER; n <= MAX_DAY_NUMBER; n++) {
      const h = gregorianToHebrew(n);
      const back = hebrewToGregorian(h);
      if (h.year >= 5660 && h.year <= 5860) {
        if (!back.ok || back.dayNumber !== n) throw new Error(`Round trip failed for day ${n}: ${JSON.stringify(h)}`);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(73_000);
  });
});
