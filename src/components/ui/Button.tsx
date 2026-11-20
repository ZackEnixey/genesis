import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

interface BaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  /** Places the icon after the label. */
  iconEnd?: boolean;
  fullWidth?: boolean;
}

/** Icon-only buttons must provide an accessible name. */
type Props = BaseProps & ({ children: ReactNode } | { children?: undefined; "aria-label": string });

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  iconEnd = false,
  fullWidth = false,
  className,
  children,
  type = "button",
  ...rest
}: Props) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    children ? "" : styles.iconOnly,
    fullWidth ? styles.fullWidth : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...rest}>
      {icon && !iconEnd && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      {children && <span>{children}</span>}
      {icon && iconEnd && <span className={styles.icon} aria-hidden="true">{icon}</span>}
    </button>
  );
}
