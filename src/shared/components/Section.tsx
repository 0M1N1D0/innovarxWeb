import type { ReactNode } from "react";
import styles from "./Section.module.css";

type SectionTone = "default" | "alt" | "dark";

interface SectionProps {
  id?: string;
  tone?: SectionTone;
  noTopPadding?: boolean;
  children: ReactNode;
}

export function Section({ id, tone = "default", noTopPadding = false, children }: SectionProps) {
  return (
    <section
      id={id}
      className={`${styles.section} ${styles[tone]} ${noTopPadding ? styles.noTopPadding : ""}`}
    >
      <div className={styles.container}>{children}</div>
    </section>
  );
}
