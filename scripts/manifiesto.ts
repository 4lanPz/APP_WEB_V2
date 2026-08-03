/**
 * Escritura de `src/data/imagenes.generado.ts`.
 *
 * Lo escriben DOS scripts —`procesar-entrega.ts` y `preparar-imagenes.ts`— y
 * por eso vive aquí y no dentro de uno de ellos: el manifiesto se genera entero
 * cada vez, así que si cada script tuviera su propia versión, el último en
 * correr borraría lo que hubiera puesto el otro.
 *
 * QUÉ SE GENERA MIRANDO Y QUÉ SE ARRASTRA
 * `SLOTS_LLENOS` se deriva de `public/`: es un hecho comprobable en disco, no
 * hay nada que conservar. Las MEDIDAS no: salen de haber procesado la foto, así
 * que quien no la acaba de procesar no puede recalcularlas y las hereda del
 * manifiesto anterior. Correr `npm run imagenes` sin nada en `entrega/` deja las
 * medidas de Titanium intactas en vez de vaciarlas.
 */

import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SLOTS, type MedidaGris } from "../src/data/slots-imagen";
import { MEDIDAS_GRIS } from "../src/data/imagenes.generado";

const RAIZ = join(import.meta.dirname, "..");
const PUBLIC = join(RAIZ, "public");
const MANIFIESTO = join(RAIZ, "src", "data", "imagenes.generado.ts");

export interface ResultadoManifiesto {
  llenos: string[];
  vacios: string[];
  /** Slots grises con archivo publicado y sin medida: el recoloreo los estima. */
  sinMedir: string[];
}

/**
 * Reescribe el manifiesto. `recienMedidas` son las fotos que el script que
 * llama acaba de procesar; el resto de medidas se conserva.
 */
export function escribirManifiesto(
  recienMedidas: ReadonlyMap<string, MedidaGris> = new Map(),
): ResultadoManifiesto {
  const llenos: string[] = [];
  const vacios: string[] = [];
  for (const slot of SLOTS) {
    (existsSync(join(PUBLIC, slot.destino)) ? llenos : vacios).push(slot.id);
  }
  const conArchivo = new Set(llenos);

  // Solo se publican medidas de slots que HOY son grises y HOY tienen archivo.
  // Sin este filtro, quitarle el preprocesado a una tela dejaría su `k` viejo
  // en el manifiesto y la capa de color seguiría compensando una foto que ya no
  // existe — el peor tipo de dato obsoleto, porque parece correcto.
  const sinMedir: string[] = [];
  const medidas: [string, MedidaGris][] = [];
  for (const slot of SLOTS) {
    if (!slot.gris || !conArchivo.has(slot.id)) continue;
    const medida = recienMedidas.get(slot.id) ?? MEDIDAS_GRIS.get(slot.id);
    if (!medida) {
      sinMedir.push(slot.id);
      continue;
    }
    medidas.push([slot.id, medida]);
  }

  const cuerpo = `/**
 * GENERADO — no editar a mano.
 *
 * Lo reescriben \`npm run imagenes\` y \`npm run imagenes:telas-pw\` mirando qué
 * archivos existen en \`public/\`. Es la lista de slots que tienen imagen —lo
 * que decide si una página muestra la foto o el placeholder— y las medidas de
 * las fotos en gris, que es lo que calibra la simulación de color.
 */

import type { MedidaGris } from "./slots-imagen";

export const SLOTS_LLENOS: ReadonlySet<string> = new Set([
${llenos.map((id) => `  ${JSON.stringify(id)},`).join("\n")}
]);

/**
 * Luminancia media (\`k\`, 0–1) y croma del original (0–255) de cada foto que se
 * publica en gris. \`k\` es lo que compensa la capa de color; \`croma\` queda como
 * registro de cuánto tinte traía la toma. Ver \`SlotImagen.gris\`.
 */
export const MEDIDAS_GRIS: ReadonlyMap<string, MedidaGris> = new Map<string, MedidaGris>([
${medidas
  .map(
    ([id, m]) =>
      `  [${JSON.stringify(id)}, { k: ${m.k.toFixed(4)}, croma: ${m.croma.toFixed(1)} }],`,
  )
  .join("\n")}
]);
`;
  writeFileSync(MANIFIESTO, cuerpo, "utf8");
  return { llenos, vacios, sinMedir };
}
