"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { cn } from "@/lib/cn";
import { EASE_REVELAR } from "@/lib/motion";

export interface EventSlide {
  date: string;
  title: string;
  description: string;
  placeholderLabel: string;
}

export interface EventCarouselProps {
  slides: EventSlide[];
}

const SLIDE_OFFSET = 24;

const slideVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * SLIDE_OFFSET }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: -direction * SLIDE_OFFSET }),
};

/**
 * Carrusel "Dónde estuvimos" — sin autoplay ("un objeto de museo no se pasa
 * solo"): avance manual por flechas o puntos. Motion v1 §07: crossfade +
 * desplazamiento horizontal corto (24px), 500ms.
 */
export function EventCarousel({ slides }: EventCarouselProps) {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const reduceMotion = useReducedMotion();
  const slide = slides[index];
  const count = slides.length;

  function go(nextIndex: number, dir: number) {
    setState([(nextIndex + count) % count, dir]);
  }

  return (
    <div>
      <div className="relative grid grid-cols-1 gap-8 overflow-hidden border border-greige bg-bone p-6 sm:grid-cols-2 sm:gap-10 sm:p-10">
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

      <div className="mt-6 flex items-center justify-between">
        <span className="font-mono text-xs text-graphite">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.title}
                type="button"
                aria-label={`Ir al evento ${i + 1}`}
                onClick={() => go(i, i > index ? 1 : -1)}
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
              onClick={() => go(index - 1, -1)}
              className="flex size-9 items-center justify-center border border-greige text-ink transition-colors duration-220 ease-asentar hover:border-ink"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Evento siguiente"
              onClick={() => go(index + 1, 1)}
              className="flex size-9 items-center justify-center border border-greige text-ink transition-colors duration-220 ease-asentar hover:border-ink"
            >
              →
            </button>
          </div>
        </div>
      </div>
      <p className="mt-4 font-serif text-caption italic text-graphite">
        Sin autoplay — un objeto de museo no se pasa solo.
      </p>
    </div>
  );
}
