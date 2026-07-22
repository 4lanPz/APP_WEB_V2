import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Escalas tipográficas propias del tema (`@theme` en globals.css).
 *
 * Hay que declarárselas a tailwind-merge o hace daño en silencio: no las
 * conoce, las clasifica como clases de COLOR de texto, y entonces
 * `text-h2 ... text-ink` le parece un conflicto de color en el que gana la
 * última. Resultado: se comía el tamaño y el elemento se pintaba al tamaño por
 * defecto sin que nada fallara ni avisara. Pasó con los titulares de sección.
 *
 * Si añades un `--text-*` nuevo a globals.css, añádelo también aquí.
 */
const ESCALAS = [
  "display",
  "h1",
  "h2",
  "h3",
  "body-l",
  "body-m",
  "caption",
  "label",
  "mono",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ESCALAS }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
