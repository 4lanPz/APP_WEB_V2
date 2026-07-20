import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AsesorWizard } from "@/components/ui/AsesorWizard";

export const metadata: Metadata = {
  title: "Asesor Virtual — Textil Padilla",
  description:
    "Tres preguntas y una recomendación técnica concreta: referencia, gramaje y tono, lista para pedir muestra.",
};

export default function AsesorVirtualPage() {
  return (
    <div className="bg-ink py-16 text-paper sm:py-24">
      <Container>
        <Breadcrumb
          tone="dark"
          items={[{ label: "Inicio", href: "/" }, { label: "Asesor virtual" }]}
          className="mb-8"
        />
        <h1 className="max-w-2xl font-sans text-display font-medium tracking-[-0.03em]">
          Tres preguntas.
          <br />
          <span className="text-brand">Tu tela exacta.</span>
        </h1>
        <p className="mt-6 max-w-xl font-serif text-body-l text-paper/80">
          Cuéntanos qué produces y cómo se va a usar. El asesor cruza tu
          necesidad con nuestro catálogo real y te devuelve las telas que
          mejor encajan —listas para pedir muestra o hablar con una persona.
        </p>

        <div className="mt-16">
          <AsesorWizard />
        </div>
      </Container>
    </div>
  );
}
