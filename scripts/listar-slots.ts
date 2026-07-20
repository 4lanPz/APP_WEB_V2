/**
 * Lista los nombres de archivo que acepta `entrega/`, agrupados por página.
 *
 *   npm run imagenes:slots
 *
 * Es la versión de terminal de `/admin/imagenes`, para cuando no apetece
 * levantar el servidor.
 */

import { SLOTS } from "../src/data/slots-imagen";
import { SLOTS_LLENOS } from "../src/data/imagenes.generado";

const grupos = new Map<string, typeof SLOTS>();
for (const slot of SLOTS) {
  const lista = grupos.get(slot.grupo) ?? [];
  lista.push(slot);
  grupos.set(slot.grupo, lista);
}

for (const [grupo, slots] of grupos) {
  const llenos = slots.filter((s) => SLOTS_LLENOS.has(s.id)).length;
  console.log(`\n${grupo.toUpperCase()}  —  ${llenos} de ${slots.length}`);
  for (const slot of slots) {
    const marca = SLOTS_LLENOS.has(slot.id) ? "·" : "FALTA";
    console.log(`  ${marca.padEnd(6)} ${`${slot.id}.jpg`.padEnd(34)} ${slot.nota ?? ""}`);
  }
}

const llenos = SLOTS.filter((s) => SLOTS_LLENOS.has(s.id)).length;
console.log(`\n${llenos} de ${SLOTS.length} slots con imagen\n`);
