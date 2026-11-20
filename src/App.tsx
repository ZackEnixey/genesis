import { useCallback, useState } from "react";
import { flushSync } from "react-dom";
import { CalendarSearch } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppHeader } from "./components/layout/AppHeader.tsx";
import { Starfield } from "./components/layout/Starfield.tsx";
import { AboutPage } from "./components/pages/AboutPage.tsx";
import { QuizPage } from "./components/pages/QuizPage.tsx";
import { CertificatePage } from "./components/pages/CertificatePage.tsx";
import { DateDialog } from "./components/panels/DateDialog.tsx";
import { DateSummary } from "./components/panels/DateSummary.tsx";
import { TimeStepper } from "./components/panels/TimeStepper.tsx";
import { StageView } from "./components/simulation/StageView.tsx";
import { SunPeek } from "./components/simulation/SunPeek.tsx";
import { Button } from "./components/ui/Button.tsx";
import { useHashRoute } from "./hooks/useHashRoute.ts";
import { useViewMode } from "./hooks/useViewMode.ts";
import styles from "./App.module.css";

export default function App() {
  const { t } = useTranslation();
  const route = useHashRoute();
  const [view, setView] = useViewMode();

  // Morph smoothly between the circle and the horizontal view where the browser supports it.
  const changeView = useCallback(
    (next: typeof view) => {
      const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (typeof document.startViewTransition !== "function" || reduceMotion) {
        setView(next);
        return;
      }
      document.startViewTransition(() => flushSync(() => setView(next)));
    },
    [setView],
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = useCallback(() => setDialogOpen(true), []);
  const closeDialog = useCallback(() => setDialogOpen(false), []);

  return (
    <>
      <Starfield />
      <div className={styles.app}>
        <AppHeader />
        {route !== "home" ? (
          <main className={styles.aboutMain}>
            {route === "about" && <AboutPage />}
            {route === "quiz" && <QuizPage />}
            {route === "certificate" && <CertificatePage />}
          </main>
        ) : (
          <main className={styles.main}>
            {/* On desktop this is a side panel that scrolls on its own; on phones its
                children join the main column (display: contents). */}
            <div className={styles.panel}>
              <section className={styles.intro} aria-labelledby="intro-title">
                <h1 id="intro-title" className={styles.title}>
                  {t("intro.title")}
                </h1>
                <p className={styles.lead}>{t("intro.body")}</p>
                <Button variant="primary" icon={<CalendarSearch />} onClick={openDialog} className={styles.cta}>
                  {t("intro.cta")}
                </Button>
              </section>

              <DateSummary className={styles.summary} onChangeDate={openDialog} />
            </div>

            <div className={styles.stage}>
              <StageView view={view} onViewChange={changeView} />
            </div>

            {/* In the horizontal view the Sun rises behind the time controls, at the bottom of the page. */}
            <div className={styles.stepperDock}>
              {view === "horizontal" && <SunPeek />}
              <TimeStepper className={styles.stepper} />
            </div>
          </main>
        )}

        <DateDialog open={dialogOpen} onClose={closeDialog} />
      </div>
    </>
  );
}
