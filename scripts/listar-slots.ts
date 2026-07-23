/**
 * Lista los nombres de archivo que acepta `entrega/`, agrupados por página.
 *
 *   npm run imagenes:slots
 *
 * Es la versión de terminal de `/admin/imagenes`, para cuando no apetece
 * levantar el servidor.
 */

import { SLOTS, ordenPagina, tituloPagina } from "../src/data/slots-imagen";
import { SLOTS_LLENOS } from "../src/data/imagenes.generado";

const porPagina = new Map<string, typeof SLOTS>();
for (const slot of SLOTS) {
  const lista = porPagina.get(slot.pagina) ?? [];
  lista.push(slot);
  porPagina.set(slot.pagina, lista);
}

const paginas = [...porPagina.entries()].sort(
  ([a], [b]) => ordenPagina(a) - ordenPagina(b),
);

for (const [ruta, slots] of paginas) {
  const llenos = slots.filter((s) => SLOTS_LLENOS.has(s.id)).length;
  console.log(`\n${tituloPagina(ruta).toUpperCase()}  (${ruta})  —  ${llenos} de ${slots.length}`);
  // La cabecera primero; el resto en orden de registro.
  const ordenadas = [...slots].sort(
    (a, b) => (a.seccion === "Cabecera" ? -1 : 0) - (b.seccion === "Cabecera" ? -1 : 0),
  );
  let seccionActual: string | undefined;
  for (const slot of ordenadas) {
    if (slot.seccion !== seccionActual) {
      seccionActual = slot.seccion;
      if (seccionActual) console.log(`  — ${seccionActual} —`);
    }
    const marca = SLOTS_LLENOS.has(slot.id) ? "·" : "FALTA";
    console.log(`  ${marca.padEnd(6)} ${`${slot.id}.jpg`.padEnd(34)} ${slot.nota ?? ""}`);
  }
}

const llenos = SLOTS.filter((s) => SLOTS_LLENOS.has(s.id)).length;
console.log(`\n${llenos} de ${SLOTS.length} slots con imagen\n`);
