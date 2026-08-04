/**
 * CLASES DE TAILWIND CON VALOR DECIMAL QUE NO LLEGAN AL CSS COMPILADO.
 *
 *   npm run tailwind:numericas
 *
 * EL FALLO QUE ESTO CAZA
 * Tailwind v4 solo genera las utilidades de la escala de espaciado cuyo valor
 * suelto es múltiplo de 0,25. El resto lo descarta EN SILENCIO: sin error de
 * build, sin aviso de lint, sin nada. La clase se escribe, se ve en el JSX, y
 * simplemente no existe en el CSS.
 *
 * Pasó con `translate-y-1.625` en el icono del menú (ver `Navbar.tsx`): las tres
 * rayas se quedaron en el mismo `top` y el botón se veía como UNA sola raya, en
 * escritorio y en móvil. La X sí funcionaba porque `translate-y-0` y `rotate-45`
 * sí son válidas, así que el fallo solo se notaba en el estado cerrado.
 *
 * POR QUÉ NO HAY UNA LISTA DE PREFIJOS ESCRITA A MANO
 * La primera idea es mantener aquí la lista de utilidades que usan la escala de
 * espaciado y comprobar el módulo de 0,25 con aritmética. Es exactamente lo que
 * no se ha hecho: los pasos válidos no son los mismos para todas las familias
 * (`opacity-`, `z-`, `duration-`, `leading-` tienen cada una su regla), la lista
 * cambia entre versiones de Tailwind, y una lista desactualizada da un verde
 * falso — que es el mismo silencio que esto viene a romper.
 *
 * En vez de replicar la regla, se le pregunta al COMPILADOR REAL: se corre
 * `@tailwindcss/postcss` sobre el `globals.css` del proyecto (Tailwind v4
 * descubre el contenido solo, así que el CSS que sale es el mismo que genera
 * `next build`) y se comprueba si el selector de cada candidata está dentro.
 *
 * CÓMO SE EVITAN LOS FALSOS POSITIVOS
 * El barrido de texto no puede saber si `algo-1.5` es una clase o parte de una
 * cadena cualquiera. El filtro es que la FAMILIA exista: si el CSS compilado
 * tiene otras utilidades con ese mismo prefijo (`.pb-10`, `.pb-3`…) pero no la
 * candidata, entonces la candidata es una clase de verdad que se cayó. Si el
 * prefijo no aparece por ninguna parte, es texto que se parecía y se descarta.
 */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";

const RAIZ = process.cwd();
const CSS_ENTRADA = path.join(RAIZ, "src/app/globals.css");

/**
 * `FUENTES=ruta node scripts/verificar-clases-numericas.mjs` apunta el barrido a
 * otro directorio. Existe para poder COMPROBAR QUE ESTO CAZA ALGO: un escáner
 * que solo ha dicho "todo bien" es indistinguible de uno roto, y este ya salió
 * en verde una vez por un fallo suyo (el guard de `import.meta.url`, que en
 * Windows no coincidía nunca y hacía que no se ejecutara nada).
 *
 * Se comprueba escribiendo `translate-y-1.625` en un fichero de usar y tirar
 * fuera del repo y apuntando aquí: tiene que salir con código 1 y proponer
 * `translate-y-1.5`. El CSS compilado sigue saliendo del proyecto real, así que
 * la comprobación de familia funciona igual.
 */
const FUENTES = process.env.FUENTES
  ? path.resolve(process.env.FUENTES)
  : path.join(RAIZ, "src");

/**
 * Candidata = utilidad con valor DECIMAL suelto (sin corchetes). Solo esa forma:
 * un entero siempre se genera, y un arbitrario `[13px]` es otro problema (lo
 * mira `auditoria-consistencia.mjs`) porque ese sí llega al CSS.
 *
 * Admite variantes por delante (`sm:`, `hover:`, `tablet:`, `group-hover:`) y el
 * guion de negativo (`-translate-y-1.5`), que son las dos formas en las que la
 * clase aparece escrita de verdad en el JSX.
 */
const CANDIDATA = /(?<![\w-])((?:[a-z][\w-]*:)*)(-?[a-z][a-z0-9]*(?:-[a-z0-9]+)*-\d+\.\d+)(?![\w.-])/g;

/** Cómo escapa Tailwind un nombre de clase al escribirlo como selector. */
function selectorDe(clase) {
  return `.${clase.replace(/[.:/[\]()%#!,]/g, (c) => `\\${c}`)}`;
}

/** `sm:hover:-translate-y-1.625` → `-translate-y-` (la familia, sin el valor). */
function familiaDe(utilidad) {
  return utilidad.slice(0, utilidad.lastIndexOf("-") + 1);
}

/**
 * Sustituye por espacios todo lo que sea comentario, conservando el número de
 * líneas y las columnas.
 *
 * ESTO NO ES OPCIONAL, ES EL PRIMER FALLO QUE TUVO EL ESCÁNER. Sin limpiar
 * comentarios, las dos únicas cosas que encontraba eran las menciones a
 * `translate-y-1.625` y `pb-1.625` dentro del comentario de `Navbar.tsx` que
 * documenta ESTE MISMO bug —el que ya está arreglado—. Un escáner que denuncia
 * la nota de que algo se arregló, y encima señalando la línea del comentario,
 * es peor que no tenerlo: manda a arreglar código correcto.
 *
 * Se recorre carácter a carácter en vez de con una expresión regular porque hay
 * que distinguir un `//` que abre comentario de uno dentro de una cadena
 * (`"https://…"`, que sale en `rel="noopener"` y en enlaces del footer). Para
 * eso hace falta saber si se está dentro de comillas, y eso una regular no lo
 * sabe.
 */
function sinComentarios(codigo) {
  let salida = "";
  let i = 0;
  let cadena = null; // comilla de apertura, si estamos dentro de una

  while (i < codigo.length) {
    const c = codigo[i];
    const siguiente = codigo[i + 1];

    if (cadena) {
      if (c === "\\") {
        salida += codigo.slice(i, i + 2);
        i += 2;
        continue;
      }
      if (c === cadena) cadena = null;
      salida += c;
      i++;
      continue;
    }

    if (c === '"' || c === "'" || c === "`") {
      cadena = c;
      salida += c;
      i++;
      continue;
    }

    if (c === "/" && siguiente === "/") {
      while (i < codigo.length && codigo[i] !== "\n") {
        salida += " ";
        i++;
      }
      continue;
    }

    if (c === "/" && siguiente === "*") {
      const fin = codigo.indexOf("*/", i + 2);
      const hasta = fin === -1 ? codigo.length : fin + 2;
      // Los saltos de línea se conservan para no desplazar la numeración.
      salida += codigo.slice(i, hasta).replace(/[^\n]/g, " ");
      i = hasta;
      continue;
    }

    salida += c;
    i++;
  }

  return salida;
}

function* ficherosFuente(dir) {
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const completo = path.join(dir, entrada.name);
    if (entrada.isDirectory()) yield* ficherosFuente(completo);
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entrada.name)) yield completo;
  }
}

/**
 * Compila el CSS real del proyecto, DECLARANDO explícitamente como fuente el
 * mismo directorio que se va a barrer.
 *
 * El `@source` añadido no es decorativo. La comprobación de este script es "la
 * clase no está en el CSS compilado", y una utilidad solo entra en el CSS si
 * Tailwind ve el fichero que la usa. Si el barrido de texto y la detección de
 * contenido de Tailwind miran conjuntos distintos de ficheros, TODA clase de un
 * fichero que Tailwind no vea sale marcada como caída, siendo válida.
 *
 * No es hipotético: se vio al probar el escáner contra un directorio de usar y
 * tirar fuera del repo. `pb-1.5` y `mt-2.25` —múltiplos de 0,25 perfectamente
 * válidos— salían como fallos, solo porque Tailwind no estaba mirando ahí.
 * Declarando la fuente, los dos lados miran lo mismo por construcción y la
 * única razón que le queda a una ausencia es la que se busca: que Tailwind la
 * descartó.
 */
async function compilar() {
  const css = fs.readFileSync(CSS_ENTRADA, "utf8");
  const fuente = FUENTES.replace(/\\/g, "/");
  const resultado = await postcss([tailwindcss()]).process(
    `${css}\n@source "${fuente}";\n`,
    { from: CSS_ENTRADA },
  );
  return resultado.css;
}

/**
 * Valor válido más cercano, para poder proponer un reemplazo en vez de solo
 * decir que está mal. Solo se propone si el CSS compilado confirma que esa
 * variante sí existe — proponer a ciegas es reponer la lista a mano por la
 * puerta de atrás.
 */
function propuesta(variantes, utilidad, cssCompilado) {
  const corte = utilidad.lastIndexOf("-");
  const familia = utilidad.slice(0, corte);
  const valor = Number(utilidad.slice(corte + 1));
  if (!Number.isFinite(valor)) return null;

  const candidatos = [
    Math.round(valor * 4) / 4,
    Math.floor(valor * 4) / 4,
    Math.ceil(valor * 4) / 4,
  ];
  for (const v of candidatos) {
    if (v === valor) continue;
    const claseEntera = `${variantes}${familia}-${v}`;
    if (cssCompilado.includes(`${selectorDe(claseEntera)}`)) return claseEntera;
  }
  return null;
}

export async function escanear() {
  const cssCompilado = await compilar();
  const hallazgos = [];
  const yaVisto = new Set();

  for (const fichero of ficherosFuente(FUENTES)) {
    const lineas = sinComentarios(fs.readFileSync(fichero, "utf8")).split(
      /\r?\n/,
    );
    lineas.forEach((linea, i) => {
      for (const m of linea.matchAll(CANDIDATA)) {
        const [, variantes, utilidad] = m;
        const clase = variantes + utilidad;
        if (cssCompilado.includes(`${selectorDe(clase)}`)) continue;

        // La familia tiene que existir en el CSS, o esto no era una clase.
        const familia = familiaDe(utilidad);
        if (!cssCompilado.includes(selectorDe(familia))) continue;

        const relativo = path.relative(RAIZ, fichero).replace(/\\/g, "/");
        const llave = `${relativo}:${i + 1}:${clase}`;
        if (yaVisto.has(llave)) continue;
        yaVisto.add(llave);

        hallazgos.push({
          fichero: relativo,
          linea: i + 1,
          clase,
          propuesta: propuesta(variantes, utilidad, cssCompilado),
        });
      }
    });
  }

  hallazgos.sort(
    (a, b) => a.fichero.localeCompare(b.fichero) || a.linea - b.linea,
  );
  return hallazgos;
}

async function main() {
  const hallazgos = await escanear();

  if (!hallazgos.length) {
    console.log(
      "\n✓ Ninguna clase con valor decimal se está cayendo del CSS compilado.\n",
    );
    process.exit(0);
  }

  console.log(`\n✗ ${hallazgos.length} clases escritas que NO llegan al CSS:\n`);
  for (const h of hallazgos) {
    console.log(`  ${h.fichero}:${h.linea}  ${h.clase}`);
    console.log(
      h.propuesta
        ? `     → usa \`${h.propuesta}\` (el valor válido más cercano)`
        : "     → sin equivalente válido cercano; revisa a mano qué se pretendía",
    );
  }
  console.log(
    "\nTailwind v4 descarta en silencio las utilidades cuyo valor suelto no es\n" +
      "múltiplo de 0,25. La clase se queda escrita y no existe en el CSS.\n",
  );
  process.exit(1);
}

/*
 * Solo se ejecuta si se invoca directo; importado, expone `escanear()`.
 *
 * Vía `pathToFileURL` y no comparando cadenas: en Windows `process.argv[1]` es
 * `C:\ruta\script.mjs` y `import.meta.url` es `file:///C:/ruta/script.mjs`.
 * Cualquier apaño a mano se queda corto en una barra y el script se importa a sí
 * mismo sin ejecutar nada —salía sin imprimir y con código 0, que es un verde
 * falso—.
 */
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
