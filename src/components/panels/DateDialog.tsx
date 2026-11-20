import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MAX_GREGORIAN_YEAR, MIN_GREGORIAN_YEAR } from "../../lib/gregorian.ts";
import { useSimulation } from "../../state/useSimulation.ts";
import { Dialog } from "../ui/Dialog.tsx";
import { SegmentedControl } from "../ui/SegmentedControl.tsx";
import { GregorianDateForm, HebrewDateForm } from "./DateForms.tsx";

type Calendar = "gregorian" | "hebrew";

export function DateDialog({ open, onClose }: { open: boolean; onClose(): void }) {
  const { t } = useTranslation();
  const { frame, goTo } = useSimulation();
  const [calendar, setCalendar] = useState<Calendar>("gregorian");

  const submit = (dayNumber: number) => {
    goTo(dayNumber);
    onClose();
  };

  const formProps = { initialDay: frame.dayNumber, onSubmit: submit, onCancel: onClose };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t("dialog.title")}
      description={t("dialog.description", { min: MIN_GREGORIAN_YEAR, max: MAX_GREGORIAN_YEAR })}
      closeLabel={t("dialog.close")}
    >
      <SegmentedControl<Calendar>
        label={t("dialog.calendar")}
        value={calendar}
        onChange={setCalendar}
        options={[
          { value: "gregorian", label: t("dialog.gregorian") },
          { value: "hebrew", label: t("dialog.hebrew") },
        ]}
      />
      {calendar === "gregorian" ? <GregorianDateForm {...formProps} /> : <HebrewDateForm {...formProps} />}
    </Dialog>
  );
}
