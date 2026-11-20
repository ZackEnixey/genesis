import { describe, expect, it } from "vitest";
import { toDayNumber } from "./gregorian.ts";
import { gregorianCoordinate, hebrewCoordinate, mod, moonScreenAngle } from "./horizontal.ts";
import { computeSimulation } from "./simulation.ts";

const HEBREW_STRIP = ["tevet", "shvat", "adar", "nisan", "iyyar", "sivan", "tamuz", "av", "elul", "tishrei", "cheshvan", "kislev"];
const frameOn = (y: number, m: number, d: number) => computeSimulation(toDayNumber({ year: y, month: m, day: d }));

describe("horizontal view mapping", () => {
  it.each([
    [[2026, 11, 20], 10, "kislev"], // November, 10 Kislev
    [[2024, 4, 23], 3, "nisan"], // April, 15 Nisan
    [[2025, 1, 15], 0, "tevet"], // January, 15 Tevet
    [[2024, 7, 10], 6, "tamuz"], // July, 4 Tammuz
  ] as const)("on %j the Earth is over Gregorian month %i and Hebrew month %s", ([y, m, d], month, hebrew) => {
    const frame = frameOn(y, m, d);
    const g = gregorianCoordinate(frame.earthOrbitDeg);
    expect(mod(Math.round(g), 12)).toBe(month);
    expect(HEBREW_STRIP[mod(Math.round(hebrewCoordinate(g, frame.hebrewRingDeg)), 12)]).toBe(hebrew);
  });

  it("moves forward about one month per month", () => {
    const a = gregorianCoordinate(frameOn(2024, 1, 1).earthOrbitDeg);
    const b = gregorianCoordinate(frameOn(2024, 7, 1).earthOrbitDeg);
    expect(b - a).toBeGreaterThan(5.8);
    expect(b - a).toBeLessThan(6.2);
  });

  it("puts the new Moon towards the Sun (below) and the full Moon away from it (above)", () => {
    expect(mod(moonScreenAngle(frameOn(2024, 4, 9).moonOrbitDeg), 360)).toBeCloseTo(90, 0); // 1 Nisan
    expect(mod(moonScreenAngle(frameOn(2024, 4, 23).moonOrbitDeg), 360)).toBeCloseTo(270, 0); // 15 Nisan
  });
});
