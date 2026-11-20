/**
 * Festivals and special days on fixed Hebrew dates (as observed in Israel).
 * Days whose date can move (for example fasts postponed from Shabbat) are not included.
 */
import type { DayNumber } from "./gregorian.ts";
import { getHebrewYearInfo, type HebrewDateDetails, type HebrewMonthKey } from "./hebrew.ts";

export type HolidayKey =
  | "roshChodesh"
  | "roshHashanah"
  | "yomKippur"
  | "sukkot"
  | "hanukkah"
  | "tuBishvat"
  | "purim"
  | "passover"
  | "lagBaomer"
  | "shavuot"
  | "tuBav";

/** Fixed festivals: month, first day and length in days. */
const FIXED: ReadonlyArray<{ key: HolidayKey; month: HebrewMonthKey; day: number; length: number }> = [
  { key: "roshHashanah", month: "tishrei", day: 1, length: 2 },
  { key: "yomKippur", month: "tishrei", day: 10, length: 1 },
  { key: "sukkot", month: "tishrei", day: 15, length: 7 },
  { key: "tuBishvat", month: "shvat", day: 15, length: 1 },
  { key: "passover", month: "nisan", day: 15, length: 7 },
  { key: "lagBaomer", month: "iyyar", day: 18, length: 1 },
  { key: "shavuot", month: "sivan", day: 6, length: 1 },
  { key: "tuBav", month: "av", day: 15, length: 1 },
];

export function holidaysOn(dayNumber: DayNumber, hebrew: HebrewDateDetails): HolidayKey[] {
  const result: HolidayKey[] = [];
  const { month, day, year } = hebrew;

  // Rosh Chodesh: the 30th of a 30-day month and the 1st of the next (except Rosh Hashanah).
  if ((day === 1 && month !== "tishrei") || day === 30) result.push("roshChodesh");

  for (const h of FIXED) {
    if (month === h.month && day >= h.day && day < h.day + h.length) result.push(h.key);
  }

  // Purim: 14 Adar, or 14 Adar II in a leap year.
  if (day === 14 && (month === "adar" || month === "adar2")) result.push("purim");

  // Hanukkah: eight days from 25 Kislev (it continues into Tevet).
  const kislev = getHebrewYearInfo(year).months.find((m) => m.key === "kislev");
  if (kislev) {
    const firstDay = kislev.startDay + 24;
    if (dayNumber >= firstDay && dayNumber < firstDay + 8) result.push("hanukkah");
  }

  return result;
}
