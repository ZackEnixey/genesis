import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { formatCardNumber, formatExpiry, isValidCardNumber, isValidCvc, isValidExpiry } from "../../lib/payment.ts";
import { Button } from "../ui/Button.tsx";
import { TextField } from "../ui/Field.tsx";
import styles from "./CheckoutForm.module.css";

/** Steps of the whole flow; the third ("Your certificate") is shown by the page. */
export const CHECKOUT_STEPS = 3;

type CardField = "card" | "expiry" | "cvc";
type DetailField = "name" | "address" | "city" | "postal" | "country";
type Errors = Partial<Record<CardField | DetailField, string>>;

export function StepIndicator({ current }: { current: number }) {
  const { t } = useTranslation();
  const labels = [t("cert.stepPayment"), t("cert.stepDetails"), t("cert.stepCertificate")];
  return (
    <div className={styles.steps}>
      <p className={styles.stepCount}>{t("cert.stepOf", { current, total: CHECKOUT_STEPS })}</p>
      <ol className={styles.stepList}>
        {labels.map((label, i) => (
          <li key={label} className={styles.step} data-state={i + 1 < current ? "done" : i + 1 === current ? "current" : "todo"}>
            <span className={styles.stepNumber} aria-hidden="true">{i + 1}</span>
            <span>{label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Demo checkout in two steps: card, then name and postal address. Payments are not
 * connected yet: nothing is charged, and the card details live only in this component's
 * memory (never stored or sent) and are cleared when the details are submitted.
 */
export function CheckoutForm({ onIssue }: { onIssue(details: { name: string; address: string }): void }) {
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2>(1);
  const [card, setCard] = useState({ card: "", expiry: "", cvc: "" });
  const [details, setDetails] = useState({ name: "", address: "", city: "", postal: "", country: "" });
  const [errors, setErrors] = useState<Errors>({});

  function submitPayment(event: FormEvent) {
    event.preventDefault();
    const found: Errors = {};
    if (!isValidCardNumber(card.card)) found.card = card.card.trim() ? t("cert.invalidCard") : t("cert.required");
    if (!isValidExpiry(card.expiry)) found.expiry = card.expiry.trim() ? t("cert.invalidExpiry") : t("cert.required");
    if (!isValidCvc(card.cvc)) found.cvc = card.cvc.trim() ? t("cert.invalidCvc") : t("cert.required");
    setErrors(found);
    if (Object.keys(found).length === 0) setStep(2);
  }

  function submitDetails(event: FormEvent) {
    event.preventDefault();
    const found: Errors = {};
    for (const key of Object.keys(details) as DetailField[]) if (!details[key].trim()) found[key] = t("cert.required");
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    const address = [details.address, `${details.postal} ${details.city}`.trim(), details.country].map((s) => s.trim()).join(", ");
    setCard({ card: "", expiry: "", cvc: "" }); // forget the card details straight away
    onIssue({ name: details.name.trim(), address });
  }

  return (
    <div className={styles.wrapper}>
      <StepIndicator current={step} />

      <p className={styles.notice}>
        <Info aria-hidden="true" />
        <span>{t("cert.demoNotice")}</span>
      </p>

      {step === 1 && (
        <form className={styles.form} noValidate onSubmit={submitPayment}>
          {/* Autofill is off for card fields: this is a demo, so nobody should enter a real card. */}
          <TextField
            label={t("cert.cardLabel")}
            value={card.card}
            error={errors.card}
            inputMode="numeric"
            autoComplete="off"
            placeholder="4242 4242 4242 4242"
            onChange={(e) => setCard((c) => ({ ...c, card: formatCardNumber(e.target.value) }))}
            fieldClassName={styles.wide}
            autoFocus
          />
          <TextField
            label={t("cert.expiryLabel")}
            value={card.expiry}
            error={errors.expiry}
            inputMode="numeric"
            autoComplete="off"
            placeholder="MM/YY"
            maxLength={5}
            onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
          />
          <TextField
            label={t("cert.cvcLabel")}
            value={card.cvc}
            error={errors.cvc}
            inputMode="numeric"
            autoComplete="off"
            maxLength={4}
            onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, "") }))}
          />
          <div className={`${styles.actions} ${styles.wide}`}>
            <Button variant="primary" type="submit" icon={<ArrowRight />} iconEnd>
              {t("cert.next")}
            </Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form className={styles.form} noValidate onSubmit={submitDetails}>
          {(
            [
              ["name", t("cert.nameLabel"), "name", true],
              ["address", t("cert.addressLabel"), "street-address", true],
              ["city", t("cert.cityLabel"), "address-level2", false],
              ["postal", t("cert.postalLabel"), "postal-code", false],
              ["country", t("cert.countryLabel"), "country-name", true],
            ] as const
          ).map(([key, label, autoComplete, wide]) => (
            <TextField
              key={key}
              label={label}
              value={details[key]}
              error={errors[key]}
              autoComplete={autoComplete}
              maxLength={key === "name" ? 60 : 120}
              autoFocus={key === "name"}
              onChange={(e) => setDetails((d) => ({ ...d, [key]: e.target.value }))}
              fieldClassName={wide ? styles.wide : undefined}
            />
          ))}
          <div className={`${styles.actions} ${styles.wide}`}>
            <Button variant="ghost" icon={<ArrowLeft />} onClick={() => setStep(1)}>
              {t("cert.back")}
            </Button>
            <Button variant="primary" type="submit" icon={<ArrowRight />} iconEnd>
              {t("cert.next")}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
