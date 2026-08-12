import type { PasoAsesor } from "@/components/ui/AsesorPasos";

/**
 * LOS TRES PASOS DEL BLOQUE DE ASESOR — fuente única de las DOS páginas que lo
 * montan: la portada y /empresa.
 *
 * Estaban escritos dentro de `app/page.tsx` y bastaban mientras el bloque salía
 * en un solo sitio. En cuanto salió en dos, la lista tenía que estar en uno: son
 * los mismos tres pasos con las mismas tres fotos, y dos copias es que un día
 * una página anuncie un paso que la otra no tiene, o —peor— que apunte a un
 * `slot` con una errata y enseñe un hueco vacío en una página y la foto en la
 * otra.
 *
 * LAS FOTOS SE COMPARTEN, no se duplican. `asesor-portada-*` es un solo hueco
 * por paso para todo el sitio, igual que las cards de familia son un solo
 * archivo aunque se pinten en tres rejillas. Los ids van literales porque el
 * chequeo de slots sin cablear de `procesar-entrega.ts` los busca así en `src/`.
 *
 * LO QUE NO ESTÁ AQUÍ ES EL DISCURSO. Eyebrow, titular, párrafo y CTA los pone
 * cada página, y deben ser distintos: en la portada el bloque se presenta a
 * alguien que acaba de llegar y en /empresa cierra un relato ya contado.
 */
export const PASOS_ASESOR: PasoAsesor[] = [
  { index: "01", label: "Prenda", slot: "asesor-portada-prenda" },
  { index: "02", label: "Sublimado", slot: "asesor-portada-sublimado" },
  { index: "03", label: "Uso", slot: "asesor-portada-uso" },
];
