"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_REVELAR, EASE_PLEGAR, DURATION } from "@/lib/motion";

type Phase = "idle" | "out" | "in";

/**
 * Motion Architecture v1 §04 — verbo "desenrollar": un telón de Papel cubre
 * la vista (clip-path, 350ms, curva de salida) mientras la ruta cambia
 * debajo, y se retira (350ms, curva de entrada) revelando la página ya
 * asentada. 700ms total, sin flash en blanco.
 *
 * Interpretación: el documento no especifica el mecanismo exacto del
 * clip-path, solo la dirección "top→bottom" de la fase de cubrir. Se
 * implementa como un barrido continuo: el telón crece desde arriba hacia
 * abajo hasta cubrir, y sigue "desenrollándose" en la misma dirección para
 * retirarse — nunca rebota ni invierte el sentido.
 *
 * `lastChildren` guarda los children ya asentados; el efecto que detecta el
 * cambio de ruta se declara ANTES del efecto que sincroniza esa referencia,
 * así que al congelar la página anterior (`setDisplayed`) todavía lee el
 * valor viejo — si se sincronizara en cada render sin este orden,
 * capturaría los children NUEVOS (Next.js actualiza `pathname` y `children`
 * en el mismo render) y la entrada del Hero de la página vieja se
 * remontaría a mitad de la transición.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [displayed, setDisplayed] = useState(children);
  const committedPath = useRef(pathname);
  const lastChildren = useRef(children);

  useEffect(() => {
    if (pathname === committedPath.current) return;

    if (reduceMotion) {
      // `phase` se queda en "idle": `content` más abajo ya usa `children`
      // en vivo en ese estado, así que no hace falta tocar `displayed`.
      committedPath.current = pathname;
      return;
    }

    setDisplayed(lastChildren.current);
    setPhase("out");

    const outTimer = setTimeout(() => {
      committedPath.current = pathname;
      setDisplayed(children);
      setPhase("in");
    }, DURATION.paginaFase * 1000);

    return () => clearTimeout(outTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    lastChildren.current = children;
  });

  useEffect(() => {
    if (phase !== "in") return;
    const inTimer = setTimeout(() => setPhase("idle"), DURATION.paginaFase * 1000);
    return () => clearTimeout(inTimer);
  }, [phase]);

  const content = phase === "idle" ? children : displayed;

  return (
    <>
      {phase !== "idle" && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-999 bg-paper"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={
            phase === "out"
              ? { clipPath: "inset(0% 0% 0% 0%)" }
              : { clipPath: "inset(100% 0% 0% 0%)" }
          }
          transition={{
            duration: DURATION.paginaFase,
            ease: phase === "out" ? EASE_PLEGAR : EASE_REVELAR,
          }}
        />
      )}
      {content}
    </>
  );
}
