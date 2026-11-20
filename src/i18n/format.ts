import type { TFunction } from "i18next";
import { dayNumberToUtcDate, type DayNumber } from "../lib/gregorian.ts";
import type { HebrewDate } from "../lib/hebrew.ts";
import { resolveLanguage, type LanguageCode } from "./i18n.ts";

/*
 * Intl locales for formatting Gregorian dates. Thai and Arabic default to the Buddhist and
 * Islamic calendars in some browsers, so the Gregorian calendar is requested explicitly;
 * Arabic uses Western digits to match the year field.
 */
const INTL_LOCALES: Record<LanguageCode, string> = {
  en: "en-GB",
  es: "es-ES",
  ar: "ar-u-ca-gregory-nu-latn",
  zh: "zh-CN",
  ru: "ru-RU",
  de: "de-DE",
  fr: "fr-FR",
  it: "it-IT",
  sr: "sr-Latn-RS",
  he: "he-IL",
  yi: "yi",
  ja: "ja-JP",
  th: "th-TH-u-ca-gregory",
};

export function intlLocale(language: string): string {
  return INTL_LOCALES[resolveLanguage(language)];
}

const formatterCache = new Map<string, Intl.DateTimeFormat>();
function formatter(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = locale + JSON.stringify(options);
  let f = formatterCache.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" });
    formatterCache.set(key, f);
  }
  return f;
}

/** e.g. "Friday, 20 November 2026" */
export function formatGregorianLong(dayNumber: DayNumber, language: string): string {
  return formatter(intlLocale(language), { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    .format(dayNumberToUtcDate(dayNumber));
}

/** e.g. "Friday" */
export function formatWeekday(dayNumber: DayNumber, language: string): string {
  return formatter(intlLocale(language), { weekday: "long" }).format(dayNumberToUtcDate(dayNumber));
}

/** e.g. "20 November 2026" */
export function formatGregorianShort(dayNumber: DayNumber, language: string): string {
  return formatter(intlLocale(language), { day: "numeric", month: "long", year: "numeric" })
    .format(dayNumberToUtcDate(dayNumber));
}

/** e.g. "10 Kislev 5787", word order and month name come from the active translation. */
export function formatHebrewDate(date: HebrewDate, t: TFunction): string {
  return t("format.hebrewDate", { day: date.day, month: t(`hebrewMonths.${date.month}`), year: date.year });
}

/** Localised Gregorian month names, January first. */
export function gregorianMonthNames(language: string): string[] {
  const f = formatter(intlLocale(language), { month: "long" });
  return Array.from({ length: 12 }, (_, i) => f.format(Date.UTC(2001, i, 1)));
}
