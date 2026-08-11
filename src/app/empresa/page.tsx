import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/ui/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { BloqueFotoTexto } from "@/components/ui/BloqueFotoTexto";
import { Timeline } from "@/components/ui/Timeline";
import { DraftNotice } from "@/components/ui/DraftNotice";
import { foto } from "@/data/imagenes";
import { HITOS } from "@/data/hitos";
import { buttonVariants } from "@/components/ui/buttonVariants";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { numerador } from "@/lib/numerador";

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

/*
 * LOS HITOS YA NO SE ESCRIBEN AQUÍ: viven en `src/data/hitos.ts`.
 *
 * Estaban en esta página Y en `SLOTS_HITOS` del registro de slots, y las dos
 * copias habían divergido —cinco entradas del registro llevaban año y cuatro
 * no, dos se llamaban las dos «Apertura de local»—, así que el encargo de
 * fotografía pedía dos fotos indistinguibles. Con la fuente única, el rótulo
 * del registro se deriva del año y el título que se ven aquí.
 */

/*
 * ORDEN DE LA PÁGINA: origen → propósito → taller → valores → cronología.
 *
 * Se cuenta de dónde venimos antes de decir a dónde vamos, y las dos cosas
 * antes de enseñar dónde se hacen. La línea de hitos cierra: es el registro que
 * respalda todo lo anterior, no la puerta de entrada.
 *
 * Los índices los pone `numerador()` según ESTE orden, así que mover una sección
 * de sitio renumera las cabeceras sin tocarlas. Los `id` viajan con su sección
 * —`#historia`, `#manifiesto`, `#infraestructura`, `#hitos` siguen existiendo y
 * apuntando a lo mismo—, que es lo que mantiene vivos el CTA del hero y los
 * enlaces del footer.
 *
 * «Los valores» no consume número: no usa `SectionHeader`, y no lo usa porque
 * está pendiente de rediseño.
 */
export default function EmpresaPage() {
  const numero = numerador();

  return (
    <div className="flex flex-col">
      <Hero
        /* PRUEBA de fondo fotográfico en hero — solo aquí, a evaluar. */
        imagen="hero-empresa"
        eyebrow="Nuestra empresa · Taller textil · Ecuador · desde 1987"
        headlineLines={["Un taller que", "aprendió a callar", "y a medirlo todo."]}
        subhead="Casi cuatro décadas seleccionando hilo, tejiendo rollo y afinando color desde Ecuador. Somos un fabricante familiar con mentalidad de ingeniero: herencia de oficio, disciplina de ficha técnica."
        primaryCta={{ label: "Conocer nuestra historia →", href: "#historia" }}
      />

      {/*
        De dónde venimos — LA COMPOSICIÓN DE «VERDAD MATERIAL», INVERTIDA.

        Era una rejilla propia de esta página: dos columnas desiguales
        (1,15 / 0,85) con 64 px de separación, dentro del contenedor normal.
        Pasa a `BloqueFotoTexto` —el split de la portada— en el contenedor
        AMPLIO: dos mitades iguales con 80 px de aire a 1440.

        INVERTIDA, y por eso existe la prop: aquí el texto abre por la izquierda
        y la foto cierra por la derecha, al revés que en la portada. No es un
        `order-*` sobre la misma rejilla: `invertido` cambia el orden en el DOM,
        así que el apilado en móvil sigue siendo el que ya tenía esta sección
        —primero el relato, después la foto— en vez de dársela vuelta.

        LA FOTO CONSERVA SU `aspect-4/5` y no hereda el alto de la portada. El
        slot `oficio-taller-alangasi` está registrado como vertical 4:5 y la foto
        real es de 1200 px de ancho: meterla en el marco apaisado de la macro
        sería recortarle media imagen. La composición se comparte; la proporción
        de cada foto es suya.

        La cabecera entra en el mismo contenedor amplio que el bloque, para que
        el filete de `SectionHeader` empiece y acabe donde empieza y acaba el
        texto que hay debajo. Es lo que ya hace «Familias de tela» en la portada.
      */}
      <section id="historia" className="py-16 sm:py-24">
        <Container ancho="amplio">
          <div className="mb-6">
            <DraftNotice>Contenido de ejemplo · pendiente de validación</DraftNotice>
          </div>
          <SectionHeader index={numero()} title="De dónde venimos" tag="Origen y evolución" />
          <BloqueFotoTexto
            invertido
            foto={{
              src: foto("oficio-taller-alangasi")?.ruta,
              alt: foto("oficio-taller-alangasi")?.alt,
              /* La columna es la mitad del contenedor amplio menos el aire: 579 px de 1440. */
              sizes: "(min-width: 1024px) 40vw, 100vw",
              caption: "Alangasí · el taller",
              className: "aspect-4/5",
            }}
          >
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
                  <p className="font-sans text-body-s font-semibold text-ink">
                    {item.value}
                  </p>
                  <p className="mt-1 font-mono text-label uppercase text-graphite">
                    {item.label}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </BloqueFotoTexto>
        </Container>
      </section>

      <section id="manifiesto" className="py-16 sm:py-24">
        <Container>
          <div className="mb-6">
            <DraftNotice>Contenido de ejemplo · pendiente de validación</DraftNotice>
          </div>
          {/*
            La etiqueta decía "Misión · Visión · Valores" y anunciaba tres cosas
            de las que aquí solo hay dos: los valores son su propia sección y
            ahora quedan dos secciones más abajo, con «El taller por dentro» en
            medio. La etiqueta enumera lo que hay debajo de ella, no el tema.
          */}
          <SectionHeader index={numero()} title="Lo que nos mueve" tag="Misión · Visión" />
          <RevealGroup className="flex flex-col divide-y divide-greige">
            <RevealItem className="grid grid-cols-1 gap-4 py-10 sm:grid-cols-[0.42fr_1fr] sm:gap-10">
              <span className="font-mono text-label uppercase text-accent">
                Misión
              </span>
              <p className="font-serif text-body-l text-ink">
                Convertir el mejor hilo disponible en tela que se comporta:
                gramaje medido, color exacto y una mano que se reconoce al
                tacto, rollo tras rollo.
              </p>
            </RevealItem>
            <RevealItem className="grid grid-cols-1 gap-4 py-10 sm:grid-cols-[0.42fr_1fr] sm:gap-10">
              <span className="font-mono text-label uppercase text-accent">
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

      <section id="infraestructura" className="bg-brand-deep py-16 text-paper sm:py-24">
        <Container>
          <SectionHeader
            index={numero()}
            title="El taller por dentro"
            tag="Oficio · manos y máquina"
            tone="dark"
          />
          {/* Aquí había un briefing de fotografía ("Documental de taller…
              Aquí irán las fotografías reales cuando estén listas"): una nota
              del mockup dirigida al fotógrafo, no al visitante, y se estaba
              publicando. La cabecera de sección ya dice qué es esto. */}
          <RevealGroup
            variante="rejilla" fondo="bg-brand-deep"
            className="grid grid-cols-1 gap-px bg-paper/15 sm:grid-cols-2">
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
              <ImagePlaceholder
                dark
                src={foto("oficio-tintoreria")?.ruta}
                alt={foto("oficio-tintoreria")?.alt ?? ""}
                sizes="(min-width: 640px) 50vw, 100vw"
                caption="02 · Tintorería"
                className="aspect-4/3"
              />
            </RevealItem>
            <RevealItem>
              <ImagePlaceholder
                dark
                src={foto("oficio-carta-color")?.ruta}
                alt={foto("oficio-carta-color")?.alt ?? ""}
                sizes="(min-width: 640px) 50vw, 100vw"
                caption="03 · Carta de color"
                className="aspect-4/3"
              />
            </RevealItem>
          </RevealGroup>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <MagneticLink href="/#asesor" className={buttonVariants({ variant: "contorno" })}>
              Hablar con un asesor →
            </MagneticLink>
            <Link
              href="/productos"
              className={buttonVariants({ variant: "enlace" })}
            >
              Ver catálogo de telas →
            </Link>
          </div>
        </Container>
      </section>

      {/*
        Los valores — PENDIENTE DE REDISEÑO, INTACTO A PROPÓSITO.

        Se mueve de sitio y nada más: sigue siendo la lista de cuatro filas
        separadas por filete, sin cabecera numerada, con el rótulo mono suelto
        que tenía. Llegará con el diseño ya decidido.

        CUANDO SE REDISEÑE VA EN `ancho="amplio"`. Es una rejilla de piezas
        —cuatro valores en paralelo, no un texto seguido—, que es exactamente el
        caso para el que se reservó el segundo ancho del `Container`. Hoy no se
        cambia porque en una lista de filas a todo lo ancho el ancho extra solo
        alarga la línea de lectura; en cuanto sea rejilla, deja de serlo.
      */}
      <section className="border-y border-greige bg-bone py-16 sm:py-24">
        <Container>
          <p className="mb-10 font-mono text-label uppercase text-graphite">
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
                <p className="max-w-2xl font-serif text-body-s text-graphite">
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

      {/*
        Línea de hitos — REDISEÑADA: horizontal, el año identifica y la foto es
        grande. Cierra la página en vez de partirla por la mitad.

        VA EN `ancho="amplio"`, igual que la rejilla de valores, y ahora sí lo
        necesita: son nueve tarjetas con foto de 4:3 en una fila que se recorre,
        y esos 200 px de contenedor son media tarjeta más de asomo — lo que hace
        que se vea que la fila sigue. El componente pone el carril y sus flechas.

        EL AVISO DE FECHAS SE QUEDA, y cubre a los nueve. Cuatro de los años
        (2013, 2017, 2021, 2024) están marcados en `data/hitos.ts` como no
        confirmados por administración, pero eso NO se pinta hito a hito: es una
        nota interna, viaja al registro de slots y de ahí al encargo de
        fotografía. Señalar cuatro de nueve en pantalla no le da un dato al
        visitante, le siembra una duda sobre los otros cinco.
      */}
      <section id="hitos" className="py-16 sm:py-24">
        <Container ancho="amplio">
          <div className="mb-6">
            <DraftNotice>Contenido de ejemplo · pendiente de validación</DraftNotice>
          </div>
          <SectionHeader index={numero()} title="La vida de Textil Padilla" tag="Registro cronológico" />
          <p className="mb-10 max-w-xl font-serif text-caption italic text-graphite">
            Fechas y aperturas por confirmar con administración.
          </p>
          <Timeline items={HITOS} />
        </Container>
      </section>
    </div>
  );
}
