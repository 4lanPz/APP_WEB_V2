/**
 * Mide las fotos YA PUBLICADAS contra los requisitos de recoloreo.
 *
 *   npm run imagenes:medir            todas las clasificadas como definitivas
 *   npm run imagenes:medir -- athletic titanium      solo esas
 *
 * PARA QUÉ. Una foto de tela solo sirve para la simulación de color si cumple
 * lo mismo que el documento de fotografía le exige a marketing: tela sin teñir
 * (croma bajo el techo), sin quemados, y con luminancia que aguante la
 * normalización. Que una foto venga de la carpeta del cliente no dice nada de
 * eso: en `Telas_PW/` hay tela negra, hay tela azul y hay macros que se
 * dispararon para otra cosa. Clasificar por procedencia da por buena una foto
 * que el propio pipeline rechazaría.
 *
 * Este script no clasifica: MIDE. La clasificación vive en `PROCEDENCIA_FOTO`
 * (`slots-imagen.ts`), escrita a mano y con su evidencia al lado, y lo que sale
 * de aquí es justamente esa evidencia. Se separan a propósito: una tabla de
 * estados que se recalcula sola en cada ejecución cambia sin que nadie lo
 * decida, y el día que sharp mueva un decimal reclasifica fotos.
 *
 * QUÉ SE MIDE, Y SOBRE QUÉ PÍXELES
 * Sobre el encuadre que se publica —el recorte y el ancho de `recetas.ts`—, no
 * sobre el original entero: medir una cosa y publicar otra da un número que
 * describe una imagen que nadie va a ver. Y sobre el ORIGINAL A COLOR, no sobre
 * el WebP publicado: las fotos en gris ya salen desaturadas, así que ahí el
 * croma daría 0 siempre y no diría nada. Es la misma medida que hace
 * `desaturarYNormalizar` al generar.
 *
 *  · croma        cuánto tinte trae, 0–255. Techo `CROMA_MAXIMO`.
 *  · máximo       nivel de gris más alto, 0–255. A 255 hay píxel quemado.
 *  · quemados     % de píxeles en 255. El preprocesado normaliza el máximo a
 *                 250, y donde el original ya está a 255 no hay información que
 *                 levantar: eso no se recupera.
 *  · k            luminancia media, 0–1, tal cual.
 *  · k norm.      la que tendría tras normalizar (factor 250/máximo). Es la que
 *                 va a compensar la capa de color, así que es la que importa.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import {
  SLOTS_ALTA_TELA,
  SLOTS_GALERIA_TELA,
  SLOTS_TELA,
  SLOTS_VISTAS_EXTRA,
  PROCEDENCIA_FOTO,
} from "../src/data/slots-imagen";
import { CROMA_MAXIMO } from "./gris";
import { ORIGENES_DIR, RECETAS, type Receta } from "./recetas";

/**
 * Luminancia normalizada por debajo de la cual la foto se considera demasiado
 * oscura para el recoloreo.
 *
 * SUELO BAJO A PROPÓSITO. El filtro de verdad son los otros tres —croma,
 * quemados y estirón—, que miden defectos de la TOMA y predicen si la foto
 * sirve. Este mide el resultado, que es consecuencia de aquellos, y cualquier
 * corte fino aquí sería arbitrario: la peor que sirve queda en 0,580 (Titanium
 * 1) y poner el suelo pegado a ella descartaría por dos milésimas fotos
 * equivalentes a una aceptada.
 *
 * En 0,50 solo caza lo que ya no es discutible: una tela que ni estirada llega
 * a la mitad del recorrido sale gris oscuro, y el chip de color multiplicado
 * sobre ella no da el tono que pide.
 *
 * Es un corte de aviso, como `CROMA_MAXIMO`: quien decide si una foto vale es
 * quien la mira. Lo que hace el script es que nadie tenga que mirarlas todas.
 */
const K_MINIMO_NORMALIZADO = 0.5;

/**
 * Cuánto se tolera ESTIRAR al normalizar, o sea el factor `250 / máximo`.
 *
 * Es un corte distinto del anterior y caza un fallo distinto, aunque los dos
 * hablen de luminancia. `k normalizada` dice cómo queda la foto; el factor dice
 * a qué precio. Estirar no crea información: una toma cuyo máximo es 113 solo
 * usó 113 niveles de los 256, y llevarla a 250 los reparte con hueco entre
 * medias — banding en un macro a 1280 px de ancho, que es donde más se ve.
 *
 * El techo sale de la peor que sirve: Titanium (1), máximo 202, factor 1,24.
 * Se toma 1,35 para dejar algo de margen sobre ella. Por encima, la toma está
 * subexpuesta y eso se arregla volviendo a disparar, no en el procesado.
 *
 * SIN ESTE CORTE, UNA TELA NEGRA PASA. Mezi entra con croma 2,1 —el negro es
 * neutro, así que no hay dominante que medir— y k normalizada 0,692, que son
 * dos aprobados; su factor es 2,21. Es el caso que enseña que el croma solo
 * mide el TINTE, no si la tela está teñida.
 */
const FACTOR_MAXIMO = 1.35;

/** Los slots cuya foto alimenta la ficha de una tela. */
const IDS_DE_TELA = new Set(
  [
    ...SLOTS_TELA,
    ...SLOTS_GALERIA_TELA,
    ...SLOTS_VISTAS_EXTRA,
    ...SLOTS_ALTA_TELA,
  ].map((s) => s.id),
);

/**
 * Cuántos píxeles en 255 se toleran, en tanto por ciento.
 *
 * No es cero, y el motivo es medido: Athletic —la que el cliente confirmó y la
 * que sirve de referencia de croma— tiene 62 píxeles en 255 sobre 2,6 millones,
 * un 0,0024%. Un puñado de píxeles en el brillo especular de la fibra no es una
 * alta luz quemada; es el reflejo que la lupa existe para enseñar. Lo que hay
 * que cazar es la zona quemada, que se cuenta en decenas de miles.
 *
 * 0,05% es dos órdenes de magnitud por encima de Athletic y dos por debajo de
 * cualquier cielo reventado. Como los otros dos cortes: avisa, no manda.
 */
const QUEMADOS_MAXIMO = 0.05;

interface Medida {
  id: string;
  origen: string;
  croma: number;
  maximo: number;
  /** Píxeles exactamente en 255, y su porcentaje sobre el total. */
  quemados: number;
  quemadosPct: number;
  pixeles: number;
  k: number;
  kNormalizado: number;
  /** El `250 / máximo` que aplicaría el preprocesado. */
  factor: number;
  /**
   * El ORIGINAL ya viene en blanco y negro: sus tres canales son idénticos
   * píxel a píxel, aunque el archivo se guarde en sRGB.
   *
   * CAMBIA CÓMO SE LEE EL CROMA, Y POR ESO SE MIDE. En un original así el croma
   * da 0,0 siempre —no queda color que medir— y eso NO dice que la tela fuera
   * blanca: dice que ya no se puede saber. El requisito «tela blanca o crudo»
   * no se puede verificar contra el archivo, ni ahora ni nunca, porque el dato
   * que lo demostraría se perdió al desaturar. Una foto en B/N de una tela azul
   * y una de una tela cruda son indistinguibles aquí.
   */
  mono: boolean;
}

/**
 * Mide el encuadre publicado de una receta.
 *
 * Reproduce el mismo pipeline que `generar()` hasta justo antes de codificar
 * —recorte, rotación EXIF, redimensión— porque son esos píxeles los que hay que
 * juzgar. El recorte NO se verifica aquí como allí: si estuviera mal, el que
 * falla es el que escribe.
 */
async function medir(id: string, receta: Receta): Promise<Medida> {
  const entrada = join(ORIGENES_DIR, receta.origen);
  if (!existsSync(entrada)) {
    throw new Error(`[${id}] no existe el original: ${receta.origen}`);
  }

  let img = sharp(entrada);
  if (receta.recorte) img = img.extract(receta.recorte);
  const encuadrada = img
    .rotate()
    .resize({ width: receta.ancho, withoutEnlargement: true });

  const { data, info } = await encuadrada.raw().toBuffer({ resolveWithObject: true });
  const crudo = { raw: { width: info.width, height: info.height, channels: info.channels } };

  const enColor = (await sharp(data, crudo).stats()).channels.map((c) => c.mean);
  const rgb = enColor.slice(0, 3);
  const croma = Math.max(...rgb) - Math.min(...rgb);

  /*
    ¿El original ya viene en blanco y negro? Se comprueba píxel a píxel, no por
    las medias: tres medias iguales las da también una foto a color equilibrada.
    Importa porque decide cómo hay que leer el croma — ver `mono` en `Medida`.
  */
  let mono = true;
  for (let i = 0; i < data.length && mono; i += info.channels) {
    if (data[i] !== data[i + 1] || data[i + 1] !== data[i + 2]) mono = false;
  }

  const gris = await sharp(data, crudo).greyscale().raw().toBuffer();

  // El histograma no lo da `stats()`, y los quemados son un recuento: cuántos
  // píxeles están en el techo, no cuál es el techo. Una sola pasada.
  let suma = 0;
  let maximo = 0;
  let enTecho = 0;
  for (const v of gris) {
    suma += v;
    if (v > maximo) maximo = v;
    if (v === 255) enTecho++;
  }
  const n = gris.length;
  const k = suma / n / 255;

  return {
    id,
    origen: receta.origen,
    croma,
    maximo,
    quemados: enTecho,
    quemadosPct: (enTecho / n) * 100,
    pixeles: n,
    k,
    // Mismo factor que aplica el preprocesado. No recorta —el nuevo máximo cae
    // exactamente en 250—, así que la media escala igual que los píxeles.
    kNormalizado: maximo > 0 ? Math.min(1, (k * 250) / maximo) : k,
    factor: maximo > 0 ? 250 / maximo : 1,
    mono,
  };
}

/** Por qué esta foto no pasa el corte de recoloreo. Vacío si lo pasa. */
function reparos(m: Medida): string[] {
  const r: string[] = [];
  if (m.mono) {
    // No es un aviso menor: es que la comprobación de «tela sin teñir» no se
    // puede hacer. Una foto que no se puede verificar no se puede dar por
    // buena, aunque el resto de las medidas salga bien.
    r.push(
      "el original ya viene en blanco y negro (los tres canales idénticos), " +
        "así que el croma 0,0 no dice que la tela fuera cruda: dice que ya no " +
        "se puede saber",
    );
  } else if (m.croma > CROMA_MAXIMO) {
    r.push(`croma ${m.croma.toFixed(1)} sobre el techo de ${CROMA_MAXIMO}`);
  }
  if (m.quemadosPct > QUEMADOS_MAXIMO) {
    r.push(
      `${m.quemados.toLocaleString("es")} píxeles quemados ` +
        `(${m.quemadosPct.toFixed(3)}%, techo ${QUEMADOS_MAXIMO}%)`,
    );
  }
  if (m.factor > FACTOR_MAXIMO) {
    r.push(
      `subexpuesta: máximo ${m.maximo}, habría que estirar ×${m.factor.toFixed(2)} ` +
        `(techo ×${FACTOR_MAXIMO})`,
    );
  }
  if (m.kNormalizado < K_MINIMO_NORMALIZADO) {
    r.push(
      `k normalizada ${m.kNormalizado.toFixed(3)}, por debajo de ${K_MINIMO_NORMALIZADO}`,
    );
  }
  return r;
}

function fila(m: Medida, esTela: boolean): string {
  const fallos = esTela ? reparos(m) : [];
  const marca = !esTela ? "  n/a " : fallos.length ? "  NO  " : "  sí  ";
  return (
    `${m.id.padEnd(26)}` +
    `${(m.mono ? "B/N" : m.croma.toFixed(1)).padStart(6)}` +
    `${String(m.maximo).padStart(6)}` +
    `${String(m.quemados).padStart(9)}` +
    `${m.quemadosPct.toFixed(3).padStart(9)}` +
    `${("×" + m.factor.toFixed(2)).padStart(8)}` +
    `${m.k.toFixed(3).padStart(8)}` +
    `${m.kNormalizado.toFixed(3).padStart(9)}` +
    `${marca}`
  );
}

async function main() {
  const pedidos = process.argv.slice(2).filter((a) => !a.startsWith("-"));

  /*
    Sin argumentos se mide TODO lo que se publica desde `Telas_PW/`, no solo lo
    que hoy figura como definitivo. Filtrar por el estado actual haría que el
    script solo pudiera confirmar la clasificación vigente y nunca contradecirla:
    una tela degradada dejaría de medirse, y el día que llegue su original bueno
    nadie se enteraría de que ya puede subir a definitiva.
  */
  const ids = pedidos.length ? pedidos : Object.keys(RECETAS);

  const sinReceta = ids.filter((id) => !(id in RECETAS));
  if (sinReceta.length) {
    throw new Error(
      `no hay receta en recetas.ts para: ${sinReceta.join(", ")}. ` +
        "Sin original no se puede medir: el WebP publicado ya está procesado.",
    );
  }

  const medidas: Medida[] = [];
  for (const id of ids) medidas.push(await medir(id, RECETAS[id]));

  const telas = medidas.filter((m) => IDS_DE_TELA.has(m.id));
  const otras = medidas.filter((m) => !IDS_DE_TELA.has(m.id));

  const cabecera =
    `${"slot".padEnd(26)}${"croma".padStart(6)}${"máx".padStart(6)}` +
    `${"quemados".padStart(9)}${"%".padStart(9)}${"estirar".padStart(8)}` +
    `${"k".padStart(8)}${"k norm.".padStart(9)}  vale `;

  console.log(`\nSLOTS DE TELA — ${telas.length}`);
  console.log(
    `  Corte: croma ≤ ${CROMA_MAXIMO} · quemados ≤ ${QUEMADOS_MAXIMO}% · ` +
      `estirar ≤ ×${FACTOR_MAXIMO} · k normalizada ≥ ${K_MINIMO_NORMALIZADO}`,
  );
  console.log(`\n${cabecera}\n${"-".repeat(cabecera.length)}`);
  for (const m of telas) console.log(fila(m, true));

  const fallan = telas.filter((m) => reparos(m).length);
  if (fallan.length) {
    console.log(`\nNO CUMPLEN EL RECOLOREO — ${fallan.length} de ${telas.length}`);
    for (const m of fallan) {
      console.log(`  · ${m.id}: ${reparos(m).join("; ")}   <- ${m.origen}`);
    }
  }

  /*
    La clasificación de `PROCEDENCIA_FOTO` es un volcado de esto, escrito a mano
    para poder llevar su evidencia al lado. Aquí se comprueba que sigue
    cuadrando: sustituir una foto y olvidarse de reclasificarla es el fallo
    natural de una copia, y sin esta comprobación se descubriría el día que
    alguien mire el documento y no entienda por qué se sigue pidiendo una tela
    que ya llegó.
  */
  const esperado = (m: Medida) =>
    !reparos(m).length ? "definitiva" : m.mono && reparos(m).length === 1 ? "no-verificable" : "no-apta";
  const descuadres = telas
    .map((m) => ({ m, hay: PROCEDENCIA_FOTO.get(m.id)?.procedencia, toca: esperado(m) }))
    .filter(({ hay, toca }) => hay !== toca);

  if (descuadres.length) {
    console.log(`\n\nLA CLASIFICACIÓN NO CUADRA CON LO MEDIDO — ${descuadres.length}`);
    console.log("  (arréglalo en PROCEDENCIA_FOTO, en slots-imagen.ts)");
    for (const { m, hay, toca } of descuadres) {
      console.log(`  · ${m.id.padEnd(26)} figura como ${hay ?? "sin clasificar"}, la medida dice ${toca}`);
    }
  }

  console.log(
    `\n\nSLOTS QUE NO SON DE TELA — ${otras.length}` +
      `\n  (sin requisito de recoloreo: no alimentan ninguna simulación de color)`,
  );
  console.log(`\n${cabecera}\n${"-".repeat(cabecera.length)}`);
  for (const m of otras) console.log(fila(m, false));
  console.log("");

  if (descuadres.length) process.exit(1);
}

main().catch((e) => {
  console.error(`\nFALLO: ${e.message}\n`);
  process.exit(1);
});
