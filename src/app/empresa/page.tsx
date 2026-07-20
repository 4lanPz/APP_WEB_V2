import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/ui/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Timeline } from "@/components/ui/Timeline";
import { DraftNotice } from "@/components/ui/DraftNotice";
import { foto } from "@/data/imagenes";
import { buttonVariants } from "@/components/ui/buttonVariants";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";

export const metadata: Metadata = {
  title: "Nuestra Empresa — Textil Padilla",
  description:
    "Casi cuatro décadas seleccionando hilo, tejiendo rollo y afinando color desde Alangasí, Ecuador.",
};

const valores = [
  {
    title: "Herencia",
    description:
      "El oficio como legado. Manos que conocen la tela por el tacto antes que por la ficha, y una memoria de taller que se transmite entre tiradas. No presumimos de tradición: la usamos.",
  },
  {
    title: "Precisión",
    description:
      "La tela como sistema. Gramaje, torsión, densidad y solidez del color: nada se deja al azar y todo se documenta. Hablamos en unidades —metros, gramos, referencias— porque el criterio se demuestra con datos.",
  },
  {
    title: "Vanguardia",
    description:
      "La materia al servicio de lo que aún no existe. Teñido a demanda, color exacto y respuesta ágil: tradición puesta a trabajar para que otros construyan sobre una base que no falla.",
  },
  {
    title: "Reserva",
    description:
      "La marca nunca grita. Preferimos la afirmación a la exclamación y el trabajo bien hecho al ruido. Servimos al color del cliente desde el criterio de quien conoce la materia —servicial, sin sumisión.",
  },
];

const hitos = [
  {
    year: "1987",
    ref: "FND-01",
    title: "Fundación en Alangasí",
    description:
      "Nace el taller familiar en Alangasí, valle de los Chillos: punto tejido para la confección local. Se fija el principio fundacional —seleccionar el mejor hilo, no hilar.",
  },
  {
    year: "1994",
    ref: "LOC-01",
    title: "Consolidación de la matriz",
    description:
      "La planta de Alangasí se establece como matriz de producción: nave de tejido, bodega de hilo y primeros controles sistemáticos de gramaje por rollo.",
  },
  {
    year: "1999",
    ref: "PRD-01",
    title: "Teñido a demanda",
    description:
      "Se incorpora la tintorería propia y el teñido al color exacto del cliente, con referencias registradas para reproducir el tono entre tiradas.",
    featured: true,
  },
  {
    year: "2003",
    ref: "LOC-02",
    title: "Apertura de local · La Marín",
    description:
      "Primer punto de venta y atención en el centro de Quito (La Marín), acercando el muestrario físico a talleres y confeccionistas de la ciudad.",
  },
  {
    year: "2008",
    ref: "LOC-03",
    title: "Apertura de local · Solanda",
    description:
      "Nuevo local en el sur de Quito (Solanda) para dar cobertura a la creciente demanda de barrios productores de confección.",
  },
  {
    year: "2013",
    ref: "LOC-04",
    title: "Apertura de local · Sangolquí",
    description:
      "Punto de venta en Sangolquí, reforzando la presencia en el valle de los Chillos, cerca de la matriz.",
  },
  {
    year: "2017",
    ref: "LOC-05",
    title: "Apertura de local · Guayaquil",
    description:
      "Primer local en la costa (Guayaquil), abriendo distribución hacia marcas y retail del litoral.",
  },
  {
    year: "2021",
    ref: "QLT-01",
    title: "Protocolo de control por rollo",
    description:
      "Se formaliza la ficha técnica por rollo: gramaje, encogimiento y solidez de color documentados, con tolerancia de tono ΔE ≤ 4 entre tiradas.",
  },
  {
    year: "2024",
    ref: "PRD-02",
    title: "Línea técnica PerformKnit",
    description:
      "Presentación de tejidos técnicos de alto gramaje para uniformidad y contract, con color constante y rendimiento comprobado.",
  },
];

export default function EmpresaPage() {
  return (
    <div className="flex flex-col">
      <Hero
        eyebrow="Nuestra empresa · Taller textil · Ecuador · desde 1987"
        headlineLines={["Un taller que", "aprendió a callar", "y a medirlo todo."]}
        subhead="Casi cuatro décadas seleccionando hilo, tejiendo rollo y afinando color desde Ecuador. Somos un fabricante familiar con mentalidad de ingeniero: herencia de oficio, disciplina de ficha técnica."
        primaryCta={{ label: "Conocer nuestra historia →", href: "#historia" }}
      />

      <section id="manifiesto" className="py-16 sm:py-24">
        <Container>
          <div className="mb-6">
            <DraftNotice>Contenido de ejemplo · pendiente de validación</DraftNotice>
          </div>
          <SectionHeader index="01" title="Lo que nos mueve" tag="Misión · Visión · Valores" />
          <RevealGroup className="flex flex-col divide-y divide-greige">
            <RevealItem className="grid grid-cols-1 gap-4 py-10 sm:grid-cols-[0.42fr_1fr] sm:gap-10">
              <span className="font-mono text-xs uppercase tracking-widest text-accent">
                Misión
              </span>
              <p className="font-serif text-body-l text-ink">
                Convertir el mejor hilo disponible en tela que se comporta:
                gramaje medido, color exacto y una mano que se reconoce al
                tacto, rollo tras rollo.
              </p>
            </RevealItem>
            <RevealItem className="grid grid-cols-1 gap-4 py-10 sm:grid-cols-[0.42fr_1fr] sm:gap-10">
              <span className="font-mono text-xs uppercase tracking-widest text-accent">
                Visión
              </span>
              <p className="font-serif text-body-l text-ink">
                Ser el partner de manufactura textil de referencia para las
                marcas, distribuidores y retail premium de la región andina
                —reconocidos no por el volumen, sino por el criterio: la casa
                a la que se acude cuando el color y la constancia no admiten
                error.
              </p>
            </RevealItem>
          </RevealGroup>
        </Container>
      </section>

      <section className="border-y border-greige bg-bone py-16 sm:py-24">
        <Container>
          <p className="mb-10 font-mono text-xs uppercase tracking-widest text-graphite">
            Los valores que no negociamos
          </p>
          <RevealGroup className="flex flex-col divide-y divide-greige">
            {valores.map((valor) => (
              <RevealItem
                key={valor.title}
                className="grid grid-cols-1 gap-3 py-8 sm:grid-cols-[200px_1fr] sm:gap-10"
              >
                <h3 className="font-sans text-h3 font-semibold text-ink">
                  {valor.title}
                </h3>
                <p className="max-w-2xl font-serif text-[15px] text-graphite">
                  {valor.description}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="mt-10">
            <p className="max-w-xl font-serif text-body-l italic text-ink">
              «No fabricamos la moda. Fabricamos aquello con lo que la moda se
              hace.»
            </p>
          </Reveal>
        </Container>
      </section>

      <section id="historia" className="py-16 sm:py-24">
        <Container>
          <div className="mb-6">
            <DraftNotice>Contenido de ejemplo · pendiente de validación</DraftNotice>
          </div>
          <SectionHeader index="02" title="De dónde venimos" tag="Origen y evolución" />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="flex flex-col gap-5">
              <p className="font-serif text-body-m text-ink">
                Textil Padilla nació en 1987 en Alangasí, en el valle de los
                Chillos, como un taller familiar dedicado a tejer punto para
                la confección local. La primera decisión fue también la más
                duradera: no hilar, sino seleccionar el mejor hilo disponible
                y convertirlo en tela con la disciplina de una ficha técnica.
              </p>
              <p className="font-serif text-body-m text-ink">
                Con los años, la demanda de un color constante nos llevó a
                incorporar teñido a demanda: dejar de ofrecer el tono más
                cercano de un stock y empezar a teñir el color exacto que
                cada marca necesitaba, registrado para volver a él. Ese
                salto —de tejer a teñir con criterio— definió el oficio que
                hoy vive en tres verbos: seleccionar, tejer, teñir.
              </p>
              <p className="font-serif text-body-m text-ink">
                De aquel primer taller crecimos hacia una red de locales en
                Ecuador —desde la matriz de Alangasí hasta Quito, Sangolquí y
                Guayaquil— y hacia clientes en la región andina, sin
                renunciar nunca al listón con el que empezamos. Casi cuatro
                décadas después, seguimos midiendo todo y alzando poco la
                voz.
              </p>
              <RevealGroup className="mt-4 grid grid-cols-2 gap-6 border-t border-greige pt-6 sm:grid-cols-4">
                {[
                  { label: "Fundación", value: "1987" },
                  { label: "Matriz", value: "Alangasí" },
                  { label: "Locales", value: "6 en Ecuador" },
                  { label: "Carácter", value: "Familiar" },
                ].map((item) => (
                  <RevealItem key={item.label}>
                    <p className="font-sans text-[15px] font-semibold text-ink">
                      {item.value}
                    </p>
                    <p className="mt-1 font-mono text-xs uppercase tracking-widest text-graphite">
                      {item.label}
                    </p>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
            <Reveal>
              <ImagePlaceholder
                src={foto("oficio-taller-alangasi")?.ruta}
                alt={foto("oficio-taller-alangasi")?.alt}
                sizes="(min-width: 1024px) 40vw, 100vw"
                caption="Alangasí · el taller"
                className="aspect-4/5"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      <section id="hitos" className="py-16 sm:py-24">
        <Container>
          <div className="mb-6">
            <DraftNotice>Contenido de ejemplo · pendiente de validación</DraftNotice>
          </div>
          <SectionHeader index="03" title="Línea de hitos" tag="Registro cronológico" />
          <p className="mb-10 max-w-xl font-serif text-caption italic text-graphite">
            Fechas y aperturas por confirmar con administración.
          </p>
          <Timeline items={hitos} />
        </Container>
      </section>

      <section id="infraestructura" className="bg-brand-deep py-16 text-paper sm:py-24">
        <Container>
          <SectionHeader
            index="04"
            title="El taller por dentro"
            tag="Oficio · manos y máquina"
            tone="dark"
          />
          <p className="mb-10 max-w-2xl font-serif text-body-m text-paper/80">
            Documental de taller: manos, telar y tinte. El gesto real del
            trabajo, sin pose. Aquí irán las fotografías reales de nuestra
            infraestructura —luz lateral rasante, óptica fija, color fiel—
            cuando estén listas.
          </p>
          <RevealGroup className="grid grid-cols-1 gap-px bg-paper/15 sm:grid-cols-2">
            <RevealItem className="sm:row-span-2">
              <ImagePlaceholder
                dark
                src={foto("oficio-nave-tejido")?.ruta}
                alt={foto("oficio-nave-tejido")?.alt}
                sizes="(min-width: 640px) 50vw, 100vw"
                caption="01 · Nave de tejido · Alangasí"
                className="aspect-4/3 h-full sm:aspect-auto"
              />
            </RevealItem>
            <RevealItem>
              <ImagePlaceholder dark caption="02 · Tintorería" className="aspect-4/3" />
            </RevealItem>
            <RevealItem>
              <ImagePlaceholder dark caption="03 · Carta de color" className="aspect-4/3" />
            </RevealItem>
          </RevealGroup>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <MagneticLink href="/#asesor" className={buttonVariants({ variant: "primary" })}>
              Hablar con un asesor →
            </MagneticLink>
            <Link
              href="/productos"
              className="font-sans text-[15px] font-medium text-paper hover:text-brand"
            >
              Ver catálogo de telas →
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
