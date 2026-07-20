/**
 * Hechos del árbol de rutas, no del contenido.
 *
 * Algunas telas tienen su propio `page.tsx` bajo `src/app/productos/...`. Las
 * rutas dinámicas `[categoria]/[subcategoria]` y `[tono]` deben excluirlas de
 * `generateStaticParams` para no generar el mismo path dos veces.
 *
 * Antes esto se derivaba de `Subcategory.available`, que es un campo de
 * contenido. Era frágil en la dirección peligrosa: poner `available: true` a
 * una tela que NO tiene página propia la sacaba de la generación estática y la
 * mandaba a 404. Ahora la lista es explícita — si añades un `page.tsx` propio,
 * lo registras aquí, y si no, no.
 */

/** Clave `categoria/subcategoria`. */
export const SUBCATEGORIAS_CON_PAGINA_PROPIA: ReadonlySet<string> = new Set([
  "microfibra/dortmund-plus",
]);

/** Clave `categoria/subcategoria/tono`. */
export const TONOS_CON_PAGINA_PROPIA: ReadonlySet<string> = new Set([
  "microfibra/dortmund-plus/blancos",
]);

export function tienePaginaPropia(
  categoria: string,
  subcategoria: string,
): boolean {
  return SUBCATEGORIAS_CON_PAGINA_PROPIA.has(`${categoria}/${subcategoria}`);
}

export function tonoTienePaginaPropia(
  categoria: string,
  subcategoria: string,
  tono: string,
): boolean {
  return TONOS_CON_PAGINA_PROPIA.has(`${categoria}/${subcategoria}/${tono}`);
}
