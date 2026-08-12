"use client";

import { useRef, useState } from "react";
import { Curtain } from "@/components/motion/Curtain";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { cn } from "@/lib/cn";
import { foto } from "@/data/imagenes";
import { ETAPAS_TALLER, numeroDeEtapa } from "@/data/etapas-taller";
import { RIEL_DE_ETAPAS, duracionDelTramo } from "@/lib/motion";
import { useAvanceAutomatico } from "@/lib/usar-avance-automatico";

/**
 * Cuánto descansa cada etapa antes de pasar a la siguiente.
 *
 * NO es una duración de animación —esas viven en `motion.ts`— sino cuánto hace
 * falta para LEER lo que hay sobre la foto: el rótulo de etapa, un titular y una
 * frase. Es menos texto que la tarjeta de «Encuentros», que descansa 7 s con un
 * párrafo entero, y más que el paso del asesor, que descansa 4 s con solo una
 * etiqueta. El recorrido completo de las cinco dura medio minuto.
 */
const AUTO_MS = 6000;

/**
 * RIEL DE ETAPAS — una fotografía grande y un riel continuo de cinco tramos.
 *
 * El recorrido de la tela por la planta, en el orden en que ocurre. Se elige una
 * etapa en el riel y la fotografía de debajo cambia; el riel no se mueve nunca,
 * lo que se mueve es el tramo azul que marca dónde estás.
 *
 * ── EL TRAMO SE DESPLAZA, NO APARECE Y DESAPARECE ─────────────────────────
 *
 * Es la diferencia entre un riel y cinco pestañas, y de ahí sale casi toda la
 * mecánica de este archivo. Hay UN solo tramo activo —un elemento, no cinco con
 * la opacidad cruzada— que se traslada de columna en columna. Va con `translate`
 * en línea y no con `left`: `translate` se resuelve en el compositor y `left`
 * obliga a recalcular la disposición en cada fotograma, que en un riel de un
 * píxel de alto se ve como un temblor.
 *
 * El tramo mide `w-1/5` del carril y el desplazamiento es de un múltiplo de su
 * PROPIO ancho (`translate: 100%` = una etapa), así que la cuenta no depende de
 * cuánto mida el carril: sirve igual con el riel comprimido a 375 y estirado a
 * 1440, y seguiría sirviendo con seis etapas cambiando el `w-1/5` y el `grid-
 * cols-5`.
 *
 * LA DURACIÓN ES PROPORCIONAL A LA DISTANCIA (`duracionDelTramo`, en
 * `lib/motion.ts`). Ir de la 01 a la 02 y de la 01 a la 05 con el mismo tiempo
 * son dos velocidades distintas, y a la rápida el tramo deja de leerse como algo
 * que viaja. El porqué y los números, en el vocabulario; aquí solo se aplica.
 *
 * ── SIN ICONOS ────────────────────────────────────────────────────────────
 * Cada etapa se anuncia con su número y su nombre. Un pictograma de telar o de
 * caja no añade nada que el nombre no diga, y cinco pictogramas seguidos son
 * cinco dibujos compitiendo con la única imagen que esta sección tiene que
 * enseñar, que es la fotografía.
 *
 * ── PESTAÑAS DE VERDAD, NO CINCO BOTONES ──────────────────────────────────
 * El patrón es `tablist`/`tab`/`tabpanel`: hay un solo tabulador para el riel
 * entero y dentro se recorre con las flechas, que es como se espera que se
 * comporte un grupo de pestañas y lo que evita que el teclado tenga que pasar
 * por las cinco para salir. Los paneles que no se ven van `inert`: siguen en el
 * DOM porque el cruce de fotografías los necesita a los dos a la vez, pero no
 * deben ser enfocables ni leerse en voz alta.
 *
 * ── EL RIEL AVANZA SOLO ───────────────────────────────────────────────────
 * Con el temporizador compartido (`useAvanceAutomatico`), el mismo que mueve el
 * carrusel de «Encuentros» de la portada: se pausa mientras el cursor está sobre
 * la fotografía y sigue al salir, y no arranca con `prefers-reduced-motion`.
 *
 * PULSAR UNA ETAPA LO PARA PARA SIEMPRE, no lo pausa. Es la diferencia que hace
 * usable la pieza: quien elige «Tintura» quiere ver la tintura, y un ciclo que
 * reanudara a los seis segundos le quitaría de debajo justo lo que acaba de
 * pedir. Por eso `elegir()` y `avanzar()` son dos caminos distintos hasta el
 * mismo estado — solo uno de los dos detiene el reloj.
 *
 * NO HAY BOTÓN DE PAUSA APARTE, y no hace falta: WCAG 2.2.2 pide un mecanismo
 * para detener el movimiento, y las cinco etapas SON ese mecanismo —visibles,
 * rotuladas, alcanzables con el teclado y cada una para el ciclo al activarse—.
 * «Encuentros» sí lo lleva porque allí sus puntos y flechas solo navegan.
 *
 * ── EL CARRIL SE DESPLAZA EN MÓVIL ────────────────────────────────────────
 * Cinco columnas en 322 px útiles dan 64 px por etapa, y «Control de calidad» a
 * ese ancho se parte en cuatro líneas. El carril se lleva a un ancho mínimo por
 * columna y se recorre en horizontal, con el riel dentro: la línea sigue siendo
 * continua y el tramo sigue midiendo un quinto de ella. Es la misma solución de
 * la línea de hitos y comparte su `sin-barra-de-scroll`.
 */
export function RielDeEtapas() {
  /*
   * LA ETAPA ANTERIOR VIAJA EN EL MISMO ESTADO QUE LA ACTIVA, y no en un `ref`
   * aparte. La duración del desplazamiento depende de CUÁNTAS etapas recorre el
   * tramo, así que hay que saber de dónde venía en el render que lo mueve —el
   * mismo en el que `activa` ya es la etapa nueva—. Guardado en un `ref` habría
   * que leerlo durante el render, que es justo lo que React no garantiza (y lo
   * que el lint rechaza); guardado en un estado propio llegaría un render tarde
   * y cada movimiento saldría con la duración del anterior. En el mismo estado,
   * las dos mitades cambian en el mismo paso y no pueden descuadrar.
   */
  const [{ activa, anterior }, setEtapa] = useState({ activa: 0, anterior: 0 });
  const botones = useRef<(HTMLButtonElement | null)[]>([]);

  const duracion = duracionDelTramo(activa - anterior);
  const ultima = ETAPAS_TALLER.length - 1;

  const irA = (destino: number) =>
    setEtapa((previo) => ({ activa: destino, anterior: previo.activa }));

  const avance = useAvanceAutomatico({
    intervalo: AUTO_MS,
    /*
     * Al llegar a la 05 vuelve a la 01, y eso son cuatro etapas de recorrido:
     * el tramo hace el camino de vuelta entero por el riel en 520ms en vez de
     * saltar. Es el mismo cálculo de `duracionDelTramo`, sin caso especial.
     */
    avanzar: () => irA((activa + 1) % ETAPAS_TALLER.length),
  });

  /** Elegir una etapa a mano: además de moverse, para el ciclo para siempre. */
  const elegir = (destino: number) => {
    irA(destino);
    avance.detener();
  };

  /*
   * Flechas, Inicio y Fin sobre el riel. Las flechas dan la vuelta en los
   * extremos: el riel es un recorrido cerrado de cinco etapas, no una lista que
   * se acaba, y frenar en la 05 obligaría a volver pulsando cuatro veces.
   *
   * `focus()` mueve el foco además de la selección porque en un `tablist` las
   * dos cosas van juntas —la pestaña activa es la única con `tabIndex={0}`—, y
   * de paso el navegador trae al carril la etapa que se acaba de elegir cuando
   * está fuera de pantalla en móvil.
   */
  const alPulsarTecla = (e: React.KeyboardEvent) => {
    const destino =
      e.key === "ArrowRight"
        ? activa === ultima
          ? 0
          : activa + 1
        : e.key === "ArrowLeft"
          ? activa === 0
            ? ultima
            : activa - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? ultima
              : null;

    if (destino === null) return;
    e.preventDefault();
    /* Recorrer con el teclado es elegir a mano: para el ciclo igual que un clic. */
    elegir(destino);
    botones.current[destino]?.focus();
  };

  return (
    <div>
      {/*
        LA FOTOGRAFÍA ENTRA POR BARRIDO, como toda fotografía del sitio
        (`Curtain`). El alto lo pone el marco exterior y no el contenido: las
        cinco capas van absolutas una encima de otra, así que ninguna aporta
        altura y sin `min-h` el marco mediría cero.

        La pausa al pasar el cursor va en una envoltura y no en el `Curtain`
        porque ese componente no acepta manejadores —expone `className` y
        `style`, nada más— y abrirle la API para esto sería tocar el gesto de
        TODA la fotografía del sitio por un caso. El div no pinta nada.

        Solo sobre la FOTO, no sobre el riel: pasar el cursor por las etapas
        mientras se leen no debe congelar la pieza, y quien va a elegir una la
        pulsa, que ya para el ciclo del todo.
      */}
      <div {...avance.cursor}>
        <Curtain className="min-h-90 border border-paper/15 bg-brand-deep sm:min-h-120 lg:min-h-140">
        {ETAPAS_TALLER.map((etapa, i) => {
          const imagen = foto(etapa.slot);
          const activo = i === activa;

          return (
            <div
              key={etapa.slot}
              id={`etapa-panel-${i}`}
              role="tabpanel"
              aria-labelledby={`etapa-tab-${i}`}
              inert={!activo}
              className={cn(
                "absolute inset-0 transition-opacity ease-revelar",
                activo ? "z-10 opacity-100" : "z-0 opacity-0",
              )}
              style={{ transitionDuration: `${RIEL_DE_ETAPAS.cruceDeFoto}s` }}
            >
              <ImagePlaceholder
                dark
                src={imagen?.ruta}
                alt={imagen?.alt ?? ""}
                /*
                  Ocupa el ancho del contenedor normal en cuanto hay sitio: a
                  1440 son 1038 px de los 1240 del contenedor, y por debajo de
                  eso el contenedor ya es la ventana menos su relleno.
                */
                sizes="(min-width: 1240px) 1040px, 100vw"
                label={`Etapa ${numeroDeEtapa(i)} · foto real`}
                sublabel={etapa.riel}
                /*
                  El rótulo del hueco se centra en el 60% de arriba: la mitad de
                  abajo la ocupan el titular y el texto de la etapa, y en el
                  centro geométrico caería justo encima. Mismo caso que la card
                  de familia.
                */
                marcadorEnAlto
                className="h-full w-full"
              />
              {/*
                El bloque de texto sobre la foto, con su propio velo. El
                degradado sube de `brand-deep` al 90% hasta transparente en el
                80% de la altura del bloque — el mismo azul de la banda, así que
                el velo no introduce un color que no esté ya en la sección.

                `pointer-events-none` para no robarle el cursor a nada, y ningún
                enlace dentro: la etapa se cambia en el riel.
              */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-linear-to-t from-brand-deep/90 to-brand-deep/0 to-80% p-5 sm:p-8">
                <span className="font-mono text-label uppercase text-brand">
                  Etapa {numeroDeEtapa(i)} · {etapa.lugar}
                </span>
                <h3 className="font-sans text-h2 font-medium text-paper">
                  {etapa.titulo}
                </h3>
                <p className="max-w-sm font-serif text-body-s text-greige">
                  {etapa.texto}
                </p>
              </div>
            </div>
          );
        })}
        </Curtain>
      </div>

      {/*
        EL CARRIL. `w-max min-w-full` sobre el riel: por debajo de ~740 px de
        ventana las cinco columnas no caben a su ancho mínimo y el carril se
        recorre; por encima, `min-w-full` lo estira al contenedor y el
        desplazamiento desaparece. Un solo mecanismo para los dos casos, sin
        breakpoint que mantener.

        `mt-0.5` son los 2 px que separan el riel del borde inferior de la foto.
      */}
      <div className="sin-barra-de-scroll mt-0.5 overflow-x-auto overscroll-x-contain">
        <div className="relative w-max min-w-full">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 block h-px bg-paper/20"
          />
          {/*
            El tramo activo. Un solo elemento que viaja: ver la cabecera.
            `transition-[translate]` y no `transition-transform` porque en
            Tailwind v4 `translate` es una propiedad independiente de
            `transform`, y nombrar la que se mueve deja fuera cualquier
            `transform` de un ancestro.
          */}
          <span
            aria-hidden
            className="absolute top-0 left-0 block h-px w-1/5 bg-brand transition-[translate] ease-revelar"
            style={{
              translate: `${activa * 100}% 0`,
              transitionDuration: `${duracion}s`,
            }}
          />
          <div
            role="tablist"
            aria-label="Etapas del taller"
            onKeyDown={alPulsarTecla}
            className="grid w-full grid-cols-5"
          >
            {ETAPAS_TALLER.map((etapa, i) => {
              const activo = i === activa;
              return (
                <button
                  key={etapa.slot}
                  ref={(el) => {
                    botones.current[i] = el;
                  }}
                  type="button"
                  id={`etapa-tab-${i}`}
                  role="tab"
                  aria-selected={activo}
                  aria-controls={`etapa-panel-${i}`}
                  tabIndex={activo ? 0 : -1}
                  onClick={() => elegir(i)}
                  /*
                    `min-w-30` (120 px) es lo que decide cuándo el carril se
                    desplaza: cinco columnas piden 600 px de riel, así que por
                    debajo de eso se recorre. A 120 px «Control de calidad» cabe
                    en dos líneas, que es el peor de los cinco rótulos.
                  */
                  className={cn(
                    "group flex min-w-30 cursor-pointer flex-col gap-1.5 pt-4.5 pr-3.5 text-left",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                  )}
                >
                  {/*
                    `paper/60` y no `paper/50` para la etapa en reposo: medido
                    sobre `brand-deep`, el 50% da 4,12:1 y se queda corto para
                    texto normal; el 60% sube a 5,37:1. Es además el mismo velo
                    con el que `SectionHeader` escribe su etiqueta sobre banda
                    oscura, así que el riel en reposo pesa lo mismo que ella.

                    El hover aclara el rótulo hasta el blanco de la etapa
                    activa. Es la misma señal que ya da la pestaña del
                    recomendador de /productos (`hover:text-ink` sobre claro), y
                    no lleva interruptor de la tanda de interacción porque no
                    mueve nada: es el color de un control respondiendo al cursor,
                    no un gesto que calibrar.
                  */}
                  <span
                    className={cn(
                      "font-mono text-label transition-colors duration-220 ease-asentar",
                      activo ? "text-brand" : "text-paper/60 group-hover:text-paper",
                    )}
                  >
                    {numeroDeEtapa(i)}
                  </span>
                  <span
                    className={cn(
                      "font-sans text-body-s font-medium transition-colors duration-220 ease-asentar",
                      activo ? "text-paper" : "text-paper/60 group-hover:text-paper",
                    )}
                  >
                    {etapa.riel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
