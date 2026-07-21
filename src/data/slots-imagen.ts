/**
 * REGISTRO DE SLOTS DE IMAGEN — fuente de verdad de los nombres de archivo.
 *
 * Cada hueco de imagen del sitio tiene aquí un `id`, y ese id ES el nombre del
 * archivo que hay que dejar en `entrega/`. No hay tabla de equivalencias que
 * mantener sincronizada: si el slot se llama `oficio-tintoreria`, el archivo se
 * llama `oficio-tintoreria.jpg` y no hay otra forma de acertar.
 *
 * Para las telas el id es directamente el slug de la subcategoría, así que la
 * lista se deriva de `taxonomy.ts` y nunca se queda corta: añadir una tela al
 * catálogo crea su slot automáticamente.
 *
 * Flujo completo en `README-imagenes.md`.
 */

import { categories } from "./taxonomy";

export interface SlotImagen {
  /** Id del slot = nombre del archivo a dejar en `entrega/`, sin extensión. */
  id: string;
  /** Ruta pública del WebP que genera el procesado. */
  destino: string;
  /**
   * Alt en español. Describe lo que el slot DEBE contener, no lo que contiene:
   * está escrito antes de que exista la foto. Si al llenarlo la imagen no
   * corresponde, se corrige aquí — no se deja un alt que miente.
   */
  alt: string;
  /** Agrupación para `/admin/imagenes`. */
  grupo: string;
  /** Ancho máximo de salida en px. */
  ancho: number;
  /** Qué se espera ver, para el que dispara la foto. */
  nota?: string;
}

/**
 * Slots únicos: uno por hueco concreto de una página. Los ids de los seis
 * primeros son los que ya usaban las páginas; no se renombran para no tocar
 * código que funciona.
 */
export const SLOTS_UNICOS: SlotImagen[] = [
  {
    id: "macro-fibra-blanca",
    destino: "/macros/fibra-blanca.webp",
    alt: "Detalle de tejido de poliéster blanco enrollado en espiral, mostrando la trama y la caída del género.",
    grupo: "Home",
    ancho: 1920,
    nota: "Macro de tejido claro, apaisada. Es la primera imagen de la portada.",
  },
  {
    id: "macro-tejido",
    destino: "/macros/tejido.webp",
    alt: "Macrofotografía de tejido de punto azul, con la estructura del piqué visible en los pliegues.",
    grupo: "Productos",
    ancho: 1920,
  },
  {
    id: "macro-punto-camiseta",
    destino: "/macros/punto-camiseta.webp",
    alt: "Detalle de tejido de punto celeste dispuesto en espiral, mostrando el brillo y la elasticidad del género.",
    grupo: "Camisetas",
    ancho: 1920,
  },
  {
    id: "camisetas-jersey",
    destino: "/macros/jersey-peinado.webp",
    alt: "Macrofotografía de jersey de algodón peinado, con el punto liso visible de cerca.",
    grupo: "Camisetas",
    ancho: 1280,
    nota: "Macro real de single jersey. Acompaña a la ficha de la tela 01.",
  },
  {
    id: "camisetas-pique",
    destino: "/macros/pique.webp",
    alt: "Macrofotografía de piqué, con las celdas en relieve tipo panal.",
    grupo: "Camisetas",
    ancho: 1280,
    nota: "Macro real de piqué. Acompaña a la ficha de la tela 02.",
  },
  {
    id: "oficio-nave-tejido",
    destino: "/oficio/nave-tejido.webp",
    alt: "Nave de tejido de Textil Padilla: fileta de conos de hilo blanco alineados frente a máquinas de tejido circular.",
    grupo: "Empresa · Oficio",
    ancho: 1920,
  },
  {
    id: "oficio-taller-alangasi",
    destino: "/oficio/taller-alangasi.webp",
    alt: "Rollos de tela terminados y embalados con el logotipo de Textil Padilla, apilados en bodega.",
    grupo: "Empresa · Oficio",
    ancho: 1200,
    nota: "Vertical (4:5).",
  },
  {
    id: "oficio-tintoreria",
    destino: "/oficio/tintoreria.webp",
    alt: "Tintorería de Textil Padilla: barcas de teñido en proceso.",
    grupo: "Empresa · Oficio",
    ancho: 1600,
    nota: "Área de tintorería en marcha. Apaisada (4:3). Es la que sostiene el argumento del teñido a demanda.",
  },
  {
    id: "oficio-carta-color",
    destino: "/oficio/carta-color.webp",
    alt: "Carta de color de Textil Padilla: muestras de tela teñidas ordenadas por tono.",
    grupo: "Empresa · Oficio",
    ancho: 1600,
    nota: "Muestrario físico de colores. Apaisada (4:3).",
  },
  {
    id: "local-fachada",
    destino: "/locales/fachada.webp",
    alt: "Fachada de Textil Padilla e Hijos con su rótulo azul, y un camión de reparto en la entrada.",
    grupo: "Contacto",
    ancho: 1920,
  },
  {
    id: "retrato-asesor",
    destino: "/oficio/asesor.webp",
    alt: "Asesor comercial de Textil Padilla atendiendo en el mostrador, con muestrario de telas.",
    grupo: "Contacto",
    ancho: 1280,
    nota: "Retrato de una persona real del equipo. Requiere su autorización para salir en la web.",
  },
  {
    id: "dortmund-plus-cancha",
    destino: "/telas/dortmund-plus-cancha.webp",
    alt: "Prenda deportiva confeccionada en Dortmund Plus, en uso durante un partido.",
    grupo: "Microfibra · Dortmund Plus",
    ancho: 1600,
    nota: "Prenda hecha con la tela, en uso. Sin rótulos ni tipografía quemada.",
  },
  {
    id: "dortmund-plus-blancos-macro",
    destino: "/telas/dortmund-plus-blancos-macro.webp",
    alt: "Macrofotografía de la microfibra Dortmund Plus en blanco, con la textura del punto a contraluz.",
    grupo: "Microfibra · Dortmund Plus",
    ancho: 1920,
    nota: "Macro de textura, muy apaisada (21:9).",
  },

  /**
   * Fondos fotográficos de cabecera, uno por página con hero.
   *
   * Van todos al MISMO grupo a propósito. Repartidos por página quedaban en
   * ocho grupos de un solo slot, perdidos entre los 87 huecos de
   * `/admin/imagenes`, y esa página es la lista de tareas: si un hueco no se
   * encuentra, no se llena.
   *
   * El diseño aprobado no llevaba foto aquí —su fondo es la trama CSS a
   * propósito—, así que mientras el slot esté vacío el hero se ve exactamente
   * igual que siempre. Tenerlos registrados no cuesta nada.
   *
   * Requisitos comunes, y por eso se repiten en cada `nota`: tono BAJO y sin
   * detalle importante en el tercio izquierdo, que es donde cae el titular. Muy
   * apaisadas — se recortan a 70vh de alto.
   */
  ...(
    [
      ["empresa", "/empresa", "Planta de Textil Padilla en Alangasí: vista general de la nave de producción."],
      ["contacto", "/contacto", "Mostrador de atención de Textil Padilla, con muestrarios de tela sobre la mesa."],
      ["productos", "/productos", "Rollos de tela de distintos colores alineados en la bodega de producto terminado."],
      ["camisetas", "/productos/camisetas", "Camisetas deportivas terminadas, confeccionadas con telas de Textil Padilla."],
      ["microfibra", "/productos/microfibra", "Tejido de microfibra saliendo de la máquina de tejido circular."],
      ["dortmund-plus", "/productos/microfibra/dortmund-plus", "Rollo de Dortmund Plus en la nave de producción."],
      ["asesor-virtual", "/asesor-virtual", "Asesor de Textil Padilla revisando muestras de tela con un cliente."],
    ] as const
  ).map(([slug, ruta, alt]) => ({
    id: `hero-${slug}`,
    destino: `/heroes/${slug}.webp`,
    alt,
    grupo: "Cabeceras de página",
    ancho: 2400,
    nota: `Cabecera de ${ruta}, a sangre. Tono bajo, sin detalle en el tercio izquierdo (ahí va el titular). Muy apaisada: se recorta a 70vh.`,
  })),
  {
    id: "hero-home-poster",
    destino: "/video/hero-poster-manual.webp",
    alt: "",
    grupo: "Cabeceras de página",
    ancho: 1920,
    nota: "Cabecera de / (la portada). Mientras no haya vídeo procesado se ve ella sola, a sangre. Cuando corras `npm run video` pasa a ser el póster del bucle —lo que se ve mientras carga, si el navegador no reproduce, y con prefers-reduced-motion— y conviene que se parezca al primer fotograma o el salto se nota. Mismos requisitos que los demás heroes: tono bajo, sin detalle en el tercio izquierdo.",
  },

  // Carrusel de encuentros de la portada. El id nombra el evento y no su
  // posición: si mañana se reordenan las tarjetas, las fotos siguen a su evento.
  {
    id: "evento-feria-andina",
    destino: "/eventos/feria-andina.webp",
    alt: "Stand de Textil Padilla en la Feria Internacional del Textil Andino, con muestrario de telas.",
    grupo: "Home · Encuentros",
    ancho: 1280,
  },
  {
    id: "evento-jornada-color",
    destino: "/eventos/jornada-color.webp",
    alt: "Jornada de color a demanda: cliente comparando su referencia contra una carta de color.",
    grupo: "Home · Encuentros",
    ancho: 1280,
  },
  {
    id: "evento-alianza-retail",
    destino: "/eventos/alianza-retail.webp",
    alt: "Rollos de tela preparados para un cliente de retail premium.",
    grupo: "Home · Encuentros",
    ancho: 1280,
  },
  {
    id: "evento-performknit-320",
    destino: "/eventos/performknit-320.webp",
    alt: "Presentación de la línea PerformKnit 320: detalle del tejido sobre la mesa de muestras.",
    grupo: "Home · Encuentros",
    ancho: 1280,
  },

  // Recomendador de prenda de /productos. El id es la `key` de cada opción.
  {
    id: "prenda-camiseta",
    destino: "/prendas/camiseta.webp",
    alt: "Camiseta confeccionada en jersey de algodón peinado, mostrando la caída del punto.",
    grupo: "Productos · Recomendador",
    ancho: 1280,
  },
  {
    id: "prenda-chompa",
    destino: "/prendas/chompa.webp",
    alt: "Chompa en French Terry perchado, con el reverso afelpado a la vista.",
    grupo: "Productos · Recomendador",
    ancho: 1280,
  },
  {
    id: "prenda-pantalon",
    destino: "/prendas/pantalon.webp",
    alt: "Pantalón deportivo en sarga stretch, mostrando la caída y la recuperación del tejido.",
    grupo: "Productos · Recomendador",
    ancho: 1280,
  },
];

/**
 * Hitos de la línea de tiempo de Empresa. El id sale del código de referencia
 * que ya lleva cada hito (`ref`), que es estable y único.
 */
export const SLOTS_HITOS: SlotImagen[] = [
  ["fnd-01", "1987 · Fundación en Alangasí"],
  ["loc-01", "1994 · Consolidación de la matriz"],
  ["prd-01", "1999 · Teñido a demanda"],
  ["loc-02", "2003 · Local de La Marín"],
  ["loc-03", "2008 · Local de Solanda"],
  ["loc-04", "Apertura de local"],
  ["loc-05", "Apertura de local"],
  ["qlt-01", "Control de calidad"],
  ["prd-02", "Ampliación de producción"],
].map(([ref, titulo]) => ({
  id: `hito-${ref}`,
  destino: `/hitos/${ref}.webp`,
  alt: `Textil Padilla, ${titulo}.`,
  grupo: "Empresa · Línea de hitos",
  ancho: 900,
  nota: "Opcional: la línea de hitos funciona sin fotos. Formato 4:3.",
}));

/**
 * Un slot por tela del catálogo. El id es el slug, así que el nombre de archivo
 * de una tela nunca hay que buscarlo: es el que aparece en su URL.
 */
export const SLOTS_TELA: SlotImagen[] = categories.flatMap((c) =>
  c.subcategories.map((s) => ({
    id: s.slug,
    destino: `/telas/${s.slug}.webp`,
    alt: `Tela ${s.name} de ${c.name.toLowerCase()}, detalle del tejido.`,
    grupo: c.name,
    ancho: 1280,
  })),
);

/**
 * Alt más preciso para las telas ya fotografiadas. El genérico de arriba sirve
 * de red, pero cuando se sabe qué se ve conviene decirlo: un alt que solo
 * repite el nombre del producto no aporta nada a quien no ve la imagen.
 */
const ALT_TELA: Record<string, string> = {
  "sevilla-plus": "Tela Sevilla Plus de microfibra, detalle del tejido.",
  titanium: "Tela Titanium de microfibra, detalle del tejido en tono claro.",
  athletic: "Tela Athletic de microfibra en blanco, superficie lisa a color pleno.",
  chelsea: "Tela Chelsea de microfibra en blanco, superficie lisa a color pleno.",
  dortmund: "Tela Dortmund de microfibra en blanco, superficie lisa a color pleno.",
  mezi: "Tela Mezi texturizada en negro, superficie lisa a color pleno.",
  "dortmund-plus-brillante":
    "Tela Dortmund Plus Brillante, detalle del tejido con acabado brillante.",
  "sevilla-plus-brillante":
    "Tela Sevilla Plus Brillante, detalle del tejido con acabado brillante.",
  "dobleface-plus":
    "Macrofotografía de la microfibra Dobleface Plus, muestra de fábrica sin teñir: punto doble cara de malla fina y uniforme.",
  sevilla:
    "Macrofotografía de la microfibra Sevilla, muestra de fábrica sin teñir, con el relieve del punto marcado en diagonal.",
  "aston-plus":
    "Macrofotografía de la microfibra Aston Plus, muestra de fábrica sin teñir: tejido de relieve acanalado y estructura abierta.",
  kansas:
    "Macrofotografía de la microfibra Kansas, muestra de fábrica sin teñir, con celdas tipo panal visibles en la superficie.",
  boston:
    "Macrofotografía de la microfibra Boston, muestra de fábrica sin teñir: punto liso de malla cerrada.",
  juventus:
    "Macrofotografía de la microfibra Juventus, muestra de fábrica sin teñir, con el canalé vertical del tejido bien definido.",
  gaby: "Macrofotografía del texturizado Gaby, muestra de fábrica sin teñir: trama diagonal fina y regular.",
  napoli:
    "Macrofotografía del texturizado Napoli, muestra de fábrica sin teñir, con el acanalado del punto en sentido vertical.",
  napoles:
    "Macrofotografía del texturizado Napoles, muestra de fábrica sin teñir: canalé vertical de paso ancho.",
  kiana:
    "Macrofotografía del texturizado Kiana, muestra de fábrica sin teñir, de superficie lisa y trama muy fina.",
  river:
    "Macrofotografía del texturizado River, muestra de fábrica sin teñir, con la estructura del punto visible al trasluz.",
  "ribb-150":
    "Macrofotografía del texturizado Ribb 150, muestra de fábrica sin teñir: canalé elástico de rib, característico de cuellos y puños.",
  "interlock-30":
    "Tela Interlock 30 de spun en blanco, mostrando la caída del género y su doble cara lisa.",
  "interlock-40":
    "Macrofotografía del Interlock 40 de spun, muestra de fábrica sin teñir: doble punto liso por ambas caras.",
  "denis-20":
    "Macrofotografía del poli-algodón Denis 20, muestra de fábrica sin teñir, de punto liso y tacto de peinado.",
  "lacoast-20":
    "Macrofotografía del poli-algodón Lacoast 20, muestra de fábrica sin teñir, con las celdas de panal del piqué bien marcadas.",
  "lacoast-polo-20":
    "Macrofotografía del poli-algodón Lacoast Polo 20, muestra de fábrica sin teñir: piqué de celda romboidal para polos.",
  "lacoast-kratos-22":
    "Macrofotografía del poli-algodón Lacoast Kratos 22 en color marengo, con el hilo jaspeado visible en la trama.",
  "pique-ares-24":
    "Macrofotografía del poli-algodón Pique Ares 24, muestra de fábrica sin teñir, con el relieve regular del piqué.",
};

for (const slot of SLOTS_TELA) {
  const preciso = ALT_TELA[slot.id];
  if (preciso) slot.alt = preciso;
}

/** Todos los slots del sitio. */
export const SLOTS: SlotImagen[] = [
  ...SLOTS_UNICOS,
  ...SLOTS_TELA,
  ...SLOTS_HITOS,
];

const porId = new Map(SLOTS.map((s) => [s.id, s]));

// Un id duplicado haría que dos slots escribieran el mismo archivo y que el
// procesado de entrega aceptara un nombre ambiguo. Falla al cargar el módulo.
if (porId.size !== SLOTS.length) {
  const vistos = new Set<string>();
  const dup = SLOTS.map((s) => s.id).filter((id) =>
    vistos.has(id) ? true : (vistos.add(id), false),
  );
  throw new Error(`slots-imagen.ts: ids duplicados: ${[...new Set(dup)].join(", ")}`);
}

export function slotPorId(id: string): SlotImagen | undefined {
  return porId.get(id);
}

/** Ids válidos, para que el procesado de entrega cace erratas en los nombres. */
export const IDS_VALIDOS: ReadonlySet<string> = new Set(porId.keys());
