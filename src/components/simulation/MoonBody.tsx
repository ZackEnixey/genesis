import { useId } from "react";

// Dark "seas" (maria) and craters, roughly after the near side of the Moon.
const MARIA: ReadonlyArray<[number, number, number, number]> = [
  [-14, -18, 15, 11],
  [8, -22, 11, 9],
  [-24, 6, 12, 15],
  [12, -4, 13, 10],
  [20, 14, 9, 8],
  [-4, 18, 8, 6],
];
const CRATERS: ReadonlyArray<[number, number, number]> = [
  [-6, 32, 5],
  [26, -26, 3.5],
  [-32, -20, 3],
  [30, 30, 4],
  [2, 6, 2.5],
  [-18, 30, 2.4],
  [36, 2, 2.6],
  [-36, 22, 2],
  [14, 38, 2.2],
];

/** Moon surface as an SVG group, centred on (0, 0) with radius 50. */
export function MoonBody() {
  const id = useId();
  const base = `${id}-base`;
  const shade = `${id}-shade`;

  return (
    <g>
      <defs>
        <radialGradient id={base} cx="-12" cy="-14" r="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f8f9fa" />
          <stop offset="0.55" stopColor="#d5d9de" />
          <stop offset="1" stopColor="#9aa1a9" />
        </radialGradient>
        <radialGradient id={shade} cx="0" cy="0" r="50" gradientUnits="userSpaceOnUse">
          <stop offset="0.7" stopColor="#1b1f24" stopOpacity="0" />
          <stop offset="1" stopColor="#1b1f24" stopOpacity="0.35" />
        </radialGradient>
      </defs>
      <circle r="50" fill={`url(#${base})`} />
      {MARIA.map(([cx, cy, rx, ry], i) => (
        <ellipse key={`m${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="#6c737c" fillOpacity="0.32" />
      ))}
      {CRATERS.map(([cx, cy, r], i) => (
        <g key={`c${i}`}>
          <circle cx={cx} cy={cy} r={r} fill="#7c838c" fillOpacity="0.45" />
          <circle cx={cx - r * 0.15} cy={cy - r * 0.15} r={r * 0.85} fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth={r * 0.18} />
        </g>
      ))}
      <circle r="50" fill={`url(#${shade})`} />
    </g>
  );
}

export function Moon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">
      <MoonBody />
    </svg>
  );
}
