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
import { SLOTS, slotPorId } from "../src/data/slots-imagen";

const RAIZ = join(import.meta.dirname, "..");
const ORIGENES_DIR = join(RAIZ, "Telas_PW");
const PUBLIC_DIR = join(RAIZ, "public");

interface Receta {
  /** Ruta dentro de Telas_PW/ */
  origen: string;
  /** Ancho máximo de salida, en px. */
  ancho: number;
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
  titanium: { origen: "NuevasTelas/TITANIUM (1).jpg", ancho: 1280 },
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

async function generar(id: string, receta: Receta) {
  const slot = slotPorId(id);
  if (!slot) throw new Error(`[${id}] no es un slot de slots-imagen.ts`);

  const entrada = join(ORIGENES_DIR, receta.origen);
  if (!existsSync(entrada)) {
    throw new Error(`[${id}] no existe el original: ${receta.origen}`);
  }

  const salida = join(PUBLIC_DIR, slot.destino);
  mkdirSync(dirname(salida), { recursive: true });

  const info = await sharp(entrada)
    .rotate() // respeta la orientación EXIF; si no, algunas salen giradas
    .resize({ width: receta.ancho, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(salida);

  const kb = Math.round(info.size / 1024);
  console.log(
    `  ${id.padEnd(26)} ${String(info.width).padStart(4)}x${String(info.height).padEnd(4)}  ${String(kb).padStart(4)} KB   <- ${receta.origen}`,
  );
}

async function main() {
  // Un origen que no corresponde a ningún slot escribiría un archivo que
  // ninguna página lee. Falla en vez de generar basura en silencio.
  const idsValidos = new Set(SLOTS.map((s) => s.id));
  const sueltos = [
    ...Object.keys(ORIGEN_FOTOS),
    ...Object.keys(ORIGEN_TELAS),
  ].filter((id) => !idsValidos.has(id));
  if (sueltos.length) {
    throw new Error(
      `estos ids no existen en slots-imagen.ts: ${sueltos.join(", ")}`,
    );
  }

  console.log("\nfotos de sección");
  for (const [id, receta] of Object.entries(ORIGEN_FOTOS)) {
    await generar(id, receta);
  }

  console.log("\nfotos de tela");
  for (const [id, receta] of Object.entries(ORIGEN_TELAS)) {
    await generar(id, receta);
  }

  const n =
    Object.keys(ORIGEN_FOTOS).length + Object.keys(ORIGEN_TELAS).length;
  console.log(`\n${n} imágenes generadas en public/`);
  console.log("recuerda correr  npm run imagenes  para refrescar el manifiesto\n");
}

main().catch((e) => {
  console.error(`\nFALLO: ${e.message}\n`);
  process.exit(1);
});
