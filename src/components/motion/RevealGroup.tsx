"use client";

import { createContext, useContext } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  EASE_REVELAR,
  EASE_DESENROLLAR,
  REJILLA,
  SCROLL_REVEAL,
  VOCABULARIO,
  type TipoMovimiento,
} from "@/lib/motion";

/**
 * El grupo dispara en cuanto asoma, no con una fracción de sí mismo.
 *
 * Aquí el observado es el CONTENEDOR, y una grilla de 20 fichas mide varias
 * veces el viewport: nunca puede mostrar una fracción grande de sí misma, así
 * que un umbral por proporción la deja sin disparar y las celdas se quedan
 * invisibles (pasó, medido, en /productos/microfibra). Con "some" basta con
 * que entre en pantalla, que es justo cuando se quiere ver el trazado.
 */
const UMBRAL_GRUPO = "some" as const;

/** El grupo le dice a sus items si están dentro de una rejilla trazada. */
const ContextoGrupo = createContext<{ rejilla: boolean; tipo: TipoMovimiento }>({
  rejilla: false,
  tipo: "tarjeta",
});

const contenedorVariants = (retardo: number): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: SCROLL_REVEAL.stagger, delayChildren: retardo },
  },
});

const itemVariants = (tipo: TipoMovimiento): Variants => {
  const v = VOCABULARIO[tipo];
  return {
    hidden: { opacity: 0, y: v.distancia, scale: v.escala },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: v.duracion, ease: EASE_REVELAR },
    },
  };
};

export interface RevealGroupProps {
  children: React.ReactNode;
  className?: string;
  /**
   * `simple` — hermanos escalonados, sin más.
   * `rejilla` — para las grillas de hairline (`gap-px` sobre un fondo greige):
   * un panel del color del fondo tapa la grilla y se retira de izquierda a
   * derecha, así que la RETÍCULA SE TRAZA primero y las celdas entran después.
   */
  variante?: "simple" | "rejilla";
  /** Ritmo de las celdas. Por defecto `tarjeta` — son celdas, no párrafos. */
  tipo?: TipoMovimiento;
  /**
   * Clase de color del panel de trazado: tiene que ser el fondo sobre el que
   * se apoya la grilla, o el barrido se ve. `bg-paper` en secciones claras,
   * `bg-brand-deep` en las oscuras.
   */
  fondo?: string;
}

/**
 * Contenedor de hermanos escalonados (70ms) — cards, cifras, grillas.
 * Envuelve un grid/flex existente sin cambiar sus clases; cada hijo directo
 * debe ser un <RevealItem>.
 *
 * En variante `rejilla` el gesto es el trazado de la retícula. El panel usa
 * `scaleX` (transform) y no `clip-path` a propósito: framer solo suprime
 * transform y layout con prefers-reduced-motion, así que el panel salta a
 * scaleX 0 y la grilla queda visible y quieta. Un `clip-path` seguiría
 * animándose y sería movimiento donde se pidió que no lo hubiera.
 *
 * prefers-reduced-motion se resuelve vía <MotionConfig reducedMotion="user">
 * en el layout raíz (ver Reveal.tsx) — no se ramifica aquí para no romper la
 * hidratación.
 */
export function RevealGroup({
  children,
  className,
  variante = "simple",
  tipo = "tarjeta",
  fondo = "bg-paper",
}: RevealGroupProps) {
  const rejilla = variante === "rejilla";
  const v = VOCABULARIO[tipo];

  return (
    <ContextoGrupo.Provider value={{ rejilla, tipo }}>
      <motion.div
        className={cn(rejilla && "relative", className)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: !v.revierte, amount: UMBRAL_GRUPO }}
        variants={contenedorVariants(rejilla ? REJILLA.celdas : 0)}
      >
        {children}
        {rejilla && (
          /*
           * Sin `variants`: así queda fuera de la propagación del padre y el
           * stagger de las celdas no lo retrasa. Va el último del DOM para
           * pintarse por encima de las celdas.
           */
          <motion.div
            aria-hidden
            className={cn("pointer-events-none absolute inset-0", fondo)}
            style={{ transformOrigin: "right" }}
            initial={{ scaleX: 1 }}
            whileInView={{ scaleX: 0 }}
            viewport={{ once: !v.revierte, amount: UMBRAL_GRUPO }}
            transition={{ duration: REJILLA.trazo, ease: EASE_DESENROLLAR }}
          />
        )}
      </motion.div>
    </ContextoGrupo.Provider>
  );
}

export interface RevealItemProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Hijo directo de <RevealGroup>.
 *
 * En variante rejilla la celda se parte en dos: el marco (con su `className`,
 * o sea su fondo y su padding) se queda quieto y visible desde el principio
 * —es lo que dibuja la hairline junto al fondo del contenedor— y solo se
 * anima su contenido. Si se animara la celda entera no habría retícula que
 * trazar: se vería un bloque greige macizo.
 */
export function RevealItem({ children, className }: RevealItemProps) {
  const { rejilla, tipo } = useContext(ContextoGrupo);
  const variants = itemVariants(tipo);

  if (rejilla) {
    return (
      /*
       * `overflow-hidden` en el marco: el contenido entra desde 56px más
       * abajo y sin recorte invadiría la celda de al lado. Recortado, sube
       * desde debajo del borde de su propia celda, que además es el mismo
       * gesto de máscara que usan los titulares.
       */
      <div className={cn("overflow-hidden", className)}>
        <motion.div className="h-full" variants={variants}>
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
