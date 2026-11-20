import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { gregorianMonthNames } from "../../i18n/format.ts";
import {
  MAX_GREGORIAN_YEAR,
  MIN_GREGORIAN_YEAR,
  daysInGregorianMonth,
  fromDayNumber,
  toDayNumber,
  type DayNumber,
} from "../../lib/gregorian.ts";
import {
  HEBREW_MONTH_KEYS,
  MAX_HEBREW_YEAR,
  MIN_HEBREW_YEAR,
  gregorianToHebrew,
  hebrewToGregorian,
  isHebrewLeapYear,
  monthKeysForYear,
  type HebrewMonthKey,
} from "../../lib/hebrew.ts";
import { Button } from "../ui/Button.tsx";
import { NumberField, SelectField } from "../ui/Field.tsx";
import styles from "./DateForms.module.css";

interface FormProps {
  initialDay: DayNumber;
  onSubmit(dayNumber: DayNumber): void;
  onCancel(): void;
}

type Errors = Partial<Record<"day" | "month" | "year", string>>;

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const dayOptions = (max: number) => range(1, max).map((d) => ({ value: String(d), label: String(d) }));

/** Parses a whole number typed by the user; returns NaN for anything else. */
function parseYear(raw: string): number {
  const trimmed = raw.trim();
  return /^\d{1,5}$/.test(trimmed) ? Number(trimmed) : NaN;
}

function FormActions({ onCancel }: { onCancel(): void }) {
  const { t } = useTranslation();
  return (
    <div className={styles.actions}>
      <Button variant="ghost" onClick={onCancel}>
        {t("dialog.cancel")}
      </Button>
      <Button variant="primary" type="submit">
        {t("dialog.submit")}
      </Button>
    </div>
  );
}

export function GregorianDateForm({ initialDay, onSubmit, onCancel }: FormProps) {
  const { t, i18n } = useTranslation();
  const initial = fromDayNumber(initialDay);
  const [day, setDay] = useState(String(initial.day));
  const [month, setMonth] = useState(String(initial.month));
  const [year, setYear] = useState(String(initial.year));
  const [errors, setErrors] = useState<Errors>({});

  const monthNames = gregorianMonthNames(i18n.language);

  function validate(): { errors: Errors; dayNumber?: DayNumber } {
    const next: Errors = {};
    const y = parseYear(year);
    const m = Number(month);
    const d = Number(day);
    if (!year.trim()) next.year = t("errors.yearRequired");
    else if (!Number.isInteger(y) || y < MIN_GREGORIAN_YEAR || y > MAX_GREGORIAN_YEAR)
      next.year = t("errors.yearRange", { min: MIN_GREGORIAN_YEAR, max: MAX_GREGORIAN_YEAR });
    if (!month) next.month = t("errors.monthRequired");
    if (!day) next.day = t("errors.dayRequired");
    if (Object.keys(next).length === 0) {
      const max = daysInGregorianMonth(y, m);
      if (d > max) next.day = t("errors.dayOutOfRange", { month: monthNames[m - 1], year: y, count: max });
    }
    if (Object.keys(next).length > 0) return { errors: next };
    return { errors: next, dayNumber: toDayNumber({ year: y, month: m, day: d }) };
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = validate();
    setErrors(result.errors);
    if (result.dayNumber !== undefined) onSubmit(result.dayNumber);
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.fields}>
        <SelectField
          label={t("dialog.day")}
          value={day}
          onChange={(e) => setDay(e.target.value)}
          options={dayOptions(31)}
          error={errors.day}
          fieldClassName={styles.dayField}
        />
        <SelectField
          label={t("dialog.month")}
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          options={monthNames.map((name, i) => ({ value: String(i + 1), label: name }))}
          error={errors.month}
          fieldClassName={styles.monthField}
        />
        <NumberField
          label={t("dialog.year")}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          maxLength={4}
          error={errors.year}
          fieldClassName={styles.yearField}
        />
      </div>
      <FormActions onCancel={onCancel} />
    </form>
  );
}

export function HebrewDateForm({ initialDay, onSubmit, onCancel }: FormProps) {
  const { t } = useTranslation();
  const initial = gregorianToHebrew(initialDay);
  const [day, setDay] = useState(String(initial.day));
  const [month, setMonth] = useState<HebrewMonthKey | "">(initial.month);
  const [year, setYear] = useState(String(initial.year));
  const [errors, setErrors] = useState<Errors>({});

  const parsedYear = parseYear(year);
  const yearIsValid = Number.isInteger(parsedYear) && parsedYear >= MIN_HEBREW_YEAR && parsedYear <= MAX_HEBREW_YEAR;
  // Once the year is known, offer only the months that exist in it (Adar vs Adar I/II).
  const availableMonths: readonly HebrewMonthKey[] = yearIsValid ? monthKeysForYear(parsedYear) : HEBREW_MONTH_KEYS;

  function handleYearChange(value: string) {
    setYear(value);
    const y = parseYear(value);
    if (month && Number.isInteger(y) && y >= MIN_HEBREW_YEAR && y <= MAX_HEBREW_YEAR && !monthKeysForYear(y).includes(month)) {
      setMonth("");
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const next: Errors = {};
    if (!year.trim()) next.year = t("errors.yearRequired");
    else if (!yearIsValid) next.year = t("errors.yearRange", { min: MIN_HEBREW_YEAR, max: MAX_HEBREW_YEAR });
    if (!month) next.month = t("errors.monthRequired");
    if (!day) next.day = t("errors.dayRequired");

    if (Object.keys(next).length === 0 && month) {
      const result = hebrewToGregorian({ year: parsedYear, month, day: Number(day) });
      if (result.ok) {
        setErrors({});
        onSubmit(result.dayNumber);
        return;
      }
      if (result.reason === "monthNotInYear") {
        next.month = isHebrewLeapYear(parsedYear)
          ? t("errors.adarInLeapYear", { year: parsedYear })
          : t("errors.adarInCommonYear");
      } else if (result.reason === "dayOutOfRange") {
        next.day = t("errors.dayOutOfRange", {
          month: t(`hebrewMonths.${month}`),
          year: parsedYear,
          count: result.monthLength,
        });
      } else {
        next.year = t("errors.yearRange", { min: MIN_HEBREW_YEAR, max: MAX_HEBREW_YEAR });
      }
    }
    setErrors(next);
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.fields}>
        <SelectField
          label={t("dialog.day")}
          value={day}
          onChange={(e) => setDay(e.target.value)}
          options={dayOptions(30)}
          error={errors.day}
          fieldClassName={styles.dayField}
        />
        <SelectField
          label={t("dialog.month")}
          value={month}
          onChange={(e) => setMonth(e.target.value as HebrewMonthKey)}
          placeholder={t("dialog.select")}
          options={availableMonths.map((key) => ({ value: key, label: t(`hebrewMonths.${key}`) }))}
          error={errors.month}
          fieldClassName={styles.monthField}
        />
        <NumberField
          label={t("dialog.year")}
          value={year}
          onChange={(e) => handleYearChange(e.target.value)}
          maxLength={4}
          error={errors.year}
          fieldClassName={styles.yearField}
        />
      </div>
      <FormActions onCancel={onCancel} />
    </form>
  );
}
