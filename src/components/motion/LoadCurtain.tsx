"use client";

import { motion } from "framer-motion";
import { EASE_DESENROLLAR, DURATION } from "@/lib/motion";

/**
 * 4ª técnica encontrada en el barrido final del JS de los 10 .dc.html —
 * ausente del documento y no nombrada por el usuario: un telón color Papel
 * (`#tp-curtain`, mismo hex que el token `paper`) cubre toda la vista y se
 * retira (translateY 0→-100%, 720ms, curva "desenrollar") una sola vez,
 * al montar la aplicación. Distinto de `PageTransition`: ese cubre las
 * transiciones de ruta del lado del cliente; este solo la primera carga.
 *
 * Se monta una única vez como hermano fijo en `MotionProviders` (fuera del
 * árbol que `PageTransition` reemplaza en cada navegación), así que nunca
 * vuelve a aparecer tras la primera carga — igual que en el código real,
 * donde el telón vive en el HTML estático de cada export y solo se retira
 * una vez por carga de página.
 *
 * Interpretación: el código real retrasa el arranque de la secuencia del
 * Hero 430ms para que no corra oculto detrás del telón. No se acopló esa
 * espera aquí para no introducir estado global en `Hero.tsx` (componente
 * compartido y hoy agnóstico de esto); el resultado final es equivalente,
 * con una diferencia de sincronía fina en los primeros ~700ms.
 */
export function LoadCurtain() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-999 bg-paper"
      initial={{ y: "0%" }}
      animate={{ y: "-100%" }}
      transition={{ duration: DURATION.cortinaCarga, ease: EASE_DESENROLLAR }}
    />
  );
}
