import { Check, X } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { useQuizLabel } from "../../hooks/useQuizLabel.ts";
import type { QuizQuestion, QuizRound } from "../../lib/quiz.ts";
import { MoonPhase } from "../simulation/MoonPhase.tsx";
import { Button } from "../ui/Button.tsx";
import styles from "../pages/QuizPage.module.css";

/** Hebrew day that shows each phase, for the small Moon pictures on phase answers. */
const PHASE_DAY: Record<string, number> = { newMoon: 1, firstQuarter: 8, fullMoon: 15, lastQuarter: 22 };

export function ProgressDots({ round }: { round: QuizRound }) {
  return (
    <ol className={styles.progress} aria-hidden="true">
      {round.questions.map((q: QuizQuestion, i) => {
        const answer = round.answers[i];
        const answered = answer !== null && answer !== undefined;
        const state = !answered ? (i === round.index ? "current" : "todo") : answer === q.answer ? "right" : "wrong";
        return <li key={`${q.id}-${i}`} className={styles.dot} data-state={state} />;
      })}
    </ol>
  );
}

function ProgressBar({ round }: { round: QuizRound }) {
  const done = round.answers.filter((a) => a !== null).length;
  return (
    <div className={styles.bar} aria-hidden="true">
      <div className={styles.barFill} style={{ "--done": done / round.questions.length } as CSSProperties} />
    </div>
  );
}

interface Props {
  round: QuizRound;
  onAnswer(choice: number): void;
  onNext(): void;
  /** Dots for short rounds, a bar for the long exam. */
  progress: "dots" | "bar";
}

/** One question with four answers, then feedback with an explanation. */
export function QuestionCard({ round, onAnswer, onNext, progress }: Props) {
  const { t } = useTranslation();
  const label = useQuizLabel();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const question = round.questions[round.index];
  const chosen = round.answers[round.index];
  const answered = chosen !== null && chosen !== undefined;

  // Keyboard and screen-reader users land on each new question, then on the feedback.
  useEffect(() => {
    headingRef.current?.focus();
  }, [round.index]);
  useEffect(() => {
    if (answered) feedbackRef.current?.focus();
  }, [answered]);

  if (!question) return null;
  const params = Object.fromEntries(Object.entries(question.params).map(([k, v]) => [k, label(v)]));

  return (
    <section className={styles.card}>
      <div className={styles.meta}>
        <span className={styles.count}>{t("quiz.progress", { current: round.index + 1, total: round.questions.length })}</span>
        {progress === "dots" ? <ProgressDots round={round} /> : <ProgressBar round={round} />}
      </div>

      <h1 id="quiz-title" ref={headingRef} tabIndex={-1} className={styles.question}>
        {t(question.stem, params)}
      </h1>

      <div className={styles.options} role="group" aria-labelledby="quiz-title">
        {question.options.map((option, i) => {
          const state = !answered ? "idle" : i === question.answer ? "right" : i === chosen ? "wrong" : "dim";
          return (
            <button
              key={`${option.kind}-${option.value}`}
              type="button"
              className={styles.option}
              data-state={state}
              disabled={answered}
              aria-pressed={answered ? i === chosen : undefined}
              onClick={() => onAnswer(i)}
            >
              {option.kind === "phase" && <MoonPhase hebrewDay={PHASE_DAY[option.value] ?? 15} className={styles.optionMoon} />}
              <span className={styles.optionLabel}>{label(option)}</span>
              {state === "right" && <Check className={styles.optionIcon} aria-hidden="true" />}
              {state === "wrong" && <X className={styles.optionIcon} aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {answered && (
        <div ref={feedbackRef} tabIndex={-1} className={styles.feedback} data-correct={chosen === question.answer} aria-live="polite">
          <p className={styles.verdict}>
            {chosen === question.answer
              ? t("quiz.correct")
              : t("quiz.incorrect", { answer: label(question.options[question.answer] ?? question.options[0]!) })}
          </p>
          <p className={styles.explain}>{t(question.explain)}</p>
          <Button variant="primary" onClick={onNext} className={styles.nextButton}>
            {round.index + 1 < round.questions.length ? t("quiz.next") : t("quiz.finish")}
          </Button>
        </div>
      )}
    </section>
  );
}
