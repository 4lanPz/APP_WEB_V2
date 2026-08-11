"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { FlechaCarril } from "./FlechaCarril";
import { buttonVariants } from "./buttonVariants";
import { cn } from "@/lib/cn";
import { EASE_REVELAR } from "@/lib/motion";
import { foto } from "@/data/imagenes";

export interface EventSlide {
  /** Id del slot de imagen (ver `slots-imagen.ts`). */
  slot: string;
  date: string;
  title: string;
  description: string;
  placeholderLabel: string;
}

export interface EventCarouselProps {
  slides: EventSlide[];
}

const SLIDE_OFFSET = 24;

/**
 * Cadencia del avance automático. NO es una duración de animación —esas viven
 * en `motion.ts`— sino cuánto se deja quieta una tarjeta para poder LEERLA:
 * fecha, título y un párrafo. Se fija largo a propósito para que dé tiempo.
 */
const AUTO_MS = 7000;

const slideVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * SLIDE_OFFSET }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: -direction * SLIDE_OFFSET }),
};

/**
 * Carrusel "Encuentros" — avance automático lento y en bucle infinito (`AUTO_MS`),
 * pensado para dar tiempo a leer, con las salvaguardas que el contenido en
 * movimiento exige:
 *
 *  - Pausa mientras el cursor está sobre la tarjeta (foto o descripción) y
 *    reanuda al salir.
 *  - Flechas y puntos siguen navegando; usarlos DETIENE el automático —el
 *    usuario tomó el control— y el mando queda en el botón de pausa/reanudar.
 *  - Botón visible de pausa para quien no usa ratón: contenido que se mueve solo
 *    necesita un control de pausa accesible (WCAG 2.2.2).
 *  - `prefers-reduced-motion`: no arranca solo, se navega a mano y el botón de
 *    pausa se retira (no hay nada que pausar).
 *
 * Transición entre tarjetas (Motion §07): crossfade + desplazamiento horizontal
 * corto (24px), 500ms.
 *
 * NOTA: aquí hubo un pie "sin autoplay — un objeto de museo no se pasa solo".
 * Era una decisión de marca que este carrusel sustituye a pedido de marketing;
 * se retiró a propósito. No reponerla.
 */
export function EventCarousel({ slides }: EventCarouselProps) {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const reduceMotion = useReducedMotion();
  const slide = slides[index];
  const count = slides.length;

  // El automático corre solo si está activo, sin cursor encima y sin la
  // preferencia de menos movimiento.
  const corriendo = auto && !hover && !reduceMotion;

  useEffect(() => {
    if (!corriendo) return;
    const id = setInterval(() => {
      setState(([i]) => [(i + 1) % count, 1]);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [corriendo, count]);

  function go(nextIndex: number, dir: number) {
    setState([(nextIndex + count) % count, dir]);
  }

  // Navegación manual (flechas y puntos): además de mover, corta el automático.
  function irManual(nextIndex: number, dir: number) {
    go(nextIndex, dir);
    setAuto(false);
  }

  return (
    <div>
      <div
        className="relative grid grid-cols-1 gap-8 overflow-hidden border border-greige bg-bone p-6 sm:grid-cols-2 sm:gap-10 sm:p-10"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE_REVELAR }}
            className="col-span-full grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10"
          >
            <ImagePlaceholder
              src={foto(slide.slot)?.ruta}
              alt={foto(slide.slot)?.alt ?? ""}
              sizes="(min-width: 640px) 50vw, 100vw"
              label={slide.placeholderLabel}
              className="aspect-4/3"
            />
            <div className="flex flex-col justify-center gap-4">
              <span className="font-mono text-label uppercase text-accent">
                {slide.date}
              </span>
              <h3 className="font-sans text-h3 font-semibold text-ink">
                {slide.title}
              </h3>
              <p className="font-serif text-body-s text-graphite">
                {slide.description}
              </p>
              {/* Variante `enlace`: era uno de los CTA escritos a mano, con el
                  hover en `text-brand` (2,53:1 sobre bone). Ahora el hover lo
                  marca el subrayado y el texto no cambia de color. */}
              <button type="button" className={cn(buttonVariants({ variant: "enlace" }), "w-fit")}>
                Ver evento →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/*
        En móvil los controles se agrupan a la IZQUIERDA en vez de repartirse a
        los dos lados. El flotante de WhatsApp ocupa la esquina inferior derecha
        de la ventana, y medido con barrido fino de scroll había un tramo de
        ~60px en el que el botón se llevaba el toque de la flecha "siguiente".
        No es cuestión de márgenes: el flotante es fijo y la fila puede quedar a
        cualquier altura, así que la única solución estable es que los controles
        no vivan en esa columna. Desde 640px sobra sitio y vuelven a repartirse.
      */}
      {/*
        `flex-wrap` SOLO tiene efecto por debajo de 640px, y es lo que hace
        tocables los puntos: con el área táctil a 44px el grupo de puntos pasa de
        56 a 176px, y la fila entera pide 432px en un ancho útil de 323. En vez
        de encoger el objetivo o solapar puntos —a 16px de paso, un área de 44
        tapa el centro visual del vecino y el toque activa otra tarjeta—, el
        grupo de puntos y flechas baja a una segunda línea. Desde 640px la fila
        cabe de sobra (412 de 588) y no envuelve: ahí sigue siendo una sola línea
        con `justify-between`, como estaba.

        Los 432 eran 424 hasta que las flechas cumplieron también el mínimo
        táctil: su grupo pasó de 84 a 92px (dos botones de 44 con `gap-1`, ver
        `FlechaCarril`). No cambia ninguna de las dos conclusiones.
      */}
      <div className="mt-6 flex flex-wrap items-center justify-start gap-5 sm:flex-nowrap sm:justify-between sm:gap-0">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-graphite">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          {/*
            Control de pausa visible y enfocable con teclado. Se retira con
            reduced-motion: ahí el carrusel no arranca solo, así que no hay nada
            que pausar. `reduceMotion` es null en SSR y primer render (se pinta
            el botón, coincide servidor/cliente) y se resuelve tras montar.
          */}
          {!reduceMotion && (
            <button
              type="button"
              onClick={() => setAuto((a) => !a)}
              aria-pressed={!auto}
              aria-label={auto ? "Pausar el avance automático" : "Reanudar el avance automático"}
              className="font-mono text-xs text-graphite transition-colors duration-220 ease-asentar hover:text-ink"
            >
              {auto ? "❚❚ Pausa" : "▶ Auto"}
            </button>
          )}
        </div>
        <div className="flex items-center gap-6">
          {/*
            EL PUNTO MIDE 8px SIEMPRE; lo que cambia con el ancho es su ÁREA
            SENSIBLE. En móvil el botón es una caja de 44px con el punto de 8
            centrado dentro —el mínimo táctil, medido sobre el propio botón y no
            sobre un pseudo-elemento, que no cuenta como objetivo—; las cajas se
            tocan de borde a borde, así que ninguna muerde el área de la vecina.
            Desde 640px el botón vuelve a ser el punto (`sm:size-2` y el `gap-2`
            del grupo): con ratón no hay mínimo táctil que cumplir y agrandar el
            hueco entre puntos ahí solo desharía el racimo compacto del diseño.
          */}
          <div className="flex items-center sm:gap-2">
            {slides.map((s, i) => (
              <button
                key={s.title}
                type="button"
                aria-label={`Ir al evento ${i + 1}`}
                onClick={() => irManual(i, i > index ? 1 : -1)}
                className="flex size-11 items-center justify-center sm:size-2"
              >
                {/* El punto activo iba en `brand`: como marca no textual contra
                    `paper` da 2,56:1 y necesita 3:1. Pasa a tinta, igual que el
                    filete activo del navbar (styleguide §C). */}
                <span
                  className={cn(
                    "block size-2 border border-graphite transition-colors duration-220 ease-asentar",
                    i === index && "border-ink bg-ink",
                  )}
                />
              </button>
            ))}
          </div>
          {/*
            `gap-1` DONDE HABÍA `gap-3`: las flechas pasan a `FlechaCarril`, que
            mete el filete de 36 px dentro de un botón de 44 para cumplir el
            mínimo táctil. Son 4 px invisibles por lado; descontados los dos, el
            aire entre filetes es el mismo que antes y la fila no se mueve.

            Es el mismo trato que ya llevaban los puntos de aquí al lado —punto
            de 8 en botón de 44—, y ahora las tres piezas del mando del carrusel
            cumplen la misma regla.
          */}
          <div className="flex items-center gap-1">
            <FlechaCarril
              direccion="anterior"
              etiqueta="Evento anterior"
              onClick={() => irManual(index - 1, -1)}
            />
            <FlechaCarril
              direccion="siguiente"
              etiqueta="Evento siguiente"
              onClick={() => irManual(index + 1, 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
