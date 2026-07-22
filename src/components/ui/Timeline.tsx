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
 * Línea de hitos — Motion v1 §07 (verbo desenrollar): la línea vertical
 * desenrolla con el scroll (scaleY atada al progreso, GSAP ScrollTrigger —
 * el único caso reservado a GSAP en el documento, "timeline atada a
 * scroll"). Cada hito revela una vez al cruzar ~30% del viewport: el punto
 * asienta en terracota y el año+texto hacen fade+rise, 80ms después. No se
 * repliega al subir.
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
      {items.map((item, i) => (
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
          <div
            data-timeline-content
            className="grid grid-cols-1 gap-4 sm:grid-cols-[88px_1fr_130px] sm:items-start"
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
            {/* El id del slot sale del `ref` del hito (FND-01 -> hito-fnd-01),
                que es la misma regla con la que `slots-imagen.ts` los declara. */}
            <ImagePlaceholder
              src={foto(`hito-${item.ref.toLowerCase()}`)?.ruta}
              alt={foto(`hito-${item.ref.toLowerCase()}`)?.alt ?? ""}
              sizes="130px"
              label=""
              className="hidden aspect-4/3 sm:block"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
