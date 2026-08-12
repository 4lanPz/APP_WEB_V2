/**
 * LAS CINCO ETAPAS DE «EL TALLER POR DENTRO» — FUENTE ÚNICA.
 *
 * El recorrido que sigue la tela dentro de la planta, en el orden en que lo
 * sigue: desarrollo de color → tejido → tintura → control de calidad → envío.
 *
 * VIVE AQUÍ Y NO EN LA PÁGINA POR EL MISMO MOTIVO QUE `hitos.ts`: la lista la
 * necesitan DOS consumidores —el riel que la pinta (`RielDeEtapas`) y el
 * registro de slots, que deriva de ella el hueco de fotografía de cada etapa—.
 * Escrita dos veces, las dos copias divergen y el encargo de fotografía acaba
 * pidiendo una foto que la página no enseña; ya pasó con los hitos, donde dos
 * entradas del registro se llamaban las dos «Apertura de local».
 *
 * EL NÚMERO DE ETAPA NO ESTÁ ESCRITO. Sale de la posición en este array, igual
 * que los índices de sección salen de `numerador()`: reordenar el recorrido
 * renumera el riel y los rótulos sin tocar ni una cifra.
 *
 * TRES DE LOS CINCO SLOTS YA EXISTÍAN. `oficio-carta-color`, `oficio-nave-tejido`
 * y `oficio-tintoreria` son los huecos que alimentaban el mosaico de tres fotos
 * que había antes en esta sección, y describen exactamente las etapas 01, 02 y
 * 03. Se REUTILIZAN en vez de abrir ids nuevos: `oficio-nave-tejido` ya tiene
 * foto real del cliente y darle un nombre nuevo la dejaría huérfana, y los otros
 * dos ya están en el encargo de marketing pidiendo esa misma toma. Lo que sí
 * cambia es su especificación —ahora se ven a foto grande, no a media columna—,
 * y eso viaja en la `nota` de aquí abajo.
 */

export interface EtapaTaller {
  /**
   * Id del slot de su fotografía = nombre del archivo a dejar en `entrega/`.
   * Escrito literal y no compuesto: el chequeo de slots sin cablear de
   * `procesar-entrega.ts` busca el id literal dentro de `src/`.
   */
  slot: string;
  /**
   * Rótulo del riel. Es un control de cinco columnas, así que manda que quepa:
   * dos palabras como mucho.
   */
  riel: string;
  /** Dónde ocurre la etapa. Va en el eyebrow mono sobre la fotografía. */
  lugar: string;
  /** Titular de la etapa, sobre la fotografía. Lo que la etapa AFIRMA. */
  titulo: string;
  /** La frase que sostiene esa afirmación. */
  texto: string;
  /** Alt de la foto: lo que el hueco DEBE contener, no lo que contiene. */
  alt: string;
  /** Qué se espera ver, para quien dispara la foto. */
  nota: string;
}

/**
 * Parte común del encargo de las cinco. Escrita una vez: son cinco tomas del
 * mismo montaje —la planta trabajando, a foto grande y con rótulo encima— y
 * cinco copias del mismo párrafo son cinco sitios donde corregir el día que el
 * riel cambie de formato.
 *
 * Formato leído de `RielDeEtapas.tsx`: marco a todo el ancho del contenedor
 * normal (hasta ~1038 px a 1440) con alto propio de 360/480/560 px, y el bloque
 * de texto superpuesto abajo sobre un degradado que llega a `brand-deep` al 90%.
 */
const NOTA_ETAPA =
  "Apaisada y GRANDE: se ve a todo el ancho del contenedor —hasta ~1038 px a " +
  "1440— con 360 px de alto en móvil y hasta 560 en escritorio, así que el " +
  "marco es casi 2:1 y se recorta con `object-cover`. Documental de planta: " +
  "material y gente reales en su puesto, sin posado de estudio ni rótulos " +
  "quemados. EL TERCIO INFERIOR SE OSCURECE —encima van el rótulo de etapa, el " +
  "titular y una línea de texto sobre un degradado que llega al 90%—, así que " +
  "ahí no puede caer detalle importante. La foto es la única que se ve de esta " +
  "etapa: si no se lee qué se está haciendo, la etapa no se sostiene.";

export const ETAPAS_TALLER: EtapaTaller[] = [
  {
    slot: "oficio-carta-color",
    riel: "Desarrollo de color",
    lugar: "Laboratorio de color",
    titulo: "El color se aprueba antes de tejer",
    texto:
      "Carta física, referencia registrada por cliente y receta guardada: así el segundo pedido sale igual al primero.",
    alt: "Carta de color de Textil Padilla: muestras de tela teñidas ordenadas por tono.",
    nota: `${NOTA_ETAPA} Muestrario físico de colores con la carta abierta, y a ser posible las manos comparando una referencia contra ella: lo que se enseña es el momento en que el color se aprueba, no el mueble donde se guarda.`,
  },
  {
    slot: "oficio-nave-tejido",
    riel: "Tejido",
    lugar: "Nave de tejido · Alangasí",
    titulo: "La estructura se decide en el telar",
    texto:
      "Punto jersey, piqué y microfibra tejidos en casa, con galga y gramaje fijados por ficha.",
    alt: "Nave de tejido de Textil Padilla: fileta de conos de hilo blanco alineados frente a máquinas de tejido circular.",
    nota: `${NOTA_ETAPA} Telar circular en operación con el hilo entrando, o la fileta de conos frente a las máquinas. Tiene que leerse que están en marcha.`,
  },
  {
    slot: "oficio-tintoreria",
    riel: "Tintura",
    lugar: "Tintorería propia",
    titulo: "Teñido a demanda, al color exacto",
    texto:
      "Sin stock de colores: se tiñe lo que se pide, con solidez verificada antes de salir del baño.",
    alt: "Tintorería de Textil Padilla: barcas de teñido en proceso.",
    nota: `${NOTA_ETAPA} Área de tintorería en marcha —tela en el baño de color, vapor—. Es la que sostiene el argumento del teñido a demanda, que es el argumento central de la empresa: sin ella la etapa se queda en una afirmación.`,
  },
  {
    slot: "oficio-control-calidad",
    riel: "Control de calidad",
    lugar: "Ficha por rollo",
    titulo: "Nada sale sin medirse",
    texto:
      "Gramaje, encogimiento y solidez de color documentados rollo por rollo, con tolerancia declarada.",
    alt: "Control de calidad en Textil Padilla: manos midiendo el gramaje de la tela sobre la mesa de revisión.",
    nota: `${NOTA_ETAPA} Manos midiendo sobre la tela —cortador de gramaje, balanza, mesa de revisión al trasluz—. El INSTRUMENTO tiene que verse: es lo que distingue esta etapa de «alguien mirando tela».`,
  },
  {
    slot: "oficio-despacho",
    riel: "Envío",
    lugar: "Despacho",
    titulo: "Etiquetado, embalado y a ruta",
    texto:
      "Cada rollo sale con su etiqueta de lote: el taller sabe qué recibió y nosotros qué enviamos.",
    alt: "Zona de despacho de Textil Padilla: rollos de tela etiquetados y embalados, preparados para salir a ruta.",
    nota: `${NOTA_ETAPA} Rollos etiquetados en la zona de despacho. La ETIQUETA DE LOTE tiene que leerse como etiqueta —no hace falta que se lea el número—, porque es lo que la frase afirma. Sin marcas ni logotipos de terceros identificables: al cliente no se le nombra.`,
  },
];

/**
 * El número de una etapa, con cero delante. Sale de la posición y no de un
 * campo: ver la nota de cabecera.
 */
export function numeroDeEtapa(indice: number): string {
  return String(indice + 1).padStart(2, "0");
}
