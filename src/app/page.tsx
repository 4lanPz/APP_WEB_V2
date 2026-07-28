import Link from "next/link";
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
// ▼ BANCO — temporal. Se va con los cuatro bloques marcados igual.
import { BancoCTA } from "@/components/ui/BancoCTA";
import {
  CONTORNO_CLARO,
  CONTORNO_OSCURO,
  WHATSAPP_CLARO,
  solidaClara,
} from "@/components/ui/sistemaPortada";
import { MASCARA } from "@/lib/motion";
import { categories } from "@/data/taxonomy";
import { foto } from "@/data/imagenes";
import { WHATSAPP_HREF } from "@/data/whatsapp";

/* ══════════════════════════════════════════════════════════════════════════════
 *
 *   PORTADA — SISTEMA DE BOTONES NUEVO, A PRUEBA. NINGUNA OTRA PÁGINA LO USA.
 *
 *   Las once rutas restantes siguen con `buttonVariants.ts` intacto. Lo único
 *   compartido que cambia es el filete activo del navbar (styleguide §C), que
 *   se ve en todas pero no obligó a tocar ningún otro fichero.
 *
 * ──────────────────────────────────────────────────────────────────────────────
 *
 *   LAS TRES DECISIONES ABIERTAS — CAMBIA EL VALOR, GUARDA Y RECARGA
 *
 *   Las tres gobiernan el MISMO botón: la sólida clara, que en esta página es
 *   «Solicitar muestra →», en el bloque del asesor virtual (el último de la
 *   portada, sobre fondo hueso), justo al lado del verde de WhatsApp.
 *
 *   ┌ FILETE_EN_SOLIDA ─────────────────────────────────────────────────────┐
 *   │ true   filete de tinta alrededor del relleno.                         │
 *   │ false  sin filete.                                                    │
 *   │                                                                       │
 *   │ Qué está en juego: el relleno azul contra `paper` da 2,56:1 y el       │
 *   │ límite de un control pide 3:1 — sin filete el botón no tiene borde     │
 *   │ reconocible, aunque su texto se lea perfectamente (6,11:1).           │
 *   │ Con SOLIDA_EN_TINTA en true no se aprecia: borde y relleno coinciden.  │
 *   └───────────────────────────────────────────────────────────────────────┘
 *
 *   ┌ HOVER_INVIERTE_POLARIDAD ─────────────────────────────────────────────┐
 *   │ true   al pasar el cursor el fondo se va a oscuro y el texto a claro.  │
 *   │ false  el fondo se mantiene claro y el texto oscuro; el hover solo     │
 *   │        aclara un paso el relleno (y el botón se levanta, como todos).  │
 *   │                                                                       │
 *   │ Qué está en juego: es el gesto más llamativo de todo el sistema. Con   │
 *   │ inversión el botón «se enciende»; sin ella el hover es casi mudo, pero │
 *   │ el botón no cambia de personalidad a mitad de interacción.             │
 *   └───────────────────────────────────────────────────────────────────────┘
 *
 *   ┌ SOLIDA_EN_TINTA ──────────────────────────────────────────────────────┐
 *   │ false  relleno azul de marca + texto tinta (propuesta principal).      │
 *   │ true   relleno tinta + texto papel (styleguide §E).                    │
 *   │                                                                       │
 *   │ Qué está en juego: en tinta pasa todo con margen y el azul queda libre │
 *   │ para lo que globals.css dice que es —logo y énfasis—. A cambio, el     │
 *   │ botón más importante del sitio deja de llevar el color de la marca.    │
 *   │                                                                       │
 *   │ OJO al mirar el verde: con `true` desaparece el único azul de esa fila │
 *   │ y se pierde la comparación teal/#33A2DC. Para juzgar los verdes,       │
 *   │ déjalo en `false`.                                                     │
 *   └───────────────────────────────────────────────────────────────────────┘
 *
 * ────────────────────────────────────────────────────────────────────────── */

const FILETE_EN_SOLIDA = true;
const HOVER_INVIERTE_POLARIDAD = true;
const SOLIDA_EN_TINTA = true;

const SOLIDA = solidaClara({
  filete: FILETE_EN_SOLIDA,
  hoverInvierte: HOVER_INVIERTE_POLARIDAD,
  tinta: SOLIDA_EN_TINTA,
});

/** Glifo oficial de WhatsApp, el mismo que usa el flotante. */
function GlifoWhatsApp() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.898 9.825 9.825 0 012.892 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

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

        OPCIÓN B — el CTA pierde el relleno. Solo navega: lleva al catálogo, no
        compromete nada. En contorno oscuro sigue siendo la única acción de la
        pantalla, y el relleno azul deja de significar dos cosas a la vez. Es la
        variante que hoy no existe: `secondary` es `text-ink` y sobre la banda
        de tinta del hero daría 1:1 — por eso las siete cabeceras acababan
        tirando del azul.

        El `primaryCtaClassName` es la vía para que esto pase SOLO aquí: las
        otras seis cabeceras no lo pasan y siguen pintando el `primary` de hoy.
      */}
      <Hero
        video
        eyebrow="Fabricante y distribuidor textil · Ecuador · desde 1987"
        headlineLines={["Tela deportiva", "premium, tejida", "y teñida a tu", "color exacto."]}
        subhead="Seleccionamos el hilo, tejemos el rollo y lo teñimos al tono que tu marca necesita. Rigor de ingeniería, mano de taller —desde Ecuador para marcas, distribuidores y retail premium."
        primaryCta={{ label: "Ver catálogo de telas →", href: "/productos" }}
        primaryCtaClassName={CONTORNO_OSCURO}
        /* ▼ BANCO · 1 de 4 — el caso difícil: foto con textura bajo el botón. */
        banco={
          <BancoCTA
            superficie="foto"
            etiqueta="Ver catálogo de telas →"
            nota="Las cifras salen del peor píxel de la foto que hay realmente debajo de cada botón, no de la tinta plana del <header>: la imagen es un <img> hermano con su opacidad y su velo, y subir por el árbol de fondos la ignoraría."
          />
        }
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
                <p className="mt-2 font-mono text-label uppercase text-graphite">
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

      {/* ▼ BANCO · 2 de 4 — superficie PAPEL, el fondo de página. Va suelto y no
          dentro de una sección con contenido para que se pueda borrar de un
          tirón; el plano de debajo es el mismo `paper` que el resto. */}
      <section className="pb-10">
        <Container>
          <BancoCTA
            superficie="papel"
            nota="El fondo de página. Aquí la 03 debería desaparecer: relleno papel sobre papel es 1:1 y sin filete no queda nada que delimite el botón."
          />
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
                <span className="font-mono text-label uppercase text-accent">
                  Verbo {verbo.index}
                </span>
                <h3 className="mt-4 font-sans text-h3 font-semibold text-ink">
                  {verbo.title}
                </h3>
                <p className="mt-3 font-serif text-body-s text-graphite">
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
              <span className="font-mono text-label uppercase text-brand">
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
              // eslint-disable-next-line no-restricted-syntax -- display "Verdad material": tamaño fluido único, fuera de la escala editorial (fase 3)
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

        {/* ▼ BANCO · 3 de 4 — superficie BRAND-DEEP, dentro de la banda real. */}
        <Container className="pb-14">
          <BancoCTA
            superficie="brand-deep"
            nota="Plano oscuro sin textura. Es donde la 02 se juega su papel: azul de marca sobre azul profundo, con el filete de tinta como único límite."
          />
        </Container>
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
      {/* ▼ BANCO · 4 de 4 — superficie HUESO. Va pegado al bloque del asesor,
          que es de hueso: los dos leen como una sola banda. */}
      <section className="bg-bone pt-14">
        <Container>
          <BancoCTA
            superficie="hueso"
            nota="La superficie donde ya probaste la sólida en tinta. La 03 aquí es papel sobre hueso: se separa, pero por poco."
          />
        </Container>
      </section>

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
        ctaClassName={CONTORNO_CLARO}
        acciones={
          <>
            {/*
              LA SÓLIDA — el botón que gobiernan las tres constantes de arriba.

              Aviso de honestidad: en opción B pura este botón NO existiría en
              la portada. B reserva el relleno para lo que compromete algo
              —enviar datos, abrir WhatsApp— y la portada no tiene formulario,
              así que su único relleno legítimo sería el verde. Está aquí porque
              hacen falta las dos cosas que pediste y este es el sitio donde se
              juzgan juntas: ver la sólida en la página real (no en una rejilla
              de muestras) y tener el azul de marca pegado al teal.

              Se quita entero borrando este bloque; no lo usa nada más.
            */}
            <Link href="/contacto" className={SOLIDA}>
              Solicitar muestra →
            </Link>

            {/*
              WHATSAPP — opción 3: #008069 con glifo blanco.

              Va aquí y no en el hero por dos motivos. Es el cierre de la página
              y el único gesto que sale del sitio, que es lo que en opción B
              justifica el relleno. Y sobre claro es donde el verde tiene que
              demostrar lo suyo: 4,38:1 contra `paper` es lo que le permite ir
              SIN filete, que era la hipótesis a confirmar. El flotante de la
              esquina sigue con el verde de hoy (#25D366): es compartido por las
              doce rutas y no se ha tocado, así que en esta página se ven los dos
              verdes a la vez y se pueden comparar.
            */}
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className={WHATSAPP_CLARO}
            >
              <GlifoWhatsApp />
              Escribir por WhatsApp
            </a>
          </>
        }
        pasos={pasosAsesor}
      />
    </div>
  );
}
