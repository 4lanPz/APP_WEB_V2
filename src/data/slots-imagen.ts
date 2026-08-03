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
import { estadoFicha } from "./fichas";

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
  /**
   * Ruta de la PÁGINA donde vive el hueco. Es la clave con la que
   * `/admin/imagenes` agrupa el inventario: entrar en una página y ver de un
   * vistazo todo lo que tiene y lo que le falta, cabecera incluida.
   *
   * Antes esto era un `grupo` de texto libre ("Home", "Empresa · Oficio",
   * "Cabeceras de página"…). El problema: las siete cabeceras vivían en su
   * propio grupo, separadas de la página a la que pertenecen, así que Inicio
   * figuraba con una imagen cuando tiene su hero MÁS las demás, y el hero
   * aparecía listado en otro sitio. Atar el slot a la ruta lo impide: el hero
   * de `/empresa` y los macros de `/empresa` caen juntos porque comparten ruta.
   */
  pagina: string;
  /**
   * Sub-sección opcional DENTRO de una página, cuando agrupa la lectura
   * (Oficio vs. Línea de hitos en Empresa, el Recomendador en Productos, la
   * segunda vista de la galería). Los huecos sin sección son el contenido
   * principal de la página y se listan primero, con la cabecera al frente.
   */
  seccion?: string;
  /** Ancho máximo de salida en px. */
  ancho: number;
  /** Qué se espera ver, para el que dispara la foto. */
  nota?: string;
  /**
   * `true` si esta foto se publica en GRIS NEUTRO NORMALIZADO: desaturada a
   * gris puro y con los niveles subidos hasta que el máximo de luminancia queda
   * en 250. Es la condición que necesita la simulación de color —`multiply`
   * multiplica canal a canal, así que cualquier dominante de la foto ensuciaría
   * el tono del chip— y la marca la lleva el SLOT, no la receta: así el
   * preprocesado es el mismo venga la foto de `Telas_PW/` o de `entrega/`.
   *
   * Se declara en `IDS_GRIS`, al final del archivo, junto al porqué.
   */
  gris?: true;
}

/**
 * Medidas de una foto gris, calculadas por el preprocesado y guardadas en
 * `imagenes.generado.ts`. Antes `k` era una constante escrita a mano para
 * Athletic; con dos telas ya no escala, y a la tercera nadie recuerda que había
 * que recalcularla.
 */
export interface MedidaGris {
  /**
   * Luminancia media de la foto YA PUBLICADA, en 0–1. Es lo que compensa la
   * capa de color: sin ella la tela sale multiplicada por su propio gris y se
   * ve más oscura de lo que dice el chip. Ver `capaMultiply` en `recoloreo.ts`.
   */
  k: number;
  /**
   * Separación entre las medias de canal del ORIGINAL, en 0–255 — o sea cuánto
   * tinte traía la foto antes de desaturar. Se guarda aunque el runtime no la
   * use: es el dato que dice si esa foto era apta para recoloreo, y medida
   * después de desaturar sería siempre 0 y no diría nada.
   */
  croma: number;
}

export interface Pagina {
  /** Ruta real, y clave de agrupación de los slots. */
  ruta: string;
  /** Nombre visible de la página en el inventario. */
  titulo: string;
}

/**
 * Las páginas del sitio con huecos de imagen, en orden de navegación. El
 * inventario de `/admin/imagenes` las lista en este orden; el índice de cada
 * una decide su posición. Toda `pagina` de un slot debe existir aquí.
 */
export const PAGINAS: Pagina[] = [
  { ruta: "/", titulo: "Inicio" },
  { ruta: "/empresa", titulo: "Empresa" },
  { ruta: "/productos", titulo: "Productos" },
  { ruta: "/productos/microfibra", titulo: "Microfibra" },
  { ruta: "/productos/microfibra/dortmund-plus", titulo: "Dortmund Plus" },
  { ruta: "/productos/camisetas", titulo: "Camisetas" },
  { ruta: "/productos/texturizado", titulo: "Texturizado" },
  { ruta: "/productos/spun", titulo: "Spun" },
  { ruta: "/productos/polialgodon", titulo: "Polialgodón" },
  { ruta: "/asesor-virtual", titulo: "Asesor Virtual" },
  { ruta: "/contacto", titulo: "Contacto" },
];

const ORDEN_PAGINA = new Map(PAGINAS.map((p, i) => [p.ruta, i]));

/** Índice de la página en el orden de navegación, para ordenar el inventario. */
export function ordenPagina(ruta: string): number {
  return ORDEN_PAGINA.get(ruta) ?? PAGINAS.length;
}

/** Título visible de una página; su propia ruta si no está registrada. */
export function tituloPagina(ruta: string): string {
  return PAGINAS.find((p) => p.ruta === ruta)?.titulo ?? ruta;
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
    pagina: "/",
    ancho: 1920,
    nota: "Macro de tejido claro, apaisada. Es la primera imagen de la portada.",
  },
  {
    id: "macro-tejido",
    destino: "/macros/tejido.webp",
    alt: "Macrofotografía de tejido de punto azul, con la estructura del piqué visible en los pliegues.",
    pagina: "/productos",
    ancho: 1920,
  },
  {
    id: "macro-punto-camiseta",
    destino: "/macros/punto-camiseta.webp",
    alt: "Detalle de tejido de punto celeste dispuesto en espiral, mostrando el brillo y la elasticidad del género.",
    pagina: "/productos/camisetas",
    ancho: 1920,
  },
  {
    id: "camisetas-jersey",
    destino: "/macros/jersey-peinado.webp",
    alt: "Macrofotografía de jersey de algodón peinado, con el punto liso visible de cerca.",
    pagina: "/productos/camisetas",
    ancho: 1280,
    nota: "Macro real de single jersey. Acompaña a la ficha de la tela 01.",
  },
  {
    id: "camisetas-pique",
    destino: "/macros/pique.webp",
    alt: "Macrofotografía de piqué, con las celdas en relieve tipo panal.",
    pagina: "/productos/camisetas",
    ancho: 1280,
    nota: "Macro real de piqué. Acompaña a la ficha de la tela 02.",
  },
  {
    id: "oficio-nave-tejido",
    destino: "/oficio/nave-tejido.webp",
    alt: "Nave de tejido de Textil Padilla: fileta de conos de hilo blanco alineados frente a máquinas de tejido circular.",
    pagina: "/empresa",
    seccion: "Oficio",
    ancho: 1920,
  },
  {
    id: "oficio-taller-alangasi",
    destino: "/oficio/taller-alangasi.webp",
    alt: "Rollos de tela terminados y embalados con el logotipo de Textil Padilla, apilados en bodega.",
    pagina: "/empresa",
    seccion: "Oficio",
    ancho: 1200,
    nota: "Vertical (4:5).",
  },
  {
    id: "oficio-tintoreria",
    destino: "/oficio/tintoreria.webp",
    alt: "Tintorería de Textil Padilla: barcas de teñido en proceso.",
    pagina: "/empresa",
    seccion: "Oficio",
    ancho: 1600,
    nota: "Área de tintorería en marcha. Apaisada (4:3). Es la que sostiene el argumento del teñido a demanda.",
  },
  {
    id: "oficio-carta-color",
    destino: "/oficio/carta-color.webp",
    alt: "Carta de color de Textil Padilla: muestras de tela teñidas ordenadas por tono.",
    pagina: "/empresa",
    seccion: "Oficio",
    ancho: 1600,
    nota: "Muestrario físico de colores. Apaisada (4:3).",
  },
  {
    id: "local-fachada",
    destino: "/locales/fachada.webp",
    alt: "Fachada de Textil Padilla e Hijos con su rótulo azul, y un camión de reparto en la entrada.",
    pagina: "/contacto",
    ancho: 1920,
  },
  {
    id: "retrato-asesor",
    destino: "/oficio/asesor.webp",
    alt: "Asesor comercial de Textil Padilla atendiendo en el mostrador, con muestrario de telas.",
    pagina: "/contacto",
    ancho: 1280,
    nota: "Retrato de una persona real del equipo. Requiere su autorización para salir en la web.",
  },
  {
    id: "dortmund-plus-cancha",
    destino: "/telas/dortmund-plus-cancha.webp",
    alt: "Prenda deportiva confeccionada en Dortmund Plus, en uso durante un partido.",
    pagina: "/productos/microfibra/dortmund-plus",
    ancho: 1600,
    nota: "Prenda hecha con la tela, en uso. Sin rótulos ni tipografía quemada.",
  },
  {
    id: "dortmund-plus-blancos-macro",
    destino: "/telas/dortmund-plus-blancos-macro.webp",
    alt: "Macrofotografía de la microfibra Dortmund Plus en blanco, con la textura del punto a contraluz.",
    pagina: "/productos/microfibra/dortmund-plus",
    ancho: 1920,
    nota: "Macro de textura, muy apaisada (21:9).",
  },

  /**
   * Fondos fotográficos de cabecera, uno por página con hero.
   *
   * Cada uno vive en la PÁGINA a la que pertenece (su `pagina` es la ruta), no
   * en un grupo aparte de "cabeceras". Hubo un momento en que estaban todos
   * juntos en un solo grupo para no perderlos entre los huecos; el efecto
   * lateral es que la página figuraba sin su propia cabecera y el hero salía
   * listado lejos de lo demás. Atado a la ruta, el hero de cada página encabeza
   * su inventario, que es como se pide el material a marketing.
   *
   * Mientras un slot esté vacío su hero se queda en tinta plana. Eso es "falta
   * la foto", no un diseño: el fondo de estas cabeceras es la fotografía. (Hubo
   * una rejilla CSS que lo disimulaba; venía de los mockups, donde marcaba el
   * hueco de imagen, y se retiró — ver `FondoHero`.)
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
    pagina: ruta,
    seccion: "Cabecera",
    ancho: 2400,
    nota: `Cabecera de ${ruta}, a sangre. Tono bajo, sin detalle en el tercio izquierdo (ahí va el titular). Muy apaisada: se recorta a 70vh.`,
  })),
  {
    id: "hero-home-poster",
    destino: "/video/hero-poster-manual.webp",
    alt: "",
    pagina: "/",
    seccion: "Cabecera",
    ancho: 1920,
    nota: "Cabecera de / (la portada). Mientras no haya vídeo procesado se ve ella sola, a sangre. Cuando corras `npm run video` pasa a ser el póster del bucle —lo que se ve mientras carga, si el navegador no reproduce, y con prefers-reduced-motion— y conviene que se parezca al primer fotograma o el salto se nota. Mismos requisitos que los demás heroes: tono bajo, sin detalle en el tercio izquierdo.",
  },

  // Carrusel de encuentros de la portada. El id nombra el evento y no su
  // posición: si mañana se reordenan las tarjetas, las fotos siguen a su evento.
  {
    id: "evento-feria-andina",
    destino: "/eventos/feria-andina.webp",
    alt: "Stand de Textil Padilla en la Feria Internacional del Textil Andino, con muestrario de telas.",
    pagina: "/",
    seccion: "Encuentros",
    ancho: 1280,
  },
  {
    id: "evento-jornada-color",
    destino: "/eventos/jornada-color.webp",
    alt: "Jornada de color a demanda: cliente comparando su referencia contra una carta de color.",
    pagina: "/",
    seccion: "Encuentros",
    ancho: 1280,
  },
  {
    id: "evento-alianza-retail",
    destino: "/eventos/alianza-retail.webp",
    alt: "Rollos de tela preparados para un cliente de retail premium.",
    pagina: "/",
    seccion: "Encuentros",
    ancho: 1280,
  },
  {
    id: "evento-performknit-320",
    destino: "/eventos/performknit-320.webp",
    alt: "Presentación de la línea PerformKnit 320: detalle del tejido sobre la mesa de muestras.",
    pagina: "/",
    seccion: "Encuentros",
    ancho: 1280,
  },

  /*
   * Bloque "Asesor virtual" de la portada: una foto por paso del cuestionario
   * (Prenda / Sublimado / Uso) que se cambia sola al avanzar el paso activo. Son
   * tres slots propios y no los del recomendador (`prenda-*`) ni los del wizard
   * (`asesor-*`): aquí la foto es grande, editorial y va sobre fondo claro, no
   * una miniatura. Formato flexible —la caja recorta con object-cover—, así que
   * marketing puede entregar apaisada o vertical sin romper el bloque.
   */
  {
    id: "asesor-portada-prenda",
    destino: "/asesor/paso-prenda.webp",
    alt: "Prendas deportivas en confección: camisetas y buzos que definen el punto de partida de la asesoría.",
    pagina: "/",
    seccion: "Asesor virtual",
    ancho: 1600,
    nota: "Paso 01 (Prenda). Qué se va a producir: prenda deportiva terminada o en confección. Sin rótulos quemados. Formato flexible; se recorta a la caja del split.",
  },
  {
    id: "asesor-portada-sublimado",
    destino: "/asesor/paso-sublimado.webp",
    alt: "Tela clara con estampado sublimado full-print, mostrando el color a sangre sobre la base.",
    pagina: "/",
    seccion: "Asesor virtual",
    ancho: 1600,
    nota: "Paso 02 (Sublimado). Base clara con estampado full-print, o el contraste liso/sublimado. Formato flexible; se recorta a la caja del split.",
  },
  {
    id: "asesor-portada-uso",
    destino: "/asesor/paso-uso.webp",
    alt: "Tela en uso deportivo, mostrando el rendimiento y la caída del género en movimiento.",
    pagina: "/",
    seccion: "Asesor virtual",
    ancho: 1600,
    nota: "Paso 03 (Uso). El destino de la tela: alto rendimiento, casual o uniforme. Formato flexible; se recorta a la caja del split.",
  },

  // Recomendador de prenda de /productos. El id es la `key` de cada opción.
  // El asesor virtual reutiliza estas tres para sus opciones de prenda: misma
  // prenda, misma foto, un solo archivo que pedir.
  {
    id: "prenda-camiseta",
    destino: "/prendas/camiseta.webp",
    alt: "Camiseta confeccionada en jersey de algodón peinado, mostrando la caída del punto.",
    pagina: "/productos",
    seccion: "Recomendador",
    ancho: 1280,
  },
  {
    id: "prenda-chompa",
    destino: "/prendas/chompa.webp",
    alt: "Chompa en French Terry perchado, con el reverso afelpado a la vista.",
    pagina: "/productos",
    seccion: "Recomendador",
    ancho: 1280,
  },
  {
    id: "prenda-pantalon",
    destino: "/prendas/pantalon.webp",
    alt: "Pantalón deportivo en sarga stretch, mostrando la caída y la recuperación del tejido.",
    pagina: "/productos",
    seccion: "Recomendador",
    ancho: 1280,
  },

  /*
   * Ejemplo de aplicación de /productos/microfibra: una prenda deportiva
   * terminada, para ilustrar para qué sirve la familia. Es un SLOT y no un
   * archivo suelto a propósito: más adelante el bloque cambia a un objeto 3D
   * interactivo y la página no debe enterarse. Hoy va una imagen generada para
   * la demo — no es producto propio, así que su etiqueta es puramente
   * ilustrativa (ver `BloqueAplicacion`).
   */
  {
    id: "aplicacion-microfibra",
    destino: "/aplicacion/microfibra.webp",
    alt: "Camiseta deportiva sobre pedestal, fondo oscuro — ejemplo de aplicación de la microfibra en confección.",
    pagina: "/productos/microfibra",
    seccion: "Ejemplo de aplicación",
    ancho: 1280,
    nota: "Demo: prenda deportiva sobre pedestal, fondo oscuro y neutro. Imagen generada para la maqueta, NO es producto de Textil Padilla. Se reemplazará por el objeto 3D. Vertical (4:5).",
  },

  /*
   * Opciones del cuestionario del asesor virtual que no reutilizan una prenda
   * del recomendador. Miniaturas cuadradas pequeñas: acompañan a la opción, no
   * la lideran. Sin foto, el hueco queda como plano de tinta intencional.
   */
  {
    id: "asesor-prenda-otro",
    destino: "/asesor/prenda-otro.webp",
    alt: "Retales y muestras de distintas telas sobre la mesa del asesor.",
    pagina: "/asesor-virtual",
    seccion: "Opciones del cuestionario",
    ancho: 640,
    nota: "Cuadrada (1:1). Opción «Otro»: bodegón de muestras variadas, sin una prenda concreta.",
  },
  {
    id: "asesor-sublimado-si",
    destino: "/asesor/sublimado-si.webp",
    alt: "Prenda deportiva con estampado sublimado a todo color.",
    pagina: "/asesor-virtual",
    seccion: "Opciones del cuestionario",
    ancho: 640,
    nota: "Cuadrada (1:1). Base clara con full-print sublimado.",
  },
  {
    id: "asesor-sublimado-no",
    destino: "/asesor/sublimado-no.webp",
    alt: "Tela en color liso teñido a demanda, sin estampado.",
    pagina: "/asesor-virtual",
    seccion: "Opciones del cuestionario",
    ancho: 640,
    nota: "Cuadrada (1:1). Tono sólido, sin estampado.",
  },
  {
    id: "asesor-uso-rendimiento",
    destino: "/asesor/uso-rendimiento.webp",
    alt: "Prenda deportiva de alto rendimiento en uso durante el gesto atlético.",
    pagina: "/asesor-virtual",
    seccion: "Opciones del cuestionario",
    ancho: 640,
    nota: "Cuadrada (1:1). Deporte de rendimiento, tela técnica.",
  },
  {
    id: "asesor-uso-casual",
    destino: "/asesor/uso-casual.webp",
    alt: "Prenda casual de uso diario, de caída suave.",
    pagina: "/asesor-virtual",
    seccion: "Opciones del cuestionario",
    ancho: 640,
    nota: "Cuadrada (1:1). Básico de retail, mano suave.",
  },
  {
    id: "asesor-uso-uniforme",
    destino: "/asesor/uso-uniforme.webp",
    alt: "Uniforme corporativo confeccionado en tela de color estable.",
    pagina: "/asesor-virtual",
    seccion: "Opciones del cuestionario",
    ancho: 640,
    nota: "Cuadrada (1:1). Uniforme corporativo, color estable al lavado.",
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
  pagina: "/empresa",
  seccion: "Línea de hitos",
  ancho: 900,
  nota: "Opcional: la línea de hitos funciona sin fotos. Formato 4:3.",
}));

/**
 * Un slot por tela del catálogo. El id es el slug, así que el nombre de archivo
 * de una tela nunca hay que buscarlo: es el que aparece en su URL. Cada tela
 * se inventaría bajo la página de su familia (`/productos/<categoria>`).
 */
export const SLOTS_TELA: SlotImagen[] = categories.flatMap((c) =>
  c.subcategories.map((s) => ({
    id: s.slug,
    destino: `/telas/${s.slug}.webp`,
    alt: `Tela ${s.name} de ${c.name.toLowerCase()}, detalle del tejido.`,
    pagina: `/productos/${c.slug}`,
    seccion: "Telas del catálogo",
    ancho: 1280,
  })),
);

/**
 * Sufijos de las vistas extra de galería de una tela, EN ORDEN de aparición
 * tras el macro base. Hoy solo la caída del género; una segunda vista (p. ej.
 * `"rollo"`) se añade aquí y su hueco aparece solo en el inventario.
 *
 * Es la fuente única del nombre: `galeriaDeTela` en `imagenes.ts` lee de aquí
 * para recoger exactamente estos ids y no confundirse con telas de nombre más
 * largo (`sevilla` vs. `sevilla-plus`), donde un match por prefijo fallaría.
 */
export const SUFIJOS_GALERIA_TELA = ["caida"] as const;

const NOTA_VISTA_GALERIA: Record<(typeof SUFIJOS_GALERIA_TELA)[number], (nombre: string) => { alt: (fam: string) => string; nota: string }> = {
  caida: (nombre) => ({
    alt: (fam) => `Tela ${nombre} de ${fam}, el género en caída mostrando peso y drapeado.`,
    nota: `Segunda foto de la galería de ${nombre}: el género drapeado o en caída, NO el macro plano del tejido. Fondo neutro, vertical (4:5).`,
  }),
};

/**
 * Vistas de galería de la página de tela. Solo para las telas que YA publican
 * ficha (con página de contenido, no "en preparación"): sin ficha no hay
 * galería que alimentar. Se derivan de `estadoFicha`, así que publicar una
 * ficha nueva crea sus huecos de galería automáticamente.
 *
 * Hoy es UNA sola vista nueva por tela a propósito, no dos: es lo que se le
 * pide a marketing de una tanda. Con dos fotos —esta más el macro— la galería
 * ya se activa.
 */
export const SLOTS_GALERIA_TELA: SlotImagen[] = categories.flatMap((c) =>
  c.subcategories
    .filter((s) => estadoFicha(s.slug) !== "sin-ficha")
    .flatMap((s) =>
      SUFIJOS_GALERIA_TELA.map((sufijo) => {
        const meta = NOTA_VISTA_GALERIA[sufijo](s.name);
        return {
          id: `${s.slug}-${sufijo}`,
          destino: `/telas/${s.slug}-${sufijo}.webp`,
          alt: meta.alt(c.name.toLowerCase()),
          pagina: `/productos/${c.slug}`,
          seccion: "Galería · segunda vista",
          ancho: 1280,
          nota: meta.nota,
        };
      }),
    ),
);

/**
 * Vistas de galería que existen SOLO en una tela concreta, porque solo esa tela
 * tiene material para llenarlas.
 *
 * POR QUÉ NO ES UN SUFIJO MÁS DE `SUFIJOS_GALERIA_TELA`
 * Mismo motivo que en `SLOTS_ALTA_TELA`: ese array es global. Añadirle "trama"
 * abriría un hueco vacío en las 20 y pico fichas del catálogo y el inventario
 * de `/admin/imagenes` pediría a marketing una foto por tela que nadie encargó.
 * Aquí solo está la tela cuyo lote trae la toma.
 *
 * A DIFERENCIA de `SLOTS_ALTA_TELA`, estos SÍ son huecos de entrega normales:
 * son una foto más, no un recorte generado. Si mañana llega la misma vista de
 * otra tela, se añade su slot aquí y se cablea en `VISTAS_EXTRA_POR_TELA`.
 */
export const SLOTS_VISTAS_EXTRA: SlotImagen[] = [
  {
    id: "titanium-trama",
    destino: "/telas/titanium-trama.webp",
    alt: "Tela Titanium de microfibra en gris, con la trama del tejido visible a luz rasante sobre un pliegue ancho.",
    pagina: "/productos/microfibra",
    seccion: "Galería · vistas extra",
    ancho: 1280,
    nota: "Tercera foto de la galería de Titanium: plano abierto del género con un pliegue ancho y la trama legible a luz rasante. Formato 4:3, como el resto de la galería.",
  },
];

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

/**
 * Derivados de alta de la galería: la base de la foto principal y la capa que
 * usa la lupa macro. Excepción por tela, no una vista más para todas.
 *
 * POR QUÉ NO SON UN SUFIJO DE `SUFIJOS_GALERIA_TELA`
 * Ese array es global: añadirle "macro" abriría un hueco vacío en las 20 fichas
 * del catálogo, y son huecos que nadie va a llenar —salen de un recorte del
 * original, no de una foto nueva que pedir—. Aquí solo está la tela que tiene
 * material que lo justifica.
 *
 * POR QUÉ DOS ARCHIVOS Y NO UNO
 * Base y lupa COMPARTEN RECTÁNGULO DE RECORTE. Si discreparan, el punto bajo el
 * cursor no sería el punto que se amplía y la lupa apuntaría a otro sitio. Son
 * el mismo encuadre a dos tamaños: el de 2400 se pinta siempre, el de 3000 solo
 * se descarga cuando alguien activa la lupa.
 *
 * NO SON HUECOS DE ENTREGA. A diferencia del resto del registro, estos ids no
 * se llenan dejando un archivo en `entrega/`: los genera
 * `scripts/preparar-imagenes.ts` recortando el original. Están aquí porque ese
 * script exige que todo lo que escribe corresponda a un slot —lo que impide
 * generar archivos que ninguna página lee— y porque el manifiesto tiene que
 * saber que existen.
 */
export const SLOTS_ALTA_TELA: SlotImagen[] = [
  {
    id: "athletic-macro",
    destino: "/telas/athletic-macro.webp",
    alt: "Macrofotografía de la microfibra Athletic sin teñir: la malla de panal y los pliegues del género en luz rasante.",
    pagina: "/productos/microfibra",
    seccion: "Galería · principal en alta",
    ancho: 2400,
    nota: "Generado, no se entrega. Recorte 4:3 del original sobre la zona en foco.",
  },
  {
    id: "athletic-zoom",
    destino: "/telas/athletic-zoom.webp",
    alt: "",
    pagina: "/productos/microfibra",
    seccion: "Galería · capa de lupa",
    ancho: 3000,
    nota: "Generado, no se entrega. Mismo recorte que athletic-macro, al ancho máximo que da el recorte sin escalar. Decorativo: la lupa lo monta con aria-hidden sobre la imagen que ya tiene alt.",
  },
];

/** Todos los slots del sitio. */
export const SLOTS: SlotImagen[] = [
  ...SLOTS_UNICOS,
  ...SLOTS_TELA,
  ...SLOTS_GALERIA_TELA,
  ...SLOTS_VISTAS_EXTRA,
  ...SLOTS_ALTA_TELA,
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

/**
 * Fotos que se publican en gris neutro normalizado (ver `SlotImagen.gris`).
 *
 * ES LA MISMA LISTA QUE `TELAS_CON_RECOLOREO` de `recoloreo.ts`, vista desde el
 * otro lado: allí están las telas que ofrecen el muestrario, aquí los archivos
 * concretos que lo alimentan. Tienen que ir juntas —una tela con recoloreo cuya
 * galería trae una foto a color daría un tono sucio, y nadie sabría por qué— y
 * no se derivan la una de la otra a propósito: la galería de una tela puede
 * traer una vista que no pasó por el preprocesado, y entonces esa vista NO va
 * aquí aunque la tela sí tenga muestrario.
 *
 * Hoy son las dos telas cuyo lote se disparó sobre género sin teñir. Las otras
 * 18 están fotografiadas a color y no admiten la técnica.
 */
export const IDS_GRIS: readonly string[] = [
  "athletic-macro",
  "athletic-zoom",
  "titanium",
  "titanium-caida",
  "titanium-trama",
];

for (const id of IDS_GRIS) {
  const slot = porId.get(id);
  // Un id mal escrito aquí no rompería nada visible: la foto se publicaría a
  // color, el recoloreo la multiplicaría por su propio tinte y el tono saldría
  // sucio sin que ningún error lo dijera. Se para al cargar el módulo.
  if (!slot) {
    throw new Error(`slots-imagen.ts: IDS_GRIS nombra un slot que no existe: ${id}`);
  }
  slot.gris = true;
}

export function slotPorId(id: string): SlotImagen | undefined {
  return porId.get(id);
}

/** Ids válidos, para que el procesado de entrega cace erratas en los nombres. */
export const IDS_VALIDOS: ReadonlySet<string> = new Set(porId.keys());
