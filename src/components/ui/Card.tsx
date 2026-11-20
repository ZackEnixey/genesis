import { useId, type ReactNode } from "react";
import styles from "./Card.module.css";

interface Props {
  title?: string;
  /** Hide the title visually but keep it for assistive technology. */
  hideTitle?: boolean;
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Card({ title, hideTitle = false, actions, className, children }: Props) {
  const titleId = useId();
  return (
    <section className={`${styles.card} ${className ?? ""}`} aria-labelledby={title ? titleId : undefined}>
      {(title || actions) && (
        <header className={`${styles.header} ${hideTitle && !actions ? "visually-hidden" : ""}`}>
          {title && (
            <h2 id={titleId} className={hideTitle ? "visually-hidden" : styles.title}>
              {title}
            </h2>
          )}
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}
