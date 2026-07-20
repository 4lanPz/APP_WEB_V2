"use client";

import { useCallback, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { DURATION, MAGNETIC_STRENGTH, CSS_EASE_ASENTAR } from "@/lib/motion";

/**
 * Técnica ausente del documento — verificada en el código real
 * (data-magnetic): el botón se desplaza levemente hacia el cursor
 * (translate proporcional al offset del centro, fuerza 0.28) y vuelve a su
 * lugar al salir (300ms, curva "asentar"). Solo se aplica a los CTA
 * primarios (bg-brand) en el código real — nunca a secundario/ghost.
 *
 * El offset inicial siempre es {0,0} en servidor y cliente (mousemove solo
 * puede ocurrir tras hidratar), así que ramificar la lógica sobre
 * `useReducedMotion()` aquí no arriesga un mismatch: el markup inicial es
 * idéntico, solo cambia si el gesto reacciona después.
 */
export function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const reduceMotion = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMouseMove = useCallback(
    (event: MouseEvent<T>) => {
      if (reduceMotion) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      setOffset({ x: x * MAGNETIC_STRENGTH, y: y * MAGNETIC_STRENGTH });
    },
    [reduceMotion],
  );

  const onMouseLeave = useCallback(() => setOffset({ x: 0, y: 0 }), []);

  const style: CSSProperties = {
    transform: `translate(${offset.x.toFixed(1)}px, ${offset.y.toFixed(1)}px)`,
    transition: `transform ${DURATION.magnetico * 1000}ms ${CSS_EASE_ASENTAR}`,
  };

  return { ref, onMouseMove, onMouseLeave, style };
}
