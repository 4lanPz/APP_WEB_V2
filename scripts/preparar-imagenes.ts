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
 * El mapa de destino vive en `src/data/imagenes.ts` (lo consumen las páginas) y
 * de qué original sale cada foto, en `recetas.ts`. Si los dos se desincronizan,
 * el script falla en vez de generar de menos.
 */

import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";
import { SLOTS, slotPorId, type MedidaGris } from "../src/data/slots-imagen";
import { avisoDeCroma, desaturarYNormalizar, medirLuminancia } from "./gris";
import { escribirManifiesto } from "./manifiesto";
import {
  ORIGENES_DIR,
  ORIGEN_ALTA,
  ORIGEN_FOTOS,
  ORIGEN_TELAS,
  type Receta,
} from "./recetas";

const RAIZ = join(import.meta.dirname, "..");
const PUBLIC_DIR = join(RAIZ, "public");

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
