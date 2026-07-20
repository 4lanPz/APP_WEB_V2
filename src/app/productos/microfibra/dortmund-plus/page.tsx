import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/ui/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SubcategoryTile } from "@/components/ui/SubcategoryTile";
import { AsesorComercial } from "@/components/ui/AsesorComercial";
import { PhotoCurtain } from "@/components/motion/Curtain";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import {
  getSubcategory,
  dortmundPlusStats,
  dortmundPlusReasons,
} from "@/data/taxonomy";
import { foto } from "@/data/imagenes";

export const metadata: Metadata = {
  title: "Dortmund Plus — Textil Padilla",
  description:
    "Dortmund Plus: microfibra de rendimiento, liviana y de secado rápido, para camisetas deportivas y uniformes de equipo.",
};

export default async function SubcategoriaDortmundPlusPage() {
  const result = await getSubcategory("microfibra", "dortmund-plus");
  if (!result) notFound();
  const { subcategory } = result;

  return (
    <div className="flex flex-col">
      <Hero
        imagen="hero-dortmund-plus"
        breadcrumb={[
          { label: "Productos", href: "/productos" },
          { label: "Microfibra", href: "/productos/microfibra" },
          { label: "Dortmund Plus" },
        ]}
        headlineLines={[
          "Dortmund Plus.",
          <span key="accent" className="text-brand">
            Microfibra de cancha.
          </span>,
        ]}
        subhead="La microfibra de rendimiento de la casa: liviana, de secado rápido y alta recuperación. Pensada para camisetas deportivas y uniformes de equipo que se mueven, sudan y vuelven a su forma."
        primaryCta={{ label: "Ver especificaciones →", href: "#especificaciones" }}
      />

      <section id="especificaciones" className="py-16 sm:py-24">
        <Container>
          <SectionHeader index="01" title="Beneficios y usos" tag="Microfibra · rendimiento" />

          <div className="mb-16 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <PhotoCurtain
              src={foto("dortmund-plus-cancha")?.ruta}
              alt={foto("dortmund-plus-cancha")?.alt ?? ""}
              sizes="(min-width: 1024px) 50vw, 100vw"
              label="Dortmund Plus en cancha"
              caption="Dortmund Plus en cancha · foto real"
              className="aspect-4/3"
            />
            <p className="font-serif text-body-l text-ink">
              Dortmund Plus se teje con hilo fino de poliéster microfibra:
              pesa poco, seca rápido y recupera su forma tras el esfuerzo. Su
              cara lisa recibe bien la sublimación y el estampado, lo que la
              vuelve la base natural de camisetas de fútbol y uniformes
              deportivos que exigen la prenda al máximo.
            </p>
          </div>

          <span className="mb-4 block font-mono text-xs uppercase tracking-widest text-graphite">
            Ficha técnica · valores nominales
          </span>
          <RevealGroup className="mb-16 grid grid-cols-2 gap-px border border-greige bg-greige sm:grid-cols-4">
            {dortmundPlusStats.map((stat) => (
              <RevealItem key={stat.label} className="bg-paper p-6">
                <p className="font-sans text-h2 font-medium text-ink">{stat.value}</p>
                <p className="mt-2 font-mono text-xs uppercase tracking-widest text-graphite">
                  {stat.label}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>

          <span className="mb-4 block font-mono text-xs uppercase tracking-widest text-graphite">
            Por qué funciona en deporte
          </span>
          <RevealGroup className="grid grid-cols-1 gap-px border border-greige bg-greige sm:grid-cols-3">
            {dortmundPlusReasons.map((reason) => (
              <RevealItem key={reason.title} className="bg-paper p-8">
                <span className="font-mono text-xs uppercase tracking-widest text-accent">
                  {reason.eyebrow}
                </span>
                <h3 className="mt-4 font-sans text-h3 font-semibold text-ink">
                  {reason.title}
                </h3>
                <p className="mt-3 font-serif text-body-m text-graphite">
                  {reason.description}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section id="tonos" className="border-t border-b border-greige bg-bone py-16 sm:py-24">
        <Container>
          <SectionHeader index="02" title="Tonos disponibles" tag="Cinco familias de color" />
          <p className="mb-10 max-w-2xl font-serif text-body-m text-graphite">
            Dortmund Plus se tiñe en cinco familias de color. Cada una tendrá
            su ficha con carta completa y datos de tiraje; hoy publicamos la
            de Blancos como referencia.
          </p>
          <RevealGroup className="grid grid-cols-1 gap-px border border-greige bg-greige sm:grid-cols-3">
            {subcategory.tones?.map((tone, i) => (
              <RevealItem key={tone.slug}>
                <SubcategoryTile
                  href={
                    tone.available
                      ? `/productos/microfibra/dortmund-plus/${tone.slug}`
                      : `/productos/microfibra/dortmund-plus/${tone.slug}#en-preparacion`
                  }
                  index={String(i + 1).padStart(2, "0")}
                  title={tone.name}
                  description={tone.description}
                  /* Los tonos no tienen ficha técnica propia: `available` aquí
                     significa "tiene página de tono publicada" (solo Blancos). */
                  estado={tone.available ? "publicada" : "sin-ficha"}
                  swatchColor={tone.swatchColor}
                  className="h-full bg-paper"
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <AsesorComercial
        index="03"
        title="¿Dortmund Plus para tu equipo?"
        intro="Cuéntanos el color, la cantidad y el plazo. Te confirmamos disponibilidad de Dortmund Plus, te mandamos muestra del tono y te acompañamos hasta el rollo."
        questionLabel="¿Qué estás confeccionando?"
        questionPlaceholder="p. ej. camisetas de fútbol para un club"
      />
    </div>
  );
}
