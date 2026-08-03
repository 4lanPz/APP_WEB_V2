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
  renameSync,
} from "node:fs";
import { basename, dirname, extname, join, relative } from "node:path";
import sharp from "sharp";
import {
  SLOTS,
  SLOTS_TELA,
  IDS_VALIDOS,
  slotPorId,
  type MedidaGris,
} from "../src/data/slots-imagen";
import { avisoDeCroma, desaturarYNormalizar, medirLuminancia } from "./gris";
import { escribirManifiesto } from "./manifiesto";

const RAIZ = join(import.meta.dirname, "..");
const ENTREGA = join(RAIZ, "entrega");
const PROCESADAS = join(ENTREGA, "procesadas");
const PUBLIC = join(RAIZ, "public");

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
  /** Medidas de las fotos en gris que se acaban de procesar. */
  medidas: Map<string, MedidaGris>;
}

async function procesarEntrega(): Promise<Resultado> {
  const r: Resultado = { procesadas: [], erratas: [], avisos: [], medidas: new Map() };
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

    const encuadrada = sharp(entrada)
      .rotate() // respeta la orientación EXIF
      .resize({ width: slot.ancho, withoutEnlargement: true });

    /*
      Mismo preprocesado que en `preparar-imagenes.ts`, y por eso los dos lo
      importan del mismo módulo: una foto de Titanium que entre por aquí tiene
      que salir con el mismo gris que la que entró desde `Telas_PW/`, o la misma
      tela se vería de dos tonos según por dónde llegó su archivo.
    */
    const gris = slot.gris ? await desaturarYNormalizar(encuadrada) : null;

    const info = await (gris?.salida ?? encuadrada)
      .webp({ quality: 82 })
      .toFile(salida);

    if (gris) {
      const medida: MedidaGris = {
        k: await medirLuminancia(salida),
        croma: gris.croma,
      };
      r.medidas.set(id, medida);
      const aviso = avisoDeCroma(id, medida.croma);
      if (aviso) r.avisos.push(aviso);
    }

    // Se aparta el original para que la carpeta quede vacía y la siguiente
    // tanda se vea de un vistazo. No se borra: es el único máster que hay.
    mkdirSync(PROCESADAS, { recursive: true });
    renameSync(entrada, join(PROCESADAS, archivo));

    const medida = r.medidas.get(id);
    r.procesadas.push(
      `${id.padEnd(28)} ${String(info.width).padStart(4)}x${String(info.height).padEnd(4)} ` +
        `${String(Math.round(info.size / 1024)).padStart(4)} KB  -> ${slot.destino}` +
        (medida
          ? `\n  ${"".padEnd(28)} gris · k ${medida.k.toFixed(3)} · croma del original ${medida.croma.toFixed(1)}`
          : ""),
    );
  }
  return r;
}

/**
 * Un archivo de `src/`, con su ruta relativa, para los chequeos de abajo.
 *
 * Los dos recorren el mismo árbol y antes cada uno lo leía por su cuenta. Una
 * sola pasada, porque dos recorridos independientes solo sirven para que un día
 * discrepen en qué archivos miran y un chequeo vea código que el otro no.
 */
interface Fuente {
  /** Relativa a la raíz y con barras normales, para que el aviso sea clicable. */
  ruta: string;
  codigo: string;
}

function archivosFuente(): Fuente[] {
  const fuentes: Fuente[] = [];
  const recorrer = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) recorrer(p);
      else if (/\.tsx?$/.test(e.name)) {
        fuentes.push({
          ruta: relative(RAIZ, p).replaceAll("\\", "/"),
          codigo: readFileSync(p, "utf8"),
        });
      }
    }
  };
  recorrer(join(RAIZ, "src"));
  return fuentes;
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
  // Las cuatro familias salen de `categories.map`, así que el id se arma como
  // `familia-${category.slug}` y nunca aparece literal en el código.
  { prefijo: "familia-", consumidor: "app/page.tsx y app/productos/page.tsx" },
];

/**
 * FALSOS POSITIVOS CONOCIDOS DE ESTE CHEQUEO — no descartes la lista por ellos.
 *
 * Las vistas de galería (`<slug>-caida`, hoy 29) se consumen por plantilla desde
 * `vistasDeTela`, que arma los ids con `${slug}-${sufijo}`. Como la detección
 * busca el id LITERAL, salen todas como no cableadas y no lo están.
 *
 * No llevan entrada en `CONSUMO_DINAMICO` porque su prefijo es el slug de cada
 * tela —serían 29 entradas, una por tela, y una más cada vez que el catálogo
 * crezca—; lo que las agrupa es el SUFIJO, y eso este chequeo todavía no lo
 * sabe mirar. Queda pendiente a propósito: arreglarlo es tocar la detección
 * entera, no añadir una excepción.
 */

/**
 * El propio registro y el manifiesto se excluyen del rastreo. Los dos contienen
 * todos los ids literalmente, así que incluirlos haría que la comprobación
 * pasara siempre: encontraría el id en el sitio que lo declara, no en el que lo
 * lee, que es justo lo que hay que distinguir.
 */
const NO_CUENTAN_COMO_CONSUMO = ["slots-imagen.ts", "imagenes.generado.ts"];

function slotsSinCablear(fuentes: Fuente[]): string[] {
  const codigo = fuentes
    .filter((f) => !NO_CUENTAN_COMO_CONSUMO.includes(basename(f.ruta)))
    .map((f) => f.codigo)
    .join("\n");

  const slugsDeTela = new Set(SLOTS_TELA.map((s) => s.id));

  return SLOTS.filter((slot) => {
    // Las telas se consumen todas por `fotoDeTela(sub.slug)`, desde taxonomy.
    if (slugsDeTela.has(slot.id)) return false;
    if (CONSUMO_DINAMICO.some((d) => slot.id.startsWith(d.prefijo))) return false;
    return !codigo.includes(`"${slot.id}"`);
  }).map((s) => s.id);
}

/* ------------------------------------------------------------------------- *
 * HUECOS DE IMAGEN QUE NO VIENEN DE UN SLOT
 *
 * `slotsSinCablear` mira una dirección: slots registrados que nadie lee. Este
 * mira la CONTRARIA, que es la que dejó el inventario incompleto: un hueco en la
 * interfaz que no sale de ningún slot. Un hueco así no aparece en
 * /admin/imagenes, así que a marketing no se le pide su foto y nadie se entera
 * hasta que alguien mira la página y pregunta por qué sigue vacía.
 *
 * LA REGLA: si en un sitio va a haber una foto y hoy no la hay, se ve un
 * marcador que lo dice y ese hueco tiene slot. Las únicas excepciones son los
 * planos de color donde el color ES el contenido (`tintColor`, `swatchColor`).
 *
 * Son dos reglas y no una a propósito. La primera no habría cazado el caso que
 * originó todo esto: `CategoryCard` no usaba `ImagePlaceholder`, se copiaba la
 * trama a mano en un `<span>`. Un marcador copiado no es un uso del componente,
 * así que hay que buscarlo por separado.
 * ------------------------------------------------------------------------- */

/** Componentes que dibujan un hueco. Todo uso suyo tiene que venir de un slot. */
const COMPONENTES_DE_HUECO = ["ImagePlaceholder", "PhotoCurtain"];

/** Las funciones que resuelven un slot a una foto publicada. */
const RESUELVE_SLOT = /\b(?:foto|fotoDeTela|vistasDeTela)\s*\(/;

/**
 * Marca que declara una excepción EN EL SITIO donde vive, no en este archivo.
 * Se escribe como comentario dentro de la etiqueta, seguida del porqué:
 *
 *   <ImagePlaceholder
 *     /* hueco-registrado: ... *\/
 *     src={undefined}
 *
 * Va ahí y no en una lista de este script para que quien lea el componente
 * dentro de tres meses sepa si es excepción legítima o descuido sin tener que
 * venir hasta aquí a averiguarlo.
 */
const MARCA_EXCEPCION = "hueco-registrado:";

/**
 * Texto de una etiqueta JSX desde el `<` hasta su `>`, saltando llaves, cadenas
 * y comentarios: dentro de un atributo hay `=>`, y dentro de un comentario hay
 * prosa, y cualquiera de los dos cortaría la etiqueta antes de tiempo.
 */
function bloqueDeEtiqueta(codigo: string, inicio: number): string {
  let i = inicio;
  let llaves = 0;
  let comilla = "";
  while (i < codigo.length) {
    const c = codigo[i];
    if (comilla) {
      if (c === "\\") i++;
      else if (c === comilla) comilla = "";
    } else if (codigo.startsWith("/*", i)) {
      const fin = codigo.indexOf("*/", i + 2);
      i = fin === -1 ? codigo.length : fin + 1;
    } else if (codigo.startsWith("//", i)) {
      const fin = codigo.indexOf("\n", i);
      i = fin === -1 ? codigo.length : fin;
    } else if (c === '"' || c === "'" || c === "`") comilla = c;
    else if (c === "{") llaves++;
    else if (c === "}") llaves--;
    else if (c === ">" && llaves === 0) break;
    i++;
  }
  return codigo.slice(inicio, i);
}

/** Valor de un atributo de la etiqueta: `src="x"` o `src={expresión}`. */
function valorDeAtributo(bloque: string, nombre: string): string | null {
  const m = new RegExp(`(?:^|[^\\w$])${nombre}\\s*=\\s*`).exec(bloque);
  if (!m) return null;
  let i = m.index + m[0].length;
  const abre = bloque[i];
  if (abre === '"' || abre === "'") {
    const fin = bloque.indexOf(abre, i + 1);
    return bloque.slice(i + 1, fin === -1 ? bloque.length : fin);
  }
  if (abre !== "{") return null;
  const inicio = i;
  let llaves = 0;
  for (; i < bloque.length; i++) {
    if (bloque[i] === "{") llaves++;
    else if (bloque[i] === "}" && --llaves === 0) break;
  }
  return bloque.slice(inicio + 1, i);
}

/**
 * Si la expresión que alimenta el `src` sale de un slot. No basta con mirar la
 * llamada literal: media docena de sitios la guardan antes (`const f =
 * foto(...)`, `const imagen = real ?? previa`) y otros la reciben ya resuelta
 * como prop. Así que se sigue el rastro del identificador por el archivo.
 *
 * Recibirla tipada como `Foto`/`VistaTela` cuenta: esos tipos solo los produce
 * `imagenes.ts` a partir de un slot, y quien la pasa es un componente que este
 * mismo chequeo revisa por su cuenta.
 */
function vieneDeUnSlot(expr: string, codigo: string, vistos = new Set<string>()): boolean {
  if (RESUELVE_SLOT.test(expr)) return true;
  for (const id of expr.match(/[A-Za-z_$][\w$]*/g) ?? []) {
    if (vistos.has(id)) continue;
    vistos.add(id);
    if (new RegExp(`\\b${id}\\s*\\??:\\s*(?:Foto|VistaTela)\\b`).test(codigo)) return true;
    const enlace = new RegExp(`\\b(?:const|let)\\s+${id}\\s*=\\s*([^;]*)`).exec(codigo);
    if (enlace && vieneDeUnSlot(enlace[1], codigo, vistos)) return true;
  }
  return false;
}

interface Hueco {
  ruta: string;
  linea: number;
  que: string;
  motivo: string;
}

function linea(codigo: string, indice: number): number {
  let n = 1;
  for (let i = 0; i < indice; i++) if (codigo[i] === "\n") n++;
  return n;
}

/** Regla 1 — usos de `ImagePlaceholder`/`PhotoCurtain` que no salen de un slot. */
function huecosSinSlot(fuentes: Fuente[]): Hueco[] {
  const huecos: Hueco[] = [];
  for (const { ruta, codigo } of fuentes) {
    if (!ruta.endsWith(".tsx")) continue;
    for (const componente of COMPONENTES_DE_HUECO) {
      const re = new RegExp(`<${componente}(?=[\\s/>])`, "g");
      for (let m = re.exec(codigo); m; m = re.exec(codigo)) {
        const bloque = bloqueDeEtiqueta(codigo, m.index);

        // Un spread reenvía las props de quien llama; el hueco de verdad está
        // en el sitio que las pasa, y ahí es donde se comprueba. Es como
        // `PhotoCurtain` monta su `ImagePlaceholder`.
        if (/\{\s*\.\.\./.test(bloque)) continue;
        if (bloque.includes(MARCA_EXCEPCION)) continue;
        // `tintColor`: el plano de color ES el contenido, no un hueco.
        if (/(?:^|[^\w$])tintColor\s*=/.test(bloque)) continue;

        const src = valorDeAtributo(bloque, "src") ?? valorDeAtributo(bloque, "foto");
        const comun = { ruta, linea: linea(codigo, m.index), que: componente };
        if (src === null) {
          huecos.push({ ...comun, motivo: "sin src: no puede llegarle ninguna foto" });
        } else if (!vieneDeUnSlot(src, codigo)) {
          huecos.push({
            ...comun,
            motivo: `src={${src.trim().replace(/\s+/g, " ").slice(0, 48)}} no sale de foto()/fotoDeTela()/vistasDeTela()`,
          });
        }
      }
    }
  }
  return huecos;
}

/**
 * Regla 2 — la trama del marcador copiada fuera de `ImagePlaceholder`.
 *
 * Un recuadro con textura parece una decisión de diseño: ni una persona ni un
 * agente que lea el código concluyen que ahí falta algo. Si el marcador se
 * dibuja a mano, además, se pinta también en producción, porque la guarda de
 * entorno se queda en el componente que no se usó.
 */
const DUENO_DE_LA_TRAMA = "src/components/ui/ImagePlaceholder.tsx";

function marcadoresCopiados(fuentes: Fuente[]): Hueco[] {
  const huecos: Hueco[] = [];
  for (const { ruta, codigo } of fuentes) {
    if (ruta === DUENO_DE_LA_TRAMA) continue;
    const re = /repeating-linear-gradient/g;
    for (let m = re.exec(codigo); m; m = re.exec(codigo)) {
      // La excepción tiene que estar pegada a la trama que justifica, no en
      // cualquier punto anterior del archivo.
      if (codigo.slice(Math.max(0, m.index - 400), m.index).includes(MARCA_EXCEPCION)) continue;
      huecos.push({
        ruta,
        linea: linea(codigo, m.index),
        que: "trama a mano",
        motivo: "marcador de hueco copiado fuera de ImagePlaceholder (se pinta también en producción)",
      });
    }
  }
  return huecos;
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

  const fuentes = archivosFuente();

  const huerfanos = slotsSinCablear(fuentes);
  if (huerfanos.length) {
    console.log(`
SLOTS REGISTRADOS QUE NINGÚN COMPONENTE LEE — ${huerfanos.length}`);
    console.log("  (la foto se procesaría y la página seguiría vacía)");
    for (const id of huerfanos) console.log(`  · ${id}`);
    console.log(
      "\n  Los `<tela>-caida` de esta lista son falsos positivos conocidos:" +
        "\n  se consumen por plantilla desde `vistasDeTela` y la detección busca" +
        "\n  el id literal. Ver la nota junto a CONSUMO_DINAMICO.",
    );
  }

  const huecos = [...huecosSinSlot(fuentes), ...marcadoresCopiados(fuentes)];
  if (huecos.length) {
    console.log(`\nHUECOS DE IMAGEN SIN SLOT — ${huecos.length}`);
    console.log("  (nadie le va a pedir esta foto a marketing: no sale en /admin/imagenes)");
    for (const h of huecos) {
      console.log(`  · ${h.ruta}:${h.linea}  ${h.que}`);
      console.log(`      ${h.motivo}`);
    }
  }

  const { llenos, vacios, sinMedir } = escribirManifiesto(r.medidas);
  console.log(
    `\nmanifiesto actualizado — ${llenos.length} de ${SLOTS.length} slots con imagen, ${vacios.length} vacíos`,
  );
  if (sinMedir.length) {
    console.log(
      `\nfotos en gris publicadas SIN medir — ${sinMedir.join(", ")}` +
        `\n  (el recoloreo las compensa con la luminancia supuesta; regenéralas con  npm run imagenes:telas-pw <id>)`,
    );
  }
  console.log("");

  // Un nombre mal escrito es justo lo que este script existe para cazar: si se
  // ignora, la imagen no aparece y parece un fallo de la web. Los huecos sin
  // slot fallan por el mismo motivo, un paso antes: la foto no llega a pedirse.
  if (r.erratas.length || huerfanos.length || huecos.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(`\nFALLO: ${e.message}\n`);
  process.exit(1);
});
