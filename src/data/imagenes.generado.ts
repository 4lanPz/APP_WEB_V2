/**
 * GENERADO — no editar a mano.
 *
 * Lo reescriben `npm run imagenes` y `npm run imagenes:telas-pw` mirando qué
 * archivos existen en `public/`. Es la lista de slots que tienen imagen —lo
 * que decide si una página muestra la foto o el placeholder— y las medidas de
 * las fotos en gris, que es lo que calibra la simulación de color.
 */

import type { MedidaGris } from "./slots-imagen";

export const SLOTS_LLENOS: ReadonlySet<string> = new Set([
  "macro-fibra-blanca",
  "macro-tejido",
  "macro-punto-camiseta",
  "oficio-nave-tejido",
  "oficio-taller-alangasi",
  "local-fachada",
  "dortmund-plus-cancha",
  "hero-empresa",
  "hero-contacto",
  "hero-productos",
  "hero-camisetas",
  "hero-microfibra",
  "hero-asesor-virtual",
  "hero-home-poster",
  "chelsea",
  "athletic",
  "boston",
  "dortmund",
  "sevilla",
  "titanium",
  "juventus",
  "kansas",
  "sevilla-plus",
  "dobleface-plus",
  "sevilla-plus-brillante",
  "dortmund-plus-brillante",
  "aston-plus",
  "gaby",
  "kiana",
  "napoli",
  "napoles",
  "river",
  "mezi",
  "ribb-150",
  "interlock-30",
  "interlock-40",
  "denis-20",
  "lacoast-20",
  "lacoast-polo-20",
  "lacoast-kratos-22",
  "pique-ares-24",
  "titanium-caida",
  "titanium-trama",
  "athletic-macro",
  "athletic-zoom",
]);

/**
 * Luminancia media (`k`, 0–1) y croma del original (0–255) de cada foto que se
 * publica en gris. `k` es lo que compensa la capa de color; `croma` queda como
 * registro de cuánto tinte traía la toma. Ver `SlotImagen.gris`.
 */
export const MEDIDAS_GRIS: ReadonlyMap<string, MedidaGris> = new Map<string, MedidaGris>([
  ["titanium", { k: 0.7061, croma: 3.0 }],
  ["titanium-caida", { k: 0.5788, croma: 2.3 }],
  ["titanium-trama", { k: 0.6900, croma: 2.9 }],
  ["athletic-macro", { k: 0.7053, croma: 0.0 }],
  ["athletic-zoom", { k: 0.7061, croma: 0.0 }],
]);
