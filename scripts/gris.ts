/**
 * Preprocesado de las fotos que alimentan la simulación de color.
 *
 * Los dos scripts que escriben en `public/` —`preparar-imagenes.ts` desde
 * `Telas_PW/` y `procesar-entrega.ts` desde `entrega/`— pasan por aquí cuando
 * el slot está marcado `gris`. Está en un módulo aparte y no duplicado en cada
 * uno porque el día que los dos dejen de coincidir, la misma tela se vería de
 * un tono distinto según por dónde entró su foto, y eso no se descubre mirando
 * el código: se descubre mirando la pantalla y sin saber qué preguntar.
 *
 * QUÉ HACE, Y POR QUÉ ESOS DOS PASOS
 *
 *  1. DESATURAR A GRIS PURO. `multiply` multiplica canal a canal: si la foto
 *     trae dominante, ese tinte multiplica también al color del chip y el
 *     resultado ya no es el color que se pidió. El lote de Titanium llega con
 *     croma 2,3–3,0 —poco, pero medible—, y es la referencia de luz neutra que
 *     tenemos.
 *
 *     AQUÍ DECÍA QUE ATHLETIC LLEGABA CON CROMA 0,0, Y ESO NO MEDÍA LO QUE
 *     PARECÍA. `Microfibra/Athletic (3).jpeg` es un archivo en blanco y negro:
 *     24 millones de píxeles con R=G=B exacto, comprobado. Su croma es 0,0
 *     porque ya venía desaturado, no porque la luz fuera neutra — el mismo 0,0
 *     daría una tela azul convertida a gris. Citarlo como referencia pedía una
 *     cifra que solo se consigue tirando el color, que es justo lo contrario de
 *     lo que hace falta. Ver `npm run imagenes:medir`.
 *
 *  2. NORMALIZAR NIVELES hasta que el máximo de luminancia quede en 250. Las
 *     fotos de Titanium son bastante más oscuras que la de Athletic (k 0,469 a
 *     0,600 frente a 0,721) y ninguna del lote tiene un solo píxel quemado
 *     —máximo medido 212—, así que hay margen para levantarlas sin perder
 *     información. Normalizada, Titanium (3) pasa de k=0,600 a 0,708, o sea al
 *     nivel de Athletic, y la compensación de la capa deja de tener que
 *     estirar tanto.
 *
 *     El 0,721 es del RECORTE que se publica. Antes decía 0,749, que es el
 *     cuadro entero de `Athletic (3).jpeg` y quedó de cuando no había recorte:
 *     describía una imagen que ya no se publica.
 *
 * El factor es `250 / máximo`, un solo escalar para toda la imagen. No es
 * `normalise()` de sharp: ese estira contra percentiles y RECORTA, y recortar
 * aquí es quemar el brillo especular de la fibra, que es justamente el detalle
 * que la lupa existe para enseñar. Con `250 / máximo` el nuevo máximo cae
 * exactamente en 250 y no se pierde un solo nivel.
 */

import sharp, { type Sharp } from "sharp";

/**
 * Techo de croma tolerable en el ORIGINAL, en 0–255.
 *
 * Es calibrable y por eso está aquí solo: 10 es el primer corte, elegido con el
 * material que hay (Athletic 0,0 · Titanium 2,5–3,0 · las fotos a color del
 * catálogo, decenas). Por encima, el script AVISA y sigue. No bloquea a
 * propósito: que una foto sirva o no para recoloreo se decide mirándola, y un
 * script que se planta obliga a tocarle el umbral para poder verla.
 */
export const CROMA_MAXIMO = 10;

/** Luminancia a la que se normaliza el máximo de la imagen. */
const MAXIMO_OBJETIVO = 250;

/**
 * Croma: cuánto se separan entre sí las medias de los tres canales.
 *
 * Mide el DOMINANTE global, que es lo que estropea el multiply, y no la
 * saturación local —una foto en blanco y negro con un botón rojo daría croma 0
 * y estaría en lo cierto: el multiply saldría limpio—. Se lee en la misma
 * escala que los canales, 0–255, para poder compararlo de un vistazo con el
 * gris medio.
 */
function croma(medias: number[]): number {
  const rgb = medias.slice(0, 3);
  return Math.max(...rgb) - Math.min(...rgb);
}

/**
 * Desatura y normaliza un pipeline YA recortado y redimensionado, y devuelve el
 * pipeline listo para codificar junto con el croma que traía el original.
 *
 * Trabaja sobre un búfer en crudo y no sobre el archivo original porque las dos
 * medidas tienen que salir de los píxeles que se van a publicar: medir el
 * original y publicar el recorte daría un número que describe otra imagen.
 */
export async function desaturarYNormalizar(
  pipeline: Sharp,
): Promise<{ salida: Sharp; croma: number }> {
  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
  const crudo = { raw: { width: info.width, height: info.height, channels: info.channels } };

  const enColor = await sharp(data, crudo).stats();
  const cromaOriginal = croma(enColor.channels.map((c) => c.mean));

  const gris = await sharp(data, crudo)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const crudoGris = {
    raw: {
      width: gris.info.width,
      height: gris.info.height,
      channels: gris.info.channels,
    },
  };

  const { max } = (await sharp(gris.data, crudoGris).stats()).channels[0];
  // Una imagen completamente negra no tiene nivel que levantar; multiplicar por
  // infinito la dejaría igual de negra y con un NaN en el manifiesto.
  const factor = max > 0 ? MAXIMO_OBJETIVO / max : 1;

  return {
    salida: sharp(gris.data, crudoGris).linear(factor, 0),
    croma: cromaOriginal,
  };
}

/**
 * Luminancia media de un archivo YA PUBLICADO, en 0–1.
 *
 * Se mide sobre el WebP escrito y no sobre el búfer de antes de codificar
 * porque el número tiene que describir los píxeles que recibe el navegador: la
 * compresión mueve la media, poco, pero la mueve, y es la capa de color quien
 * paga la diferencia.
 */
export async function medirLuminancia(archivo: string): Promise<number> {
  const { channels } = await sharp(archivo).stats();
  return channels[0].mean / 255;
}

/** Formatea el aviso de croma alto, o `undefined` si la foto pasa el corte. */
export function avisoDeCroma(id: string, valor: number): string | undefined {
  if (valor <= CROMA_MAXIMO) return undefined;
  return (
    `${id}: croma ${valor.toFixed(1)} sobre un techo de ${CROMA_MAXIMO}. ` +
    `El original trae dominante de color; desaturado se publica igual, pero ` +
    `revisa en pantalla que el recoloreo no salga sucio antes de darla por buena.`
  );
}
