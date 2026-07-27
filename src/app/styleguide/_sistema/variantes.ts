/**
 * PROPUESTA de sistema de botones. Vive dentro de `/styleguide` a propósito:
 * todavía NO la usa ninguna página del sitio. Cuando se apruebe, esto se
 * mueve a `src/components/ui/` y `buttonVariants.ts` pasa a leer de aquí.
 *
 * Las clases van como datos y no como `cva` porque el styleguide necesita
 * pintar cada estado —reposo, hover, foco, inhabilitado— de forma ESTÁTICA,
 * uno al lado del otro. Con `hover:` no se pueden comparar cuatro estados en
 * una misma pantalla, y sin comparar no hay decisión que tomar.
 *
 * CUATRO VARIANTES, NO MÁS. Ver `docs/inventario-botones-cta.md` para el
 * porqué de cada una; en resumen: hoy hay cinco tratamientos distintos solo
 * para "navegación interna" y ninguno para WhatsApp.
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
// eslint-disable-next-line no-restricted-syntax -- verde oficial de WhatsApp
const VERDE = "bg-[#25D366]";
// eslint-disable-next-line no-restricted-syntax -- verde hover oficial de WhatsApp
const VERDE_HOVER = "bg-[#1DA851]";

export const PROPUESTA: Record<Variante, Record<Tono, Record<Estado, string>>> = {
  /**
   * SÓLIDA — relleno de color con texto OSCURO.
   *
   * El giro respecto a hoy: `text-ink` en vez de `text-paper`. Sobre el azul de
   * marca eso pasa de 2,56:1 a 6,11:1. El azul es un color claro; solo admite
   * texto oscuro, igual que el verde de WhatsApp.
   *
   * En claro lleva filete de tinta porque el relleno azul contra `paper` da
   * 2,56:1 y el límite de un control pide 3:1: sin el filete el botón no tiene
   * borde reconocible. Sobre `ink` no hace falta: el propio relleno da 6,11:1.
   *
   * El hover invierte la polaridad (fondo oscuro, texto claro) en claro, y la
   * enciende en oscuro. Es el punto que más conviene mirar con el ojo.
   */
  solida: {
    claro: {
      reposo: `${CAJA} border-ink bg-brand text-ink`,
      hover: `${CAJA} border-ink bg-brand-deep text-paper -translate-y-0.5`,
      foco: `${CAJA} border-ink bg-brand text-ink ${FOCO_CLARO}`,
      inhabilitado: INHAB_CLARO,
    },
    oscuro: {
      reposo: `${CAJA} border-transparent bg-brand text-ink`,
      hover: `${CAJA} border-transparent bg-paper text-ink -translate-y-0.5`,
      foco: `${CAJA} border-transparent bg-brand text-ink ${FOCO_OSCURO}`,
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
   * `secondaryCta` del hero, los "Ver ficha →" de las tarjetas). Hoy ese mismo
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
   * Texto en tinta, no en blanco. El blanco sobre #25D366 da 1,98:1 —el
   * flotante actual ya no cumple ni el mínimo no textual de 3:1—. Con tinta son
   * 8,82:1. El hover usa el verde oscuro oficial, también con tinta (5,64:1).
   */
  whatsapp: {
    claro: {
      reposo: `${CAJA} border-ink ${VERDE} text-ink`,
      hover: `${CAJA} border-ink ${VERDE_HOVER} text-ink -translate-y-0.5`,
      foco: `${CAJA} border-ink ${VERDE} text-ink ${FOCO_CLARO}`,
      inhabilitado: INHAB_CLARO,
    },
    oscuro: {
      reposo: `${CAJA} border-transparent ${VERDE} text-ink`,
      hover: `${CAJA} border-transparent ${VERDE_HOVER} text-ink -translate-y-0.5`,
      foco: `${CAJA} border-transparent ${VERDE} text-ink ${FOCO_OSCURO}`,
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
  /** El `secondaryCta` del hero y los "Ver ficha →": escritos a mano, sin variante. */
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

/** Flotante de WhatsApp tal cual está publicado hoy, para medirlo al lado. */
export const FLOTANTE_HOY =
  // eslint-disable-next-line no-restricted-syntax -- verde oficial de WhatsApp
  "flex size-14 items-center justify-center rounded-md bg-[#25D366] text-white";

/** El mismo flotante con el glifo en tinta. */
export const FLOTANTE_PROPUESTO =
  // eslint-disable-next-line no-restricted-syntax -- verde oficial de WhatsApp
  "flex size-14 items-center justify-center rounded-md bg-[#25D366] text-ink";
