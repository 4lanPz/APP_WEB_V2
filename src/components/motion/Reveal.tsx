"use client";

import { motion } from "framer-motion";
import {
  EASE_REVELAR,
  SCROLL_REVEAL,
  VOCABULARIO,
  type TipoMovimiento,
} from "@/lib/motion";

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Retraso adicional en segundos — para escalonar elementos fuera de un RevealGroup. */
  delay?: number;
  /**
   * Tipo de contenido. Decide distancia, duración y si el gesto se deshace al
   * salir del viewport (ver `VOCABULARIO` en lib/motion.ts).
   *
   * `cuerpo` es el defecto porque es lo que más hay y porque así los usos
   * heredados de v1 siguen funcionando sin tocarlos. Marca los demás a mano:
   * una tarjeta con ritmo de párrafo se lee como un sitio donde todo se mueve
   * igual, que es justo lo que este vocabulario deshace.
   */
  tipo?: TipoMovimiento;
}

/**
 * Entrada por scroll de un bloque suelto: opacidad + desplazamiento vertical,
 * con distancia y duración según el `tipo` de contenido.
 *
 * OJO — esto NO es el gesto de todo el sitio. Los titulares van por máscara
 * (`LineasEnMascara`), la fotografía por barrido (`Curtain`), las grillas de
 * hairline trazan la retícula antes que las celdas (`RevealGroup` en variante
 * rejilla) y las cifras se asientan por dígitos (`StatNumber`). `Reveal` es
 * para cuerpos de texto, tarjetas sueltas y etiquetas. Ver `MOTION.md`.
 *
 * prefers-reduced-motion se resuelve vía <MotionConfig reducedMotion="user">
 * en el layout raíz, no aquí: ramificar sobre `useReducedMotion()` para
 * omitir `initial` causa un mismatch de hidratación (el servidor no conoce la
 * preferencia). MotionConfig aplica el mismo `initial`/`animate` en servidor y
 * cliente y solo suprime el movimiento real tras montar.
 */
export function Reveal({ children, className, delay = 0, tipo = "cuerpo" }: RevealProps) {
  const v = VOCABULARIO[tipo];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: v.distancia, scale: v.escala }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: !v.revierte, amount: SCROLL_REVEAL.amount }}
      transition={{ duration: v.duracion, ease: EASE_REVELAR, delay }}
    >
      {children}
    </motion.div>
  );
}
