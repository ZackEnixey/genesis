import { useTranslation } from "react-i18next";
import { formatGregorianShort } from "../../i18n/format.ts";
import type { Certificate } from "../../lib/quiz.ts";
import { Logo } from "../layout/Logo.tsx";
import { MoonPhase } from "../simulation/MoonPhase.tsx";
import styles from "./CertificateView.module.css";

/** Hebrew days showing the Moon's journey through one month, for the decorative border. */
const PHASE_DAYS = [1, 4, 8, 11, 15, 19, 22, 26];

/** The printable certificate. */
export function CertificateView({ certificate }: { certificate: Certificate }) {
  const { t, i18n } = useTranslation();
  const date = formatGregorianShort(certificate.issuedOn, i18n.language);

  return (
    <div className={styles.certificate} data-certificate>
      <div className={styles.inner}>
        <div className={styles.seal}>
          <Logo size={72} />
        </div>
        <p className={styles.brand}>GENESIS</p>
        <h2 className={styles.heading}>{t("cert.heading")}</h2>
        <p className={styles.presented}>{t("cert.presentedTo")}</p>
        <p className={styles.name}>{certificate.name}</p>
        <div className={styles.rule} />
        <p className={styles.achievement}>{t("cert.achievement")}</p>

        <div className={styles.phases} aria-hidden="true">
          {PHASE_DAYS.map((day) => (
            <MoonPhase key={day} hebrewDay={day} className={styles.phase} />
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerItem}>
            <span className={styles.footerValue}>{t("cert.score", { score: certificate.score, total: certificate.total })}</span>
            <span className={styles.footerLabel}>{t("cert.issued", { date })}</span>
          </div>
          <div className={styles.footerItem}>
            <span className={styles.signature}>Genesis</span>
            <span className={styles.footerLabel}>{t("cert.signature")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
