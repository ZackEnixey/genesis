import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFirstUseHint } from "../../hooks/useFirstUseHint.ts";
import { useHoldToRepeat } from "../../hooks/useHoldToRepeat.ts";
import { MAX_DAY_NUMBER, MIN_DAY_NUMBER } from "../../lib/gregorian.ts";
import type { StepUnit } from "../../lib/simulation.ts";
import { useSimulation } from "../../state/useSimulation.ts";
import { Button } from "../ui/Button.tsx";
import { SegmentedControl } from "../ui/SegmentedControl.tsx";
import styles from "./TimeStepper.module.css";

/** How often a held arrow repeats, per step size. */
const REPEAT_MS: Record<StepUnit, number> = { day: 220, month: 380, year: 500 };

export function TimeStepper({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { frame, step, goToday } = useSimulation();
  const [unit, setUnit] = useState<StepUnit>("day");

  // Click for one step; press and hold to keep travelling.
  const previous = useHoldToRepeat(useCallback((repeating) => step(unit, -1, repeating), [step, unit]), REPEAT_MS[unit]);
  const next = useHoldToRepeat(useCallback((repeating) => step(unit, 1, repeating), [step, unit]), REPEAT_MS[unit]);

  // First visit: the "next" arrow glows and a bubble invites a click (until the first click;
  // the glow also stops after two minutes).
  const hint = useFirstUseHint("next-step", 2 * 60 * 1000);

  return (
    <section className={`${styles.stepper} ${className ?? ""}`} aria-labelledby="time-stepper-title">
      <h2 id="time-stepper-title" className={styles.title}>
        {t("stepper.title")}
      </h2>
      <SegmentedControl<StepUnit>
        className={styles.units}
        label={t("stepper.unitLabel")}
        value={unit}
        onChange={setUnit}
        options={[
          { value: "day", label: t("stepper.day") },
          { value: "month", label: t("stepper.month") },
          { value: "year", label: t("stepper.year") },
        ]}
      />
      <div className={styles.buttons}>
        <Button
          icon={<ChevronLeft />}
          aria-label={t(`stepper.previous.${unit}`)}
          title={t(`stepper.previous.${unit}`)}
          disabled={frame.dayNumber <= MIN_DAY_NUMBER}
          {...previous}
        />
        <Button variant="ghost" icon={<RotateCcw />} className={styles.today} onClick={goToday}>
          {t("stepper.today")}
        </Button>
        <span className={styles.nextWrap} onPointerDownCapture={hint.markUsed} onKeyDownCapture={hint.markUsed}>
          {hint.showHint && (
            <span className={styles.hintBubble} aria-hidden="true">
              {t("stepper.hint")}
            </span>
          )}
          <Button
            icon={<ChevronRight />}
            aria-label={t(`stepper.next.${unit}`)}
            title={t(`stepper.next.${unit}`)}
            disabled={frame.dayNumber >= MAX_DAY_NUMBER}
            className={hint.pulsing ? styles.pulse : undefined}
            {...next}
          />
        </span>
      </div>
    </section>
  );
}
