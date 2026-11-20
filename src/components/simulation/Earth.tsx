import { useId } from "react";
import { EARTH_LAND_PATH } from "./earthLand.ts";

/**
 * The Earth seen from above the North Pole, the natural view for a model drawn from
 * above the plane of the orbit. Spinning the disc is the Earth's daily rotation.
 */
export function Earth({ className }: { className?: string }) {
  const id = useId();
  const ids = {
    ocean: `${id}-ocean`,
    land: `${id}-land`,
    ice: `${id}-ice`,
    shade: `${id}-shade`,
    clip: `${id}-clip`,
  };

  return (
    <svg className={className} viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={ids.ocean} cx="0" cy="0" r="50" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3f8fd8" />
          <stop offset="0.65" stopColor="#1d64b0" />
          <stop offset="1" stopColor="#0d3b78" />
        </radialGradient>
        <radialGradient id={ids.land} cx="0" cy="0" r="50" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#c8d9b0" />
          <stop offset="0.35" stopColor="#7fbf6a" />
          <stop offset="0.8" stopColor="#4f9a4a" />
          <stop offset="1" stopColor="#a58b55" />
        </radialGradient>
        <radialGradient id={ids.ice} cx="0" cy="0" r="9" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.6" stopColor="#f1f6ff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={ids.shade} cx="0" cy="0" r="50" gradientUnits="userSpaceOnUse">
          <stop offset="0.55" stopColor="#000814" stopOpacity="0" />
          <stop offset="1" stopColor="#000814" stopOpacity="0.55" />
        </radialGradient>
        <clipPath id={ids.clip}>
          <circle r="49.5" />
        </clipPath>
      </defs>

      <circle r="50" fill={`url(#${ids.ocean})`} />
      <g clipPath={`url(#${ids.clip})`}>
        <path d={EARTH_LAND_PATH} fill={`url(#${ids.land})`} stroke="#2b5a2b" strokeOpacity="0.35" strokeWidth="0.4" strokeLinejoin="round" />
        <circle r="9" fill={`url(#${ids.ice})`} />
      </g>
      <circle r="50" fill={`url(#${ids.shade})`} />
      {/* Thin atmosphere */}
      <circle r="49.2" fill="none" stroke="#9fd3ff" strokeOpacity="0.55" strokeWidth="1.2" />
    </svg>
  );
}
