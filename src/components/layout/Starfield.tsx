import { memo, useEffect, useId, useMemo, useState, type CSSProperties } from "react";
import { useSimulation } from "../../state/useSimulation.ts";
import styles from "./Starfield.module.css";

/** Small deterministic PRNG (mulberry32) so the sky is identical on every visit. */
function createRandom(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Star colours by temperature: blue-white, white, warm white, pale gold. */
const STAR_COLORS = ["#d4e0ff", "#ffffff", "#ffffff", "#fff6e6", "#ffe7c2"] as const;

interface Star {
  x: number;
  y: number;
  /** Radius of the glow; the bright core is about a third of it. */
  r: number;
  opacity: number;
  color: number;
}

interface Twinkle {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

interface LayerSpec {
  count: number;
  rMin: number;
  rMax: number;
  /** How strongly this layer follows the Earth's orbit: nearer layers move more (parallax). */
  factor: number;
  twinkles: number;
  milkyWay?: boolean;
}

const LAYERS: LayerSpec[] = [
  { count: 260, rMin: 0.9, rMax: 1.5, factor: 0.12, twinkles: 0, milkyWay: true },
  { count: 120, rMin: 1.4, rMax: 2.2, factor: 0.22, twinkles: 8 },
  { count: 28, rMin: 2, rMax: 3, factor: 0.35, twinkles: 8 },
];

// Layers are squares of side 1000 units centred on (0, 0).
function buildLayer(spec: LayerSpec, seed: number) {
  const random = createRandom(seed);
  const stars: Star[] = [];
  for (let i = 0; i < spec.count; i++) {
    stars.push({
      x: random() * 1000 - 500,
      y: random() * 1000 - 500,
      r: spec.rMin + (spec.rMax - spec.rMin) * Math.pow(random(), 2.5),
      opacity: 0.55 + 0.45 * Math.pow(random(), 1.6),
      color: Math.floor(random() * STAR_COLORS.length),
    });
  }
  if (spec.milkyWay) {
    // A gentle concentration of stars along the Milky Way (Gaussian spread across the band).
    const angle = (-28 * Math.PI) / 180;
    for (let i = 0; i < 140; i++) {
      const along = random() * 1100 - 550;
      const gauss = Math.sqrt(-2 * Math.log(random() + 1e-9)) * Math.cos(2 * Math.PI * random());
      const across = gauss * 50;
      stars.push({
        x: along * Math.cos(angle) - across * Math.sin(angle),
        y: along * Math.sin(angle) + across * Math.cos(angle),
        r: 0.8 + random() * 0.5,
        opacity: 0.45 + random() * 0.35,
        color: 0,
      });
    }
  }
  // Keep twinkles in the middle of the oversized layer, where they are visible.
  const twinkles: Twinkle[] = Array.from({ length: spec.twinkles }, () => ({
    left: 18 + random() * 64,
    top: 18 + random() * 64,
    size: 5 + random() * 3, // px, no bigger than an ordinary bright star
    duration: 3 + random() * 4,
    delay: -random() * 7,
  }));
  return { stars, twinkles };
}

const StarLayer = memo(function StarLayer({ spec, seed }: { spec: LayerSpec; seed: number }) {
  const id = useId();
  const { stars, twinkles } = useMemo(() => buildLayer(spec, seed), [spec, seed]);
  const glow = (color: number) => `${id}-glow-${color}`;

  return (
    <div className={styles.layer} style={{ "--factor": spec.factor } as CSSProperties}>
      <svg className={styles.svg} viewBox="-500 -500 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Soft glowing point: bright core, quick fall-off, faint halo. */}
          {STAR_COLORS.map((color, i) => (
            <radialGradient key={color + i} id={glow(i)}>
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.18" stopColor={color} stopOpacity="0.95" />
              <stop offset="0.4" stopColor={color} stopOpacity="0.28" />
              <stop offset="1" stopColor={color} stopOpacity="0" />
            </radialGradient>
          ))}
          <radialGradient id={`${id}-milky`}>
            <stop offset="0" stopColor="#c8c2ff" stopOpacity="0.14" />
            <stop offset="0.5" stopColor="#8f86ff" stopOpacity="0.06" />
            <stop offset="1" stopColor="#5b4bd6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {spec.milkyWay && (
          <g transform="rotate(-28)">
            <ellipse rx="620" ry="120" fill={`url(#${id}-milky)`} />
            <ellipse cx="120" cy="10" rx="300" ry="60" fill={`url(#${id}-milky)`} />
          </g>
        )}

        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.x.toFixed(1)}
            cy={s.y.toFixed(1)}
            r={s.r.toFixed(2)}
            fill={`url(#${glow(s.color)})`}
            opacity={s.opacity.toFixed(2)}
          />
        ))}
      </svg>

      {twinkles.map((tw, i) => (
        <span
          key={i}
          className={styles.twinkle}
          style={{
            left: `${tw.left}%`,
            top: `${tw.top}%`,
            width: `${tw.size}px`,
            height: `${tw.size}px`,
            animationDuration: `${tw.duration}s`,
            animationDelay: `${tw.delay}s`,
          }}
        />
      ))}
    </div>
  );
});

interface Shot {
  id: number;
  top: number;
  left: number;
  angle: number;
  distance: number;
  length: number;
  duration: number;
}

/** A random range [min, max). */
type Range = readonly [number, number];
const pick = ([min, max]: Range) => min + Math.random() * (max - min);

interface ShootingStarConfig {
  firstDelayMs: number;
  intervalMs: number;
  jitterMs: number;
  /** % of viewport height */
  top: Range;
  /** % of viewport width */
  left: Range;
  /** Direction of travel in degrees: about 0 = left to right, about 180 = right to left. */
  angle: Range;
  /** vw */
  distance: Range;
}

/** Upper sky, left to right, about once a minute. */
const UPPER_STAR: ShootingStarConfig = {
  firstDelayMs: 8_000,
  intervalMs: 60_000,
  jitterMs: 8_000,
  top: [9, 16], // just below the header
  left: [22, 36], // starts past the side panel
  angle: [3, 7], // almost level, gently descending
  distance: [34, 44],
};

/** Lower sky, right to left, about every two minutes. Offset so the two never coincide. */
const LOWER_STAR: ShootingStarConfig = {
  firstDelayMs: 38_000,
  intervalMs: 120_000,
  jitterMs: 10_000,
  top: [76, 84], // below the model, above the time controls
  left: [72, 86], // starts near the right edge
  angle: [173, 177], // right to left, gently descending
  distance: [32, 42],
};

/** A faint shooting star that crosses part of the sky now and then. */
function ShootingStar({ config }: { config: ShootingStarConfig }) {
  const [shot, setShot] = useState<Shot | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    let timer: number;
    let count = 0;
    const schedule = (delay: number) => {
      timer = window.setTimeout(() => {
        // Skip while the tab is in the background; try again at the next interval.
        if (document.visibilityState === "visible") {
          setShot({
            id: ++count,
            top: pick(config.top),
            left: pick(config.left),
            angle: pick(config.angle),
            distance: pick(config.distance),
            length: pick([90, 140]), // px
            duration: pick([2.4, 3.2]), // s
          });
        }
        schedule(config.intervalMs + (Math.random() * 2 - 1) * config.jitterMs);
      }, delay);
    };
    schedule(config.firstDelayMs);
    return () => window.clearTimeout(timer);
  }, [config]);

  if (!shot) return null;
  return (
    <span
      key={shot.id}
      className={styles.shootingStar}
      onAnimationEnd={() => setShot(null)}
      style={
        {
          top: `${shot.top}%`,
          left: `${shot.left}%`,
          width: `${shot.length}px`,
          "--angle": `${shot.angle}deg`,
          "--distance": `${shot.distance}vw`,
          animationDuration: `${shot.duration}s`,
        } as CSSProperties
      }
    />
  );
}

/**
 * Procedural night sky behind the app. Three layers turn with the Earth's orbit at
 * different rates, so travelling through the months makes the sky drift with depth.
 */
export function Starfield() {
  const { skyDeg, transitionSeconds } = useSimulation();
  const style = { "--sky": `${skyDeg}deg`, "--sky-transition": `${transitionSeconds}s` } as CSSProperties;
  return (
    <div className={styles.starfield} style={style} aria-hidden="true">
      <div className={styles.nebula} />
      {LAYERS.map((spec, i) => (
        <StarLayer key={i} spec={spec} seed={1940 + i * 97} />
      ))}
      <ShootingStar config={UPPER_STAR} />
      <ShootingStar config={LOWER_STAR} />
    </div>
  );
}
