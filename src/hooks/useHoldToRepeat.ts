import { useCallback, useEffect, useRef, type MouseEvent, type PointerEvent } from "react";

/** Wait this long before a held button starts repeating. */
const HOLD_DELAY_MS = 400;

/**
 * Press-and-hold behaviour for a button: one action on press, then repeated actions
 * every `intervalMs` while it is held. Keyboard users get the same effect from their
 * key's own auto-repeat, which fires repeated clicks.
 */
export function useHoldToRepeat(action: (repeating: boolean) => void, intervalMs: number) {
  const actionRef = useRef(action);
  const timers = useRef<{ delay?: number; repeat?: number }>({});

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  const stop = useCallback(() => {
    window.clearTimeout(timers.current.delay);
    window.clearInterval(timers.current.repeat);
    timers.current = {};
  }, []);

  useEffect(() => stop, [stop]);

  return {
    onPointerDown(event: PointerEvent<HTMLButtonElement>) {
      if (event.button !== 0 || event.currentTarget.disabled) return;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      stop();
      actionRef.current(false);
      timers.current.delay = window.setTimeout(() => {
        timers.current.repeat = window.setInterval(() => actionRef.current(true), intervalMs);
      }, HOLD_DELAY_MS);
    },
    onPointerUp: stop,
    onPointerCancel: stop,
    onLostPointerCapture: stop,
    // Pointer presses are handled above; clicks with detail 0 come from the keyboard.
    onClick(event: MouseEvent<HTMLButtonElement>) {
      if (event.detail === 0) actionRef.current(false);
    },
    // Stop the long-press menu on touch screens.
    onContextMenu(event: MouseEvent<HTMLButtonElement>) {
      event.preventDefault();
    },
  };
}
