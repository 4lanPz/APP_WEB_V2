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
import { HITOS, rotuloDeHito, slotDeHito } from "./hitos";

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
   * Duda abierta sobre QUÉ va en el hueco —no sobre cómo fotografiarlo— que hay
   * que resolver antes de disparar. Se imprime destacada en el documento de
   * fotografía, aparte de la nota, y a propósito: la nota es el encargo, y una
   * advertencia de "puede que el encargo esté mal" metida dentro se lee como un
   * matiz del encuadre y se dispara igual.
   */
  porConfirmar?: string;
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
 * Parte común de las cuatro fotos del carrusel de encuentros de la portada.
 * Escrita una vez y compuesta en cada nota: son cuatro tomas de la misma
 * sesión, y cuatro copias del mismo párrafo son cuatro sitios donde corregir
 * el día que cambie el formato del carrusel.
 *
 * Formato leído de `EventCarousel.tsx:111-113` — `aspect-4/3` y 50vw desde
 * tablet. Si eso cambia, esto miente.
 */
const NOTA_EVENTO =
  "Apaisada (4:3), a media anchura del carrusel de encuentros (~600 px). Documental: material y gente reales, sin posado de estudio ni rótulos quemados. La portada lo presenta como un hecho de la empresa, así que no admite imagen generada ni de banco (ver README-imagenes.md §5).";

/**
 * Parte común de las tres prendas del recomendador.
 *
 * EL DATO QUE CAMBIA EL ENCUADRE es la reutilización: la misma foto sale
 * grande en `GarmentRecommender.tsx:83` (`aspect-4/3`, 50vw) y recortada a un
 * cuadrado de 64 px en las opciones del asesor virtual
 * (`AsesorWizard.tsx:41-43`, `size-16 sm:size-18` con `object-cover`). Una
 * prenda encuadrada solo para el marco grande se pierde en la miniatura, y eso
 * no se arregla después: se repite la sesión.
 */
const NOTA_PRENDA =
  "Apaisada (4:3) a media anchura del recomendador (~600 px), pero la MISMA foto se recorta a un cuadrado de 64 px (72 desde tablet) en las opciones del asesor virtual: la prenda tiene que quedar centrada y seguir reconociéndose dentro de ese cuadrado central. Prenda sola sobre fondo neutro, sin modelo y sin degradado de estudio.";

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
   * Cards de familia de tela, una por categoría del catálogo.
   *
   * UN SOLO SLOT POR FAMILIA AUNQUE LA CARD SALGA EN TRES SITIOS. La misma
   * rejilla se pinta en la portada, en /productos y en el styleguide, y las tres
   * usan la misma foto. Duplicar el slot por ruta le pediría a marketing ocho o
   * doce fotos de cuatro familias.
   *
   * Van a `/` porque es donde más peso tienen: quien lee este inventario para
   * disparar la foto necesita saber dónde se va a ver, y la portada manda. La
   * doble ubicación va dicha en la `nota` de cada una.
   */
  ...(
    [
      ["microfibra", "Rollos de microfibra alineados en bodega, con el brillo característico del poliéster ligero."],
      ["texturizado", "Tejido texturizado en plano abierto, con el cuerpo y el relieve del hilo a la vista."],
      ["spun", "Tela de hilado spun en plano abierto, de superficie mate y aspecto algodonoso."],
      ["polialgodon", "Tela de mezcla poliéster-algodón en plano abierto, con la trama del tejido visible."],
    ] as const
  ).map(([slug, alt]) => ({
    id: `familia-${slug}`,
    destino: `/familias/${slug}.webp`,
    alt,
    pagina: "/",
    seccion: "Familias de tela",
    /*
     * 1280 SE QUEDA COMO ESTÁ, Y NO ES QUE NADIE LO HAYA MIRADO.
     *
     * La portada pasó a contenedor amplio y sus cards crecieron (292 px a 1440,
     * 282 a 1920, frente a los 259 y 249 de antes), así que lo natural es
     * suponer que el ancho mínimo de la foto sube con ellas. No sube: NO ES LA
     * CARD DE ESCRITORIO LA QUE MANDA. La más grande que se pinta en todo el
     * sitio es la de UNA columna, justo antes de que la rejilla pase a dos —a
     * 639 px de ventana mide 550 px de ancho—, y ese caso ni ha cambiado ni lo
     * toca ninguna tanda prevista.
     *
     * La cuenta: 550 px de card × 1,10 del acercamiento al pasar el cursor =
     * 605 px, × 2 de densidad de pantalla = 1210. 1280 lo cubre con margen. Y
     * el sitio no pide nunca la foto entera: `sizes` sirve la variante que toca
     * en cada rejilla, así que el número de aquí es el techo, no lo que
     * descarga nadie.
     *
     * Medido en el navegador, no calculado sobre el papel.
     */
    ancho: 1280,
    nota:
      "Card de tres tamaños según la ventana: 550 × 300 px apilada (el caso más " +
      "grande, hasta 639 px), 428 × 300 a dos columnas y ~290 × 300 a cuatro " +
      "columnas en la portada. Lleva encima un velo que baja hasta " +
      "rgba(9,20,25,0.78) en el borde inferior, y sobre esa franja van el título y " +
      "la descripción: la foto tiene que aguantar oscurecerse abajo y no llevar " +
      "detalle importante ahí. (En las cabeceras hay que despejar el tercio " +
      "izquierdo; aquí es la parte de abajo.) Al pasar el cursor se acerca un 10%, " +
      "así que el encuadre no puede depender de lo que hay justo en el borde. El " +
      "mismo archivo se usa en la rejilla de /productos y en el styleguide: es un " +
      "solo hueco, no tres.",
  })),

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
    nota: `${NOTA_EVENTO} El stand en el recinto, con gente delante: se tiene que leer que es una feria y no una bodega. Luz de recinto, sin flash directo.`,
  },
  {
    id: "evento-jornada-color",
    destino: "/eventos/jornada-color.webp",
    alt: "Jornada de color a demanda: cliente comparando su referencia contra una carta de color.",
    pagina: "/",
    seccion: "Encuentros",
    ancho: 1280,
    nota: `${NOTA_EVENTO} Plano medio de las manos, la carta de color y la muestra del cliente sobre la mesa. La carta tiene que salir legible y en luz neutra: es lo que sostiene el argumento del teñido a demanda, y una carta con dominante no se puede enseñar.`,
  },
  {
    id: "evento-alianza-retail",
    destino: "/eventos/alianza-retail.webp",
    alt: "Rollos de tela preparados para un cliente de retail premium.",
    pagina: "/",
    seccion: "Encuentros",
    ancho: 1280,
    nota: `${NOTA_EVENTO} Rollos etiquetados y preparados para despacho, en bodega. Sin marcas ni logotipos de terceros identificables: al cliente no se le nombra.`,
    porConfirmar:
      "El id anuncia una ALIANZA y la nota describe un DESPACHO, que no es lo mismo. Antes de disparar hay que confirmar qué ocurrió de verdad en este encuentro: si la foto no comunica el acuerdo, el titular de la tarjeta dirá una cosa y la imagen otra. La nota está escrita con lo que hay hoy, que es el alt; si el evento resulta ser otra cosa, se reescribe aquí antes de la sesión.",
  },
  {
    id: "evento-performknit-320",
    destino: "/eventos/performknit-320.webp",
    alt: "Presentación de la línea PerformKnit 320: detalle del tejido sobre la mesa de muestras.",
    pagina: "/",
    seccion: "Encuentros",
    ancho: 1280,
    nota: `${NOTA_EVENTO} El tejido de la línea sobre la mesa de muestras, cenital o en tres cuartos. Prima que se lea el tejido, no la sala.`,
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
    nota: `${NOTA_PRENDA} Camiseta lisa de frente, colgada o doblada de forma que se lea la caída del punto.`,
  },
  {
    id: "prenda-chompa",
    destino: "/prendas/chompa.webp",
    alt: "Chompa en French Terry perchado, con el reverso afelpado a la vista.",
    pagina: "/productos",
    seccion: "Recomendador",
    ancho: 1280,
    /*
     * Las dos exigencias de esta foto compiten y por eso la nota dice cuál
     * manda: un detalle de perchado en una esquina desaparece al recortar a
     * cuadrado, y ocupando el centro deja de leerse como chompa. La miniatura
     * es donde se rompe, así que gana la miniatura.
     */
    nota: `${NOTA_PRENDA} Chompa entera y centrada, de frente. El reverso afelpado a la vista es DESEABLE, no obligatorio: si compite con el encuadre, manda que la prenda se reconozca en el cuadrado de 64 px. Que el perchado asome en un puño o en el dobladillo, con la prenda dominando el cuadro; un detalle de perchado que ocupe el centro se pierde como chompa, y en una esquina se pierde al recortar.`,
  },
  {
    id: "prenda-pantalon",
    destino: "/prendas/pantalon.webp",
    alt: "Pantalón deportivo en sarga stretch, mostrando la caída y la recuperación del tejido.",
    pagina: "/productos",
    seccion: "Recomendador",
    ancho: 1280,
    nota: `${NOTA_PRENDA} El pantalón entero, para que se vea la caída; el detalle de la sarga en el mismo cuadro si cabe sin perder la prenda.`,
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
 * Hitos de la línea de tiempo de Empresa. SE DERIVAN DE `HITOS`, que es la
 * misma lista que pinta la página: el id sale del `ref` —estable y único, y por
 * eso sigue siendo la clave del archivo aunque el año cambie— y el rótulo del
 * año más el título.
 *
 * ESTA LISTA ESTABA ESCRITA A MANO Y HABÍA DIVERGIDO. Cinco entradas llevaban
 * año y cuatro no, dos de ellas se llamaban las dos «Apertura de local» —el
 * encargo pedía dos fotos indistinguibles— y otras dos decían cosas
 * («Control de calidad», «Ampliación de producción») que no eran el título del
 * hito. Derivarlas es lo que impide que se vuelva a separar.
 *
 * EL AÑO SIN CONFIRMAR VIAJA COMO `porConfirmar` Y NO COMO NOTA. La nota es el
 * encargo —cómo se dispara—; que la fecha esté pendiente de administración es
 * una duda sobre QUÉ va en el hueco, y el documento de fotografía la imprime
 * aparte y destacada justamente para eso.
 */
export const SLOTS_HITOS: SlotImagen[] = HITOS.map((h) => ({
  id: slotDeHito(h.ref),
  destino: `/hitos/${h.ref.toLowerCase()}.webp`,
  alt: `Textil Padilla, ${rotuloDeHito(h)}.`,
  pagina: "/empresa",
  seccion: "Línea de hitos",
  ancho: 900,
  nota: "Opcional: la línea de hitos funciona sin fotos. Formato 4:3.",
  ...(h.anoPorConfirmar
    ? {
        porConfirmar:
          `El año ${h.year} NO está confirmado por administración. Si al ` +
          "validarlo cambia, el hito cambia de sitio en la línea y puede que la " +
          "foto de archivo que se dispare no sea la de ese año.",
      }
    : {}),
}));

/**
 * Nota común de las telas del catálogo, con los REQUISITOS DE RECOLOREO.
 *
 * POR QUÉ ESTÁN AQUÍ Y NO EN LA DOCUMENTACIÓN INTERNA
 * La simulación de color de la ficha multiplica el chip sobre la foto de la
 * tela (`recoloreo.ts`), y eso solo sale limpio si la foto no trae color propio.
 * Es una condición de la TOMA, no del preprocesado: no hay corrección posterior
 * que quite el tinte de una tela ya teñida ni que devuelva el detalle de una
 * alta luz quemada. Si no se pide al encargar, se descubre al procesar, y
 * entonces la sesión hay que repetirla.
 *
 * Los números no son de criterio: salen medidos. `scripts/gris.ts` calcula el
 * croma del original —cuánto se separan las medias de los tres canales, en
 * 0–255— y avisa por encima de `CROMA_MAXIMO`, hoy 10. Del material que hay,
 * Athletic mide 0,0 y Titanium entre 2,3 y 3,0. Lo de los quemados es por el
 * otro paso del preprocesado: normaliza los niveles hasta dejar el máximo de
 * luminancia en 250, y donde el original ya está en 255 no queda información
 * que levantar (el lote actual tenía su máximo en 211, con margen de sobra).
 *
 * Va en TODAS las telas y no solo en las vacías: la nota describe lo que el
 * slot debe contener, no lo que contiene. Las que hoy están publicadas a color
 * no admiten recoloreo, y esta nota es exactamente lo que hay que cumplir para
 * que la siguiente sí.
 */
const NOTA_MACRO_TELA =
  "Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que " +
  "tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o " +
  "la celda, según la tela—; luz rasante si el tejido tiene relieve. " +
  "REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de " +
  "color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya " +
  "teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, " +
  "sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre " +
  "255 y la referencia del lote actual es Titanium, con croma medido de 2,3 a 3,0; " +
  "(3) sin altas " +
  "luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta " +
  "dejar el máximo en 250, y donde el original está a 255 no queda información que " +
  "levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. " +
  "Y SE ENTREGA EL ORIGINAL A COLOR, no una conversión a blanco y negro: el " +
  "recoloreo desatura él solo, y una foto que llega ya desaturada hace " +
  "imposible comprobar (1) y (2) — el croma de un archivo en blanco y negro " +
  "da 0,0 siempre, venga de tela cruda o de tela azul. " +
  "Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.";

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
    nota: NOTA_MACRO_TELA,
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
    /*
     * DECÍA "vertical (4:5)" Y ERA FALSO. La galería recorta a 4:3 en los dos
     * sitios que recortan —la vista principal de `MacroLupa` y las miniaturas
     * cuadradas—, así que una foto vertical entregada según esa nota perdía
     * ~40% de alto; solo el visor a pantalla completa la habría enseñado entera,
     * porque va con `object-contain`. El resto del registro ya pedía 4:3
     * (`titanium-trama`, `athletic-macro`): la nota era la pieza descolgada.
     * Se corrigió antes de encargar las 28 fotos, no después.
     */
    /*
     * SIN EL NOMBRE DE LA TELA. Lo llevaba ("Segunda foto de la galería de
     * Chelsea: …") y no aportaba nada —el nombre ya está en el id y en el alt—,
     * pero hacía que las 28 notas fueran 28 textos distintos. El documento de
     * fotografía agrupa por nota común para no repetir la misma especificación
     * 28 veces, y con el nombre dentro no podía: son la misma toma pedida sobre
     * telas distintas.
     */
    nota: `Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.`,
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

// ---------------------------------------------------------------------------
// Procedencia de las fotos ya publicadas
// ---------------------------------------------------------------------------

/**
 * De dónde salió la foto que ocupa un hueco, y por tanto si hay que
 * reemplazarla.
 *
 * EXISTE PORQUE "EL HUECO TIENE FOTO" NO QUIERE DECIR "EL HUECO ESTÁ RESUELTO".
 * El manifiesto solo sabe si hay archivo, así que una imagen puesta para poder
 * maquetar la banda cuenta lo mismo que el macro real de la tela, y el encargo
 * de fotografía la daba por hecha y dejaba de pedirla. Ese es justo el material
 * que hay que reemplazar antes de publicar.
 */
export type Procedencia =
  /** Material real, en su sitio definitivo. No se pide. */
  | "definitiva"
  /** Puesta solo para poder maquetar o valorar el tratamiento. */
  | "maqueta"
  /** Relleno: ocupa el hueco para que no se vea vacío. */
  | "relleno"
  /** Generada por IA. */
  | "generada"
  /** De banco de imágenes. */
  | "banco"
  /**
   * La medida del propio pipeline la rechaza para el recoloreo: croma sobre el
   * techo, zona quemada o subexposición. Ver `npm run imagenes:medir`.
   *
   * Es un defecto de la TOMA, no del archivo, y por eso obliga a repetir: nada
   * de esto se arregla procesando.
   */
  | "no-apta"
  /**
   * El original ya viene desaturado, así que NO SE PUEDE COMPROBAR si la tela
   * era cruda: el dato que lo demostraría se perdió al guardar el archivo en
   * blanco y negro.
   *
   * NO ES LO MISMO QUE `no-apta`, y por eso son dos. Aquí la foto publicada
   * puede estar perfectamente bien —varias lo están, y se ven bien en la web—;
   * lo que falta es la prueba, no la calidad. Lo que se pide para cerrar el
   * hueco es el ORIGINAL A COLOR de esa misma toma, no volver a fotografiar.
   */
  | "no-verificable"
  /**
   * No consta de dónde salió. NO es un cajón de sastre ni un "seguramente
   * provisional": es una foto que hay que mirar antes de decidir. Se prefiere
   * esto a adivinar, porque una clasificación inventada se lee igual que una
   * comprobada y nadie vuelve a revisarla.
   */
  | "sin-clasificar";

/** Los tres estados en que puede estar un hueco de imagen. */
export type EstadoHueco = "falta" | "provisional" | "definitiva";

export interface FotoPublicada {
  procedencia: Procedencia;
  /**
   * DE DÓNDE CONSTA. Es la evidencia, no la conclusión: el commit, el md5 o la
   * receta que lo demuestra. Se imprime en el documento de fotografía para que
   * quien lo lea pueda comprobarlo en vez de creérselo.
   */
  segun: string;
}

/**
 * Las fotos que salen de `Telas_PW/`. Es la carpeta de 2,4 GB que entregó el
 * cliente (`README-imagenes.md` §4), y cada una tiene su original concreto
 * anotado en la receta de `scripts/preparar-imagenes.ts` — con la etiqueta de
 * producción que identifica la tela, verificada contra la ficha donde existe.
 *
 * No se deriva de ese script leyéndolo: `src/` no importa de `scripts/`, y al
 * revés sí. La comprobación de que las dos listas siguen cuadrando es que
 * `preparar-imagenes.ts` falla si una receta nombra un id que no existe aquí.
 */
const SEGUN_CLIENTE =
  "Sale de `Telas_PW/`, la carpeta que entregó el cliente, con su original " +
  "concreto anotado en la receta de `scripts/preparar-imagenes.ts`.";

/**
 * Fotos del cliente que NO alimentan ninguna simulación de color. Salir de
 * `Telas_PW/` basta para darlas por definitivas: no tienen que cumplir nada más.
 */
const DEL_CLIENTE: readonly string[] = [
  "oficio-nave-tejido",
  "oficio-taller-alangasi",
  "local-fachada",
  "macro-fibra-blanca",
  "macro-tejido",
  "macro-punto-camiseta",
];

/*
 * ---------------------------------------------------------------------------
 * LAS TELAS SE CLASIFICAN POR MEDIDA, NO POR PROCEDENCIA
 *
 * Venir de `Telas_PW/` no dice nada de si una foto sirve para el recoloreo: en
 * esa carpeta hay tela negra, hay tela con dominante y hay macros disparados
 * para otra cosa. Una tela solo puede darse por definitiva si cumple lo mismo
 * que el documento de fotografía le exige a marketing, y eso se mide.
 *
 * Las cifras de aquí abajo son un volcado de `npm run imagenes:medir`, que las
 * vuelve a calcular sobre los originales y AVISA si alguna clasificación ha
 * dejado de corresponderse con lo medido. Sin esa comprobación esto sería una
 * copia condenada a envejecer; con ella, sustituir una foto y olvidarse de
 * reclasificarla se ve al correr el script.
 * ---------------------------------------------------------------------------
 */

const SEGUN_MEDIDA =
  "Medido sobre el encuadre que se publica, con `npm run imagenes:medir`.";

/** Telas que pasan los cuatro cortes del recoloreo. */
const TELAS_MEDIDAS: readonly (readonly [string, string])[] = [
  ["chelsea", "Croma 4,1 · sin píxeles quemados · sin estirar · k 0,679"],
  [
    "athletic",
    "Croma 6,1 · 2 píxeles quemados de 1,2 millones · sin estirar · k 0,701. " +
      "Confirmada como buena por el cliente, y además el original ES A COLOR: " +
      "por eso su croma significa algo. La referencia de luz neutra del lote, " +
      "sin embargo, es Titanium — ver `NOTA_MACRO_TELA`",
  ],
  ["titanium", "Croma 3,0 · sin quemados · estira ×1,18 · k 0,708"],
  [
    "titanium-caida",
    "Croma 2,3 · sin quemados · estira ×1,24 · k 0,580. Es la más oscura del " +
      "lote que sirve, o sea el suelo contra el que se miden las demás",
  ],
  ["titanium-trama", "Croma 2,9 · sin quemados · estira ×1,20 · k 0,692"],
];

/**
 * Telas cuyo original ya viene en blanco y negro.
 *
 * Se piden, pero lo que se pide es OTRA COSA: el original a color de la misma
 * toma, no repetir la sesión. La foto publicada puede estar bien —estas seis lo
 * están: sin quemados, sin subexponer— y lo que falta es poder demostrar que la
 * tela era cruda, que es la condición que decide si el recoloreo sale limpio.
 */
const TELAS_NO_VERIFICABLES: readonly (readonly [string, string])[] = [
  [
    "athletic-macro",
    "K 0,707, sin subexponer y sin zona quemada: LA FOTO EN USO ES ACEPTABLE y " +
      "la ficha con lupa funciona con ella. Lo que se pide es el ORIGINAL A " +
      "COLOR de `Microfibra/Athletic (3).jpeg`, para poder verificarla — no " +
      "repetir la sesión. No se entrega un archivo nuevo: este slot lo genera " +
      "el procesado recortando ese original (`ORIGEN_ALTA` en " +
      "`preparar-imagenes.ts`), así que se rehace solo en cuanto llegue",
  ],
  [
    "athletic-zoom",
    "K 0,708, mismo original y mismo recorte que `athletic-macro`: LA CAPA DE " +
      "LA LUPA EN USO ES ACEPTABLE y lo que se pide es el ORIGINAL A COLOR " +
      "para poder verificarla, no repetir la sesión. También lo genera el " +
      "procesado, no se entrega",
  ],
  ["sevilla-plus-brillante", "K 0,702 · 60 píxeles quemados (0,007%) · sin estirar"],
  ["dortmund-plus-brillante", "K 0,566 · sin quemados · sin estirar"],
  ["dobleface-plus", "K 0,552 · sin quemados · sin estirar"],
  ["sevilla", "K 0,513 · sin quemados · sin estirar"],
];

/**
 * Telas en blanco y negro que ADEMÁS salen demasiado oscuras: ni estiradas
 * llegan a la mitad del recorrido, y el chip de color multiplicado sobre un
 * gris así no da el tono que pide. Aquí sí hay que volver a fotografiar.
 */
const TELAS_OSCURAS: readonly (readonly [string, number])[] = [
  ["boston", 0.428],
  ["juventus", 0.417],
  ["aston-plus", 0.401],
  ["interlock-40", 0.383],
  ["kansas", 0.381],
  ["denis-20", 0.377],
  ["napoli", 0.372],
  ["napoles", 0.364],
  ["pique-ares-24", 0.351],
  ["kiana", 0.35],
  ["river", 0.347],
  ["ribb-150", 0.325],
  ["lacoast-polo-20", 0.312],
  ["gaby", 0.307],
  ["lacoast-20", 0.277],
  ["lacoast-kratos-22", 0.076],
];

/** Telas a color que la medida rechaza, cada una por lo suyo. */
const TELAS_NO_APTAS: readonly (readonly [string, string])[] = [
  [
    "sevilla-plus",
    "4.116 píxeles quemados, un 0,251% del cuadro sobre un techo de 0,05%. El " +
      "preprocesado lleva el máximo a 250, y donde el original ya está en 255 " +
      "no queda información que levantar",
  ],
  [
    "dortmund",
    "Croma 10,3, justo sobre el techo de 10. Poco, pero es dominante real: el " +
      "original es a color y el tinte multiplicaría al del chip",
  ],
  [
    "interlock-30",
    "Croma 18,7, casi el doble del techo de 10 — y eso que la tela se llama " +
      "«Blanco Frozen»: la dominante la trae la luz, no el género",
  ],
  [
    "mezi",
    "Subexpuesta: su máximo es 113 sobre 255, así que habría que estirar ×2,21 " +
      "(techo ×1,35) y 113 niveles repartidos en 250 dan banding. Es tela " +
      "NEGRA, y por eso pasa el croma con 2,1: el negro es neutro. El croma " +
      "mide el tinte, no si la tela está teñida",
  ],
];

/** Las que llevan una precisión propia además de su origen. */
const PROPIAS: readonly (readonly [string, FotoPublicada])[] = [
  ...TELAS_MEDIDAS.map(
    ([id, medida]) =>
      [
        id,
        {
          procedencia: "definitiva" as const,
          segun: `${SEGUN_CLIENTE} ${SEGUN_MEDIDA} ${medida}.`,
        },
      ] as const,
  ),
  ...TELAS_NO_VERIFICABLES.map(
    ([id, medida]) =>
      [
        id,
        {
          procedencia: "no-verificable" as const,
          segun:
            `${SEGUN_MEDIDA} El original tiene los tres canales idénticos ` +
            `píxel a píxel, o sea que ya venía desaturado, así que su croma ` +
            `0,0 no demuestra que la tela fuera cruda: demuestra que ya no se ` +
            `puede saber. Por lo demás, ${medida}.`,
        },
      ] as const,
  ),
  ...TELAS_OSCURAS.map(
    ([id, k]) =>
      [
        id,
        {
          procedencia: "no-apta" as const,
          segun:
            `${SEGUN_MEDIDA} Original ya desaturado —croma no verificable— y ` +
            `además k normalizada ${k.toFixed(3).replace(".", ",")}, por ` +
            `debajo de 0,50: ni estirada llega a la mitad del recorrido.`,
        },
      ] as const,
  ),
  ...TELAS_NO_APTAS.map(
    ([id, medida]) =>
      [
        id,
        {
          procedencia: "no-apta" as const,
          segun: `${SEGUN_MEDIDA} ${medida}.`,
        },
      ] as const,
  ),

  // --- Provisionales -------------------------------------------------------
  [
    "hero-empresa",
    {
      procedencia: "maqueta",
      segun:
        "Lo dice el commit que la subió (b1e2e42): «entra como muestra para " +
        "poder valorarlo; es la misma foto que ya sale más abajo en esa página, " +
        "así que no es definitiva».",
    },
  ],
  ...(
    ["hero-contacto", "hero-productos", "hero-camisetas", "hero-asesor-virtual"] as const
  ).map(
    (id) =>
      [
        id,
        {
          procedencia: "maqueta" as const,
          segun:
            "Los cuatro archivos son BYTE A BYTE el mismo (md5 56e355a4…), y el " +
            "`alt` de cada slot describe una escena distinta: una sola imagen no " +
            "puede ser a la vez el mostrador, los rollos, las camisetas y el " +
            "asesor. Está puesta para poder maquetar la banda de cabecera.",
        },
      ] as const,
  ),

  // --- Sin clasificar ------------------------------------------------------
  [
    "hero-microfibra",
    {
      procedencia: "sin-clasificar",
      segun:
        "Archivo propio, no duplicado de los otros heroes. Entró en 55ffae7 —el " +
        "commit del mapa de Contacto— mencionada de pasada y sin decir de dónde " +
        "sale. No consta el origen.",
    },
  ],
  [
    "hero-home-poster",
    {
      procedencia: "sin-clasificar",
      segun:
        "Entró en 8e485c6, al arreglar el póster de la portada. El commit explica " +
        "por qué no se veía, no de dónde sale el archivo.",
    },
  ],
  [
    "dortmund-plus-cancha",
    {
      procedencia: "sin-clasificar",
      segun:
        "Entró en d55790f, un commit sobre el marcado de las cabeceras vacías que " +
        "no menciona su origen.",
    },
  ],
];

/**
 * Procedencia de cada foto ya publicada.
 *
 * Un hueco lleno que NO figure aquí se trata como `sin-clasificar`, no como
 * definitiva: así una foto nueva entra en la pila de revisión sola, y el
 * silencio nunca se lee como "es la buena".
 */
export const PROCEDENCIA_FOTO: ReadonlyMap<string, FotoPublicada> = (() => {
  const m = new Map<string, FotoPublicada>();
  for (const id of DEL_CLIENTE) {
    m.set(id, { procedencia: "definitiva", segun: SEGUN_CLIENTE });
  }
  for (const [id, foto] of PROPIAS) m.set(id, foto);
  return m;
})();

for (const id of PROCEDENCIA_FOTO.keys()) {
  // Un id mal escrito aquí dejaría su foto real fuera de la clasificación y
  // haría aparecer un hueco fantasma en el documento. Se para al cargar.
  if (!porId.has(id)) {
    throw new Error(
      `slots-imagen.ts: PROCEDENCIA_FOTO nombra un slot que no existe: ${id}`,
    );
  }
}

/** Qué se sabe de la foto de un hueco. `undefined` si no consta nada. */
export function procedenciaDe(id: string): FotoPublicada | undefined {
  return PROCEDENCIA_FOTO.get(id);
}

/** `true` si esa procedencia obliga a reemplazar la foto. */
export function esProvisional(p: Procedencia): boolean {
  return p !== "definitiva";
}

/**
 * El estado de un hueco. `lleno` viene del manifiesto, que es quien sabe si el
 * archivo existe; se pasa como argumento en vez de importarlo para no cerrar un
 * ciclo entre el registro y el manifiesto, que ya importa tipos de aquí.
 *
 * Una foto sin clasificar cuenta como PROVISIONAL. No es que se dé por mala: es
 * que hasta que alguien la mire no se puede dar por buena, y el hueco no se
 * puede cerrar. El documento la marca aparte para que se revise.
 */
export function estadoHueco(id: string, lleno: boolean): EstadoHueco {
  if (!lleno) return "falta";
  const foto = PROCEDENCIA_FOTO.get(id);
  return foto && !esProvisional(foto.procedencia) ? "definitiva" : "provisional";
}
