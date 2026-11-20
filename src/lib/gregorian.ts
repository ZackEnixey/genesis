/**
 * Calendar-day arithmetic.
 *
 * A "day number" is the count of whole days since 1970-01-01. All maths is done
 * in UTC so results never depend on the user's time zone or daylight-saving rules.
 */

export type DayNumber = number;

export interface GregorianDate {
  year: number;
  /** 1-12 */
  month: number;
  /** 1-31 */
  day: number;
}

const MS_PER_DAY = 86_400_000;

/** Supported range for date entry and time travel. */
export const MIN_GREGORIAN_YEAR = 1900;
export const MAX_GREGORIAN_YEAR = 2100;

function utcDate(year: number, month: number, day: number): Date {
  // Setting year, month and day together avoids Date.UTC's special-casing of years
  // 0-99 and lets out-of-range days roll over correctly (day 0 = last day of previous month).
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date;
}

export function toDayNumber({ year, month, day }: GregorianDate): DayNumber {
  return Math.round(utcDate(year, month, day).getTime() / MS_PER_DAY);
}

export function fromDayNumber(dayNumber: DayNumber): GregorianDate {
  const date = dayNumberToUtcDate(dayNumber);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

/** A Date at UTC midnight of the given day, format it with `timeZone: "UTC"`. */
export function dayNumberToUtcDate(dayNumber: DayNumber): Date {
  return new Date(dayNumber * MS_PER_DAY);
}

/** Today's date in the user's own calendar (local time zone). */
export function todayDayNumber(now: Date = new Date()): DayNumber {
  return toDayNumber({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() });
}

export function daysInGregorianMonth(year: number, month: number): number {
  return utcDate(year, month + 1, 0).getUTCDate();
}

export function isValidGregorianDate({ year, month, day }: GregorianDate): boolean {
  return (
    Number.isInteger(year) &&
    Number.isInteger(month) &&
    Number.isInteger(day) &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= daysInGregorianMonth(year, month)
  );
}

/** Adds calendar months, clamping the day (31 Jan + 1 month = 28/29 Feb). */
export function addMonths(dayNumber: DayNumber, delta: number): DayNumber {
  const { year, month, day } = fromDayNumber(dayNumber);
  const monthIndex = year * 12 + (month - 1) + delta;
  const targetYear = Math.floor(monthIndex / 12);
  const targetMonth = (monthIndex - targetYear * 12) + 1;
  const targetDay = Math.min(day, daysInGregorianMonth(targetYear, targetMonth));
  return toDayNumber({ year: targetYear, month: targetMonth, day: targetDay });
}

export function addYears(dayNumber: DayNumber, delta: number): DayNumber {
  return addMonths(dayNumber, delta * 12);
}

export const MIN_DAY_NUMBER = toDayNumber({ year: MIN_GREGORIAN_YEAR, month: 1, day: 1 });
export const MAX_DAY_NUMBER = toDayNumber({ year: MAX_GREGORIAN_YEAR, month: 12, day: 31 });

export function clampDayNumber(dayNumber: DayNumber): DayNumber {
  return Math.min(MAX_DAY_NUMBER, Math.max(MIN_DAY_NUMBER, dayNumber));
}
