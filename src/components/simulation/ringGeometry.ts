/**
 * Ring layout. Angles are screen degrees: 0° = 3 o'clock, increasing clockwise.
 * The angular layout reproduces the original artwork exactly, because the Earth and
 * Hebrew-ring angles in lib/simulation.ts are calibrated against it:
 *  - January is centred at the top; months run counter-clockwise, 30° each.
 *  - Seasons span three months each (Winter = Dec-Feb at the top).
 *  - On the Hebrew ring, the Tevet/Shevat boundary is at the top; months run counter-clockwise.
 */
import type { HebrewMonthKey } from "../../lib/hebrew.ts";

export type Season = "winter" | "spring" | "summer" | "fall";

export const RADII = {
  seasonOuter: 34,
  seasonInner: 28.4,
  monthOuter: 28.4,
  monthInner: 22.4,
  hebrewOuter: 22.1,
  hebrewInner: 16.6,
} as const;

export const SEASONS: ReadonlyArray<{ key: Season; center: number }> = [
  { key: "winter", center: -90 },
  { key: "spring", center: -180 },
  { key: "summer", center: -270 },
  { key: "fall", center: -360 },
];

/** Gregorian month index (0 = January) → centre angle. */
export const gregorianMonthCenter = (month: number) => -90 - 30 * month;

export const gregorianMonthSeason = (month: number): Season =>
  (["winter", "winter", "spring", "spring", "spring", "summer", "summer", "summer", "fall", "fall", "fall", "winter"] as const)[month] ?? "winter";

/** The 12 segments of the Hebrew ring, from the top going counter-clockwise. */
export const HEBREW_RING: ReadonlyArray<{ key: HebrewMonthKey; season: Season }> = [
  { key: "tevet", season: "winter" },
  { key: "shvat", season: "winter" },
  { key: "adar", season: "winter" },
  { key: "nisan", season: "spring" },
  { key: "iyyar", season: "spring" },
  { key: "sivan", season: "spring" },
  { key: "tamuz", season: "summer" },
  { key: "av", season: "summer" },
  { key: "elul", season: "summer" },
  { key: "tishrei", season: "fall" },
  { key: "cheshvan", season: "fall" },
  { key: "kislev", season: "fall" },
];

export const hebrewSegmentCenter = (index: number) => -75 - 30 * index;

export const PALETTE: Record<Season, { band: [string, string]; month: [string, string, string]; hebrew: string }> = {
  winter: { band: ["#2f47c4", "#5a83ff"], month: ["#a9bcff", "#b9c8ff", "#c8d4ff"], hebrew: "#86a2ff" },
  spring: { band: ["#1f9a55", "#5fd38a"], month: ["#a3e6b8", "#b3ebc4", "#c3f0d0"], hebrew: "#7cd9a0" },
  summer: { band: ["#e48a00", "#ffc93d"], month: ["#ffd980", "#ffe196", "#ffe8ac"], hebrew: "#ffcb57" },
  fall: { band: ["#d24b14", "#ff8d4d"], month: ["#ffb690", "#ffc3a3", "#ffd0b5"], hebrew: "#ff9d6e" },
};

const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (r: number, deg: number) => `${(r * Math.cos(rad(deg))).toFixed(3)} ${(r * Math.sin(rad(deg))).toFixed(3)}`;

export function point(r: number, deg: number): [number, number] {
  return [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];
}

/** Closed annular sector between radii r0 < r1 and angles a0 < a1. */
export function sectorPath(r0: number, r1: number, a0: number, a1: number): string {
  const large = a1 - a0 > 180 ? 1 : 0;
  return [
    `M ${pt(r1, a0)}`,
    `A ${r1} ${r1} 0 ${large} 1 ${pt(r1, a1)}`,
    `L ${pt(r0, a1)}`,
    `A ${r0} ${r0} 0 ${large} 0 ${pt(r0, a0)}`,
    "Z",
  ].join(" ");
}

const normalize = (deg: number) => {
  const a = ((deg % 360) + 360) % 360;
  return a > 180 ? a - 360 : a;
};

/** True when text centred at this angle should be flipped to stay upright (lower half). */
export const isLowerHalf = (center: number) => {
  const a = normalize(center);
  return a > 0.5 && a < 179.5;
};

/** Arc for <textPath>, running left-to-right as seen by the reader. */
export function textArcPath(r: number, center: number, span: number): string {
  const a0 = center - span / 2;
  const a1 = center + span / 2;
  return isLowerHalf(center)
    ? `M ${pt(r, a1)} A ${r} ${r} 0 0 0 ${pt(r, a0)}`
    : `M ${pt(r, a0)} A ${r} ${r} 0 0 1 ${pt(r, a1)}`;
}

/** Hebrew names of the Gregorian months, shown under the localised name. */
export const GREGORIAN_MONTHS_HE = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];
