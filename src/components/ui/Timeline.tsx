"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { cn } from "@/lib/cn";
import { foto } from "@/data/imagenes";
import { VOCABULARIO } from "@/lib/motion";

export interface TimelineItem {
  year: string;
  ref: string;
  title: string;
  description: string;
  featured?: boolean;
}

/**
 * Previsualización de la foto GRANDE antes de que existan las reales. Con
 * `NEXT_PUBLIC_PREVIEW_HITOS=1` (levantar el dev con esa variable) se pinta una
 * imagen de prueba en algunos hitos —los de índice par, no todos a propósito—
 * para poder juzgar de una vez el tamaño grande Y el estado mixto: mientras
 * marketing entregue por tandas van a convivir hitos con foto y sin ella, y así
 * se ve cómo queda esa convivencia sin aprobar a ciegas. Constante de build:
 * fuera de ese flag no cambia nada en producción.
 */
const PREVIEW_HITOS = process.env.NEXT_PUBLIC_PREVIEW_HITOS === "1";

/**
 * Línea de hitos — Motion §07 (verbo desenrollar): la línea vertical desenrolla
 * con el scroll (scaleY atada al progreso, GSAP ScrollTrigger — el único caso
 * reservado a GSAP en el documento, "timeline atada a scroll"). Cada hito revela
 * una vez al cruzar el viewport: el punto asienta en terracota y el contenido
 * hace fade+rise, 80ms después. No se repliega al subir.
 *
 * FOTO DEL HITO — grande, pero solo cuando existe. Los slots empiezan vacíos;
 * agrandar huecos daría una columna de cajas vacías, así que la imagen se pinta
 * SOLO si su slot tiene archivo real, y entonces en grande. Sin foto, la fila
 * colapsa a año+texto (no reserva un hueco), de modo que una entrega parcial se
 * lee como una línea ilustrada por tramos y no como una maqueta rota.
 *
 * ZOOM AL DESTACAR (hover / press) — Motion §Interacción (verbo asentar), en CSS
 * sobre `[data-timeline-card]`, un nodo DISTINTO del que anima GSAP
 * (`[data-timeline-content]`): los dos sistemas no se tocan sobre el mismo
 * elemento. Solo transform. Se desactiva con prefers-reduced-motion
 * (`motion-reduce`), el hover real se limita a punteros finos
 * (`[@media(hover:hover)]`) y en táctil responde al press (`active`), que no
 * bloquea el scroll ni, al no ser enlace el hito, la navegación.
 */
export function Timeline({ items }: { items: TimelineItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
              end: "bottom 60%",
              scrub: 0.3,
            },
          },
        );
      }

      itemRefs.current.forEach((item) => {
        if (!item) return;
        const dot = item.querySelector("[data-timeline-dot]");
        const content = item.querySelector("[data-timeline-content]");
        if (!dot || !content) return;

        gsap.set(dot, { backgroundColor: "#F5F2EE", borderColor: "#C8C2B8" });
        gsap.set(content, { opacity: 0, y: VOCABULARIO.cuerpo.distancia });

        ScrollTrigger.create({
          trigger: item,
          start: "top 70%",
          once: true,
          onEnter: () => {
            gsap.to(dot, {
              backgroundColor: "#A0715A",
              borderColor: "#A0715A",
              duration: 0.22,
              ease: "power2.out",
            });
            gsap.to(content, {
              opacity: 1,
              y: 0,
              duration: VOCABULARIO.cuerpo.duracion,
              delay: 0.08,
              ease: "power2.out",
            });
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [items]);

  return (
    <div ref={containerRef} className="relative pl-8 sm:pl-11">
      <div className="absolute left-0 top-0 h-full w-px bg-greige sm:left-0" />
      <div
        ref={lineRef}
        className="absolute left-0 top-0 h-full w-px origin-top bg-accent sm:left-0"
      />
      {items.map((item, i) => {
        // El id del slot sale del `ref` del hito (FND-01 -> hito-fnd-01), la
        // misma regla con la que `slots-imagen.ts` los declara.
        const real = foto(`hito-${item.ref.toLowerCase()}`);
        // En preview, imagen de prueba en los hitos de índice par: así se ve el
        // tamaño grande y, a la vez, la convivencia con los que aún no la tienen.
        const previa = PREVIEW_HITOS && i % 2 === 0 ? foto("oficio-taller-alangasi") : undefined;
        const imagen = real ?? previa;

        return (
          <div
            key={item.year}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="relative pb-12 last:pb-0"
          >
            <span
              data-timeline-dot
              className={cn(
                "absolute top-1.5 block rounded-full border border-greige bg-paper",
                item.featured ? "size-3.5 -left-9.75 sm:-left-12.75" : "size-2.5 -left-9.25 sm:-left-12.25",
              )}
            />
            {/* GSAP anima este nodo (opacity + y). El zoom vive en el hijo
                `[data-timeline-card]` para no compartir elemento con GSAP. */}
            <div data-timeline-content>
              <div
                data-timeline-card
                className={cn(
                  "grid grid-cols-1 gap-4 transition-transform duration-220 ease-asentar sm:items-start",
                  "relative z-0 hover:z-10 [@media(hover:hover)]:hover:scale-[1.03] active:scale-[1.03] motion-reduce:scale-100! motion-reduce:transition-none",
                  // Con foto: tercera columna grande. Sin foto: la fila colapsa a
                  // año + texto, sin reservar un hueco vacío.
                  imagen ? "sm:grid-cols-[88px_1fr_240px]" : "sm:grid-cols-[88px_1fr]",
                )}
              >
                <span className="font-sans text-h3 font-medium text-ink">{item.year}</span>
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-accent">
                    {item.ref}
                  </span>
                  <h3 className="mt-1 font-sans text-[15px] font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 max-w-md font-serif text-body-m text-graphite">
                    {item.description}
                  </p>
                </div>
                {imagen && (
                  <ImagePlaceholder
                    src={imagen.ruta}
                    alt={real?.alt ?? ""}
                    sizes="(min-width: 640px) 240px, 100vw"
                    className="aspect-4/3"
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
