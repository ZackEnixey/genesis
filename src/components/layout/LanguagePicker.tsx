import { Check, ChevronDown, Globe } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { intlLocale } from "../../i18n/format.ts";
import { LANGUAGES, resolveLanguage, type LanguageCode } from "../../i18n/i18n.ts";
import { useMediaQuery } from "../../hooks/useMediaQuery.ts";
import { Dialog } from "../ui/Dialog.tsx";
import styles from "./LanguagePicker.module.css";

interface ListProps {
  current: LanguageCode;
  label: string;
  onSelect(code: LanguageCode): void;
  onClose(): void;
}

/** Keyboard-friendly list of languages (arrow keys, Home/End, Enter/Space, Escape). */
function LanguageList({ current, label, onSelect, onClose }: ListProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const { i18n } = useTranslation();

  // Each language's name in the current interface language, e.g. "Español", "Spanish".
  const localNames = useMemo(() => {
    try {
      const names = new Intl.DisplayNames([intlLocale(i18n.language)], { type: "language" });
      return Object.fromEntries(LANGUAGES.map((l) => [l.code, names.of(l.code) ?? ""]));
    } catch {
      return {} as Record<string, string>;
    }
  }, [i18n.language]);

  // Focus the selected language. Deferred one frame so it wins over the dialog's own
  // initial focus when the list is shown full-screen on phones.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const options = [...(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])];
    const index = options.indexOf(document.activeElement as HTMLElement);
    const focusAt = (i: number) => options[(i + options.length) % options.length]?.focus();
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusAt(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusAt(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusAt(0);
        break;
      case "End":
        event.preventDefault();
        focusAt(options.length - 1);
        break;
      case "Enter":
      case " ": {
        event.preventDefault();
        const code = options[index]?.dataset.code as LanguageCode | undefined;
        if (code) onSelect(code);
        break;
      }
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        onClose();
        break;
      case "Tab":
        onClose();
        break;
    }
  }

  return (
    <ul ref={listRef} role="listbox" aria-label={label} className={styles.list} onKeyDown={handleKeyDown}>
      {LANGUAGES.map((language) => {
        const selected = language.code === current;
        const localName = localNames[language.code];
        return (
          <li
            key={language.code}
            role="option"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            data-code={language.code}
            className={styles.option}
            onClick={() => onSelect(language.code)}
          >
            <span className={styles.names}>
              <span lang={language.code} dir={language.dir} className={styles.native}>
                {language.nativeName}
              </span>
              {localName && localName.toLowerCase() !== language.nativeName.toLowerCase() && (
                <span className={styles.local}>{localName}</span>
              )}
            </span>
            {selected && <Check className={styles.check} aria-hidden="true" />}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Language switcher: a dropdown on larger screens, a full-screen list on phones.
 */
export function LanguagePicker() {
  const { t, i18n } = useTranslation();
  const isPhone = useMediaQuery("(max-width: 639px)");
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();
  const current = resolveLanguage(i18n.resolvedLanguage ?? i18n.language);
  const currentLanguage = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };
  const choose = (code: LanguageCode) => {
    close();
    void i18n.changeLanguage(code);
  };

  // Desktop dropdown: close on a click outside.
  useEffect(() => {
    if (!open || isPhone) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, isPhone]);

  const label = t("language.label");

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open && !isPhone ? popoverId : undefined}
        aria-label={`${label}: ${currentLanguage.nativeName}`}
        onClick={() => setOpen((value) => !value)}
      >
        <Globe className={styles.icon} aria-hidden="true" />
        <span lang={currentLanguage.code}>{currentLanguage.nativeName}</span>
        <ChevronDown className={`${styles.icon} ${open ? styles.flipped : ""}`} aria-hidden="true" />
      </button>

      {open && !isPhone && (
        <div id={popoverId} className={styles.popover}>
          <LanguageList current={current} label={label} onSelect={choose} onClose={() => close()} />
        </div>
      )}

      {isPhone && (
        <Dialog open={open} onClose={() => close()} title={label} closeLabel={t("dialog.close")} fullscreen>
          <LanguageList current={current} label={label} onSelect={choose} onClose={() => close()} />
        </Dialog>
      )}
    </div>
  );
}
