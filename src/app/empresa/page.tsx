import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/ui/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AsesorPasos } from "@/components/ui/AsesorPasos";
import { BloqueFotoTexto } from "@/components/ui/BloqueFotoTexto";
import { RielDeEtapas } from "@/components/ui/RielDeEtapas";
import { Timeline } from "@/components/ui/Timeline";
import { DraftNotice } from "@/components/ui/DraftNotice";
import { buttonVariants } from "@/components/ui/buttonVariants";
import { foto } from "@/data/imagenes";
import { HITOS } from "@/data/hitos";
import { PASOS_ASESOR } from "@/data/pasos-asesor";
import { PhotoCurtain } from "@/components/motion/Curtain";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { ACERCAMIENTO_EN_DIPTICO } from "@/lib/motion-interaccion";
import { catalogAllLink } from "@/lib/nav-data";
import { numerador } from "@/lib/numerador";

export const metadata: Metadata = {
  title: "Nuestra Empresa — Textil Padilla",
  description:
    "Casi cuatro décadas seleccionando hilo, tejiendo rollo y afinando color desde Alangasí, Ecuador.",
};

/**
 * PROPORCIÓN DE LAS DOS FOTOS DEL DÍPTICO.
 *
 * La maqueta las pide CUADRADAS y se montaron así. El problema no era el tamaño
 * —a 1440 miden 607 px de lado, que es prácticamente el techo del contenedor
 * amplio— sino la PROPORCIÓN DE LA COLUMNA: un cuadrado de 607 con 138 px de
 * declaración debajo da una pieza de 745 × 607, o sea más alta que ancha, y eso
 * es lo que se lee como esbelta por mucho que la foto crezca. Ensanchar no lo
 * arregla: la columna crece a lo ancho y a lo alto a la vez.
 *
 * A 4:3 la foto mide 607 × 455 y la columna entera 593 × 607 — ligeramente más
 * ancha que alta, que es lo que la endereza. A 5:4 serían 607 × 486 y la columna
 * 624 × 607, casi cuadrada.
 *
 * SE ELIGE 4:3 Y NO 5:4 POR UNA RAZÓN QUE NO ES DE ESTA SECCIÓN: 4:3 ya es la
 * proporción de la galería de telas, del carrusel de encuentros y de las fotos
 * de la línea de hitos, mientras que 5:4 no existe hoy en ningún hueco del
 * sitio. Meterla aquí sería una quinta proporción en el registro de fotografía
 * —y por tanto en el encargo a marketing— para ganar 31 px de alto.
 *
 * VIVE EN UNA CONSTANTE porque la comparten las dos columnas y porque tiene que
 * cuadrar con la `nota` de los dos slots: si esto cambia, ahí hay que decirlo.
 */
const PROPORCION_DIPTICO = "aspect-4/3";

/**
 * Las dos declaraciones del díptico. Cada una con su hueco de fotografía,
 * registrado en `data/slots-imagen.ts`.
 *
 * EL TEXTO DE LA VISIÓN VIENE RECORTADO DEL EXPORT DE DISEÑO: acaba en «sino por
 * el criterio» y ya no arrastra «la casa a la que se acude cuando el color y la
 * constancia no admiten error». No es una pérdida por descuido — esa frase es
 * una segunda afirmación metida detrás de la primera con dos puntos, y en un
 * bloque a media columna bajo una foto de 583 px la declaración tiene que caber
 * de una lectura. Sigue viva en la maqueta como titular propio de otra variante.
 */
const DECLARACIONES = [
  {
    rotulo: "Misión",
    slot: "manifiesto-mision",
    texto:
      "Convertir el mejor hilo disponible en tela que se comporta: gramaje medido, color exacto y una mano que se reconoce al tacto, rollo tras rollo.",
  },
  {
    rotulo: "Visión",
    slot: "manifiesto-vision",
    texto:
      "Ser el partner de manufactura textil de referencia para las marcas, distribuidores y retail premium de la región andina —reconocidos no por el volumen, sino por el criterio.",
  },
];

/*
 * LOS CUATRO VALORES YA NO SE ESCRIBEN AQUÍ, y no porque se hayan movido a un
 * componente: la sección que los pintaba se retiró. El contenido está entero en
 * `src/data/valores.ts`, que no lo importa nadie a propósito — ver allí.
 */

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

      {/*
        Lo que nos mueve — DÍPTICO: dos columnas iguales, foto cuadrada sobre la
        declaración. Antes eran dos filas de rótulo + párrafo separadas por
        filete, sin una sola imagen.

        VA EN `ancho="amplio"`, y esta vez lo pide el contenido: son dos piezas
        simétricas en paralelo —el caso literal para el que `globals.css` reserva
        el segundo ancho—, y lo que crece con el contenedor no es la línea de
        lectura sino el LADO DE LAS FOTOS, que pasan de 504 a 583 px. La
        declaración no se alarga con él: sigue siendo media columna.

        LAS DOS COLUMNAS SON IGUALES A PROPÓSITO. Misión y visión no se jerarquizan
        entre sí, y cualquier reparto desigual diría que una manda sobre la otra.

        LOS VALORES NO ENTRAN AQUÍ: siguen en su propia sección, dos más abajo.

        LA FOTO NO VA DENTRO DE UN `RevealItem`. Su gesto es el barrido de
        `Curtain` —el de toda fotografía del sitio— y el del texto es el de un
        cuerpo; montados en el mismo nodo serían dos entradas discutiendo por el
        mismo elemento, que es lo que ya evita `BloqueFotoTexto`.
      */}
      <section id="manifiesto" className="py-16 sm:py-24">
        <Container ancho="amplio">
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
          {/*
            LA CALLE ES DE 24 px DESDE QUE HAY DOS COLUMNAS, el mínimo del propio
            clamp del diseño (`clamp(24px,4vw,72px)`), y no es una preferencia
            estética: es lo único que queda para dar ancho a las fotos. La
            columna es `(1238 útiles − calle) / 2`, así que cada píxel que se le
            quita a la calle son medio píxel para cada foto. Con 24 salen 607 px
            de lado a 1440; con la calle a cero —que ya no sería una calle— serían
            619, y ese es el techo del contenedor amplio.

            Apilado (por debajo de 640) la separación vuelve a 40 px: ahí no es
            una calle entre columnas sino el aire entre una declaración y la
            siguiente, y 24 px las pegaría.
          */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-6">
            {DECLARACIONES.map((d) => (
              /*
                `group` para que la foto se acerque al señalar CUALQUIER parte de
                la declaración, no solo la imagen: la columna entera es la pieza.
              */
              <div key={d.rotulo} className="group">
                <PhotoCurtain
                  src={foto(d.slot)?.ruta}
                  alt={foto(d.slot)?.alt ?? ""}
                  /* La columna es media anchura del contenedor amplio: 583 px de 1440. */
                  sizes="(min-width: 640px) 45vw, 100vw"
                  sublabel={d.rotulo}
                  zoomOnGroupHover={ACERCAMIENTO_EN_DIPTICO}
                  className={PROPORCION_DIPTICO}
                />
                <Reveal>
                  {/*
                    Rótulo y filete comparten línea de base. El filete es
                    decorativo —no marca ningún estado—, y por eso puede ir en
                    `brand`: la norma de contraste de 3:1 cubre los indicadores
                    de estado y los límites de control, no la puntuación
                    editorial.
                  */}
                  <div className="flex items-baseline gap-3.5 pt-7 pb-3.5">
                    <span className="font-mono text-label uppercase text-accent">
                      {d.rotulo}
                    </span>
                    <span aria-hidden className="block h-px w-10 bg-brand" />
                  </div>
                  <p className="font-sans text-h3 font-medium text-ink">
                    {d.texto}
                  </p>
                </Reveal>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/*
        El taller por dentro — RIEL DE ETAPAS. Eran tres fotografías fijas en
        mosaico —nave de tejido, tintorería, carta de color— y pasa a ser el
        recorrido completo en cinco etapas con una sola foto grande.

        LO QUE GANA NO ES INTERACCIÓN, ES EL RECORRIDO. El mosaico enseñaba tres
        sitios de la planta sin decir en qué orden ocurren; el riel es la línea
        que sigue la tela, y las dos etapas que faltaban —control de calidad y
        envío— son justamente las que sostienen lo que la página afirma sobre
        medir y documentar.

        Las cinco etapas viven en `data/etapas-taller.ts`, que es también de
        donde el registro de slots deriva sus cinco huecos de fotografía.
      */}
      <section id="infraestructura" className="bg-brand-deep py-16 text-paper sm:py-24">
        <Container>
          <SectionHeader
            index={numero()}
            title="El taller por dentro"
            tag="Recorrido en cinco etapas"
            tone="dark"
          />
          {/*
            Aquí había un briefing de fotografía ("Documental de taller… Aquí
            irán las fotografías reales cuando estén listas"): una nota del
            mockup dirigida al fotógrafo, no al visitante, y se estaba
            publicando. La cabecera de sección ya dice qué es esto.

            Y después hubo un "Elija una etapa del riel para verla de cerca",
            que se ha ido con el avance automático: era una instrucción de uso, y
            una pieza que ya se mueve sola no necesita que le expliquen que se
            puede tocar. Si hiciera falta la frase, el problema sería el riel.

            LOS DOS BOTONES DE AQUÍ ABAJO TAMBIÉN SE RETIRAN («Hablar con un
            asesor», «Ver catálogo de telas»). El bloque de asesor que cierra
            ahora la página cubre la conversación, y el catálogo lo repone la
            línea de cierre del final — no aquí: a media página el visitante
            todavía está leyendo quiénes somos.
          */}
          <RielDeEtapas />
        </Container>
      </section>

      {/*
        AQUÍ ESTABA «LOS VALORES QUE NO NEGOCIAMOS». Marketing la retira
        (agosto de 2026).

        EL CONTENIDO NO SE HA PERDIDO: los cuatro valores y la cita de cierre
        están enteros en `src/data/valores.ts`, con la nota de cómo tenía que
        volver si vuelve (rejilla de cuatro piezas en `ancho="amplio"`, que era
        el rediseño pendiente). No tenía ningún hueco de imagen, así que
        retirarla no da de baja ningún slot ni cambia el encargo de fotografía.

        LA CITA SIGUE PUBLICÁNDOSE. Es la misma frase que el footer imprime en
        las trece páginas (`footerBrandQuote`), así que al irse esta sección
        /empresa no la pierde: deja de decirla dos veces seguidas.
      */}

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

      {/*
        Asesor virtual — EL MISMO BLOQUE DE LA PORTADA, no una copia.
        `AsesorPasos` ya estaba parametrizado por completo (eyebrow, titular,
        párrafo, CTA y pasos), así que reutilizarlo es pasarle otro texto: no ha
        hecho falta tocar el componente.

        LAS TRES FOTOS SON LAS MISMAS, y a propósito. `asesor-portada-*` son los
        huecos que ya alimentan el bloque en la portada, y los pasos son los
        mismos tres —Prenda, Sublimado, Uso—: pedir tres fotos nuevas para
        enseñar exactamente lo mismo en otra página duplicaría el encargo sin
        ganar nada. Es el trato que ya tienen las cards de familia, que salen en
        tres rejillas con un solo archivo cada una.

        EL TEXTO SÍ CAMBIA. En la portada el bloque abre la conversación con
        alguien que acaba de llegar («¿No sabes qué tela necesitas?»); aquí cierra
        una página que se ha pasado cuatro secciones contando cómo se mide y se
        tiñe, así que engancha con eso en vez de volver a presentarse. El mismo
        párrafo en los dos sitios se leería como una plantilla repetida.

        NO REPONE EL ENLACE AL CATÁLOGO — este bloque lleva al asesor, que es otra
        cosa. Lo repone la línea de cierre de aquí abajo.
      */}
      <AsesorPasos
        eyebrow="Asesor virtual"
        titular={["Ya sabe cómo", "trabajamos.", "Vamos a su color."]}
        parrafo="Tres preguntas y un asesor le devuelve una recomendación concreta: referencia, gramaje y tono, lista para pedir muestra."
        cta={{ label: "Probar el asesor virtual →", href: "/asesor-virtual" }}
        pasos={PASOS_ASESOR}
      />

      {/*
        SALIDA AL CATÁLOGO — lo único que /empresa perdió al retirar los dos
        botones del taller, y lo que se repone aquí.

        VA AL FINAL Y NO AL PIE DEL RIEL. A media página el visitante todavía
        está leyendo quiénes somos; mandarlo al catálogo ahí lo saca del relato
        por la mitad. Aquí ya lo ha terminado, y la pregunta que le queda —«¿y qué
        telas hacen?»— es exactamente la que este enlace contesta.

        LA ETIQUETA Y EL DESTINO SON `catalogAllLink`, la misma constante que
        pinta el «ver todo» del mega-menú y del menú móvil. Escribir el rótulo a
        mano es lo que ya hizo divergir tres veces la navegación, y este enlace
        cumple la misma función que aquel: la salida general al catálogo. (El
        hero de la portada y el cierre de /contacto sí llevan texto propio —«Ver
        catálogo de telas →»—, que son CTA redactados para su página, no el «ver
        todo» del sistema.)

        VARIANTE `enlace` Y NO UN BOTÓN. El bloque del asesor termina con un
        contorno; otro control con caja justo debajo serían dos botones
        discutiendo por el mismo final de página. `enlace` es la variante que el
        sistema define como el enlace de texto dentro del flujo de lectura, que
        es lo que esto es: una línea más, no una segunda llamada.

        SIGUE EN `bg-bone` a propósito, dentro de la misma banda clara del
        asesor y separado solo por un filete. La página cierra claro → oscuro de
        una vez hacia el footer; meter aquí una tercera superficie partiría ese
        cierre en dos por un enlace de una línea. El `bg-bone` además es lo que
        declara `--sup-*`, de donde la variante toma su color.
      */}
      <section className="bg-bone pb-16 text-ink">
        <Container>
          <Reveal>
            <div className="border-t border-greige pt-7">
              <Link
                href={catalogAllLink.href}
                className={buttonVariants({ variant: "enlace" })}
              >
                {catalogAllLink.label}
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
