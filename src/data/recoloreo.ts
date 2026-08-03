/**
 * Recoloreo en tiempo real de la foto de tela.
 *
 * Las fotos que lo admiten se publican en gris puro normalizado —los tres
 * canales miden lo mismo—, así que toda la información vive en la luminosidad:
 * trama, pliegues y brillos. Esa es exactamente la condición que necesita una
 * capa de color en `multiply`, que multiplica canal a canal y conserva intacta
 * la estructura de luces y sombras. Quién pasa por ese preprocesado lo declara
 * `IDS_GRIS` en `slots-imagen.ts`, y el resultado —la luminancia media de cada
 * archivo publicado— lo mide el script y lo guarda en el manifiesto.
 *
 * ES UNA SIMULACIÓN, NO UNA CARTA DE COLOR. Por eso los swatches llevan la nota
 * de muestra física al lado, y no es decorativa: nadie debería comprar un tono
 * por lo que vio en una pantalla.
 */

/**
 * Luminancia con la que se compensa una foto que NO trae medida.
 *
 * Es una red, no un valor de trabajo: el número real de cada foto lo calcula el
 * preprocesado y viaja en `MEDIDAS_GRIS`. Durante un tiempo esto fue una
 * constante escrita a mano con la luminancia de Athletic, y con una sola tela
 * pasaba por exacto; con dos ya no, y con la tercera nadie iba a acordarse de
 * recalcularla. Aquí queda solo para que una foto recién soltada sin regenerar
 * el manifiesto se vea razonable en vez de rota.
 *
 * 0,71 es donde caen las cinco fotos medidas una vez normalizadas (0,58 a
 * 0,71): el extremo alto, porque errar por arriba oscurece de menos y errar por
 * abajo satura de más.
 */
export const LUMINANCIA_SUPUESTA = 0.71;

export interface ColorRecoloreo {
  /** Nombre comercial. Va al `aria-label` del botón y al rótulo en mono. */
  nombre: string;
  /**
   * El color REAL que se pretende ver en la tela, y el que se pinta en el chip.
   * No es el color de la capa: ese se calcula con `capaMultiply()`.
   */
  hex: string;
}

/**
 * Los cuatro tonos del muestrario.
 *
 * VALORES PROVISIONALES — pendientes de confirmar contra la base de datos del
 * cliente. Están juntos y solos en este array justamente para que cambiarlos
 * sea editar cuatro líneas y nada más.
 *
 * El primero es el estado por defecto: blanco óptico, que tras compensar queda
 * a un paso del blanco, y multiply contra un fondo casi blanco no altera la
 * foto. Se ve tal cual, que es lo correcto — el blanco de la tela ya es el de
 * la foto.
 */
export const COLORES_RECOLOREO: readonly ColorRecoloreo[] = [
  { nombre: "Blanco óptico", hex: "#F2F5FA" },
  { nombre: "Azul eléctrico", hex: "#0047CC" },
  { nombre: "Rojo Marlboro", hex: "#C8102E" },
  { nombre: "Amarillo Ecuador", hex: "#FFCD00" },
] as const;

function aRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function aHex(rgb: [number, number, number]): string {
  return `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

/**
 * Color del FONDO sobre el que la foto se mezcla en `multiply` para que la tela
 * se LEA del color del chip.
 *
 * Multiply devuelve `base x capa`. Pintado el color del chip a secas, el
 * resultado sale multiplicado por la luminancia de la foto —`k`, del orden de
 * 0,7— y la tela se ve casi un 30% más oscura de lo que dice el chip. La
 * corrección es subir la capa, pero CÓMO se sube decide si el color sigue
 * siendo el mismo color.
 *
 * LA ESCALA ES UNIFORME, NO POR CANAL. Es lo único que hay que entender aquí.
 * Dividir cada canal por su cuenta y recortar el que se pase (`c / k` con clip)
 * destruye la proporción entre canales, que es exactamente lo que define el
 * tono. El amarillo Ecuador es el caso de libro: `#FFCD00` tiene R:G = 255:205,
 * y al dividir los dos por 0,722 los dos se pasan de 255, los dos se recortan,
 * y la razón queda 1:1 — que ya no es ámbar, es VERDE LIMÓN. El error no era de
 * brillo sino de tono, y no se veía en la media: se veía en pantalla.
 *
 * Multiplicando los tres canales por el MISMO factor, la proporción se conserva
 * intacta y el tono es el del chip por construcción. El factor es el mayor que
 * no desborda ningún canal:
 *
 *   escala = min(255 / max(canal), 1 / k)
 *
 * El primer término es el techo del recorte; el segundo, la compensación
 * completa. Cuando gana el segundo, el tono medio cae justo sobre el objetivo.
 * Cuando gana el primero, el color sale correcto de tono pero más oscuro de lo
 * que pide el chip — y eso es lo que hay: se prefiere un ámbar oscuro a un
 * limón brillante, porque el cliente compra por tono.
 *
 * Con la principal de Athletic (k = 0,705):
 *
 *   Blanco óptico  #F2F5FA -> #F7FAFF  escala 1,02 · tinte azulado imperceptible
 *   Rojo Marlboro  #C8102E -> #FF143B  escala 1,27 · alcanza #B40E2A
 *   Azul eléctrico #0047CC -> #0059FF  escala 1,25 · alcanza #003FB4
 *   Amarillo Ecu.  #FFCD00 -> #FFCD00  escala 1,00 · alcanza #B49100, ámbar oscuro
 *
 * El amarillo no admite ninguna compensación —su canal rojo ya está en 255— así
 * que es el que más oscuro sale. Si esa oscuridad no pasa el corte en pantalla,
 * la salida no es volver al recorte por canal: es `MODO_RECOLOREO =
 * "mapa-degradado"`, que sí alcanza el tono pleno.
 *
 * `k` ES POR FOTO Y NO POR TELA. Las tres vistas de Titanium se midieron en
 * 0,706 / 0,579 / 0,690: la caída del género es notablemente más oscura que el
 * macro, y compensarla con la luminancia de otra vista dejaría la miniatura de
 * un tono distinto al de la foto grande. Lo mide el preprocesado; aquí solo se
 * usa.
 *
 * CON LOS CUATRO TONOS PROVISIONALES DE HOY, `k` NO LLEGA A DECIDIR NADA, y
 * conviene saberlo antes de creer que sobra. Manda el término de la izquierda
 * en los cuatro: `1/k` solo gana cuando el canal más alto del color baja de
 * `255 · k`, o sea de unos 180, y estos cuatro van de 200 para arriba. Los
 * colores reales del ERP sí caen ahí —`#173761` tiene su máximo en 97— y
 * entonces cada foto se compensará con la suya. Fijar `k` a un número redondo
 * "porque da igual" es aplazar el problema hasta que deje de dar igual.
 */
export function capaMultiply(hex: string, k = LUMINANCIA_SUPUESTA): string {
  const rgb = aRgb(hex);
  const escala = Math.min(255 / Math.max(...rgb), 1 / k);
  return aHex(rgb.map((c) => c * escala) as [number, number, number]);
}

/**
 * Tono medio que se ALCANZA de verdad, después del recorte por canal. Sirve
 * para poder comparar contra `hex` sin abrir una pantalla: si los dos se
 * separan mucho, ese color no lo da multiply.
 */
export function tonoAlcanzado(hex: string, k = LUMINANCIA_SUPUESTA): string {
  return aHex(
    aRgb(capaMultiply(hex, k)).map((c) => c * k) as [number, number, number],
  );
}

/**
 * Qué técnica pinta el color.
 *
 * `"multiply"` — un fondo del color compensado sobre el que la foto se mezcla.
 * Barata (la compone el GPU), no toca píxeles, y es exacta salvo donde satura.
 * Que el color vaya DEBAJO y no encima es lo que elimina el parpadeo: ver
 * `TelaTenida`.
 *
 * `"mapa-degradado"` — la foto pasa por un canvas y cada nivel de gris se
 * sustituye por su color en una rampa sombra→color→luz. Alcanza los tonos
 * saturados que multiply no puede, a cambio de recorrer los píxeles en la CPU
 * cada vez que cambia el color (la capa de lupa son 6,75 M de píxeles).
 *
 * EL VALOR SE DECIDE MIRANDO LA PANTALLA, NO AQUÍ. Multiply es el punto de
 * partida porque conserva la foto intacta; el mapa está escrito y listo para el
 * caso que se sabe que falla, el amarillo. Cambiar esta constante cambia la
 * técnica en la ficha entera.
 */
export const MODO_RECOLOREO: "multiply" | "mapa-degradado" = "multiply";

/**
 * Rampa del mapa de degradado, de sombra a luz.
 *
 * Los extremos no son negro y blanco puros a propósito: la tela no tiene
 * ninguno de los dos, y llevar la rampa hasta ellos aplasta el relieve en los
 * bordes. `0,18` y `0,96` conservan el pliegue más oscuro y el brillo especular
 * sin quemarlos.
 */
export const RAMPA_DEGRADADO = {
  sombra: 0.18,
  luz: 0.96,
} as const;

/**
 * Tabla de 256 entradas gris → RGB para el mapa de degradado: la sombra tira el
 * color hacia negro, la luz hacia blanco, y el color pleno cae en el medio.
 * Se calcula una vez por color, no por píxel.
 */
export function lutDegradado(hex: string): Uint8ClampedArray {
  const [r, g, b] = aRgb(hex);
  const lut = new Uint8ClampedArray(256 * 3);
  const { sombra, luz } = RAMPA_DEGRADADO;

  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    // Por debajo del medio se interpola hacia la sombra; por encima, hacia la
    // luz. El color del chip queda exactamente en t = 0,5.
    const k = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5;
    const mezcla = (c: number) =>
      t < 0.5 ? c * sombra + (c - c * sombra) * k : c + (255 - c) * luz * k;

    lut[i * 3] = mezcla(r);
    lut[i * 3 + 1] = mezcla(g);
    lut[i * 3 + 2] = mezcla(b);
  }
  return lut;
}

/**
 * Telas con recoloreo. Es una excepción por tela, no una prestación del
 * catálogo: la técnica exige que la foto sea gris neutro, y solo lo son los dos
 * lotes que se dispararon sobre género sin teñir. Poner esto en una tela con
 * foto teñida daría un color sucio —el tinte de la foto multiplicaría al del
 * chip— y nadie sabría por qué; las otras 18 del catálogo están a color y por
 * eso su ficha no enseña el muestrario.
 *
 * VA DE LA MANO DE `IDS_GRIS` en `slots-imagen.ts`, que es el que hace que las
 * fotos de estas telas pasen por el preprocesado. Añadir una tela aquí sin
 * añadir sus fotos allí publica el muestrario sobre una foto a color.
 *
 * Titanium entra con sus tres vistas medidas: croma del original 3,0 / 2,3 /
 * 2,9 sobre un techo de 10, o sea leve tinte que la desaturación se lleva por
 * delante. La segunda —la que ya estaba subida sin revisar— pasó el corte.
 */
export const TELAS_CON_RECOLOREO: ReadonlySet<string> = new Set([
  "athletic",
  "titanium",
]);
