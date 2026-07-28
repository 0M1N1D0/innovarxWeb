import type { ReactNode } from "react";
import styles from "./Section.module.css";

type SectionTone = "default" | "alt" | "dark";

interface SectionProps {
  id?: string;
  tone?: SectionTone;
  children: ReactNode;
}

export function Section({ id, tone = "default", children }: SectionProps) {
  return (
    <section id={id} className={`${styles.section} ${styles[tone]}`}>
      <div className={styles.container}>{children}</div>
    </section>
  );
}
