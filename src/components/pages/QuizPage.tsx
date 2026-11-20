import { ArrowLeft, Award, Play, RotateCcw, Star } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useQuiz } from "../../hooks/useQuiz.ts";
import { ROUND_SIZE, isRoundFinished, roundScore } from "../../lib/quiz.ts";
import { ProgressDots, QuestionCard } from "../quiz/QuestionCard.tsx";
import { MoonPhase } from "../simulation/MoonPhase.tsx";
import { Button } from "../ui/Button.tsx";
import styles from "./QuizPage.module.css";

const goToCertificate = () => {
  window.location.hash = "#certificate";
};

export function QuizPage() {
  const { t } = useTranslation();
  const { round, start, answer, next } = useQuiz();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const finished = round ? isRoundFinished(round) : false;

  const screen = !round ? "start" : finished ? "result" : "question";
  useEffect(() => {
    if (screen !== "question") headingRef.current?.focus();
  }, [screen]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <article className={styles.page} aria-labelledby="quiz-title">
      <a href="#" className={styles.back}>
        <ArrowLeft className={styles.backIcon} aria-hidden="true" />
        {t("about.back")}
      </a>

      {/* Start screen */}
      {!round && (
        <section className={`${styles.card} ${styles.center}`}>
          <MoonPhase hebrewDay={15} className={styles.heroMoon} />
          <h1 id="quiz-title" ref={headingRef} tabIndex={-1} className={styles.title}>
            {t("quiz.title")}
          </h1>
          <p className={styles.lead}>{t("quiz.intro")}</p>
          <Button variant="primary" icon={<Play />} onClick={start}>
            {t("quiz.start")}
          </Button>
        </section>
      )}

      {/* Question */}
      {round && !finished && <QuestionCard round={round} onAnswer={answer} onNext={next} progress="dots" />}

      {/* Result */}
      {round && finished && (
        <section className={`${styles.card} ${styles.center}`}>
          <h1 id="quiz-title" ref={headingRef} tabIndex={-1} className={styles.title}>
            {t("quiz.resultTitle")}
          </h1>
          <ResultStars score={roundScore(round)} />
          <p className={styles.score}>{t("quiz.score", { score: roundScore(round), total: ROUND_SIZE })}</p>
          <p className={styles.lead}>
            {roundScore(round) === ROUND_SIZE
              ? t("quiz.perfect")
              : roundScore(round) >= 3
                ? t("quiz.good")
                : t("quiz.tryAgain")}
          </p>
          <ProgressDots round={round} />
          <Button variant="primary" icon={<RotateCcw />} onClick={start}>
            {t("quiz.playAgain")}
          </Button>
        </section>
      )}

      {/* Always visible: the way to the certificate exam */}
      <aside className={styles.ctaCard} aria-labelledby="certificate-cta">
        <Award className={styles.awardIcon} aria-hidden="true" />
        <div className={styles.ctaText}>
          <h2 id="certificate-cta" className={styles.ctaTitle}>
            {t("cert.ctaTitle")}
          </h2>
          <p className={styles.ctaBody}>{t("cert.ctaBody")}</p>
        </div>
        <Button variant="primary" icon={<Award />} onClick={goToCertificate}>
          {t("cert.getCertificate")}
        </Button>
      </aside>
    </article>
  );
}

function ResultStars({ score }: { score: number }) {
  return (
    <div className={styles.stars} aria-hidden="true">
      {Array.from({ length: ROUND_SIZE }, (_, i) => (
        <Star key={i} className={styles.star} data-filled={i < score} style={{ animationDelay: `${i * 120}ms` }} />
      ))}
    </div>
  );
}
