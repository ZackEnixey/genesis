import { useTranslation } from "react-i18next";
import type { QuizValue } from "../lib/quiz.ts";

/** Turns a quiz value (month, festival, Moon phase or number) into text in the current language. */
export function useQuizLabel() {
  const { t } = useTranslation();
  return (value: QuizValue): string => {
    switch (value.kind) {
      case "month":
        return t(`hebrewMonths.${value.value}`);
      case "holiday":
        return t(`holidays.${value.value}`);
      case "phase":
        return t(`phase.${value.value}`);
      case "number":
        return String(value.value);
    }
  };
}
