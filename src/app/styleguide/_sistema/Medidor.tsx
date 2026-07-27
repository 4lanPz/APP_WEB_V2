"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { Tono } from "./variantes";

/**
 * Mide el contraste de una muestra EN EL NAVEGADOR, sobre lo que hay pintado.
 *
 * Se mide en vivo y no con números escritos a mano a propósito: en cuanto
 * alguien toque una clase de `variantes.ts`, la cifra de debajo cambia sola.
 * Una tabla de contrastes copiada a mano miente en cuanto el CSS se mueve.
 *
 * EL COLOR NO SE PARSEA. Tailwind v4 devuelve `getComputedStyle().color` en
 * `oklch(...)`, y leer esos números como si fueran RGB da basura —`paper/70`
 * salía como casi negro—. Aquí lo pinta el propio navegador en un canvas de
 * 1×1 sobre negro y sobre blanco: la pasada en negro da `alpha × color` (ya
 * premultiplicado) y la diferencia entre ambas da `1 − alpha`. Funciona sea
 * cual sea la sintaxis con la que el motor decida devolver el color.
 *
 * Las superficies del styleguide son planas, así que el peor píxel y el único
 * píxel son el mismo. Sobre fotografía —el caso de los heroes— hace falta el
 * barrido por píxel del script de Playwright; aquí no.
 */

type Color = { base: [number, number, number]; alpha: number };
type RGB = [number, number, number];

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

/** `opacity` del elemento: funde TODO lo pintado contra lo que hay detrás. */
const conOpacidad = (c: RGB, detras: RGB, o: number): RGB =>
  o >= 0.999 ? c : [o * c[0] + (1 - o) * detras[0], o * c[1] + (1 - o) * detras[1], o * c[2] + (1 - o) * detras[2]];

function lin(c: number) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
function lum([r, g, b]: RGB) {
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function ratio(a: RGB, b: RGB) {
  const la = lum(a), lb = lum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Fondo real detrás de un elemento: sube por el árbol componiendo cada capa
 * translúcida hasta dar con una opaca. Sin esto, un `bg-paper/10` sobre `ink`
 * se leería como transparente y el número saldría del color equivocado.
 */
function fondoDetras(desde: HTMLElement | null, resolver: (c: string) => Color): RGB {
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

type Lectura = {
  texto: number;
  umbralTexto: number;
  limite: number | null;
  queLimite: string;
  foco: number | null;
};

function medir(el: HTMLElement): Lectura {
  const resolver = crearResolvedor();
  const cs = getComputedStyle(el);
  const detras = fondoDetras(el.parentElement, resolver);
  const opacidad = parseFloat(cs.opacity) || 1;

  const relleno = resolver(cs.backgroundColor);
  const bajoTexto = sobre(relleno, detras);
  const fondoFinal = conOpacidad(bajoTexto, detras, opacidad);

  const color = resolver(cs.color);
  const textoFinal = conOpacidad(sobre(color, bajoTexto), detras, opacidad);

  const fs = parseFloat(cs.fontSize);
  const fw = parseInt(cs.fontWeight, 10) || 400;
  const grande = fs >= 24 || (fs >= 18.66 && fw >= 700);

  /*
   * Límite del control (1.4.11). Un botón puede estar delimitado por su
   * relleno O por su borde: basta con que UNO de los dos llegue a 3:1, así que
   * se coge el mejor. Medir solo el relleno daba falsos suspensos —un botón de
   * contorno con hover en `bone` tiene el filete de tinta a 15,67:1 y el
   * relleno a 1,08:1, y lo que lo delimita es el filete—.
   */
  const candidatos: { que: string; v: number }[] = [];
  if (relleno.alpha > 0.05) {
    candidatos.push({ que: "relleno", v: ratio(fondoFinal, detras) });
  }
  const borde = resolver(cs.borderTopColor);
  if ((parseFloat(cs.borderTopWidth) || 0) > 0 && borde.alpha > 0.05) {
    candidatos.push({
      que: "borde",
      v: ratio(conOpacidad(sobre(borde, detras), detras, opacidad), detras),
    });
  }
  const mejor = candidatos.sort((a, b) => b.v - a.v)[0];

  // Anillo de foco: con `outline-offset` cae sobre la página, no sobre el botón.
  const anchoAnillo = parseFloat(cs.outlineWidth) || 0;
  const anillo = resolver(cs.outlineColor);
  const foco =
    cs.outlineStyle !== "none" && anchoAnillo > 0 && anillo.alpha > 0.05
      ? ratio(sobre(anillo, detras), detras)
      : null;

  return {
    texto: ratio(textoFinal, fondoFinal),
    umbralTexto: grande ? 3 : 4.5,
    limite: mejor ? mejor.v : null,
    queLimite: mejor ? mejor.que : "",
    foco,
  };
}

const f = (n: number) => n.toFixed(2).replace(".", ",");

function Dato({
  nombre,
  valor,
  minimo,
  oscuro,
  exento,
}: {
  nombre: string;
  valor: number;
  minimo: number;
  oscuro: boolean;
  exento?: boolean;
}) {
  const ok = valor >= minimo - 0.005;
  return (
    <span className="flex gap-1.5">
      <dt>{nombre}</dt>
      {/* `font-medium` y no `font-semibold`: IBM Plex Mono se carga solo en 400
          y 500 (ver layout.tsx), así que un 600 lo sintetiza el navegador y a
          11px los glifos se solapan —el «#008069» de la tabla de verdes salía
          pareciendo tachado—. */}
      <dd
        className={cn(
          "font-medium",
          exento ? (oscuro ? "text-paper/70" : "text-graphite") : ok ? (oscuro ? "text-paper" : "text-ink") : "text-accent",
        )}
      >
        {f(valor)}:1 {exento ? "—" : ok ? "✓" : "✗"}
      </dd>
      <dd>/ {exento ? "exento" : f(minimo)}</dd>
    </span>
  );
}

/**
 * Caja de muestra: pinta el hijo sobre la superficie indicada y escribe debajo
 * lo que mide.
 *
 * `sinLimite` para controles que no pretenden tener caja propia (enlaces dentro
 * del texto). `exento` para el estado inhabilitado: WCAG excluye los controles
 * inactivos de los mínimos de contraste, así que marcarlos en rojo sería ruido
 * —pero el número se sigue enseñando, porque "exento" no es "utilizable".
 */
export function Muestra({
  tono,
  etiqueta,
  children,
  sinLimite = false,
  exento = false,
  umbral,
  className,
}: {
  tono: Tono;
  etiqueta?: string;
  children: React.ReactNode;
  sinLimite?: boolean;
  exento?: boolean;
  /**
   * Fuerza el mínimo. Hace falta para los controles de SOLO ICONO: el medidor
   * deduce el umbral del tamaño de fuente, pero un glifo no es texto y su
   * mínimo es el no textual de 1.4.11 (3:1), no 4,5:1.
   */
  umbral?: number;
  className?: string;
}) {
  const caja = useRef<HTMLDivElement>(null);
  const [l, setL] = useState<Lectura | null>(null);

  useEffect(() => {
    const el = caja.current?.querySelector<HTMLElement>("[data-medir]");
    if (!el) return;
    // Un frame de margen para que las fuentes estén aplicadas.
    const id = requestAnimationFrame(() => setL(medir(el)));
    return () => cancelAnimationFrame(id);
  }, []);

  const oscuro = tono === "oscuro";

  return (
    <div className={cn("flex flex-col gap-3 p-5", oscuro ? "bg-ink" : "bg-paper", className)}>
      {etiqueta && (
        <span
          className={cn(
            "font-mono text-micro uppercase",
            oscuro ? "text-paper/70" : "text-graphite",
          )}
        >
          {etiqueta}
        </span>
      )}
      <div ref={caja} className="flex min-h-13 items-center">
        {children}
      </div>
      <dl
        className={cn(
          "flex flex-wrap gap-x-4 gap-y-1 font-mono text-micro",
          oscuro ? "text-paper/70" : "text-graphite",
        )}
      >
        {l === null ? (
          <span>midiendo…</span>
        ) : (
          <>
            <Dato
              nombre={umbral === 3 ? "glifo" : "texto"}
              valor={l.texto}
              minimo={umbral ?? l.umbralTexto}
              oscuro={oscuro}
              exento={exento}
            />
            {!sinLimite && l.limite !== null && (
              <Dato nombre={l.queLimite} valor={l.limite} minimo={3} oscuro={oscuro} exento={exento} />
            )}
            {l.foco !== null && (
              <Dato nombre="anillo" valor={l.foco} minimo={3} oscuro={oscuro} />
            )}
          </>
        )}
      </dl>
    </div>
  );
}
