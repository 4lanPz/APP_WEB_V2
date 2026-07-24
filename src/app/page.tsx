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
 * Los tres pasos del asesor, promovidos de rótulo suelto a contenido real: hoy
 * rellenan el panel que ocupa la mitad que antes quedaba en negro. Mismo dato
 * que el flujo de /asesor-virtual, resumido.
 */
const pasosAsesor = [
  { index: "01", title: "Prenda", desc: "Qué vas a producir: camiseta, chompa, pantalón…" },
  { index: "02", title: "Sublimado", desc: "Si lleva estampado full-print o color liso." },
  { index: "03", title: "Uso", desc: "Alto rendimiento, casual o uniforme corporativo." },
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
          <SectionHeader index="04" title="Dónde estuvimos" tag="Eventos recientes" />
          <EventCarousel slides={eventSlides} />
        </Container>
      </section>

      {/*
        Asesor virtual — mismo criterio que "Verdad material" (llenar la mitad
        que quedaba en negro, mismo peso a ambos lados), pero deliberadamente
        DISTINTA para que no sean dos bloques oscuros gemelos: aquí la derecha no
        es fotografía sino UI —el panel de los tres pasos con su barra de
        progreso—, promovido de rótulo suelto a contenido real. Es una
        herramienta, no una estampa, y se lee como tal.

        Bloque contenido (no a sangre): la macro de arriba ya toca el borde;
        repetirlo aquí volvería a acercarlos. El titular se reescribe en líneas
        cortas por la misma razón que la declaración —caben en la media columna
        del split sin envolver—.

        El split arranca a 768 (`md`), no a 1024: una tablet tiene ancho para
        dos columnas, así que ahí también se GANA altura en vez de perderla. Por
        debajo de 768 se apila, y entonces los tres pasos no van en el panel alto
        sino en un stepper horizontal compacto (01 → 02 → 03 con su barra) —el
        mismo patrón que la sección ya tenía—, que ocupa una fila en vez de una
        columna. A `md` la copia lleva algo más de ancho que el panel para que el
        titular no se apriete.
      */}
      <section id="asesor" className="bg-brand-deep py-16 text-paper sm:py-20">
        <Container>
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1.1fr_0.9fr] lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-6">
              <Reveal tipo="etiqueta">
                <span className="font-mono text-xs uppercase tracking-widest text-brand">
                  Asesor virtual
                </span>
              </Reveal>
              <LineasEnMascara
                as="h2"
                lineas={[
                  "¿No sabes qué",
                  "tela necesitas?",
                  "Te acompañamos hasta",
                  "el color exacto.",
                ]}
                className="font-sans text-h2 font-medium tracking-[-0.01em]"
              />
              <Reveal tipo="cuerpo" delay={MASCARA.stagger * 2}>
                <p className="max-w-md font-serif text-body-m text-paper/80">
                  Tres preguntas —qué prenda vas a producir, si la tela irá
                  sublimada y si buscas alto rendimiento o uso casual— y un
                  asesor te devuelve una recomendación técnica concreta:
                  referencia, gramaje y tono, lista para pedir muestra.
                </p>
              </Reveal>
              {/*
                Stepper compacto: solo cuando la sección está apilada (bajo 768).
                En el split lo sustituye el panel de la derecha, que dice lo mismo
                con más aire. `flex-wrap` para que a 375 nunca desborde.
              */}
              <div className="flex flex-col gap-3 md:hidden">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-xs uppercase tracking-widest">
                  {pasosAsesor.map((paso, i) => (
                    <span key={paso.index} className="flex items-center gap-3">
                      {i > 0 && <span className="text-paper/30">→</span>}
                      <span className={i === 0 ? "text-brand" : "text-paper/50"}>
                        {paso.index} {paso.title}
                      </span>
                    </span>
                  ))}
                </div>
                <div className="h-0.5 w-full max-w-xs bg-paper/15">
                  <div className="h-0.5 w-1/3 bg-brand" />
                </div>
              </div>
              <MagneticLink
                href="/asesor-virtual"
                className="mt-1 w-fit bg-brand px-7.5 py-4 font-sans text-base font-medium text-paper hover:bg-paper hover:text-brand-deep"
              >
                Iniciar con el asesor →
              </MagneticLink>
            </div>

            <Reveal tipo="tarjeta" className="hidden md:block">
              <div className="border border-paper/15 bg-paper/3 p-5 sm:p-7">
                {/* En la columna estrecha del split a 768 el sufijo envolvía
                    partiendo la frase; solo aparece desde lg, donde el panel ya
                    tiene ancho para una sola línea. */}
                <p className="font-mono text-xs uppercase tracking-widest text-paper/50">
                  Tres pasos<span className="hidden lg:inline"> · una recomendación</span>
                </p>
                <ol className="mt-5 flex flex-col divide-y divide-paper/12">
                  {pasosAsesor.map((paso) => (
                    <li key={paso.index} className="flex gap-4 py-3.5 first:pt-0 last:pb-0">
                      <span className="font-mono text-mono text-brand">{paso.index}</span>
                      <div>
                        <p className="font-sans text-[15px] font-semibold text-paper">
                          {paso.title}
                        </p>
                        <p className="mt-1 font-serif text-[14px] text-paper/65">
                          {paso.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-0.5 flex-1 bg-paper/15">
                    <div className="h-0.5 w-1/3 bg-brand" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-paper/40">
                    ~1 min
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </div>
  );
}
