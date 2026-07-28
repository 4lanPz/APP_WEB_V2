"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  BANCO DE PRUEBAS — TEMPORAL. BORRAR ENTERO.                             ║
 * ║                                                                          ║
 * ║  Cuatro rellenos de CTA sólido, uno al lado de otro, sobre las cuatro     ║
 * ║  superficies REALES de la portada. No es parte del sistema de botones:    ║
 * ║  es andamio para decidir mirando.                                        ║
 * ║                                                                          ║
 * ║  Para retirarlo: borra este fichero, los cuatro bloques marcados con      ║
 * ║  `▼ BANCO` en `src/app/page.tsx`, y la prop `banco` de `Hero.tsx`.        ║
 * ║  Todo eso entró en un solo commit; revertirlo lo deja limpio.            ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * EL MEDIDOR ESTÁ DUPLICADO A PROPÓSITO. `/styleguide/_sistema/Medidor.tsx`
 * hace lo mismo, pero pinta su propia superficie plana y su nota lo dice:
 * «sobre fotografía hace falta el barrido por píxel». Aquí la superficie es la
 * de la página —incluida una foto— y el fichero se va entero, así que se copia
 * el algoritmo en vez de enredar el de la styleguide con un caso que solo
 * necesita este andamio.
 */

type RGB = [number, number, number];
type Color = { base: RGB; alpha: number };

/*
 * EL COLOR NO SE PARSEA. Tailwind v4 devuelve `oklch(...)` y leer esos números
 * como RGB da basura. Lo pinta el navegador en un canvas de 1×1 sobre negro y
 * sobre blanco: la pasada negra da `alpha × color` (premultiplicado) y la
 * diferencia entre ambas da `1 − alpha`.
 */
function crearResolvedor() {
  const cv = document.createElement("canvas");
  cv.width = 1;
  cv.height = 1;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  return (color: string): Color => {
    if (!cx) return { base: [0, 0, 0], alpha: 1 };
    const pinta = (fondo: string): RGB => {
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
}

/** `base` viene premultiplicado, así que componer es sumar el fondo atenuado. */
const sobre = (c: Color, fondo: RGB): RGB => {
  const k = 1 - c.alpha;
  return [c.base[0] + k * fondo[0], c.base[1] + k * fondo[1], c.base[2] + k * fondo[2]];
};

function lin(c: number) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
function lum([r, g, b]: RGB) {
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function ratio(a: RGB, b: RGB) {
  const la = lum(a);
  const lb = lum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Fondo plano detrás de un elemento: sube componiendo capas hasta una opaca. */
function fondoPlano(desde: HTMLElement | null, resolver: (c: string) => Color): RGB {
  const capas: Color[] = [];
  let n = desde;
  while (n) {
    const c = resolver(getComputedStyle(n).backgroundColor);
    if (c.alpha > 0.001) {
      capas.push(c);
      if (c.alpha > 0.999) break;
    }
    n = n.parentElement;
  }
  let acc: RGB = [255, 255, 255];
  for (let i = capas.length - 1; i >= 0; i--) acc = sobre(capas[i], acc);
  return acc;
}

/**
 * FONDOS REALES BAJO UN BOTÓN QUE ESTÁ SOBRE FOTOGRAFÍA.
 *
 * Sin esto el número miente: `fondoPlano` sube por el árbol leyendo
 * `background-color`, y la foto del hero no es un background — es un `<img>`
 * hermano, en una pila con su propia opacidad y un velo de tinta encima. Subir
 * por el árbol devuelve `ink` a secas e ignora la foto entera, que es
 * justamente la textura contra la que hay que decidir.
 *
 * Recorta del `<img>`/`<video>` la región que queda EXACTAMENTE bajo el botón
 * —deshaciendo el `object-fit: cover`— y devuelve una nube de píxeles ya
 * compuesta: base opaca → media con su opacidad → los velos que vengan detrás
 * de él dentro de su mismo contenedor. Quien la recibe se queda con el peor.
 *
 * Devuelve `null` si no hay media, si aún no ha cargado o si el lienzo saliera
 * contaminado: entonces se cae al fondo plano y la etiqueta lo dice.
 */
function fondosDeFoto(
  boton: HTMLElement,
  resolver: (c: string) => Color,
): RGB[] | null {
  const banda = boton.closest("header, section");
  const medias = banda?.querySelectorAll<HTMLImageElement | HTMLVideoElement>("img, video");
  // El último es el de arriba de la pila (el vídeo tapa al póster).
  const media = medias && medias.length ? medias[medias.length - 1] : null;
  if (!media) return null;

  const iw = media instanceof HTMLVideoElement ? media.videoWidth : media.naturalWidth;
  const ih = media instanceof HTMLVideoElement ? media.videoHeight : media.naturalHeight;
  if (!iw || !ih) return null;

  const rm = media.getBoundingClientRect();
  const rb = boton.getBoundingClientRect();
  if (!rm.width || !rm.height || !rb.width || !rb.height) return null;

  // Deshacer `object-fit: cover`: la escala es la mayor de las dos y sobra
  // imagen por el eje que no manda, centrada.
  const escala = Math.max(rm.width / iw, rm.height / ih);
  const offX = (rm.width - iw * escala) / 2;
  const offY = (rm.height - ih * escala) / 2;
  // Se recorta a la imagen en vez de abandonar: por redondeo el rectángulo se
  // sale medio píxel por un borde y no es motivo para dejar de medir.
  const sx = Math.max(0, Math.min(iw - 1, (rb.left - rm.left - offX) / escala));
  const sy = Math.max(0, Math.min(ih - 1, (rb.top - rm.top - offY) / escala));
  const sw = Math.max(1, Math.min(iw - sx, rb.width / escala));
  const sh = Math.max(1, Math.min(ih - sy, rb.height / escala));

  // Se remuestrea a 48×16: suaviza un pelo los extremos, pero mantener el
  // tamaño nativo no aporta nada a ojo y sí cuesta memoria en cada recarga.
  const N = 48;
  const M = 16;
  const cv = document.createElement("canvas");
  cv.width = N;
  cv.height = M;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  if (!cx) return null;

  let datos: Uint8ClampedArray;
  try {
    cx.drawImage(media, sx, sy, sw, sh, 0, 0, N, M);
    datos = cx.getImageData(0, 0, N, M).data;
  } catch {
    return null; // lienzo contaminado
  }

  const base = fondoPlano(media.parentElement, resolver);
  const opacidad = parseFloat(getComputedStyle(media).opacity) || 1;

  /* Velos que van DESPUÉS del media dentro de su mismo contenedor: en el hero
     es el `bg-ink/28` que sostiene la legibilidad del titular. */
  const velos: Color[] = [];
  for (let s = media.nextElementSibling; s; s = s.nextElementSibling) {
    const c = resolver(getComputedStyle(s).backgroundColor);
    if (c.alpha > 0.001) velos.push(c);
  }

  const fondos: RGB[] = [];
  for (let i = 0; i < N * M; i++) {
    const px: RGB = [datos[i * 4], datos[i * 4 + 1], datos[i * 4 + 2]];
    let c: RGB = [
      opacidad * px[0] + (1 - opacidad) * base[0],
      opacidad * px[1] + (1 - opacidad) * base[1],
      opacidad * px[2] + (1 - opacidad) * base[2],
    ];
    for (const v of velos) c = sobre(v, c);
    fondos.push(c);
  }
  return fondos;
}

type Lectura = {
  texto: number;
  umbralTexto: number;
  limite: number | null;
  queLimite: string;
  /** La cifra sale de píxeles de la foto y no de un plano de color. */
  muestreado: boolean;
};

function medir(el: HTMLElement, conFoto: boolean): Lectura {
  const resolver = crearResolvedor();
  const cs = getComputedStyle(el);

  const muestras = conFoto ? fondosDeFoto(el, resolver) : null;
  const fondos: RGB[] = muestras ?? [fondoPlano(el.parentElement, resolver)];

  const relleno = resolver(cs.backgroundColor);
  const color = resolver(cs.color);
  const borde = resolver(cs.borderTopColor);
  const hayBorde = (parseFloat(cs.borderTopWidth) || 0) > 0 && borde.alpha > 0.05;

  const fs = parseFloat(cs.fontSize);
  const fw = parseInt(cs.fontWeight, 10) || 400;
  const grande = fs >= 24 || (fs >= 18.66 && fw >= 700);

  let peorTexto = Infinity;
  let peorLimite: number | null = null;
  let queLimite = "";

  for (const detras of fondos) {
    const bajoTexto = sobre(relleno, detras);
    peorTexto = Math.min(peorTexto, ratio(sobre(color, bajoTexto), bajoTexto));

    /*
     * Límite del control (1.4.11): un botón puede estar delimitado por su
     * relleno O por su borde, así que basta con que UNO llegue a 3:1 y se coge
     * el mejor de los dos. Medir solo el relleno suspendía a los contornos.
     */
    const cand: { que: string; v: number }[] = [];
    if (relleno.alpha > 0.05) cand.push({ que: "relleno", v: ratio(bajoTexto, detras) });
    if (hayBorde) cand.push({ que: "borde", v: ratio(sobre(borde, detras), detras) });
    const mejor = cand.sort((a, b) => b.v - a.v)[0];
    if (mejor && (peorLimite === null || mejor.v < peorLimite)) {
      peorLimite = mejor.v;
      queLimite = mejor.que;
    }
  }

  return {
    texto: peorTexto,
    umbralTexto: grande ? 3 : 4.5,
    limite: peorLimite,
    queLimite,
    muestreado: muestras !== null,
  };
}

const f = (n: number) => n.toFixed(2).replace(".", ",");

function Dato({
  nombre,
  valor,
  minimo,
  oscuro,
}: {
  nombre: string;
  valor: number;
  minimo: number;
  oscuro: boolean;
}) {
  const ok = valor >= minimo - 0.005;
  return (
    <span className="flex gap-1.5">
      <dt>{nombre}</dt>
      {/* `font-medium` y no `font-semibold`: la mono solo se carga en 400 y 500
          (layout.tsx) y a 11px la negrita sintética solapa los glifos. */}
      <dd className={cn("font-medium", ok ? (oscuro ? "text-paper" : "text-ink") : "text-accent")}>
        {f(valor)}:1 {ok ? "✓" : "✗"}
      </dd>
      <dd>/ {f(minimo)}</dd>
    </span>
  );
}

export type SuperficieBanco = "foto" | "hueso" | "papel" | "brand-deep";

/** Las superficies oscuras piden etiquetas en papel; las claras, en grafito. */
const OSCURA: Record<SuperficieBanco, boolean> = {
  foto: true,
  "brand-deep": true,
  hueso: false,
  papel: false,
};

const CAJA =
  "inline-flex h-12 items-center justify-center gap-2.25 whitespace-nowrap rounded-sm px-7.5 " +
  "font-sans text-base font-medium";

/**
 * LAS CUATRO. Sin hover ni foco: aquí se compara el reposo, que es como se ve
 * casi siempre y SIEMPRE en táctil.
 *
 * Las tres primeras son idénticas en las cuatro superficies a propósito —si
 * cambiaran por superficie no habría nada que comparar—. La cuarta no puede:
 * un contorno reforzado necesita saber si refuerza contra claro o contra
 * oscuro, así que lleva sus dos formas y se elige por tono.
 */
const VARIANTES = [
  {
    n: "01",
    nombre: "Relleno tinta",
    detalle: "ink + texto papel",
    clases: "border border-ink bg-ink text-paper",
  },
  {
    n: "02",
    nombre: "Relleno azul",
    detalle: "brand + texto tinta",
    clases: "border border-ink bg-brand text-ink",
  },
  {
    n: "03",
    nombre: "Relleno claro",
    detalle: "paper + texto tinta, sin filete",
    clases: "border border-transparent bg-paper text-ink",
  },
  {
    n: "04",
    nombre: "Contorno reforzado",
    detalle: "borde de 2px + velo detrás",
    /*
     * Las dos cosas que pediste a la vez, porque por separado ninguna basta:
     * el borde de 2px da masa al límite y el velo le quita textura al fondo
     * justo debajo, que es lo que hace que un contorno «vibre» sobre foto. El
     * desenfoque de fondo es lo que separa el velo de un simple plano y lo que
     * mata el ruido de alta frecuencia de la imagen.
     */
    clases: "border-2 backdrop-blur-[3px]",
    porTono: {
      oscuro: "border-paper bg-ink/55 text-paper",
      claro: "border-ink bg-paper/70 text-ink",
    },
  },
] as const;

function Celda({
  clases,
  etiqueta,
  n,
  nombre,
  detalle,
  oscuro,
  conFoto,
}: {
  clases: string;
  etiqueta: string;
  n: string;
  nombre: string;
  detalle: string;
  oscuro: boolean;
  conFoto: boolean;
}) {
  const caja = useRef<HTMLDivElement>(null);
  const [l, setL] = useState<Lectura | null>(null);

  useEffect(() => {
    const el = caja.current?.querySelector<HTMLElement>("[data-medir]");
    if (!el) return;
    let vivo = true;
    /*
     * Dos frames de margen y, si hay foto, esperar a que esté decodificada: la
     * medida sale de píxeles reales y un `<img>` a medio cargar da negro.
     */
    const lanzar = () => {
      if (!vivo) return;
      requestAnimationFrame(() => vivo && setL(medir(el, conFoto)));
    };
    if (conFoto) {
      const img = el.closest("header, section")?.querySelector("img");
      if (img && !img.complete) {
        img.addEventListener("load", lanzar, { once: true });
        img.addEventListener("error", lanzar, { once: true });
        return () => {
          vivo = false;
        };
      }
    }
    lanzar();
    return () => {
      vivo = false;
    };
  }, [conFoto]);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <span
        className={cn(
          "font-mono text-micro uppercase",
          oscuro ? "text-paper/70" : "text-graphite",
        )}
      >
        {n} · {nombre}
      </span>
      <div ref={caja} className="flex min-h-13 items-center">
        <button type="button" data-medir className={cn(CAJA, clases)}>
          {etiqueta}
        </button>
      </div>
      <dl
        className={cn(
          "flex flex-col gap-1 font-mono text-micro",
          oscuro ? "text-paper/70" : "text-graphite",
        )}
      >
        <span className="opacity-80">{detalle}</span>
        {l === null ? (
          <span>midiendo…</span>
        ) : (
          <>
            <Dato nombre="texto" valor={l.texto} minimo={l.umbralTexto} oscuro={oscuro} />
            {l.limite !== null && (
              <Dato nombre={l.queLimite} valor={l.limite} minimo={3} oscuro={oscuro} />
            )}
            {conFoto && (
              <span className={l.muestreado ? "opacity-80" : "text-accent"}>
                {l.muestreado
                  ? "peor píxel de la foto bajo el botón"
                  : "foto no muestreable · medido contra tinta plana"}
              </span>
            )}
          </>
        )}
      </dl>
    </div>
  );
}

/**
 * Una fila del banco: las cuatro variantes sobre la superficie que le toque.
 *
 * No pinta fondo propio. Se monta DENTRO de la superficie real de la portada
 * —eso es todo el sentido del ejercicio—, así que hereda el que tenga encima.
 */
export function BancoCTA({
  superficie,
  etiqueta = "Solicitar muestra →",
  nota,
}: {
  superficie: SuperficieBanco;
  etiqueta?: string;
  nota?: string;
}) {
  const oscuro = OSCURA[superficie];
  const conFoto = superficie === "foto";

  return (
    <div
      className={cn(
        "flex flex-col gap-5 border-t border-dashed py-6",
        oscuro ? "border-paper/30" : "border-graphite/40",
      )}
    >
      <div className="flex flex-col gap-1">
        <span
          className={cn(
            "font-mono text-label uppercase",
            oscuro ? "text-paper" : "text-ink",
          )}
        >
          Banco temporal · superficie {superficie}
        </span>
        {nota && (
          <span
            className={cn(
              "max-w-2xl font-mono text-micro",
              oscuro ? "text-paper/70" : "text-graphite",
            )}
          >
            {nota}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
        {VARIANTES.map((v) => (
          <Celda
            key={v.n}
            n={v.n}
            nombre={v.nombre}
            detalle={v.detalle}
            etiqueta={etiqueta}
            oscuro={oscuro}
            conFoto={conFoto}
            clases={cn(v.clases, "porTono" in v && v.porTono[oscuro ? "oscuro" : "claro"])}
          />
        ))}
      </div>
    </div>
  );
}
