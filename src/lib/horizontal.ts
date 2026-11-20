/**
 * Maps the circular model onto the horizontal ("unrolled") view.
 *
 * In the circle, months are 30° segments and the Earth's position is an angle. Unrolled,
 * one month is one strip cell and the same angles become positions along the strip:
 *   - Gregorian coordinate g: 0 = centre of January, 1 = centre of February, … (grows with time).
 *   - The Hebrew strip is offset by the Hebrew-ring rotation, so it drifts against the
 *     Gregorian strip exactly as the ring does (and jumps back a month in leap years).
 */

/** Gregorian strip coordinate under the Earth, from the (continuous) Earth-orbit angle. */
export function gregorianCoordinate(earthOrbitDeg: number): number {
  // Earth sits at screen angle 180° + orbit; January's centre is at -90°; months run 30° apart.
  return -(270 + earthOrbitDeg) / 30;
}

/** How far the Hebrew strip is shifted against the Gregorian one, in months. */
export function hebrewOffset(hebrewRingDeg: number): number {
  return hebrewRingDeg / 30;
}

/**
 * Hebrew-strip coordinate under the Earth. Cell j (0 = Tevet, 1 = Shevat, …) is centred
 * on Gregorian coordinate j - 0.5 - offset, so the cell under the Earth is
 * round(g + 0.5 + offset).
 */
export function hebrewCoordinate(g: number, hebrewRingDeg: number): number {
  return g + 0.5 + hebrewOffset(hebrewRingDeg);
}

/**
 * Screen angle of the Moon around the Earth when the Sun is straight below (0° = right,
 * clockwise positive). New moon → 90° (towards the Sun), full moon → 270° (away from it).
 */
export function moonScreenAngle(moonOrbitDeg: number): number {
  return 315 + moonOrbitDeg;
}

export const mod = (n: number, m: number) => ((n % m) + m) % m;
