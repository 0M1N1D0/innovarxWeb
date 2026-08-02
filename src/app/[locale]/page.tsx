import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { FinalCta, Hero, Process } from "@/features/landing";
import { ServiceLevels } from "@/features/services-catalog";
import { Section } from "@/shared/components/Section";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Requerido en cada page y layout, no solo en el layout raíz — habilita render estático.
  setRequestLocale(locale);

  return (
    <>
      <Section noTopPadding>
        <Hero />
      </Section>
      <Section id="servicios" tone="alt">
        <ServiceLevels locale={locale} />
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
