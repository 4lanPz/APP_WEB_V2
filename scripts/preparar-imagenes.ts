/**
 * Genera las imágenes optimizadas de `public/` a partir de los originales de
 * `Telas_PW/`.
 *
 *   npx tsx scripts/preparar-imagenes.ts
 *
 * `Telas_PW/` pesa 2,4 GB y está fuera del repo; algunos originales pasan de
 * 28 MB. Aquí se reducen y se pasan a WebP para que lo versionado sea del orden
 * de decenas de KB. Es idempotente: se puede volver a correr cuando el cliente
 * entregue material nuevo.
 *
 * El mapa de destino vive en `src/data/imagenes.ts` (lo consumen las páginas);
 * aquí solo se declara de qué archivo sale cada uno. Si los dos se desincronizan,
 * el script falla en vez de generar de menos.
 */

import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";
import { SLOTS, slotPorId, type MedidaGris } from "../src/data/slots-imagen";
import { avisoDeCroma, desaturarYNormalizar, medirLuminancia } from "./gris";
import { escribirManifiesto } from "./manifiesto";

const RAIZ = join(import.meta.dirname, "..");
const ORIGENES_DIR = join(RAIZ, "Telas_PW");
const PUBLIC_DIR = join(RAIZ, "public");

interface Receta {
  /** Ruta dentro de Telas_PW/ */
  origen: string;
  /** Ancho máximo de salida, en px. */
  ancho: number;
  /**
   * Rectángulo del ORIGINAL que se conserva, en píxeles del archivo tal cual
   * sale de la cámara. Sin él se procesa el cuadro entero, que es lo que hacen
   * todas las telas menos las que alimentan la lupa.
   *
   * Las coordenadas son sobre el archivo SIN rotar. Es seguro porque el recorte
   * se aplica antes que `.rotate()` y los originales de Athletic traen
   * `orientation: 1` —comprobado, no supuesto—: si algún día entra aquí un
   * original con EXIF girado, el recorte caería en otra parte de la foto, y por
   * eso `generar()` lo verifica y falla en vez de recortar a ciegas.
   */
  recorte?: { left: number; top: number; width: number; height: number };
}

/** De qué original sale cada foto de sección. */
const ORIGEN_FOTOS: Record<string, Receta> = {
  "oficio-nave-tejido": { origen: "Tejeduria6.jpg", ancho: 1920 },
  "oficio-taller-alangasi": { origen: "Enero_1 (4).jpg", ancho: 1200 },
  "local-fachada": { origen: "_DSC5241.jpg", ancho: 1920 },
  "macro-fibra-blanca": { origen: "Post 16_2.jpg", ancho: 1920 },
  "macro-tejido": { origen: "_MG_4106.jpg", ancho: 1920 },
  "macro-punto-camiseta": { origen: "Post-16_1-(4).jpg", ancho: 1920 },
};

/** De qué original sale la foto de cada tela. */
const ORIGEN_TELAS: Record<string, Receta> = {
  "sevilla-plus": {
    origen: "Tela Sevilla Plus Microfibra/_MG_3673.jpg",
    ancho: 1280,
  },
  /**
   * Titanium publica TRES vistas, y el orden de la galería no se decide aquí:
   * lo decide `vistasDeTela` a partir del id del slot (principal → caída →
   * trama). Cambiar cuál es la principal es cambiar qué original alimenta cada
   * id, no reordenar este mapa.
   *
   * Las tres son 4:3, que es la relación de la caja de la principal
   * (`aspect-4/3` con `object-cover`, ver `MacroLupa`). Entrando ya en 4:3
   * llenan la caja con los 1280px generados; un origen 16:9 dejaría ~960 útiles
   * y la caja tendría que estirarlos. Vale para las tres porque cualquiera de
   * ellas pasa a ser la principal al pulsar su miniatura.
   *
   * EL LOTE TRAE UNA CUARTA, Y NO SE PUBLICA. `TITANIUM (4).jpg` era una copia
   * de la (3) —mismo md5, no parecidas: la misma—, así que cablearla pondría la
   * foto principal otra vez en la tira de miniaturas, que se lee como un fallo.
   * Comprobado antes de descartarla, no supuesto.
   */
  titanium: { origen: "NuevasTelas/TITANIUM (3).jpg", ancho: 1280 },
  "titanium-caida": { origen: "NuevasTelas/TITANIUM (1).jpg", ancho: 1280 },
  "titanium-trama": { origen: "NuevasTelas/TITANIUM (2).jpg", ancho: 1280 },
  // b.jpg = blanco (convención a/am/b/n/r = azul/amarillo/blanco/negro/rojo,
  // verificada contra la carpeta kAPPA, que usa los nombres completos).
  athletic: { origen: "Microfibra/athletic/b.jpg", ancho: 1080 },
  chelsea: { origen: "Microfibra/chelsea/b.jpg", ancho: 1080 },
  dortmund: { origen: "Microfibra/dormunt/b.jpg", ancho: 1080 },
  // Mezi no tiene b.jpg; su único color plano limpio es el negro.
  mezi: { origen: "texturizado/mezi/negro.jpg", ancho: 1080 },
  "dortmund-plus-brillante": {
    origen: "Telas Brillantes/Dortmund (1).jpg",
    ancho: 1280,
  },
  "sevilla-plus-brillante": {
    origen: "Telas Brillantes/Sevilla (1).jpg",
    ancho: 1280,
  },

  /**
   * Macros de `Texturaa Fotos/`. El archivo no dice qué tela es; lo dice la
   * ETIQUETA de producción que aparece en la toma siguiente del mismo lote, y
   * que se anota aquí junto a sus valores. Donde la ficha existe y la etiqueta
   * es legible, los números coinciden — esa es la verificación.
   */
  // Microfibra
  "dobleface-plus": { origen: "Texturaa Fotos/IMG_7987.jpg", ancho: 1280 }, // IMG_7988 · DOBLE FACE PLUS · 1,20 / 3,00 / 139,00
  sevilla: { origen: "Texturaa Fotos/IMG_8011.jpg", ancho: 1280 }, // IMG_8012 · SEVILLA · 0,90 / 3,90 / 142,30
  "aston-plus": { origen: "Texturaa Fotos/IMG_8013.jpg", ancho: 1280 }, // IMG_8015 · ASTON PLUS · 1,20 / 3,15 / 132,47
  kansas: { origen: "Texturaa Fotos/IMG_8016.jpg", ancho: 1280 }, // IMG_8019 · KANSAS · 1,20 / 3,20
  boston: { origen: "Texturaa Fotos/IMG_8020.jpg", ancho: 1280 }, // IMG_8023 · BOSTON · 0,90 / 4,30
  // La etiqueta dice MICROFIBRA: no es "Juventus 0,90 Tex", que es texturizado
  // y además a pedido. Sin ese campo, los dos nombres serían indistinguibles.
  juventus: { origen: "Texturaa Fotos/IMG_8024.jpg", ancho: 1280 }, // IMG_8027 · JUVENTUS · microfibra

  // Texturizado
  gaby: { origen: "Texturaa Fotos/IMG_8103.jpg", ancho: 1280 }, // IMG_8104 · GABY · 0,90 / 3,60 / 154,32
  napoli: { origen: "Texturaa Fotos/IMG_8105.jpg", ancho: 1280 }, // IMG_8107 · NAPOLI · 1,20 / 3,00 / 138,89
  napoles: { origen: "Texturaa Fotos/IMG_8108.jpg", ancho: 1280 }, // IMG_8111 · NAPOLES · 1,20
  kiana: { origen: "Texturaa Fotos/IMG_8112.jpg", ancho: 1280 }, // IMG_8114 · KIANA · 0,90
  river: { origen: "Texturaa Fotos/IMG_8115.jpg", ancho: 1280 }, // IMG_8118 · RIVER · 1,20 / 3,80
  // "Ribb 150" texturizado, que es de línea. No confundir con "Ribb 150 Mic
  // Tampa", que es microfibra y va a pedido: la etiqueta dice Texturizado.
  "ribb-150": { origen: "Texturaa Fotos/IMG_8123.jpg", ancho: 1280 }, // IMG_8125 · RIBB 150 · texturizado

  /**
   * Interlock 30 vs 40, que estaba sin resolver. Hay dos etiquetas: "INTERLOCK
   * SPUN/40 BLANCO FROZEN" a 1,20 / 2,40 y "INTERLOCK SPUN BLANCO FROZEN" a
   * 1,10 / 2,10 / 216,45. `INTERLOCK.png` marca 1,10 / 2,10 / 216,45, luego esa
   * ficha es la del 30 — por el dato, no por el nombre del archivo.
   */
  "interlock-30": {
    origen: "Tela Interlock Spum Blanco Frozen/_MG_3618.jpg",
    ancho: 1280,
  },
  "interlock-40": { origen: "Texturaa Fotos/IMG_8035.jpg", ancho: 1280 }, // IMG_8036 · INTERLOCK SPUN/40 · 1,20 / 2,40

  // Poli-algodón. Las tres Lacoast se distinguen porque cada etiqueta lleva su
  // nombre completo: LACOAST, LACOAST POLO y LACOAST KRATOS MARENGO.
  "denis-20": { origen: "Texturaa Fotos/IMG_8083.jpg", ancho: 1280 }, // IMG_8084 · DENIS · poli-algodón/20
  "lacoast-20": { origen: "Texturaa Fotos/IMG_8088.jpg", ancho: 1280 }, // IMG_8091 · LACOAST
  "lacoast-polo-20": { origen: "Texturaa Fotos/IMG_8085.jpg", ancho: 1280 }, // IMG_8087 · LACOAST POLO · 80/20
  "lacoast-kratos-22": { origen: "Texturaa Fotos/IMG_8099.jpg", ancho: 1280 }, // IMG_8102 · LACOAST KRATOS MARENGO · 1,20 / 1,82
  "pique-ares-24": { origen: "Texturaa Fotos/IMG_8096.jpg", ancho: 1280 }, // IMG_8098 · PIQUE ARES · 1,20 / 2,10
};

/**
 * Derivados de alta de la galería de Athletic (base de la principal + capa de
 * la lupa macro). Ver `SLOTS_ALTA_TELA` en `slots-imagen.ts` para el porqué de
 * que sean dos archivos.
 *
 * EL RECORTE ES EL MISMO EN LOS DOS Y NO SE TOCA POR SEPARADO. Es la esquina
 * superior derecha del original, 4:3 exacto (3000x2250), elegida por
 * composición sobre la zona en foco: la foto tiene profundidad de campo real y
 * el resto del cuadro se deshace al ampliar. Si alguien mueve uno de los dos
 * rectángulos y no el otro, la lupa deja de ampliar el punto que señala el
 * cursor.
 *
 * Los anchos: 2400 es lo que pide la principal con holgura; 3000 es el ancho
 * ÍNTEGRO del recorte, o sea el techo real. Subirlo sería escalar, y escalar es
 * inventar píxeles que la óptica no capturó — `generar()` lo rechaza.
 */
const RECORTE_ATHLETIC = { left: 3000, top: 0, width: 3000, height: 2250 };

const ORIGEN_ALTA: Record<string, Receta> = {
  "athletic-macro": {
    origen: "Microfibra/Athletic (3).jpeg",
    ancho: 2400,
    recorte: RECORTE_ATHLETIC,
  },
  "athletic-zoom": {
    origen: "Microfibra/Athletic (3).jpeg",
    ancho: 3000,
    recorte: RECORTE_ATHLETIC,
  },
};

async function generar(id: string, receta: Receta): Promise<MedidaGris | undefined> {
  const slot = slotPorId(id);
  if (!slot) throw new Error(`[${id}] no es un slot de slots-imagen.ts`);

  const entrada = join(ORIGENES_DIR, receta.origen);
  if (!existsSync(entrada)) {
    throw new Error(`[${id}] no existe el original: ${receta.origen}`);
  }

  const salida = join(PUBLIC_DIR, slot.destino);
  mkdirSync(dirname(salida), { recursive: true });

  let img = sharp(entrada);

  if (receta.recorte) {
    const { left, top, width, height } = receta.recorte;
    const meta = await sharp(entrada).metadata();

    // Las coordenadas se anotan mirando el archivo sin rotar. Con EXIF girado
    // el recorte caería en otra zona de la foto y saldría un derivado plausible
    // pero equivocado — el peor fallo posible aquí, porque no se ve al mirar el
    // log. Se para antes de escribir nada.
    if (meta.orientation && meta.orientation !== 1) {
      throw new Error(
        `[${id}] ${receta.origen} trae orientation=${meta.orientation}; el recorte está anotado sobre el archivo sin rotar`,
      );
    }
    if (
      !meta.width ||
      !meta.height ||
      left + width > meta.width ||
      top + height > meta.height
    ) {
      throw new Error(
        `[${id}] el recorte ${width}x${height}+${left}+${top} se sale de ${meta.width}x${meta.height} en ${receta.origen}`,
      );
    }
    if (receta.ancho > width) {
      throw new Error(
        `[${id}] se piden ${receta.ancho}px de ancho pero el recorte solo da ${width}px: sería inventar píxeles`,
      );
    }

    img = img.extract(receta.recorte);
  }

  const encuadrada = img
    .rotate() // respeta la orientación EXIF; si no, algunas salen giradas
    .resize({ width: receta.ancho, withoutEnlargement: true });

  /*
    Las fotos que alimentan la simulación de color pasan por el preprocesado de
    gris ANTES de codificar; el resto se escribe exactamente como siempre, byte
    a byte, para que retocar una tela no reescriba las treinta.
  */
  const gris = slot.gris ? await desaturarYNormalizar(encuadrada) : null;

  const info = await (gris?.salida ?? encuadrada)
    .webp({ quality: 82 })
    .toFile(salida);

  const kb = Math.round(info.size / 1024);
  const marca = receta.recorte ? " ·recorte" : "";
  console.log(
    `  ${id.padEnd(26)} ${String(info.width).padStart(4)}x${String(info.height).padEnd(4)}  ${String(kb).padStart(4)} KB   <- ${receta.origen}${marca}`,
  );

  if (!gris) return undefined;

  // La luminancia se mide sobre el archivo ya escrito: es el gris que va a
  // recibir el navegador, no el del búfer de antes de comprimir.
  const medida: MedidaGris = {
    k: await medirLuminancia(salida),
    croma: gris.croma,
  };
  console.log(
    `  ${"".padEnd(26)} gris · k ${medida.k.toFixed(3)} · croma del original ${medida.croma.toFixed(1)}`,
  );
  return medida;
}

/**
 * Ids a regenerar, de los argumentos. Sin argumentos se regenera todo, que es
 * el comportamiento de siempre.
 *
 * POR QUÉ EXISTE ESTE FILTRO
 * Correr el script entero reescribe los 30 y pico WebP del sitio aunque no haya
 * cambiado ninguna receta: basta que cambie la versión de sharp o de libwebp
 * para que salgan bytes distintos con la misma imagen. El resultado es un
 * commit con treinta archivos tocados donde solo uno se pretendía cambiar, y
 * ahí ya no se puede revisar nada. Con el filtro, retocar una foto toca esa
 * foto.
 */
function idsPedidos(): Set<string> | null {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  return args.length ? new Set(args) : null;
}

async function main() {
  const filtro = idsPedidos();

  // Un origen que no corresponde a ningún slot escribiría un archivo que
  // ninguna página lee. Falla en vez de generar basura en silencio.
  const idsValidos = new Set(SLOTS.map((s) => s.id));
  const sueltos = [
    ...Object.keys(ORIGEN_FOTOS),
    ...Object.keys(ORIGEN_TELAS),
    ...Object.keys(ORIGEN_ALTA),
  ].filter((id) => !idsValidos.has(id));
  if (sueltos.length) {
    throw new Error(
      `estos ids no existen en slots-imagen.ts: ${sueltos.join(", ")}`,
    );
  }

  // Un id pedido que no existe en ninguna receta es una errata: sin esto el
  // script diría "0 imágenes generadas" y se leería como que ya estaba hecho.
  const todas = { ...ORIGEN_FOTOS, ...ORIGEN_TELAS, ...ORIGEN_ALTA };
  if (filtro) {
    const desconocidos = [...filtro].filter((id) => !(id in todas));
    if (desconocidos.length) {
      throw new Error(
        `no hay receta para: ${desconocidos.join(", ")}`,
      );
    }
  }

  const grupos: [string, Record<string, Receta>][] = [
    ["fotos de sección", ORIGEN_FOTOS],
    ["fotos de tela", ORIGEN_TELAS],
    ["derivados de alta (galería con lupa)", ORIGEN_ALTA],
  ];

  let n = 0;
  const medidas = new Map<string, MedidaGris>();
  for (const [titulo, mapa] of grupos) {
    const entradas = Object.entries(mapa).filter(
      ([id]) => !filtro || filtro.has(id),
    );
    if (!entradas.length) continue;
    console.log(`\n${titulo}`);
    for (const [id, receta] of entradas) {
      const medida = await generar(id, receta);
      if (medida) medidas.set(id, medida);
      n++;
    }
  }

  console.log(`\n${n} imágenes generadas en public/`);
  if (filtro) console.log(`(filtrado a: ${[...filtro].join(", ")})`);

  /*
    El manifiesto se refresca aquí mismo. Antes este script terminaba pidiendo
    correr `npm run imagenes` a continuación, y con las medidas de gris eso ya
    no valdría: el otro script no ha visto los originales, así que no puede
    calcular ni el croma ni la luminancia de lo que se acaba de generar.
  */
  const { llenos, vacios, sinMedir } = escribirManifiesto(medidas);
  console.log(
    `manifiesto actualizado — ${llenos.length} de ${SLOTS.length} slots con imagen, ${vacios.length} vacíos`,
  );

  const avisos = [...medidas]
    .map(([id, m]) => avisoDeCroma(id, m.croma))
    .filter((a): a is string => a !== undefined);
  if (avisos.length) {
    console.log(`\nCROMA POR ENCIMA DEL TECHO — ${avisos.length}`);
    for (const a of avisos) console.log(`  · ${a}`);
  }

  if (sinMedir.length) {
    console.log(
      `\nfotos en gris publicadas SIN medir — ${sinMedir.join(", ")}` +
        `\n  (el recoloreo las compensa con la luminancia supuesta; regenéralas para medirlas)`,
    );
  }
  console.log("");
}

main().catch((e) => {
  console.error(`\nFALLO: ${e.message}\n`);
  process.exit(1);
});
