/**
 * Verificación del catálogo publicado + pedido de fichas al cliente.
 *
 *   npx tsx scripts/verificar-catalogo.ts
 *
 * Comprueba que no se haya colado ninguna tela A PEDIDO y genera, desde el
 * código, la lista de telas de línea sin ficha técnica. Se genera y no se
 * escribe a mano para que no se desincronice del catálogo real.
 */

import { categories, catalogTotals } from "../src/data/taxonomy";
import { estadoFicha, type EstadoFicha } from "../src/data/fichas";
import {
  slugsConFoto,
  MATERIAL_NO_PUBLICABLE,
  type MotivoBloqueo,
} from "../src/data/imagenes";

/**
 * Valores leídos en la ETIQUETA FÍSICA de producción que aparece en las macros
 * de `Texturaa Fotos/`.
 *
 * Vive en `scripts/` y NO en `src/data/` a propósito: es dato sin confirmar y no
 * debe poder llegar a una página por descuido. Le falta la norma ASTM y el rango
 * LCI/LCD, así que publicarlo sería una ficha a medias con norma al lado — el
 * mismo problema que un gramaje inventado.
 *
 * Sirve para una cosa: pedirle al cliente que CONFIRME en vez de transcribir.
 */
const DATOS_ETIQUETA: Record<string, string> = {
  "interlock-40": "ancho 1,20 · rendimiento 2,40   (etiqueta INTERLOCK SPUN/40 BLANCO FROZEN)",
};

/**
 * Telas cuya ficha está bloqueada por especificación duplicada, y para las que
 * la etiqueta física aporta evidencia independiente de que sí son distintas.
 */
const ETIQUETA_DESEMPATA: Record<string, string> = {
  "lacoast-kratos-22":
    "la etiqueta dice LACOAST KRATOS MARENGO, hilo JASPIADO, 1,20 / 1,82 — " +
    "distinta de LACOAST a secas, que va en otro lote y otra etiqueta",
  "pique-ares-24":
    "la etiqueta dice PIQUE ARES, 1,20 / 2,10 — comparar con AUSTRIA PREMIUM, " +
    "que la ficha da como idéntica",
};

/** Las 29 telas A PEDIDO de `08_catalogo_definitivo.md`. Ninguna se publica. */
const A_PEDIDO = [
  "Boston Plus Brillante", "Dobleface", "Fiorentina", "Atlanta",
  "Ribb 150 Mic Tampa", "Cuellos 150 Mic", "Puños 150 Mic",
  "Juventus 0,90 Tex", "River 1.12", "Ajax",
  "Ribb Delta Plus 30 Spn", "Ribb Betta 30 Spn", "Simone 20 Spn",
  "Suiza 20 Pei", "Melina 24 Pei", "Pamela 18 Pei", "Erika Premium 18 Pei",
  "Aruba 20 Pei", "Irma 20 Pei", "Ribb Erika 20 Pei", "Ivette 22 Pei",
  "Fleece Enzo 22 Pei", "Ribb 2x2 20 Pei", "Olimpia",
  "Ribb Olimpia Plus 20 Pei 50/50",
  "Titanium Mic Ramada", "Dortmund Mic Ramada", "Boston Mic Ramada",
  "Sevilla Mic Ramada",
];

/**
 * Comparación por nombre COMPLETO, solo normalizando mayúsculas y espacios.
 *
 * Recortar sufijos sería un error: el catálogo distingue productos que solo se
 * diferencian en el sufijo, y en ambos sentidos. `Juventus` (microfibra, línea)
 * no es `Juventus 0,90 Tex` (texturizado, pedido); `Titanium` no es `Titanium
 * Mic Ramada`; `Dobleface Plus` (línea) no es `Dobleface` (pedido). Normalizar
 * de más los funde y da falsos positivos.
 */
const norm = (n: string) => n.replace(/\s+/g, " ").trim().toLowerCase();

/** Distancia de edición, acotada a 1: solo nos interesa "difieren en una letra". */
function difiereEnUnaLetra(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let fallos = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++fallos > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return fallos + (a.length - i) + (b.length - j) <= 1;
}

/**
 * Riesgo real de confusión: un nombre contenido en el otro (Dobleface /
 * Dobleface Plus) o a una sola letra (Melisa / Melina). Compartir el prefijo
 * "Ribb" no es riesgo, es una familia entera.
 */
function seConfunden(a: string, b: string): boolean {
  const x = norm(a);
  const y = norm(b);
  if (x === y) return false;
  return x.startsWith(`${y} `) || y.startsWith(`${x} `) || difiereEnUnaLetra(x, y);
}

const publicadas = categories.flatMap((c) =>
  c.subcategories.map((s) => ({ categoria: c.name, ...s })),
);

console.log(`\ntotales: ${catalogTotals.telas} telas · ${catalogTotals.familias} familias`);

const conteo: Record<EstadoFicha, number> = {
  publicada: 0,
  preliminar: 0,
  "sin-ficha": 0,
};
for (const s of publicadas) conteo[estadoFicha(s.slug)]++;
console.log("estados:", conteo, "\n");

const nombresPublicados = new Set(publicadas.map((s) => norm(s.name)));
const filtradas = A_PEDIDO.filter((n) => nombresPublicados.has(norm(n)));
console.log(
  filtradas.length
    ? `!! FALLO — telas A PEDIDO publicadas: ${filtradas.join(", ")}`
    : "OK — ninguna de las 29 telas A PEDIDO está publicada",
);

// Aviso, no fallo: pares que comparten raíz y conviene mirar a ojo.
const parecidos = A_PEDIDO.flatMap((pedido) =>
  publicadas
    .filter((p) => seConfunden(p.name, pedido))
    .map((p) => `A PEDIDO "${pedido}"  ~  publicada "${p.name}" (${p.categoria})`),
);
if (parecidos.length) {
  console.log(
    `\n   aviso — ${parecidos.length} pares comparten raíz; son productos distintos,\n` +
      `   pero un descuido al editar taxonomy los confundiría:`,
  );
  for (const p of parecidos) console.log(`     ${p}`);
}

// Melisa es de línea; Melina es a pedido. Una letra los separa.
console.log(
  `   melisa-24 publicada: ${publicadas.some((s) => s.slug === "melisa-24")} · ` +
    `melina publicada: ${publicadas.some((s) =>
      s.name.toLowerCase().includes("melina"),
    )}`,
);

const linea = (c: string) => "\n" + c.repeat(60);

const sinFicha = categories.flatMap((c) =>
  c.subcategories
    .filter((s) => estadoFicha(s.slug) === "sin-ficha")
    .map((s) => ({ categoria: c.name, ...s })),
);

console.log(linea("="));
console.log("PEDIDO AL CLIENTE (a) — solo CONFIRMAR, ya tenemos los números");
console.log("=".repeat(60));
console.log(
  "\nDe estas telas leímos la especificación en la etiqueta física de\n" +
    "producción. No la publicamos porque falta la norma ASTM y el rango\n" +
    "LCI/LCD. Basta con que confirmen el valor y completen esos dos campos;\n" +
    "no hace falta transcribir la ficha entera.",
);
const conEtiqueta = sinFicha.filter((s) => DATOS_ETIQUETA[s.slug]);
for (const s of conEtiqueta) {
  console.log(`\n   · ${s.name}  (${s.categoria})`);
  console.log(`     leído: ${DATOS_ETIQUETA[s.slug]}`);
}
if (!conEtiqueta.length) console.log("\n   (ninguna)");

console.log(linea("="));
console.log("PEDIDO AL CLIENTE (b) — hace falta la ficha completa");
console.log("=".repeat(60));
console.log("\nNo tenemos ningún dato de estas: ni ficha PNG ni etiqueta legible.");
for (const c of categories) {
  const faltan = sinFicha.filter(
    (s) => s.categoria === c.name && !DATOS_ETIQUETA[s.slug],
  );
  if (!faltan.length) continue;
  console.log(
    `\n${c.name.toUpperCase()} — faltan ${faltan.length} de ${c.subcategories.length}`,
  );
  for (const s of faltan) console.log(`   · ${s.name}`);
}

console.log(linea("="));
console.log("PEDIDO DE FOTOS — telas de línea sin foto identificable");
console.log("=".repeat(60));
for (const c of categories) {
  const sinFoto = c.subcategories.filter((s) => !slugsConFoto.has(s.slug));
  if (!sinFoto.length) continue;
  console.log(
    `\n${c.name.toUpperCase()} — faltan ${sinFoto.length} de ${c.subcategories.length}`,
  );
  for (const s of sinFoto) console.log(`   · ${s.name}`);
}

console.log(linea("="));
console.log("REQUIERE ACLARACIÓN — no es 'falta foto', es 'no sabemos cuál es'");
console.log("=".repeat(60));
console.log(
  "\nEste material existe y es bueno. No se publica por una razón concreta;\n" +
    "casi todas se resuelven con una respuesta corta del cliente.",
);
for (const m of MATERIAL_NO_PUBLICABLE.filter((x) => x.motivo === "ambigua")) {
  console.log(`\n   · ${m.origen}`);
  console.log(`     ${m.nota}`);
}

// Interlocutor distinto: esto no lo resuelve quien conoce las telas, sino quien
// encargó las imágenes. Va aparte para poder mandarlo tal cual.
const PARA_MARKETING: MotivoBloqueo[] = [
  "consentimiento",
  "pendiente-confirmar-licencia",
];
console.log(linea("="));
console.log("PARA MARKETING — confirmar procedencia y licencia");
console.log("=".repeat(60));
console.log(
  "\nDe esto NO tenemos evidencia de que sea generado por IA, así que no se\n" +
    "puede dar por resuelto con la licencia de stock. Una respuesta por punto\n" +
    "y se desbloquea.",
);
for (const m of MATERIAL_NO_PUBLICABLE.filter((x) =>
  PARA_MARKETING.includes(x.motivo),
)) {
  console.log(`\n   · ${m.origen}   [${m.motivo}]`);
  console.log(`     ${m.nota}`);
}

console.log(linea("-"));
console.log("GENERADO POR IA — licencia resuelta, uso restringido");
console.log("-".repeat(60));
console.log(
  "\nSin persona real: no hay consentimiento que pedir. Pero una imagen\n" +
    "generada no puede afirmar nada nuestro, así que sigue sin poder ir en un\n" +
    "slot que diga 'nuestra planta', 'nuestros clientes' o 'nuestro asesor'.",
);
for (const m of MATERIAL_NO_PUBLICABLE.filter(
  (x) => x.motivo === "generada-ia-licenciada",
)) {
  console.log(`\n   · ${m.origen}   [uso: ${m.uso}]`);
  console.log(`     ${m.nota}`);
}

console.log(linea("-"));
console.log("FICHA PRELIMINAR — se publican con datos sin confirmar");
console.log("-".repeat(60));
for (const c of categories) {
  const prel = c.subcategories.filter(
    (s) => estadoFicha(s.slug) === "preliminar",
  );
  if (!prel.length) continue;
  console.log(`\n${c.name.toUpperCase()}`);
  for (const s of prel) {
    console.log(`   · ${s.name}`);
    // La etiqueta física es evidencia independiente de la ficha: si dos telas
    // que la ficha da por idénticas llevan etiquetas distintas, el duplicado
    // es de transcripción y no del producto.
    if (ETIQUETA_DESEMPATA[s.slug]) {
      console.log(`     pista: ${ETIQUETA_DESEMPATA[s.slug]}`);
    }
  }
}
console.log();
