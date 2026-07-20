/**
 * Procesa las imágenes que dejes en `entrega/` y actualiza el manifiesto.
 *
 *   npm run imagenes
 *
 * El nombre del archivo manda: `athletic.jpg` va al slot `athletic`. Si dejas un
 * archivo cuyo nombre no corresponde a ningún slot, el script NO lo procesa y te
 * lo dice, con el id más parecido, que es como se cazan las erratas.
 *
 * Al terminar reescribe `src/data/imagenes.generado.ts`, que es lo que hace que
 * una foto aparezca en la web. Por eso no hace falta tocar código para publicar
 * una imagen: se deja el archivo, se corre el comando y ya está.
 *
 * Sobre "los tamaños que next/image necesita": no se pre-generan. next/image
 * produce cada ancho bajo demanda y lo cachea; lo único que importa es que el
 * original sea lo bastante grande. El script avisa si se queda corto.
 */

import {
  existsSync,
  readFileSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
  renameSync,
} from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import sharp from "sharp";
import { SLOTS, SLOTS_TELA, IDS_VALIDOS, slotPorId } from "../src/data/slots-imagen";

const RAIZ = join(import.meta.dirname, "..");
const ENTREGA = join(RAIZ, "entrega");
const PROCESADAS = join(ENTREGA, "procesadas");
const PUBLIC = join(RAIZ, "public");
const MANIFIESTO = join(RAIZ, "src", "data", "imagenes.generado.ts");

const EXTENSIONES = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"]);

/** Distancia de edición completa, para sugerir el id que se quiso escribir. */
function distancia(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return d[a.length][b.length];
}

function sugerir(nombre: string): string | undefined {
  let mejor: string | undefined;
  let min = Infinity;
  for (const id of IDS_VALIDOS) {
    const d = distancia(nombre.toLowerCase(), id.toLowerCase());
    if (d < min) {
      min = d;
      mejor = id;
    }
  }
  // Más de un tercio del nombre distinto ya no es una errata, es otra cosa.
  return min <= Math.max(3, Math.floor(nombre.length / 3)) ? mejor : undefined;
}

interface Resultado {
  procesadas: string[];
  erratas: { archivo: string; sugerencia?: string }[];
  avisos: string[];
}

async function procesarEntrega(): Promise<Resultado> {
  const r: Resultado = { procesadas: [], erratas: [], avisos: [] };
  if (!existsSync(ENTREGA)) {
    mkdirSync(ENTREGA, { recursive: true });
    return r;
  }

  const archivos = readdirSync(ENTREGA, { withFileTypes: true })
    .filter((e) => e.isFile() && EXTENSIONES.has(extname(e.name).toLowerCase()))
    .map((e) => e.name);

  for (const archivo of archivos) {
    const id = basename(archivo, extname(archivo));

    if (!IDS_VALIDOS.has(id)) {
      r.erratas.push({ archivo, sugerencia: sugerir(id) });
      continue;
    }

    const slot = slotPorId(id)!;
    const entrada = join(ENTREGA, archivo);
    const salida = join(PUBLIC, slot.destino);
    mkdirSync(dirname(salida), { recursive: true });

    const meta = await sharp(entrada).metadata();
    if (meta.width && meta.width < slot.ancho) {
      r.avisos.push(
        `${archivo}: ${meta.width}px de ancho, el slot quiere ${slot.ancho}px. ` +
          `Se publica igual, pero se verá blanda en pantallas grandes.`,
      );
    }

    const info = await sharp(entrada)
      .rotate() // respeta la orientación EXIF
      .resize({ width: slot.ancho, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(salida);

    // Se aparta el original para que la carpeta quede vacía y la siguiente
    // tanda se vea de un vistazo. No se borra: es el único máster que hay.
    mkdirSync(PROCESADAS, { recursive: true });
    renameSync(entrada, join(PROCESADAS, archivo));

    r.procesadas.push(
      `${id.padEnd(28)} ${String(info.width).padStart(4)}x${String(info.height).padEnd(4)} ` +
        `${String(Math.round(info.size / 1024)).padStart(4)} KB  -> ${slot.destino}`,
    );
  }
  return r;
}

/**
 * Slots que ningún componente lee.
 *
 * Existe porque ya pasó: había 15 slots registrados y anunciados en
 * /admin/imagenes que ninguna página consumía. El archivo se procesaba, el
 * manifiesto lo daba por lleno, la miniatura salía en el panel — y la página
 * seguía mostrando el placeholder. Un slot registrado pero no cableado es peor
 * que uno que no existe, porque promete.
 *
 * Detección: se busca el id literal en `src/`. Los que se consumen con plantilla
 * (`hito-${ref}`) no aparecen literales, así que se declaran aquí sus prefijos
 * junto al sitio que los lee. Añadir un prefijo obliga a nombrar su consumidor.
 */
const CONSUMO_DINAMICO: { prefijo: string; consumidor: string }[] = [
  { prefijo: "hito-", consumidor: "components/ui/Timeline.tsx" },
  { prefijo: "prenda-", consumidor: "components/ui/GarmentRecommender.tsx" },
];

/**
 * El propio registro y el manifiesto se excluyen del rastreo. Los dos contienen
 * todos los ids literalmente, así que incluirlos haría que la comprobación
 * pasara siempre: encontraría el id en el sitio que lo declara, no en el que lo
 * lee, que es justo lo que hay que distinguir.
 */
const NO_CUENTAN_COMO_CONSUMO = ["slots-imagen.ts", "imagenes.generado.ts"];

function slotsSinCablear(): string[] {
  const fuentes: string[] = [];
  const recorrer = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) recorrer(p);
      else if (/\.tsx?$/.test(e.name) && !NO_CUENTAN_COMO_CONSUMO.includes(e.name)) {
        fuentes.push(readFileSync(p, "utf8"));
      }
    }
  };
  recorrer(join(RAIZ, "src"));
  const codigo = fuentes.join("\n");

  const slugsDeTela = new Set(SLOTS_TELA.map((s) => s.id));

  return SLOTS.filter((slot) => {
    // Las telas se consumen todas por `fotoDeTela(sub.slug)`, desde taxonomy.
    if (slugsDeTela.has(slot.id)) return false;
    if (CONSUMO_DINAMICO.some((d) => slot.id.startsWith(d.prefijo))) return false;
    return !codigo.includes(`"${slot.id}"`);
  }).map((s) => s.id);
}

/** El manifiesto se genera mirando `public/`, no acumulando estado. */
function escribirManifiesto(): { llenos: string[]; vacios: string[] } {
  const llenos: string[] = [];
  const vacios: string[] = [];
  for (const slot of SLOTS) {
    (existsSync(join(PUBLIC, slot.destino)) ? llenos : vacios).push(slot.id);
  }

  const cuerpo = `/**
 * GENERADO — no editar a mano.
 *
 * Lo reescribe \`npm run imagenes\` mirando qué archivos existen en \`public/\`.
 * Es la lista de slots que tienen imagen: lo que decide si una página muestra
 * la foto o el placeholder.
 */

export const SLOTS_LLENOS: ReadonlySet<string> = new Set([
${llenos.map((id) => `  ${JSON.stringify(id)},`).join("\n")}
]);
`;
  writeFileSync(MANIFIESTO, cuerpo, "utf8");
  return { llenos, vacios };
}

async function main() {
  const r = await procesarEntrega();

  if (r.procesadas.length) {
    console.log(`\nprocesadas — ${r.procesadas.length}`);
    for (const l of r.procesadas) console.log(`  ${l}`);
    console.log(`\n  los originales quedaron en entrega/procesadas/`);
  } else {
    console.log("\nno había nada nuevo en entrega/");
  }

  if (r.avisos.length) {
    console.log(`\navisos — ${r.avisos.length}`);
    for (const a of r.avisos) console.log(`  · ${a}`);
  }

  if (r.erratas.length) {
    console.log(`\nNOMBRES QUE NO CORRESPONDEN A NINGÚN SLOT — ${r.erratas.length}`);
    console.log("  (se quedan en entrega/ sin procesar)");
    for (const e of r.erratas) {
      console.log(
        `  · ${e.archivo}${e.sugerencia ? `   ¿querías decir "${e.sugerencia}"?` : ""}`,
      );
    }
    console.log(
      "\n  Los nombres válidos salen en /admin/imagenes, o con:  npm run imagenes:slots",
    );
  }

  const huerfanos = slotsSinCablear();
  if (huerfanos.length) {
    console.log(`
SLOTS REGISTRADOS QUE NINGÚN COMPONENTE LEE — ${huerfanos.length}`);
    console.log("  (la foto se procesaría y la página seguiría vacía)");
    for (const id of huerfanos) console.log(`  · ${id}`);
  }

  const { llenos, vacios } = escribirManifiesto();
  console.log(
    `\nmanifiesto actualizado — ${llenos.length} de ${SLOTS.length} slots con imagen, ${vacios.length} vacíos\n`,
  );

  // Un nombre mal escrito es justo lo que este script existe para cazar: si se
  // ignora, la imagen no aparece y parece un fallo de la web.
  if (r.erratas.length || huerfanos.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(`\nFALLO: ${e.message}\n`);
  process.exit(1);
});
