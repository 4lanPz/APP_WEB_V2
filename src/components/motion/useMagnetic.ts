"use client";

import { useCallback, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { DURATION, MAGNETIC_STRENGTH, CSS_EASE_ASENTAR } from "@/lib/motion";

/**
 * Técnica ausente del documento — verificada en el código real
 * (data-magnetic): el botón se desplaza levemente hacia el cursor
 * (translate proporcional al offset del centro, fuerza 0.28) y vuelve a su
 * lugar al salir (300ms, curva "asentar").
 *
 * DÓNDE SE CONECTA, HOY. Este comentario decía "solo a los CTA primarios
 * (bg-brand), nunca a secundario/ghost": esas tres variantes ya no existen y
 * `bg-brand` no es relleno de ningún botón. Lo que hay ahora son DOS caminos,
 * y no aplican el mismo criterio:
 *
 *  - `Button.tsx` (elementos `<button>`) lo condiciona a `variant === "solida"`
 *    — el gesto acompaña al compromiso, que es enviar un formulario.
 *  - `MagneticLink.tsx` (elementos `<Link>`) lo aplica SIEMPRE, sin mirar la
 *    variante. Sus usos de hoy son siete `contorno` (los heroes, el cierre de
 *    Empresa, Productos, Contacto, Blancos y el bloque del asesor de portada)
 *    y un `enlace` (`FichaSubcategoria`).
 *
 * Es decir: el gesto no está atado a la variante, está atado al elemento. Se
 * deja escrito porque no es lo que parece desde `Button.tsx`. Si algún día se
 * unifica, el sitio a tocar es `MagneticLink`, no este archivo — aquí solo
 * vive la mecánica del desplazamiento.
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
