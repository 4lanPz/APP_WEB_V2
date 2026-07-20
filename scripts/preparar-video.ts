/**
 * Comprime el vídeo del hero a formato web y saca su póster.
 *
 *   npm run video -- ruta/al/original.mov
 *
 * Genera tres archivos en `public/video/`:
 *   hero.mp4         H.264, para todo el mundo
 *   hero.webm        VP9, más pequeño, para navegadores que lo soporten
 *   hero-poster.jpg  primer fotograma útil: se ve mientras carga, y es lo único
 *                    que se muestra si el navegador no reproduce o si el
 *                    sistema pide menos animación
 *
 * Ninguno lleva pista de audio: el hero es mudo por diseño y el audio serían
 * cientos de KB para nada.
 *
 * Requiere ffmpeg en el PATH. No es una dependencia de npm a propósito: se usa
 * una vez cada muchos meses y no tiene sentido cargar 60 MB de binario en el
 * proyecto por eso.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const RAIZ = join(import.meta.dirname, "..");
const SALIDA = join(RAIZ, "public", "video");
const MANIFIESTO = join(RAIZ, "src", "data", "video.generado.ts");

/** Ancho de salida. Es un fondo desenfocado tras texto: 1600 sobra. */
const ANCHO = 1600;
/** Presupuesto de peso. Por encima de esto el hero penaliza el LCP en móvil. */
const LIMITE_MB = 3;

function hayFfmpeg(): boolean {
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function correr(args: string[]) {
  execFileSync("ffmpeg", ["-y", ...args], { stdio: ["ignore", "ignore", "pipe"] });
}

const mb = (p: string) => statSync(p).size / 1024 / 1024;

function main() {
  const origen = process.argv[2];

  if (!origen) {
    console.error(
      "\nfalta el archivo de origen:\n  npm run video -- ruta/al/original.mov\n",
    );
    process.exit(1);
  }
  if (!existsSync(origen)) {
    console.error(`\nno existe: ${origen}\n`);
    process.exit(1);
  }
  if (!hayFfmpeg()) {
    console.error(
      "\nffmpeg no está en el PATH. Instálalo y vuelve a correr:\n" +
        "  winget install Gyan.FFmpeg      (Windows)\n" +
        "  brew install ffmpeg             (macOS)\n" +
        "  sudo apt install ffmpeg         (Debian/Ubuntu)\n\n" +
        "Después abre una terminal nueva para que coja el PATH.\n",
    );
    process.exit(1);
  }

  mkdirSync(SALIDA, { recursive: true });
  const mp4 = join(SALIDA, "hero.mp4");
  const webm = join(SALIDA, "hero.webm");
  const poster = join(SALIDA, "hero-poster.jpg");

  const escala = `scale=${ANCHO}:-2`;

  console.log(`\norigen: ${origen}  (${mb(origen).toFixed(1)} MB)`);

  // -an quita el audio. -movflags +faststart mueve el índice al principio para
  // que el vídeo empiece a verse antes de haberse descargado entero.
  console.log("  · mp4 (H.264)…");
  correr([
    "-i", origen,
    "-an",
    "-c:v", "libx264",
    "-crf", "28",
    "-preset", "slow",
    "-pix_fmt", "yuv420p",
    "-vf", escala,
    "-movflags", "+faststart",
    mp4,
  ]);

  console.log("  · webm (VP9)…");
  correr([
    "-i", origen,
    "-an",
    "-c:v", "libvpx-vp9",
    "-crf", "36",
    "-b:v", "0",
    "-vf", escala,
    webm,
  ]);

  // Segundo 1 y no 0: el primer fotograma suele ser el más oscuro o el que
  // todavía tiene el fundido de entrada.
  console.log("  · póster (jpg)…");
  correr(["-i", origen, "-ss", "1", "-frames:v", "1", "-vf", escala, "-q:v", "4", poster]);

  writeFileSync(
    MANIFIESTO,
    `/**
 * GENERADO — no editar a mano. Lo reescribe \`npm run video\`.
 */

export const HERO_VIDEO_LISTO = true;
`,
    "utf8",
  );

  console.log("\ngenerado en public/video/");
  for (const [nombre, ruta] of [
    ["hero.mp4", mp4],
    ["hero.webm", webm],
    ["hero-poster.jpg", poster],
  ] as const) {
    console.log(`  ${nombre.padEnd(18)} ${mb(ruta).toFixed(2)} MB`);
  }

  const pesado = Math.max(mb(mp4), mb(webm));
  if (pesado > LIMITE_MB) {
    console.log(
      `\naviso — la variante más pesada son ${pesado.toFixed(2)} MB, por encima del\n` +
        `objetivo de ${LIMITE_MB} MB. Opciones, de menos a más agresiva:\n` +
        `  · recortar la duración (6-10 s bastan para un bucle)\n` +
        `  · subir el crf: 28 -> 32 en mp4, 36 -> 40 en webm\n` +
        `  · bajar ANCHO de ${ANCHO} a 1280\n` +
        `Y si aun así no baja, sírvelo desde fuera del repo (ver README-imagenes.md).\n`,
    );
  } else {
    console.log(`\ndentro del presupuesto de ${LIMITE_MB} MB.\n`);
  }
}

main();
