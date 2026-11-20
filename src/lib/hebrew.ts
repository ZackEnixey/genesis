/**
 * Hebrew calendar conversion without a network call.
 *
 * Gregorian → Hebrew uses the browser's built-in Hebrew calendar (Intl / ICU), which
 * implements the standard fixed arithmetic Hebrew calendar. Hebrew → Gregorian is
 * derived from it exactly: we locate the year's Rosh Hashanah and walk its months.
 *
 * Only the numeric year and day are read from Intl. Month identity is derived from
 * the month's position in the year, because ICU's month *names* vary between versions.
 * Results are verified against Hebcal for every day 1900-2100 by
 * `npm run verify:hebrew`.
 */
import { fromDayNumber, toDayNumber, type DayNumber } from "./gregorian.ts";

export const HEBREW_MONTH_KEYS = [
  "tishrei",
  "cheshvan",
  "kislev",
  "tevet",
  "shvat",
  "adar",
  "adar1",
  "adar2",
  "nisan",
  "iyyar",
  "sivan",
  "tamuz",
  "av",
  "elul",
] as const;

export type HebrewMonthKey = (typeof HEBREW_MONTH_KEYS)[number];

export interface HebrewDate {
  year: number;
  month: HebrewMonthKey;
  day: number;
}

export interface HebrewMonthInfo {
  key: HebrewMonthKey;
  startDay: DayNumber;
  length: 29 | 30;
}

export interface HebrewYearInfo {
  year: number;
  isLeap: boolean;
  startDay: DayNumber;
  months: HebrewMonthInfo[];
}

/** Supported range for Hebrew date entry (≈ 1899-2100). */
export const MIN_HEBREW_YEAR = 5660;
export const MAX_HEBREW_YEAR = 5860;

const COMMON_YEAR_MONTHS: HebrewMonthKey[] = [
  "tishrei", "cheshvan", "kislev", "tevet", "shvat", "adar",
  "nisan", "iyyar", "sivan", "tamuz", "av", "elul",
];
const LEAP_YEAR_MONTHS: HebrewMonthKey[] = [
  "tishrei", "cheshvan", "kislev", "tevet", "shvat", "adar1", "adar2",
  "nisan", "iyyar", "sivan", "tamuz", "av", "elul",
];

/** Years 3, 6, 8, 11, 14, 17 and 19 of each 19-year cycle have 13 months. */
export function isHebrewLeapYear(year: number): boolean {
  return (7 * year + 1) % 19 < 7;
}

export function monthKeysForYear(year: number): HebrewMonthKey[] {
  return isHebrewLeapYear(year) ? LEAP_YEAR_MONTHS : COMMON_YEAR_MONTHS;
}

/** Number of months from the calendar epoch to the start of `year`. */
export function monthsBeforeYear(year: number): number {
  return Math.floor((235 * year - 234) / 19);
}

let partsFormatter: Intl.DateTimeFormat | undefined;

function readHebrewYearAndDay(dayNumber: DayNumber): { year: number; day: number } {
  partsFormatter ??= new Intl.DateTimeFormat("en-u-ca-hebrew", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone: "UTC",
  });
  let year = NaN;
  let day = NaN;
  for (const part of partsFormatter.formatToParts(dayNumber * 86_400_000)) {
    if (part.type === "year") year = Number(part.value);
    if (part.type === "day") day = Number(part.value);
  }
  if (!Number.isInteger(year) || !Number.isInteger(day)) {
    throw new Error("This browser does not support the Hebrew calendar.");
  }
  return { year, day };
}

function findRoshHashanah(year: number): DayNumber {
  // 1 Tishrei always falls between 5 September and 5 October.
  const start = toDayNumber({ year: year - 3761, month: 9, day: 1 });
  for (let n = start; n < start + 40; n++) {
    const parts = readHebrewYearAndDay(n);
    if (parts.year === year && parts.day === 1) return n;
  }
  throw new Error(`Could not locate the start of Hebrew year ${year}.`);
}

const yearCache = new Map<number, HebrewYearInfo>();

export function getHebrewYearInfo(year: number): HebrewYearInfo {
  const cached = yearCache.get(year);
  if (cached) return cached;

  const startDay = findRoshHashanah(year);
  const nextYearStart = findRoshHashanah(year + 1);
  const keys = monthKeysForYear(year);
  const months: HebrewMonthInfo[] = [];

  let monthStart = startDay;
  for (const key of keys) {
    // Every Hebrew month has 29 or 30 days.
    const length: 29 | 30 = readHebrewYearAndDay(monthStart + 29).day === 1 ? 29 : 30;
    months.push({ key, startDay: monthStart, length });
    monthStart += length;
  }
  if (monthStart !== nextYearStart) {
    throw new Error(`Inconsistent month structure for Hebrew year ${year}.`);
  }

  const info: HebrewYearInfo = { year, isLeap: isHebrewLeapYear(year), startDay, months };
  yearCache.set(year, info);
  return info;
}

export interface HebrewDateDetails extends HebrewDate {
  /** Position of the month in its year, 0 = Tishrei. */
  monthIndex: number;
  /** Months elapsed since the calendar epoch, increases by exactly 1 each month. */
  absoluteMonth: number;
  monthLength: 29 | 30;
}

export function gregorianToHebrew(dayNumber: DayNumber): HebrewDateDetails {
  const { year, day } = readHebrewYearAndDay(dayNumber);
  const info = getHebrewYearInfo(year);
  const monthStart = dayNumber - (day - 1);
  const monthIndex = info.months.findIndex((m) => m.startDay === monthStart);
  const month = info.months[monthIndex];
  if (!month) throw new Error(`Could not resolve the Hebrew month for day ${dayNumber}.`);
  return {
    year,
    month: month.key,
    day,
    monthIndex,
    absoluteMonth: monthsBeforeYear(year) + monthIndex,
    monthLength: month.length,
  };
}

export type HebrewToGregorianResult =
  | { ok: true; dayNumber: DayNumber }
  | { ok: false; reason: "yearOutOfRange" }
  | { ok: false; reason: "monthNotInYear"; isLeap: boolean }
  | { ok: false; reason: "dayOutOfRange"; monthLength: number };

export function hebrewToGregorian({ year, month, day }: HebrewDate): HebrewToGregorianResult {
  if (!Number.isInteger(year) || year < MIN_HEBREW_YEAR || year > MAX_HEBREW_YEAR) {
    return { ok: false, reason: "yearOutOfRange" };
  }
  const info = getHebrewYearInfo(year);
  const monthInfo = info.months.find((m) => m.key === month);
  if (!monthInfo) return { ok: false, reason: "monthNotInYear", isLeap: info.isLeap };
  if (!Number.isInteger(day) || day < 1 || day > monthInfo.length) {
    return { ok: false, reason: "dayOutOfRange", monthLength: monthInfo.length };
  }
  return { ok: true, dayNumber: monthInfo.startDay + day - 1 };
}

/** Hebrew year in effect on 1 January of the Gregorian year containing `dayNumber`. */
export function hebrewYearOnJanuaryFirst(dayNumber: DayNumber): number {
  const { year } = fromDayNumber(dayNumber);
  return readHebrewYearAndDay(toDayNumber({ year, month: 1, day: 1 })).year;
}

/** Clears cached year structures (used by tests). */
export function clearHebrewCache(): void {
  yearCache.clear();
}
