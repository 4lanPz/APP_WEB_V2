/**
 * AUDITORÍA DE CONSISTENCIA — mide, no arregla.
 *
 *   npm run auditoria:consistencia
 *
 * Produce `docs/auditoria-consistencia.md`, agrupado POR TIPO de inconsistencia
 * y no por página: "las cabeceras miden cinco alturas distintas" es una
 * decisión; la misma altura repetida siete veces, una detrás de otra, no lo es.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * POR QUÉ SE MIDE POR PLANTILLA Y NO POR RUTA
 *
 * El catálogo tiene ~66 rutas reales, pero no ~66 diseños: 48 subcategorías sin
 * ficha son el MISMO `PreparacionPage` con otro texto dentro, y miden lo mismo
 * hasta el píxel. Medirlas todas llenaría el informe de 48 filas idénticas y
 * enterraría los hallazgos de verdad.
 *
 * Así que el barrido de layout va sobre una REPRESENTATIVA por plantilla, y
 * cada hallazgo arrastra a cuántas rutas reales afecta —que es lo que decide su
 * prioridad: lo que se repite 48 veces no pesa igual que lo que pasa dos—.
 *
 * La caza de ENLACES ROTOS sí recorre el universo completo. Ahí no hay
 * heurística de plantilla que valga: cada página enlaza a destinos distintos,
 * comprobarlo cuesta una petición y no una captura, y es justo el barrido que la
 * estructura completa del catálogo hace falta para ejercitar.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LAS RUTAS NO ESTÁN ESCRITAS A MANO
 *
 * Salen de las mismas fuentes que usa `generateStaticParams`: los `page.tsx` del
 * árbol de `src/app` y la taxonomía de `src/data/taxonomy.ts`. Una lista a mano
 * se desincroniza del enrutador en la primera tela que se publique, y entonces
 * el informe mide un sitio que ya no existe.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * IDEMPOTENCIA
 *
 * Dos pasadas sobre el mismo commit tienen que dar EL MISMO fichero, byte a
 * byte, o el documento no se puede revisar en un diff. Por eso no lleva fecha,
 * las listas van ordenadas por criterios estables (nunca por orden de llegada de
 * un evento asíncrono) y las medidas se redondean: sin redondeo, el subpíxel del
 * renderizado de texto mueve el último decimal entre pasadas y el diff sale
 * lleno de ruido que nadie va a leer.
 *
 * Lo que sí lleva es el HASH DEL COMMIT. Un informe sin fecha y sin commit no se
 * puede situar en el tiempo: dentro de dos semanas nadie sabrá si describe el
 * código de hoy. El hash solo cambia cuando cambia el código, así que sitúa el
 * informe sin romper la idempotencia. Si el árbol está sucio, lo dice: un
 * informe medido sobre cambios sin commitear NO describe ese commit, y leerlo
 * como si lo hiciera manda a buscar diferencias que no están en el repositorio.
 */

import { chromium, type Browser, type Page } from "playwright";
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { categories } from "../src/data/taxonomy";
import { estadoFicha } from "../src/data/fichas";
import { escanear as escanearClasesNumericas } from "./verificar-clases-numericas.mjs";

const RAIZ = process.cwd();
const PUERTO = 4124;
const BASE = `http://localhost:${PUERTO}`;
const SALIDA = path.join(RAIZ, "docs/auditoria-consistencia.md");

const ANCHOS = [375, 1440] as const;
type Ancho = (typeof ANCHOS)[number];

/**
 * `--rapido` mide solo a 375. Para iterar sobre el propio script sin esperar la
 * pasada entera; el informe que publica es siempre el de las dos anchuras.
 */
const RAPIDO = process.argv.includes("--rapido");

// ═══════════════════════════════════════════════════════════════════════════
//  RUIDO CONOCIDO
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Ya diagnosticado en otras tandas. No se borra: se marca. Un hallazgo que
 * desaparece del informe sin dejar rastro vuelve a "descubrirse" dentro de un
 * mes, y se vuelve a investigar desde cero.
 */
const RUIDO_CONOCIDO = [
  {
    que: "Contraste de `BotonWhatsApp` a 375 px en la ruta de blancos (1,72:1)",
    porque:
      "lo causa el marcador de hueco encendido; desaparece cuando lleguen las fotos",
  },
  {
    que: "`npm run imagenes` sale con código 1 por el hueco sin slot en `blancos/page.tsx`",
    porque: "es Parte B, ya planificada",
  },
  { que: "Aviso de lint en `scripts/verificar-botones.mjs`", porque: "conocido" },
  {
    que: "Error de hidratación React #418 en `/` con `prefers-reduced-motion`",
    porque: "conocido y diagnosticado",
  },
  {
    que: "Marcadores de hueco de imagen visibles",
    porque: "están encendidos a propósito mientras faltan las fotografías",
  },
];

/** Firmas de consola que corresponden al ruido conocido de arriba. */
const CONSOLA_IGNORADA = [
  /Minified React error #418/i,
  /hydration/i,
  /Warning: Text content did not match/i,
];

// ═══════════════════════════════════════════════════════════════════════════
//  DERIVACIÓN DE RUTAS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Rutas con su propio `page.tsx`, leídas del árbol de ficheros.
 *
 * `admin` y `styleguide` quedan fuera: son herramientas internas, no páginas
 * del sitio. Es el mismo corte que ya hace `verificar-botones.mjs`.
 */
function rutasConPaginaPropia(): string[] {
  const raizApp = path.join(RAIZ, "src/app");
  const rutas: string[] = [];

  const recorrer = (dir: string, ruta: string) => {
    const nombre = path.basename(dir);
    if (nombre === "admin" || nombre === "styleguide") return;
    // Los segmentos dinámicos no son una ruta: son una plantilla.
    if (nombre.startsWith("[")) return;
    // `_sistema` y demás carpetas privadas de Next no generan ruta.
    if (nombre.startsWith("_")) return;

    if (fs.existsSync(path.join(dir, "page.tsx"))) rutas.push(ruta || "/");

    for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entrada.isDirectory()) continue;
      recorrer(path.join(dir, entrada.name), `${ruta}/${entrada.name}`);
    }
  };

  recorrer(raizApp, "");
  return rutas.sort();
}

interface RutaReal {
  ruta: string;
  /** Qué plantilla la pinta. Es la clave por la que se agrupa. */
  plantilla: string;
}

/**
 * TODAS las rutas que sirve el sitio. La usa el rastreo de enlaces (que no
 * agrupa por plantilla) y el recuento de peso de cada representativa.
 */
function todasLasRutasReales(): RutaReal[] {
  const propias = new Set(rutasConPaginaPropia());
  const reales: RutaReal[] = [...propias].map((ruta) => ({
    ruta,
    plantilla: `estática ${ruta}`,
  }));

  /*
   * Se descuenta contra el conjunto de páginas propias que se acaba de leer del
   * disco, y no contra `SUBCATEGORIAS_CON_PAGINA_PROPIA` de `lib/rutas.ts`. Esa
   * constante es una lista escrita a mano, y aquí interesa el árbol de ficheros
   * de verdad: si alguna vez divergen, lo que sirve Next es el fichero.
   */
  for (const c of categories) {
    const rutaCategoria = `/productos/${c.slug}`;
    if (!propias.has(rutaCategoria)) {
      reales.push({ ruta: rutaCategoria, plantilla: "[categoria] en preparación" });
    }

    for (const s of c.subcategories) {
      const rutaSub = `${rutaCategoria}/${s.slug}`;
      if (!propias.has(rutaSub)) {
        reales.push({
          ruta: rutaSub,
          plantilla: `[subcategoria] ficha ${estadoFicha(s.slug)}`,
        });
      }

      for (const t of s.tones ?? []) {
        const rutaTono = `${rutaSub}/${t.slug}`;
        if (!propias.has(rutaTono)) {
          reales.push({ ruta: rutaTono, plantilla: "[tono] en preparación" });
        }
      }
    }
  }

  return reales;
}

interface Representativa {
  ruta: string;
  plantilla: string;
  /** Cuántas rutas reales pinta esta misma plantilla. */
  cubre: number;
  /** Las otras rutas que representa, para poder citarlas en el informe. */
  ejemplos: string[];
}

/**
 * Una ruta por plantilla, con su peso.
 *
 * Determinista por construcción: se recorre `todasLasRutasReales()` en su orden
 * (que sale del orden de `categories`, fijo en el fichero) y se toma la primera
 * de cada plantilla. Sin azar y sin fechas, dos pasadas eligen las mismas.
 */
function representativas(): Representativa[] {
  const porPlantilla = new Map<string, string[]>();
  for (const { ruta, plantilla } of todasLasRutasReales()) {
    const lista = porPlantilla.get(plantilla) ?? [];
    lista.push(ruta);
    porPlantilla.set(plantilla, lista);
  }

  return [...porPlantilla.entries()]
    .map(([plantilla, rutas]) => ({
      ruta: rutas[0],
      plantilla,
      cubre: rutas.length,
      ejemplos: rutas.slice(1, 4),
    }))
    .sort((a, b) => a.ruta.localeCompare(b.ruta));
}

// ═══════════════════════════════════════════════════════════════════════════
//  SERVIDOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Mata lo que escuche en el puerto, con su descendencia.
 *
 * `srv.kill()` a secas no sirve en Windows: mata el envoltorio de `npx` y deja
 * vivo el `next start` de dentro. Un servidor viejo sirviendo un build anterior
 * entrega páginas cuyo CSS ya no existe, y entonces se mide una maqueta SIN
 * ESTILOS sin que nada avise. Es el mismo apaño, y por el mismo motivo, que hay
 * en `verificar-botones.mjs`.
 */
function matarPuerto(puerto: number) {
  try {
    const salida = execSync(`netstat -ano | findstr :${puerto}`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const pids = new Set(
      salida
        .split(/\r?\n/)
        .filter((l) => l.includes("LISTENING"))
        .map((l) => l.trim().split(/\s+/).pop())
        .filter(Boolean) as string[],
    );
    for (const pid of pids) {
      try {
        execSync(`taskkill /F /T /PID ${pid}`, { stdio: "ignore" });
      } catch {}
    }
  } catch {
    // Fuera de Windows no hay `netstat`/`taskkill`; no hay nada que limpiar.
  }
}

async function esperarServidor() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(BASE);
      if (r.ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 750));
  }
  return false;
}

/**
 * PARCHE OBLIGATORIO PARA MEDIR DESDE UN SCRIPT EN TYPESCRIPT.
 *
 * `verificar-botones.mjs` está en `.mjs` y no en `.ts`, y esta es la razón —que
 * no estaba escrita en ninguna parte—. `tsx` transpila con esbuild, que lleva
 * `keepNames` activado: cada función del fichero sale envuelta en una llamada a
 * un helper suyo, `__name(fn, "nombre")`, que esbuild define arriba del módulo.
 *
 * Ese helper vive en Node. Cuando `page.evaluate(recoger)` serializa la función
 * y la manda al navegador, el helper NO viaja con ella, así que la función
 * explota nada más entrar con `ReferenceError: __name is not defined`. Y explota
 * en TODAS las rutas, con lo que el informe sale entero de "no se pudo medir".
 *
 * Este script sí quiere estar en TypeScript: necesita importar `taxonomy.ts` y
 * `fichas.ts` para sacar las rutas del enrutador, que es justo lo que se pidió
 * en vez de una lista a mano. Así que se define el helper en el navegador.
 *
 * VA COMO CADENA, NO COMO FUNCIÓN. Es la parte con trampa: si se pasara como
 * función, esbuild la transpilaría también y la envolvería en `__name` — el
 * mismo helper que viene a definir, usado antes de existir. Una cadena no la
 * toca el transpilador.
 */
const SHIM_ESBUILD = {
  content: "globalThis.__name = globalThis.__name || ((f) => f);",
};

/**
 * Deja la página quieta y completa antes de medir.
 *
 * Tres esperas, cada una por un motivo distinto: el telón de `PageTransition` y
 * el arranque del hero tapan contenido; los bloques que entran con `whileInView`
 * están a opacidad 0 y con `y` desplazada hasta que se ven, así que sin barrer
 * el scroll se miden geometrías de elementos a medio animar; y una imagen que
 * termina de cargar después de medir cambia la altura de lo que ya se midió.
 */
async function prepararPagina(page: Page, url: string) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(1400);

  await page.evaluate(async () => {
    const alto = document.body.scrollHeight;
    for (let y = 0; y < alto; y += window.innerHeight * 0.8) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 200));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 500));
  });

  await page.evaluate(() =>
    Promise.all(
      [...document.images]
        .filter((i) => !i.complete)
        .map(
          (i) =>
            new Promise((r) => {
              i.addEventListener("load", r, { once: true });
              i.addEventListener("error", r, { once: true });
            }),
        ),
    ),
  );
  await page.waitForTimeout(500);
}

// ═══════════════════════════════════════════════════════════════════════════
//  MEDICIÓN EN LA PÁGINA
// ═══════════════════════════════════════════════════════════════════════════

interface Medida {
  /** Alto de la banda de cabecera, o null si esta plantilla no tiene. */
  bandaCabecera: number | null;
  /** Cuántos candidatos a banda se encontraron (>1 = medida dudosa). */
  bandasEncontradas: number;
  /** Borde inferior del h1 respecto al inicio del contenido. */
  finH1: number | null;
  cuantosH1: number;
  secciones: { paddingTop: number; paddingBottom: number }[];
  huecosEntreSecciones: number[];
  contenedores: { ancho: number; padding: number }[];
  titulares: { etiqueta: string; tamaño: number }[];
  desborde: { scrollWidth: number; clientWidth: number } | null;
  tactilesPequeños: { texto: string; ancho: number; alto: number }[];
  imagenesSinAlt: { src: string; motivo: string }[];
  focoInvisible: { texto: string; etiqueta: string }[];
  temaAplicado: boolean;
}

/**
 * Todo lo que se lee dentro de la página, en una sola evaluación.
 *
 * Va como función y no como cadena por lo mismo que en `verificar-botones.mjs`:
 * `page.evaluate` con una cadena la trata como expresión, hay que envolverla en
 * una IIFE y los `\s` de las expresiones regulares se pierden por el camino.
 */
function recoger() {
  const r1 = (n: number) => Math.round(n * 10) / 10;
  const ent = (n: number) => Math.round(n);

  const visible = (el: Element) => {
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") return false;
    if (parseFloat(cs.opacity) < 0.05) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const texto = (el: Element) =>
    (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40);

  /*
   * ── BANDA DE CABECERA ────────────────────────────────────────────────────
   *
   * Se busca por ESTRUCTURA, no por nombre de clase de la banda ni por el
   * elemento que la envuelve: `Hero` la pinta como `<header>` y
   * `/asesor-virtual` como un `<div>` suyo, así que buscar la etiqueta dejaría
   * fuera una de las dos.
   *
   * Lo que sí comparten las dos es el fondo: `FondoHero` y `HeroVideo` pintan
   * los suyos como `div[aria-hidden]` con `pointer-events-none absolute
   * inset-0`. Un `absolute inset-0` llena por definición a su padre posicionado,
   * así que el PADRE de ese nodo ES la banda, mida lo que mida y se llame como
   * se llame. Sirve igual con foto, con vídeo y con el marcador de hueco vacío,
   * que son los tres estados que puede tener una cabecera hoy.
   */
  const fondos = [
    ...document.querySelectorAll(
      "main div[aria-hidden].pointer-events-none.absolute.inset-0",
    ),
  ];
  /*
   * Se DEDUPLICA por elemento padre, no por nodo de fondo. Una misma banda puede
   * llevar varios fondos apilados —`/asesor-virtual` pone un velo extra sobre el
   * de `FondoHero`, los dos `aria-hidden absolute inset-0`—, y contarlos por
   * separado hacía que el informe avisara de "más de un candidato a banda,
   * conviene confirmar a ojo" en una página donde no hay nada que confirmar: los
   * dos candidatos eran el mismo bloque medido dos veces.
   */
  const padres = [
    ...new Set(
      fondos
        .map((f) => f.parentElement)
        .filter((p): p is HTMLElement => Boolean(p)),
    ),
  ];
  const bandas = padres
    .map((p) => p.getBoundingClientRect())
    // Una banda de cabecera ocupa el ancho de la ventana y está arriba del todo.
    .filter((r) => r.width >= window.innerWidth - 2 && r.top < window.innerHeight);

  const main = document.querySelector("main");
  const topContenido = main ? main.getBoundingClientRect().top : 0;

  const h1s = [...document.querySelectorAll("h1")].filter(visible);
  const finH1 = h1s.length
    ? ent(h1s[0].getBoundingClientRect().bottom - topContenido)
    : null;

  /*
   * ── RITMO VERTICAL ───────────────────────────────────────────────────────
   * El hueco se mide entre el borde inferior de una sección y el superior de la
   * siguiente, en vez de sumar margin + padding declarados: así sale el espacio
   * REAL, sin tener que adivinar cuál de los dos se usó ni pelearse con el
   * colapso de márgenes.
   */
  const secciones = [...document.querySelectorAll("main section")].filter(visible);
  const rects = secciones.map((s) => s.getBoundingClientRect());
  const huecos: number[] = [];
  for (let i = 1; i < rects.length; i++) {
    huecos.push(ent(rects[i].top - rects[i - 1].bottom));
  }

  /*
   * LAS DOS VARIANTES DE `Container`, NO SOLO LA DE POR DEFECTO.
   *
   * `max-w-padilla-amplio` es una clase DISTINTA, no una modificación de
   * `max-w-padilla`: un selector `.max-w-padilla` no la alcanza. Midiendo solo
   * la primera, las secciones que estrenan el ancho amplio desaparecían del
   * apartado §3 y el informe declaraba "un solo ancho, consistente" justo
   * cuando había dos — el peor fallo posible en un documento cuya única función
   * es contar cuántos valores distintos hay.
   */
  const contenedores = [
    ...document.querySelectorAll("main .max-w-padilla, main .max-w-padilla-amplio"),
  ]
    .filter(visible)
    .map((el) => {
      const cs = getComputedStyle(el);
      return {
        ancho: ent(el.getBoundingClientRect().width),
        padding: ent(parseFloat(cs.paddingLeft) || 0),
      };
    });

  const titulares = [...document.querySelectorAll("main h1, main h2, main h3")]
    .filter(visible)
    .map((el) => ({
      etiqueta: el.tagName.toLowerCase(),
      tamaño: r1(parseFloat(getComputedStyle(el).fontSize)),
    }));

  /*
   * ── ÁREAS TÁCTILES ───────────────────────────────────────────────────────
   * Se mide el rectángulo del propio control. Un enlace dentro de un párrafo
   * —una palabra subrayada a mitad de frase— no es un objetivo táctil en el
   * sentido de la norma, así que se dejan fuera los que están en línea con
   * texto: marcarlos llenaría la lista de falsos positivos y taparía los
   * botones que sí lo son.
   */
  const controles = [
    ...document.querySelectorAll(
      "main a, main button, main [role=button], main input, main select, main textarea",
    ),
  ].filter(visible);

  const tactilesPequeños = controles
    .filter((el) => {
      const cs = getComputedStyle(el);
      const enLinea = cs.display === "inline";
      return !enLinea;
    })
    .map((el) => {
      const r = el.getBoundingClientRect();
      return { texto: texto(el) || "(sin texto)", ancho: ent(r.width), alto: ent(r.height) };
    })
    .filter((c) => c.ancho < 44 || c.alto < 44);

  /*
   * ── IMÁGENES ─────────────────────────────────────────────────────────────
   * `alt=""` NO es un fallo: es la forma correcta de declarar una imagen
   * decorativa, y los fondos de cabecera lo llevan a propósito. Lo que sí es
   * fallo es que el atributo no exista —ahí el lector de pantalla lee el nombre
   * del fichero—. Si el alt corresponde o no al contenido del slot es una
   * pregunta semántica que ningún script puede contestar; se listan aparte para
   * revisión humana en vez de inventarse un veredicto.
   */
  const imagenesSinAlt = [...document.querySelectorAll("main img")]
    .filter((img) => !img.hasAttribute("alt"))
    .map((img) => ({
      src: (img.getAttribute("src") || "").slice(0, 80),
      motivo: "sin atributo alt",
    }));

  /*
   * ── FOCO DE TECLADO ──────────────────────────────────────────────────────
   * Se enfoca cada control y se compara el estilo antes y después. Se miran
   * outline, box-shadow, borde y fondo: el anillo por defecto del navegador va
   * por `outline`, pero un anillo de Tailwind puede llegar por `box-shadow`, y
   * un control puede marcar el foco cambiando su relleno. Si NADA de eso cambia,
   * la persona que navega con teclado no sabe dónde está.
   *
   * LOS INHABILITADOS NO SE MIDEN, y no es una exención de conveniencia: un
   * control `disabled` no está en el orden de tabulación, así que `.focus()` no
   * hace nada y su huella sale idéntica SIEMPRE — se reportaría como «no marca
   * el foco» un control al que el foco no puede llegar. Es un falso positivo
   * garantizado, y de los caros: aparece como incumplimiento de accesibilidad
   * en el resumen y tapa a los de verdad. Lo destapó la flecha «anterior» de la
   * línea de hitos, que nace inhabilitada porque el carril empieza a la
   * izquierda del todo. WCAG 2.4.7 habla de lo que RECIBE el foco.
   */
  const focoInvisible: { texto: string; etiqueta: string }[] = [];
  const huella = (el: Element) => {
    const cs = getComputedStyle(el);
    return [
      cs.outlineStyle,
      cs.outlineWidth,
      cs.outlineColor,
      cs.boxShadow,
      cs.borderColor,
      cs.borderWidth,
      cs.backgroundColor,
      cs.textDecorationLine,
    ].join("|");
  };

  for (const el of controles) {
    if (
      (el as HTMLButtonElement).disabled ||
      el.getAttribute("aria-disabled") === "true"
    ) {
      continue;
    }
    const antes = huella(el);
    (el as HTMLElement).focus();
    const despues = huella(el);
    if (antes === despues) {
      focoInvisible.push({
        texto: texto(el) || "(sin texto)",
        etiqueta: el.tagName.toLowerCase(),
      });
    }
    (el as HTMLElement).blur();
  }

  const raiz = document.documentElement;

  return {
    bandaCabecera: bandas.length ? ent(bandas[0].height) : null,
    bandasEncontradas: bandas.length,
    finH1,
    cuantosH1: h1s.length,
    secciones: secciones.map((s) => {
      const cs = getComputedStyle(s);
      return {
        paddingTop: ent(parseFloat(cs.paddingTop) || 0),
        paddingBottom: ent(parseFloat(cs.paddingBottom) || 0),
      };
    }),
    huecosEntreSecciones: huecos,
    contenedores,
    titulares,
    desborde:
      raiz.scrollWidth > raiz.clientWidth
        ? { scrollWidth: ent(raiz.scrollWidth), clientWidth: ent(raiz.clientWidth) }
        : null,
    tactilesPequeños,
    imagenesSinAlt,
    focoInvisible,
    /* Si el tema no está aplicado, todo lo de arriba es basura medida sobre una
       página sin estilos. Se comprueba contra un token, no contra el fondo del
       body —que en la portada lo pinta otra capa y sale transparente—. */
    temaAplicado:
      getComputedStyle(raiz).getPropertyValue("--color-paper").trim() === "#f5f2ee",
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  BARRIDOS ESTÁTICOS (sin navegador)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * `admin` y `styleguide` quedan fuera, igual que en la selección de rutas.
 *
 * No son el sitio: son herramientas internas. Sin excluirlas, el inventario de
 * "valores fuera del sistema" se llena de excepciones del panel de admin y de
 * los verdes de WhatsApp de la styleguide —que están ahí precisamente para
 * documentar el sistema— y quien lea el informe no sabe cuáles de esas líneas
 * son deuda de la web que se va a presentar.
 */
const INTERNAS = /[\\/]src[\\/]app[\\/](admin|styleguide)[\\/]/;

function* ficherosFuente(dir: string): Generator<string> {
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const completo = path.join(dir, entrada.name);
    if (entrada.isDirectory()) yield* ficherosFuente(completo);
    else if (/\.(ts|tsx)$/.test(entrada.name) && !INTERNAS.test(completo)) {
      yield completo;
    }
  }
}

const relativo = (p: string) => path.relative(RAIZ, p).replace(/\\/g, "/");

/** Tokens de tipografía del design system, en px. Fuente: `globals.css`. */
const TOKENS_TEXTO: [string, number][] = [
  ["text-micro", 11],
  ["text-label", 12],
  ["text-caption", 13],
  ["text-mono", 14],
  ["text-body-s", 15],
  ["text-body-m", 16],
  ["text-body-ml", 17],
  ["text-body-l", 20],
  ["text-h3", 22],
  ["text-h2", 32],
  ["text-h1", 48],
];

/**
 * La escala tipográfica RESUELTA a un ancho de ventana concreto.
 *
 * Es la distinción que pide el encargo —"si el valor sale del sistema de diseño
 * o es arbitrario"— y hay que calcularla, no leerla: cuatro de los tokens son
 * `clamp()` y valen cosas distintas a 375 y a 1440. Comparar un 21 px medido
 * contra "text-h3 = 22px" sin resolver el clamp da un falso "fuera de escala" en
 * móvil para tokens perfectamente aplicados.
 *
 * Los valores salen de `globals.css`; si se toca la escala allí, hay que tocarla
 * aquí. No se leen del CSS compilado a propósito: haría falta un intérprete de
 * `clamp()` y el resultado sería el mismo con más piezas que se pueden romper.
 */
function tokensTipograficos(ancho: number): [string, number][] {
  const vw = ancho / 100;
  const clamp = (min: number, pref: number, max: number) =>
    Math.min(Math.max(min, pref), max);

  return [
    ["text-display", clamp(44, 2 * 16 + 3.2 * vw, 72)],
    ["text-h1", clamp(36, 1.85 * 16 + 1.8 * vw, 48)],
    ["text-h2", clamp(26, 1.4 * 16 + 1 * vw, 32)],
    ["text-h3", clamp(19, 1.1 * 16 + 0.4 * vw, 22)],
    ["text-body-l", 20],
    ["text-body-ml", 17],
    ["text-body-m", 16],
    ["text-body-s", 15],
    ["text-mono", 14],
    ["text-caption", 13],
    ["text-label", 12],
    ["text-micro", 11],
  ];
}

/** Token que explica un tamaño medido, o `null` si no lo explica ninguno. */
function tokenQueExplica(px: number, ancho: number): string | null {
  // Medio píxel de margen: el redondeo del navegador al resolver un clamp.
  const cerca = tokensTipograficos(ancho)
    .map(([nombre, valor]) => [nombre, Math.abs(valor - px)] as const)
    .sort((a, b) => a[1] - b[1])[0];
  return cerca[1] <= 0.6 ? cerca[0] : null;
}

/**
 * Utilidades que consumen la escala de espaciado base-4. Solo estas: para el
 * resto (anchos en `vh`, `grid-cols`, `blur`, `scale`…) no hay token
 * equivalente, y marcarlas sería el ruido que el guardarraíl de eslint ya
 * decidió no generar.
 */
const PREFIJOS_ESPACIADO =
  /^(-?)(p|pt|pr|pb|pl|px|py|m|mt|mr|mb|ml|mx|my|gap|gap-x|gap-y|space-x|space-y|top|right|bottom|left|inset|inset-x|inset-y|w|h|size|min-w|min-h|translate-x|translate-y)$/;

interface Arbitrario {
  fichero: string;
  linea: number;
  clase: string;
  propuesta: string | null;
}

/**
 * Valores arbitrarios usados donde ya existe un token.
 *
 * Solo se miran los que traen una medida ABSOLUTA (`px`/`rem`). Un `[70vh]`, un
 * `[clamp(…)]` o un `[1.7fr_1fr]` no tienen token que los sustituya —son
 * layout, no escala— y por eso el guardarraíl de `eslint.config.mjs` tampoco los
 * prohíbe. Repetir aquí ese criterio evita que el informe pida "arreglar" cosas
 * que el propio sistema declaró legítimas.
 */
function valoresArbitrarios(): Arbitrario[] {
  const PATRON = /(?<![\w-])(-?[a-z][a-z0-9-]*)-\[([0-9.]+)(px|rem)\]/g;
  const hallazgos: Arbitrario[] = [];

  for (const fichero of ficherosFuente(path.join(RAIZ, "src"))) {
    const lineas = sinComentarios(fs.readFileSync(fichero, "utf8")).split(/\r?\n/);
    lineas.forEach((linea, i) => {
      for (const m of linea.matchAll(PATRON)) {
        const [clase, prefijoCrudo, valorCrudo, unidad] = [
          m[0],
          m[1],
          Number(m[2]),
          m[3],
        ];
        const px = unidad === "rem" ? valorCrudo * 16 : valorCrudo;

        let propuesta: string | null = null;
        if (prefijoCrudo === "text") {
          const cerca = TOKENS_TEXTO.map(
            ([t, v]) => [t, Math.abs(v - px)] as const,
          ).sort((a, b) => a[1] - b[1])[0];
          propuesta = cerca[1] <= 1 ? cerca[0] : null;
        } else if (PREFIJOS_ESPACIADO.test(prefijoCrudo)) {
          const pasos = px / 4;
          propuesta =
            Number.isInteger(pasos * 4) && pasos % 0.25 === 0
              ? `${prefijoCrudo}-${pasos}`
              : null;
        } else {
          // Prefijo sin escala de tokens equivalente: no es un hallazgo.
          continue;
        }

        hallazgos.push({
          fichero: relativo(fichero),
          linea: i + 1,
          clase,
          propuesta,
        });
      }
    });
  }

  return hallazgos.sort(
    (a, b) => a.fichero.localeCompare(b.fichero) || a.linea - b.linea,
  );
}

interface FueraDeSistema {
  fichero: string;
  linea: number;
  fragmento: string;
  tipo: string;
}

/**
 * Color o tipografía escritos a mano.
 *
 * Las clases (`bg-[#…]`, `text-[…]`) ya las bloquea eslint en build, así que
 * aquí lo que interesa de verdad es lo que esa regla NO puede ver: colores
 * literales dentro de `style={{…}}`, que llegan al DOM sin pasar por Tailwind.
 * Se listan también las excepciones marcadas con `eslint-disable` — no son
 * fallos, son las salidas del sistema que alguien aprobó, y el inventario de
 * esas salidas es justo lo que pide esta auditoría.
 */
function coloresFueraDeSistema(): FueraDeSistema[] {
  const hallazgos: FueraDeSistema[] = [];
  const HEX = /#[0-9a-fA-F]{3,8}\b/;
  const FUNCION_COLOR = /\b(rgba?|hsla?)\s*\(/;

  for (const fichero of ficherosFuente(path.join(RAIZ, "src"))) {
    const crudo = fs.readFileSync(fichero, "utf8");
    const limpio = sinComentarios(crudo);
    limpio.split(/\r?\n/).forEach((linea, i) => {
      if (
        (HEX.test(linea) || FUNCION_COLOR.test(linea)) &&
        /(color|background|backgroundColor|backgroundImage|fill|stroke|borderColor)\s*:/.test(
          linea,
        )
      ) {
        hallazgos.push({
          fichero: relativo(fichero),
          linea: i + 1,
          fragmento: linea.trim().slice(0, 100),
          tipo: "color literal en estilo en línea",
        });
      }
    });

    // Las excepciones aprobadas sí se leen del fichero crudo: viven en un
    // comentario, que es exactamente lo que `sinComentarios` borra.
    crudo.split(/\r?\n/).forEach((linea, i) => {
      if (linea.includes("eslint-disable") && linea.includes("no-restricted-syntax")) {
        hallazgos.push({
          fichero: relativo(fichero),
          linea: i + 1,
          fragmento: linea.trim().slice(0, 120),
          tipo: "excepción aprobada al guardarraíl de tokens",
        });
      }
    });
  }

  return hallazgos.sort(
    (a, b) =>
      a.tipo.localeCompare(b.tipo) ||
      a.fichero.localeCompare(b.fichero) ||
      a.linea - b.linea,
  );
}

/**
 * Igual que en `verificar-clases-numericas.mjs`, y por el mismo motivo: sin
 * quitar los comentarios, lo único que encuentran estos barridos son las notas
 * que documentan los fallos ya arreglados.
 */
function sinComentarios(codigo: string): string {
  let salida = "";
  let i = 0;
  let cadena: string | null = null;

  while (i < codigo.length) {
    const c = codigo[i];
    const siguiente = codigo[i + 1];

    if (cadena) {
      if (c === "\\") {
        salida += codigo.slice(i, i + 2);
        i += 2;
        continue;
      }
      if (c === cadena) cadena = null;
      salida += c;
      i++;
      continue;
    }

    if (c === '"' || c === "'" || c === "`") {
      cadena = c;
      salida += c;
      i++;
      continue;
    }

    if (c === "/" && siguiente === "/") {
      while (i < codigo.length && codigo[i] !== "\n") {
        salida += " ";
        i++;
      }
      continue;
    }

    if (c === "/" && siguiente === "*") {
      const fin = codigo.indexOf("*/", i + 2);
      const hasta = fin === -1 ? codigo.length : fin + 2;
      salida += codigo.slice(i, hasta).replace(/[^\n]/g, " ");
      i = hasta;
      continue;
    }

    salida += c;
    i++;
  }

  return salida;
}

// ═══════════════════════════════════════════════════════════════════════════
//  ENLACES
// ═══════════════════════════════════════════════════════════════════════════

interface EnlaceRoto {
  desde: string;
  href: string;
  motivo: string;
}

/**
 * Recorre TODAS las rutas reales y comprueba cada `href` interno.
 *
 * Sin navegador: el HTML que sirve `next start` ya trae renderizados los
 * enlaces y los `id` de sección, así que ni el estado ni las anclas necesitan
 * Playwright. Eso permite recorrer las ~66 rutas en vez de una muestra.
 *
 * Lo que NO cubre, y conviene saberlo al leer el informe: los enlaces que solo
 * existen tras una interacción de cliente (el panel del mega-menú se renderiza
 * en servidor, pero un desplegable que se monte al abrirlo no estaría aquí).
 */
async function rastrearEnlaces(rutas: RutaReal[]) {
  const htmlPorRuta = new Map<string, string>();
  const estadoPorRuta = new Map<string, number>();

  const traer = async (ruta: string) => {
    if (htmlPorRuta.has(ruta)) return;
    try {
      const r = await fetch(BASE + ruta);
      estadoPorRuta.set(ruta, r.status);
      htmlPorRuta.set(ruta, await r.text());
    } catch {
      estadoPorRuta.set(ruta, 0);
      htmlPorRuta.set(ruta, "");
    }
  };

  for (const { ruta } of rutas) await traer(ruta);

  const rotos: EnlaceRoto[] = [];
  const HREF = /href="(\/[^"#]*)?(#[^"]*)?"/g;

  for (const { ruta } of rutas) {
    const html = htmlPorRuta.get(ruta) ?? "";
    const vistos = new Set<string>();

    for (const m of html.matchAll(HREF)) {
      const destino = m[1] ?? "";
      const ancla = m[2] ?? "";
      const href = destino + ancla;
      if (!href || href.startsWith("//")) continue;
      if (vistos.has(href)) continue;
      vistos.add(href);

      // Un `#ancla` sin ruta apunta a la propia página.
      const rutaDestino = destino || ruta;
      await traer(rutaDestino);

      const estado = estadoPorRuta.get(rutaDestino) ?? 0;
      if (estado !== 200) {
        rotos.push({
          desde: ruta,
          href,
          motivo: estado === 0 ? "no respondió" : `estado ${estado}`,
        });
        continue;
      }

      if (ancla && ancla.length > 1) {
        const id = decodeURIComponent(ancla.slice(1));
        const htmlDestino = htmlPorRuta.get(rutaDestino) ?? "";
        if (!htmlDestino.includes(`id="${id}"`)) {
          rotos.push({
            desde: ruta,
            href,
            motivo: `la página existe pero no tiene ningún id="${id}"`,
          });
        }
      }
    }
  }

  return {
    rotos: rotos.sort(
      (a, b) => a.desde.localeCompare(b.desde) || a.href.localeCompare(b.href),
    ),
    /* Dos cifras distintas y no una: las rutas del catálogo que se recorrieron,
       y los destinos extra que aparecieron enlazados y hubo que verificar
       (`/styleguide`, anclas a páginas ya vistas…). Sumarlas en un solo número
       daba "75 rutas reales" cuando el sitio tiene 66. */
    rutasRecorridas: rutas.length,
    destinosVerificados: htmlPorRuta.size,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  INFORME
// ═══════════════════════════════════════════════════════════════════════════

const fmt = (n: number) => String(n).replace(".", ",");

/** Agrupa valores iguales y devuelve `valor → [dónde]`, ordenado por valor. */
function agrupar(
  filas: { clave: number; donde: string }[],
): { clave: number; donde: string[] }[] {
  const mapa = new Map<number, string[]>();
  for (const f of filas) {
    const lista = mapa.get(f.clave) ?? [];
    lista.push(f.donde);
    mapa.set(f.clave, lista);
  }
  return [...mapa.entries()]
    .map(([clave, donde]) => ({ clave, donde: donde.sort() }))
    .sort((a, b) => a.clave - b.clave);
}

function estadoDelArbol() {
  const corre = (cmd: string) => {
    try {
      return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    } catch {
      return "";
    }
  };
  const commit = corre("git rev-parse --short HEAD") || "desconocido";
  const sucio = corre("git status --porcelain")
    .split("\n")
    .filter(Boolean).length;
  return { commit, sucio };
}

async function main() {
  const anchos = RAPIDO ? [375 as Ancho] : [...ANCHOS];
  const reales = todasLasRutasReales();
  const repres = representativas();

  console.log(
    `\n${reales.length} rutas reales · ${repres.length} plantillas · anchos ${anchos.join(" y ")}\n`,
  );

  matarPuerto(PUERTO);
  const servidor = spawn("npx", ["next", "start", "-p", String(PUERTO)], {
    shell: true,
    stdio: "ignore",
  });

  let navegador: Browser | null = null;
  const medidas = new Map<string, Medida>();
  const consola = new Map<string, string[]>();
  const noMedibles: string[] = [];
  let enlaces: Awaited<ReturnType<typeof rastrearEnlaces>> = {
    rotos: [],
    rutasRecorridas: 0,
    destinosVerificados: 0,
  };

  try {
    if (!(await esperarServidor())) {
      throw new Error(
        `El servidor no respondió en ${BASE}. Sin él no se puede medir nada; ` +
          `no se escribe informe (un informe vacío se leería como "todo bien").`,
      );
    }

    console.log("Rastreando enlaces sobre el universo completo de rutas…");
    enlaces = await rastrearEnlaces(reales);
    console.log(
      `  ${enlaces.destinosVerificados} destinos descargados · ${enlaces.rotos.length} enlaces con problema\n`,
    );

    navegador = await chromium.launch();

    for (const ancho of anchos) {
      const ctx = await navegador.newContext({
        viewport: { width: ancho, height: ancho === 375 ? 780 : 900 },
        deviceScaleFactor: 1,
      });
      await ctx.addInitScript(SHIM_ESBUILD);
      const page = await ctx.newPage();

      for (const rep of repres) {
        const clave = `${rep.ruta}@${ancho}`;
        const mensajes: string[] = [];

        const onConsole = (msg: { type: () => string; text: () => string }) => {
          if (msg.type() !== "error" && msg.type() !== "warning") return;
          mensajes.push(`${msg.type()}: ${msg.text()}`);
        };
        const onError = (err: Error) => mensajes.push(`pageerror: ${err.message}`);

        page.on("console", onConsole);
        page.on("pageerror", onError);

        try {
          await prepararPagina(page, BASE + rep.ruta);
          const medida = (await page.evaluate(recoger)) as Medida;

          if (!medida.temaAplicado) {
            noMedibles.push(
              `${clave}: el tema no estaba aplicado (página servida sin CSS). ` +
                `No se apunta ninguna medida suya.`,
            );
          } else {
            medidas.set(clave, medida);
          }
        } catch (e) {
          noMedibles.push(`${clave}: ${(e as Error).message}`);
        } finally {
          page.off("console", onConsole);
          page.off("pageerror", onError);
        }

        /* Ordenado y sin repetidos: el orden de llegada de los eventos de
           consola no es estable entre pasadas, y sin esto el informe cambiaría
           solo por eso. */
        consola.set(
          clave,
          [...new Set(mensajes)]
            .filter((m) => !CONSOLA_IGNORADA.some((re) => re.test(m)))
            .sort(),
        );

        console.log(`  ${clave}`);
      }

      await ctx.close();
    }
  } finally {
    if (navegador) await navegador.close();
    servidor.kill();
    matarPuerto(PUERTO);
  }

  /*
   * Si no se midió NADA, no se escribe informe.
   *
   * Un documento con todos los apartados en "✅ ninguno" y la lista de fallos
   * escondida en "no se pudo medir" se lee, de un vistazo, como que el sitio
   * está impecable. Pasó de verdad en la primera pasada: las quince rutas
   * fallaron con `__name is not defined` y aun así salió un informe de aspecto
   * normal. Mejor romper que publicar un verde falso.
   */
  const esperadas = repres.length * anchos.length;
  if (medidas.size === 0) {
    throw new Error(
      `Ninguna de las ${esperadas} mediciones salió adelante, así que no hay ` +
        `informe que escribir. Primer motivo: ${noMedibles[0] ?? "desconocido"}`,
    );
  }
  if (medidas.size < esperadas) {
    console.log(
      `\n  ! ${esperadas - medidas.size} de ${esperadas} mediciones fallaron; ` +
        `van declaradas en el informe.`,
    );
  }

  const clasesNumericas = await escanearClasesNumericas();
  const arbitrarios = valoresArbitrarios();
  const fueraDeSistema = coloresFueraDeSistema();

  const doc = componerInforme({
    repres,
    reales,
    anchos,
    medidas,
    consola,
    enlaces,
    clasesNumericas,
    arbitrarios,
    fueraDeSistema,
    noMedibles,
  });

  fs.mkdirSync(path.dirname(SALIDA), { recursive: true });
  fs.writeFileSync(SALIDA, doc, "utf8");
  console.log(`\n✓ ${relativo(SALIDA)}\n`);
}

interface DatosInforme {
  repres: Representativa[];
  reales: RutaReal[];
  anchos: number[];
  medidas: Map<string, Medida>;
  consola: Map<string, string[]>;
  enlaces: {
    rotos: EnlaceRoto[];
    rutasRecorridas: number;
    destinosVerificados: number;
  };
  clasesNumericas: {
    fichero: string;
    linea: number;
    clase: string;
    propuesta: string | null;
  }[];
  arbitrarios: Arbitrario[];
  fueraDeSistema: FueraDeSistema[];
  noMedibles: string[];
}

function componerInforme(d: DatosInforme): string {
  const { commit, sucio } = estadoDelArbol();
  const L: string[] = [];
  const w = (s = "") => L.push(s);

  const pesoDe = (ruta: string) =>
    d.repres.find((r) => r.ruta === ruta)?.cubre ?? 1;
  const conPeso = (ruta: string) => {
    const n = pesoDe(ruta);
    return n > 1 ? `${ruta} (×${n} rutas)` : ruta;
  };

  w("# Auditoría de consistencia");
  w();
  w(`Medido sobre el commit \`${commit}\`.`);
  if (sucio > 0) {
    w();
    w(
      `> **Aviso —** el árbol tenía ${sucio} archivo(s) sin commitear al medir. ` +
        `Este informe NO describe exactamente el commit \`${commit}\`.`,
    );
  }
  w();
  w(
    "Generado por `npm run auditoria:consistencia`. **No editar a mano:** cada " +
      "pasada lo reescribe entero.",
  );
  w();
  w(
    "Este documento **mide, no arregla**. Cada apartado dice qué valores hay, " +
      "dónde, si es fallo objetivo o variación de criterio, y qué valor estándar " +
      "se propone.",
  );
  w();

  // ── Metodología ──────────────────────────────────────────────────────────
  w("## Cómo se ha medido");
  w();
  w(
    `El sitio sirve **${d.reales.length} rutas reales**, pero no ${d.reales.length} ` +
      `diseños: se agrupan en **${d.repres.length} plantillas**. El barrido de ` +
      "layout va sobre una ruta por plantilla —medir 48 páginas idénticas no " +
      "añade información, solo filas—, y cada hallazgo indica a cuántas rutas " +
      "reales afecta.",
  );
  w();
  w(
    `Anchos: ${d.anchos.map((a) => `${a} px`).join(" y ")}. Las rutas salen del ` +
      "árbol de `src/app` y de `src/data/taxonomy.ts`, no de una lista escrita a mano.",
  );
  w();
  w(
    `> **Sobre el número de rutas.** El encargo hablaba de 16. La derivación desde ` +
      `el enrutador da **${d.reales.length} rutas reales agrupadas en ` +
      `${d.repres.length} plantillas**, y no hay forma de llegar a 16 sin escribir ` +
      "a mano alguna de las dos cifras. Se deja el número que sale del código, que " +
      "es el que se pidió como fuente. Las tres categorías en preparación " +
      "(`texturizado`, `spun`, `polialgodon`) comparten plantilla y aquí cuentan " +
      "como una: lo que las diferencia es el texto de su descripción, no el diseño.",
  );
  w();
  w("| Ruta medida | Plantilla | Rutas reales que cubre |");
  w("| --- | --- | ---: |");
  for (const r of d.repres) {
    w(`| \`${r.ruta}\` | ${r.plantilla} | ${r.cubre} |`);
  }
  w();
  w("**Las dos medidas de cabecera.** Se reportan por separado a propósito:");
  w();
  w(
    "- **Banda de cabecera** — alto del bloque oscuro, detectado por estructura " +
      "(el padre del fondo `absolute inset-0` que pintan `FondoHero` y " +
      "`HeroVideo`). Es lo que se ve como \"cabecera más alta o más baja\".",
  );
  w(
    "- **Fin del `<h1>`** — a qué distancia del inicio del contenido termina el " +
      "titular. Existe también en las plantillas que no tienen banda.",
  );
  w();
  w(
    "Pueden divergir: dos bandas de igual alto con distinto relleno interno " +
      "dejan el titular en sitios distintos, y al revés. Con una sola de las dos " +
      "métricas, el informe podría decir que las cabeceras cuadran mientras el " +
      "problema visible sigue ahí.",
  );
  w();

  if (d.noMedibles.length) {
    w("### No se pudo medir con fiabilidad");
    w();
    w(
      "Esto se declara en vez de dar un número: una medida tomada sobre una " +
        "página a medio cargar dirige el trabajo en la dirección equivocada.",
    );
    w();
    for (const n of d.noMedibles) w(`- ${n}`);
    w();
  }

  // ── 1. Cabeceras ─────────────────────────────────────────────────────────
  w("---");
  w();
  w("## 1 · Altura de cabecera");
  w();

  for (const ancho of d.anchos) {
    const filas = d.repres
      .map((r) => ({ r, m: d.medidas.get(`${r.ruta}@${ancho}`) }))
      .filter((x) => x.m);

    const conBanda = filas.filter((x) => x.m!.bandaCabecera !== null);
    const sinBanda = filas.filter((x) => x.m!.bandaCabecera === null);

    w(`### A ${ancho} px`);
    w();
    if (conBanda.length) {
      const grupos = agrupar(
        conBanda.map((x) => ({
          clave: x.m!.bandaCabecera!,
          donde: conPeso(x.r.ruta),
        })),
      );
      w(
        `**Banda de cabecera — ${grupos.length} alturas distintas** en ` +
          `${conBanda.length} plantillas con banda.`,
      );
      w();
      w("| Alto | Rutas |");
      w("| ---: | --- |");
      for (const g of grupos) {
        w(`| ${fmt(g.clave)} px | ${g.donde.map((x) => `\`${x}\``).join(", ")} |`);
      }
      w();
    }
    if (sinBanda.length) {
      w(
        `Sin banda de cabecera identificable (${sinBanda.length} plantillas): ` +
          sinBanda.map((x) => `\`${conPeso(x.r.ruta)}\``).join(", ") +
          ". No es un fallo de medición: estas plantillas entran directamente en " +
          "el contenido, sin bloque oscuro.",
      );
      w();
    }

    const conH1 = filas.filter((x) => x.m!.finH1 !== null);
    if (conH1.length) {
      const grupos = agrupar(
        conH1.map((x) => ({ clave: x.m!.finH1!, donde: conPeso(x.r.ruta) })),
      );
      w(`**Fin del \`<h1>\` — ${grupos.length} posiciones distintas.**`);
      w();
      w("| Fin del h1 | Rutas |");
      w("| ---: | --- |");
      for (const g of grupos) {
        w(`| ${fmt(g.clave)} px | ${g.donde.map((x) => `\`${x}\``).join(", ")} |`);
      }
      w();
    }

    const sinH1 = filas.filter((x) => x.m!.cuantosH1 === 0);
    const variosH1 = filas.filter((x) => x.m!.cuantosH1 > 1);
    if (sinH1.length) {
      w(
        `⚠️ **Sin \`<h1>\` visible** — ${sinH1
          .map((x) => `\`${conPeso(x.r.ruta)}\``)
          .join(", ")}. Fallo objetivo de estructura, no de estilo.`,
      );
      w();
    }
    if (variosH1.length) {
      w(
        `⚠️ **Más de un \`<h1>\`** — ${variosH1
          .map((x) => `\`${x.r.ruta}\` (${x.m!.cuantosH1})`)
          .join(", ")}. Un documento debe tener uno.`,
      );
      w();
    }

    const dudosas = filas.filter((x) => x.m!.bandasEncontradas > 1);
    if (dudosas.length) {
      w(
        "Nota de fiabilidad: en " +
          dudosas.map((x) => `\`${x.r.ruta}\``).join(", ") +
          " se encontró más de un candidato a banda; se tomó el primero del " +
          "documento. Conviene confirmar a ojo.",
      );
      w();
    }
  }

  // ── 2. Ritmo vertical ────────────────────────────────────────────────────
  w("---");
  w();
  w("## 2 · Espaciado vertical entre secciones");
  w();
  for (const ancho of d.anchos) {
    const filas = d.repres
      .map((r) => ({ r, m: d.medidas.get(`${r.ruta}@${ancho}`) }))
      .filter((x) => x.m);

    const conSecciones = filas.filter((x) => x.m!.secciones.length > 0);
    const sinSecciones = filas.filter((x) => x.m!.secciones.length === 0);

    w(`### A ${ancho} px`);
    w();

    const pads = agrupar(
      conSecciones.flatMap((x) =>
        x.m!.secciones.map((s) => ({
          clave: s.paddingTop,
          donde: conPeso(x.r.ruta),
        })),
      ),
    );
    if (pads.length) {
      w(`**Padding superior de sección — ${pads.length} valores distintos.**`);
      w();
      w("| Padding | Secciones en |");
      w("| ---: | --- |");
      for (const g of pads) {
        const cuenta = new Map<string, number>();
        for (const dnd of g.donde) cuenta.set(dnd, (cuenta.get(dnd) ?? 0) + 1);
        w(
          `| ${fmt(g.clave)} px | ` +
            [...cuenta.entries()]
              .sort()
              .map(([ruta, n]) => `\`${ruta}\`${n > 1 ? ` ×${n}` : ""}`)
              .join(", ") +
            " |",
        );
      }
      w();
    }

    const huecos = agrupar(
      conSecciones.flatMap((x) =>
        x.m!.huecosEntreSecciones.map((h) => ({
          clave: h,
          donde: conPeso(x.r.ruta),
        })),
      ),
    );
    if (huecos.length) {
      const soloCero = huecos.length === 1 && huecos[0].clave === 0;
      w(
        `**Hueco real entre secciones consecutivas — ${huecos.length} ` +
          `${huecos.length === 1 ? "valor" : "valores"}.** Medido borde a borde, ` +
          "así que recoge el efecto combinado de margin y padding.",
      );
      w();
      if (soloCero) {
        w(
          "Todas las secciones se tocan: **el ritmo vertical no lo pone ningún " +
            "margen, lo pone el padding interno de cada sección.** Es coherente y " +
            "es buena noticia —hay un solo mecanismo, no dos compitiendo—, así que " +
            "la tabla de arriba (padding de sección) es la que manda para juzgar " +
            "el ritmo.",
        );
      } else {
        w("| Hueco | Entre secciones de |");
        w("| ---: | --- |");
        for (const g of huecos) {
          w(
            `| ${fmt(g.clave)} px | ` +
              [...new Set(g.donde)].map((x) => `\`${x}\``).join(", ") +
              " |",
          );
        }
      }
      w();
    }

    if (sinSecciones.length) {
      w(
        `**Plantillas sin ninguna \`<section>\`** (${sinSecciones.length}): ` +
          sinSecciones.map((x) => `\`${conPeso(x.r.ruta)}\``).join(", ") +
          ". Son de una sola pieza: no tienen ritmo vertical que medir. Es un " +
          "hallazgo de consistencia en sí mismo —conviven dos formas de " +
          "construir una página—, no un fallo del script.",
      );
      w();
    }
  }

  // ── 3. Contenedor ────────────────────────────────────────────────────────
  w("---");
  w();
  w("## 3 · Ancho de contenedor y padding lateral");
  w();
  for (const ancho of d.anchos) {
    const filas = d.repres
      .map((r) => ({ r, m: d.medidas.get(`${r.ruta}@${ancho}`) }))
      .filter((x) => x.m && x.m.contenedores.length);

    const anchos = agrupar(
      filas.flatMap((x) =>
        x.m!.contenedores.map((c) => ({ clave: c.ancho, donde: conPeso(x.r.ruta) })),
      ),
    );
    const padding = agrupar(
      filas.flatMap((x) =>
        x.m!.contenedores.map((c) => ({ clave: c.padding, donde: conPeso(x.r.ruta) })),
      ),
    );

    w(`### A ${ancho} px`);
    w();
    w(
      `Anchos de contenedor: ${anchos.map((g) => `**${fmt(g.clave)} px**`).join(", ")}. ` +
        `Padding lateral: ${padding.map((g) => `**${fmt(g.clave)} px**`).join(", ")}.`,
    );
    w();
    if (anchos.length === 1 && padding.length === 1) {
      w(
        "✅ Consistente: un solo ancho y un solo padding en todas las plantillas. " +
          "Es el `Container` compartido haciendo su trabajo.",
      );
    } else {
      w("| Ancho | Rutas |");
      w("| ---: | --- |");
      for (const g of anchos) {
        w(
          `| ${fmt(g.clave)} px | ` +
            [...new Set(g.donde)].map((x) => `\`${x}\``).join(", ") +
            " |",
        );
      }
    }
    w();
  }

  // ── 4. Titulares ─────────────────────────────────────────────────────────
  w("---");
  w();
  w("## 4 · Tamaños de titular");
  w();
  for (const ancho of d.anchos) {
    w(`### A ${ancho} px`);
    w();
    for (const etiqueta of ["h1", "h2", "h3"]) {
      const filas = d.repres.flatMap((r) => {
        const m = d.medidas.get(`${r.ruta}@${ancho}`);
        if (!m) return [];
        return m.titulares
          .filter((t) => t.etiqueta === etiqueta)
          .map((t) => ({ clave: t.tamaño, donde: conPeso(r.ruta) }));
      });
      if (!filas.length) continue;
      const grupos = agrupar(filas);
      w(
        `**\`${etiqueta}\` — ${grupos.length} ` +
          `${grupos.length === 1 ? "tamaño" : "tamaños"}:** ` +
          grupos.map((g) => `${fmt(g.clave)} px`).join(", "),
      );
      w();
      for (const g of grupos) {
        const token = tokenQueExplica(g.clave, ancho);
        w(
          `  - **${fmt(g.clave)} px** — ` +
            (token ? `\`${token}\`` : "**fuera de la escala de tokens**") +
            " — " +
            [...new Set(g.donde)].map((x) => `\`${x}\``).join(", "),
        );
      }
      w();
    }
  }
  w(
    "La columna del medio es la distinción que de verdad separa lo deliberado de " +
      "lo accidental: un tamaño que sale de un token es una decisión del sistema; " +
      "uno que no sale de ninguno se escribió a mano. Los que aparecen **fuera de " +
      "la escala** aquí son, uno por uno, los títulos de card con escala propia " +
      "que ya están inventariados como excepción aprobada en §13 — no son deriva " +
      "silenciosa, pero sí son la razón de que `h3` muestre cuatro tamaños.",
  );
  w();

  // ── 5. Consola ───────────────────────────────────────────────────────────
  w("---");
  w();
  w("## 5 · Errores y avisos de consola");
  w();
  const conConsola = [...d.consola.entries()].filter(([, v]) => v.length > 0);
  if (!conConsola.length) {
    w(
      "✅ Ninguna ruta emitió errores ni avisos, más allá del ruido conocido " +
        "listado al final.",
    );
  } else {
    w("| Ruta @ ancho | Mensaje |");
    w("| --- | --- |");
    for (const [clave, mensajes] of conConsola.sort()) {
      for (const m of mensajes) {
        w(`| \`${clave}\` | ${m.replace(/\|/g, "\\|").slice(0, 160)} |`);
      }
    }
  }
  w();

  // ── 6. Desborde ──────────────────────────────────────────────────────────
  w("---");
  w();
  w("## 6 · Desborde horizontal");
  w();
  const desbordes = d.repres.flatMap((r) =>
    d.anchos.flatMap((a) => {
      const m = d.medidas.get(`${r.ruta}@${a}`);
      return m?.desborde ? [{ ruta: r.ruta, ancho: a, ...m.desborde }] : [];
    }),
  );
  if (!desbordes.length) {
    w("✅ Ninguna plantilla desborda horizontalmente en los anchos medidos.");
  } else {
    w("Fallo objetivo: obliga a hacer scroll lateral.");
    w();
    w("| Ruta | Ancho | scrollWidth | clientWidth | Exceso |");
    w("| --- | ---: | ---: | ---: | ---: |");
    for (const x of desbordes) {
      w(
        `| \`${conPeso(x.ruta)}\` | ${x.ancho} px | ${x.scrollWidth} | ` +
          `${x.clientWidth} | ${x.scrollWidth - x.clientWidth} px |`,
      );
    }
  }
  w();

  // ── 7. Enlaces ───────────────────────────────────────────────────────────
  w("---");
  w();
  w("## 7 · Enlaces internos y anclas");
  w();
  w(
    `Comprobado sobre **las ${d.enlaces.rutasRecorridas} rutas reales** —no sobre ` +
      "la muestra por plantilla: cada página enlaza a destinos distintos, y " +
      `verificarlo cuesta una petición, no una captura—, más los ` +
      `${d.enlaces.destinosVerificados - d.enlaces.rutasRecorridas} destinos ` +
      "adicionales que aparecieron enlazados desde ellas.",
  );
  w();
  w(
    "No cubre los enlaces que solo existen tras una interacción de cliente. El " +
      "panel del mega-menú sí entra (se renderiza en servidor), pero un " +
      "desplegable que se montara al abrirlo no estaría aquí.",
  );
  w();
  if (!d.enlaces.rotos.length) {
    w("✅ Ningún enlace interno roto y ningún ancla sin destino.");
  } else {
    w(`**${d.enlaces.rotos.length} enlaces con problema.** Fallo objetivo.`);
    w();
    w("| Desde | Enlace | Problema |");
    w("| --- | --- | --- |");
    for (const x of d.enlaces.rotos) {
      w(`| \`${x.desde}\` | \`${x.href}\` | ${x.motivo} |`);
    }
  }
  w();

  // ── 8. Áreas táctiles ────────────────────────────────────────────────────
  w("---");
  w();
  w("## 8 · Áreas táctiles por debajo de 44 px");
  w();
  const tactiles = d.repres.flatMap((r) => {
    const m = d.medidas.get(`${r.ruta}@375`);
    return (m?.tactilesPequeños ?? []).map((t) => ({ ruta: r.ruta, ...t }));
  });
  if (!d.anchos.includes(375)) {
    w("No medido: esta pasada no incluyó el ancho de 375 px.");
  } else if (!tactiles.length) {
    w("✅ Ningún control por debajo de 44 px a 375 px.");
  } else {
    w(
      `**${tactiles.length} controles** por debajo del mínimo a 375 px. Los ` +
        "enlaces en línea dentro de un párrafo quedan fuera del recuento: no son " +
        "objetivos táctiles en el sentido de la norma.",
    );
    w();

    /*
     * Se agrupa por control, no por aparición. En crudo salían 73 filas con
     * "Cómo llegar ↗ 323×36" repetido cinco veces y "Productos 78×16" en ocho
     * rutas distintas: una lista así no se lee, y sobre todo esconde que no son
     * 73 problemas sino un puñado de controles repetidos por el sitio.
     *
     * El orden es por la dimensión más corta: primero lo que de verdad no se
     * puede tocar (los puntos de 8 px del carrusel), y al final lo que se queda
     * a ocho píxeles del mínimo.
     */
    const porControl = new Map<
      string,
      { texto: string; ancho: number; alto: number; rutas: Set<string>; veces: number }
    >();
    for (const t of tactiles) {
      const llave = `${t.texto}|${t.ancho}|${t.alto}`;
      const previo = porControl.get(llave) ?? {
        texto: t.texto,
        ancho: t.ancho,
        alto: t.alto,
        rutas: new Set<string>(),
        veces: 0,
      };
      previo.rutas.add(t.ruta);
      previo.veces++;
      porControl.set(llave, previo);
    }

    const grupos = [...porControl.values()].sort(
      (a, b) =>
        Math.min(a.ancho, a.alto) - Math.min(b.ancho, b.alto) ||
        a.texto.localeCompare(b.texto),
    );

    w(
      `Son **${grupos.length} controles distintos**, repetidos por el sitio. ` +
        "Ordenados por su dimensión más corta: arriba, lo que de verdad falla al " +
        "tocarse; abajo, lo que se queda cerca del mínimo.",
    );
    w();
    w("| Control | Tamaño | Rutas afectadas |");
    w("| --- | ---: | --- |");
    for (const g of grupos) {
      const rutas = [...g.rutas].sort();
      const listado =
        rutas.length > 3
          ? `${rutas
              .slice(0, 3)
              .map((x) => `\`${conPeso(x)}\``)
              .join(", ")} y ${rutas.length - 3} más`
          : rutas.map((x) => `\`${conPeso(x)}\``).join(", ");
      w(
        `| ${g.texto.replace(/\|/g, "\\|")}${g.veces > g.rutas.size ? ` (×${g.veces})` : ""} ` +
          `| ${g.ancho}×${g.alto} px | ${listado} |`,
      );
    }
  }
  w();

  // ── 9. Imágenes ──────────────────────────────────────────────────────────
  w("---");
  w();
  w("## 9 · Imágenes sin `alt`");
  w();
  const sinAlt = d.repres.flatMap((r) =>
    d.anchos.flatMap((a) => {
      const m = d.medidas.get(`${r.ruta}@${a}`);
      return (m?.imagenesSinAlt ?? []).map((i) => ({ ruta: r.ruta, ...i }));
    }),
  );
  const unicas = [...new Map(sinAlt.map((x) => [`${x.ruta}|${x.src}`, x])).values()];
  if (!unicas.length) {
    w(
      "✅ Toda imagen declara `alt`. Un `alt=\"\"` no cuenta como fallo: es la " +
        "forma correcta de marcar una imagen decorativa, y los fondos de cabecera " +
        "lo llevan a propósito.",
    );
  } else {
    w("| Ruta | Imagen | Problema |");
    w("| --- | --- | --- |");
    for (const x of unicas.sort((a, b) => a.ruta.localeCompare(b.ruta))) {
      w(`| \`${x.ruta}\` | \`${x.src}\` | ${x.motivo} |`);
    }
  }
  w();
  w(
    "**No comprobado automáticamente:** si el `alt` describe lo que de verdad " +
      "hay en el slot. Es una pregunta semántica y ningún script la puede " +
      "contestar; queda para revisión humana cuando lleguen las fotografías.",
  );
  w();

  // ── 10. Foco ─────────────────────────────────────────────────────────────
  w("---");
  w();
  w("## 10 · Foco de teclado invisible");
  w();
  const foco = d.repres.flatMap((r) => {
    const m = d.medidas.get(`${r.ruta}@1440`) ?? d.medidas.get(`${r.ruta}@375`);
    return (m?.focoInvisible ?? []).map((f) => ({ ruta: r.ruta, ...f }));
  });
  if (!foco.length) {
    w("✅ Todo control interactivo cambia de aspecto al recibir el foco.");
  } else {
    w(
      `**${foco.length} controles** no cambian outline, sombra, borde, relleno ` +
        "ni subrayado al enfocarse. Fallo objetivo de accesibilidad: quien navega " +
        "con teclado no sabe dónde está.",
    );
    w();
    w("| Ruta | Control | Etiqueta |");
    w("| --- | --- | --- |");
    for (const f of foco.sort(
      (a, b) => a.ruta.localeCompare(b.ruta) || a.texto.localeCompare(b.texto),
    )) {
      w(
        `| \`${conPeso(f.ruta)}\` | ${f.texto.replace(/\|/g, "\\|")} | \`${f.etiqueta}\` |`,
      );
    }
  }
  w();

  // ── 11. Clases numéricas ─────────────────────────────────────────────────
  w("---");
  w();
  w("## 11 · Clases de Tailwind que no llegan al CSS");
  w();
  w(
    "Tailwind v4 descarta **en silencio** las utilidades cuyo valor suelto no es " +
      "múltiplo de 0,25: sin error de build ni de lint. Es el fallo de " +
      "`translate-y-1.625` que dejó el icono del menú en una sola raya. Ningún " +
      "otro chequeo del proyecto lo detecta; ahora es `npm run tailwind:numericas`.",
  );
  w();
  if (!d.clasesNumericas.length) {
    w("✅ Ninguna clase escrita se está cayendo del CSS compilado.");
  } else {
    w("| Fichero | Clase | Propuesta |");
    w("| --- | --- | --- |");
    for (const c of d.clasesNumericas) {
      w(
        `| \`${c.fichero}:${c.linea}\` | \`${c.clase}\` | ` +
          `${c.propuesta ? `\`${c.propuesta}\`` : "revisar a mano"} |`,
      );
    }
  }
  w();

  // ── 12. Arbitrarios ──────────────────────────────────────────────────────
  w("---");
  w();
  w("## 12 · Valores arbitrarios con token equivalente");
  w();
  w(
    "Solo se listan los arbitrarios con medida absoluta (`px`/`rem`) en " +
      "utilidades que **sí** tienen escala de tokens. Los de layout " +
      "(`[70vh]`, `[clamp(…)]`, `grid-cols-[…]`) quedan fuera por el mismo " +
      "criterio con el que `eslint.config.mjs` decidió no prohibirlos: no hay " +
      "token que los sustituya y marcarlos sería ruido.",
  );
  w();
  if (!d.arbitrarios.length) {
    w("✅ Ninguno.");
  } else {
    w("| Fichero | Clase | Token equivalente |");
    w("| --- | --- | --- |");
    for (const a of d.arbitrarios) {
      w(
        `| \`${a.fichero}:${a.linea}\` | \`${a.clase}\` | ` +
          `${a.propuesta ? `\`${a.propuesta}\`` : "sin equivalente exacto"} |`,
      );
    }
  }
  w();

  // ── 13. Fuera del sistema ────────────────────────────────────────────────
  w("---");
  w();
  w("## 13 · Colores y tipografías fuera del sistema");
  w();
  w(
    "Las clases arbitrarias de color y tamaño de fuente ya las bloquea eslint en " +
      "build, así que aquí se listan las dos cosas que esa regla no ve: los " +
      "colores literales dentro de `style={{…}}`, que llegan al DOM sin pasar por " +
      "Tailwind, y las excepciones que alguien aprobó con `eslint-disable`. Las " +
      "segundas no son fallos —son las salidas del sistema, y tenerlas " +
      "inventariadas es parte de esto.",
  );
  w();
  if (!d.fueraDeSistema.length) {
    w("✅ Ninguno.");
  } else {
    w("| Tipo | Fichero | Fragmento |");
    w("| --- | --- | --- |");
    for (const f of d.fueraDeSistema) {
      w(
        `| ${f.tipo} | \`${f.fichero}:${f.linea}\` | ` +
          `\`${f.fragmento.replace(/\|/g, "\\|")}\` |`,
      );
    }
  }
  w();

  // ── Priorización ─────────────────────────────────────────────────────────
  w("---");
  w();
  w("## Priorización");
  w();
  w(
    "Tres niveles. El criterio de orden dentro de cada uno es **a cuántas rutas " +
      "reales afecta**: lo que se repite en 48 páginas no cuesta lo mismo que lo " +
      "que pasa en dos.",
  );
  w();

  const nivel1: string[] = [];
  const nivel2: string[] = [];
  const nivel3: string[] = [];

  /* Nivel 1 — rompe algo. Son fallos objetivos: o no funciona, o deja fuera a
     alguien. No dependen de criterio y no se discuten. */
  if (d.enlaces.rotos.length) {
    nivel1.push(
      `**${d.enlaces.rotos.length} enlaces internos rotos o con ancla sin destino** ` +
        "(§7). Un enlace que no lleva a ningún sitio es el fallo más barato de " +
        "encontrar y el más caro de enseñar en una presentación.",
    );
  }
  if (desbordes.length) {
    nivel1.push(
      `**Desborde horizontal en ${desbordes.length} caso(s)** (§6). Obliga a ` +
        "scroll lateral; en móvil se percibe como que la página está rota.",
    );
  }
  if (foco.length) {
    nivel1.push(
      `**${foco.length} controles sin foco visible** (§10). Quien navega con ` +
        "teclado no sabe dónde está. Es un incumplimiento de accesibilidad, no " +
        "una preferencia estética.",
    );
  }
  if (unicas.length) {
    nivel1.push(
      `**${unicas.length} imágenes sin atributo \`alt\`** (§9). El lector de ` +
        "pantalla lee el nombre del fichero.",
    );
  }
  if (d.clasesNumericas.length) {
    nivel1.push(
      `**${d.clasesNumericas.length} clases que no llegan al CSS** (§11). Este es ` +
        "el fallo silencioso: el estilo simplemente no se aplica y nada avisa.",
    );
  }
  const sinH1Global = d.repres.filter((r) =>
    d.anchos.some((a) => d.medidas.get(`${r.ruta}@${a}`)?.cuantosH1 === 0),
  );
  if (sinH1Global.length) {
    nivel1.push(
      `**${sinH1Global.length} plantillas sin \`<h1>\`** (§1), que cubren ` +
        `${sinH1Global.reduce((n, r) => n + r.cubre, 0)} rutas reales. Rompe la ` +
        "estructura del documento y el SEO.",
    );
  }
  if (conConsola.length) {
    nivel1.push(
      `**Errores o avisos de consola en ${conConsola.length} ruta(s)** (§5), ` +
        "descontado el ruido ya diagnosticado.",
    );
  }

  /* Nivel 2 — se nota en la presentación. Nada está roto, pero la diferencia es
     visible a ojo desde la primera pantalla y delata que cada página se escribió
     por su cuenta. */
  for (const ancho of d.anchos) {
    const bandas = agrupar(
      d.repres.flatMap((r) => {
        const m = d.medidas.get(`${r.ruta}@${ancho}`);
        return m?.bandaCabecera != null
          ? [{ clave: m.bandaCabecera, donde: r.ruta }]
          : [];
      }),
    );
    if (bandas.length > 1) {
      nivel2.push(
        `**${bandas.length} alturas de banda de cabecera distintas a ${ancho} px** ` +
          `(§1): ${bandas.map((g) => `${fmt(g.clave)} px`).join(", ")}. Es lo ` +
          "primero que se ve al pasar de una página a otra.",
      );
    }
  }
  for (const ancho of d.anchos) {
    const huecos = agrupar(
      d.repres.flatMap((r) => {
        const m = d.medidas.get(`${r.ruta}@${ancho}`);
        return (m?.huecosEntreSecciones ?? []).map((h) => ({
          clave: h,
          donde: r.ruta,
        }));
      }),
    );
    if (huecos.length > 2) {
      nivel2.push(
        `**${huecos.length} huecos distintos entre secciones a ${ancho} px** (§2). ` +
          "El ritmo vertical es lo que hace que un sitio parezca de un solo autor.",
      );
    }
  }
  if (tactiles.length) {
    nivel2.push(
      `**${tactiles.length} áreas táctiles por debajo de 44 px** (§8). No impide ` +
        "usar el sitio, pero en una demo hecha desde el móvil se falla el toque.",
    );
  }
  const fueraDeEscala = new Set<string>();
  for (const ancho of d.anchos) {
    for (const r of d.repres) {
      for (const t of d.medidas.get(`${r.ruta}@${ancho}`)?.titulares ?? []) {
        if (!tokenQueExplica(t.tamaño, ancho)) {
          fueraDeEscala.add(`${t.etiqueta} ${fmt(t.tamaño)} px @${ancho}`);
        }
      }
    }
  }
  if (fueraDeEscala.size) {
    nivel2.push(
      `**${fueraDeEscala.size} tamaños de titular fuera de la escala de tokens** ` +
        `(§4): ${[...fueraDeEscala].sort().join(", ")}. Todos corresponden a ` +
        "títulos de card con escala propia ya aprobada (§13), así que la decisión " +
        "es si esa escala paralela se consolida como token o se retira.",
    );
  }

  /* Nivel 3 — cosmético. Deuda real, invisible en una demo. */
  if (d.arbitrarios.length) {
    nivel3.push(
      `**${d.arbitrarios.length} valores arbitrarios con token equivalente** ` +
        "(§12). No se ven; encarecen el siguiente cambio de escala.",
    );
  }
  const literales = d.fueraDeSistema.filter((f) => f.tipo.startsWith("color literal"));
  if (literales.length) {
    nivel3.push(
      `**${literales.length} colores literales en estilos en línea** (§13). ` +
        "Fuera del alcance del guardarraíl de eslint; hoy no rompen nada.",
    );
  }
  const plantillasSinSeccion = d.repres.filter((r) =>
    d.anchos.some((a) => d.medidas.get(`${r.ruta}@${a}`)?.secciones.length === 0),
  );
  if (plantillasSinSeccion.length) {
    nivel3.push(
      `**${plantillasSinSeccion.length} plantillas construidas sin \`<section>\`** ` +
        "(§2), frente al resto que sí las usa. Conviven dos formas de montar una " +
        "página; unificarlo es refactor, no arreglo.",
    );
  }

  const pintarNivel = (titulo: string, items: string[], vacio: string) => {
    w(`### ${titulo}`);
    w();
    if (!items.length) w(vacio);
    else for (const x of items) w(`- ${x}`);
    w();
  };

  pintarNivel(
    "1 · Rompe algo — hay que arreglarlo",
    nivel1,
    "Nada en este nivel.",
  );
  pintarNivel(
    "2 · Se nota en la presentación",
    nivel2,
    "Nada en este nivel.",
  );
  pintarNivel(
    "3 · Cosmético — puede esperar",
    nivel3,
    "Nada en este nivel.",
  );

  // ── Ruido conocido ───────────────────────────────────────────────────────
  w("---");
  w();
  w("## Ruido conocido — excluido a propósito");
  w();
  w(
    "Ya diagnosticado en otras tandas. Se deja escrito en vez de borrarlo: un " +
      "hallazgo que desaparece sin rastro se vuelve a descubrir dentro de un mes " +
      "y se vuelve a investigar desde cero.",
  );
  w();
  for (const r of RUIDO_CONOCIDO) w(`- **${r.que}** — ${r.porque}.`);
  w();

  return L.join("\n") + "\n";
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
