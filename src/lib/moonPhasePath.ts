/**
 * SVG path of the sunlit part of the Moon for a given phase angle.
 * 0° = new moon, 90° = first quarter, 180° = full, 270° = last quarter.
 * The disc has radius `r` and is centred at (r, r).
 */
export function litMoonPath(phaseDeg: number, r: number): string {
  const angle = ((phaseDeg % 360) + 360) % 360;
  const cos = Math.cos((angle * Math.PI) / 180);
  const terminatorRx = Math.abs(cos) * r;
  const waxing = angle < 180;

  // Waxing: right limb is lit. Waning: left limb is lit.
  const limbSweep = waxing ? 1 : 0;
  // The terminator bulges towards the lit limb for crescents and away from it for gibbous phases.
  const crescent = cos > 0;
  const terminatorSweep = waxing === crescent ? 0 : 1;

  const f = (n: number) => Number(n.toFixed(3));
  return [
    `M ${f(r)} 0`,
    `A ${f(r)} ${f(r)} 0 0 ${limbSweep} ${f(r)} ${f(2 * r)}`,
    `A ${f(terminatorRx)} ${f(r)} 0 0 ${terminatorSweep} ${f(r)} 0`,
    "Z",
  ].join(" ");
}
