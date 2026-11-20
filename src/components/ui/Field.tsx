import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./Field.module.css";

interface FieldShellProps {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

function FieldShell({ id, label, error, className, children }: FieldShellProps) {
  return (
    <div className={`${styles.field} ${className ?? ""}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children}
      {/* Always rendered so screen readers announce errors as they appear. */}
      <p id={`${id}-error`} className={styles.error} aria-live="polite">
        {error}
      </p>
    </div>
  );
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  label: string;
  error?: string;
  placeholder?: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  fieldClassName?: string;
}

export function SelectField({ label, error, placeholder, options, fieldClassName, ...rest }: SelectFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} className={fieldClassName}>
      <div className={styles.selectWrap}>
        <select
          id={id}
          className={styles.control}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        >
          {placeholder !== undefined && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className={styles.chevron} aria-hidden="true" />
      </div>
    </FieldShell>
  );
}

interface NumberFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> {
  label: string;
  error?: string;
  fieldClassName?: string;
}

export function NumberField({ label, error, fieldClassName, ...rest }: NumberFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} className={fieldClassName}>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        className={styles.control}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
    </FieldShell>
  );
}

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  error?: string;
  fieldClassName?: string;
}

/** A labelled text input (type, inputMode and autoComplete are passed through). */
export function TextField({ label, error, fieldClassName, type = "text", ...rest }: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} className={fieldClassName}>
      <input
        id={id}
        type={type}
        className={styles.control}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
    </FieldShell>
  );
}
