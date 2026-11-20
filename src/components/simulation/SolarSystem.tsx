import { useRef, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { formatGregorianShort } from "../../i18n/format.ts";
import { useSimulation } from "../../state/useSimulation.ts";
import { CalendarRings } from "./CalendarRings.tsx";
import { Earth } from "./Earth.tsx";
import { useLeapJump } from "../../hooks/useLeapJump.ts";
import { LeapJumpBadge } from "./LeapJump.tsx";
import { Moon } from "./MoonBody.tsx";
import { Sun } from "./Sun.tsx";
import styles from "./SolarSystem.module.css";

const deg = (value: number) => `${value}deg`;

/**
 * The animated Sun-Earth-Moon model. Purely presentational: every angle comes from the
 * simulation frame, and CSS transitions animate between dates.
 */
export function SolarSystem() {
  const { frame, transitionSeconds } = useSimulation();
  const { t, i18n } = useTranslation();
  // Leap-month correction: the circle shakes and a badge explains it.
  const squareRef = useRef<HTMLDivElement>(null);
  const jump = useLeapJump(frame.dayNumber, frame.hebrewRingDeg, squareRef);

  const style = {
    "--transition": `${transitionSeconds}s`,
    "--earth-orbit": deg(frame.earthOrbitDeg),
    "--earth-orbit-inverse": deg(-frame.earthOrbitDeg),
    "--earth-spin": deg(frame.earthSpinDeg),
    "--hebrew-ring": deg(frame.hebrewRingDeg),
    "--moon-orbit": deg(frame.moonOrbitDeg),
    "--moon-orbit-inverse": deg(-frame.moonOrbitDeg),
  } as CSSProperties;

  const label = t("stage.label", {
    date: formatGregorianShort(frame.dayNumber, i18n.language),
    phase: t(`phase.${frame.moonPhase}`),
  });

  return (
    <div className={styles.stage} dir="ltr">
      <div ref={squareRef} className={styles.square} style={style} role="img" aria-label={label}>
        <svg className={styles.orrery} viewBox="-48 -48 96 96" aria-hidden="true" focusable="false">
          <circle r="34" className={styles.orbitPath} />
          <CalendarRings />
        </svg>
        {/* The Sun has its own layer so it can glide to the bottom when switching views. */}
        <svg className={`${styles.centered} ${styles.sunLayer}`} viewBox="-18 -18 36 36" aria-hidden="true" focusable="false">
          <Sun />
        </svg>

        {/* Arm from the Sun to the Earth; the Earth sits at its left end. */}
        <div className={`${styles.centered} ${styles.orbitArm}`}>
          <div className={styles.earthAnchor}>
            <div className={styles.earthUpright}>
              {/* Gentle idle spin (one turn a minute) on top of the date-driven rotation. */}
              <div className={styles.earthIdle}>
                <Earth className={styles.earth} />
              </div>
            </div>
            <div className={styles.earthNightSide} />
            <div className={styles.moonOrbit}>
              {/* Tidally locked: the Moon turns with its orbit, so the same side always faces the Earth. */}
              <div className={styles.moon}>
                <Moon className={styles.moonImage} />
                <div className={styles.moonNightSide} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {jump && <LeapJumpBadge key={jump.id} jump={jump} shape="circle" className={styles.leapBadge} />}
    </div>
  );
}
