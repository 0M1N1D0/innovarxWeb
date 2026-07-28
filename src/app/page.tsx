import { FinalCta, Hero, Process } from "@/features/landing";
import { ServiceLevels } from "@/features/services-catalog";
import { Section } from "@/shared/components/Section";

export default function HomePage() {
  return (
    <>
      <Section>
        <Hero />
      </Section>
      <Section id="servicios" tone="alt">
        <ServiceLevels />
      </Section>
      <Section id="proceso">
        <Process />
      </Section>
      <Section id="contacto" tone="dark">
        <FinalCta />
      </Section>
    </>
  );
}
