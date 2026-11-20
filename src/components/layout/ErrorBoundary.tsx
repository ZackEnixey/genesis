import { Component, type ErrorInfo, type ReactNode } from "react";
import i18n from "../../i18n/i18n.ts";
import styles from "./ErrorBoundary.module.css";

interface State {
  hasError: boolean;
}

/** Shows a friendly recovery screen instead of a blank page if rendering fails. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Technical details go to the console for debugging; users see a plain message.
    console.error("Genesis crashed while rendering:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    const t = i18n.t.bind(i18n);
    return (
      <main className={styles.fallback} role="alert">
        <h1 className={styles.title}>{t("errors.generic")}</h1>
        <p className={styles.body}>{t("errors.genericBody")}</p>
        <button type="button" className={styles.button} onClick={() => window.location.reload()}>
          {t("errors.reload")}
        </button>
      </main>
    );
  }
}
