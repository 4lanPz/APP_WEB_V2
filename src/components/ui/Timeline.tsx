"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { FlechaCarril } from "./FlechaCarril";
import { cn } from "@/lib/cn";
import { foto } from "@/data/imagenes";
import { slotDeHito, type Hito } from "@/data/hitos";
import { VOCABULARIO } from "@/lib/motion";
import { CLASES_HITO_DE_LINEA } from "@/lib/motion-interaccion";

/**
 * Previsualización de la foto antes de que existan las reales. Con
 * `NEXT_PUBLIC_PREVIEW_HITOS=1` (levantar el dev con esa variable) se pinta una
 * imagen de prueba en algunos hitos —los de índice par, no todos a propósito—
 * para poder juzgar de una vez la foto grande Y el estado mixto: mientras
 * marketing entregue por tandas van a convivir hitos con foto y sin ella, y así
 * se ve cómo queda esa convivencia sin aprobar a ciegas. Constante de build:
 * fuera de ese flag no cambia nada en producción.
 *
 * DESDE EL REPARTO EN DOS BANDAS ESTE FLAG ES LA ÚNICA FORMA DE VER LA PIEZA
 * ENTERA. Con los nueve huecos vacíos —el estado de hoy— los nueve hitos caen
 * debajo de la línea y la banda de arriba no existe. No es un fallo: es lo que
 * el reparto por foto tiene que dar mientras no haya ninguna. Para juzgar las
 * tres bandas hay que encender esto.
 */
const PREVIEW_HITOS = process.env.NEXT_PUBLIC_PREVIEW_HITOS === "1";

/**
 * Ancho de una tarjeta, medianil incluido, en píxeles. Es el salto de las
 * flechas: avanzan exactamente una tarjeta.
 *
 * TIENE QUE COINCIDIR CON `auto-cols-67` / `sm:auto-cols-82` DEL `<ol>` —la
 * escala base-4 de Tailwind, o sea 268 y 328 px—, y no hay forma de derivarlo:
 * el ancho de columna lo resuelve el CSS y el salto lo pide JavaScript. Si se
 * toca el ancho de la tarjeta, se toca aquí.
 */
const TARJETA = { movil: 268, escritorio: 328 };

/**
 * Medianil entre tarjetas: el aire que separa una foto de la siguiente.
 *
 * NO ES UN `gap` DE LA REJILLA, y no puede serlo: la línea de tiempo se monta
 * con un tramo por columna y los tramos tienen que tocarse para leerse como una
 * sola línea. Un hueco de rejilla la cortaría ocho veces. Va como relleno
 * DERECHO del contenido, dentro de una columna que sigue siendo continua.
 *
 * ESTÁ ESCRITO DOS VECES Y NO ES REDUNDANCIA: son la misma cifra aplicada a dos
 * cajas distintas. `relleno` aparta el contenido del hito vecino; `derecha`
 * recorta la caja invisible sobre la que se centra el punto, para que el punto
 * caiga en el centro del CONTENIDO y no en el de la columna.
 *
 * La segunda no puede ser también un relleno. Los desplazamientos en porcentaje
 * de un hijo absoluto se resuelven contra la caja de RELLENO del ancestro, o
 * sea relleno incluido: un `left-1/2` dentro de una caja con `pr-8` sigue dando
 * el centro de la columna, medio medianil a la derecha de donde tiene que
 * estar. Con `right-*` la caja mide de verdad lo que mide el contenido.
 *
 * Las dos cifras cambian juntas o el punto se descentra.
 */
const MEDIANIL = {
  relleno: "pr-6 sm:pr-8",
  derecha: "right-6 sm:right-8",
} as const;

/**
 * LÍNEA DE HITOS — HORIZONTAL, EN CARRIL, REPARTIDA EN TRES BANDAS.
 *
 * EL AÑO IDENTIFICA, EL CÓDIGO DESAPARECE. Cada hito se anunciaba con su `ref`
 * —`LOC-03`, `PRD-01`— en etiqueta mono terracota, encima del título y con más
 * peso visual que el año. Es un código interno: sirve para nombrar el archivo
 * de su foto (`hito-loc-03.webp`) y no le dice nada al visitante, que lo que
 * necesita saber es CUÁNDO pasó. El `ref` sigue existiendo en `data/hitos.ts`,
 * pero solo como clave del slot; en pantalla manda el año.
 *
 * DE VERTICAL A CARRIL HORIZONTAL. Nueve hitos con foto grande no caben en una
 * fila del contenedor amplio —a 1440 son 1238 px útiles, o sea 137 por hito—,
 * así que la fila desborda y se recorre. El contenedor pasa a `amplio` (esos
 * 200 px extra son justo lo que la tarjeta necesita) y se recorre con la rueda,
 * con arrastre táctil, con las flechas del pie o con el teclado sobre el propio
 * carril. Hay `snap` por tarjeta: parar a mitad de una foto es parar en ningún
 * sitio.
 *
 * ── TRES BANDAS, Y EL REPARTO LO DECIDE LA FOTO ───────────────────────────
 *
 * La línea va por el centro; encima cuelgan los hitos QUE TIENEN FOTO y debajo
 * los que no —año, título y descripción—. El criterio NO es la posición (par
 * arriba, impar abajo, que es como se hace normalmente) sino si hay archivo,
 * y eso resuelve el problema de fondo: nunca van a tener foto los nueve. Un
 * reparto por posición obliga a que un hito sin foto ocupe arriba el sitio de
 * una foto que no existe, que es exactamente lo que hacía la versión anterior
 * con nueve marcadores de hueco alineados. Aquí un hito sin foto no reserva
 * hueco de foto: se va abajo, donde solo hay texto.
 *
 * SE ADAPTA SOLO CUANDO CAMBIE LA PROPORCIÓN. No hay ninguna cifra escrita: el
 * lado de cada hito sale de `foto(slotDeHito(ref))`. Hoy, con los nueve huecos
 * vacíos, los nueve están abajo y la banda de arriba mide 0 —la fila `auto` de
 * una rejilla sin contenido no ocupa—, así que la sección se lee como una línea
 * con nueve hitos colgando. El día que lleguen seis fotos, esas seis suben
 * solas y tres se quedan abajo, sin tocar este archivo.
 *
 * LAS BANDAS SE ALINEAN CON `subgrid`, no con alturas fijas. El `<ol>` declara
 * las tres filas —contenido / línea / contenido— y cada `<li>` las hereda, así
 * que la línea queda a UNA sola altura por muy distintas que sean las tarjetas.
 * Sin subgrid habría que fijar a mano el alto de las dos bandas, y ese número
 * se rompe con la primera descripción que crezca una línea.
 *
 * EN MÓVIL NO HAY TRES BANDAS, HAY DOS. Por debajo de `sm` la línea se queda
 * arriba y TODOS los hitos cuelgan de ella, con foto o sin ella. A 375 px se ve
 * una tarjeta cada vez: la alternancia no se puede leer —nunca hay dos hitos en
 * pantalla que comparar— y en cambio se paga entera, porque el alto de la banda
 * de arriba lo reserva la rejilla aunque el hito que toque esté abajo. Se
 * cambia con una clase de colocación (`sm:row-start-1`), no con otra maqueta.
 *
 * EL PUNTO VA CENTRADO BAJO SU HITO. Estaba en `left-0`, o sea en el borde
 * izquierdo de la tarjeta, que es donde empieza la columna pero no donde está el
 * hito. Ahora se centra sobre la misma caja que ocupa el contenido —columna
 * menos medianil, ver `MEDIANIL`—, así que cae bajo el año.
 *
 * MOTION §07 (verbo desenrollar) — la línea se dibuja atada al progreso de
 * scroll (GSAP ScrollTrigger, el único caso reservado a GSAP en el documento),
 * en `scaleX` y con los tramos escalonados para que el trazo avance de izquierda
 * a derecha. Los nueve hitos comparten altura de línea, así que no tiene sentido
 * un disparador por hito —se activarían los nueve a la vez—: entran con UN
 * disparador y `stagger`, que es la misma lectura secuencial que daban antes
 * nueve umbrales distintos.
 *
 * EL ACERCAMIENTO AL SEÑALAR ES DE LA TARJETA ENTERA, no de la foto. Antes solo
 * reaccionaba la imagen (`zoomOnGroupHover`), y con la mitad de los hitos sin
 * foto eso significa que la mitad de los hitos no reaccionaba a nada. Ahora se
 * acerca la pieza completa —foto, año, título y texto— con el mismo tratamiento
 * y las mismas curvas que la card de familia, detrás de su propio interruptor:
 * `HOVER_EN_HITOS_DE_LINEA` en `motion-interaccion.ts`.
 */
export function Timeline({ items }: { items: Hito[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const carrilRef = useRef<HTMLDivElement>(null);
  const [enElInicio, setEnElInicio] = useState(true);
  const [enElFinal, setEnElFinal] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    /*
     * Los colores salen del tema, no de tres hex escritos aquí. GSAP necesita un
     * color resuelto —no sabe leer `bg-accent`—, y la copia a mano ya se quedó
     * atrás una vez: el punto seguía en el terracota viejo después de cambiar el
     * token. Leídos del `:root`, no pueden separarse.
     */
    const tema = getComputedStyle(document.documentElement);
    const color = (nombre: string) => tema.getPropertyValue(nombre).trim();
    const ACCENT = color("--color-accent");
    const PAPER = color("--color-paper");
    const GREIGE = color("--color-greige");

    const ctx = gsap.context(() => {
      const raiz = containerRef.current!;
      const tramos = raiz.querySelectorAll("[data-timeline-tramo]");
      const puntos = raiz.querySelectorAll("[data-timeline-dot]");
      const contenidos = raiz.querySelectorAll("[data-timeline-content]");

      gsap.set(tramos, { scaleX: 0 });
      gsap.set(puntos, { backgroundColor: PAPER, borderColor: GREIGE });
      gsap.set(contenidos, { opacity: 0, y: VOCABULARIO.cuerpo.distancia });

      /*
       * El trazo va atado al scroll de la PÁGINA aunque la línea sea horizontal:
       * el carril se recorre a mano y su desplazamiento no es un progreso que
       * medir —se puede ir y volver—, mientras que bajar por la página sí avanza
       * en una sola dirección. Es el mismo gesto de antes girado 90°.
       */
      gsap.to(tramos, {
        scaleX: 1,
        ease: "none",
        stagger: 0.4,
        scrollTrigger: {
          trigger: raiz,
          start: "top 75%",
          end: "bottom 60%",
          scrub: 0.3,
        },
      });

      ScrollTrigger.create({
        trigger: raiz,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(puntos, {
            backgroundColor: ACCENT,
            borderColor: ACCENT,
            duration: 0.22,
            stagger: 0.06,
            ease: "power2.out",
          });
          gsap.to(contenidos, {
            opacity: 1,
            y: 0,
            duration: VOCABULARIO.cuerpo.duracion,
            delay: 0.08,
            stagger: 0.06,
            ease: "power2.out",
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [items]);

  /* Los extremos del carril, para apagar la flecha que ya no lleva a ninguna
     parte. `- 1` absorbe el subpíxel del zoom del navegador, que si no deja el
     "siguiente" encendido para siempre al llegar al final. */
  const medirExtremos = useCallback(() => {
    const el = carrilRef.current;
    if (!el) return;
    setEnElInicio(el.scrollLeft <= 1);
    setEnElFinal(el.scrollLeft >= el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    medirExtremos();
    const el = carrilRef.current;
    if (!el) return;
    // También al redimensionar: el ancho de tarjeta cambia en `sm` y con él
    // cuántas caben, así que un carril que estaba al final puede dejar de estarlo.
    const ro = new ResizeObserver(medirExtremos);
    ro.observe(el);
    return () => ro.disconnect();
  }, [medirExtremos]);

  /*
   * Las flechas avanzan UNA tarjeta. `scrollBy` y no `scrollIntoView` sobre el
   * hito siguiente: lo segundo desplaza también la PÁGINA cuando el carril no
   * está entero en pantalla, y la línea de hitos cierra la página, así que da
   * justo el salto vertical que nadie pidió.
   */
  const mover = (signo: 1 | -1) => {
    const el = carrilRef.current;
    if (!el) return;
    const paso = window.innerWidth >= 640 ? TARJETA.escritorio : TARJETA.movil;
    el.scrollBy({ left: signo * paso, behavior: "smooth" });
  };

  return (
    <div ref={containerRef}>
      {/*
        `tabIndex` y `role`/`aria-label` sobre el carril: una caja con scroll
        propio tiene que poder recorrerse con el teclado, y sin foco las flechas
        del teclado mueven la página en vez del carril. Con `role="group"` y
        etiqueta, el lector de pantalla anuncia dónde está el foco en vez de
        posarse en un contenedor mudo. Cuenta doble ahora que la barra de scroll
        no se pinta (`sin-barra-de-scroll`, en `globals.css`).

        `py-2.5` no es aire de diseño: es lo que impide que el punto se recorte.
        La línea es una fila de 1px y el punto sobresale 8px por arriba y por
        abajo; cuando una de las dos bandas está vacía —hoy la de arriba, con los
        nueve huecos sin foto— no hay contenido que le deje sitio, y el carril,
        al tener `overflow-x` propio, recorta también en vertical.

        `-mx-2 px-2` ES LO MISMO PARA EL EJE HORIZONTAL, y hace falta desde que
        el hito se acerca al señalarlo. Una caja con scroll recorta por su borde,
        así que el primer hito —pegado al borde del contenedor— perdía seis
        píxeles por la izquierda mientras el cursor estaba encima: la «F» de
        «Fundación» se comía medio. El relleno le da ese margen de recorte y el
        margen negativo lo devuelve, de modo que el contenido sigue alineado con
        el titular de la sección y no se ha movido nada. Ocho píxeles cubren los
        5,9 que crece la tarjeta por cada lado y caben de sobra en el relleno del
        contenedor, que en el peor caso —375 px— son 26.

        `scroll-pl-2` es la otra mitad: sin él el `snap` alinearía las tarjetas
        con el borde de la caja y no con el borde del relleno, o sea ocho píxeles
        corrido, y el primer hito no podría quedar nunca en su sitio.
      */}
      <div
        ref={carrilRef}
        onScroll={medirExtremos}
        tabIndex={0}
        role="group"
        aria-label="Línea de hitos — se recorre en horizontal"
        className={cn(
          "sin-barra-de-scroll snap-x snap-mandatory overflow-x-auto overscroll-x-contain py-2.5",
          "-mx-2 scroll-pl-2 px-2",
          "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
        )}
      >
        {/*
          Las tres bandas: contenido de arriba / la línea / contenido de abajo.
          El ancho de columna va en `auto-cols-*` y no en cada `<li>` porque una
          columna `auto` se dimensiona por el contenido más ancho, y con `w-max`
          alrededor eso significa que una descripción larga estiraría su columna
          hasta el ancho de todo el párrafo sin partir.
        */}
        <ol className="grid w-max auto-cols-67 grid-flow-col grid-rows-[auto_1px_auto] sm:auto-cols-82">
          {items.map((item, i) => {
            const real = foto(slotDeHito(item.ref));
            // En preview, imagen de prueba en los hitos de índice par: así se ve
            // la foto grande y, a la vez, la convivencia con los que no la tienen.
            const previa =
              PREVIEW_HITOS && i % 2 === 0 ? foto("oficio-taller-alangasi") : undefined;
            const imagen = real ?? previa;
            // Lo único que decide de qué lado de la línea cuelga el hito.
            const arriba = Boolean(imagen);

            return (
              <li
                key={item.ref}
                className="group row-span-3 grid snap-start grid-rows-subgrid"
              >
                <div
                  data-timeline-content
                  className={cn(
                    MEDIANIL.relleno,
                    "row-start-3 pt-7",
                    arriba && "sm:row-start-1 sm:self-end sm:pt-0 sm:pb-7",
                  )}
                >
                  {/*
                    DOS NODOS Y NO UNO: LA ENTRADA Y EL HOVER NO PUEDEN COMPARTIR
                    ELEMENTO. GSAP no anima la subida de entrada y ya está: al
                    tomar el control de las transformaciones de un elemento
                    escribe EN LÍNEA `translate: none; rotate: none; scale: none`
                    para que su matriz de `transform` sea la única fuente. Un
                    estilo en línea gana a cualquier hoja, así que con el
                    `group-hover:scale-*` en el mismo nodo el acercamiento no
                    ocurre —comprobado en el navegador: la regla casa, el `:hover`
                    está puesto, y el `scale` calculado sigue siendo `none`—.
                    Fuera lo que anima GSAP, dentro lo que anima el hover.

                    El origen va aquí y no en el interruptor: el borde que toca la
                    línea es el que se queda quieto —`origin-bottom` para los
                    hitos de arriba, `origin-top` para los de abajo—, así que la
                    tarjeta crece hacia afuera y la línea no se mueve al señalar.
                  */}
                  <div
                    className={cn(
                      CLASES_HITO_DE_LINEA,
                      "origin-top",
                      arriba && "sm:origin-bottom",
                    )}
                  >
                    {arriba && (
                      <ImagePlaceholder
                        src={imagen?.ruta}
                        alt={real?.alt ?? ""}
                        sizes="(min-width: 640px) 296px, 244px"
                        /*
                         * Rótulo sin `sublabel`. El sitio natural del sublabel
                         * sería el año, pero el año está pintado justo debajo
                         * del marco y en grande: repetido dentro del hueco se
                         * lee como un fallo de maqueta, no como la referencia de
                         * la foto que falta. Y sin `zoomOnGroupHover`: quien se
                         * acerca ahora es la tarjeta entera.
                         */
                        label="Foto de archivo"
                        className="mb-5 aspect-4/3 w-full"
                      />
                    )}
                    {/*
                      EL AÑO ES EL IDENTIFICADOR. Ocupa el sitio y el peso que
                      tenía el código interno (`LOC-03`) más el que tenía el año,
                      y por eso sube de `text-h3` a `text-h2`.
                    */}
                    <p className="font-sans text-h2 font-medium text-ink">
                      {item.year}
                    </p>
                    <h3 className="mt-2 font-sans text-h3 font-semibold text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 font-serif text-body-m text-graphite">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/*
                  El tramo de línea, a todo el ancho de la COLUMNA —medianil
                  incluido— para que toque el del vecino, y fuera del nodo que
                  anima la opacidad: la línea se dibuja con el scroll de la
                  página, no con la entrada del hito, y si se desvaneciera con el
                  contenido serían dos gestos discutiendo por el mismo píxel.
                */}
                <div className="relative row-start-2 h-px">
                  <span className="absolute inset-0 bg-greige" />
                  <span
                    data-timeline-tramo
                    className="absolute inset-0 origin-left bg-accent"
                  />
                  {/*
                    El punto se centra sobre esta caja y no sobre la columna: es
                    la del contenido, columna menos medianil. Con `left-0` caía
                    en el borde izquierdo de la tarjeta y no bajo el hito.
                  */}
                  <div className={cn("absolute inset-y-0 left-0", MEDIANIL.derecha)}>
                    <span
                      data-timeline-dot
                      className={cn(
                        "absolute top-1/2 left-1/2 block -translate-x-1/2 -translate-y-1/2 rounded-full border border-greige bg-paper",
                        item.featured ? "size-4" : "size-3",
                      )}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/*
        Las flechas, centradas bajo el carril y separadas entre sí. Juntas en la
        esquina izquierda parecían el pie de la sección; centradas y bajo el
        carril se leen como su mando, que es lo único que las señala ahora que la
        barra de scroll no se pinta.

        Se apagan en los extremos (ver `medirExtremos`). Es su única señal de que
        el carril se acabó: no hay contador de posición porque los nueve hitos ya
        llevan su año, y un «03 / 09» encima de un 1999 dice lo mismo dos veces.
        El aspecto y el porqué del área táctil, en `FlechaCarril`.

        `gap-2` DONDE HABÍA `gap-4`: el botón mide ahora 44 px con el filete de
        36 centrado dentro, o sea 4 px invisibles por lado. Descontados los dos,
        el aire entre filetes sigue siendo el mismo de antes.
      */}
      <div className="mt-8 flex items-center justify-center gap-2">
        <FlechaCarril
          direccion="anterior"
          etiqueta="Hitos anteriores"
          onClick={() => mover(-1)}
          disabled={enElInicio}
        />
        <FlechaCarril
          direccion="siguiente"
          etiqueta="Hitos siguientes"
          onClick={() => mover(1)}
          disabled={enElFinal}
        />
      </div>
    </div>
  );
}
