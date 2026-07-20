"use client";

import { motion, type Variants } from "framer-motion";
import { EASE_REVELAR, DURATION, SCROLL_REVEAL } from "@/lib/motion";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: SCROLL_REVEAL.stagger } },
};

export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: SCROLL_REVEAL.distance },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.revelar, ease: EASE_REVELAR },
  },
};

export interface RevealGroupProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Contenedor para hermanos con "stagger" 60–80ms (fijado en 70ms) — cards,
 * cifras, grillas de tiles. Envuelve un grid/flex existente sin cambiar sus
 * clases; cada hijo directo debe ser un <RevealItem>.
 *
 * prefers-reduced-motion se resuelve vía <MotionConfig reducedMotion="user">
 * en el layout raíz (ver Reveal.tsx) — no se ramifica aquí para evitar un
 * mismatch de hidratación entre servidor y cliente.
 */
export function RevealGroup({ children, className }: RevealGroupProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: SCROLL_REVEAL.amount }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

export interface RevealItemProps {
  children: React.ReactNode;
  className?: string;
}

/** Hijo directo de <RevealGroup> — hereda el estado hidden/visible del padre. */
export function RevealItem({ children, className }: RevealItemProps) {
  return (
    <motion.div className={className} variants={revealItemVariants}>
      {children}
    </motion.div>
  );
}
