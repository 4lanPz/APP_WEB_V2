/**
 * Genera el documento de fotografía que se le envía a marketing, en sus dos
 * vistas.
 *
 *   npm run imagenes:requisitos  ->  docs/requisitos-fotografia.md
 *                                ->  docs/requisitos-fotografia-por-pagina.md
 *
 * Es el inventario de TODOS los huecos de imagen del sitio en sus tres estados
 * —falta, provisional, definitiva—, agrupado por el tipo de toma que requiere
 * cada uno: con casi cien fotos por conseguir, una lista plana no es un encargo
 * sino una lista de tareas sin prioridad por la que nadie sabe empezar.
 * Agrupadas por tipo, cada bloque es una sesión de fotos.
 *
 * LOS TRES ESTADOS, y por qué no bastaba con "lleno" y "vacío". El manifiesto
 * solo sabe si el archivo existe, así que una imagen puesta para poder maquetar
 * contaba igual que el macro real de la tela: el documento la daba por hecha y
 * dejaba de pedirla. Eso dejaba fuera del encargo justo el material que hay que
 * reemplazar antes de publicar. El estado sale de cruzar el manifiesto con
 * `PROCEDENCIA_FOTO` del registro (`estadoHueco`), y una foto sin clasificar
 * cuenta como provisional: hasta que alguien la mire no se puede dar por buena.
 *
 * LAS DOS VISTAS SON EL MISMO CONJUNTO DE HUECOS, ordenado de dos formas, y
 * responden a dos preguntas distintas que se hacen en dos momentos distintos:
 *
 * - por TIPO DE TOMA (`requisitos-fotografia.md`) — «¿qué monto en la próxima
 *   sesión?». Es la vista con la que se sale a fotografiar: cada bloque se
 *   dispara del tirón, con la misma luz y el mismo montaje.
 * - por PÁGINA (`requisitos-fotografia-por-pagina.md`) — «¿qué le falta a esta
 *   página para poder publicarse?». Es la vista con la que se revisa el sitio,
 *   y la que hace falta cuando el trabajo se prioriza por página y no por
 *   sesión.
 *
 * Ninguna es un resumen de la otra: las dos listan los mismos huecos vacíos y
 * salen del mismo `main()`, así que no pueden desincronizarse ni descuadrar en
 * el total. Se generan juntas a propósito — dos comandos serían dos documentos
 * con fechas distintas.
 *
 * SE REGENERA, NO SE EDITA A MANO. El archivo sale de `slots-imagen.ts` y del
 * manifiesto, así que llenar un hueco lo quita del documento sin que nadie tenga
 * que acordarse de tacharlo.
 *
 * DE DÓNDE SALE CADA DATO
 * - `id`, `pagina`, `alt`, `nota`, `ancho`  →  del registro de slots.
 * - **cómo se ve** (tamaño en pantalla y proporción)  →  NO está en el registro.
 *   Vive en el `className` del componente que pinta el hueco, así que aquí va
 *   declarado a mano en `GRUPOS`, con el archivo del que se leyó anotado al
 *   lado. Si alguien cambia ese `className`, esto se queda desfasado y no hay
 *   forma de que el script se entere — por eso se anota la fuente: para poder
 *   comprobarlo en diez segundos.
 * - **el tipo de foto**  →  del ORIGEN del slot (de qué array del registro sale)
 *   y de su `nota`. Nunca de una corazonada: un slot que no encaja en ninguna
 *   regla cae en "Sin clasificar" en vez de colarse en el grupo más parecido.
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  SLOTS,
  SLOTS_TELA,
  SLOTS_GALERIA_TELA,
  SLOTS_HITOS,
  tituloPagina,
  ordenPagina,
  estadoHueco,
  procedenciaDe,
  type EstadoHueco,
  type SlotImagen,
} from "../src/data/slots-imagen";
import { SLOTS_LLENOS } from "../src/data/imagenes.generado";

/** El estado de un hueco, resuelto contra el manifiesto. */
function estado(s: SlotImagen): EstadoHueco {
  return estadoHueco(s.id, SLOTS_LLENOS.has(s.id));
}

/** Los que hay que fotografiar: falta la foto, o la que hay no vale. */
function esPendiente(s: SlotImagen): boolean {
  return estado(s) !== "definitiva";
}

/**
 * El rótulo de estado que se imprime pegado a cada hueco. Va en mayúsculas y
 * delante del nombre del archivo a propósito: es lo primero que hay que saber
 * de un hueco, y a media lista uno deja de mirar en qué bloque estaba.
 */
function rotulo(s: SlotImagen): string {
  const e = estado(s);
  if (e === "falta") return "**FALTA**";
  if (e === "definitiva") return "**DEFINITIVA**";
  const p = procedenciaDe(s.id)?.procedencia;
  // Las dos de recoloreo llevan rótulo propio y no un «provisional» a secas:
  // piden cosas distintas —una, repetir la toma; la otra, solo el original a
  // color— y bajo la misma etiqueta las dos se leen como «hay que rehacerla».
  if (p === "no-apta") return "**PROVISIONAL · NO SIRVE PARA EL RECOLOREO**";
  if (p === "no-verificable") return "**PROVISIONAL · SIN VERIFICAR**";
  return p && p !== "sin-clasificar"
    ? "**PROVISIONAL**"
    : "**PROVISIONAL · PENDIENTE DE CLASIFICAR**";
}

/**
 * Por qué una foto que ya existe no cierra su hueco. Se imprime con la
 * evidencia detrás —el commit, el md5, la receta— para que quien lo lea pueda
 * comprobarlo en vez de creérselo: es el dato que decide si se repite una
 * sesión, y una afirmación sin respaldo no aguanta esa decisión.
 */
function motivoProvisional(s: SlotImagen): string[] {
  const foto = procedenciaDe(s.id);
  if (!foto) {
    return [
      "> **⚠ HAY FOTO, PERO NO CONSTA DE DÓNDE SALE.** No está clasificada en " +
        "`PROCEDENCIA_FOTO`. Hasta que alguien la mire no se puede dar por buena.",
    ];
  }
  const que: Record<string, string> = {
    maqueta: "Puesta solo para maquetar o valorar el tratamiento.",
    relleno: "Relleno, para que el hueco no se viera vacío.",
    generada: "Generada por IA.",
    banco: "De banco de imágenes.",
    "sin-clasificar": "NO CONSTA de dónde salió: hay que mirarla antes de decidir.",
    "no-apta":
      "La toma no cumple lo que la simulación de color necesita, y eso no se " +
      "arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela.",
    "no-verificable":
      "La foto que se ve puede estar bien; lo que falta es poder comprobarla. " +
      "NO hay que repetir la sesión: se pide el ORIGINAL A COLOR de esa misma " +
      "toma, que es el único que permite medir si la tela era cruda.",
  };
  const cabecera: Record<string, string> = {
    "sin-clasificar": "**⚠ PENDIENTE DE CLASIFICAR.**",
    "no-apta": "**⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.**",
    "no-verificable": "**⚠ HAY FOTO, Y NO SE PUEDE VERIFICAR.**",
  };
  return [
    `> ${cabecera[foto.procedencia] ?? "**⚠ HAY FOTO, PERO ES PROVISIONAL.**"} ` +
      `${que[foto.procedencia]} Según: ${foto.segun}`,
  ];
}

const RAIZ = join(import.meta.dirname, "..");
const SALIDA = join(RAIZ, "docs", "requisitos-fotografia.md");
const SALIDA_POR_PAGINA = join(RAIZ, "docs", "requisitos-fotografia-por-pagina.md");

interface Grupo {
  /** Nombre del tipo de toma. Es el título del bloque en el documento. */
  tipo: string;
  /** Qué es esta sesión de fotos, en una frase. */
  resumen: string;
  /** Tamaño al que se ve en pantalla, y de qué componente se leyó. */
  seVeA: string;
  /** Proporción del marco donde cae. */
  proporcion: string;
  /**
   * En qué se basa la clasificación. Se imprime en el documento: quien lo lea
   * tiene derecho a saber si el tipo está declarado o deducido.
   */
  segun: string;
  /**
   * `tabla` para grupos donde la nota es la misma para todos (las telas, la
   * segunda vista, los hitos): la especificación va una vez arriba y la tabla
   * solo lista qué telas son. `ficha` para los huecos únicos, donde cada uno
   * pide una cosa distinta y su nota es lo importante.
   */
  formato: "tabla" | "ficha";
  /**
   * Especificación de respaldo, para un grupo `tabla` cuyos slots no compartan
   * nota. Si la comparten —que es lo normal, porque se derivan del mismo sitio—
   * se imprime la del registro y esto no se usa: una especificación escrita
   * aquí en paralelo a la del registro es una que un día dirá otra cosa.
   */
  spec?: string;
  pertenece: (s: SlotImagen) => boolean;
}

const idsTela = new Set(SLOTS_TELA.map((s) => s.id));
const idsGaleria = new Set(SLOTS_GALERIA_TELA.map((s) => s.id));
const idsHito = new Set(SLOTS_HITOS.map((s) => s.id));

const GRUPOS: Grupo[] = [
  {
    tipo: "Macro de tela del catálogo",
    resumen:
      "El detalle del tejido de cada tela. Es la foto principal de su ficha y la miniatura de la rejilla de su familia. La más importante del encargo: sin ella una tela no se puede publicar.",
    seVeA:
      "ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)",
    proporcion: "4:3 apaisada — el marco de la galería es `aspect-4/3`",
    segun:
      "el origen del slot: salen de `SLOTS_TELA`, que se deriva de las subcategorías de `taxonomy.ts`, con nota común.",
    formato: "tabla",
    pertenece: (s) => idsTela.has(s.id),
  },
  {
    tipo: "Segunda vista de tela — el género en caída",
    resumen:
      "La segunda foto de la galería de cada tela: el mismo género drapeado, para que se vea el peso y la caída. Con ella la galería de la ficha se activa.",
    seVeA: "mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)",
    proporcion: "4:3 apaisada — el marco de la galería es `aspect-4/3`",
    segun: "el origen del slot: salen de `SLOTS_GALERIA_TELA`, con nota común.",
    formato: "tabla",
    pertenece: (s) => idsGaleria.has(s.id),
  },
  {
    tipo: "Card de familia de tela",
    resumen:
      "Las cuatro cards de la rejilla «Familias de tela». Una foto por familia, que se ve en la portada, en /productos y en el styleguide — cuatro archivos, no doce.",
    seVeA: "~310 × 300 px en la rejilla de cuatro columnas (`CategoryCard`)",
    proporcion: "casi cuadrada; se recorta a la card con `object-cover`",
    segun: "el origen del slot: prefijo `familia-`, con nota propia.",
    formato: "ficha",
    pertenece: (s) => s.id.startsWith("familia-"),
  },
  {
    tipo: "Cabecera de página",
    resumen:
      "El fondo fotográfico a sangre de la banda oscura de cabecera. Mientras falte, la cabecera se queda en tinta plana.",
    seVeA: "a sangre, 100% del ancho × 70vh (`FondoHero`)",
    proporcion: "muy apaisada; se recorta a 70vh",
    segun: "el origen del slot: prefijo `hero-`, con nota propia.",
    formato: "ficha",
    pertenece: (s) => s.id.startsWith("hero-"),
  },
  {
    tipo: "El taller por dentro — las cinco etapas",
    resumen:
      "El recorrido de la tela por la planta, una foto por etapa: desarrollo de color, tejido, tintura, control de calidad y envío. SE DISPARAN DEL TIRÓN, en una sola visita y siguiendo el orden de producción — es una sesión, no cinco encargos. Son las que sostienen los argumentos de la página de Empresa: el teñido a demanda y la ficha por rollo no se afirman, se enseñan.",
    seVeA:
      "una sola foto GRANDE a todo el ancho del contenedor, hasta ~1038 px, con 360 px de alto en móvil, 480 desde tablet y 560 en escritorio (`RielDeEtapas`)",
    proporcion:
      "apaisada, cerca de 2:1 en escritorio; se recorta con `object-cover`, así que el motivo tiene que aguantar del cuadrado al panorámico",
    segun:
      "el origen del slot: salen de `SLOTS_TALLER`, derivado de `data/etapas-taller.ts`, con nota por etapa.",
    formato: "ficha",
    pertenece: (s) => s.seccion === "El taller por dentro",
  },
  {
    tipo: "Díptico de misión y visión",
    resumen:
      "Las dos fotografías del bloque «Lo que nos mueve», una por declaración. Se ven UNA AL LADO DE LA OTRA y a la vez, así que tienen que distinguirse de un vistazo: la misión mira al material y la visión al color terminado. OJO SI YA SE HABÍA ANOTADO ESTA SESIÓN: se pidieron cuadradas en una versión anterior de este documento y ahora son apaisadas 4:3.",
    seVeA:
      "media anchura del contenedor amplio, hasta 607 × 455 px (`empresa/page.tsx`)",
    proporcion: "4:3 apaisada — el marco es `aspect-4/3`",
    segun: "la sección del slot: «Misión y visión», con nota propia.",
    formato: "ficha",
    pertenece: (s) => s.seccion === "Misión y visión",
  },
  {
    tipo: "Industrial / proceso",
    resumen:
      "La planta trabajando, fuera del riel de etapas. Hoy solo el retrato del taller que abre «De dónde venimos».",
    seVeA:
      "media columna del split de «De dónde venimos», hasta ~579 px de ancho (`empresa/page.tsx`)",
    proporcion: "4:5 vertical",
    segun: "la sección del slot: «Oficio», con nota propia.",
    formato: "ficha",
    pertenece: (s) => s.seccion === "Oficio",
  },
  {
    tipo: "Encuentros de la portada",
    resumen:
      "Las cuatro tarjetas del carrusel de encuentros. Van en la portada presentadas como cosas que la empresa hizo, así que aquí no vale material genérico: cada una tiene que ser ese encuentro y no uno parecido.",
    seVeA: "media anchura del carrusel, ~600 px (`EventCarousel`)",
    proporcion: "4:3 apaisada — el marco es `aspect-4/3`",
    segun: "la sección del slot: «Encuentros», con nota propia.",
    formato: "ficha",
    pertenece: (s) => s.seccion === "Encuentros",
  },
  {
    tipo: "Prendas del recomendador",
    resumen:
      "Las tres prendas del recomendador de /productos. OJO: estas tres se reutilizan recortadas a cuadrado en el asesor virtual, así que cada una tiene que funcionar en dos tamaños muy distintos. Está en la nota de cada una.",
    seVeA:
      "media anchura del recomendador, ~600 px (`GarmentRecommender`) — Y ADEMÁS 64 px (72 desde tablet) cuadrada en el asesor virtual (`AsesorWizard`)",
    proporcion: "4:3 apaisada, recortada a 1:1 en la miniatura",
    segun: "la sección del slot: «Recomendador», con nota propia.",
    formato: "ficha",
    pertenece: (s) => s.seccion === "Recomendador",
  },
  {
    tipo: "Línea de hitos — archivo histórico",
    resumen:
      "Fotos de archivo para la línea de tiempo de Empresa. OPCIONALES: la línea funciona sin ellas y no bloquean nada. Van al final de la prioridad.",
    seVeA: "columna lateral de 240 px de ancho (`Timeline`)",
    proporcion: "4:3 apaisada",
    segun: "el origen del slot: salen de `SLOTS_HITOS`, con nota común.",
    formato: "tabla",
    spec:
      "Foto de archivo del hito. Opcional: la línea de hitos funciona sin fotos, y un hito sin foto no se ve roto.",
    pertenece: (s) => idsHito.has(s.id),
  },
  {
    tipo: "Miniaturas del cuestionario del asesor",
    resumen:
      "Miniaturas cuadradas pequeñas que acompañan a cada opción del asesor virtual. Acompañan a la opción, no la lideran.",
    seVeA: "64 px (72 px desde tablet), cuadrada (`AsesorWizard`)",
    proporcion: "1:1",
    segun: "la sección del slot: «Opciones del cuestionario», con nota propia.",
    formato: "ficha",
    pertenece: (s) => s.seccion === "Opciones del cuestionario",
  },
  {
    tipo: "Asesor virtual",
    resumen:
      "Una foto grande y editorial por paso del cuestionario. Se cambian solas al avanzar el paso. OJO: el mismo bloque cierra la portada Y /empresa, así que cada archivo se ve en DOS páginas — son tres fotos, no seis.",
    seVeA:
      "media pantalla del split, mínimo 380 px de alto, solo desde tablet (`AsesorPasos`, montado en `app/page.tsx` y en `app/empresa/page.tsx`)",
    proporcion: "flexible — la caja recorta con `object-cover`",
    segun: "la sección del slot: «Asesor virtual», con nota propia.",
    formato: "ficha",
    pertenece: (s) => s.seccion === "Asesor virtual",
  },
];

/**
 * Huecos únicos que no caen en ningún grupo de arriba pero SÍ traen nota: la
 * nota dice qué se necesita, así que el encargo es claro aunque no formen una
 * sesión con otros. Van juntos al final, cada uno con lo suyo.
 */
const GRUPO_SUELTOS: Grupo = {
  tipo: "Huecos sueltos",
  resumen:
    "Tomas que no forman sesión con ninguna otra. Cada una pide una cosa distinta; la nota de cada slot es la especificación.",
  seVeA: "ver cada hueco",
  proporcion: "ver cada hueco",
  segun: "la nota propia de cada slot.",
  formato: "ficha",
  pertenece: () => false,
};

/** Cómo se ve cada hueco suelto, leído del componente que lo pinta. */
const VISUALIZACION_SUELTA: Record<string, { seVeA: string; proporcion: string }> = {
  "camisetas-jersey": {
    seVeA: "media columna, hasta ~620 px de ancho (`productos/camisetas/page.tsx`)",
    proporcion: "4:3 apaisada",
  },
  "camisetas-pique": {
    seVeA: "media columna, hasta ~620 px de ancho (`productos/camisetas/page.tsx`)",
    proporcion: "4:3 apaisada",
  },
  "retrato-asesor": {
    seVeA:
      "columna derecha del formulario de contacto; en móvil ocupa el ancho (`contacto/page.tsx`)",
    proporcion: "4:3 en móvil; en escritorio se estira a la altura del formulario",
  },
  "dortmund-plus-blancos-macro": {
    seVeA: "banda a todo el ancho del contenedor (`ProductGallery`)",
    proporcion: "21:9, muy apaisada",
  },
  "aplicacion-microfibra": {
    seVeA: "columna del bloque de aplicación, hasta ~560 px (`productos/microfibra/page.tsx`)",
    proporcion: "4:5 vertical",
  },
};

interface Clasificado {
  grupo: Grupo;
  slots: SlotImagen[];
}

/**
 * Reparte TODOS los slots en sus sesiones, no solo los que faltan: el documento
 * lista los tres estados, así que una sesión tiene que poder enseñar también lo
 * que ya está resuelto. Lo que cambia según el estado es cuánto se escribe de
 * cada hueco, y eso lo decide `bloque()`.
 */
function clasificar(todos: SlotImagen[]) {
  const porGrupo: Clasificado[] = GRUPOS.map((grupo) => ({ grupo, slots: [] }));
  const sueltos: SlotImagen[] = [];
  const sinTipoDeToma: SlotImagen[] = [];
  const resueltasSueltas: SlotImagen[] = [];

  for (const slot of todos) {
    const destino = porGrupo.find((g) => g.grupo.pertenece(slot));
    if (destino) {
      destino.slots.push(slot);
    } else if (!esPendiente(slot)) {
      // Ya resuelta y sin sesión con la que agruparse. No se pide, así que no
      // tiene sentido meterla en el encargo: se lista al final para que el
      // documento siga cuadrando con los 133.
      resueltasSueltas.push(slot);
    } else if (slot.nota) {
      // Sin grupo pero con nota: el encargo se entiende igual.
      sueltos.push(slot);
    } else {
      // Sin grupo y sin nota. NO se adivina el tipo por el nombre ni por el
      // alt: se marca aparte para que alguien escriba la nota que falta.
      sinTipoDeToma.push(slot);
    }
  }

  const orden = (a: SlotImagen, b: SlotImagen) =>
    ordenPagina(a.pagina) - ordenPagina(b.pagina) || a.id.localeCompare(b.id);
  for (const g of porGrupo) g.slots.sort(orden);
  sueltos.sort(orden);
  sinTipoDeToma.sort(orden);
  resueltasSueltas.sort(orden);

  return {
    porGrupo: porGrupo.filter((g) => g.slots.length),
    sueltos,
    sinTipoDeToma,
    resueltasSueltas,
  };
}

/** Cuenta de los tres estados en un conjunto de huecos. */
function cuenta(slots: SlotImagen[]) {
  const n = { falta: 0, provisional: 0, definitiva: 0 };
  for (const s of slots) n[estado(s)]++;
  return n;
}

/**
 * «1 provisionales» delata que el documento lo escribió una máquina, y con eso
 * se le empieza a creer menos el resto.
 */
function conteo(n: ReturnType<typeof cuenta>): string {
  return (
    `${n.falta} ${n.falta === 1 ? "falta" : "faltan"} · ` +
    `${n.provisional} provisional${n.provisional === 1 ? "" : "es"} · ` +
    `${n.definitiva} definitiva${n.definitiva === 1 ? "" : "s"}`
  );
}

/**
 * Los que no se han podido clasificar: hay foto y no consta de dónde sale.
 *
 * Se pregunta por lo que SON y no por descarte de lo que no son. Estaba escrito
 * al revés —una lista de las procedencias conocidas, y todo lo demás caía
 * aquí—, y al añadir `no-apta` y `no-verificable` veintidós telas medidas y
 * documentadas pasaron a figurar como «no consta de dónde salió». Un filtro por
 * exclusión da por desconocido todo lo que se invente después.
 */
function sinClasificarProcedencia(slots: SlotImagen[]): SlotImagen[] {
  return slots.filter((s) => {
    if (estado(s) !== "provisional") return false;
    const p = procedenciaDe(s.id)?.procedencia;
    return p === undefined || p === "sin-clasificar";
  });
}

function ubicacion(s: SlotImagen): string {
  return `${tituloPagina(s.pagina)} (\`${s.pagina}\`)${s.seccion ? ` · ${s.seccion}` : ""}`;
}

function ficha(s: SlotImagen): string[] {
  // El tamaño y la proporción solo se repiten aquí cuando este hueco tiene los
  // suyos; si son los del grupo ya están escritos arriba, y repetirlos en cada
  // ficha convierte el bloque en ruido que se deja de leer.
  const vista = VISUALIZACION_SUELTA[s.id];
  return [
    `#### ${rotulo(s)} \`${s.id}\``,
    "",
    `- **Nombre del archivo a entregar:** \`${s.id}.jpg\``,
    `- **Dónde va:** ${ubicacion(s)}`,
    ...(vista
      ? [`- **Se ve a:** ${vista.seVeA}`, `- **Proporción:** ${vista.proporcion}`]
      : []),
    `- **Ancho mínimo de entrega:** ${s.ancho} px`,
    `- **Qué debe verse:** ${s.alt || "—"}`,
    ...(s.nota ? [`- **Nota:** ${s.nota}`] : []),
    // Fuera de la lista y en negrita, a propósito: son lo único de la ficha que
    // hay que resolver ANTES de ir a fotografiar, y como un punto más de la
    // lista se leen al mismo nivel que el ancho de entrega.
    ...(estado(s) === "provisional" ? ["", ...motivoProvisional(s)] : []),
    ...(s.porConfirmar
      ? ["", `> **⚠ POR CONFIRMAR ANTES DE DISPARAR.** ${s.porConfirmar}`]
      : []),
    "",
  ];
}

function tabla(slots: SlotImagen[]): string[] {
  return [
    "| Estado | Archivo a entregar | Dónde va | Ancho mín. | Qué debe verse |",
    "|---|---|---|---|---|",
    ...slots.map(
      (s) =>
        `| ${rotulo(s)} | \`${s.id}.jpg\` | ${tituloPagina(s.pagina)} | ${s.ancho} px | ` +
        `${s.alt || "—"} |`,
    ),
    "",
  ];
}

/**
 * Las que ya están resueltas, en una línea cada una. No llevan ficha a
 * propósito: no se piden, así que el encuadre y el ancho de entrega no le hacen
 * falta a nadie. Están para que el bloque diga cuánto de la sesión queda hecho.
 */
function resueltas(slots: SlotImagen[]): string[] {
  if (!slots.length) return [];
  return [
    `**Ya resueltas — ${slots.length}.** No se piden.`,
    "",
    ...slots.map((s) => `- \`${s.id}.jpg\` — ${tituloPagina(s.pagina)}`),
    "",
  ];
}

/**
 * Las provisionales de un bloque, agrupadas por lo que hay que hacer con ellas.
 *
 * NO SE MEZCLAN, aunque las tres cuenten como provisionales. «No sirve para el
 * recoloreo» significa volver a montar la sesión con la tela delante; «no se
 * puede verificar» significa buscar un archivo que ya existe y mandarlo. Bajo un
 * mismo epígrafe, seis fotos que solo necesitan que alguien abra una carpeta se
 * leen como seis sesiones más, y eso cambia lo que el encargo parece costar.
 */
const AGRUPACION_PROVISIONAL: readonly (readonly [string, string, string])[] = [
  [
    "no-apta",
    "Hay foto, pero no sirve para el recoloreo",
    "Hay que **volver a fotografiar** estas telas: lo que falla es la toma, y " +
      "ninguno de estos defectos se corrige procesando el archivo.",
  ],
  [
    "no-verificable",
    "Hay foto, y no se puede verificar",
    "**No hay que repetir la sesión.** Lo publicado se ve bien; lo que falta es " +
      "el ORIGINAL A COLOR de esa misma toma, porque el archivo que tenemos " +
      "llegó ya en blanco y negro y sobre él no se puede comprobar si la tela " +
      "era cruda. Es buscar un archivo, no montar una sesión.",
  ],
];

function provisionalesAgrupadas(pendientes: SlotImagen[]): string[] {
  const provisionales = pendientes.filter((s) => estado(s) === "provisional");
  if (!provisionales.length) return [];

  const l: string[] = [];
  const yaPuestas = new Set<string>();

  for (const [clave, titulo, queSePide] of AGRUPACION_PROVISIONAL) {
    const suyas = provisionales.filter(
      (s) => procedenciaDe(s.id)?.procedencia === clave,
    );
    if (!suyas.length) continue;
    l.push(`#### ${titulo} — ${suyas.length}`, "", queSePide, "");
    for (const s of suyas) {
      yaPuestas.add(s.id);
      l.push(`\`${s.id}.jpg\` —`, ...motivoProvisional(s), "");
    }
  }

  // El resto (maqueta, relleno, sin clasificar…) va después y sin epígrafe: no
  // forman un encargo con nada, cada una es lo suyo.
  const resto = provisionales.filter((s) => !yaPuestas.has(s.id));
  for (const s of resto) l.push(`\`${s.id}.jpg\` —`, ...motivoProvisional(s), "");
  return l;
}

function bloque(grupo: Grupo, slots: SlotImagen[]): string[] {
  // La sesión es lo PENDIENTE: lo que falta más lo que hay que repetir porque
  // la foto que ocupa el hueco es provisional. Lo ya resuelto se lista al final
  // del bloque, en una línea por foto.
  const pendientes = slots.filter(esPendiente);
  const hechas = slots.filter((s) => !esPendiente(s));
  const n = cuenta(slots);

  const l: string[] = [
    `## ${grupo.tipo} — ${pendientes.length} ${pendientes.length === 1 ? "foto" : "fotos"}`,
    "",
    grupo.resumen,
    "",
    `- **Se ve a:** ${grupo.seVeA}`,
    `- **Proporción:** ${grupo.proporcion}`,
    `- **Estado:** ${conteo(n)}`,
    "",
  ];

  if (!pendientes.length) {
    l.push("**Sesión completa: no hay nada que pedir en este bloque.**", "");
  } else if (grupo.formato === "tabla") {
    // La especificación sale de la nota del registro cuando todas la comparten.
    // Así lo que lee marketing y lo que dice `slots-imagen.ts` no pueden
    // divergir: son el mismo texto.
    const comun = pendientes.every((s) => s.nota && s.nota === pendientes[0].nota)
      ? pendientes[0].nota
      : grupo.spec;
    if (comun) l.push(`**Qué se necesita, igual para todas:** ${comun}`, "");
    l.push(...tabla(pendientes));
    // Las provisionales de un grupo de tabla no caben en la fila: el motivo y
    // su evidencia son un párrafo. Van debajo, agrupadas por lo que PIDEN.
    l.push(...provisionalesAgrupadas(pendientes));
  } else {
    for (const s of pendientes) l.push(...ficha(s));
  }

  l.push(...resueltas(hechas));
  l.push(`> Clasificadas según ${grupo.segun}`, "");
  return l;
}

/**
 * La leyenda de los tres estados, en los dos documentos.
 *
 * Va arriba y no en un apéndice porque cambia lo que significa el documento:
 * antes listaba lo que faltaba, y «tiene foto» se leía como «hecho». La mitad
 * de las fotos que hay puestas son provisionales, así que esa lectura dejaba
 * fuera del encargo justo el material que hay que reemplazar.
 */
function leyendaDeEstados(): string[] {
  return [
    "## Los tres estados",
    "",
    "Aquí están **todos** los huecos del sitio, tengan foto o no. Que un hueco",
    "tenga imagen no quiere decir que esté resuelto:",
    "",
    "| Estado | Qué significa | ¿Se pide? |",
    "|---|---|---|",
    "| **FALTA** | No hay archivo. El sitio dibuja el marcador de hueco. | Sí |",
    "| **PROVISIONAL** | Hay foto, pero hay que reemplazarla. | Sí |",
    "| **DEFINITIVA** | Material real, en su sitio. | No |",
    "",
    "Las provisionales llevan debajo **por qué** lo son y **según qué** se ha",
    "determinado —el commit, el md5, la receta o la medida—, para que se pueda",
    "comprobar en vez de creérselo. No todas piden lo mismo:",
    "",
    "| Etiqueta | Qué pasa | Qué se pide |",
    "|---|---|---|",
    "| **PROVISIONAL** a secas | De maqueta, de relleno, generada o de banco. | La foto de verdad. |",
    "| **NO SIRVE PARA EL RECOLOREO** | La medida del sitio rechaza la toma: tela teñida, dominante, zona quemada o subexposición. | **Volver a fotografiar** la tela. |",
    "| **SIN VERIFICAR** | El original llegó ya en blanco y negro, así que no se puede comprobar si la tela era cruda. Lo publicado suele verse bien. | **El original a color** de esa misma toma. No hay que repetir la sesión. |",
    "| **PENDIENTE DE CLASIFICAR** | No consta de dónde salió el archivo. | Mirarla y decidir. |",
    "",
    "Las dos del medio salen de medir las fotos, no de opinar sobre ellas: el",
    "croma, los píxeles quemados y la luminancia de cada original están en el",
    "`Según` de cada una y se recalculan con `npm run imagenes:medir`.",
    "",
    "Y **PENDIENTE DE CLASIFICAR** no se ha adivinado a propósito: una",
    "clasificación inventada se lee igual que una comprobada y ya nadie vuelve a",
    "revisarla.",
    "",
  ];
}

/**
 * Cómo se dispara y cómo se entrega. Es lo mismo para los 133 huecos, así que
 * no cabe en la nota de ninguno: va una vez, al final, en los dos documentos.
 *
 * VIVÍA SOLO EN EL PDF que se mandó a marketing, y por eso se pierde: el PDF no
 * se regenera, así que el día que cambie el proceso habrá dos versiones y la
 * que se lee será la vieja. Aquí se genera con lo demás.
 */
function procesoDeEntrega(): string[] {
  return [
    "## Proceso de entrega",
    "",
    "Vale para todas las fotos de este documento. Son cinco cosas, y ninguna es",
    "de gusto: cada una tapa un fallo concreto que ya ha pasado.",
    "",
    "### 1. El nombre del archivo es lo único que hay que acertar",
    "",
    "Cada hueco espera un archivo con **su nombre exacto** (`athletic.jpg`,",
    "`hero-empresa.jpg`…), el que aparece en su ficha aquí. La extensión da igual",
    "—`.jpg`, `.png`, `.webp`, `.tif`—; el nombre, no.",
    "",
    "Con el nombre bien puesto la foto entra en la web sin tocar código. Mal",
    "puesto **no da error**: deja el hueco vacío y parece un fallo de la web. Por",
    "eso el nombre va en cada ficha y por eso se pide así de literal.",
    "",
    "### 2. El original de cámara, sin re-exportar ni comprimir",
    "",
    "Se entrega el archivo **tal y como sale de la cámara**. Sin re-exportar, sin",
    "volver a comprimir y sin redimensionar.",
    "",
    "El sitio genera sus propios tamaños y su propio WebP a partir de lo que",
    "llegue. Un JPEG que ya venía comprimido y se vuelve a comprimir pierde dos",
    "veces, y esa pérdida no se recupera después: se ve como grano sucio en los",
    "macros de tejido, que es justo donde hay que leer la trama. El ancho mínimo",
    "de cada ficha es sobre el original, no sobre una copia reducida.",
    "",
    "### 3. Sin editar",
    "",
    "Sin filtros, sin virados, sin recortes «para que quede mejor», y **sin",
    "rótulos, logotipos ni tipografía quemados sobre la imagen**. Un rótulo",
    "quemado no se quita con un recorte y deja la foto inservible para la web.",
    "",
    "El recorte lo hace el sitio, que sabe a qué proporción va cada hueco y que",
    "recorta distinto el mismo archivo según dónde se use —hay fotos que salen",
    "apaisadas en un sitio y cuadradas en otro—. Una foto ya recortada a mano",
    "solo sirve para uno de los dos.",
    "",
    "### 4. Trípode, con exposición y enfoque bloqueados",
    "",
    "Dentro de una misma serie —las telas del catálogo son la serie grande— las",
    "tomas tienen que ser **comparables entre sí**. Si la cámara vuelve a medir y",
    "a enfocar en cada disparo, dos telas del mismo lote salen con luminancias",
    "distintas y la ficha las enseña como si fueran géneros distintos, cuando lo",
    "único que cambió fue el automatismo.",
    "",
    "En las telas que alimentan la simulación de color esto además decide si la",
    "foto sirve o no: el recoloreo multiplica canal a canal, así que la",
    "exposición y la dominante de la toma son el resultado, no un ajuste",
    "posterior.",
    "",
    "### 5. Entrega por la carpeta compartida",
    "",
    "Un archivo por hueco, con su nombre, en la carpeta compartida.",
    "",
    "**No por correo ni por mensajería.** Los dos recomprimen y bajan la",
    "resolución «para que quepa», que es exactamente lo que pide evitar el punto",
    "2 — y lo hacen en silencio, así que el archivo llega con aspecto correcto y",
    "la mitad de la información.",
    "",
    "### Y una restricción que no es de fotografía",
    "",
    "**Un hueco que afirma algo nuestro no admite imagen generada ni de banco.**",
    "Si el hueco dice «nuestra planta», «nuestros clientes» o «nuestro asesor»,",
    "la imagen tiene que documentar eso de verdad. Una imagen generada puede",
    "estar perfectamente licenciada y seguir siendo una afirmación falsa sobre la",
    "empresa; la licencia resuelve el derecho a usarla, no el que diga la verdad.",
    "Para huecos de ambiente, sin afirmación, no hay problema.",
    "",
    "**Una persona real identificable necesita su autorización**, que no es lo",
    "mismo que una licencia de stock: marketing puede tener la licencia y seguir",
    "faltando el permiso de quien sale en la foto.",
    "",
    "El registro completo de qué material está bloqueado y por qué está en",
    "`README-imagenes.md` §5 y en `npm run catalogo`.",
    "",
  ];
}

// ---------------------------------------------------------------------------
// Vista por página
// ---------------------------------------------------------------------------

/**
 * Cómo se ve UN hueco concreto: lo suyo propio si lo tiene declarado, y si no
 * lo de su grupo.
 *
 * La vista por tipo puede escribir el tamaño y la proporción una sola vez, en
 * la cabecera del bloque, porque ahí todos los huecos comparten sesión. En la
 * vista por página no: un hueco aparece solo, entre los de su sección, sin
 * hermanos de los que heredar la especificación — y el tamaño al que se ve es
 * justo el dato que no se puede deducir mirando la página.
 *
 * Sale de las MISMAS dos tablas que la otra vista (`VISUALIZACION_SUELTA` y
 * `GRUPOS`). No hay una tercera con los mismos datos: corregir un `className`
 * desfasado se hace en un sitio y las dos vistas quedan corregidas.
 */
function visualizacion(s: SlotImagen): { seVeA: string; proporcion: string } {
  const propia = VISUALIZACION_SUELTA[s.id];
  if (propia) return propia;
  const grupo = GRUPOS.find((g) => g.pertenece(s));
  if (grupo) return { seVeA: grupo.seVeA, proporcion: grupo.proporcion };
  // Sin grupo y sin visualización propia. No se inventa un tamaño plausible:
  // se marca como lo que es, que es lo que hace que alguien lo escriba.
  return { seVeA: "— sin declarar —", proporcion: "— sin declarar —" };
}

/** Título del bloque de huecos que no declaran sección. */
const SIN_SECCION = "Contenido principal";

/**
 * Los huecos de una página repartidos en sus secciones, en el orden en que se
 * leen: la cabecera primero —es lo primero que se ve de la página—, después los
 * huecos sin sección, que son su contenido principal, y al final las secciones
 * restantes en el orden en que están registradas en `slots-imagen.ts`.
 *
 * El orden de registro es el de la página, así que se respeta. Alfabético las
 * barajaría sin criterio: «Encuentros» antes que «Oficio» no significa nada.
 */
function seccionesDe(slots: SlotImagen[]): { titulo: string; slots: SlotImagen[] }[] {
  const porSeccion = new Map<string, SlotImagen[]>();
  for (const s of slots) {
    const clave = s.seccion ?? SIN_SECCION;
    const lista = porSeccion.get(clave) ?? [];
    lista.push(s);
    porSeccion.set(clave, lista);
  }
  const rango = (titulo: string) =>
    titulo === "Cabecera" ? 0 : titulo === SIN_SECCION ? 1 : 2;
  // `Map` conserva el orden de inserción, así que el índice de la entrada ES el
  // orden de registro y sirve de desempate.
  return [...porSeccion.entries()]
    .map(([titulo, lista], registro) => ({ titulo, slots: lista, registro }))
    .sort((a, b) => rango(a.titulo) - rango(b.titulo) || a.registro - b.registro)
    .map(({ titulo, slots: lista }) => ({ titulo, slots: lista }));
}

/**
 * Ficha de un hueco en la vista por página. A diferencia de `ficha()`, aquí el
 * tamaño y la proporción van SIEMPRE: son el motivo de esta vista.
 *
 * Las definitivas salen en una línea. No es que importen menos: es que no se
 * piden, y una ficha entera de encuadre y ancho de entrega para una foto que ya
 * está hecha es ruido entre las que sí hay que disparar.
 */
function fichaPorPagina(s: SlotImagen): string[] {
  if (!esPendiente(s)) {
    return [`#### ${rotulo(s)} \`${s.id}.jpg\``, "", "No se pide: ya está resuelta.", ""];
  }
  const { seVeA, proporcion } = visualizacion(s);
  return [
    `#### ${rotulo(s)} \`${s.id}.jpg\``,
    "",
    `- **Se ve a:** ${seVeA}`,
    `- **Proporción:** ${proporcion}`,
    `- **Ancho mínimo de entrega:** ${s.ancho} px`,
    `- **Qué debe verse:** ${s.alt || "—"}`,
    ...(s.nota ? [`- **Nota:** ${s.nota}`] : []),
    ...(estado(s) === "provisional" ? ["", ...motivoProvisional(s)] : []),
    ...(s.porConfirmar
      ? ["", `> **⚠ POR CONFIRMAR ANTES DE DISPARAR.** ${s.porConfirmar}`]
      : []),
    "",
  ];
}

/**
 * El documento por página. Recibe los mismos slots que la vista por tipo —no los
 * recalcula— para que las dos no puedan contar cosas distintas.
 */
function documentoPorPagina(todos: SlotImagen[]): string {
  const porPagina = new Map<string, SlotImagen[]>();
  for (const s of todos) {
    const lista = porPagina.get(s.pagina) ?? [];
    lista.push(s);
    porPagina.set(s.pagina, lista);
  }
  const paginas = [...porPagina.entries()].sort(
    ([a], [b]) => ordenPagina(a) - ordenPagina(b),
  );
  const n = cuenta(todos);
  const pendientesDeClasificar = sinClasificarProcedencia(todos);

  const l: string[] = [
    "# Requisitos de fotografía por página — Textil Padilla",
    "",
    "Qué le falta a CADA PÁGINA para poder publicarse completa: sus secciones, y",
    "dentro de cada una todos sus huecos de imagen con su estado.",
    "",
    "**GENERADO — no editar a mano.** Sale del registro de slots y del manifiesto",
    "de imágenes. Se regenera con `npm run imagenes:requisitos`, que escribe este",
    "documento y su pareja a la vez.",
    "",
    "Es la **segunda vista de `requisitos-fotografia.md`**, no otro encargo: los",
    "mismos huecos, ordenados por dónde van en vez de por qué sesión los dispara.",
    "Para salir a fotografiar sirve la otra —cada bloque suyo es una sesión—; esta",
    "sirve para revisar el sitio página a página y para priorizar por página.",
    "",
    ...leyendaDeEstados(),
    "## Resumen",
    "",
    `Los **${SLOTS.length} huecos** de imagen del sitio, repartidos en ` +
      `**${paginas.length} páginas**:`,
    "",
    `- **Faltan ${n.falta}** — no hay archivo.`,
    `- **Provisionales ${n.provisional}** — hay foto, pero hay que reemplazarla.` +
      (pendientesDeClasificar.length
        ? ` De estas, **${pendientesDeClasificar.length} están pendientes de clasificar**.`
        : ""),
    `- **Definitivas ${n.definitiva}** — no se piden.`,
    "",
    `**Hay que conseguir ${n.falta + n.provisional} fotos**, no ${n.falta}.`,
    "",
    "| Página | Faltan | Provisionales | Definitivas | Total |",
    "|---|---|---|---|---|",
    ...paginas.map(([ruta, slots]) => {
      const c = cuenta(slots);
      return (
        `| [${tituloPagina(ruta)}](#${anclaPagina(ruta)}) (\`${ruta}\`) | ${c.falta} | ` +
        `${c.provisional} | ${c.definitiva} | ${slots.length} |`
      );
    }),
    "",
    "---",
    "",
  ];

  for (const [ruta, slots] of paginas) {
    const c = cuenta(slots);
    l.push(
      `## ${tituloPagina(ruta)} — \`${ruta}\``,
      "",
      `**${conteo(c)}** — ${slots.length} huecos en total. ` +
        (c.falta + c.provisional === 0
          ? "Página resuelta: no se pide nada."
          : `Quedan ${c.falta + c.provisional} fotos por conseguir.`),
      "",
    );
    for (const { titulo, slots: deSeccion } of seccionesDe(slots)) {
      const cs = cuenta(deSeccion);
      l.push(
        `### ${titulo} — ${deSeccion.length}` +
          (cs.falta + cs.provisional
            ? ` (${cs.falta + cs.provisional} por conseguir)`
            : " (resuelta)"),
        "",
      );
      for (const s of deSeccion) l.push(...fichaPorPagina(s));
    }
    l.push("---", "");
  }

  l.push(...procesoDeEntrega(), "---", "");

  l.push(
    "## Avisos",
    "",
    "Son los mismos de `requisitos-fotografia.md`, y valen igual aquí:",
    "",
    "**El recoloreo se decide al disparar, no al procesar.** Las telas del catálogo",
    "alimentan la simulación de color de su ficha, y eso impone condiciones a la TOMA",
    "—tela sin teñir, luz neutra, sin quemados— que no tienen arreglo posterior.",
    "",
    "**Material que no puede ir en cualquier hueco.** Ver `README-imagenes.md` §5:",
    "el material generado por IA no puede ocupar un hueco que afirme algo nuestro",
    "(«nuestra planta», «nuestro asesor»), y `retrato-asesor` es una persona real y",
    "necesita su autorización, que no es lo mismo que una licencia.",
    "",
  );

  return l.join("\n");
}

/**
 * Ancla del encabezado `## Título — /ruta` tal y como la genera GitHub, para que
 * el índice del resumen enlace de verdad. Escrita a mano porque el algoritmo es
 * fijo: minúsculas, fuera todo lo que no sea letra, número, guion o espacio, y
 * los espacios a guiones.
 *
 * SIN `trim()`, aunque parezca que sobra espacio. GitHub no lo hace: quita la
 * puntuación y convierte a guion los espacios que esa puntuación deja sueltos,
 * y de ahí salen los guiones dobles de `empresa--empresa`. Recortarlos aquí
 * daría un ancla más limpia que no existe en el documento — el título de Inicio
 * es «Inicio — /», que termina en puntuación, y su ancla real es `inicio--`.
 */
function anclaPagina(ruta: string): string {
  return `${tituloPagina(ruta)} — ${ruta}`
    .toLowerCase()
    .replace(/[^\p{L}\p{N} -]/gu, "")
    .replace(/ /g, "-");
}

function main() {
  const { porGrupo, sueltos, sinTipoDeToma, resueltasSueltas } = clasificar(SLOTS);
  const n = cuenta(SLOTS);
  const pendientesDeClasificar = sinClasificarProcedencia(SLOTS);
  // Se recogen aparte de la clasificación: un `porConfirmar` no cambia a qué
  // sesión pertenece el hueco, solo que hay que decidir algo antes de ir.
  const porConfirmar = SLOTS.filter((s) => s.porConfirmar && esPendiente(s));

  const l: string[] = [
    "# Requisitos de fotografía — Textil Padilla",
    "",
    "Lo que hay que fotografiar para que el sitio quede completo, agrupado por",
    "tipo de toma: cada bloque es una sesión.",
    "",
    "**GENERADO — no editar a mano.** Sale del registro de slots y del manifiesto",
    "de imágenes. Se regenera con `npm run imagenes:requisitos`, y una foto",
    "definitiva deja de pedirse sola.",
    "",
    "Los mismos huecos ordenados por dónde van, página a página, están en",
    "`requisitos-fotografia-por-pagina.md`. Esta vista es la de salir a",
    "fotografiar: cada bloque es una sesión. Aquélla es la de revisar el sitio.",
    "",
    ...leyendaDeEstados(),
    "## Resumen",
    "",
    `Los **${SLOTS.length} huecos** de imagen del sitio:`,
    "",
    `- **Faltan ${n.falta}** — no hay archivo.`,
    `- **Provisionales ${n.provisional}** — hay foto, pero hay que reemplazarla.` +
      (pendientesDeClasificar.length
        ? ` De estas, **${pendientesDeClasificar.length} están pendientes de clasificar**.`
        : ""),
    `- **Definitivas ${n.definitiva}** — no se piden.`,
    "",
    `**Hay que conseguir ${n.falta + n.provisional} fotos**, no ${n.falta}: ` +
      "las provisionales ocupan su hueco pero no lo cierran.",
    "",
    "| Tipo de toma | Faltan | Provisionales | Definitivas |",
    "|---|---|---|---|",
    ...porGrupo.map((g) => {
      const c = cuenta(g.slots);
      return `| ${g.grupo.tipo} | ${c.falta} | ${c.provisional} | ${c.definitiva} |`;
    }),
    ...(sueltos.length
      ? [
          `| ${GRUPO_SUELTOS.tipo} | ${cuenta(sueltos).falta} | ` +
            `${cuenta(sueltos).provisional} | ${cuenta(sueltos).definitiva} |`,
        ]
      : []),
    ...(sinTipoDeToma.length
      ? [`| **Sin tipo de toma asignado** | ${cuenta(sinTipoDeToma).falta} | ` +
         `${cuenta(sinTipoDeToma).provisional} | ${cuenta(sinTipoDeToma).definitiva} |`]
      : []),
    ...(resueltasSueltas.length
      ? [`| Ya resueltas, fuera de sesión | 0 | 0 | ${resueltasSueltas.length} |`]
      : []),
    "",
    ...(pendientesDeClasificar.length
      ? [
          `## Pendientes de clasificar — ${pendientesDeClasificar.length}`,
          "",
          "**Tienen foto y no consta de dónde salió.** No se ha adivinado: hasta que",
          "alguien las mire no se puede decir si son las buenas o hay que repetirlas.",
          "Van contadas como provisionales porque un hueco sin confirmar no se puede",
          "cerrar, pero puede que alguna resulte definitiva y salga del encargo.",
          "",
          ...pendientesDeClasificar.map(
            (s) => `- **\`${s.id}\`** — ${procedenciaDe(s.id)?.segun ?? "no consta nada."}`,
          ),
          "",
        ]
      : []),
    ...(porConfirmar.length
      ? [
          `## Hay que decidir esto antes de la sesión — ${porConfirmar.length}`,
          "",
          "No son dudas de fotografía sino de contenido: qué va en el hueco. Cada",
          "uno tiene su nota escrita con lo que se sabe hoy y se puede disparar así,",
          "pero si la decisión cae del otro lado la toma no sirve y hay que repetirla.",
          "",
          ...porConfirmar.map((s) => `- **\`${s.id}\`** — ${s.porConfirmar}`),
          "",
        ]
      : []),
    "---",
    "",
  ];

  for (const g of porGrupo) l.push(...bloque(g.grupo, g.slots), "---", "");
  if (sueltos.length) l.push(...bloque(GRUPO_SUELTOS, sueltos), "---", "");

  if (sinTipoDeToma.length) {
    l.push(
      `## Sin tipo de toma asignado — ${sinTipoDeToma.length}`,
      "",
      "**Estos huecos no llevan nota, así que no se les ha asignado tipo de toma.**",
      "El `alt` de cada uno dice qué se espera ver, pero eso describe el contenido,",
      "no el encargo: no dice el encuadre, el formato ni el tratamiento. Antes de",
      "mandar el documento hay que escribirles la nota en `slots-imagen.ts` — o",
      "decidir que se piden así, a partir del `alt` y nada más.",
      "",
      "Se listan aparte a propósito. Meterlos en el grupo que más se les parece",
      "sería inventarles un encargo que nadie escribió.",
      "",
      ...tabla(sinTipoDeToma),
      "---",
      "",
    );
  }

  if (resueltasSueltas.length) {
    l.push(
      `## Ya resueltas, fuera de sesión — ${resueltasSueltas.length}`,
      "",
      "Fotos definitivas que no forman sesión con ninguna otra. **No se piden.**",
      "Están aquí para que el documento cuadre con los",
      `${SLOTS.length} huecos del sitio y no parezca que faltan.`,
      "",
      ...resueltasSueltas.map(
        (s) => `- \`${s.id}.jpg\` — ${ubicacion(s)}`,
      ),
      "",
      "---",
      "",
    );
  }

  l.push(...procesoDeEntrega(), "---", "");

  l.push(
    "## Avisos",
    "",
    "**El recoloreo se decide al disparar, no al procesar.** Las telas del catálogo",
    "alimentan la simulación de color de su ficha, y eso impone condiciones a la TOMA",
    "que están escritas en su bloque: tela sin teñir, luz neutra, sin quemados. No hay",
    "corrección posterior para ninguna de las tres — una tela ya teñida o una toma con",
    "dominante cálida obligan a repetir la sesión, no a reprocesar el archivo.",
    "",
  );

  writeFileSync(SALIDA, l.join("\n"), "utf8");

  // La segunda vista, de los MISMOS slots: no se vuelven a calcular, para que
  // las dos no puedan contar cosas distintas.
  writeFileSync(SALIDA_POR_PAGINA, documentoPorPagina(SLOTS), "utf8");
  const paginasConHuecos = new Set(SLOTS.map((s) => s.pagina)).size;

  console.log(
    `\n${SLOTS.length} huecos — faltan ${n.falta} · ${n.provisional} provisionales · ` +
      `${n.definitiva} definitivas` +
      `\n  hay que conseguir ${n.falta + n.provisional} fotos` +
      (pendientesDeClasificar.length
        ? `\n  ${pendientesDeClasificar.length} PENDIENTES DE CLASIFICAR: ` +
          pendientesDeClasificar.map((s) => s.id).join(", ")
        : "") +
      (sinTipoDeToma.length
        ? `\n  ${sinTipoDeToma.length} SIN TIPO DE TOMA (les falta la nota)`
        : "") +
      `\n\ndocs/requisitos-fotografia.md — ${porGrupo.length} tipos de toma` +
      (sueltos.length ? `, ${sueltos.length} sueltos` : "") +
      `\ndocs/requisitos-fotografia-por-pagina.md — ${paginasConHuecos} páginas\n`,
  );
}

main();
