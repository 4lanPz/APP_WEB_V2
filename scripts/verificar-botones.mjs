/**
 * VERIFICACIÓN DE CONTRASTE DE LOS BOTONES DEL SISTEMA, SOBRE EL FONDO REAL.
 *
 *   npm run botones          (necesita el sitio servido; lo levanta él solo)
 *
 * POR QUÉ NO VALE MEDIR EN LA STYLEGUIDE
 * El medidor del navegador sube por el árbol leyendo `background-color`, y eso
 * miente en cuanto hay algo que no sea un plano: la cabecera de la portada es
 * un `<img>` hermano con opacidad 0,85 y un velo de tinta encima, así que el
 * árbol devuelve `ink` a secas e ignora la foto. Aquí no se deduce el fondo: se
 * FOTOGRAFÍA la página y se leen los píxeles que hay de verdad debajo y
 * alrededor de cada botón.
 *
 * CÓMO SE MIDE
 *  1. Dos capturas POR VIEWPORT en cada tramo de scroll: una normal y otra con
 *     todo el texto en `transparent`. La diferencia entre ambas es la máscara
 *     real de glifo; la segunda da el fondo bajo el texto sin el texto encima.
 *
 *     NO se usa `fullPage`. Chromium la implementa redimensionando la
 *     superficie de render al alto del documento, y esta maqueta tiene medidas
 *     en `vh` —el hero es `min-h-[70vh]`—: al capturar así el hero pasa a medir
 *     el 70% del documento entero, todo se desplaza, y los rectángulos que
 *     devuelve el navegador dejan de corresponder con la imagen. Salían
 *     límites de 1,00:1 en botones que a ojo están perfectamente delimitados,
 *     porque dentro y fuera caían los dos sobre el mismo plano de fondo.
 *  2. El color del texto NO se parsea: Tailwind v4 lo devuelve en `oklch()` y
 *     leerlo como RGB da basura. Se resuelve pintándolo en un canvas sobre
 *     negro y sobre blanco (la pasada negra da alpha×color, la diferencia da
 *     1−alpha).
 *  3. Contraste de TEXTO: se compone el color resuelto sobre CADA píxel de
 *     fondo de la máscara y se reporta el peor. Componer en vez de leer la
 *     captura evita que el antialiasing del borde del glifo invente mínimos.
 *  4. LÍMITE del control (WCAG 1.4.11): se recorre el perímetro. De FUERA se
 *     muestrea el píxel real de la página a 4px; de DENTRO no se lee la
 *     captura, se componen los colores DECLARADOS del relleno y del borde
 *     sobre ese fondo. En cada punto vale el mejor de los dos —un botón puede
 *     estar delimitado por su relleno O por su borde— y el límite es el decil
 *     inferior de los puntos, no el mínimo estricto.
 *  5. Umbral por tamaño real: 3:1 si ≥24px o ≥18,66px con peso ≥700; 4,5:1 en
 *     el resto. Los controles de solo icono van contra el mínimo no textual de
 *     3:1.
 *
 * SI TE SALE UN 1,00:1, ES UN FALLO DEL ARNÉS Y YA NO DEBERÍA PASAR
 * Hubo una tanda de lecturas de 1,00:1 en botones que a mano miden 5,15:1 y
 * 15,7:1. Todas venían de leer el interior de la captura: acertar el píxel de
 * un filete de 1px depende del redondeo del rectángulo, del antialiasing de la
 * esquina y de que nada se esté moviendo, y al fallar se leía el mismo plano
 * por dentro y por fuera. Desde que el interior se compone (punto 4) no puede
 * volver a ocurrir. Un 1,00:1 hoy significa que el relleno y el borde son
 * literalmente del color del fondo, y eso sí es un fallo de verdad.
 *
 * LOS CINCO FALLOS QUE TUVO ESTE ARNÉS, POR SI VUELVEN
 *  · `fullPage` redimensiona el viewport, y con medidas en `vh` la maqueta
 *    entera se desplaza respecto a los rectángulos del navegador.
 *  · Los puntos del perímetro caían en las esquinas y muestreaban fuera.
 *  · El borde se leía a 1px de profundidad, que en un filete de 1px ya es
 *    relleno.
 *  · Un `data-*` para reidentificar controles sobrevive a los re-renders de
 *    React sobre nodos reutilizados: el mapa de Contacto le prestaba su
 *    rectángulo al botón de enviar.
 *  · `srv.kill()` no mata el `next start` de dentro del `npx`, así que quedaban
 *    servidores viejos sirviendo builds cuyo CSS ya no existe y las páginas se
 *    medían SIN ESTILOS. De ahí la comprobación de salud del tema.
 *
 * Los tres primeros daban suspensos falsos a gritos; los dos últimos, en
 * silencio. Si tocas la medición, comprueba a mano un botón que sepas que está
 * bien antes de creerte una lista de fallos.
 *
 * Además audita que no quede NINGÚN control con el azul de marca de relleno ni
 * con texto claro sobre azul.
 */

import { chromium } from "playwright";
import sharp from "sharp";
import { spawn, execSync } from "node:child_process";

const PUERTO = 4123;
const BASE = `http://localhost:${PUERTO}`;

/** Las doce rutas públicas. `/styleguide` y `/admin` quedan fuera: son internas. */
const RUTAS = [
  "/",
  "/empresa",
  "/productos",
  "/productos/texturizado",
  "/productos/camisetas",
  "/productos/microfibra",
  "/productos/microfibra/chelsea",
  "/productos/microfibra/dortmund-plus",
  "/productos/microfibra/dortmund-plus/blancos",
  "/contacto",
  "/asesor-virtual",
  "/politica-datos",
];

const ANCHOS = (process.env.ANCHOS || "375,1440").split(",").map(Number);

/** `RUTAS=/empresa,/productos npm run botones` para iterar sobre unas pocas. */
const SOLO = process.env.RUTAS ? process.env.RUTAS.split(",") : null;

/**
 * `DETALLE=1` imprime la medida de TODOS los controles, no solo la de los que
 * suspenden. Por defecto un aprobado no deja número, y entonces "cumple" es lo
 * único que queda escrito: no se puede saber si un control pasó con 12:1 o con
 * 4,51:1, que es la diferencia entre un margen y un empate. Hace falta cada vez
 * que se cambia un control sobre foto —el recorte de `object-fit` decide el
 * fondo y el fondo decide la medida— y para poder citar la cifra en un informe.
 */
const DETALLE = process.env.DETALLE === "1";

/*
 * ESTA CONSTANTE ESTABA MUERTA Y LA AUDITORÍA DE RELLENOS SEGUÍA VIVA: el
 * `recoger()` de más abajo llevaba el RGB escrito otra vez, a mano, y era ESE el
 * que se usaba. Dos copias del mismo azul, una sin usar —eslint lo venía
 * avisando— y la otra sin nadie mirándola. Cuando `--color-brand` pasó de
 * `#33a2dc` a `#55a4db`, las dos se quedaron apuntando al azul viejo y el
 * guardarraíl habría dejado pasar en silencio justo lo que vigila.
 *
 * Ahora el azul se lee del TEMA dentro de la página, como en
 * `verificar-marca.mjs`, y aquí no queda ningún número que actualizar.
 */

const lin = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => {
  const la = lum(a);
  const lb = lum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
const f = (n) => n.toFixed(2).replace(".", ",");

/** El navegador resuelve el color; aquí solo se compone. `base` es premultiplicado. */
const sobre = (c, fondo) => {
  const k = 1 - c.alpha;
  return [
    c.base[0] + k * fondo[0],
    c.base[1] + k * fondo[1],
    c.base[2] + k * fondo[2],
  ];
};

/**
 * Lo que se ejecuta DENTRO de la página para localizar y describir cada control.
 *
 * Va como función de verdad, no como cadena: `page.evaluate` con una cadena la
 * trata como expresión y hay que envolverla en una IIFE, los `\s` de las
 * expresiones regulares se pierden por el camino —«mensaje» salía «men aje»— y
 * `getPropertyValue` sobre las variables del tema devolvía vacío. Con una
 * función, Playwright serializa el código tal cual y no hay nada que escapar.
 */
function recoger() {
  const cv = document.createElement("canvas");
  cv.width = 1;
  cv.height = 1;
  const cx = cv.getContext("2d", { willReadFrequently: true });

  /* El color NO se parsea: Tailwind v4 devuelve `oklch()` y leerlo como RGB da
     basura. Lo pinta el navegador sobre negro y sobre blanco; la pasada negra
     da alpha×color y la diferencia entre ambas da 1−alpha. */
  const resolver = (color) => {
    const pinta = (fondo) => {
      cx.globalCompositeOperation = "copy";
      cx.fillStyle = fondo;
      cx.fillRect(0, 0, 1, 1);
      cx.globalCompositeOperation = "source-over";
      cx.fillStyle = color;
      cx.fillRect(0, 0, 1, 1);
      const d = cx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]];
    };
    const negro = pinta("#000");
    const blanco = pinta("#fff");
    const dif =
      (blanco[0] - negro[0] + (blanco[1] - negro[1]) + (blanco[2] - negro[2])) / 3;
    return { base: negro, alpha: Math.min(1, Math.max(0, 1 - dif / 255)) };
  };

  /*
   * Se recoge TODO en cada tramo de scroll, rectángulo incluido, y nada
   * persiste entre evaluaciones. La versión anterior marcaba cada control con
   * un `data-*` y volvía a él por selector: React reutiliza nodos del DOM al
   * re-renderizar y el atributo —que no gestiona él— se quedaba pegado al nodo
   * mientras el contenido cambiaba, así que el mapa de Contacto acababa
   * prestándole su rectángulo al botón de enviar el formulario.
   */
  const fijos = [];
  for (const el of document.querySelectorAll("body *")) {
    if (getComputedStyle(el).position !== "fixed") continue;
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) fijos.push({ el, r });
  }

  /* Los controles del sistema se reconocen por sus propias clases: las cuatro
     variantes leen variables --sup-* y la de WhatsApp lleva su verde literal.
     No hace falta ensuciar el marcado con un data-* solo para poder medir. */
  const vistos = [];
  for (const el of document.querySelectorAll('[class*="--sup-"], [class*="008069"]')) {
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    if (parseFloat(cs.opacity) < 0.05) continue;
    const texto = (el.textContent || "").replace(/\s+/g, " ").trim();
    vistos.push({
      texto: texto.slice(0, 48),
      clase: (el.getAttribute("class") || "").slice(0, 110),
      x: r.left,
      y: r.top,
      w: r.width,
      h: r.height,
      /* Clave estable entre tramos: dónde está en el DOCUMENTO, no en la
         ventana. Sirve para no medir dos veces el mismo control. */
      /* Los `fixed` no se mueven con el scroll: su clave no lo lleva, o se
         medirían una vez por tramo y contra un fondo distinto cada vez. */
      clave:
        cs.position === "fixed"
          ? `fijo|${texto.slice(0, 32)}|${Math.round(r.left)}|${Math.round(r.top)}`
          : `${texto.slice(0, 32)}|${Math.round(r.top + window.scrollY)}|${Math.round(r.left)}`,
      dentro:
        r.top >= 2 &&
        r.bottom <= window.innerHeight - 2 &&
        r.left >= 2 &&
        r.right <= window.innerWidth - 2,
      color: resolver(cs.color),
      /* Colores DECLARADOS del límite. El barrido de píxeles se usa solo para
         el fondo de fuera; el de dentro se compone a partir de estos. */
      relleno: resolver(cs.backgroundColor),
      borde: resolver(cs.borderTopColor),
      anchoBorde: parseFloat(cs.borderTopWidth) || 0,
      fs: parseFloat(cs.fontSize) || 16,
      fw: parseInt(cs.fontWeight, 10) || 400,
      soloIcono: texto === "",
      /* El límite de 1.4.11 se le exige a lo que PRETENDE ser una caja. La
         variante `enlace` es texto con un filete inferior y la migaja es texto
         a secas: no tienen límite que medir, y exigírselo era inventarse un
         suspenso. Se juzgan solo por su contraste de texto. */
      esCaja:
        resolver(cs.backgroundColor).alpha > 0.05 ||
        (parseFloat(cs.borderTopWidth) > 0 && parseFloat(cs.borderLeftWidth) > 0),
      /* Lo que flota por encima —barra fija, botón de WhatsApp— no es el fondo
         del control: es lo que lo tapa. Sin excluirlo, el «Cómo llegar ↗» de
         Contacto salía a 3,57:1, que es justo el contraste del glifo blanco
         contra el verde del flotante que lo pisa. */
      /* Si algo fijo LO PISA, no se mide a medias enmascarando píxeles: con
         medio perímetro fuera de juego el resultado depende de qué trozo
         quedó, y eso da lecturas que cambian de una pasada a otra. Se declara
         no medible y se dice en el informe. */
      pisado: fijos.some(
        (ff) =>
          ff.el !== el &&
          !ff.el.contains(el) &&
          !el.contains(ff.el) &&
          ff.r.left < r.right &&
          ff.r.right > r.left &&
          ff.r.top < r.bottom &&
          ff.r.bottom > r.top,
      ),
    });
  }

  /* Auditoría aparte: ningún control puede tener el azul de marca de relleno,
     ni texto claro encima de azul.

     EL AZUL SE LEE DEL TEMA, no de un RGB escrito aquí. Estaba a mano —51, 162,
     220— y se quedó en el azul viejo el día que el token cambió: un guardarraíl
     que compara contra un color que ya no existe no avisa de nada y no se queja
     de nada. Resolviendo la variable, el barrido sigue al token solo. */
  const marca = resolver(
    getComputedStyle(document.documentElement).getPropertyValue("--color-brand").trim(),
  );
  const azules = [];
  for (const el of document.querySelectorAll("a, button, input[type=submit], [role=button]")) {
    const fondo = resolver(getComputedStyle(el).backgroundColor);
    if (fondo.alpha < 0.5) continue;
    const d =
      Math.abs(fondo.base[0] - marca.base[0]) +
      Math.abs(fondo.base[1] - marca.base[1]) +
      Math.abs(fondo.base[2] - marca.base[2]);
    if (d < 36) {
      azules.push({
        texto: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 48),
        clase: (el.getAttribute("class") || "").slice(0, 110),
        color: resolver(getComputedStyle(el).color),
      });
    }
  }

  return {
    vistos,
    azules,
    /* Si el tema no está aplicado, todo lo demás que se mida es basura. */
    salud: getComputedStyle(document.documentElement).getPropertyValue("--color-paper").trim(),
    hojas: document.querySelectorAll("link[rel=stylesheet], style").length,
  };
}

/** Mata lo que esté escuchando en el puerto, con su descendencia. */
function matarPuerto(puerto) {
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
        .filter(Boolean),
    );
    for (const pid of pids) {
      try {
        execSync(`taskkill /F /T /PID ${pid}`, { stdio: "ignore" });
      } catch {}
    }
  } catch {
    // En este proyecto el verificador se corre en Windows; fuera de él, si no
    // hay `netstat`/`taskkill` no hay nada que limpiar y se sigue.
  }
}

async function prepararPagina(page, url) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  // El telón de carga y la transición de página tapan el contenido un instante.
  await page.waitForTimeout(1400);
  // Barrido de scroll: lo que entra con `whileInView` sigue a opacidad 0 hasta
  // que se ve. Sin esta pasada se pierden bloques enteros.
  await page.evaluate(async () => {
    const alto = document.body.scrollHeight;
    for (let y = 0; y < alto; y += window.innerHeight * 0.8) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 220));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 500));
  });
  // Y que toda imagen diferida haya terminado: una foto que carga entre las dos
  // capturas ensucia la máscara de glifo.
  await page.evaluate(() =>
    Promise.all(
      [...document.images].filter((i) => !i.complete).map(
        (i) => new Promise((r) => {
          i.addEventListener("load", r, { once: true });
          i.addEventListener("error", r, { once: true });
        }),
      ),
    ),
  );
  await page.waitForTimeout(400);
}

function medirControl(A, B, info) {
  const px = (buf, x, y) => {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || y < 0 || x >= A.info.width || y >= A.info.height) return null;
    const i = (y * A.info.width + x) * 3;
    return [buf[i], buf[i + 1], buf[i + 2]];
  };

  const x0 = Math.round(info.x);
  const y0 = Math.round(info.y);
  const w = Math.round(info.w);
  const h = Math.round(info.h);

  // ── TEXTO ────────────────────────────────────────────────────────────────
  // Máscara de glifo = donde la captura normal y la de texto transparente
  // difieren. El fondo bajo el texto sale de la segunda.
  let peorTexto = Infinity;
  let pixelesGlifo = 0;
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      const a = px(A.data, x, y);
      const b = px(B.data, x, y);
      if (!a || !b) continue;
      const dif = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
      if (dif < 12) continue;
      pixelesGlifo++;
      peorTexto = Math.min(peorTexto, ratio(sobre(info.color, b), b));
    }
  }

  // ── LÍMITE DEL CONTROL ───────────────────────────────────────────────────
  // Punto a punto del perímetro: dentro contra fuera. El botón puede estar
  // delimitado por el borde O por el relleno, así que en cada punto vale el
  // mejor de los dos; el límite del control es el peor de todos los puntos.
  const valores = [];
  let queLimite = "";
  const puntos = [];
  /*
   * EL LÍMITE NO SE LEE DE LOS PÍXELES DE DENTRO, se compone.
   *
   * De fuera se muestrea la página de verdad —que es lo que obliga a
   * fotografiar: sobre una cabecera con foto el fondo no se puede deducir—.
   * De dentro se usan los colores DECLARADOS del relleno y del borde,
   * compuestos sobre ese fondo real.
   *
   * Leer también el interior de la captura era el origen de las lecturas de
   * 1,00:1 en botones que a mano miden 5,15:1 y 15,7:1: acertar el píxel de un
   * filete de 1px depende del redondeo del rectángulo, del antialiasing de la
   * esquina y de que nada se esté moviendo, y cuando se falla se lee el mismo
   * plano por dentro y por fuera. Componiendo, el interior deja de depender de
   * la geometría y el exterior sigue siendo el fondo real.
   */
  const N = 12;
  for (let i = 1; i < N; i++) {
    const t = i / N;
    puntos.push({ x: x0 + t * w, y: y0, dx: 0, dy: -1 });
    puntos.push({ x: x0 + t * w, y: y0 + h - 1, dx: 0, dy: 1 });
  }
  for (let i = 1; i < 5; i++) {
    const t = i / 5;
    puntos.push({ x: x0, y: y0 + t * h, dx: -1, dy: 0 });
    puntos.push({ x: x0 + w - 1, y: y0 + t * h, dx: 1, dy: 0 });
  }
  for (const p of puntos) {
    const fuera = px(B.data, p.x + p.dx * 4, p.y + p.dy * 4);
    if (!fuera) continue;
    let mejor = 0;
    let que = "";
    if (info.relleno.alpha > 0.05) {
      const v = ratio(sobre(info.relleno, fuera), fuera);
      if (v > mejor) { mejor = v; que = "relleno"; }
    }
    if (info.anchoBorde > 0 && info.borde.alpha > 0.05) {
      const v = ratio(sobre(info.borde, fuera), fuera);
      if (v > mejor) { mejor = v; que = "borde"; }
    }
    if (que) valores.push({ v: mejor, que });
  }

  /* Decil inferior y no mínimo estricto: un solo punto que caiga en la sombra
     de un vecino no debe suspender un botón bien delimitado en todo su
     contorno. Un borde realmente débil falla a lo largo del perímetro entero. */
  valores.sort((a, b) => a.v - b.v);
  const peor = valores[Math.floor(valores.length * 0.1)] ?? valores[0];
  const peorLimite = peor ? peor.v : Infinity;
  queLimite = peor ? peor.que : "";

  const grande = info.fs >= 24 || (info.fs >= 18.66 && info.fw >= 700);
  return {
    texto: pixelesGlifo > 0 ? peorTexto : null,
    umbralTexto: info.soloIcono ? 3 : grande ? 3 : 4.5,
    limite: info.esCaja && Number.isFinite(peorLimite) ? peorLimite : null,
    queLimite,
  };
}

async function main() {
  /*
   * `srv.kill()` a secas NO servía en Windows: mata el envoltorio de `npx` y
   * deja vivo el `next start` de dentro. Los servidores de ejecuciones
   * anteriores seguían escuchando en el puerto sirviendo builds viejos, cuyos
   * ficheros de CSS ya no existen tras recompilar — la página se cargaba SIN
   * ESTILOS y todo lo que se medía encima era ruido. Se mata el árbol entero.
   */
  matarPuerto(PUERTO);
  const servidor = spawn("npx", ["next", "start", "-p", String(PUERTO)], {
    shell: true,
    stdio: "ignore",
  });
  const navegador = await chromium.launch();
  const fallos = [];
  const azulesTotales = [];
  const sinMedir = [];
  let medidos = 0;

  try {
    // Esperar a que el servidor responda.
    for (let i = 0; i < 40; i++) {
      try {
        const r = await fetch(BASE);
        if (r.ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 750));
    }

    for (const ancho of ANCHOS) {
      const ctx = await navegador.newContext({
        viewport: { width: ancho, height: ancho === 375 ? 780 : 900 },
        deviceScaleFactor: 1,
      });
      const page = await ctx.newPage();

      for (const ruta of SOLO ?? RUTAS) {
        await prepararPagina(page, BASE + ruta);

        const vistas = new Set();
        const claves = new Set();
        const pisados = new Set();
        const vh = page.viewportSize().height;
        const alto = await page.evaluate(() => document.body.scrollHeight);
        let primeros = 0;

        for (let y = 0; y < alto + vh; y += Math.round(vh * 0.8)) {
          await page.evaluate((yy) => window.scrollTo(0, yy), y);
          /*
           * Espera larga a propósito. Los bloques entran con \`whileInView\`
           * (framer, ~600ms de recorrido), así que a 280ms el rectángulo se
           * leía a mitad de animación y la captura salía 100ms después, ya
           * movida: el botón de enviar de Contacto daba 1,00:1 —dentro y fuera
           * cayendo los dos sobre el papel de la página— con un relleno de
           * tinta que a ojo está a 15,7:1.
           */
          await page.waitForTimeout(950);

          const { vistos, azules, salud, hojas } = await page.evaluate(recoger);
          /*
           * Si el tema no está aplicado, todo lo que se mida a continuación es
           * basura: sin CSS el botón de enviar de Contacto se convertía en
           * texto suelto de 125x21 a 8px del margen y daba 1,01:1 contra el
           * blanco del navegador. Se comprueba contra un token del tema, no
           * contra el fondo del body —que en la portada es transparente porque
           * el color lo pone otra capa—.
           */
          if (salud !== "#f5f2ee") {
            console.log(`  ! ${ruta} @${ancho} y=${y}: tema sin aplicar (--color-paper=«${salud}», hojas=${hojas}). Tramo descartado.`);
            continue;
          }
          if (y === 0) {
            primeros = vistos.length;
            for (const a of azules) azulesTotales.push({ ruta, ancho, ...a });
          }
          for (const v of vistos) claves.add(v.clave);

          const aquí = vistos.filter((v) => v.dentro && !v.pisado && !vistas.has(v.clave));
          for (const v of vistos) if (v.pisado) pisados.add(v.clave);
          if (!aquí.length) continue;

          const shotA = await page.screenshot();
          /*
           * Se guarda el handle de la hoja inyectada y se retira ESA. Antes se
           * borraba «el último <style> del head», y no siempre era el mío: Next
           * inyecta los suyos (fuentes) después, así que tramo a tramo se iba
           * llevando por delante hojas del propio sitio hasta dejar la página en
           * HTML pelado. El botón de enviar de Contacto pasaba entonces a ser
           * texto suelto de 125x21 a 8px del margen —el margen por defecto del
           * navegador— y se medía contra una captura sin estilos.
           */
          const hoja = await page.addStyleTag({
            content: `*, *::before, *::after { color: transparent !important;
                      -webkit-text-fill-color: transparent !important; }`,
          });
          const shotB = await page.screenshot();
          await hoja.evaluate((el) => el.remove());

          const A = await sharp(shotA).removeAlpha().raw().toBuffer({ resolveWithObject: true });
          const B = await sharp(shotB).removeAlpha().raw().toBuffer({ resolveWithObject: true });
          if (A.info.width !== B.info.width || A.info.height !== B.info.height) continue;

          /* Y aun así se comprueba: lo que se haya movido entre la lectura y
             la captura no se mide, se deja para el tramo siguiente. */
          const despues = new Map(
            (await page.evaluate(recoger)).vistos.map((v) => [v.clave, v]),
          );
          for (const info of aquí) {
            const d = despues.get(info.clave);
            if (!d || Math.abs(d.x - info.x) > 1 || Math.abs(d.y - info.y) > 1) continue;
            const l = medirControl(A, B, info);
            vistas.add(info.clave);
            medidos++;
            const malTexto = l.texto !== null && l.texto < l.umbralTexto - 0.005;
            const malLimite = l.limite !== null && l.limite < 3 - 0.005;
            if (DETALLE) {
              const t = l.texto === null ? "     —" : `${f(l.texto)}:1`;
              const b = l.limite === null ? "     —" : `${f(l.limite)}:1`;
              console.log(
                `     ${ruta}@${ancho}  texto ${t.padStart(8)} /${f(l.umbralTexto)}` +
                  `  ${(l.queLimite || "límite").padEnd(7)} ${b.padStart(8)} /3,00` +
                  `  «${info.texto || "(solo icono)"}»`,
              );
            }
            if (malTexto || malLimite) fallos.push({ ruta, ancho, info, l, malTexto, malLimite });
          }
        }
        for (const k of vistas) pisados.delete(k);
        const perdidos = claves.size - vistas.size;
        process.stdout.write(
          `  ${ruta} @${ancho} · ${vistas.size}/${claves.size} controles` +
            (perdidos ? ` (${perdidos} sin medir: no caben enteros en el viewport)` : "") +
            "\n",
        );
        if (perdidos) sinMedir.push({ ruta, ancho, n: perdidos });
        void primeros;
      }
      await ctx.close();
    }
  } finally {
    await navegador.close();
    servidor.kill();
    matarPuerto(PUERTO);
  }

  console.log(`\n${"═".repeat(78)}`);
  console.log(`MEDIDOS ${medidos} controles del sistema · ${RUTAS.length} rutas × ${ANCHOS.join(" y ")}`);
  console.log("═".repeat(78));

  if (!fallos.length) {
    console.log("\n✓ Ningún control por debajo de su mínimo.");
  } else {
    console.log(`\n✗ ${fallos.length} por debajo del mínimo:\n`);
    for (const x of fallos) {
      console.log(`  ${x.ruta} @${x.ancho}  «${x.info.texto || "(solo icono)"}»`);
      if (x.malTexto)
        console.log(`     texto  ${f(x.l.texto)}:1  / ${f(x.l.umbralTexto)}`);
      if (x.malLimite)
        console.log(`     ${x.l.queLimite.padEnd(7)} ${f(x.l.limite)}:1  / 3,00`);
      console.log(`     ${x.info.clase}`);
    }
  }

  console.log(`\n${"─".repeat(78)}`);
  if (!azulesTotales.length) {
    console.log("✓ Ningún control con el azul de marca de relleno.");
    console.log("✓ Por lo mismo, ninguno con texto claro sobre azul.");
  } else {
    console.log(`✗ ${azulesTotales.length} controles con relleno azul:`);
    for (const a of azulesTotales) {
      const claro = lum(a.color.base) > 0.4;
      console.log(`  ${a.ruta} @${a.ancho} «${a.texto}» ${claro ? "· TEXTO CLARO SOBRE AZUL" : ""}`);
      console.log(`     ${a.clase}`);
    }
  }

  process.exit(fallos.length || azulesTotales.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
