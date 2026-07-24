"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Container } from "./Container";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { Reveal } from "@/components/motion/Reveal";
import { LineasEnMascara } from "@/components/motion/LineasEnMascara";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { Curtain } from "@/components/motion/Curtain";
import { foto } from "@/data/imagenes";
import { MASCARA } from "@/lib/motion";
import { cn } from "@/lib/cn";

export interface PasoAsesor {
  /** "01", "02", "03". */
  index: string;
  /** Etiqueta corta del stepper: Prenda, Sublimado, Uso. */
  label: string;
  /** Id del slot de imagen del paso. */
  slot: string;
}

export interface AsesorPasosProps {
  eyebrow: string;
  /** Líneas del titular, ya partidas a mano para la máscara (no envuelve). */
  titular: string[];
  parrafo: string;
  cta: { label: string; href: string };
  pasos: PasoAsesor[];
}

/** Cada paso descansa 4 s: tiempo para leer la etiqueta antes de avanzar. */
const CICLO_MS = 4000;

/**
 * Bloque "Asesor virtual" de la portada. A la izquierda el discurso + el stepper
 * compacto; a la derecha una foto que cambia con el paso activo.
 *
 * DIFERENCIACIÓN — va sobre fondo CLARO (`bg-bone`), a propósito. "Verdad
 * material" es un split fotográfico oscuro; repetir aquí otro bloque oscuro con
 * foto en espejo los volvía gemelos, y con el footer (también oscuro) la portada
 * cerraba en tres bandas de tinta seguidas. Claro rompe las dos cosas: contrasta
 * con "Verdad material" y da un cierre claro→oscuro limpio hacia el footer.
 *
 * MOVIMIENTO (ver `MOTION.md`) — sin gestos nuevos: la foto ENTRA por barrido
 * (`Curtain`) como toda fotografía del sitio, y el CAMBIO entre pasos es un
 * crossfade de opacidad corto. No hay animación de layout salvo el ancho de la
 * barra de progreso, que ya se anima igual en `AsesorWizard`.
 *
 * `prefers-reduced-motion`: sin auto-avance (se corta en el efecto) y sin
 * transición entre fotos (la regla global de `globals.css` colapsa la transición
 * de opacidad a instantánea). Queda el primer paso y se navega pulsando.
 */
export function AsesorPasos({ eyebrow, titular, parrafo, cta, pasos }: AsesorPasosProps) {
  const [activo, setActivo] = useState(0);
  /** El usuario pulsó un paso: toma el control y el auto-avance no vuelve. */
  const [detenido, setDetenido] = useState(false);
  /** El puntero está encima: pausa mientras dura. */
  const [pausado, setPausado] = useState(false);
  /** El auto-avance solo corre donde HAY foto que cambiar (split ≥768). */
  const [conFoto, setConFoto] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setConFoto(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduce || detenido || pausado || !conFoto) return;
    const t = setInterval(
      () => setActivo((a) => (a + 1) % pasos.length),
      CICLO_MS,
    );
    return () => clearInterval(t);
  }, [reduce, detenido, pausado, conFoto, pasos.length]);

  function seleccionar(i: number) {
    setActivo(i);
    setDetenido(true);
  }

  return (
    <section id="asesor" className="bg-bone py-16 text-ink">
      <Container>
        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-[1.1fr_0.9fr] lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-5">
            <Reveal tipo="etiqueta">
              <span className="font-mono text-xs uppercase tracking-widest text-brand">
                {eyebrow}
              </span>
            </Reveal>
            <LineasEnMascara
              as="h2"
              lineas={titular}
              className="font-sans text-h2 font-medium tracking-[-0.01em] text-ink"
            />
            <Reveal tipo="cuerpo" delay={MASCARA.stagger * 2}>
              <p className="max-w-md font-serif text-body-m text-graphite">{parrafo}</p>
            </Reveal>

            {/*
              Stepper compacto: los tres pasos y su barra. Cada paso es un botón
              —pulsar fija la foto y detiene el ciclo—. `flex-wrap` para que a 375
              nunca desborde. Se queda en móvil (ahí no hay foto que gobernar,
              pero orienta igual).
            */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-xs uppercase tracking-widest">
                {pasos.map((paso, i) => (
                  <span key={paso.slot} className="flex items-center gap-3">
                    {i > 0 && (
                      <span aria-hidden className="text-greige">
                        →
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => seleccionar(i)}
                      aria-pressed={i === activo}
                      className={cn(
                        "uppercase tracking-widest transition-asentar",
                        i === activo ? "text-brand" : "text-graphite hover:text-ink",
                      )}
                    >
                      {paso.index} {paso.label}
                    </button>
                  </span>
                ))}
              </div>
              <div className="h-0.5 w-full max-w-xs bg-greige">
                <div
                  className="h-0.5 bg-brand transition-asentar"
                  style={{ width: `${((activo + 1) / pasos.length) * 100}%` }}
                />
              </div>
            </div>

            <MagneticLink
              href={cta.href}
              className="mt-1 w-fit bg-brand px-7.5 py-4 font-sans text-base font-medium text-paper hover:bg-brand-deep"
            >
              {cta.label}
            </MagneticLink>
          </div>

          {/*
            Foto por paso — solo en el split (≥768). En móvil se retira: la
            portada ya tiene fotografía de sobra y estas son un apoyo, no el
            contenido. Barrido de entrada por `Curtain`; las tres capas se
            superponen y hacen crossfade según el paso activo. Hover pausa el
            ciclo; al salir se reanuda (salvo que el usuario ya haya pulsado).
          */}
          <Curtain className="hidden md:block md:h-full md:min-h-95">
            <div
              className="relative h-full w-full"
              onMouseEnter={() => setPausado(true)}
              onMouseLeave={() => setPausado(false)}
            >
              {pasos.map((paso, i) => {
                const f = foto(paso.slot);
                return (
                  <div
                    key={paso.slot}
                    aria-hidden={i !== activo}
                    className={cn(
                      "absolute inset-0 transition-opacity duration-500 ease-revelar",
                      i === activo ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <ImagePlaceholder
                      src={f?.ruta}
                      alt={f?.alt ?? ""}
                      sizes="(min-width: 1024px) 50vw, (min-width: 768px) 45vw, 1px"
                      label="Foto por paso"
                      sublabel={paso.label}
                      className="h-full w-full"
                    />
                  </div>
                );
              })}
            </div>
          </Curtain>
        </div>
      </Container>
    </section>
  );
}
