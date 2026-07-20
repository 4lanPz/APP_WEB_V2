"use client";

import { MotionConfig } from "framer-motion";
import { SmoothScroll } from "./SmoothScroll";
import { LoadCurtain } from "./LoadCurtain";

/**
 * Envoltorio único de proveedores de movimiento para layout.tsx (que debe
 * seguir siendo un Server Component por el export de `metadata`).
 * `reducedMotion="user"` respeta prefers-reduced-motion automáticamente
 * para toda animación de Framer Motion en el árbol.
 *
 * `LoadCurtain` vive aquí (fuera de `PageTransition`, que solo envuelve
 * `children` en layout.tsx) para que se monte una única vez por carga de
 * la app y nunca se repita en navegaciones cliente-a-cliente.
 */
export function MotionProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LoadCurtain />
      <SmoothScroll>{children}</SmoothScroll>
    </MotionConfig>
  );
}
