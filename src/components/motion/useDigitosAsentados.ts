"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { CIFRA, SCROLL_REVEAL } from "@/lib/motion";

/**
 * Cifra que se asienta por dígitos.
 *
 * Sustituye a `useCountUp` (v1), que contaba desde 0 hasta el valor con un
 * ease-out. Un conteo lineal comunica "estoy contando"; estas cifras no son
 * un marcador subiendo, son un dato que se fija. Así que cada posición cicla
 * dígitos revueltos y se cierra de IZQUIERDA A DERECHA: en `39` el 3 queda
 * fijo mientras el 9 sigue girando, como un rótulo mecánico asentándose.
 *
 * Detalles que importan:
 *  - El valor final es lo que se renderiza en servidor y en el primer frame.
 *    No hay un "0" inicial: si el JS no llega, o si el usuario no ve nunca la
 *    sección, la cifra correcta está ahí igual.
 *  - Solo revuelve al cruzar el viewport, UNA vez (`once`). Volver a subir no
 *    la re-revuelve: un dato ya leído que se desordena solo es ruido.
 *  - Con prefers-reduced-motion no arranca nada.
 *  - `prefix`/`suffix` no se tocan nunca; solo giran los dígitos.
 */
export function useDigitosAsentados(target: number, prefix = "", suffix = "") {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, {
    once: true,
    amount: SCROLL_REVEAL.amount,
    margin: "0px 0px -8% 0px",
  });
  const reduceMotion = useReducedMotion();

  const final = String(target);
  const [digitos, setDigitos] = useState(final);

  useEffect(() => {
    if (!inView || reduceMotion) return;

    const n = final.length;
    const cierre = (i: number) => CIFRA.primerCierre + i * CIFRA.escalonado;
    const total = cierre(n - 1);

    let raf = 0;
    let ultimoTick = -1;
    let revueltos = final.split("");
    const t0 = performance.now();

    const paso = (ahora: number) => {
      const t = (ahora - t0) / 1000;
      const tick = Math.floor(t / CIFRA.tick);

      if (tick !== ultimoTick) {
        ultimoTick = tick;
        revueltos = final
          .split("")
          .map((d, i) => (t >= cierre(i) ? d : String(Math.floor(Math.random() * 10))));
        setDigitos(revueltos.join(""));
      }

      if (t < total) {
        raf = requestAnimationFrame(paso);
      } else {
        setDigitos(final);
      }
    };

    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduceMotion, final]);

  return { ref, display: `${prefix}${digitos}${suffix}` };
}
