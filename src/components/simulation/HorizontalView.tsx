import { Leaf, Snowflake, Sprout, Sun as SunIcon, type LucideIcon } from "lucide-react";
import { useRef, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { gregorianMonthNames } from "../../i18n/format.ts";
import { HEBREW_SCRIPT_LANGUAGES, resolveLanguage } from "../../i18n/i18n.ts";
import he from "../../i18n/translations/he.json";
import { gregorianCoordinate, hebrewCoordinate, mod, moonScreenAngle } from "../../lib/horizontal.ts";
import { useSimulation } from "../../state/useSimulation.ts";
import { Earth } from "./Earth.tsx";
import { useLeapJump } from "../../hooks/useLeapJump.ts";
import { LeapJumpBadge } from "./LeapJump.tsx";
import { Moon } from "./MoonBody.tsx";
import { HEBREW_RING, PALETTE, gregorianMonthSeason, type Season } from "./ringGeometry.ts";
import styles from "./HorizontalView.module.css";

const SEASON_ORDER: Season[] = ["winter", "spring", "summer", "fall"];
const SEASON_ICONS: Record<Season, LucideIcon> = { winter: Snowflake, spring: Sprout, summer: SunIcon, fall: Leaf };
/** Months rendered either side of "today", enough to cover any one-year step smoothly. */
const SPAN = 22;

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

/**
 * The model "unrolled": seasons, Gregorian months and Hebrew months as endless strips
 * that glide past a fixed Earth, with the Moon revolving around it. The Sun is below
 * (it rises behind the time controls), so light comes from the bottom.
 */
export function HorizontalView({ label }: { label: string }) {
  const { frame, transitionSeconds, skyDeg } = useSimulation();
  const { t, i18n } = useTranslation();
  const isHebrewScript = HEBREW_SCRIPT_LANGUAGES.has(resolveLanguage(i18n.language));
  const monthNames = gregorianMonthNames(i18n.language);

  // skyDeg follows the Earth's orbit continuously (and takes the short way after a jump),
  // so the strips glide smoothly instead of spinning through decades.
  const g = gregorianCoordinate(skyDeg);
  // Hebrew cell j is centred at screen offset (j - 0.5 - hebrewShift) months from the Earth.
  const hebrewShift = hebrewCoordinate(g, frame.hebrewRingDeg) - 0.5;
  const moonAngle = moonScreenAngle(frame.moonOrbitDeg);
  const moonBehind = Math.sin((moonAngle * Math.PI) / 180) < 0; // upper half = far side

  // Leap-month correction: shake the strips and point out what happened.
  const stripsRef = useRef<HTMLDivElement>(null);
  const jump = useLeapJump(frame.dayNumber, frame.hebrewRingDeg, stripsRef);

  const style = {
    "--transition": `${transitionSeconds}s`,
    "--g": g,
    "--h": hebrewShift,
    "--moon-angle": `${moonAngle}deg`,
    "--moon-angle-inverse": `${-moonAngle}deg`,
    "--earth-spin": `${frame.earthSpinDeg}deg`,
  } as CSSProperties;

  const centre = Math.round(g);
  const months = range(centre - SPAN, centre + SPAN);
  const hebrewCentre = Math.round(hebrewShift);
  const hebrewCells = range(hebrewCentre - SPAN, hebrewCentre + SPAN);
  const seasons = range(Math.floor((centre - SPAN) / 3), Math.ceil((centre + SPAN) / 3));

  return (
    <div className={styles.view} style={style} role="img" aria-label={label} dir="ltr">
      {/* Earth and Moon */}
      <div className={styles.system} aria-hidden="true">
        <svg className={styles.orbit} viewBox="-100 -100 200 200" preserveAspectRatio="none">
          <ellipse rx="99" ry="99" />
        </svg>
        <div className={`${styles.moonLayer} ${moonBehind ? styles.behind : styles.front}`}>
          <div className={styles.moonFlatten}>
            <div className={styles.moonRevolve}>
              <div className={styles.moonPosition}>
                <div className={styles.moonUpright}>
                  {/* Tidally locked: the same side always faces the Earth. */}
                  <div className={styles.moonBody}>
                    <Moon className={styles.moonSvg} />
                  </div>
                  <div className={styles.moonShade} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.earth}>
          <div className={styles.earthSpin}>
            <div className={styles.earthIdle}>
              <Earth className={styles.earthSvg} />
            </div>
          </div>
          <div className={styles.earthShade} />
        </div>
      </div>

      {/* Calendar strips (top to bottom: Hebrew months, Gregorian months, seasons) */}
      <div ref={stripsRef} className={styles.strips} aria-hidden="true">
        <div className={styles.marker} />

        <div className={styles.strip}>
          <div className={`${styles.track} ${styles.hebrewTrack}`}>
            {hebrewCells.map((j) => {
              const { key, season } = HEBREW_RING[mod(j, 12)] ?? HEBREW_RING[0]!;
              return (
                <div key={j} className={styles.cell} style={{ "--i": j - 1, background: PALETTE[season].hebrew } as CSSProperties}>
                  <span className={styles.cellLabel}>{t(`hebrewMonths.${key}`)}</span>
                  {!isHebrewScript && <span className={styles.cellSub}>{he.hebrewMonths[key]}</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.strip}>
          <div className={`${styles.track} ${styles.gregorianTrack}`}>
            {months.map((m) => {
              const month = mod(m, 12);
              const season = gregorianMonthSeason(month);
              const tint = PALETTE[season].month[[11, 2, 5, 8].includes(month) ? 0 : [0, 3, 6, 9].includes(month) ? 1 : 2];
              return (
                <div key={m} className={styles.cell} style={{ "--i": m - 0.5, background: tint } as CSSProperties}>
                  <span className={styles.cellLabel}>{monthNames[month]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`${styles.strip} ${styles.seasonStrip}`}>
          <div className={`${styles.track} ${styles.gregorianTrack}`}>
            {seasons.map((n) => {
              const season = SEASON_ORDER[mod(n, 4)] ?? "winter";
              const [c0, c1] = PALETTE[season].band;
              const Icon = SEASON_ICONS[season];
              return (
                <div
                  key={n}
                  className={`${styles.cell} ${styles.seasonCell}`}
                  style={{ "--i": 3 * n - 1.5, background: `linear-gradient(90deg, ${c0}, ${c1} 50%, ${c0})` } as CSSProperties}
                >
                  <Icon className={styles.seasonIcon} />
                  <span>{t(`seasons.${season}`)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {jump && <LeapJumpBadge key={jump.id} jump={jump} shape="line" className={styles.leapBadge} />}
    </div>
  );
}
