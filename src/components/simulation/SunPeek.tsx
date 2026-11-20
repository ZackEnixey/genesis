import { Sun } from "./Sun.tsx";
import styles from "./SunPeek.module.css";

/** The Sun rising from the bottom of the page, glowing behind the time-travel controls. */
export function SunPeek() {
  return (
    <svg className={styles.sun} viewBox="-18 -18 36 36" aria-hidden="true" focusable="false">
      <Sun />
    </svg>
  );
}
