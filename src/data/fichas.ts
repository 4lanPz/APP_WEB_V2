/**
 * Vista PUBLICABLE de las fichas técnicas.
 *
 * `fichas-tecnicas.raw.ts` es la transcripción literal de los PNG del cliente.
 * Este archivo decide qué de eso sale a pantalla. La separación importa: el
 * crudo conserva la evidencia (incluidas las erratas), y aquí se aplica el
 * criterio editorial sin perder la trazabilidad al PNG de origen.
 *
 * Regla de oro: un dato técnico o es verificado o dice `PENDIENTE`. Nunca se
 * inventa un número. Un gramaje inventado va con norma ASTM al lado y es
 * indistinguible de uno real — un comprador dimensiona un pedido con eso.
 */

import {
  fichasEnVenta,
  incidencias,
  NORMAS,
  SUBLIMACION,
  CUIDADOS_ESTANDAR,
  CUIDADOS_DELICADO,
  type FichaRaw,
  type Terna,
} from "./fichas-tecnicas.raw";
import { categories } from "./taxonomy";

/** Mismo marcador que usa `locations.ts` para datos sin confirmar. */
export const PENDIENTE = "Pendiente de confirmar";

export type CampoNumerico = "anchoTubular" | "pesoPorArea" | "rendimiento";

/**
 * Qué campos deja fuera cada bloqueante. Un duplicado invalida las tres
 * magnitudes (no sabemos cuál de las dos telas lleva esos valores); la errata
 * de Buff Romina solo afecta al rendimiento.
 */
const TODAS: CampoNumerico[] = ["anchoTubular", "pesoPorArea", "rendimiento"];

const CAMPOS_BLOQUEADOS: Record<string, CampoNumerico[]> = {
  "dup-chelsea-dortmund-melina": TODAS,
  "dup-chelseaplus-napoles": TODAS,
  "dup-lacoast1-kratos": TODAS,
  "dup-austriapremium-piqueares": TODAS,
  "errata-buffromina-rendimiento": ["rendimiento"],
};

export interface ValorCalidades {
  /** Calidad inferior. `null` = pendiente de confirmar. */
  lci: string | null;
  lc: string | null;
  lcd: string | null;
  /** Por qué falta el dato, si falta. */
  motivo?: string;
}

export interface FichaPublicable {
  slug: string;
  composicion: string;
  /** m, ±0,01 */
  anchoTubular: ValorCalidades;
  /** g/m², ±5% */
  pesoPorArea: ValorCalidades;
  /** m/kg, ±5% */
  rendimiento: ValorCalidades;
  usoConfeccion: string;
  normas: (typeof NORMAS)[keyof typeof NORMAS];
  sublimacion: (typeof SUBLIMACION)[keyof typeof SUBLIMACION];
  cuidados: readonly string[];
  /** true si algún campo quedó pendiente — la página debe avisarlo. */
  tieneDatosPendientes: boolean;
  /**
   * Texto público bajo el aviso de datos pendientes. Apto para mostrarle a un
   * cliente: no menciona telas ocultas ni dudas sobre el fabricante.
   */
  motivo?: string;
  /** PNG de origen, para poder auditar cualquier valor. */
  origen: string | null;
}

/**
 * Unifica el separador decimal a coma. Las fichas del cliente vienen en dos
 * plantillas y una usa punto; publicar ambas mezcladas se vería como un error.
 */
function normalizarDecimal(valor: string | null): string | null {
  return valor === null ? null : valor.replace(".", ",");
}

/** El original dice "inumentaria" en decenas de fichas. */
function corregirErratas(texto: string): string {
  return texto.replace(/inumentaria/gi, "indumentaria").replace(/\s{2,}/g, " ").trim();
}

const BLOQUEANTES = new Set(
  incidencias.filter((i) => i.severidad === "bloqueante").map((i) => i.clave),
);

/**
 * Texto PÚBLICO para un dato bloqueado.
 *
 * Deliberadamente NO se reutiliza `incidencia.descripcion`: esa está escrita
 * para el equipo y dice cosas que no van en una página de producto — que
 * sospechamos que las fichas del fabricante están mal, y los nombres de telas
 * A PEDIDO, que no deben aparecer en el sitio bajo ningún concepto.
 *
 * La traza completa sigue disponible en `fichas-tecnicas.raw.ts` y en el campo
 * `origen` de cada ficha.
 */
const MOTIVO_PUBLICO: Record<string, string> = {
  "dup-chelsea-dortmund-melina":
    "Estamos verificando estos valores con el fabricante antes de publicarlos.",
  "dup-chelseaplus-napoles":
    "Estamos verificando estos valores con el fabricante antes de publicarlos.",
  "dup-lacoast1-kratos":
    "Estamos verificando estos valores con el fabricante antes de publicarlos.",
  "dup-austriapremium-piqueares":
    "Estamos verificando estos valores con el fabricante antes de publicarlos.",
  "errata-buffromina-rendimiento":
    "El rendimiento de esta tela está en revisión con el fabricante.",
};

const MOTIVO_GENERICO =
  "Este dato está pendiente de confirmación con el fabricante.";

function motivoDe(flags: string[]): string | undefined {
  const clave = flags.find((f) => BLOQUEANTES.has(f));
  if (!clave) return undefined;
  return MOTIVO_PUBLICO[clave] ?? MOTIVO_GENERICO;
}

function resolverCampo(
  ficha: FichaRaw,
  campo: CampoNumerico,
): ValorCalidades {
  const flags = ficha.flags ?? [];
  const bloqueado = flags.some(
    (flag) => BLOQUEANTES.has(flag) && CAMPOS_BLOQUEADOS[flag]?.includes(campo),
  );

  if (bloqueado) {
    return { lci: null, lc: null, lcd: null, motivo: motivoDe(flags) };
  }

  const terna: Terna = ficha[campo];
  return {
    lci: normalizarDecimal(terna.lci),
    lc: normalizarDecimal(terna.lc),
    lcd: normalizarDecimal(terna.lcd),
  };
}

function construir(ficha: FichaRaw): FichaPublicable {
  const anchoTubular = resolverCampo(ficha, "anchoTubular");
  const pesoPorArea = resolverCampo(ficha, "pesoPorArea");
  const rendimiento = resolverCampo(ficha, "rendimiento");
  const usaDelicado = (ficha.flags ?? []).includes("cuidados-delicado");

  return {
    slug: ficha.slug as string,
    composicion: ficha.composicion,
    anchoTubular,
    pesoPorArea,
    rendimiento,
    usoConfeccion: corregirErratas(ficha.usoConfeccion),
    normas: NORMAS[ficha.plantilla],
    sublimacion: SUBLIMACION[ficha.plantilla],
    cuidados: usaDelicado ? CUIDADOS_DELICADO : CUIDADOS_ESTANDAR,
    tieneDatosPendientes: [anchoTubular, pesoPorArea, rendimiento].some(
      (c) => c.lc === null,
    ),
    motivo: anchoTubular.motivo ?? pesoPorArea.motivo ?? rendimiento.motivo,
    origen: ficha.archivo,
  };
}

/**
 * Ficha enteramente pendiente, para telas que están en el Excel (se venden)
 * pero de las que el cliente todavía no entregó PNG. La página se ve completa
 * y coherente, y cada dato dice explícitamente que falta confirmarlo.
 */
function fichaPendiente(slug: string): FichaPublicable {
  const sinDato: ValorCalidades = {
    lci: null,
    lc: null,
    lcd: null,
    motivo: "Publicaremos la ficha técnica de esta tela en cuanto esté validada.",
  };
  return {
    slug,
    composicion: PENDIENTE,
    anchoTubular: sinDato,
    pesoPorArea: sinDato,
    rendimiento: sinDato,
    usoConfeccion: PENDIENTE,
    normas: NORMAS.A,
    sublimacion: SUBLIMACION.A,
    cuidados: CUIDADOS_ESTANDAR,
    tieneDatosPendientes: true,
    motivo: sinDato.motivo,
    origen: null,
  };
}

const porSlug = new Map<string, FichaPublicable>(
  fichasEnVenta.map((f) => [f.slug as string, construir(f)]),
);

/**
 * Guarda contra un fallo silencioso: si una ficha lleva un flag bloqueante que
 * nadie declaró en `CAMPOS_BLOQUEADOS`, `resolverCampo` no vacía nada y los
 * datos dudosos se publican como si estuvieran verificados. Pasó al escalar
 * `dup-austriapremium-piqueares`. Falla ruidosamente en build, no en producción.
 */
const flagsSinCampos = [...new Set(fichasEnVenta.flatMap((f) => f.flags ?? []))]
  .filter((flag) => BLOQUEANTES.has(flag) && !CAMPOS_BLOQUEADOS[flag]);

if (flagsSinCampos.length > 0) {
  throw new Error(
    `fichas.ts: estos flags son bloqueantes pero no declaran qué campos ocultan, ` +
      `así que sus datos se publicarían igual: ${flagsSinCampos.join(", ")}. ` +
      `Añádelos a CAMPOS_BLOQUEADOS.`,
  );
}

/**
 * Deriva de slugs. `porSlug` se construye con slugs escritos a mano en el raw;
 * una errata no rompe nada visible —`getFichaTecnica` devuelve `undefined`, la
 * tela cae en "en preparación" y nadie se entera de que se perdió una ficha.
 */
const slugsDeCatalogo = new Set(
  categories.flatMap((c) => c.subcategories.map((s) => s.slug)),
);

const slugsFantasma = [...porSlug.keys()].filter((s) => !slugsDeCatalogo.has(s));

if (slugsFantasma.length > 0) {
  throw new Error(
    `fichas.ts: estas fichas apuntan a slugs que no existen en taxonomy.ts, ` +
      `así que su ficha nunca se mostraría: ${slugsFantasma.join(", ")}.`,
  );
}

/**
 * Dortmund Plus se sirve desde dos sitios: los valores escritos a mano en
 * `taxonomy.ts` (su página estática) y la ficha transcrita del PNG (la ruta
 * dinámica). Si divergen, el mismo tejido muestra números distintos según por
 * dónde llegue el visitante.
 */
const fichaDortmundPlus = porSlug.get("dortmund-plus");

if (fichaDortmundPlus) {
  const esperado: Record<string, string | null> = {
    "1,20 m": valorEstandar(fichaDortmundPlus.anchoTubular, "m"),
    "134,41 g/m²": valorEstandar(fichaDortmundPlus.pesoPorArea, "g/m²"),
    "3,10 m/kg": valorEstandar(fichaDortmundPlus.rendimiento, "m/kg"),
  };
  const divergencias = Object.entries(esperado)
    .filter(([enTaxonomy, enFicha]) => enTaxonomy !== enFicha)
    .map(([enTaxonomy, enFicha]) => `taxonomy="${enTaxonomy}" vs ficha="${enFicha}"`);

  if (divergencias.length > 0) {
    throw new Error(
      `fichas.ts: dortmundPlusStats (taxonomy.ts) no coincide con la ficha del ` +
        `cliente. El mismo tejido mostraría datos distintos según la ruta. ` +
        divergencias.join("; "),
    );
  }
}

/**
 * Señal SÍNCRONA de qué telas tienen ficha. `nav-data.ts` construye sus consts
 * a nivel de módulo y no puede await-ear los accesores async de este archivo.
 */
export const slugsConFicha: ReadonlySet<string> = new Set(porSlug.keys());

export type EstadoFicha = "publicada" | "preliminar" | "sin-ficha";

/**
 * Tres estados, no dos. Una tela con los tres numéricos bloqueados tiene ficha
 * pero no tiene datos: anunciarla como "publicada" y que al abrirla todo diga
 * "Pendiente de confirmar" es la misma señal falsa que esto viene a evitar.
 */
export function estadoFicha(slug: string): EstadoFicha {
  const ficha = porSlug.get(slug);
  if (!ficha) return "sin-ficha";
  return ficha.tieneDatosPendientes ? "preliminar" : "publicada";
}

/**
 * Ficha de una tela del catálogo. Devuelve siempre algo para una tela a la
 * venta: si no hay datos, una ficha con todos los campos pendientes.
 * Devuelve `undefined` solo si el slug no existe en el catálogo.
 */
export async function getFichaTecnica(
  subcategoriaSlug: string,
): Promise<FichaPublicable | undefined> {
  return porSlug.get(subcategoriaSlug);
}

/** Igual que `getFichaTecnica` pero rellena con pendientes si no hay ficha. */
export async function getFichaTecnicaOPendiente(
  subcategoriaSlug: string,
): Promise<FichaPublicable> {
  return porSlug.get(subcategoriaSlug) ?? fichaPendiente(subcategoriaSlug);
}

/** Formatea una terna para mostrar la calidad estándar (LC). */
export function valorEstandar(valor: ValorCalidades, unidad: string): string {
  return valor.lc === null ? PENDIENTE : `${valor.lc} ${unidad}`;
}

/** Rango completo LCI–LCD, para la tabla de tres calidades. */
export function rango(valor: ValorCalidades, unidad: string): string {
  if (valor.lci === null || valor.lcd === null) return PENDIENTE;
  return `${valor.lci} – ${valor.lcd} ${unidad}`;
}

export const fichasPublicables = [...porSlug.values()];

export const resumenFichas = {
  total: porSlug.size,
  completas: fichasPublicables.filter((f) => !f.tieneDatosPendientes).length,
  conPendientes: fichasPublicables.filter((f) => f.tieneDatosPendientes).length,
};
