"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { DURATION, SCROLL_REVEAL } from "@/lib/motion";

/**
 * Conteo de cifras — pedido explícito del cliente y presente en el código
 * real de los exports aprobados (`data-count="39"` + `countUp` con
 * requestAnimationFrame en Home.dc.html). Cuando la referencia verificada
 * contradice al documento, manda la implementación: por eso este contador se
 * conserva pese a §08. Cuenta desde 0 hasta `target` con un ease-out cúbico
 * manual (`1 - (1-t)^3`).
 *
 * `once: true` en `useInView` es la clave: dispara UNA sola vez al entrar en
 * viewport y NUNCA se re-anima al volver a hacer scroll — la cifra queda
 * asentada para siempre tras el primer conteo. `prefers-reduced-motion`
 * salta directo al valor final, igual que el resto de animaciones del sitio.
 */
export function useCountUp(target: number, prefix = "", suffix = "") {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: SCROLL_REVEAL.amount, margin: "0px 0px -8% 0px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    if (!inView || reduceMotion) return;

    let raf = 0;
    const t0 = performance.now();
    const dur = DURATION.contar * 1000;

    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(`${prefix}${Math.round(target * eased)}${suffix}`);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(`${prefix}${target}${suffix}`);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduceMotion, target, prefix, suffix]);

  // `reduceMotion` en `inView`: el efecto de arriba nunca corre (early
  // return), así que el valor final se lee aquí directamente en vez de
  // sincronizarlo con un setState síncrono dentro del efecto.
  const resolvedDisplay = inView && reduceMotion ? `${prefix}${target}${suffix}` : display;

  return { ref, display: resolvedDisplay };
}
