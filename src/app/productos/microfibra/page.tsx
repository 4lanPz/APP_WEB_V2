import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/ui/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SubcategoryTile } from "@/components/ui/SubcategoryTile";
import { AsesorComercial } from "@/components/ui/AsesorComercial";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { getCategory } from "@/data/taxonomy";
import { estadoFicha } from "@/data/fichas";
import { fotoDeTela } from "@/data/imagenes";

export const metadata: Metadata = {
  title: "Microfibra — Textil Padilla",
  description:
    "Veinte construcciones de microfibra: hilos finos de poliéster, poco peso, secado rápido y alta recuperación.",
};

export default async function CategoriaMicrofibraPage() {
  const category = await getCategory("microfibra");
  if (!category) notFound();

  return (
    <div className="flex flex-col">
      <Hero
        breadcrumb={[
          { label: "Productos", href: "/productos" },
          { label: "Categorías", href: "/productos#categorias" },
          { label: "Microfibra" },
        ]}
        headlineLines={[
          "Microfibra.",
          "Ligera, seca antes,",
          <span key="accent" className="text-brand">
            rinde en cancha.
          </span>,
        ]}
        subhead="Nuestra familia de tejidos de microfibra: hilos finos de poliéster que dan poco peso, secado rápido y alta recuperación. Una misma base con veinte construcciones —cada una afinada para un uso deportivo distinto."
        primaryCta={{ label: "Ver las subcategorías →", href: "#subcategorias" }}
      />

      <section id="subcategorias" className="py-16 sm:py-24">
        <Container>
          <SectionHeader
            index="01"
            title="Las subcategorías"
            tag={`${category.subcategories.length} construcciones`}
          />
          <p className="mb-10 max-w-2xl font-serif text-body-m text-graphite">
            Todas nacen de la misma microfibra, pero cambian galga, gramaje y
            acabado según la prenda. Empieza por la que se acerca a tu uso;
            iremos publicando cada ficha con sus datos y su carta de color
            completa.
          </p>
          <RevealGroup className="grid grid-cols-1 gap-px border border-greige bg-greige sm:grid-cols-2 lg:grid-cols-3">
            {category.subcategories.map((sub, i) => {
              const estado = estadoFicha(sub.slug);
              return (
                <RevealItem key={sub.slug}>
                  <SubcategoryTile
                    href={
                      estado === "sin-ficha"
                        ? `/productos/microfibra/${sub.slug}#en-preparacion`
                        : `/productos/microfibra/${sub.slug}`
                    }
                    index={String(i + 1).padStart(2, "0")}
                    title={sub.name}
                    estado={estado}
                    foto={fotoDeTela(sub.slug)}
                    className="h-full"
                  />
                </RevealItem>
              );
            })}
          </RevealGroup>
          <p className="mt-6 max-w-2xl font-serif text-caption italic text-graphite">
            Solo publicamos la ficha de una subcategoría cuando existe su
            fotografía real. El resto figura «en preparación» y se tiñe a
            pedido, como el resto del catálogo.
          </p>
        </Container>
      </section>

      <AsesorComercial
        index="02"
        title="¿Qué microfibra necesitas?"
        intro="¿Dudas entre construcciones, gramajes o acabados? Cuéntanos qué prenda deportiva tienes en mente y el rendimiento que buscas: te decimos qué microfibra encaja mejor —y te mandamos muestras si las necesitas."
        questionLabel="¿Qué estás confeccionando?"
        questionPlaceholder="p. ej. camisetas deportivas de secado rápido"
      />
    </div>
  );
}
