import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import { clampDayNumber, todayDayNumber, type DayNumber } from "../lib/gregorian.ts";
import {
  TRANSITION_SECONDS,
  computeSimulation,
  earthOrbitDegForDay,
  shortestRotation,
  stepDate,
  type SimulationFrame,
  type StepUnit,
} from "../lib/simulation.ts";

export interface SimulationContextValue {
  frame: SimulationFrame;
  /** Duration of the current animation, in seconds. */
  transitionSeconds: number;
  /**
   * Accumulated rotation of the night sky. It follows the Earth's orbit when stepping,
   * and takes the shortest way round after a jump so the sky never spins wildly.
   */
  skyDeg: number;
  goTo(dayNumber: DayNumber): void;
  /** `repeating` steps (press and hold) animate faster so the motion feels continuous. */
  step(unit: StepUnit, direction: 1 | -1, repeating?: boolean): void;
  goToday(): void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const SimulationContext = createContext<SimulationContextValue | null>(null);

/** Animation length while a step button is held down. */
const REPEAT_TRANSITION_SECONDS = 0.45;

interface State {
  dayNumber: DayNumber;
  transitionSeconds: number;
  skyDeg: number;
}

export function SimulationProvider({ children, initialDay }: { children: ReactNode; initialDay?: DayNumber }) {
  const [state, setState] = useState<State>(() => {
    const dayNumber = clampDayNumber(initialDay ?? todayDayNumber());
    return { dayNumber, transitionSeconds: 0, skyDeg: shortestRotation(earthOrbitDegForDay(dayNumber)) };
  });

  const goTo = useCallback((target: DayNumber) => {
    setState((prev) => {
      const dayNumber = clampDayNumber(target);
      const delta = earthOrbitDegForDay(dayNumber) - earthOrbitDegForDay(prev.dayNumber);
      return { dayNumber, transitionSeconds: TRANSITION_SECONDS.jump, skyDeg: prev.skyDeg + shortestRotation(delta) };
    });
  }, []);

  const step = useCallback((unit: StepUnit, direction: 1 | -1, repeating = false) => {
    setState((prev) => {
      const dayNumber = clampDayNumber(stepDate(prev.dayNumber, unit, direction));
      const delta = earthOrbitDegForDay(dayNumber) - earthOrbitDegForDay(prev.dayNumber);
      return {
        dayNumber,
        transitionSeconds: repeating ? REPEAT_TRANSITION_SECONDS : TRANSITION_SECONDS[unit],
        skyDeg: prev.skyDeg + delta,
      };
    });
  }, []);

  const goToday = useCallback(() => goTo(todayDayNumber()), [goTo]);

  const frame = useMemo(() => computeSimulation(state.dayNumber), [state.dayNumber]);

  const value = useMemo<SimulationContextValue>(
    () => ({ frame, transitionSeconds: state.transitionSeconds, skyDeg: state.skyDeg, goTo, step, goToday }),
    [frame, state.transitionSeconds, state.skyDeg, goTo, step, goToday],
  );

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}
