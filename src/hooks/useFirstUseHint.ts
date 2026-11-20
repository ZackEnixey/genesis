import { useCallback, useEffect, useState } from "react";

/**
 * A first-use hint for a control: shown until the control is used once (remembered for
 * good), with an inviting pulse that also stops after `pulseMs` on each visit.
 */
export function useFirstUseHint(key: string, pulseMs: number) {
  const storageKey = `genesis.hint.${key}`;
  const [used, setUsed] = useState(() => {
    try {
      return window.localStorage.getItem(storageKey) === "done";
    } catch {
      return false;
    }
  });
  const [pulsing, setPulsing] = useState(!used);

  useEffect(() => {
    if (!pulsing) return;
    const timer = window.setTimeout(() => setPulsing(false), pulseMs);
    return () => window.clearTimeout(timer);
  }, [pulsing, pulseMs]);

  const markUsed = useCallback(() => {
    setUsed(true);
    setPulsing(false);
    try {
      window.localStorage.setItem(storageKey, "done");
    } catch {
      // Not remembered in private mode; the hint simply shows again next time.
    }
  }, [storageKey]);

  return { showHint: !used, pulsing: pulsing && !used, markUsed };
}
