import { useId } from "react";
import { GenesisMark } from "../simulation/Sun.tsx";

/** Brand icon: a small sun with the Genesis eclipse mark. */
export function Logo({ size = 32 }: { size?: number }) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="-10 -10 20 20" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-sun`} r="0.5">
          <stop offset="0" stopColor="#ffe27a" />
          <stop offset="0.7" stopColor="#ffab3d" />
          <stop offset="1" stopColor="#f76b15" />
        </radialGradient>
      </defs>
      <circle r="9.6" fill={`url(#${id}-sun)`} />
      <circle r="6.6" fill="#0d1330" stroke="#f3d58c" strokeWidth="0.35" />
      <g transform="scale(1.05)">
        <GenesisMark color="#f3d58c" />
      </g>
    </svg>
  );
}
