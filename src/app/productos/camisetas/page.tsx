import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/ui/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { AsesorComercial } from "@/components/ui/AsesorComercial";
import { StatNumber } from "@/components/ui/StatNumber";
import { PhotoCurtain } from "@/components/motion/Curtain";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Camisetas — Textil Padilla",
  description:
    "Las construcciones de punto con las que rinde mejor una camiseta: jersey de algodón peinado, piqué, rib y interlock.",
};

const stats = [
  { target: 175, prefix: "", suffix: " g/m²", label: "Gramaje típico de camiseta" },
  { target: 4, prefix: "ΔE ≤", suffix: "", label: "Variación de color entre tiradas" },
  { target: 95, prefix: "", suffix: "%", label: "Recuperación elástica" },
  { target: 3, prefix: "≤", suffix: "%", label: "Encogimiento tras lavado" },
];

interface Fabric {
  tag: string;
  name: string;
  structure: string;
  gramaje: string;
  composicion: string;
  mejorPara: string;
  ratings: { label: string; value: number }[];
  description: string;
}

const fabrics: Fabric[] = [
  {
    tag: "Tela 01 · La base",
    name: "Jersey de algodón peinado 30/1",
    structure: "Single jersey",
    gramaje: "160–190 g/m²",
    composicion: "100% algodón peinado",
    mejorPara: "Básicos, uso diario",
    ratings: [
      { label: "Transpirabilidad", value: 5 },
      { label: "Suavidad", value: 5 },
      { label: "Recuperación", value: 3 },
      { label: "Cuerpo", value: 2 },
    ],
    description:
      "El punto liso por excelencia para camisetas. Ligero, transpirable y de caída natural sobre el cuerpo. El algodón peinado elimina las fibras cortas: menos pilling, más tacto y un color que aguanta el uso diario.",
  },
  {
    tag: "Tela 02 · La estructura",
    name: "Piqué",
    structure: "Punto tipo panal",
    gramaje: "200–240 g/m²",
    composicion: "Algodón / algodón-poliéster",
    mejorPara: "Polos, uniformes",
    ratings: [
      { label: "Estructura", value: 5 },
      { label: "Resist. arruga", value: 4 },
      { label: "Transpirabilidad", value: 4 },
      { label: "Suavidad", value: 3 },
    ],
    description:
      "Punto en relieve con celdas que crean textura y canales de aire. Tiene cuerpo sin pesar, resiste el arrugado y sostiene la forma del cuello y las mangas. La elección natural cuando la camiseta necesita presencia.",
  },
];

const complementary = [
  {
    name: "Rib 1×1",
    description:
      "Elástico de canalé para cuellos, puños y ribetes. Recupera la forma tras el estirado y termina la prenda con limpieza.",
  },
  {
    name: "Interlock",
    description:
      "Doble punto liso por ambas caras. Más cuerpo que el jersey y sin enrollarse en los bordes: ideal para camisetas de mayor estructura.",
  },
];

function DotRating({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-mono text-xs uppercase tracking-widest text-graphite">
        {label}
      </span>
      <span className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={cn(
              "block size-1.5",
              i < value ? "bg-brand" : "bg-greige",
            )}
          />
        ))}
      </span>
    </div>
  );
}

export default function CamisetasPage() {
  return (
    <div className="flex flex-col">
      <Hero
        breadcrumb={[
          { label: "Productos", href: "/productos" },
          { label: "Camisetas deportivas" },
        ]}
        headlineLines={[
          "La camiseta",
          "empieza en",
          <span key="accent" className="text-brand">
            el punto.
          </span>,
        ]}
        subhead="Ligera y de mano suave, o con cuerpo y estructura: la camiseta se define por su tejido de punto. Estas son las construcciones con las que rinde mejor —y por qué las tejemos así."
        primaryCta={{ label: "Ver telas para camiseta →", href: "#telas" }}
      />

      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeader index="01" title="Qué exige la camiseta" tag="Ficha por rollo" />
          <div className="mb-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <p className="font-serif text-body-l text-ink">
              Una camiseta se lava mucho, se estira al vestir y toca la piel
              todo el día. Eso pone tres exigencias sobre la tela: que
              respire, que recupere la forma y que no pierda el color. El
              punto de algodón —jersey o piqué— responde a las tres cuando
              está bien tejido y bien peinado.
            </p>
            <PhotoCurtain
              dark
              label="Punto de camiseta"
              caption="Punto de camiseta · foto real"
              className="aspect-4/3"
            />
          </div>
          <RevealGroup className="grid grid-cols-2 gap-px border border-greige bg-greige sm:grid-cols-4">
            {stats.map((stat) => (
              <RevealItem key={stat.label} className="bg-paper p-6">
                <p className="font-sans text-h2 font-medium text-ink">
                  <StatNumber target={stat.target} prefix={stat.prefix} suffix={stat.suffix} />
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-widest text-graphite">
                  {stat.label}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section id="telas" className="py-16 sm:py-24">
        <Container>
          <SectionHeader index="02" title="Telas para camiseta" tag="Dos construcciones base" />
          <p className="mb-12 max-w-2xl font-serif text-body-m text-graphite">
            Estas son las telas con las que empezaría el asesor para una
            camiseta. Elige la que se acerque a tu prenda y profundiza en su
            ficha técnica y su carta de colores.
          </p>

          <div className="flex flex-col gap-16">
            {fabrics.map((fabric, i) => (
              <Reveal
                key={fabric.name}
                className={cn(
                  "grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12",
                )}
              >
                <ImagePlaceholder
                  label={`${fabric.structure} · macro real`}
                  className={cn("aspect-4/3", i % 2 === 1 && "lg:order-2")}
                />
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-accent">
                    {fabric.tag}
                  </span>
                  <h3 className="mt-2 font-sans text-h3 font-semibold text-ink">
                    {fabric.name}
                  </h3>
                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-[13px] text-graphite">
                    <dt>Estructura</dt>
                    <dd className="text-ink">{fabric.structure}</dd>
                    <dt>Gramaje</dt>
                    <dd className="text-ink">{fabric.gramaje}</dd>
                    <dt>Composición</dt>
                    <dd className="text-ink">{fabric.composicion}</dd>
                    <dt>Mejor para</dt>
                    <dd className="text-ink">{fabric.mejorPara}</dd>
                  </dl>
                  <div className="mt-5 flex flex-col gap-2 border-t border-greige pt-5">
                    {fabric.ratings.map((rating) => (
                      <DotRating key={rating.label} {...rating} />
                    ))}
                  </div>
                  <p className="mt-5 font-serif text-body-m text-graphite">
                    {fabric.description}
                  </p>
                  <Link
                    href="/productos/microfibra#en-preparacion"
                    title="Página en preparación"
                    className="mt-5 inline-block font-sans text-[15px] font-medium text-ink hover:text-brand"
                  >
                    Ver ficha técnica y colores →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mb-6 mt-16 font-mono text-xs uppercase tracking-widest text-graphite">
            También trabajamos para la camiseta
          </p>
          <RevealGroup className="grid grid-cols-1 gap-px border border-greige bg-greige sm:grid-cols-2">
            {complementary.map((item) => (
              <RevealItem key={item.name} className="bg-paper p-8">
                <h3 className="font-sans text-[15px] font-semibold text-ink">
                  {item.name}
                </h3>
                <p className="mt-2 font-serif text-[15px] text-graphite">
                  {item.description}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>

          <p className="mt-8 font-serif text-caption italic text-graphite">
            Todas se tejen en Ecuador y se tiñen al tono exacto que pidas. La
            carta de colores completa vive en la ficha de cada tela.
          </p>
        </Container>
      </section>

      <AsesorComercial
        index="03"
        title="Habla con quien conoce la tela."
        intro="¿Dudas con el gramaje, el encogimiento o el punto exacto para tu prenda? No hay formulario que resuelva eso mejor que una conversación. Cuéntanos qué estás confeccionando y te respondemos con una recomendación concreta —y muestras si las necesitas."
        questionLabel="¿Qué estás confeccionando?"
        questionPlaceholder="p. ej. camisetas técnicas para un equipo"
      />
    </div>
  );
}
