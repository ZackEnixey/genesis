import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button.tsx";
import styles from "./Dialog.module.css";

interface Props {
  open: boolean;
  onClose(): void;
  title: string;
  description?: string;
  closeLabel: string;
  /** Cover the whole screen (used for pickers on phones). */
  fullscreen?: boolean;
  children: ReactNode;
}

/**
 * Modal dialog built on the native <dialog> element: focus is trapped, the page behind
 * becomes inert, Escape closes it and focus returns to the opening control.
 * On small screens it is presented as a bottom sheet.
 */
export function Dialog({ open, onClose, title, description, closeLabel, fullscreen = false, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`${styles.dialog} ${fullscreen ? styles.fullscreen : ""}`}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // A click on the backdrop targets the <dialog> element itself.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <div>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className={styles.description}>
                {description}
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm" icon={<X />} aria-label={closeLabel} onClick={onClose} />
        </header>
        {open && children}
      </div>
    </dialog>
  );
}
