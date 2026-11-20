import { Info, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useHashRoute } from "../../hooks/useHashRoute.ts";
import styles from "./AppHeader.module.css";
import { LanguagePicker } from "./LanguagePicker.tsx";
import { Logo } from "./Logo.tsx";

export function AppHeader() {
  const { t } = useTranslation();
  const route = useHashRoute();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#" aria-current={route === "home" ? "page" : undefined}>
          <span className={styles.logo}>
            <Logo />
          </span>
          <span className={styles.wordmark}>{t("app.name")}</span>
        </a>

        <nav className={styles.nav} aria-label={t("app.name")}>
          <a className={styles.navLink} href="#quiz" aria-current={route === "quiz" || route === "certificate" ? "page" : undefined}>
            <Trophy className={styles.navIcon} aria-hidden="true" />
            <span>{t("quiz.nav")}</span>
          </a>
          <a className={styles.navLink} href="#about" aria-current={route === "about" ? "page" : undefined}>
            <Info className={styles.navIcon} aria-hidden="true" />
            <span>{t("about.nav")}</span>
          </a>
          <LanguagePicker />
        </nav>
      </div>
    </header>
  );
}
