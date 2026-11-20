import { CalendarDays, Info, Sparkles, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "../../hooks/useMediaQuery.ts";
import { formatGregorianShort, formatHebrewDate, formatWeekday } from "../../i18n/format.ts";
import { holidaysOn } from "../../lib/holidays.ts";
import { moonPhaseAngle } from "../../lib/simulation.ts";
import { useSimulation } from "../../state/useSimulation.ts";
import { MoonPhase } from "../simulation/MoonPhase.tsx";
import { Button } from "../ui/Button.tsx";
import { Card } from "../ui/Card.tsx";
import { Dialog } from "../ui/Dialog.tsx";
import styles from "./DateSummary.module.css";

type Topic = "month" | "phase";

/** Small ⓘ button that opens a topic's explanation. */
function InfoButton(props: { label: string; expanded: boolean; controls?: string; onClick(): void }) {
  return (
    <button
      type="button"
      className={styles.infoButton}
      aria-label={props.label}
      title={props.label}
      aria-expanded={props.expanded}
      aria-controls={props.controls}
      onClick={props.onClick}
    >
      <Info aria-hidden="true" />
    </button>
  );
}

export function DateSummary({ onChangeDate, className }: { onChangeDate(): void; className?: string }) {
  const { t, i18n } = useTranslation();
  const { frame } = useSimulation();
  const { hebrew } = frame;
  const isPhone = useMediaQuery("(max-width: 639px)");
  const [topic, setTopic] = useState<Topic | null>(null);
  const panelId = useId();
  const panelRef = useRef<HTMLElement>(null);

  // Bring a newly opened explanation into view (the side panel may need to scroll).
  useEffect(() => {
    if (topic && !isPhone) panelRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [topic, isPhone]);

  const language = i18n.language;
  const weekday = formatWeekday(frame.dayNumber, language);
  const date = formatGregorianShort(frame.dayNumber, language);
  const hebrewDate = formatHebrewDate(hebrew, t);
  const phaseName = t(`phase.${frame.moonPhase}`);
  const monthName = t(`hebrewMonths.${hebrew.month}`);
  const holidays = holidaysOn(frame.dayNumber, hebrew);
  const toggle = (next: Topic) => setTopic((current) => (current === next ? null : next));

  // The explanation follows the date, so it updates live while stepping through time.
  const info: { title: string; body: ReactNode } | null =
    topic === "phase"
      ? {
          title: phaseName,
          body: (
            <>
              <p>{t(`phaseInfo.${frame.moonPhase}`)}</p>
              <p className={styles.infoMeta}>{t("info.angle", { angle: Math.round(moonPhaseAngle(hebrew.day)) })}</p>
            </>
          ),
        }
      : topic === "month"
        ? { title: monthName, body: <p>{t(`monthInfo.${hebrew.month}`)}</p> }
        : null;

  return (
    <Card
      title={t("summary.title")}
      className={className}
      actions={
        <Button size="sm" variant="ghost" icon={<CalendarDays />} onClick={onChangeDate}>
          {t("summary.change")}
        </Button>
      }
    >
      {/* One short announcement per change, instead of re-reading the whole card. */}
      <p className="visually-hidden" aria-live="polite">
        {t("info.announce", { date: `${weekday} ${date}`, hebrew: hebrewDate, phase: phaseName })}
      </p>

      <div className={styles.body}>
        <dl className={styles.dates}>
          <div>
            <dt className={styles.term}>{t("summary.gregorian")}</dt>
            <dd className={styles.gregorian}>
              <span className={styles.weekday}>{weekday}</span>
              <span className={styles.primary}>{date}</span>
            </dd>
          </div>
          <div>
            <dt className={styles.term}>{t("summary.hebrew")}</dt>
            <dd className={styles.row}>
              <span className={styles.hebrew}>{hebrewDate}</span>
              <InfoButton
                label={t("info.about", { name: monthName })}
                expanded={topic === "month"}
                controls={!isPhone && topic === "month" ? panelId : undefined}
                onClick={() => toggle("month")}
              />
            </dd>
            {holidays.length > 0 && (
              <dd className={styles.holidays} aria-label={t("info.holidays")}>
                {holidays.map((key) => (
                  <span key={key} className={styles.holiday}>
                    <Sparkles aria-hidden="true" />
                    {t(`holidays.${key}`)}
                  </span>
                ))}
              </dd>
            )}
          </div>
        </dl>

        <div className={styles.moon}>
          <MoonPhase hebrewDay={hebrew.day} />
          <div>
            <p className={styles.term}>{t("summary.moon")}</p>
            <p className={styles.row}>
              <span className={styles.phase}>{phaseName}</span>
              <InfoButton
                label={t("info.about", { name: phaseName })}
                expanded={topic === "phase"}
                controls={!isPhone && topic === "phase" ? panelId : undefined}
                onClick={() => toggle("phase")}
              />
            </p>
            <p className={styles.note}>{t("summary.hebrewDay", { day: hebrew.day })}</p>
          </div>
        </div>
      </div>

      {/* Larger screens: an inline panel that stays open while you travel through time. */}
      {!isPhone && info && (
        <section ref={panelRef} id={panelId} className={styles.infoPanel} aria-label={info.title}>
          <header className={styles.infoHeader}>
            <h3 className={styles.infoTitle}>{info.title}</h3>
            <button type="button" className={styles.infoClose} aria-label={t("dialog.close")} onClick={() => setTopic(null)}>
              <X aria-hidden="true" />
            </button>
          </header>
          <div className={styles.infoBody}>{info.body}</div>
        </section>
      )}

      {/* Phones: a sheet to read and close. */}
      {isPhone && (
        <Dialog open={info !== null} onClose={() => setTopic(null)} title={info?.title ?? ""} closeLabel={t("dialog.close")}>
          <div className={styles.infoBody}>{info?.body}</div>
        </Dialog>
      )}
    </Card>
  );
}
