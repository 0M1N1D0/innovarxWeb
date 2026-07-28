import styles from "./Process.module.css";

const STEPS = [
  {
    number: "01",
    title: "Cotización",
    description:
      "Cuéntanos tu proyecto. En 24–48 horas recibes un rango de precio y tiempo de entrega, sin costo.",
  },
  {
    number: "02",
    title: "Propuesta y plan de pago",
    description:
      "Definimos alcance y entregables por escrito, junto con un plan de pago adaptado a tu proyecto y forma de trabajar.",
  },
  {
    number: "03",
    title: "Desarrollo y entrega",
    description:
      "Construimos con avances revisables. Entregamos, capacitamos y activamos el mantenimiento si lo eliges.",
  },
];

export function Process() {
  return (
    <div className={styles.process}>
      <p className={styles.eyebrow}>Cómo trabajamos</p>
      <h2 className={styles.title}>Un proceso claro, transparente y ágil</h2>
      <ol className={styles.steps}>
        {STEPS.map((step) => (
          <li key={step.number} className={styles.step}>
            <span className={styles.number}>{step.number}</span>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDescription}>{step.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
