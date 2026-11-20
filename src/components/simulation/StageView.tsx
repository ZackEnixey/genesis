import { useTranslation } from "react-i18next";
import type { ViewMode } from "../../hooks/useViewMode.ts";
import { formatGregorianShort } from "../../i18n/format.ts";
import { useSimulation } from "../../state/useSimulation.ts";
import { SegmentedControl } from "../ui/SegmentedControl.tsx";
import { HorizontalView } from "./HorizontalView.tsx";
import { SolarSystem } from "./SolarSystem.tsx";
import { SpiralView } from "./SpiralView.tsx";
import styles from "./StageView.module.css";

/** The model area with a switch between the circular, horizontal (unrolled) and spiral views. */
export function StageView({ view, onViewChange }: { view: ViewMode; onViewChange(view: ViewMode): void }) {
  const { t, i18n } = useTranslation();
  const { frame } = useSimulation();

  const label = t("stage.label", {
    date: formatGregorianShort(frame.dayNumber, i18n.language),
    phase: t(`phase.${frame.moonPhase}`),
  });

  return (
    <div className={styles.stageView}>
      <SegmentedControl<ViewMode>
        className={styles.toggle}
        label={t("view.label")}
        value={view}
        onChange={onViewChange}
        options={[
          { value: "circle", label: t("view.circle") },
          { value: "horizontal", label: t("view.horizontal") },
          { value: "spiral", label: t("view.spiral") },
        ]}
      />
      {view === "circle" && <SolarSystem />}
      {view === "horizontal" && <HorizontalView label={label} />}
      {view === "spiral" && <SpiralView label={label} />}
    </div>
  );
}
