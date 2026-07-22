"use client";

import { motion, type Variants } from "framer-motion";
import { EASE_DESENROLLAR, MASCARA, SCROLL_REVEAL } from "@/lib/motion";

const lineaVariants = (delay: number): Variants => ({
  oculto: { y: "110%" },
  visible: (i: number) => ({
    y: "0%",
    transition: {
      duration: MASCARA.duracion,
      ease: EASE_DESENROLLAR,
      delay: delay + i * MASCARA.stagger,
    },
  }),
});

export interface LineasEnMascaraProps {
  /** Una entrada por línea. Cada una sube desde debajo de su propia máscara. */
  lineas: React.ReactNode[];
  /** Elemento contenedor: `h1` en el hero, `h2` en las cabeceras de sección. */
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  /**
   * `entrada` arranca al montar (el hero, que ya está en pantalla);
   * `scroll` espera a cruzar el viewport (las cabeceras de sección).
   */
  disparo?: "entrada" | "scroll";
  /** Retardo antes de la primera línea. */
  delay?: number;
}

/**
 * Titular revelado por máscara: cada línea vive dentro de un `overflow-hidden`
 * y entra subiendo desde abajo, escalonada 90ms. No hay opacidad de por medio
 * — el texto no aparece, se destapa.
 *
 * Vivía suelto dentro de `Hero.tsx` y era el mejor gesto del sitio usado una
 * sola vez. Extraído aquí, es la técnica de TODOS los titulares (ver
 * `MOTION.md`). No sustituirlo por un fade.
 *
 * Anima solo `transform`, así que con prefers-reduced-motion framer lo salta
 * (`MotionConfig reducedMotion="user"` en el layout) y el titular queda
 * visible y quieto, sin ramificar aquí y sin romper la hidratación.
 *
 * Cada línea debe ser una línea real: el componente no mide ni parte el texto,
 * lo parte quien lo llama. Una línea larga que envuelva sola dentro de su
 * máscara sube en bloque, que es aceptable pero no es el gesto.
 */
export function LineasEnMascara({
  lineas,
  as: Etiqueta = "h2",
  className,
  disparo = "scroll",
  delay = 0,
}: LineasEnMascaraProps) {
  const enScroll = disparo === "scroll";
  const Contenedor = motion[Etiqueta];
  const variants = lineaVariants(delay);

  return (
    /*
     * El observador va AQUÍ, en el contenedor sin recortar, y las líneas
     * heredan el estado por variantes.
     *
     * Ponerlo en cada línea no funciona y el fallo es silencioso: la línea
     * arranca desplazada 110% hacia abajo, o sea fuera de la caja de recorte
     * de su propia máscara, y IntersectionObserver sí tiene en cuenta el
     * recorte de los ancestros. Intersección vacía para siempre → el titular
     * no entra nunca. Medido: cinco h2 de la portada se quedaron abajo.
     */
    <Contenedor
      className={className}
      initial="oculto"
      {...(enScroll
        ? {
            whileInView: "visible",
            viewport: { once: true, amount: SCROLL_REVEAL.amount },
          }
        : { animate: "visible" })}
    >
      {lineas.map((linea, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span className="block" custom={i} variants={variants}>
            {linea}
          </motion.span>
        </span>
      ))}
    </Contenedor>
  );
}
