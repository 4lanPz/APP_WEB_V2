"use client";

import { motion } from "framer-motion";
import { ImagePlaceholder, type ImagePlaceholderProps } from "@/components/ui/ImagePlaceholder";
import { cn } from "@/lib/cn";
import { EASE_REVELAR, EASE_DESENROLLAR, DURATION, SCROLL_REVEAL } from "@/lib/motion";

export interface CurtainProps {
  children: React.ReactNode;
  /** Clases de tamaño/aspecto del marco exterior (aspect-*, w-full, h-full…). */
  className?: string;
  /** Estilo del marco exterior (p. ej. fondo/textura de un contenido no fotográfico). */
  style?: React.CSSProperties;
}

/**
 * ESTE es el gesto de la fotografía. No el fade.
 *
 * Un panel sólido tinta cubre el contenido y se retira (scaleX 1→0 desde la
 * derecha, 760ms) mientras el contenido entra con un leve zoom-out
 * (scale 1.06→1, 900ms). Una foto que aparece por opacidad es una foto que
 * llega tarde; una foto que se destapa por barrido es una foto que se
 * presenta. Vivía en una sola sección de la Home — ahora envuelve toda
 * fotografía del sitio (ver `MOTION.md`).
 *
 * `once: true` a propósito: las fotos NO revierten al volver a subir. Un
 * barrido a media pantalla repetido cada vez que pasas por delante deja de
 * subrayar y empieza a entretener.
 *
 * Anima solo transform, así que con `prefers-reduced-motion` framer omite
 * ambas capas vía `MotionConfig reducedMotion="user"` y la foto queda visible
 * y quieta.
 *
 * El gesto no depende de que dentro haya una foto —Contacto lo aplica también
 * al mapa—, así que se expone como wrapper genérico; `PhotoCurtain` es la
 * especialización para `ImagePlaceholder`.
 */
export function Curtain({ children, className, style }: CurtainProps) {
  return (
    <div className={cn("relative overflow-hidden", className)} style={style}>
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.06 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: SCROLL_REVEAL.amount }}
        transition={{ duration: DURATION.cortinaFoto, ease: EASE_REVELAR }}
      >
        {children}
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-ink"
        style={{ transformOrigin: "right" }}
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={{ once: true, amount: SCROLL_REVEAL.amount }}
        transition={{ duration: DURATION.cortinaVela, ease: EASE_DESENROLLAR }}
      />
    </div>
  );
}

export interface PhotoCurtainProps extends Omit<ImagePlaceholderProps, "className"> {
  /** Clases de tamaño/aspecto del marco exterior (aspect-*, w-full, h-full…). */
  className?: string;
}

export function PhotoCurtain({ className, ...placeholderProps }: PhotoCurtainProps) {
  return (
    <Curtain className={className}>
      <ImagePlaceholder {...placeholderProps} className="h-full w-full" />
    </Curtain>
  );
}
