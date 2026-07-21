import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/ui/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { EventCarousel } from "@/components/ui/EventCarousel";
import { StatNumber } from "@/components/ui/StatNumber";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { PhotoCurtain } from "@/components/motion/Curtain";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { categories } from "@/data/taxonomy";
import { foto } from "@/data/imagenes";

const stats = [
  { target: 39, prefix: "", suffix: "", label: "Años de oficio" },
  { target: 6, prefix: "", suffix: "", label: "Locales en Ecuador" },
  { target: 3, prefix: "", suffix: "", label: "Países con presencia" },
  { target: 900, prefix: "+", suffix: "", label: "Tonos teñidos a demanda" },
];

const verbos = [
  {
    index: "01",
    title: "Seleccionar",
    description:
      "El listón empieza en el hilo. Compramos el mejor disponible y descartamos lo que no cumple gramaje, torsión ni densidad. Nada se deja al azar; todo se documenta.",
  },
  {
    index: "02",
    title: "Tejer",
    description:
      "Convertimos el hilo en rollo con precisión de sistema: trama, urdimbre y acabado tejidos para rendir. Cada serie sale con la misma mano, tirada tras tirada.",
  },
  {
    index: "03",
    title: "Teñir",
    description:
      "Teñido a demanda, al color exacto que pide el cliente. Solidez constante entre rollos: la referencia que apruebas es la que recibes, sin sorpresas.",
  },
];

const eventSlides = [
  {
    date: "Mar 2025 · Quito",
    title: "Feria Internacional del Textil Andino",
    description:
      "Presentamos la carta de color a demanda y las series de sarga peinada ante marcas y distribuidores de la región.",
    slot: "evento-feria-andina",
    placeholderLabel: "Documental de taller · foto real",
  },
  {
    date: "Feb 2025 · Taller Padilla",
    title: "Jornada de color a demanda",
    description:
      "Un día abierto de teñido: clientes trajeron su referencia Pantone y salieron con el rollo aprobado, medido y documentado.",
    slot: "evento-jornada-color",
    placeholderLabel: "Carta de color · foto real",
  },
  {
    date: "Nov 2024 · Guayaquil",
    title: "Alianza con retail premium",
    description:
      "Nueva distribución para retail de alto poder adquisitivo, con muestrario físico diseñado como pieza de biblioteca.",
    slot: "evento-alianza-retail",
    placeholderLabel: "Bodegón de rollo · foto real",
  },
  {
    date: "Sep 2024 · Cuenca",
    title: "Presentación línea PerformKnit 320",
    description:
      "Un tejido técnico de 320 g/m² pensado para uniformidad y contract: rendimiento, solidez y color constante.",
    slot: "evento-performknit-320",
    placeholderLabel: "Macro de fibra · foto real",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero
        video
        eyebrow="Fabricante y distribuidor textil · Ecuador · desde 1987"
        headlineLines={["Tela deportiva", "premium, tejida", "y teñida a tu", "color exacto."]}
        subhead="Seleccionamos el hilo, tejemos el rollo y lo teñimos al tono que tu marca necesita. Rigor de ingeniería, mano de taller —desde Ecuador para marcas, distribuidores y retail premium."
        primaryCta={{ label: "Hablar con un asesor", href: "#asesor" }}
        secondaryCta={{ label: "Ver catálogo de telas →", href: "/productos" }}
        caption="Macro de fibra · loop"
      />

      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeader index="01" title="Textil Padilla en cifras" tag="Desde 1987" />
          <RevealGroup className="grid grid-cols-2 gap-px border border-greige bg-greige sm:grid-cols-4">
            {stats.map((stat) => (
              <RevealItem key={stat.label} className="bg-paper p-6">
                <p className="font-sans text-h1 font-medium text-ink">
                  <StatNumber target={stat.target} prefix={stat.prefix} suffix={stat.suffix} />
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-widest text-graphite">
                  {stat.label}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
          <div className="mt-10">
            <p className="max-w-2xl font-serif text-body-m text-ink">
              Casi cuatro décadas seleccionando hilo, tejiendo rollo y
              afinando color. No hilamos: elegimos el mejor hilo disponible y
              lo convertimos en tela con la precisión de una ficha técnica y
              el criterio de quien conoce la materia por el tacto.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeader index="02" title="El oficio en tres verbos" tag="Seleccionar · Tejer · Teñir" />
          <RevealGroup className="grid grid-cols-1 gap-px border border-greige bg-greige sm:grid-cols-3">
            {verbos.map((verbo) => (
              <RevealItem key={verbo.title} className="bg-paper p-8">
                <span className="font-mono text-xs uppercase tracking-widest text-accent">
                  Verbo {verbo.index}
                </span>
                <h3 className="mt-4 font-sans text-h3 font-semibold text-ink">
                  {verbo.title}
                </h3>
                <p className="mt-3 font-serif text-[15px] text-graphite">
                  {verbo.description}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="relative bg-brand-deep py-24 text-paper sm:py-32">
        <Container className="relative">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-widest text-brand">
              Verdad material
            </span>
            <p className="mt-6 max-w-2xl font-sans text-h1 font-medium tracking-[-0.02em]">
              La trama ampliada hasta que la tela deja de parecer tela y se
              vuelve paisaje.
            </p>
          </Reveal>
        </Container>
        <PhotoCurtain
          dark
          src={foto("macro-fibra-blanca")?.ruta}
          alt={foto("macro-fibra-blanca")?.alt}
          sizes="100vw"
          caption="Macro de fibra"
          className="mt-12 aspect-21/9 w-full"
        />
      </section>

      <section id="categorias" className="py-16 sm:py-24">
        <Container>
          <SectionHeader index="03" title="Familias de tela" tag="Catálogo por familia" />
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
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeader index="04" title="Dónde estuvimos" tag="Eventos recientes" />
          <EventCarousel slides={eventSlides} />
        </Container>
      </section>

      <section id="asesor" className="bg-brand-deep py-24 text-paper sm:py-32">
        <Container className="flex flex-col gap-6">
          <Reveal className="flex flex-col gap-6">
            <span className="font-mono text-xs uppercase tracking-widest text-brand">
              Asesor virtual
            </span>
            <h2 className="max-w-2xl font-sans text-h1 font-medium tracking-[-0.02em]">
              ¿No sabes qué tela necesitas? Te acompañamos hasta el color
              exacto.
            </h2>
            <p className="max-w-xl font-serif text-body-l text-paper/80">
              Tres preguntas —qué prenda vas a producir, si la tela irá
              sublimada y si buscas alto rendimiento o uso casual— y un
              asesor te devuelve una recomendación técnica concreta:
              referencia, gramaje y tono, lista para pedir muestra.
            </p>
          </Reveal>
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
            <span className="text-brand">01 Prenda</span>
            <span className="text-paper/30">→</span>
            <span className="text-paper/50">02 Sublimado</span>
            <span className="text-paper/30">→</span>
            <span className="text-paper/50">03 Uso</span>
          </div>
          <div className="h-0.5 w-full max-w-xs bg-paper/15">
            <div className="h-0.5 w-1/3 bg-brand" />
          </div>
          <MagneticLink
            href="/asesor-virtual"
            className="mt-2 w-fit bg-brand px-7.5 py-4 font-sans text-base font-medium text-paper hover:bg-paper hover:text-brand-deep"
          >
            Iniciar con el asesor →
          </MagneticLink>
        </Container>
      </section>
    </div>
  );
}
