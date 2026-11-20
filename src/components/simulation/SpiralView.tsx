import { useMemo, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { useAnimatedNumber } from "../../hooks/useAnimatedNumber.ts";
import { gregorianMonthNames, intlLocale } from "../../i18n/format.ts";
import { dayNumberToUtcDate } from "../../lib/gregorian.ts";
import { gregorianToHebrew, getHebrewYearInfo, type HebrewMonthKey } from "../../lib/hebrew.ts";
import { gregorianCoordinate, mod } from "../../lib/horizontal.ts";
import {
  HISTORY_DAYS,
  centreAt,
  SPIRAL_HEIGHT,
  SPIRAL_WIDTH,
  SUN,
  VANISHING,
  opacityAt,
  spiralPoint,
} from "../../lib/spiral.ts";
import { EARTH_DEGREES_PER_DAY, earthOrbitDegForDay } from "../../lib/simulation.ts";
import { useSimulation } from "../../state/useSimulation.ts";
import { Earth } from "./Earth.tsx";
import { Moon } from "./MoonBody.tsx";
import { Sun } from "./Sun.tsx";
import styles from "./SpiralView.module.css";

const SAMPLE_DAYS = 3;
const CHUNK = 6; // samples per drawn segment (each segment has its own width and opacity)
const MOON_DISTANCE = 72;
const MOON_DEGREES_PER_DAY = 360 / 29.530588;
/** Labels this close to the Earth (or the Sun) would hide behind it. */
const CLEAR_AROUND_EARTH = 62;

const pct = (value: number, of: number) => `${(value / of) * 100}%`;
const isNearEarth = (x: number, y: number, earth: { x: number; y: number }) =>
  Math.hypot(x - earth.x, y - earth.y) < CLEAR_AROUND_EARTH || Math.hypot(x - SUN.x, y - SUN.y) < 52;

/**
 * The Earth's path as a spiral around the Sun's path through space: each loop is a year.
 * The Earth and Sun lead at the front; the spiral behind them is the history of months,
 * trailing into the distance. Stepping forward draws the line on, month after month.
 */
export function SpiralView({ label }: { label: string }) {
  const { frame, transitionSeconds } = useSimulation();
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  // Animate the displayed day so the spiral flows smoothly towards the selected date.
  const day = useAnimatedNumber(frame.dayNumber, transitionSeconds, 540);
  const earthAngle = 180 + earthOrbitDegForDay(day);
  const g = gregorianCoordinate(earthOrbitDegForDay(day));

  // The spiral line, drawn as short segments that shrink and fade with distance.
  const segments = useMemo(() => {
    const points = [];
    for (let d = -HISTORY_DAYS; d <= 0; d += SAMPLE_DAYS) points.push({ d, ...spiralPoint(d, earthAngle) });
    points.push({ d: 0, ...spiralPoint(0, earthAngle) }); // the line always reaches the Earth
    const result: { path: string; width: number; opacity: number }[] = [];
    for (let i = 0; i < points.length - 1; i += CHUNK) {
      const chunk = points.slice(i, i + CHUNK + 1);
      const mid = chunk[Math.floor(chunk.length / 2)]!;
      const opacity = opacityAt(mid.d);
      if (opacity <= 0.01) continue;
      result.push({
        path: "M" + chunk.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("L"),
        width: 1 + 4 * mid.scale,
        opacity,
      });
    }
    return result;
  }, [earthAngle]);

  const earth = spiralPoint(0, earthAngle);

  // Gregorian month names at the middle of each month along the spiral.
  const monthNames = gregorianMonthNames(language);
  const yearFormat = useMemo(() => new Intl.DateTimeFormat(intlLocale(language), { year: "numeric", timeZone: "UTC" }), [language]);
  const months = useMemo(() => {
    const labels = [];
    for (let m = Math.ceil(g - HISTORY_DAYS / 30.4); m <= Math.floor(g); m++) {
      const d = ((m - g) * 30) / EARTH_DEGREES_PER_DAY;
      const p = spiralPoint(d, earthAngle);
      const opacity = opacityAt(d);
      if (p.scale < 0.2 || opacity < 0.05) continue;
      // Place the name just outside the loop, away from the loop's centre.
      const c = centreAt(d);
      const len = Math.hypot(p.x - c.x, p.y - c.y) || 1;
      const offset = 10 + 18 * p.scale;
      const month = mod(m, 12);
      const name = month === 0 ? `${monthNames[0]} ${yearFormat.format(dayNumberToUtcDate(Math.round(day + d)))}` : monthNames[month];
      if (isNearEarth(p.x, p.y, spiralPoint(0, earthAngle))) continue;
      labels.push({
        key: m,
        name: name ?? "",
        x: p.x + ((p.x - c.x) / len) * offset,
        y: p.y + ((p.y - c.y) / len) * offset,
        scale: p.scale,
        opacity,
      });
    }
    return labels;
  }, [g, earthAngle, monthNames, yearFormat, day]);

  // New Hebrew months (new Moons) along the history, as gold dots.
  const hebrewStarts = useMemo(() => {
    const today = Math.round(frame.dayNumber);
    const firstYear = gregorianToHebrew(today - HISTORY_DAYS - 31).year;
    const lastYear = gregorianToHebrew(today + 31).year;
    const starts: { startDay: number; key: HebrewMonthKey }[] = [];
    for (let y = firstYear; y <= lastYear; y++) {
      for (const m of getHebrewYearInfo(y).months) starts.push({ startDay: m.startDay, key: m.key });
    }
    return starts;
  }, [frame.dayNumber]);

  // Light comes from the Sun: shade the far side of the Earth and Moon.
  const toSun = (Math.atan2(SUN.y - earth.y, SUN.x - earth.x) * 180) / Math.PI;
  // Moon position as in the circular view (new moon towards the Sun), mirrored like the spiral.
  const moonOrbit = frame.moonOrbitDeg + (frame.dayNumber - day) * MOON_DEGREES_PER_DAY;
  const alpha = ((180 - toSun + 225 + moonOrbit) * Math.PI) / 180;
  const moon = {
    x: earth.x - MOON_DISTANCE * Math.cos(alpha),
    y: earth.y + MOON_DISTANCE * Math.sin(alpha),
  };
  // Tidally locked: the Moon keeps the same face towards the Earth.
  const moonAngle = (Math.atan2(moon.y - earth.y, moon.x - earth.x) * 180) / Math.PI;

  const style = { "--shade-angle": `${toSun - 90}deg`, "--moon-turn": `${moonAngle}deg` } as CSSProperties;

  return (
    <div className={styles.view} role="img" aria-label={label} dir="ltr">
      <div className={styles.canvas} style={style}>
        <svg className={styles.drawing} viewBox={`0 0 ${SPIRAL_WIDTH} ${SPIRAL_HEIGHT}`} aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="spiral-sunbeam" x1={SUN.x} y1={SUN.y} x2={VANISHING.x} y2={VANISHING.y} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ffcf6b" stopOpacity="0.9" />
              <stop offset="1" stopColor="#ffcf6b" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* The Sun's path through space, trailing back into the distance */}
          <line x1={SUN.x} y1={SUN.y} x2={VANISHING.x} y2={VANISHING.y} stroke="url(#spiral-sunbeam)" strokeWidth="2.5" />

          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {segments.map((s, i) => (
              <g key={i} opacity={s.opacity}>
                <path d={s.path} stroke="#9fd8ff" strokeOpacity="0.18" strokeWidth={s.width * 3.5} />
                <path d={s.path} stroke="#e8f6ff" strokeWidth={s.width} />
              </g>
            ))}
          </g>

          {hebrewStarts.map(({ startDay, key }) => {
            const d = startDay - day;
            const opacity = opacityAt(d);
            if (opacity < 0.05) return null;
            const p = spiralPoint(d, earthAngle);
            const showName = p.scale > 0.55 && !isNearEarth(p.x, p.y, earth);
            return (
              <g key={startDay} opacity={opacity}>
                <circle cx={p.x} cy={p.y} r={2 + 4 * p.scale} className={styles.newMoon} />
                {showName && (
                  <text
                    x={p.x + (SUN.x - p.x) * 0.12}
                    y={p.y + (SUN.y - p.y) * 0.12}
                    className={styles.hebrewLabel}
                    fontSize={13 * p.scale + 3}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {t(`hebrewMonths.${key}`)}
                  </text>
                )}
              </g>
            );
          })}

          {months.map((m) => (
            <text
              key={m.key}
              x={m.x}
              y={m.y}
              opacity={m.opacity}
              fontSize={Math.max(8, 24 * m.scale)}
              className={styles.monthLabel}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {m.name}
            </text>
          ))}
        </svg>

        {/* Sun, Earth and Moon are HTML layers so they can morph between views. */}
        <div className={styles.sun} style={{ left: pct(SUN.x, SPIRAL_WIDTH), top: pct(SUN.y, SPIRAL_HEIGHT) }}>
          <svg viewBox="-18 -18 36 36" aria-hidden="true" focusable="false">
            <Sun />
          </svg>
        </div>
        <div className={styles.earth} style={{ left: pct(earth.x, SPIRAL_WIDTH), top: pct(earth.y, SPIRAL_HEIGHT) }}>
          <div className={styles.earthIdle}>
            <Earth className={styles.fill} />
          </div>
          <div className={styles.shade} />
        </div>
        <div className={styles.moon} style={{ left: pct(moon.x, SPIRAL_WIDTH), top: pct(moon.y, SPIRAL_HEIGHT) }}>
          <div className={styles.moonBody}>
            <Moon className={styles.fill} />
          </div>
          <div className={styles.shade} />
        </div>
      </div>
    </div>
  );
}
