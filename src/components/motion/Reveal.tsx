"use client";

import { motion } from "framer-motion";
import { EASE_REVELAR, DURATION, SCROLL_REVEAL } from "@/lib/motion";

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Retraso adicional en segundos — para escalonar elementos fuera de un RevealGroup. */
  delay?: number;
}

/**
 * Motion Architecture v1 §03 — verbo "revelar" para un elemento suelto:
 * opacity 0→1, translateY 20px→0, curva (0.16,1,0.30,1), 600ms, dispara al
 * 25% visible, una sola vez. Úsalo en títulos de sección, imágenes sueltas,
 * bloques de cita — nunca en párrafos largos, nav, logo o hairlines (§08).
 *
 * prefers-reduced-motion se resuelve vía <MotionConfig reducedMotion="user">
 * en el layout raíz, no aquí: ramificar sobre `useReducedMotion()` para
 * omitir `initial`/renderizar otro elemento causa un mismatch de hidratación
 * (el servidor no conoce la preferencia del usuario). MotionConfig aplica
 * el mismo `initial`/`animate` en servidor y cliente, y solo suprime la
 * animación real después de montar — instantáneo, sin salto visual.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: SCROLL_REVEAL.distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: SCROLL_REVEAL.amount }}
      transition={{ duration: DURATION.revelar, ease: EASE_REVELAR, delay }}
    >
      {children}
    </motion.div>
  );
}
