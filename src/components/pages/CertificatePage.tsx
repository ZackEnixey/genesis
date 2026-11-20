import { ArrowLeft, Award, FlaskConical, Mail, Play, Printer, RotateCcw, Send } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useExam } from "../../hooks/useExam.ts";
import { todayDayNumber } from "../../lib/gregorian.ts";
import { EXAM_SIZE, examPassMark, isRoundFinished, roundScore } from "../../lib/quiz.ts";
import { CertificateView } from "../certificate/CertificateView.tsx";
import { CheckoutForm, StepIndicator } from "../certificate/CheckoutForm.tsx";
import { QuestionCard } from "../quiz/QuestionCard.tsx";
import { Button } from "../ui/Button.tsx";
import styles from "./QuizPage.module.css";

const backToQuiz = () => {
  window.location.hash = "#quiz";
};

/** The testing shortcut is shown while developing, or on any build with ?test in the address. */
const SHOW_TEST_TOOLS = import.meta.env.DEV || new URLSearchParams(window.location.search).has("test");

/**
 * Certificate exam: 20 questions; if passed, a three-step checkout
 * (1 payment, 2 name and address, 3 the certificate with "Send"), then a confirmation.
 */
export function CertificatePage() {
  const { t } = useTranslation();
  const { round, certificate, start, answer, next, issue, send, simulatePass } = useExam();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const finished = round ? isRoundFinished(round) : false;
  const score = round ? roundScore(round) : 0;
  const total = round?.questions.length ?? EXAM_SIZE;
  const needed = examPassMark(total);
  const passed = finished && score >= needed;

  const screen =
    round && !finished ? "question" : round ? (passed ? "checkout" : "failed") : certificate ? (certificate.sent ? "sent" : "certificate") : "intro";

  useEffect(() => {
    if (screen !== "question") {
      headingRef.current?.focus();
      window.scrollTo({ top: 0 });
    }
  }, [screen]);

  const heading = (text: string) => (
    <h1 id="quiz-title" ref={headingRef} tabIndex={-1} className={styles.title}>
      {text}
    </h1>
  );

  const testButton = SHOW_TEST_TOOLS && (
    <Button variant="ghost" size="sm" icon={<FlaskConical />} onClick={simulatePass} className={styles.testButton}>
      {t("cert.simulate")}
    </Button>
  );

  return (
    <article className={`${styles.page} ${screen === "certificate" || screen === "sent" ? styles.wide : ""}`} aria-labelledby="quiz-title">
      <a href="#quiz" className={styles.back}>
        <ArrowLeft className={styles.backIcon} aria-hidden="true" />
        {t("cert.backToQuiz")}
      </a>

      {screen === "intro" && (
        <section className={`${styles.card} ${styles.center}`}>
          <Award className={styles.awardIcon} aria-hidden="true" />
          {heading(t("cert.examTitle"))}
          <p className={styles.lead}>{t("cert.examIntro", { total: EXAM_SIZE, needed: examPassMark(EXAM_SIZE) })}</p>
          <Button variant="primary" icon={<Play />} onClick={start}>
            {t("cert.startExam")}
          </Button>
          {testButton}
        </section>
      )}

      {screen === "question" && round && (
        <>
          <QuestionCard round={round} onAnswer={answer} onNext={next} progress="bar" />
          {testButton}
        </>
      )}

      {screen === "failed" && (
        <section className={`${styles.card} ${styles.center}`}>
          {heading(t("cert.failedTitle"))}
          <p className={styles.score}>{t("quiz.score", { score, total })}</p>
          <p className={styles.lead}>{t("cert.failedBody", { score, total, needed })}</p>
          <div className={styles.actions}>
            <Button variant="primary" icon={<RotateCcw />} onClick={start}>
              {t("cert.retry")}
            </Button>
            <Button variant="secondary" onClick={backToQuiz}>
              {t("cert.backToQuiz")}
            </Button>
          </div>
          {testButton}
        </section>
      )}

      {/* Steps 1 and 2: payment, then name and address */}
      {screen === "checkout" && (
        <section className={`${styles.card} ${styles.center}`}>
          <Award className={styles.awardIcon} aria-hidden="true" />
          {heading(t("cert.passedTitle"))}
          <p className={styles.lead}>{t("cert.passedBody", { score, total })}</p>
          <CheckoutForm
            onIssue={({ name, address }) => issue({ name, address, score, total, issuedOn: todayDayNumber(), sent: false })}
          />
        </section>
      )}

      {/* Step 3: the certificate, ready to send */}
      {screen === "certificate" && certificate && (
        <>
          <div className={styles.stepBox}>
            <StepIndicator current={3} />
          </div>
          {heading(t("cert.stepCertificate"))}
          <CertificateView certificate={certificate} />
          <div className={styles.actions}>
            <Button variant="primary" icon={<Send />} onClick={send}>
              {t("cert.sendTo", { address: certificate.address })}
            </Button>
            <Button variant="secondary" icon={<Printer />} onClick={() => window.print()}>
              {t("cert.print")}
            </Button>
          </div>
        </>
      )}

      {/* Sent */}
      {screen === "sent" && certificate && (
        <>
          <section className={`${styles.card} ${styles.center} ${styles.sent}`} role="status">
            <Mail className={styles.awardIcon} aria-hidden="true" />
            {heading(t("cert.sentTitle"))}
            <p className={styles.lead}>{t("cert.sentBody", { address: certificate.address })}</p>
            <p className={styles.demoNote}>{t("cert.sentDemo")}</p>
          </section>
          <CertificateView certificate={certificate} />
          <div className={styles.actions}>
            <Button variant="secondary" icon={<Printer />} onClick={() => window.print()}>
              {t("cert.print")}
            </Button>
            <Button variant="ghost" icon={<RotateCcw />} onClick={start}>
              {t("cert.newExam")}
            </Button>
          </div>
        </>
      )}
    </article>
  );
}
