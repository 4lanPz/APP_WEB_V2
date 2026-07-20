import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/ui/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { GarmentRecommender } from "@/components/ui/GarmentRecommender";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { PhotoCurtain } from "@/components/motion/Curtain";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { categories } from "@/data/taxonomy";
import { foto } from "@/data/imagenes";

export const metadata: Metadata = {
  title: "Nuestros Productos — Textil Padilla",
  description:
    "Telas de microfibra, texturizado, spun y polialgodón tejidas y teñidas a demanda en Ecuador.",
};

const reasons = [
  {
    index: "01",
    title: "Tu color exacto",
    description:
      "Teñido a demanda: no te ofrecemos el tono más cercano de un stock, teñimos el que tu marca necesita y lo dejamos registrado para volver a él cuando quieras.",
  },
  {
    index: "02",
    title: "Consistencia entre tiradas",
    description:
      "La muestra que apruebas es la que llega —el mismo gramaje, la misma mano y el mismo color, pedido tras pedido. Sin sorpresas al abrir el rollo.",
  },
  {
    index: "03",
    title: "Ficha técnica por rollo",
    description:
      "Gramaje, encogimiento y solidez de color documentados. Compras con datos, no con adjetivos —y produces con la tranquilidad de saber cómo se comportará la tela.",
  },
  {
    index: "04",
    title: "Un asesor de verdad",
    description:
      "De la duda a la referencia lista para pedir. Te acompañamos a elegir construcción, gramaje y color, y salimos con una recomendación técnica concreta.",
  },
];

export default function ProductosPage() {
  return (
    <div className="flex flex-col">
      <Hero
        imagen="hero-productos"
        eyebrow="Nuestros productos · Telas para confección deportiva y casual"
        headlineLines={["Cada rollo", "responde por", "su ficha técnica."]}
        subhead="No hacemos listas de precios: hacemos tela que se comporta. Gramaje medido, color sólido entre tiradas y una mano que se reconoce al tacto. Esto es lo que ponemos en cada rollo."
        primaryCta={{ label: "Encontrar mi tela →", href: "#recomendador" }}
      />

      <section id="calidad" className="py-16 sm:py-24">
        <Container>
          <SectionHeader index="01" title="La calidad se mide, no se promete" tag="Ficha por rollo" />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <p className="font-serif text-body-l text-ink">
              Una tela buena no se explica con adjetivos. Se explica con
              números que se repiten: el mismo gramaje, la misma solidez de
              color y el mismo encogimiento, rollo tras rollo. Cada tirada
              sale con su ficha —no una promesa, un registro.
            </p>
            <PhotoCurtain
              src={foto("macro-tejido")?.ruta}
              alt={foto("macro-tejido")?.alt}
              sizes="(min-width: 1024px) 50vw, 100vw"
              caption="Macro de tejido"
              className="aspect-4/3"
            />
          </div>
        </Container>
      </section>

      <section id="recomendador" className="py-16 sm:py-24">
        <Container>
          <SectionHeader index="02" title="¿Qué vas a confeccionar?" tag="Filtro por prenda" />
          <p className="mb-10 max-w-2xl font-serif text-body-m text-graphite">
            Elige la prenda y te mostramos la construcción de tela con la que
            suele rendir mejor. No es una regla rígida —es el punto de
            partida que recomendaría el asesor.
          </p>
          <GarmentRecommender />
        </Container>
      </section>

      <section id="categorias" className="py-16 sm:py-24">
        <Container>
          <SectionHeader index="03" title="Categorías" tag="Catálogo por familia" />
          <RevealGroup className="grid grid-cols-1 gap-px border border-greige bg-greige sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <RevealItem key={category.slug}>
                <CategoryCard
                  href={
                    category.available
                      ? `/productos/${category.slug}`
                      : `/productos/${category.slug}#en-preparacion`
                  }
                  index={category.index}
                  title={category.name}
                  description={category.description}
                  className="h-full"
                />
              </RevealItem>
            ))}
          </RevealGroup>
          <p className="mt-6 max-w-2xl font-serif text-caption italic text-graphite">
            Todas se tejen en Ecuador y disponen de una carta de tonos
            normalizados en stock; si el proyecto pide un color puntual
            distinto, se tintura a pedido.
          </p>
        </Container>
      </section>

      <section id="porque" className="bg-brand-deep py-16 text-paper sm:py-24">
        <Container>
          <SectionHeader index="04" title="Por qué comprar con nosotros" tag="Cuatro razones" tone="dark" />
          <RevealGroup className="flex flex-col divide-y divide-paper/15">
            {reasons.map((reason) => (
              <RevealItem
                key={reason.index}
                className="grid grid-cols-1 gap-3 py-8 sm:grid-cols-[80px_1fr] sm:gap-8"
              >
                <span className="font-mono text-mono text-brand">{reason.index}</span>
                <div>
                  <h3 className="mb-2 font-sans text-h3 font-semibold text-paper">
                    {reason.title}
                  </h3>
                  <p className="max-w-2xl font-serif text-body-m text-paper/80">
                    {reason.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <MagneticLink
            href="/#asesor"
            className="mt-10 inline-block bg-brand px-7.5 py-4 font-sans text-base font-medium text-paper hover:bg-paper hover:text-brand-deep"
          >
            Hablar con un asesor →
          </MagneticLink>
        </Container>
      </section>
    </div>
  );
}
