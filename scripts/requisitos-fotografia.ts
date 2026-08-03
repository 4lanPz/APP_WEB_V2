/**
 * Genera el documento de fotografía que se le envía a marketing, en sus dos
 * vistas.
 *
 *   npm run imagenes:requisitos  ->  docs/requisitos-fotografia.md
 *                                ->  docs/requisitos-fotografia-por-pagina.md
 *
 * Es el inventario de los slots VACÍOS —los que faltan— agrupados por el tipo de
 * toma que requieren, porque con 88 huecos una lista plana no es un encargo: es
 * una lista de tareas sin prioridad que nadie sabe por dónde empezar. Agrupados
 * por tipo, cada bloque es una sesión de fotos.
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
  type SlotImagen,
} from "../src/data/slots-imagen";
import { SLOTS_LLENOS } from "../src/data/imagenes.generado";

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
    tipo: "Industrial / proceso",
    resumen:
      "La planta trabajando. Son las que sostienen los argumentos de la página de Empresa — el teñido a demanda no se afirma, se enseña.",
    seVeA: "media columna del bloque de Oficio, hasta ~620 px de ancho (`empresa/page.tsx`)",
    proporcion: "4:3 apaisada",
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
    tipo: "Asesor virtual en portada",
    resumen:
      "Una foto grande y editorial por paso del cuestionario en la portada. Se cambian solas al avanzar el paso.",
    seVeA:
      "media pantalla del split, mínimo 380 px de alto, solo desde tablet (`AsesorPasos`)",
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

function clasificar(vacios: SlotImagen[]) {
  const porGrupo: Clasificado[] = GRUPOS.map((grupo) => ({ grupo, slots: [] }));
  const sueltos: SlotImagen[] = [];
  const sinClasificar: SlotImagen[] = [];

  for (const slot of vacios) {
    const destino = porGrupo.find((g) => g.grupo.pertenece(slot));
    if (destino) {
      destino.slots.push(slot);
    } else if (slot.nota) {
      // Sin grupo pero con nota: el encargo se entiende igual.
      sueltos.push(slot);
    } else {
      // Sin grupo y sin nota. NO se adivina el tipo por el nombre ni por el
      // alt: se marca aparte para que alguien escriba la nota que falta.
      sinClasificar.push(slot);
    }
  }

  const orden = (a: SlotImagen, b: SlotImagen) =>
    ordenPagina(a.pagina) - ordenPagina(b.pagina) || a.id.localeCompare(b.id);
  for (const g of porGrupo) g.slots.sort(orden);
  sueltos.sort(orden);
  sinClasificar.sort(orden);

  return { porGrupo: porGrupo.filter((g) => g.slots.length), sueltos, sinClasificar };
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
    `#### \`${s.id}\``,
    "",
    `- **Nombre del archivo a entregar:** \`${s.id}.jpg\``,
    `- **Dónde va:** ${ubicacion(s)}`,
    ...(vista
      ? [`- **Se ve a:** ${vista.seVeA}`, `- **Proporción:** ${vista.proporcion}`]
      : []),
    `- **Ancho mínimo de entrega:** ${s.ancho} px`,
    `- **Qué debe verse:** ${s.alt || "—"}`,
    ...(s.nota ? [`- **Nota:** ${s.nota}`] : []),
    // Fuera de la lista y en negrita, a propósito: es lo único de la ficha que
    // hay que resolver ANTES de ir a fotografiar, y como un punto más de la
    // lista se lee al mismo nivel que el ancho de entrega.
    ...(s.porConfirmar
      ? ["", `> **⚠ POR CONFIRMAR ANTES DE DISPARAR.** ${s.porConfirmar}`]
      : []),
    "",
  ];
}

function tabla(slots: SlotImagen[]): string[] {
  return [
    "| Archivo a entregar | Dónde va | Ancho mín. | Qué debe verse |",
    "|---|---|---|---|",
    ...slots.map(
      (s) =>
        `| \`${s.id}.jpg\` | ${tituloPagina(s.pagina)} | ${s.ancho} px | ${s.alt || "—"} |`,
    ),
    "",
  ];
}

function bloque(grupo: Grupo, slots: SlotImagen[]): string[] {
  const l: string[] = [
    `## ${grupo.tipo} — ${slots.length} ${slots.length === 1 ? "foto" : "fotos"}`,
    "",
    grupo.resumen,
    "",
    `- **Se ve a:** ${grupo.seVeA}`,
    `- **Proporción:** ${grupo.proporcion}`,
    "",
  ];
  if (grupo.formato === "tabla") {
    // La especificación sale de la nota del registro cuando todas la comparten.
    // Así lo que lee marketing y lo que dice `slots-imagen.ts` no pueden
    // divergir: son el mismo texto.
    const comun = slots.every((s) => s.nota && s.nota === slots[0].nota)
      ? slots[0].nota
      : grupo.spec;
    if (comun) l.push(`**Qué se necesita, igual para todas:** ${comun}`, "");
    l.push(...tabla(slots));
  } else {
    for (const s of slots) l.push(...ficha(s));
  }
  l.push(`> Clasificadas según ${grupo.segun}`, "");
  return l;
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
 */
function fichaPorPagina(s: SlotImagen): string[] {
  const { seVeA, proporcion } = visualizacion(s);
  return [
    `#### \`${s.id}.jpg\``,
    "",
    `- **Se ve a:** ${seVeA}`,
    `- **Proporción:** ${proporcion}`,
    `- **Ancho mínimo de entrega:** ${s.ancho} px`,
    `- **Qué debe verse:** ${s.alt || "—"}`,
    ...(s.nota ? [`- **Nota:** ${s.nota}`] : []),
    ...(s.porConfirmar
      ? ["", `> **⚠ POR CONFIRMAR ANTES DE DISPARAR.** ${s.porConfirmar}`]
      : []),
    "",
  ];
}

/**
 * El documento por página. Recibe los mismos `vacios` que la vista por tipo —no
 * los recalcula— para que las dos no puedan contar cosas distintas.
 */
function documentoPorPagina(vacios: SlotImagen[]): string {
  // Total de huecos por página, vacíos y llenos: sin el denominador, una página
  // con dos huecos pendientes de nueve se lee igual que una con dos de dos.
  const totalPorPagina = new Map<string, number>();
  for (const s of SLOTS) {
    totalPorPagina.set(s.pagina, (totalPorPagina.get(s.pagina) ?? 0) + 1);
  }

  const porPagina = new Map<string, SlotImagen[]>();
  for (const s of vacios) {
    const lista = porPagina.get(s.pagina) ?? [];
    lista.push(s);
    porPagina.set(s.pagina, lista);
  }
  const paginas = [...porPagina.entries()].sort(
    ([a], [b]) => ordenPagina(a) - ordenPagina(b),
  );

  const l: string[] = [
    "# Requisitos de fotografía por página — Textil Padilla",
    "",
    "Lo que le falta a CADA PÁGINA para poder publicarse completa: sus secciones,",
    "y dentro de cada una los huecos que siguen vacíos con su especificación.",
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
    "Los huecos que YA tienen foto no se listan, igual que en la otra vista: este",
    "documento es lo que falta. El «faltan X de Y» de cada página da el total real,",
    "y `npm run imagenes:slots` lista todos los huecos, llenos incluidos.",
    "",
    "## Resumen",
    "",
    `De **${SLOTS.length} huecos** de imagen del sitio, **${SLOTS_LLENOS.size} tienen foto** y ` +
      `**faltan ${vacios.length}**, repartidos en **${paginas.length} páginas**.`,
    "",
    "| Página | Faltan | De |",
    "|---|---|---|",
    ...paginas.map(
      ([ruta, slots]) =>
        `| [${tituloPagina(ruta)}](#${anclaPagina(ruta)}) (\`${ruta}\`) | ${slots.length} | ` +
        `${totalPorPagina.get(ruta) ?? slots.length} |`,
    ),
    "",
    "---",
    "",
  ];

  for (const [ruta, slots] of paginas) {
    const total = totalPorPagina.get(ruta) ?? slots.length;
    l.push(
      `## ${tituloPagina(ruta)} — \`${ruta}\``,
      "",
      `**Faltan ${slots.length} de ${total} huecos.**`,
      "",
    );
    for (const { titulo, slots: deSeccion } of seccionesDe(slots)) {
      l.push(`### ${titulo} — ${deSeccion.length}`, "");
      for (const s of deSeccion) l.push(...fichaPorPagina(s));
    }
    l.push("---", "");
  }

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
  const vacios = SLOTS.filter((s) => !SLOTS_LLENOS.has(s.id));
  const { porGrupo, sueltos, sinClasificar } = clasificar(vacios);
  // Se recogen aparte de la clasificación: un `porConfirmar` no cambia a qué
  // sesión pertenece el hueco, solo que hay que decidir algo antes de ir.
  const porConfirmar = vacios.filter((s) => s.porConfirmar);

  const l: string[] = [
    "# Requisitos de fotografía — Textil Padilla",
    "",
    "Lo que falta fotografiar para que el sitio quede completo, agrupado por tipo",
    "de toma: cada bloque es una sesión.",
    "",
    "**GENERADO — no editar a mano.** Sale del registro de slots y del manifiesto",
    "de imágenes. Se regenera con `npm run imagenes:requisitos`, y una foto",
    "entregada desaparece sola de este documento.",
    "",
    "Los mismos huecos ordenados por dónde van, página a página, están en",
    "`requisitos-fotografia-por-pagina.md`. Esta vista es la de salir a",
    "fotografiar: cada bloque es una sesión. Aquélla es la de revisar el sitio.",
    "",
    "## Resumen",
    "",
    `De **${SLOTS.length} huecos** de imagen del sitio, **${SLOTS_LLENOS.size} tienen foto** y ` +
      `**faltan ${vacios.length}**.`,
    "",
    "| Tipo de toma | Faltan |",
    "|---|---|",
    ...porGrupo.map((g) => `| ${g.grupo.tipo} | ${g.slots.length} |`),
    ...(sueltos.length ? [`| ${GRUPO_SUELTOS.tipo} | ${sueltos.length} |`] : []),
    ...(sinClasificar.length ? [`| **Sin clasificar** | ${sinClasificar.length} |`] : []),
    "",
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
    "**El nombre del archivo es lo único que hay que acertar.** Cada hueco espera",
    "un archivo con su nombre exacto (`athletic.jpg`, `hero-empresa.jpg`…). La",
    "extensión da igual. Con el nombre bien puesto la foto entra en la web sin",
    "tocar código.",
    "",
    "---",
    "",
  ];

  for (const g of porGrupo) l.push(...bloque(g.grupo, g.slots), "---", "");
  if (sueltos.length) l.push(...bloque(GRUPO_SUELTOS, sueltos), "---", "");

  if (sinClasificar.length) {
    l.push(
      `## Sin clasificar — ${sinClasificar.length}`,
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
      ...tabla(sinClasificar),
      "---",
      "",
    );
  }

  l.push(
    "## Avisos",
    "",
    "**El recoloreo se decide al disparar, no al procesar.** Las telas del catálogo",
    "alimentan la simulación de color de su ficha, y eso impone condiciones a la TOMA",
    "que están escritas en su bloque: tela sin teñir, luz neutra, sin quemados. No hay",
    "corrección posterior para ninguna de las tres — una tela ya teñida o una toma con",
    "dominante cálida obligan a repetir la sesión, no a reprocesar el archivo.",
    "",
    "**Material que no puede ir en cualquier hueco.** Ver `README-imagenes.md` §5:",
    "el material generado por IA no puede ocupar un hueco que afirme algo nuestro",
    "(«nuestra planta», «nuestro asesor»), y `retrato-asesor` es una persona real y",
    "necesita su autorización, que no es lo mismo que una licencia.",
    "",
  );

  writeFileSync(SALIDA, l.join("\n"), "utf8");

  // La segunda vista, de los MISMOS `vacios`: no se vuelven a calcular, para
  // que las dos no puedan contar cosas distintas.
  writeFileSync(SALIDA_POR_PAGINA, documentoPorPagina(vacios), "utf8");
  const paginasConHuecos = new Set(vacios.map((s) => s.pagina)).size;

  console.log(
    `\ndocs/requisitos-fotografia.md — ${vacios.length} huecos vacíos en ` +
      `${porGrupo.length} tipos de toma` +
      (sueltos.length ? `, ${sueltos.length} sueltos` : "") +
      (sinClasificar.length ? `, ${sinClasificar.length} SIN CLASIFICAR` : "") +
      `\ndocs/requisitos-fotografia-por-pagina.md — los mismos ${vacios.length} ` +
      `repartidos en ${paginasConHuecos} páginas\n`,
  );
}

main();
