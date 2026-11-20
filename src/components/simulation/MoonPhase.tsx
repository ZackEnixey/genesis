import { useId } from "react";
import { litMoonPath } from "../../lib/moonPhasePath.ts";
import { moonPhaseAngle } from "../../lib/simulation.ts";
import { MoonBody } from "./MoonBody.tsx";
import styles from "./MoonPhase.module.css";

interface Props {
  /** Day of the Hebrew month (1-30). */
  hebrewDay: number;
  className?: string;
}

/** The Moon as seen from Earth: the sunlit part at full brightness, the rest in faint earthshine. */
export function MoonPhase({ hebrewDay, className }: Props) {
  const clipId = useId();
  // litMoonPath draws a disc of radius 50 centred on (50, 50); shift it to (0, 0).
  const lit = litMoonPath(moonPhaseAngle(hebrewDay), 50);

  return (
    <svg className={`${styles.moon} ${className ?? ""}`} viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clipId}>
          <path d={lit} transform="translate(-50 -50)" />
        </clipPath>
      </defs>
      <g opacity="0.12">
        <MoonBody />
      </g>
      <g clipPath={`url(#${clipId})`}>
        <MoonBody />
      </g>
      <circle r="49.5" className={styles.rim} />
    </svg>
  );
}
