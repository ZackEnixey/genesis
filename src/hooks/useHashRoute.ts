import { useSyncExternalStore } from "react";

export type Route = "home" | "about" | "quiz" | "certificate";

function readRoute(): Route {
  if (window.location.hash === "#about") return "about";
  if (window.location.hash === "#quiz") return "quiz";
  if (window.location.hash === "#certificate") return "certificate";
  return "home";
}

function subscribe(notify: () => void) {
  window.addEventListener("hashchange", notify);
  return () => window.removeEventListener("hashchange", notify);
}

/**
 * Tiny hash router: "#about" and "#quiz" show those pages, anything else the model.
 * Hash links work on GitHub Pages without server configuration, and the browser's
 * back button behaves as expected.
 */
export function useHashRoute(): Route {
  return useSyncExternalStore(subscribe, readRoute, () => "home");
}
