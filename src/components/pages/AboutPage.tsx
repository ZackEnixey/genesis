import { ArrowLeft, CalendarHeart, MoonStar, Orbit } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import creatorPortrait from "../../assets/creator.webp";
import { Logo } from "../layout/Logo.tsx";
import styles from "./AboutPage.module.css";

export function AboutPage() {
  const { t } = useTranslation();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the page title so keyboard and screen-reader users land on the new page.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    headingRef.current?.focus();
  }, []);

  const ideas = [
    { icon: CalendarHeart, text: t("about.try1") },
    { icon: MoonStar, text: t("about.try2") },
    { icon: Orbit, text: t("about.try3") },
  ];

  return (
    <article className={styles.page} aria-labelledby="about-title">
      <a href="#" className={styles.back}>
        <ArrowLeft className={styles.backIcon} aria-hidden="true" />
        {t("about.back")}
      </a>

      <header className={styles.hero}>
        <Logo size={64} />
        <h1 id="about-title" ref={headingRef} tabIndex={-1} className={styles.title}>
          {t("about.title")}
        </h1>
        <p className={styles.lead}>{t("about.lead")}</p>
      </header>

      <section className={styles.card} aria-labelledby="about-game">
        <h2 id="about-game" className={styles.heading}>
          {t("about.gameTitle")}
        </h2>
        <p className={styles.text}>{t("about.gameBody")}</p>
      </section>

      <section className={styles.card} aria-labelledby="about-try">
        <h2 id="about-try" className={styles.heading}>
          {t("about.tryTitle")}
        </h2>
        <ul className={styles.ideas}>
          {ideas.map(({ icon: Icon, text }) => (
            <li key={text} className={styles.idea}>
              <span className={styles.ideaIcon} aria-hidden="true">
                <Icon />
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${styles.card} ${styles.creator}`} aria-labelledby="about-creator">
        <img
          className={styles.portrait}
          src={creatorPortrait}
          alt={t("about.creatorImageAlt")}
          width={160}
          height={160}
          loading="lazy"
          decoding="async"
        />
        <div className={styles.creatorText}>
          <h2 id="about-creator" className={styles.heading}>
            {t("about.creatorTitle")}
          </h2>
          <p className={styles.text}>{t("about.creatorBody")}</p>
          <p className={styles.text}>{t("about.creatorBody2")}</p>
          <p className={styles.thanks}>{t("about.creatorThanks")}</p>
        </div>
      </section>
    </article>
  );
}
