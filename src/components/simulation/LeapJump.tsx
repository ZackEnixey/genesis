import { ArrowLeft, ArrowRight, RotateCcw, RotateCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { LeapJump } from "../../hooks/useLeapJump.ts";
import styles from "./LeapJump.module.css";

/**
 * Explains the correction. In the horizontal view the arrow shows which way the Hebrew
 * strip slid; in the circular view it shows which way the Hebrew ring turned.
 */
export function LeapJumpBadge({ jump, shape, className }: { jump: LeapJump; shape: "line" | "circle"; className?: string }) {
  const { t } = useTranslation();
  // Forward in time the strip slides right and the ring turns anticlockwise.
  const Icon =
    shape === "line" ? (jump.direction === 1 ? ArrowRight : ArrowLeft) : jump.direction === 1 ? RotateCcw : RotateCw;
  const iconFirst = shape === "line" ? jump.direction === -1 : true;
  const icon = <Icon className={styles.arrow} data-motion={shape === "line" ? (jump.direction === 1 ? "right" : "left") : "spin"} aria-hidden="true" />;

  return (
    <div className={`${styles.badge} ${className ?? ""}`} role="status">
      {iconFirst && icon}
      <span>{t("view.leapJump")}</span>
      {!iconFirst && icon}
    </div>
  );
}
