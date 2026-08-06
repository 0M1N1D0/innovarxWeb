import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./TrustBar.module.css";

// Solo los IDs y el logo quedan en código: el orden y la existencia de los tres bloques es
// estructura, no copy. El texto vive en messages/<locale>.json → landing.trust.
// Antes vivía dentro de `Hero` (limitado al ancho de `.content`); ahora es su propia
// sección de ancho completo, ver src/app/[locale]/page.tsx.
const TRUST_ITEMS = [
  { id: "security", logo: "/images/logo-seguridad.png" },
  { id: "performance", logo: "/images/logo-rendimiento.png" },
  { id: "support", logo: "/images/logo-soporte.png" },
] as const;

export function TrustBar() {
  const t = useTranslations("landing.trust");

  return (
    <ul className={styles.trust}>
      {TRUST_ITEMS.map(({ id, logo }) => (
        <li key={id} className={styles.card}>
          <Image src={logo} alt="" width={512} height={512} className={styles.icon} />
          <div className={styles.text}>
            <p className={styles.title}>{t(`${id}.title`)}</p>
            <p className={styles.description}>{t(`${id}.description`)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
