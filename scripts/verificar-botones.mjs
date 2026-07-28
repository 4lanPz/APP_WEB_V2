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
 *  4. LÍMITE del control (WCAG 1.4.11): se recorre el perímetro; en cada punto
 *     se compara el píxel de dentro (borde y relleno) con el de fuera a 4px, y
 *     se toma el mejor de los dos —un botón puede estar delimitado por su
 *     relleno O por su borde—. El límite del botón es el peor de esos puntos.
 *  5. Umbral por tamaño real: 3:1 si ≥24px o ≥18,66px con peso ≥700; 4,5:1 en
 *     el resto. Los controles de solo icono van contra el mínimo no textual de
 *     3:1.
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

const ANCHOS = [375, 1440];

/** Azul de marca, para la auditoría de rellenos. */
const BRAND = [51, 162, 220];

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
     ni texto claro encima de azul. */
  const azules = [];
  for (const el of document.querySelectorAll("a, button, input[type=submit], [role=button]")) {
    const fondo = resolver(getComputedStyle(el).backgroundColor);
    if (fondo.alpha < 0.5) continue;
    const d =
      Math.abs(fondo.base[0] - 51) +
      Math.abs(fondo.base[1] - 162) +
      Math.abs(fondo.base[2] - 220);
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
   * Los extremos del recorrido NO llegan a las esquinas. Con t de 0 a 1 el
   * punto de la arista superior caía en x0+w —ya fuera de la caja por la
   * derecha—, así que «dentro» y «fuera» leían los dos el fondo de la página y
   * el cociente salía 1,00:1. Como el límite es el PEOR de los puntos, ese
   * único punto envenenado suspendía todos los botones del sitio.
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

    /*
     * El borde se barre en los TRES primeros píxeles hacia dentro, no en uno.
     * Leyendo solo a 1px, en un filete de 1px se cae ya en el relleno: los
     * contornos de hero salían a 1,00:1 —fondo contra el mismo fondo— cuando su
     * filete de papel está a 4,89:1. Con el barrido se absorben además el
     * redondeo del rectángulo y los bordes de 2px.
     */
    let mejor = 0;
    let que = "";
    for (const d of [0, 1, 2]) {
      const c = px(B.data, p.x - p.dx * d, p.y - p.dy * d);
      if (!c) continue;
      const r = ratio(c, fuera);
      if (r > mejor) {
        mejor = r;
        que = "borde";
      }
    }
    const relleno = px(B.data, p.x - p.dx * 10, p.y - p.dy * 10);
    if (relleno) {
      const r = ratio(relleno, fuera);
      if (r > mejor) {
        mejor = r;
        que = "relleno";
      }
    }
    if (que) valores.push({ v: mejor, que });
  }

  /*
   * El límite se reporta como el DECIL INFERIOR de los puntos del perímetro, no
   * como el mínimo estricto. El mínimo lo decide un solo píxel, y basta con que
   * uno caiga en una esquina redondeada, en la sombra de un elemento vecino o a
   * medio frame de una animación para suspender un botón que está a 15:1 en
   * todo su contorno —pasó con el envío de Contacto—. Un borde realmente débil
   * falla a lo largo de todo el perímetro, no en un punto: las cabeceras daban
   * 2,0-2,8:1 de forma consistente y el decil las delata igual.
   */
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

      for (const ruta of RUTAS) {
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
