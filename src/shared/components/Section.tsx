import type { ReactNode } from "react";
import styles from "./Section.module.css";

type SectionTone = "default" | "alt" | "dark";

interface SectionProps {
  id?: string;
  tone?: SectionTone;
  noTopPadding?: boolean;
  noBottomPadding?: boolean;
  children: ReactNode;
}

export function Section({
  id,
  tone = "default",
  noTopPadding = false,
  noBottomPadding = false,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${styles.section} ${styles[tone]} ${noTopPadding ? styles.noTopPadding : ""} ${noBottomPadding ? styles.noBottomPadding : ""}`}
    >
      <div className={styles.container}>{children}</div>
    </section>
  );
}
