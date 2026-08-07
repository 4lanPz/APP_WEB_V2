/**
 * EL NUMERADO DE SECCIÓN SALE DEL ORDEN, NO DE LA MANO.
 *
 * Antes cada `SectionHeader` traía su `index="02"` escrito, y reordenar una
 * página obligaba a renumerar las cabeceras a mano —con el fallo clásico de
 * dejarse una y publicar un 01, 03, 03, 04—. Aquí el índice es "el siguiente",
 * así que mover un bloque de sitio lo renumera todo sin tocar nada más: las
 * llamadas se resuelven en el orden en que se construye el JSX, que es el orden
 * en que se leen en pantalla.
 *
 * SE LLAMA DENTRO DEL COMPONENTE DE PÁGINA, Y ESO ES LO IMPORTANTE. Un contador
 * creado en el módulo sería estado compartido entre peticiones: el servidor lo
 * incrementaría en cada render y el segundo visitante vería 04, 05, 06. Uno por
 * render empieza siempre en 01.
 *
 *   const numero = numerador();
 *   <SectionHeader index={numero()} … />
 *
 * NO TIENE POR QUÉ NUMERAR TODAS LAS SECCIONES, solo las que llevan índice. El
 * numerado marca un recorrido, y hay bloques que no forman parte de él (una
 * declaración de marca, una herramienta); esos no usan `SectionHeader` y por
 * tanto no consumen número.
 */
export function numerador() {
  let n = 0;
  return () => String(++n).padStart(2, "0");
}
