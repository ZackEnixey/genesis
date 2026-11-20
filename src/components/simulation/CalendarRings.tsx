import { Leaf, Snowflake, Sprout, Sun as SunIcon, type LucideIcon } from "lucide-react";
import { useId } from "react";
import { useTranslation } from "react-i18next";
import { gregorianMonthNames } from "../../i18n/format.ts";
import { HEBREW_SCRIPT_LANGUAGES, resolveLanguage } from "../../i18n/i18n.ts";
import he from "../../i18n/translations/he.json";
import {
  GREGORIAN_MONTHS_HE,
  HEBREW_RING,
  PALETTE,
  RADII,
  SEASONS,
  gregorianMonthCenter,
  gregorianMonthSeason,
  hebrewSegmentCenter,
  isLowerHalf,
  point,
  sectorPath,
  textArcPath,
  type Season,
} from "./ringGeometry.ts";
import styles from "./CalendarRings.module.css";

const SEASON_ICONS: Record<Season, LucideIcon> = { winter: Snowflake, spring: Sprout, summer: SunIcon, fall: Leaf };

interface ArcLabelProps {
  id: string;
  radius: number;
  center: number;
  span: number;
  className?: string;
  children: string;
  rtl?: boolean;
}

/** A label that follows the curve of its ring and always reads upright. */
function ArcLabel({ id, radius, center, span, className, children, rtl }: ArcLabelProps) {
  return (
    <>
      <path id={id} d={textArcPath(radius, center, span)} fill="none" />
      <text className={className} dominantBaseline="central" direction={rtl ? "rtl" : undefined}>
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {children}
        </textPath>
      </text>
    </>
  );
}

/** Two stacked labels in a ring band; the first is the visually upper one. */
function TwoLineLabel(props: {
  id: string;
  rOuter: number;
  rInner: number;
  center: number;
  primary: string;
  secondary?: string;
  primaryClass?: string;
  secondaryClass?: string;
}) {
  const { id, rOuter, rInner, center, primary, secondary, primaryClass, secondaryClass } = props;
  const mid = (rOuter + rInner) / 2;
  if (!secondary) {
    return <ArcLabel id={`${id}-p`} radius={mid} center={center} span={30} className={primaryClass}>{primary}</ArcLabel>;
  }
  const band = rOuter - rInner;
  const upper = mid + band * 0.17;
  const lower = mid - band * 0.2;
  const flipped = isLowerHalf(center);
  return (
    <>
      <ArcLabel id={`${id}-p`} radius={flipped ? lower : upper} center={center} span={30} className={primaryClass}>
        {primary}
      </ArcLabel>
      <ArcLabel id={`${id}-s`} radius={flipped ? upper : lower} center={center} span={30} className={secondaryClass} rtl>
        {secondary}
      </ArcLabel>
    </>
  );
}

function SeasonRing() {
  const id = useId();
  const { t, i18n } = useTranslation();
  const isHebrew = HEBREW_SCRIPT_LANGUAGES.has(resolveLanguage(i18n.language));
  const { seasonInner: r0, seasonOuter: r1 } = RADII;
  const mid = (r0 + r1) / 2;

  return (
    <g>
      {SEASONS.map(({ key, center }) => {
        const [c0, c1] = PALETTE[key].band;
        const [x0, y0] = point(mid, center - 45);
        const [x1, y1] = point(mid, center + 45);
        const Icon = SEASON_ICONS[key];
        const label = isHebrew ? t(`seasons.${key}`) : `${t(`seasons.${key}`)} · ${he.seasons[key]}`;
        return (
          <g key={key}>
            <defs>
              <linearGradient id={`${id}-${key}`} gradientUnits="userSpaceOnUse" x1={x0} y1={y0} x2={x1} y2={y1}>
                <stop offset="0" stopColor={c0} />
                <stop offset="0.5" stopColor={c1} />
                <stop offset="1" stopColor={c0} />
              </linearGradient>
            </defs>
            <path d={sectorPath(r0, r1, center - 45, center + 45)} fill={`url(#${id}-${key})`} className={styles.segment} />
            <ArcLabel id={`${id}-${key}-label`} radius={mid} center={center} span={90} className={styles.seasonLabel}>
              {label}
            </ArcLabel>
            {[-33, 33].map((offset) => {
              const [ix, iy] = point(mid, center + offset);
              return <Icon key={offset} x={ix - 1.25} y={iy - 1.25} width={2.5} height={2.5} className={styles.seasonIcon} />;
            })}
          </g>
        );
      })}
    </g>
  );
}

function GregorianMonthRing() {
  const id = useId();
  const { i18n } = useTranslation();
  const isHebrew = HEBREW_SCRIPT_LANGUAGES.has(resolveLanguage(i18n.language));
  const names = gregorianMonthNames(i18n.language);
  const englishNames = gregorianMonthNames("en");
  const { monthInner: r0, monthOuter: r1 } = RADII;

  return (
    <g>
      {names.map((name, month) => {
        const center = gregorianMonthCenter(month);
        const season = gregorianMonthSeason(month);
        const tint = PALETTE[season].month[[11, 2, 5, 8].includes(month) ? 0 : [0, 3, 6, 9].includes(month) ? 1 : 2];
        const hebrewName = GREGORIAN_MONTHS_HE[month] ?? "";
        return (
          <g key={month}>
            <path d={sectorPath(r0, r1, center - 15, center + 15)} fill={tint} className={styles.segment} />
            <TwoLineLabel
              id={`${id}-${month}`}
              rOuter={r1}
              rInner={r0}
              center={center}
              primary={name}
              secondary={isHebrew ? englishNames[month] : hebrewName}
              primaryClass={styles.monthLabel}
              secondaryClass={styles.monthSecondary}
            />
          </g>
        );
      })}
    </g>
  );
}

function HebrewMonthRing() {
  const id = useId();
  const { t, i18n } = useTranslation();
  const isHebrew = HEBREW_SCRIPT_LANGUAGES.has(resolveLanguage(i18n.language));
  const { hebrewInner: r0, hebrewOuter: r1 } = RADII;

  return (
    <g className={styles.hebrewRing}>
      {HEBREW_RING.map(({ key, season }, index) => {
        const center = hebrewSegmentCenter(index);
        return (
          <g key={key}>
            <path d={sectorPath(r0, r1, center - 15, center + 15)} fill={PALETTE[season].hebrew} className={styles.segment} />
            <TwoLineLabel
              id={`${id}-${key}`}
              rOuter={r1}
              rInner={r0}
              center={center}
              primary={t(`hebrewMonths.${key}`)}
              secondary={isHebrew ? undefined : he.hebrewMonths[key]}
              primaryClass={styles.hebrewLabel}
              secondaryClass={styles.hebrewSecondary}
            />
          </g>
        );
      })}
    </g>
  );
}

/** Seasons, Gregorian months and the (rotating) Hebrew months, drawn in model units. */
export function CalendarRings() {
  return (
    <g className={styles.rings}>
      <SeasonRing />
      <GregorianMonthRing />
      <circle r={RADII.monthInner} className={styles.gap} />
      <HebrewMonthRing />
      <circle r={RADII.seasonOuter} className={styles.outline} />
      <circle r={RADII.seasonInner} className={styles.divider} />
    </g>
  );
}
