import { useId } from "react";
import styles from "./SegmentedControl.module.css";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  /** Accessible name of the group (visually hidden). */
  label: string;
  options: ReadonlyArray<SegmentOption<T>>;
  value: T;
  onChange(value: T): void;
  className?: string;
}

/**
 * A set of mutually exclusive choices, built on native radio inputs so arrow-key
 * navigation and screen-reader semantics work out of the box.
 */
export function SegmentedControl<T extends string>({ label, options, value, onChange, className }: Props<T>) {
  const name = useId();
  return (
    <fieldset className={`${styles.group} ${className ?? ""}`}>
      <legend className="visually-hidden">{label}</legend>
      {options.map((option) => (
        <label key={option.value} className={styles.option}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
            className={styles.input}
          />
          <span className={styles.text}>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
