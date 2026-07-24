import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/ui/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { EventCarousel } from "@/components/ui/EventCarousel";
import { StatNumber } from "@/components/ui/StatNumber";
import { AsesorPasos } from "@/components/ui/AsesorPasos";
import { PhotoCurtain } from "@/components/motion/Curtain";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { LineasEnMascara } from "@/components/motion/LineasEnMascara";
import { MASCARA } from "@/lib/motion";
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

/*
 * Los tres pasos del asesor: cada uno gobierna una foto en el bloque de portada
 * (ver `AsesorPasos`). El `slot` es su hueco de imagen registrado.
 */
const pasosAsesor = [
  { index: "01", label: "Prenda", slot: "asesor-portada-prenda" },
  { index: "02", label: "Sublimado", slot: "asesor-portada-sublimado" },
  { index: "03", label: "Uso", slot: "asesor-portada-uso" },
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
      {/*
        Una sola acción en la cabecera: "Hablar con un asesor" lo cubre ahora el
        flotante de WhatsApp, que además está en las once páginas y no solo
        aquí. Lo que queda pasa de enlace de texto a botón primario: siendo la
        única salida del hero, no puede tener menos peso que el secundario que
        acompañaba antes, y así la portada usa el mismo patrón que las otras
        seis cabeceras (botón primario + nada).
      */}
      <Hero
        video
        eyebrow="Fabricante y distribuidor textil · Ecuador · desde 1987"
        headlineLines={["Tela deportiva", "premium, tejida", "y teñida a tu", "color exacto."]}
        subhead="Seleccionamos el hilo, tejemos el rollo y lo teñimos al tono que tu marca necesita. Rigor de ingeniería, mano de taller —desde Ecuador para marcas, distribuidores y retail premium."
        primaryCta={{ label: "Ver catálogo de telas →", href: "/productos" }}
      />

      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeader index="01" title="Textil Padilla en cifras" tag="Desde 1987" />
          <RevealGroup
            variante="rejilla"
            className="grid grid-cols-2 gap-px border border-greige bg-greige sm:grid-cols-4"
          >
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
          <Reveal className="mt-10" tipo="cuerpo">
            <p className="max-w-2xl font-serif text-body-m text-ink">
              Casi cuatro décadas seleccionando hilo, tejiendo rollo y
              afinando color. No hilamos: elegimos el mejor hilo disponible y
              lo convertimos en tela con la precisión de una ficha técnica y
              el criterio de quien conoce la materia por el tacto.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeader index="02" title="El oficio en tres verbos" tag="Seleccionar · Tejer · Teñir" />
          <RevealGroup
            variante="rejilla"
            className="grid grid-cols-1 gap-px border border-greige bg-greige sm:grid-cols-3"
          >
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

      {/*
        Verdad material — split a sangre. La macro va a la IZQUIERDA tocando el
        borde y a la misma altura que el texto (`items-stretch`); la declaración
        a la derecha. La foto ocupa el medio ancho que antes quedaba en negro:
        es grande porque llena ese hueco, no porque se sume altura —la banda es
        MÁS corta que los dos bloques de antes—. Y en una columna alta se ve
        muchísima más trama que en la franja 21:9, que era justo lo que el texto
        prometía enseñar.

        El texto va AL LADO de la foto, no encima: cero riesgo de contraste, sin
        DEGRADADO_HERO. La declaración sigue por máscara (`LineasEnMascara`) y la
        foto por barrido (`Curtain`); sin gestos nuevos.

        Los cortes de la declaración se reescriben en cuatro líneas cortas: la
        más larga cabe con margen en la columna estrecha del split a 1024 (el
        peor caso) y en 375, medido contra su line-height. Antes eran dos líneas
        largas que envolvían y soltaban "tela" y "paisaje." huérfanas.
      */}
      <section id="verdad-material" className="bg-brand-deep text-paper">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <PhotoCurtain
            dark
            src={foto("macro-fibra-blanca")?.ruta}
            alt={foto("macro-fibra-blanca")?.alt}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="min-h-[62vw] sm:min-h-[360px] lg:min-h-0 lg:h-full"
          />
          <div className="flex flex-col justify-center gap-5 px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
            <Reveal tipo="etiqueta">
              <span className="font-mono text-xs uppercase tracking-widest text-brand">
                Verdad material
              </span>
            </Reveal>
            {/* Declaración, no párrafo: va por máscara como los titulares. */}
            <LineasEnMascara
              as="p"
              delay={MASCARA.stagger}
              lineas={[
                "La trama ampliada",
                "hasta que la tela deja",
                "de parecer tela y se",
                "vuelve paisaje.",
              ]}
              className="font-sans font-medium leading-[1.12] tracking-[-0.02em] text-[clamp(1.5rem,0.9rem_+_1.6vw,2.375rem)]"
            />
            <Reveal tipo="cuerpo" delay={MASCARA.stagger * 2}>
              <p className="max-w-md font-serif text-body-m text-paper/70">
                Macrofotografía de la trama: el mismo poliéster que tejemos y
                teñimos, visto tan de cerca que la estructura se lee como
                relieve.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="categorias" className="py-16 sm:py-24">
        <Container>
          <SectionHeader index="03" title="Familias de tela" tag="Catálogo por familia" />
          <RevealGroup
            variante="rejilla"
            className="grid grid-cols-1 gap-px border border-greige bg-greige sm:grid-cols-2 lg:grid-cols-4"
          >
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
          <SectionHeader index="04" title="Encuentros" tag="Eventos recientes" />
          <EventCarousel slides={eventSlides} />
        </Container>
      </section>

      {/*
        Asesor virtual — la mitad derecha lleva FOTO que cambia con el paso
        activo (Prenda / Sublimado / Uso), no un panel. Toda la lógica —ciclo
        automático, pausa al hover, fijar al pulsar, reduced-motion— vive en
        `AsesorPasos`, que además pone la sección sobre fondo CLARO a propósito:
        con "Verdad material" (oscuro con foto) y el footer (oscuro) delante y
        detrás, otro bloque oscuro con foto los volvía gemelos y cerraba la
        portada en tres bandas de tinta. Claro rompe las dos cosas.
      */}
      <AsesorPasos
        eyebrow="Asesor virtual"
        titular={[
          "¿No sabes qué",
          "tela necesitas?",
          "Te acompañamos hasta",
          "el color exacto.",
        ]}
        parrafo="Tres preguntas y un asesor te devuelve una recomendación concreta: referencia, gramaje y tono, lista para pedir muestra."
        cta={{ label: "Probar el asesor virtual →", href: "/asesor-virtual" }}
        pasos={pasosAsesor}
      />
    </div>
  );
}
