import { useId } from "react";
import styles from "./Sun.module.css";

const RAY_COUNT = 24;

/** The Genesis mark: an eclipse over a horizon line with a sunburst. Centred on (0, 0). */
export function GenesisMark({ color = "currentColor" }: { color?: string }) {
  const burst = [-78, -62, -46, -30, -14];
  return (
    <g fill="none" stroke={color} strokeLinecap="round">
      <path d="M-4.6 0H4.6" strokeWidth="0.14" />
      <circle cx="-2.9" r="0.3" fill={color} stroke="none" />
      <circle cx="2.9" r="0.3" fill={color} stroke="none" />
      <circle cx="-4.6" r="0.18" fill={color} stroke="none" />
      <circle cx="4.6" r="0.18" fill={color} stroke="none" />
      <circle cx="-0.45" r="1.6" strokeWidth="0.2" />
      <circle cx="0.45" r="1.6" strokeWidth="0.2" />
      {burst.map((a, i) => {
        const rad = (a * Math.PI) / 180;
        const r0 = 1.9;
        const r1 = r0 + (i % 2 === 0 ? 1.6 : 1.05);
        return (
          <line
            key={a}
            x1={0.6 + r0 * Math.cos(rad)}
            y1={r0 * Math.sin(rad)}
            x2={0.6 + r1 * Math.cos(rad)}
            y2={r1 * Math.sin(rad)}
            strokeWidth="0.13"
          />
        );
      })}
    </g>
  );
}

/** Animated Sun with the Genesis emblem at its heart. Drawn in model units (radius ≈ 13u). */
export function Sun() {
  const id = useId();
  const ids = { surface: `${id}-surface`, corona: `${id}-corona`, ray: `${id}-ray`, disc: `${id}-disc`, glow: `${id}-glow` };

  return (
    <g className={styles.sun}>
      <defs>
        <radialGradient id={ids.corona} r="0.5" cx="0.5" cy="0.5">
          <stop offset="0.55" stopColor="#ffb347" stopOpacity="0.8" />
          <stop offset="0.75" stopColor="#ff8c32" stopOpacity="0.25" />
          <stop offset="1" stopColor="#ff6a00" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={ids.surface} r="0.5" cx="0.5" cy="0.5">
          <stop offset="0" stopColor="#fffbe8" />
          <stop offset="0.35" stopColor="#ffe27a" />
          <stop offset="0.72" stopColor="#ffab3d" />
          <stop offset="1" stopColor="#f76b15" />
        </radialGradient>
        <linearGradient id={ids.ray} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffd25a" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ff8a2a" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={ids.disc} r="0.5" cx="0.5" cy="0.4">
          <stop offset="0" stopColor="#1f2a5e" />
          <stop offset="1" stopColor="#0a0f24" />
        </radialGradient>
        <radialGradient id={ids.glow} r="0.5" cx="0.5" cy="0.5">
          <stop offset="0.8" stopColor="#ffd98a" stopOpacity="0" />
          <stop offset="0.93" stopColor="#ffd98a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle r="17.5" fill={`url(#${ids.corona})`} className={styles.corona} />

      <g className={styles.rays}>
        {Array.from({ length: RAY_COUNT }, (_, i) => {
          const long = i % 2 === 0;
          const length = long ? 3.6 : 2.4;
          return (
            <path
              key={i}
              d={`M12.2 -0.9 L${12.2 + length} 0 L12.2 0.9 Z`}
              fill={`url(#${ids.ray})`}
              transform={`rotate(${(360 / RAY_COUNT) * i})`}
            />
          );
        })}
      </g>

      <circle r="13" fill={`url(#${ids.surface})`} />
      <circle r="13" fill="none" stroke="#fff3c4" strokeOpacity="0.5" strokeWidth="0.25" />

      {/* Emblem */}
      <circle r="7.4" fill={`url(#${ids.glow})`} />
      <circle r="6.6" fill={`url(#${ids.disc})`} stroke="#f3d58c" strokeOpacity="0.85" strokeWidth="0.2" />
      <g transform="translate(0 -1.3)">
        <GenesisMark color="#f3d58c" />
      </g>
      <text
        y="3.2"
        textAnchor="middle"
        className={styles.wordmark}
        fontSize="1.45"
        letterSpacing="0.34"
        fill="#f3d58c"
      >
        GENESIS
      </text>
    </g>
  );
}
