import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ProductGallery } from "@/components/ui/ProductGallery";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { buttonVariants } from "@/components/ui/buttonVariants";
import { getProductDetail } from "@/data/taxonomy";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Dortmund Plus · Blancos — Textil Padilla",
  description:
    "Ficha técnica de Dortmund Plus en Blancos: microfibra 100% poliéster, 134.41 g/m², base ideal para sublimación y estampado.",
};

const cuidados = [
  {
    title: "Lavar a 40°C",
    description: "Ciclo normal, del revés. Color estable a temperatura media.",
  },
  {
    title: "Sin lejía",
    description: "No usar blanqueadores; pueden virar el tono, también en blancos.",
  },
  {
    title: "Secado suave",
    description: "Tambor a baja temperatura. Seca rápido: mejor al aire.",
  },
  {
    title: "Plancha media",
    description: "Temperatura media, nunca directa sobre estampados.",
  },
  {
    title: "No lavar en seco",
    description: "No requiere solventes; el lavado doméstico es suficiente.",
  },
];

export default async function ProductoDortmundPlusBlancosPage() {
  const product = await getProductDetail("microfibra", "dortmund-plus", "blancos");
  if (!product) notFound();

  return (
    <div className="flex flex-col">
      <Container className="pt-10">
        <Breadcrumb
          items={[
            { label: "Productos", href: "/productos" },
            { label: "Microfibra", href: "/productos/microfibra" },
            { label: "Dortmund Plus", href: "/productos/microfibra/dortmund-plus" },
            { label: "Blancos" },
          ]}
        />
      </Container>

      <section className="py-10 sm:py-16">
        <Container className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <ProductGallery product={product} title={product.title} />

          <div className="flex flex-col gap-8 lg:sticky lg:top-24">
            <div>
              <Link
                href="/productos/microfibra/dortmund-plus"
                className="font-mono text-xs uppercase tracking-widest text-graphite hover:text-brand"
              >
                Dortmund Plus
              </Link>
              <h1 className="mt-2 font-sans text-display font-medium tracking-[-0.03em] text-ink">
                {product.title}
              </h1>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-graphite">
                {product.subtitle}
              </p>
              <p className="mt-4 font-serif text-body-m text-graphite">
                {product.description}
              </p>
            </div>

            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-graphite">
                Ficha técnica
              </p>
              <div className="border-t border-greige">
                {product.fichaTecnica.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-4 border-b border-greige py-3.75"
                  >
                    <span className="font-mono text-xs uppercase tracking-widest text-graphite">
                      {row.label}
                    </span>
                    <span className="text-right font-sans text-[15px] font-medium text-ink">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <MagneticLink
                href="/productos/microfibra/dortmund-plus#en-preparacion"
                className={buttonVariants({ variant: "primary" })}
              >
                Solicitar muestra de este color →
              </MagneticLink>
              <Link
                href="/productos/microfibra/dortmund-plus"
                className={cn(buttonVariants({ variant: "ghost" }), "w-fit")}
              >
                Ver Dortmund Plus →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section id="cuidados" className="bg-bone py-16 sm:py-24">
        <Container>
          <SectionHeader index="01" title="Cuidados de la tela" tag="Microfibra · uso deportivo" />
          <RevealGroup className="grid grid-cols-1 gap-px border border-greige bg-greige sm:grid-cols-2 lg:grid-cols-5">
            {cuidados.map((step) => (
              <RevealItem key={step.title} className="bg-paper p-6">
                <h3 className="font-sans text-[15px] font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 font-serif text-caption text-graphite">
                  {step.description}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
          <p className="mt-6 max-w-2xl font-serif text-caption italic text-graphite">
            Cuidados orientativos para el rollo. La confección final puede
            ajustar la etiqueta según acabado y color.
          </p>
        </Container>
      </section>

      <section id="relacionados" className="py-16 sm:py-24">
        <Container>
          <SectionHeader index="02" title="Otras telas de Microfibra" tag="Misma microfibra" />
          <RevealGroup className="grid grid-cols-1 gap-px border border-greige bg-greige sm:grid-cols-3">
            {product.related.map((item) => (
              <RevealItem key={item.name} className="h-full">
                <Link
                  href="/productos/microfibra#en-preparacion"
                  title="Página en preparación"
                  className="group flex h-full flex-col border border-transparent bg-paper text-ink transition-colors duration-500 ease-revelar hover:border-graphite"
                >
                  <ImagePlaceholder
                    label="Microfibra · foto pendiente"
                    zoomOnGroupHover
                    className="h-[clamp(200px,24vh,260px)] w-full"
                  />
                  <div className="p-6">
                    <div className="mb-2 flex items-baseline justify-between gap-3">
                      <h3 className="font-sans text-[15px] font-semibold text-ink">
                        {item.name}
                      </h3>
                      <span className="whitespace-nowrap font-mono text-xs uppercase tracking-widest text-graphite">
                        En preparación
                      </span>
                    </div>
                    <p className="mb-3 font-serif text-[15px] text-graphite">
                      {item.description}
                    </p>
                    <span className="font-sans text-[13px] font-medium text-ink">
                      Próximamente →
                    </span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>
    </div>
  );
}
