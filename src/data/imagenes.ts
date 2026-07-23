/**
 * Fotografías publicadas en el sitio.
 *
 * Este archivo YA NO lleva la lista de fotos a mano. Ahora hay dos piezas:
 *
 *  - `slots-imagen.ts`  — qué huecos existen, cómo se llama el archivo de cada
 *                         uno y qué alt le corresponde. Se escribe a mano.
 *  - `imagenes.generado.ts` — qué huecos tienen archivo. Lo reescribe
 *                         `npm run imagenes` mirando `public/`.
 *
 * Publicar una foto es dejar el archivo en `entrega/` con el nombre del slot y
 * correr el comando. No hay que tocar código. El detalle está en
 * `README-imagenes.md`.
 *
 * REGLA QUE NO CAMBIA: una foto solo se asigna a una tela si se sabe con
 * certeza qué tela muestra. Una foto equivocada en una ficha técnica es el
 * mismo error que un gramaje inventado. Los slots sin archivo se quedan con
 * `ImagePlaceholder` — no se rellenan con una imagen "parecida".
 */

import { SLOTS, SLOTS_TELA, SUFIJOS_GALERIA_TELA, slotPorId } from "./slots-imagen";
import { SLOTS_LLENOS } from "./imagenes.generado";

export interface Foto {
  /** Ruta pública, servida por next/image. */
  ruta: string;
  /** Alt descriptivo en español. Nunca vacío salvo que sea decorativa. */
  alt: string;
}

/**
 * Devuelve la foto de un slot, o `undefined` si todavía no tiene archivo.
 *
 * Devolver `undefined` y no la ruta a secas es lo que impide publicar un <img>
 * roto: quien la consume pinta el placeholder sin enterarse de nada.
 */
export function foto(id: string): Foto | undefined {
  if (!SLOTS_LLENOS.has(id)) return undefined;
  const slot = slotPorId(id);
  return slot ? { ruta: slot.destino, alt: slot.alt } : undefined;
}

/** Foto de una tela, por slug de subcategoría. El slug ES el id del slot. */
export function fotoDeTela(slug: string): Foto | undefined {
  return foto(slug);
}

/**
 * Todas las fotos disponibles de una tela para la galería, en orden: primero
 * el macro del tejido (`slug`), luego las vistas adicionales (`slug-caida`, …).
 * Devuelve solo las que tienen archivo, así que la galería degrada sola: con
 * una foto se comporta como una imagen fija; con dos o más aparece completa.
 *
 * Las vistas extra se descubren por convención de nombre desde los slots
 * registrados, no con una lista aparte: registrar `slug-caida` en
 * `slots-imagen.ts` basta para que la galería lo recoja cuando llegue el
 * archivo.
 */
export function galeriaDeTela(slug: string): Foto[] {
  const ids = [slug, ...SUFIJOS_GALERIA_TELA.map((sufijo) => `${slug}-${sufijo}`)];
  return ids
    .map((id) => foto(id))
    .filter((f): f is Foto => Boolean(f));
}

/** Slugs de tela con foto real — para informar de la cobertura. */
export const slugsConFoto: ReadonlySet<string> = new Set(
  SLOTS_TELA.filter((s) => SLOTS_LLENOS.has(s.id)).map((s) => s.id),
);

/** Cobertura, para `/admin/imagenes` y para el pedido al cliente. */
export const coberturaImagenes = {
  total: SLOTS.length,
  llenos: SLOTS.filter((s) => SLOTS_LLENOS.has(s.id)).length,
  get vacios() {
    return this.total - this.llenos;
  },
};

/**
 * Material que existe en `Telas_PW/` y que deliberadamente NO se publica.
 *
 * Está aquí, y no solo en un comentario, porque la razón de cada bloqueo se
 * pierde en cuanto pasa una semana: sin registro, el siguiente que abra la
 * carpeta ve fotos buenas sin usar y las cablea. `scripts/verificar-catalogo.ts`
 * lo imprime en el pedido al cliente bajo "requiere aclaración".
 */
export type MotivoBloqueo =
  /**
   * Generada por IA y licenciada por marketing. No hay persona real, así que no
   * hay consentimiento que pedir. Sigue sin poder afirmar nada nuestro: usarla
   * solo donde la lectura sea atmosférica.
   */
  | "generada-ia-licenciada"
  /** Marketing tiene que confirmar procedencia y licencia antes de tocarla. */
  | "pendiente-confirmar-licencia"
  /** Persona real identificable: hace falta su autorización, no una licencia. */
  | "consentimiento"
  | "ambigua" // no se sabe con certeza qué tela es
  | "tipografia"; // lleva rótulo de marketing quemado en la imagen

/**
 * Qué se puede hacer con el material. Que una imagen esté licenciada no la
 * convierte en publicable en cualquier hueco: una imagen generada en un slot
 * que dice "nuestra planta" sigue siendo una afirmación falsa sobre la empresa.
 */
export type UsoPermitido = "bloqueado" | "solo-ambiente";

export interface MaterialBloqueado {
  origen: string;
  motivo: MotivoBloqueo;
  uso: UsoPermitido;
  nota: string;
}

/**
 * CÓMO SE DETERMINÓ QUÉ ES GENERADO
 *
 * Marketing produce el material y afirma tener las licencias; aquí solo llegan
 * los archivos. La distinción "generada" vs "fotografía de persona real" no se
 * dio por supuesta, se comprobó con dos señales que coinciden:
 *
 *  1. METADATOS. Todo lo fotográfico del pipeline de marketing conserva EXIF de
 *     cámara y rastro de Adobe: `Fotos_-10.jpg` (Canon EOS, captura 2023),
 *     `Tejeduria6.jpg` y `Post 16_2.jpg` (Sony, 2022), `FAME-*.jpg` (iPhone,
 *     2024). Los banners de familia no tienen EXIF, ni ICC, ni XMP —ninguno— y
 *     miden todos exactamente 4096 px de ancho, salida típica de generador.
 *
 *  2. ARTEFACTOS. Comprobados a resolución completa, no en miniatura:
 *     `POLIALGODÓN.jpg` tiene ojos de geometría distinta, dientes fundidos en
 *     una banda continua, trenza sin topología de mechón y figuras de fondo que
 *     se disuelven unas en otras; `TERRY.jpg`, dedos fusionados en ambos puños;
 *     `Mesa de trabajo 1-3.jpg`, una jaula de gimnasio con barras que no
 *     conectan y tatuajes sin trazo coherente.
 *
 * Las dos señales apuntan a lo mismo en todos los casos del grupo. Donde solo
 * hay una, o ninguna, el material se queda esperando a marketing.
 */
export const MATERIAL_NO_PUBLICABLE: MaterialBloqueado[] = [
  {
    origen:
      "POLIALGODÓN.jpg · MICROFIBRA.jpg · TEXTURIZADO.jpg · SPUN.jpg · TERRY.jpg · NUESTROS TEJIDOS.jpg",
    motivo: "generada-ia-licenciada",
    uso: "solo-ambiente",
    nota: "Banners apaisados de familia, 4096 px de ancho y sin un solo metadato. Generadas: no hay personas reales, así que no hay consentimiento que pedir. Pero tampoco documentan nada: NO pueden ir en un slot que diga 'nuestra planta', 'nuestros clientes' ni 'nuestro asesor'. Hoy no hay ningún hueco puramente atmosférico libre, así que siguen sin usar.",
  },
  {
    origen: "Mesa de trabajo 1*.jpg (5)",
    motivo: "generada-ia-licenciada",
    uso: "bloqueado",
    nota: "Exportados de mesa de trabajo de Illustrator, sujetos generados (verificado en 1-3). La licencia deja de ser el problema, pero siguen bloqueados por otra razón: los cinco llevan el rótulo de marketing quemado sobre el sujeto y centrado. No hay recorte que los limpie.",
  },
  {
    origen: "Fotos_-10.jpg",
    motivo: "consentimiento",
    uso: "bloqueado",
    nota: "NO es generada: lleva EXIF de Canon EOS con fecha de captura de 2023 y pipeline de Lightroom. Es una fotografía de una empleada real. Lo que falta aquí no es una licencia de stock —marketing puede tenerla y seguiría faltando—, sino la autorización de la persona para aparecer en la web.",
  },
  {
    origen: "Texturaa Fotos/Telas Editadas/*.jpg (27)",
    motivo: "pendiente-confirmar-licencia",
    uso: "bloqueado",
    nota: "Composiciones 1920x1080 sin metadatos, con modelos que parecen fotografía de stock real y no generada: anatomía plausible, desenfoque óptico, piel con textura. Una de ellas (Austria-Premium.jpg) muestra a un niño. Bloqueadas igualmente por el rótulo quemado, pero conviene que marketing confirme la procedencia por si alguien quiere reutilizar los modelos.",
  },
  {
    origen: "Texturaa Fotos/NUEVAS FOTOS/FAME-*.jpg (22)",
    motivo: "ambigua",
    uso: "bloqueado",
    nota: "Macros de tejido blanco sin etiqueta ni pista de lote. No se pueden atribuir a ninguna tela.",
  },
  {
    origen: "Texturaa Fotos · etiqueta RIBB SPUN (0,60 m)",
    motivo: "ambigua",
    uso: "bloqueado",
    nota: "Encaja igual con Ribb 20, Ribb 30 y Ribb 40. La etiqueta no lleva el número.",
  },
  {
    origen: "Texturaa Fotos · etiqueta RIBB poli-algodón (0,60 m) · Ribb.png",
    motivo: "ambigua",
    uso: "bloqueado",
    nota: "Encaja igual con Ribb 18 y Ribb 20/24. Misma ambigüedad que la ficha.",
  },
  {
    origen: "Texturaa Fotos/Telas Editadas/BUFF-ROMINA.jpg",
    motivo: "ambigua",
    uso: "bloqueado",
    nota: "El rótulo dice 'Buff Romina' sin sufijo; en catálogo hay Buff Romina 30 y Buff Romina Rev 30.",
  },
  {
    origen: "Tela Austria/",
    motivo: "ambigua",
    uso: "bloqueado",
    nota: "El nombre de carpeta no es fiable: dentro hay archivos de otro producto (Tela Frida). No se usa para Austria Premium 18.",
  },
  {
    origen: "Tela Lacoste/",
    motivo: "ambigua",
    uso: "bloqueado",
    nota: "Hay tres Lacoast de línea (20, Polo 20, Kratos 22) y la carpeta no dice cuál. Las tres se resolvieron por etiqueta desde otro lote.",
  },
];

