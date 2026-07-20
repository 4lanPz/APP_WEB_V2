"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";

/**
 * Motion Architecture v1 §04/§09 — Lenis para el scroll suave subyacente
 * de toda la página, base de las transiciones de página. Desactivado por
 * completo con prefers-reduced-motion (scroll nativo instantáneo).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2 }}>
      {children}
    </ReactLenis>
  );
}
