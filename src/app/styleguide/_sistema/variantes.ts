/**
 * EL SISTEMA APLICADO, escrito de otra forma. Ya no es una propuesta: lo usan
 * las doce rutas desde `src/components/ui/buttonVariants.ts`.
 *
 * ESPEJO ESTÁTICO, Y POR QUÉ EXISTE. El sistema real resuelve dos cosas en
 * tiempo de pintado que aquí hay que fijar a mano: el ESTADO —con `hover:` no
 * se pueden comparar reposo, hover, foco e inhabilitado en una misma pantalla,
 * y sin comparar no hay nada que medir— y la SUPERFICIE, que allí llega por
 * herencia de las variables `--sup-*` y aquí se escribe resuelta en sus dos
 * formas para poder ponerlas una al lado de la otra.
 *
 * Es duplicación consciente. Si tocas `buttonVariants.ts`, toca esto: la
 * columna «propuesta» de la styleguide deja de decir la verdad en silencio.
 *
 * CUATRO VARIANTES, NO MÁS. Ver `docs/inventario-botones-cta.md` para el
 * porqué de cada una; en resumen: antes había cinco tratamientos distintos
 * solo para "navegación interna" y ninguno para WhatsApp.
 */

export type Tono = "claro" | "oscuro";
export type Estado = "reposo" | "hover" | "foco" | "inhabilitado";
export type Variante = "solida" | "contorno" | "enlace" | "whatsapp";

/** Común a todo botón. Igual que hoy salvo el `gap`, que ahora sostiene iconos. */
export const BASE =
  "inline-flex items-center justify-center gap-2.25 whitespace-nowrap rounded-sm " +
  "font-sans text-base font-medium transition-[background-color,border-color,color,transform] " +
  "duration-220 ease-asentar";

/** Base del `enlace`: sin caja, subrayado que aparece. Hereda el gesto del `ghost` de hoy. */
const BASE_ENLACE =
  "inline-flex items-center gap-2.25 whitespace-nowrap rounded-none border-b " +
  "px-0.5 py-1.5 font-sans text-body-s font-medium " +
  "transition-[border-color,color] duration-220 ease-asentar";

const CAJA = "h-12 px-7.5 border";

/**
 * El anillo de foco NO puede seguir siendo `outline-brand`: sobre `paper` da
 * 2,53:1 y el mínimo no textual es 3:1. Pasa a tinta en claro y a papel en
 * oscuro —15,67:1 en ambos—, que es además lo único que funciona sobre
 * cualquiera de las dos superficies sin pensarlo.
 */
const FOCO_CLARO = "outline outline-2 outline-offset-2 outline-ink";
const FOCO_OSCURO = "outline outline-2 outline-offset-2 outline-paper";

/**
 * Inhabilitado deja de ser `opacity-40`. WCAG exime a los controles inactivos
 * de los mínimos de contraste, pero "exento" no es lo mismo que "utilizable":
 * hoy el primario inhabilitado se queda en 1,45:1 —el `opacity` funde el texto
 * `paper` contra la página `paper`, así que la etiqueta casi desaparece—.
 * Se sustituye por un plano
 * muerto —sin color de marca— que se sigue leyendo: 4,75:1 en claro y 5,92:1
 * en oscuro. El texto oscuro va a /60 y no a /50 porque sobre el propio velo
 * de la caja el /50 caía a 4,20:1.
 */
const INHAB_CLARO = `${CAJA} border-greige bg-bone text-graphite`;
const INHAB_OSCURO = `${CAJA} border-paper/20 bg-paper/10 text-paper/60`;

// El verde y el glifo son de WhatsApp, marca ajena: no entran en globals.css.
// Es la misma decisión (y el mismo motivo) que ya documenta BotonWhatsApp.tsx.
// eslint-disable-next-line no-restricted-syntax -- teal de cabecera de WhatsApp Web
const VERDE = "bg-[#008069]";
// eslint-disable-next-line no-restricted-syntax -- Teal Green Dark de WhatsApp
const VERDE_HOVER = "bg-[#075E54]";

export const PROPUESTA: Record<Variante, Record<Tono, Record<Estado, string>>> = {
  /**
   * SÓLIDA — TIENE DOS FORMAS, NO UNA. Es lo último que se decidió, y se
   * decidió mirándola sobre las cuatro superficies de la portada.
   *
   * Sobre claro: relleno de TINTA con texto papel — 14,41:1 sobre hueso.
   * Sobre oscuro se da la vuelta: relleno CLARO con texto tinta, porque la
   * tinta sobre una banda oscura da 1,15:1 y el botón desaparece.
   *
   * No es una variante nueva ni dos: es la misma leyendo `--sup-tinta` y
   * `--sup-papel`, que son las dos caras de la superficie. Por eso el hover no
   * necesita colores propios — invierte la polaridad intercambiándolas, y eso
   * vale igual en claro que en oscuro.
   *
   * El azul de marca se descartó como relleno: contra `paper` da 2,56:1 y
   * contra el píxel claro de una foto de hero 1,71:1, así que necesitaba filete
   * sí o sí. El azul queda para lo que dice `globals.css` que es —logo y
   * énfasis— y el relleno pasa a ser acromático.
   */
  solida: {
    claro: {
      reposo: `${CAJA} border-ink bg-ink text-paper`,
      hover: `${CAJA} border-ink bg-paper text-ink -translate-y-0.5`,
      foco: `${CAJA} border-ink bg-ink text-paper ${FOCO_CLARO}`,
      inhabilitado: INHAB_CLARO,
    },
    oscuro: {
      reposo: `${CAJA} border-paper bg-paper text-ink`,
      hover: `${CAJA} border-paper bg-ink text-paper -translate-y-0.5`,
      foco: `${CAJA} border-paper bg-paper text-ink ${FOCO_OSCURO}`,
      inhabilitado: INHAB_OSCURO,
    },
  },

  /**
   * CONTORNO — el caballo de batalla. Es lo que hoy es `secondary`, pero
   * arreglado y con versión oscura, que hoy NO EXISTE: `secondary` es
   * `text-ink` y sobre `ink` da 1:1. Por eso ningún hero usa `secondary` y
   * todos acaban tirando del azul.
   *
   * El borde pasa de `greige` a `graphite`: greige contra paper da 1,59:1 y en
   * un botón sin relleno el borde ES el botón. Con graphite son 5,15:1.
   */
  contorno: {
    claro: {
      reposo: `${CAJA} border-graphite text-ink`,
      hover: `${CAJA} border-ink bg-bone text-ink -translate-y-0.5`,
      foco: `${CAJA} border-graphite text-ink ${FOCO_CLARO}`,
      inhabilitado: `${CAJA} border-greige text-graphite`,
    },
    oscuro: {
      reposo: `${CAJA} border-paper/50 text-paper`,
      hover: `${CAJA} border-paper bg-paper/10 text-paper -translate-y-0.5`,
      foco: `${CAJA} border-paper/50 text-paper ${FOCO_OSCURO}`,
      inhabilitado: `${CAJA} border-paper/20 text-paper/50`,
    },
  },

  /**
   * ENLACE — terciario, dentro del flujo de lectura. Absorbe el `ghost` de hoy
   * y también los enlaces de texto escritos a mano que hacen de CTA (el
   * `secondaryCta` que tenía el hero, los "Ver ficha →" de las tarjetas). Ese mismo
   * gesto está implementado de tres formas distintas.
   *
   * El hover NO vuelve a `text-brand`: sobre claro da 2,53:1. Se marca con el
   * subrayado, que ya es el gesto del `ghost`.
   */
  enlace: {
    claro: {
      reposo: `${BASE_ENLACE} border-transparent text-ink`,
      hover: `${BASE_ENLACE} border-ink text-ink`,
      foco: `${BASE_ENLACE} border-transparent text-ink ${FOCO_CLARO}`,
      inhabilitado: `${BASE_ENLACE} border-transparent text-graphite`,
    },
    oscuro: {
      reposo: `${BASE_ENLACE} border-transparent text-paper`,
      hover: `${BASE_ENLACE} border-paper text-paper`,
      foco: `${BASE_ENLACE} border-transparent text-paper ${FOCO_OSCURO}`,
      inhabilitado: `${BASE_ENLACE} border-transparent text-paper/50`,
    },
  },

  /**
   * WHATSAPP — la única variante nueva de verdad.
   *
   * Existe porque el destino cambia de canal: se sale de la web a una
   * conversación. Hoy eso está señalado con un icono flotante y con tres
   * enlaces mono de 13px escondidos entre el teléfono y el correo.
   *
   * Verde #008069 con glifo BLANCO. De los siete verdes medidos de la paleta de
   * WhatsApp es el único que cumple las cuatro condiciones a la vez: 4,89:1
   * contra el glifo, 4,38:1 contra `paper` y 3,57:1 contra `ink`. Eso último es
   * lo que le permite ir SIN FILETE sobre las dos superficies. El hover usa
   * #075E54 (Teal Green Dark), también suyo y más profundo.
   *
   * ES LA ÚNICA QUE NO SE ADAPTA A LA SUPERFICIE, a propósito: el verde
   * identifica el canal, y si cambiara con el fondo dejaría de identificarlo.
   */
  whatsapp: {
    claro: {
      reposo: `${CAJA} border-transparent ${VERDE} text-white`,
      hover: `${CAJA} border-transparent ${VERDE_HOVER} text-white -translate-y-0.5`,
      foco: `${CAJA} border-transparent ${VERDE} text-white ${FOCO_CLARO}`,
      inhabilitado: INHAB_CLARO,
    },
    oscuro: {
      reposo: `${CAJA} border-transparent ${VERDE} text-white`,
      hover: `${CAJA} border-transparent ${VERDE_HOVER} text-white -translate-y-0.5`,
      foco: `${CAJA} border-transparent ${VERDE} text-white ${FOCO_OSCURO}`,
      inhabilitado: INHAB_OSCURO,
    },
  },
};

/** Lo que hay HOY, para poder ponerlo al lado. Salido de `buttonVariants.ts`. */
export const HOY: Record<string, Record<Tono, Record<Estado, string>>> = {
  primary: {
    claro: {
      reposo: "h-12 px-7.5 bg-brand text-paper",
      hover: "h-12 px-7.5 bg-brand-deep text-paper -translate-y-0.5",
      foco: "h-12 px-7.5 bg-brand text-paper outline outline-2 outline-offset-2 outline-brand",
      inhabilitado: "h-12 px-7.5 bg-brand text-paper opacity-40",
    },
    // `buttonVariants` no tiene eje claro/oscuro: sobre un hero se pintan las
    // MISMAS clases. Esta columna no es una variante distinta, es la de al lado
    // puesta encima de tinta.
    oscuro: {
      reposo: "h-12 px-7.5 bg-brand text-paper",
      hover: "h-12 px-7.5 bg-brand-deep text-paper -translate-y-0.5",
      foco: "h-12 px-7.5 bg-brand text-paper outline outline-2 outline-offset-2 outline-brand",
      inhabilitado: "h-12 px-7.5 bg-brand text-paper opacity-40",
    },
  },
  secondary: {
    claro: {
      reposo: "h-12 px-7.5 border border-greige text-ink",
      hover: "h-12 px-7.5 border border-ink bg-bone text-ink",
      foco: "h-12 px-7.5 border border-greige text-ink outline outline-2 outline-offset-2 outline-brand",
      inhabilitado: "h-12 px-7.5 border border-greige text-ink opacity-40",
    },
    oscuro: {
      reposo: "h-12 px-7.5 border border-greige text-ink",
      hover: "h-12 px-7.5 border border-ink bg-bone text-ink",
      foco: "h-12 px-7.5 border border-greige text-ink outline outline-2 outline-offset-2 outline-brand",
      inhabilitado: "h-12 px-7.5 border border-greige text-ink opacity-40",
    },
  },
  ghost: {
    claro: {
      reposo: `${BASE_ENLACE} border-transparent text-ink`,
      hover: `${BASE_ENLACE} border-ink text-ink`,
      foco: `${BASE_ENLACE} border-transparent text-ink outline outline-2 outline-offset-2 outline-brand`,
      inhabilitado: `${BASE_ENLACE} border-transparent text-ink opacity-40`,
    },
    oscuro: {
      reposo: `${BASE_ENLACE} border-transparent text-ink`,
      hover: `${BASE_ENLACE} border-ink text-ink`,
      foco: `${BASE_ENLACE} border-transparent text-ink outline outline-2 outline-offset-2 outline-brand`,
      inhabilitado: `${BASE_ENLACE} border-transparent text-ink opacity-40`,
    },
  },
  /** El `secondaryCta` que tenía el hero y los "Ver ficha →": escritos a mano, sin variante. */
  enlaceTexto: {
    claro: {
      reposo: "font-sans text-body-s font-medium text-ink",
      hover: "font-sans text-body-s font-medium text-brand",
      foco: "font-sans text-body-s font-medium text-ink outline outline-2 outline-offset-2 outline-brand",
      inhabilitado: "font-sans text-body-s font-medium text-ink opacity-40",
    },
    oscuro: {
      reposo: "font-sans text-body-s font-medium text-paper",
      hover: "font-sans text-body-s font-medium text-brand",
      foco: "font-sans text-body-s font-medium text-paper outline outline-2 outline-offset-2 outline-brand",
      inhabilitado: "font-sans text-body-s font-medium text-paper opacity-40",
    },
  },
};

/**
 * LOS TRES VERDES A COMPARAR.
 *
 * Ninguno inventado: los siete candidatos medidos salen de la paleta de
 * WhatsApp. Con glifo BLANCO —que es lo que hace que el botón se reconozca sin
 * leer— hay que cumplir cuatro condiciones a la vez, y solo una las cumple:
 *
 *   verde      blanco  vs paper  vs ink   de dónde sale
 *   #25D366     1,98     1,78     8,82    primario, el que usa el sitio hoy
 *   #1DA851     3,10     2,78     5,64    hover, ya en BotonWhatsApp.tsx
 *   #00A884     3,03     2,71     5,77    teal del interfaz actual
 *   #008069     4,89     4,38     3,57    cabecera de WhatsApp Web / Business
 *   #128C7E     4,14     3,71     4,23    Teal Green, paleta clásica
 *   #075E54     7,67     6,87     2,28    Teal Green Dark, paleta clásica
 *   #005C4B     7,98     7,15     2,19    burbuja saliente en modo oscuro
 *
 * Los dos más profundos dan un blanco magnífico, pero contra `ink` caen a
 * 2,2-2,3:1: sobre la banda oscura de un hero el botón dejaría de tener límite
 * y habría que ponerle filete. `#008069` es el único que pasa las cuatro.
 */
type OpcionVerde = {
  hex: string;
  relleno: string;
  texto: string;
  /** Filete solo si el relleno no se separa por sí solo de la página clara. */
  bordeClaro: string;
  origen: string;
};

export const VERDES: Record<"hoy" | "tinta" | "profundo", OpcionVerde> = {
  hoy: {
    hex: "#25D366",
    // eslint-disable-next-line no-restricted-syntax -- verde oficial de WhatsApp
    relleno: "bg-[#25D366]",
    texto: "text-white",
    bordeClaro: "border border-transparent",
    origen: "Verde primario de WhatsApp. Lo que está publicado.",
  },
  tinta: {
    hex: "#25D366",
    // eslint-disable-next-line no-restricted-syntax -- verde oficial de WhatsApp
    relleno: "bg-[#25D366]",
    texto: "text-ink",
    bordeClaro: "border border-ink",
    origen: "El mismo verde primario, con el glifo en tinta.",
  },
  profundo: {
    hex: "#008069",
    // eslint-disable-next-line no-restricted-syntax -- teal de cabecera de WhatsApp Web
    relleno: "bg-[#008069]",
    texto: "text-white",
    bordeClaro: "border border-transparent",
    origen: "Teal de la cabecera de WhatsApp Web y WhatsApp Business.",
  },
};

/** Caja del flotante, sin el color: lo pone cada opción. */
export const FLOTANTE_CAJA =
  "flex size-14 items-center justify-center rounded-md shadow-[0_4px_20px_rgba(28,25,23,0.22)]";
