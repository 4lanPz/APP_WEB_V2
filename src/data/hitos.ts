/**
 * LA VIDA DE TEXTIL PADILLA — los nueve hitos, en un solo sitio.
 *
 * POR QUÉ EXISTE ESTE ARCHIVO. El año y el título de cada hito estaban escritos
 * DOS veces: en `empresa/page.tsx` (lo que ve el visitante) y en `SLOTS_HITOS`
 * de `slots-imagen.ts` (lo que lee marketing en el documento de fotografía). Las
 * dos copias ya habían divergido: cinco hitos llevaban año en el registro y
 * cuatro no, y dos de esos cuatro se llamaban los dos «Apertura de local», así
 * que el encargo pedía dos fotos indistinguibles. Con una sola fuente eso no
 * puede repetirse — el rótulo del registro se DERIVA de estos campos.
 *
 * EL AÑO ES EL IDENTIFICADOR, y por eso vive aquí arriba. Los `ref` (FND-01,
 * LOC-03…) siguen existiendo porque son la clave estable del slot de imagen
 * —`hito-loc-03` es el nombre del archivo que hay que entregar—, pero YA NO SE
 * PINTAN: un código interno no le dice nada al visitante y le estaba quitando
 * el sitio al dato que sí identifica el hito.
 */

export interface Hito {
  /** Año, y el identificador visible del hito. */
  year: string;
  /**
   * Código interno. NO se pinta: es la clave del slot de imagen (`hito-fnd-01`)
   * y lo que mantiene estable el nombre del archivo a entregar aunque el año o
   * el título cambien.
   */
  ref: string;
  title: string;
  description: string;
  /** Punto mayor en la línea: el hito que cambia lo que la empresa hace. */
  featured?: boolean;
  /**
   * El año no está confirmado por administración.
   *
   * ES UNA NOTA INTERNA Y NO SE PINTA EN LA WEB. Viaja al registro de slots
   * como `porConfirmar` —de ahí a los dos documentos de fotografía, que es
   * quien necesita saberlo antes de montar una sesión de archivo— y a nada más.
   * Al visitante la sección ya le avisa entera con su `DraftNotice`; marcar
   * cuatro fechas de nueve una a una no le aporta un dato, le siembra una duda
   * sobre las otras cinco.
   */
  anoPorConfirmar?: boolean;
}

export const HITOS: Hito[] = [
  {
    year: "1987",
    ref: "FND-01",
    title: "Fundación en Alangasí",
    description:
      "Nace el taller familiar en Alangasí, valle de los Chillos: punto tejido para la confección local. Se fija el principio fundacional —seleccionar el mejor hilo, no hilar.",
  },
  {
    year: "1994",
    ref: "LOC-01",
    title: "Consolidación de la matriz",
    description:
      "La planta de Alangasí se establece como matriz de producción: nave de tejido, bodega de hilo y primeros controles sistemáticos de gramaje por rollo.",
  },
  {
    year: "1999",
    ref: "PRD-01",
    title: "Teñido a demanda",
    description:
      "Se incorpora la tintorería propia y el teñido al color exacto del cliente, con referencias registradas para reproducir el tono entre tiradas.",
    featured: true,
  },
  {
    year: "2003",
    ref: "LOC-02",
    title: "Apertura de local · La Marín",
    description:
      "Primer punto de venta y atención en el centro de Quito (La Marín), acercando el muestrario físico a talleres y confeccionistas de la ciudad.",
  },
  {
    year: "2008",
    ref: "LOC-03",
    title: "Apertura de local · Solanda",
    description:
      "Nuevo local en el sur de Quito (Solanda) para dar cobertura a la creciente demanda de barrios productores de confección.",
  },
  {
    year: "2013",
    ref: "LOC-04",
    title: "Apertura de local · Sangolquí",
    description:
      "Punto de venta en Sangolquí, reforzando la presencia en el valle de los Chillos, cerca de la matriz.",
    anoPorConfirmar: true,
  },
  {
    year: "2017",
    ref: "LOC-05",
    title: "Apertura de local · Guayaquil",
    description:
      "Primer local en la costa (Guayaquil), abriendo distribución hacia marcas y retail del litoral.",
    anoPorConfirmar: true,
  },
  {
    year: "2021",
    ref: "QLT-01",
    title: "Protocolo de control por rollo",
    description:
      "Se formaliza la ficha técnica por rollo: gramaje, encogimiento y solidez de color documentados, con tolerancia de tono ΔE ≤ 4 entre tiradas.",
    anoPorConfirmar: true,
  },
  {
    year: "2024",
    ref: "PRD-02",
    title: "Línea técnica PerformKnit",
    description:
      "Presentación de tejidos técnicos de alto gramaje para uniformidad y contract, con color constante y rendimiento comprobado.",
    anoPorConfirmar: true,
  },
];

/** Id del slot de imagen de un hito. La regla, escrita una vez. */
export function slotDeHito(ref: string): string {
  return `hito-${ref.toLowerCase()}`;
}

/**
 * Rótulo del hito en los documentos INTERNOS (registro de slots, encargo de
 * fotografía). Lleva el año delante porque en una lista de nueve archivos el
 * título solo no basta: hay cinco «Apertura de local» y sin el año dos de ellas
 * son la misma línea repetida.
 */
export function rotuloDeHito(h: Hito): string {
  return `${h.year} · ${h.title}`;
}
