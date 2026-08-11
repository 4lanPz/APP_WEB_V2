/**
 * CONTRASTE DE TODO EL TEXTO ESCRITO EN LOS COLORES DE MARCA, SOBRE EL FONDO REAL.
 *
 *   npm run marca               (necesita el sitio servido; lo levanta él solo)
 *   BASE_JSON=antes.json npm run marca > /dev/null   (guarda una medición)
 *   COMPARAR=antes.json npm run marca                (y la compara con esta)
 *
 * Hermano de `verificar-botones.mjs`, que mide CONTROLES. Este mide TEXTO, que
 * es un universo distinto: el índice de una cabecera, el rótulo de un hueco de
 * imagen o el número de paso del asesor no son botones y aquel barrido no los
 * ve. Cuando se toca un color de marca hay que mirar los dos.
 *
 * QUÉ SE MIDE
 * Todo nodo de texto cuyo color RESUELTO se parezca a `--color-brand`, a
 * `--color-brand-ink` o a `--color-accent`. No se busca la clase `text-brand`
 * ni ninguna otra cadena: se pregunta por el color con el que el navegador va a
 * pintar, así que entran también los literales en estilo en línea y las reglas
 * heredadas.
 *
 * LOS DOS AZULES, NO SOLO UNO. Al principio esto seguía `brand` a secas y
 * `brand-ink` estaba explícitamente excluido —no lo usaba nadie—. En cuanto un
 * rótulo pasa de uno a otro para arreglar su contraste, seguir solo `brand`
 * hace que el suspenso DESAPAREZCA de la lista en vez de aprobar: el número
 * baja y no se ha medido nada. Con los dos dentro, el mismo texto conserva su
 * `id` entre pasadas y `COMPARAR` lo enseña como recuperado.
 *
 * Y EL TERRACOTA, QUE FALTABA. `--color-accent` se quedó fuera de este barrido
 * mientras la tanda que lo escribió iba de azules, y el precio se vio: daba
 * 3,76:1 sobre `paper` en «Ficha preliminar», en la numeración de sección y en
 * el rótulo de todos los huecos de imagen —suspenso de 4,5 en el uso normal del
 * token, no en un caso raro—, y el único registro de ello era un comentario a
 * mano en `SubcategoryTile.tsx`. Un verificador que solo mira dos de los tres
 * colores de la paleta no dice «los colores de marca cumplen»: dice «los dos
 * que miro cumplen», y lo primero es lo que se acaba entendiendo. Lo que este
 * archivo mide es LA PALETA, así que la paleta entra entera.
 *
 * EL COLOR NO SE PARSEA, SE PINTA (igual que en el harness de botones)
 * Tailwind v4 devuelve `oklch(...)`, y las opacidades son
 * `color-mix(in oklab, …)`. Leer eso con una expresión regular da basura, y da
 * basura EN SILENCIO: sale un número plausible y nadie lo mira dos veces. Aquí
 * el color se pinta en un canvas de 1×1 sobre negro y sobre blanco —la pasada
 * negra da alpha×color, la diferencia da 1−alpha— y se lee el píxel. Es el
 * navegador el que resuelve; este archivo solo compone.
 *
 * EL FONDO TAMPOCO SE DEDUCE, SE FOTOGRAFÍA
 * Subir por el árbol leyendo `background-color` miente en cuanto hay algo que
 * no sea un plano: el índice de una `CategoryCard` va sobre una foto con velo,
 * y el árbol devuelve `transparent` hasta la raíz. Se hacen DOS capturas por
 * tramo de scroll —una normal y otra con todo el texto en `transparent`— y la
 * diferencia es la máscara real de glifo; la segunda da el fondo que hay
 * debajo. El color del texto se compone sobre CADA píxel de esa máscara y se
 * reporta el peor.
 *
 * Componer en vez de leer el glifo de la captura es deliberado: el
 * antialiasing del borde de la letra inventa píxeles intermedios que no son ni
 * el texto ni el fondo, y medirlos da mínimos que no existen.
 *
 * NO SE USA `fullPage`. Chromium la implementa redimensionando la superficie de
 * render al alto del documento, y esta maqueta tiene medidas en `vh`: al
 * capturar así todo se desplaza y los rectángulos dejan de corresponder con la
 * imagen. Se va por tramos de scroll, como el harness de botones.
 *
 * UMBRAL: 4,5:1 el texto normal; 3:1 el grande (≥24px, o ≥18,66px con peso
 * ≥700). WCAG 1.4.3.
 */

import { chromium } from "playwright";
import sharp from "sharp";
import { spawn, execSync } from "node:child_process";
import { writeFileSync, readFileSync } from "node:fs";

const PUERTO = 4124;
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
const SOLO = process.env.RUTAS ? process.env.RUTAS.split(",") : null;
/** Vuelca todas las medidas a un JSON para poder comparar dos tokens. */
const BASE_JSON = process.env.BASE_JSON || null;
/** Compara contra un JSON guardado y separa lo que empeora de lo que ya estaba. */
const COMPARAR = process.env.COMPARAR || null;

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
const f = (n) => (n === null || n === undefined ? "—" : n.toFixed(2).replace(".", ","));

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
 * Lo que se ejecuta DENTRO de la página. Va como función de verdad y no como
 * cadena: `page.evaluate` con una cadena la trata como expresión, hay que
 * envolverla en una IIFE y los `\s` de las expresiones regulares se pierden por
 * el camino.
 */
function recoger() {
  const cv = document.createElement("canvas");
  cv.width = 1;
  cv.height = 1;
  const cx = cv.getContext("2d", { willReadFrequently: true });

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
   * LOS COLORES DE REFERENCIA SALEN DEL TEMA, NO DE CONSTANTES ESCRITAS AQUÍ.
   * Así el barrido sigue valiendo el día que un token cambie de valor —que es
   * justo el día en que se corre este script— sin tener que acordarse de
   * actualizar el verificador a la vez que la paleta.
   */
  const raiz = getComputedStyle(document.documentElement);
  const paleta = ["--color-brand", "--color-brand-ink", "--color-accent"].map(
    (nombre) => ({
      nombre,
      color: resolver(raiz.getPropertyValue(nombre).trim()),
    }),
  );

  /* Distancia en RGB. 24 sumando los tres canales es holgado para absorber el
     redondeo del canvas y estrecho para no confundir los tres tokens entre sí:
     el par más cercano es `brand-ink` y `accent`, a 211 uno del otro. */
  const cualToken = (c) => {
    if (c.alpha <= 0.05) return null;
    for (const t of paleta) {
      const d =
        Math.abs(c.base[0] / c.alpha - t.color.base[0]) +
        Math.abs(c.base[1] / c.alpha - t.color.base[1]) +
        Math.abs(c.base[2] / c.alpha - t.color.base[2]);
      if (d < 24) return t.nombre;
    }
    return null;
  };

  const fijos = [];
  for (const el of document.querySelectorAll("body *")) {
    if (getComputedStyle(el).position !== "fixed") continue;
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) fijos.push({ el, r });
  }

  /*
   * SE MIDE EL NODO DE TEXTO, NO EL ELEMENTO. Un `<span>` puede llevar padding,
   * un icono al lado o un pseudo-elemento, y su rectángulo abarca cosas que no
   * son la letra que interesa. El `Range` sobre el nodo de texto devuelve la
   * caja ajustada a los glifos, que es exactamente donde debe caer la máscara.
   */
  const vistos = [];
  const recorrer = (raiz) => {
    const it = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
    for (let n = it.nextNode(); n; n = it.nextNode()) {
      const texto = (n.nodeValue || "").replace(/\s+/g, " ").trim();
      if (!texto) continue;
      const el = n.parentElement;
      if (!el) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      if (parseFloat(cs.opacity) < 0.05) continue;
      const color = resolver(cs.color);
      const token = cualToken(color);
      if (!token) continue;

      const rango = document.createRange();
      rango.selectNodeContents(n);
      for (const r of rango.getClientRects()) {
        if (r.width < 2 || r.height < 2) continue;
        vistos.push({
          texto: texto.slice(0, 40),
          token,
          clase: (el.getAttribute("class") || "").slice(0, 100),
          x: r.left,
          y: r.top,
          w: r.width,
          h: r.height,
          /* Clave estable entre tramos: posición en el DOCUMENTO, no en la
             ventana, o el mismo rótulo se mediría una vez por tramo. */
          clave:
            cs.position === "fixed"
              ? `fijo|${texto.slice(0, 28)}|${Math.round(r.left)}`
              : `${texto.slice(0, 28)}|${Math.round(r.top + window.scrollY)}|${Math.round(r.left)}`,
          dentro:
            r.top >= 2 &&
            r.bottom <= window.innerHeight - 2 &&
            r.left >= 2 &&
            r.right <= window.innerWidth - 2,
          color,
          fs: parseFloat(cs.fontSize) || 16,
          fw: parseInt(cs.fontWeight, 10) || 400,
          /* Lo que flota por encima no es el fondo del texto: es lo que lo
             tapa. Medir a medias da lecturas que cambian de pasada a pasada. */
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
    }
  };
  recorrer(document.body);

  return {
    vistos,
    paleta,
    /* Si el tema no está aplicado, todo lo demás que se mida es basura. */
    salud: getComputedStyle(document.documentElement).getPropertyValue("--color-paper").trim(),
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
    // Fuera de Windows, si no hay `netstat`/`taskkill` no hay nada que limpiar.
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
        (i) =>
          new Promise((r) => {
            i.addEventListener("load", r, { once: true });
            i.addEventListener("error", r, { once: true });
          }),
      ),
    ),
  );
  await page.waitForTimeout(400);
}

/** Peor contraste del glifo contra el fondo real que tiene debajo. */
function medirTexto(A, B, info) {
  const px = (buf, x, y) => {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || y < 0 || x >= A.info.width || y >= A.info.height) return null;
    const i = (y * A.info.width + x) * 3;
    return [buf[i], buf[i + 1], buf[i + 2]];
  };

  const x0 = Math.floor(info.x);
  const y0 = Math.floor(info.y);
  const w = Math.ceil(info.w);
  const h = Math.ceil(info.h);

  let peor = Infinity;
  let pixeles = 0;
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      const a = px(A.data, x, y);
      const b = px(B.data, x, y);
      if (!a || !b) continue;
      const dif = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
      if (dif < 12) continue;
      pixeles++;
      peor = Math.min(peor, ratio(sobre(info.color, b), b));
    }
  }

  const grande = info.fs >= 24 || (info.fs >= 18.66 && info.fw >= 700);
  return {
    valor: pixeles > 0 ? peor : null,
    umbral: grande ? 3 : 4.5,
    pixeles,
  };
}

async function main() {
  matarPuerto(PUERTO);
  const servidor = spawn("npx", ["next", "start", "-p", String(PUERTO)], {
    shell: true,
    stdio: "ignore",
  });
  const navegador = await chromium.launch();
  const medidas = [];
  const sinMedir = [];
  let paletaVista = null;

  try {
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
        const vh = page.viewportSize().height;
        const alto = await page.evaluate(() => document.body.scrollHeight);

        for (let y = 0; y < alto + vh; y += Math.round(vh * 0.8)) {
          await page.evaluate((yy) => window.scrollTo(0, yy), y);
          /* Espera larga a propósito: los bloques entran con `whileInView`
             (~600ms), y a menos de eso el rectángulo se lee a mitad de
             animación y la captura sale ya movida. */
          await page.waitForTimeout(950);

          const { vistos, paleta, salud } = await page.evaluate(recoger);
          if (salud !== "#f5f2ee") {
            console.log(`  ! ${ruta} @${ancho} y=${y}: tema sin aplicar. Tramo descartado.`);
            continue;
          }
          if (!paletaVista) paletaVista = paleta;
          for (const v of vistos) claves.add(v.clave);

          const aqui = vistos.filter((v) => v.dentro && !v.pisado && !vistas.has(v.clave));
          if (!aqui.length) continue;

          const shotA = await page.screenshot();
          /* Se guarda el handle de la hoja inyectada y se retira ESA: Next
             inyecta las suyas después, y borrar «el último <style>» acababa
             llevándose hojas del propio sitio. */
          const hoja = await page.addStyleTag({
            content: `*, *::before, *::after { color: transparent !important;
                      -webkit-text-fill-color: transparent !important; }`,
          });
          const shotB = await page.screenshot();
          await hoja.evaluate((el) => el.remove());

          const A = await sharp(shotA).removeAlpha().raw().toBuffer({ resolveWithObject: true });
          const B = await sharp(shotB).removeAlpha().raw().toBuffer({ resolveWithObject: true });
          if (A.info.width !== B.info.width || A.info.height !== B.info.height) continue;

          /* Lo que se haya movido entre la lectura y la captura no se mide: se
             deja para el tramo siguiente. */
          const despues = new Map(
            (await page.evaluate(recoger)).vistos.map((v) => [v.clave, v]),
          );
          for (const info of aqui) {
            const d = despues.get(info.clave);
            if (!d || Math.abs(d.x - info.x) > 1 || Math.abs(d.y - info.y) > 1) continue;
            /*
             * NI LO QUE HAYA CAMBIADO DE COLOR, y esto no estaba: el stepper del
             * asesor en la portada cambia de paso solo cada pocos segundos y el
             * activo va de `graphite` a `brand` con transición. Si el ciclo
             * avanza entre la lectura y las capturas, se compone un color contra
             * un glifo que ya se está pintando de otro y sale un número que no
             * corresponde a nada — se vio un 1,13:1 en «03 Uso» que no reproduce
             * en tres pasadas seguidas. Quieto se mide; en movimiento se deja.
             *
             * Se compara también el alpha: media transición puede coincidir en
             * base y no en opacidad.
             */
            const movido =
              Math.abs(d.color.base[0] - info.color.base[0]) +
                Math.abs(d.color.base[1] - info.color.base[1]) +
                Math.abs(d.color.base[2] - info.color.base[2]) >
                3 || Math.abs(d.color.alpha - info.color.alpha) > 0.02;
            if (movido) continue;
            const m = medirTexto(A, B, info);
            vistas.add(info.clave);
            if (m.valor === null) continue;
            medidas.push({
              ruta,
              ancho,
              texto: info.texto,
              token: info.token,
              clase: info.clase,
              fs: info.fs,
              fw: info.fw,
              valor: m.valor,
              umbral: m.umbral,
              id: `${ruta}@${ancho}|${info.clave}`,
            });
          }
        }
        const perdidos = claves.size - vistas.size;
        process.stdout.write(
          `  ${ruta} @${ancho} · ${vistas.size}/${claves.size} textos en color de marca` +
            (perdidos ? ` (${perdidos} sin medir: no caben enteros en el viewport)` : "") +
            "\n",
        );
        if (perdidos) sinMedir.push({ ruta, ancho, n: perdidos });
      }
      await ctx.close();
    }
  } finally {
    await navegador.close();
    servidor.kill();
    matarPuerto(PUERTO);
  }

  const aHex = (c) =>
    "#" + c.base.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  const hexes = paletaVista
    ? Object.fromEntries(paletaVista.map((t) => [t.nombre, aHex(t.color)]))
    : {};
  /* Se conserva el nombre `hex` en el JSON: es lo que imprime `COMPARAR` para
     decir contra qué paleta se está comparando. */
  const hex = paletaVista ? paletaVista.map((t) => aHex(t.color)).join(" + ") : "?";

  const porToken = (lista, nombre) => lista.filter((m) => m.token === nombre).length;

  console.log(`\n${"═".repeat(78)}`);
  console.log(
    `MEDIDOS ${medidas.length} textos en los colores de marca · ` +
      `${(SOLO ?? RUTAS).length} rutas × ${ANCHOS.join(" y ")}`,
  );
  for (const t of paletaVista ?? []) {
    console.log(`  ${t.nombre} ${hexes[t.nombre]} · ${porToken(medidas, t.nombre)} textos`);
  }
  console.log("═".repeat(78));

  if (BASE_JSON) {
    writeFileSync(BASE_JSON, JSON.stringify({ hex, medidas }, null, 2));
    console.error(`  guardado en ${BASE_JSON}`);
  }

  const fallos = medidas.filter((m) => m.valor < m.umbral - 0.005);
  const previo = COMPARAR ? JSON.parse(readFileSync(COMPARAR, "utf8")) : null;
  const antes = previo ? new Map(previo.medidas.map((m) => [m.id, m])) : null;

  if (!fallos.length) {
    console.log("\n✓ Ningún texto en color de marca por debajo de su mínimo.");
  } else {
    console.log(`\n✗ ${fallos.length} por debajo del mínimo:\n`);
    for (const x of fallos) {
      const a = antes?.get(x.id);
      const delta = a ? `  (antes ${f(a.valor)}:1, ${a.token ?? "?"})` : "";
      console.log(`  ${x.ruta} @${x.ancho}  «${x.texto}»`);
      console.log(
        `     ${f(x.valor)}:1  / ${f(x.umbral)}   ${x.fs}px/${x.fw}  ${x.token}${delta}`,
      );
      console.log(`     ${x.clase}`);
    }
  }

  if (antes) {
    console.log(`\n${"─".repeat(78)}`);
    const nuevos = fallos.filter((x) => {
      const a = antes.get(x.id);
      return a && a.valor >= a.umbral - 0.005;
    });
    const arreglados = previo.medidas.filter((a) => {
      const h = medidas.find((m) => m.id === a.id);
      return a.valor < a.umbral - 0.005 && h && h.valor >= h.umbral - 0.005;
    });
    console.log(`Comparado con ${previo.hex}: ${nuevos.length} suspensos NUEVOS · ${arreglados.length} recuperados`);
    for (const n of nuevos) console.log(`  ✗ NUEVO  ${n.ruta}@${n.ancho} «${n.texto}» ${f(n.valor)}:1`);
    for (const a of arreglados) {
      const h = medidas.find((m) => m.id === a.id);
      const salto = a.token && h.token !== a.token ? `  ${a.token} → ${h.token}` : "";
      console.log(
        `  ✓ pasa   ${a.ruta}@${a.ancho} «${a.texto}» ${f(a.valor)}:1 → ${f(h.valor)}:1${salto}`,
      );
    }

    /* Un texto que estaba en la base y hoy no aparece NO es un arreglo: es algo
       que se salió del barrido —cambió a un color que no es ninguno de los tres
       de la paleta, o desapareció de la página—. Se dice, porque si no el total
       baja solo y parece una mejora. */
    const idsHoy = new Set(medidas.map((m) => m.id));
    const ausentes = previo.medidas.filter((a) => !idsHoy.has(a.id));
    if (ausentes.length) {
      console.log(`  · ${ausentes.length} de la base ya no se miden (fuera de la paleta o fuera de la página):`);
      for (const a of ausentes.slice(0, 12)) {
        console.log(`      ${a.ruta}@${a.ancho} «${a.texto}» daba ${f(a.valor)}:1`);
      }
      if (ausentes.length > 12) console.log(`      … y ${ausentes.length - 12} más`);
    }

    /* El peor y el mejor de cada lado, para ver hacia dónde se movió todo. */
    const emparejados = medidas
      .map((m) => ({ m, a: antes.get(m.id) }))
      .filter((p) => p.a);
    if (emparejados.length) {
      const dif = emparejados.map((p) => p.m.valor - p.a.valor);
      console.log(
        `  desplazamiento sobre ${emparejados.length} medidas emparejadas: ` +
          `${f(Math.min(...dif))} … ${f(Math.max(...dif))}`,
      );
    }
  }

  if (sinMedir.length) {
    console.log(`\n${"─".repeat(78)}`);
    console.log("Sin medir (no caben enteros en el viewport):");
    for (const s of sinMedir) console.log(`  ${s.ruta}@${s.ancho}: ${s.n}`);
  }

  process.exit(fallos.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
