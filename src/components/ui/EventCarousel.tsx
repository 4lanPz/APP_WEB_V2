"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ImagePlaceholder } from "./ImagePlaceholder";
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
              <span className="font-mono text-xs uppercase tracking-widest text-accent">
                {slide.date}
              </span>
              <h3 className="font-sans text-h3 font-semibold text-ink">
                {slide.title}
              </h3>
              <p className="font-serif text-[15px] text-graphite">
                {slide.description}
              </p>
              <button
                type="button"
                className="w-fit font-sans text-[15px] font-medium text-ink hover:text-brand"
              >
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
      <div className="mt-6 flex items-center justify-start gap-5 sm:justify-between sm:gap-0">
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
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.title}
                type="button"
                aria-label={`Ir al evento ${i + 1}`}
                onClick={() => irManual(i, i > index ? 1 : -1)}
                className={cn(
                  "size-2 border border-greige transition-colors duration-220 ease-asentar",
                  i === index && "border-brand bg-brand",
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Evento anterior"
              onClick={() => irManual(index - 1, -1)}
              className="flex size-9 items-center justify-center border border-greige text-ink transition-colors duration-220 ease-asentar hover:border-ink"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Evento siguiente"
              onClick={() => irManual(index + 1, 1)}
              className="flex size-9 items-center justify-center border border-greige text-ink transition-colors duration-220 ease-asentar hover:border-ink"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
