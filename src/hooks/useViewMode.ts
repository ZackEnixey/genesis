import { useEffect, useState } from "react";

export type ViewMode = "circle" | "horizontal" | "spiral";
const STORAGE_KEY = "genesis.view";

function readViewMode(): ViewMode {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "horizontal" || saved === "spiral" ? saved : "circle";
  } catch {
    return "circle";
  }
}

/** Circular, horizontal or spiral model, remembered between visits. */
export function useViewMode(): [ViewMode, (mode: ViewMode) => void] {
  const [mode, setMode] = useState<ViewMode>(readViewMode);
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Remembering the view is optional.
    }
  }, [mode]);
  return [mode, setMode];
}
