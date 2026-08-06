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

/*
 * EL NUMERADO DE SECCIÓN SALE DEL ORDEN, NO DE LA MANO.
 *
 * Antes cada `SectionHeader` traía su `index="02"` escrito, y reordenar la
 * portada obligaba a renumerar cuatro cabeceras a mano —con el fallo clásico de
 * dejarse una y publicar un 01, 03, 03, 04—. Aquí el índice es "el siguiente",
 * así que mover un bloque de sitio lo renumera todo sin tocar nada más: las
 * llamadas se resuelven en el orden en que se construye el JSX, que es el orden
 * en que se leen en pantalla.
 *
 * SE CREA DENTRO DE `Home()`, Y ESO ES LO IMPORTANTE. Un contador en el módulo
 * sería estado compartido entre peticiones: el servidor lo incrementaría en cada
 * render y el segundo visitante vería 04, 05, 06. Uno por render empieza siempre
 * en 01.
 *
 * NO NUMERA TODAS LAS SECCIONES, solo las que ya llevaban índice. El numerado
 * marca el recorrido del catálogo; "Verdad material" es declaración de marca y
 * el asesor es una herramienta, y ninguno de los dos usa `SectionHeader`.
 */
function numerador() {
  let n = 0;
  return () => String(++n).padStart(2, "0");
}

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
  const numero = numerador();

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
      />

      {/*
        Verdad material — DOS COLUMNAS CON AIRE, DENTRO DEL CONTENEDOR AMPLIO.

        Era un split a sangre sobre azul profundo, con la foto tocando el borde
        izquierdo y pegada al texto. Cambian las dos cosas:

        EL FONDO. El azul lo pintaba esta misma sección (`bg-brand-deep`), no un
        componente compartido, así que quitarlo no arrastra a ninguna otra
        pantalla. Con él fuera, la portada deja de tener tres bandas oscuras
        —hero, esta y el footer— y pasa a tener las dos de los extremos, que era
        justo lo que el asesor virtual ya intentaba compensar poniéndose claro a
        propósito (ver su comentario más abajo). El cambio de fondo arrastra el
        tono de todo lo de dentro: el `dark` de la foto, el azul de la etiqueta
        —sobre papel `brand` se queda en 2,56:1— y el `paper/70` del párrafo.

        LA COMPOSICIÓN. La foto ya no rompe el contenedor: las dos columnas viven
        en la misma rejilla, con una separación que a 1440 son 80 px. La foto
        pierde el "medio ancho de pantalla" que tenía a sangre, y por eso lleva
        alto propio: sin él, una columna de rejilla se queda a la altura del
        texto y la macro dejaría de verse como macro.

        En móvil se apilan CON LA FOTO PRIMERO, 40 px por encima del texto. Es el
        mismo orden que ya tenían —la sección enseña una trama y luego la
        explica—, así que el cambio no reordena nada de lo que ya se leía.

        Los gestos siguen siendo los de antes: la declaración por máscara
        (`LineasEnMascara`), la foto por barrido (`Curtain`). Sin gestos nuevos.
      */}
      <section id="verdad-material" className="py-16 sm:py-24">
        <Container ancho="amplio">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <PhotoCurtain
              src={foto("macro-fibra-blanca")?.ruta}
              alt={foto("macro-fibra-blanca")?.alt}
              /*
               * 40vw y no los 45 de antes: la columna ya no es media pantalla a
               * sangre, sino la mitad del contenedor amplio menos la separación
               * —579 px de 1440—. Servir la variante de 45vw sería descargar una
               * foto más grande que el hueco donde va a caber.
               */
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="min-h-[62vw] sm:min-h-90 lg:min-h-130"
            />
            <div className="flex flex-col gap-5">
              <Reveal tipo="etiqueta">
                <span className="font-mono text-label uppercase text-accent">
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
                className="font-sans font-medium leading-[1.12] tracking-[-0.02em] text-[clamp(1.5rem,0.9rem_+_1.6vw,2.375rem)] text-ink"
              />
              <Reveal tipo="cuerpo" delay={MASCARA.stagger * 2}>
                <p className="max-w-md font-serif text-body-m text-graphite">
                  Macrofotografía de la trama: el mismo poliéster que tejemos y
                  teñimos, visto tan de cerca que la estructura se lee como
                  relieve.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeader index={numero()} title="Textil Padilla en cifras" tag="Desde 1987" />
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

      {/*
        Familias de tela — ANCHO AMPLIO Y CUATRO PIEZAS SUELTAS.

        Era una "seam grid": `gap-px` sobre un fondo greige con borde exterior,
        de modo que las cuatro cards compartían filete y se leían como una sola
        banda de cuatro casillas. Es el patrón correcto para las cifras —donde el
        bloque ES la unidad— y el equivocado aquí: cada card es una familia
        distinta y un destino distinto, y lo que se pedía al ojo era justo lo que
        el filete compartido impedía, distinguir dónde acaba una y empieza la
        siguiente.

        Fuera el borde, fuera el fondo y `gap-px` pasa a separación de verdad. Las
        cards se apoyan en el papel sin filete propio: no lo necesitan, porque
        son planos oscuros sobre fondo claro y el contraste ya las recorta.

        LAS CUATRO COLUMNAS SUBEN DE `lg` A `xl`, Y ESO NO ESTABA EN EL ENCARGO.
        Medido: con el salto en `lg` (1024 px) y separación de verdad, la card se
        quedaba en 196 px de ancho —menos que los 219 que tenía con `gap-px`—, y
        dentro de esos 196 hay 60 de relleno, así que al título de 28 px le
        quedaban 136 px: "Polialgodón" no cabía en una línea. La sección pedía
        cards más anchas y en el portátil más común salían más estrechas. Con el
        salto en `xl` (1280 px), entre 1024 y 1279 se ven dos columnas de 428 px
        y a partir de ahí cuatro. Anchos reales de card, antes → después: 1024
        219 → 428 · 1280 264 → 257 · 1440 259 → 291 · 1920 249 → 282. El único
        tramo que pierde es 1280–1440, y pierde 7 px: ahí el contenedor todavía
        no ha llegado a su tope de 1440 y los huecos cuestan más de lo que el
        ancho amplio aporta.

        La separación es la misma en los tres modos (24 px). No hace falta más:
        son planos de tinta sobre papel, y el contraste hace la mitad del trabajo
        que en una rejilla de fondos claros haría el hueco.
      */}
      <section id="categorias" className="py-16 sm:py-24">
        <Container ancho="amplio">
          <SectionHeader index={numero()} title="Familias de tela" tag="Catálogo por familia" />
          <RevealGroup
            variante="rejilla"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
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
                  foto={foto(`familia-${category.slug}`)}
                  /* Cuatro columnas desde 1280, no desde 1024: ver la rejilla. */
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="h-full"
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeader index={numero()} title="Encuentros" tag="Eventos recientes" />
          <EventCarousel slides={eventSlides} />
        </Container>
      </section>

      {/*
        Asesor virtual — la mitad derecha lleva FOTO que cambia con el paso
        activo (Prenda / Sublimado / Uso), no un panel. Toda la lógica —ciclo
        automático, pausa al hover, fijar al pulsar, reduced-motion— vive en
        `AsesorPasos`, que además pone la sección sobre fondo CLARO a propósito.

        EL MOTIVO ORIGINAL YA NO ES EL QUE ERA, y conviene dejarlo dicho: iba en
        claro porque "Verdad material" (entonces oscuro con foto) quedaba delante
        y el footer detrás, y un tercer bloque oscuro con foto los volvía gemelos
        y cerraba la portada en tres bandas de tinta. Con "Verdad material" pasada
        a papel, esas tres bandas ya no existen — pero la decisión se sostiene por
        sí sola: el asesor es el último bloque antes del footer, y ponerlo oscuro
        lo pegaría a él sin costura. `bone` lo separa del papel de las secciones
        de arriba sin abrir otra banda de tinta.
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
      {/*
        NO HAY BOTÓN DE WHATSAPP EN ESTA PÁGINA, Y NO ES UN OLVIDO.
        Hubo uno aquí mientras el flotante todavía iba en #25D366: servía para
        comparar los dos verdes en pantalla. Desde que el flotante pasó a
        #008069 (`BotonWhatsApp.tsx`) los dos eran el mismo relleno, el mismo
        verde y el mismo `WHATSAPP_HREF` genérico — duplicado exacto, no
        jerarquía. La portada no tiene contexto que justifique un mensaje
        propio, a diferencia del resultado del asesor, que sí manda la
        recomendación ya escrita (`AsesorWizard.tsx`, `whatsappHref(...)`).
        Si vuelve a hacer falta un WhatsApp de cuerpo aquí, tendrá que traer
        un destino distinto del flotante; si no, el flotante ya lo cubre.
      */}
    </div>
  );
}
