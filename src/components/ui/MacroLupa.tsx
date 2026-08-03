"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { CSS_EASE_ASENTAR, LUPA } from "@/lib/motion";
import { TelaTenida } from "./TelaTenida";
import type { Foto } from "@/data/imagenes";

/**
 * AUMENTO MÁXIMO DE LA LUPA. Único valor editable del efecto.
 *
 * Es un techo EDITORIAL, no técnico: el límite no lo pone la resolución sino la
 * óptica. La foto tiene profundidad de campo real —hay zonas fuera de foco por
 * el diafragma, no por compresión— y pasarse de aquí las saca a la luz. Se fijó
 * mirando la tela en pantalla, no calculándolo.
 *
 * El aumento que se aplica de verdad es el MENOR entre este techo y lo que dé
 * la resolución real de la imagen cargada (ver `topePorResolucion`). Subir esta
 * constante no inventa nitidez: si la foto no da, manda la foto.
 */
const ZOOM_MAX = 2.5;

/**
 * Por debajo de este aumento no se monta la lupa.
 *
 * Una lupa de 1,2x no enseña la trama: mueve la foto lo justo para distraer y
 * promete un detalle que no llega. Mejor no ofrecerla. Esto es lo que apaga la
 * lupa en las telas cuya foto es de 1280px —que a DPR 2 topan en 1,23x— y la
 * deja encendida en las que tienen derivado de alta.
 */
const UMBRAL_LUPA = 1.4;

export interface MacroLupaProps {
  /** Foto base: la que se ve siempre, ya recortada al encuadre de la ficha. */
  foto: Foto;
  /**
   * Derivado de alta con EL MISMO RECORTE, para la capa que amplía. Se descarga
   * solo cuando alguien activa la lupa. Sin él la lupa amplía sobre la base, y
   * el tope por resolución la apagará casi siempre.
   *
   * Va la `Foto` entera y no su ruta porque el recoloreo necesita también SU
   * luminancia: es el mismo recorte que la base, pero a otro tamaño y con otra
   * compresión, así que su `k` no es exactamente la misma y quien tiñe la capa
   * de alta tiene que compensar con la suya.
   */
  zoom?: Foto;
  /** Anchos servidos para la imagen base. */
  sizes: string;
  /** Color del recoloreo, o `null` para la foto sin tocar. */
  colorHex: string | null;
  /** Abre el visor a pantalla completa: táctil y teclado. */
  onAbrirVisor: () => void;
  className?: string;
}

/**
 * Foto principal de la ficha de tela: lupa macro + recoloreo, compuestos.
 *
 * LA LUPA
 * Amplía sobre el punto que señala el cursor, no sobre el centro. Se consigue
 * escalando el contenedor con `transform-origin` en el punto del puntero: ese
 * punto es el único que no se mueve, así que la trama crece a su alrededor y el
 * detalle que se estaba mirando sigue debajo del ratón.
 *
 * Solo con puntero fino. En táctil no hay hover que sostenga el gesto y un
 * arrastre sobre la foto es scroll de página; ahí el gesto es un toque, que
 * abre el visor a pantalla completa con pellizco.
 *
 * LA COMPOSICIÓN CON EL COLOR
 * El color no es una capa encima: es el fondo sobre el que la imagen se mezcla,
 * y va DENTRO del contenedor que escala —ver `TelaTenida`—. Si quedara fuera,
 * al ampliar la foto crecería y el color se quedaría quieto: se vería la trama
 * ampliada con un velo de color inmóvil encima. Dentro, el color amplía con la
 * tela y se puede mirar el tejido azul de cerca, que es el punto del ejercicio.
 *
 * RENDIMIENTO
 * En reposo no corre nada: sin cursor encima no hay estado, no hay listener de
 * movimiento activo y el derivado de alta ni se ha descargado. La lupa solo
 * anima `transform`, que no repinta.
 */
export function MacroLupa({
  foto,
  zoom: alta,
  sizes,
  colorHex,
  onAbrirVisor,
  className,
}: MacroLupaProps) {
  const marco = useRef<HTMLButtonElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const frame = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  const [lente, setLente] = useState<{ fx: number; fy: number } | null>(null);
  const [anchoCss, setAnchoCss] = useState(0);
  const [anchoBase, setAnchoBase] = useState(0);
  const [anchoAlta, setAnchoAlta] = useState(0);

  /**
   * Resolución que manda: la de la capa de alta cuando está montada y cargada,
   * la de la base mientras tanto. Las dos se leen de `naturalWidth`, así que en
   * la base es el ancho del derivado que next/image sirvió de verdad —no el del
   * archivo de origen—, que es justamente el que tiene el navegador.
   *
   * Que el tope suba a media pasada, cuando termina de cargar la alta, no
   * produce un salto visible hoy: en Athletic los dos topes quedan por encima
   * de `ZOOM_MAX`, así que el aumento aplicado es el mismo antes y después.
   */
  const anchoNatural = lente && anchoAlta ? anchoAlta : anchoBase;

  /**
   * Tope por resolución REAL de los píxeles que tiene el navegador —no del
   * archivo en disco ni del ancho declarado en el registro—: `naturalWidth` es
   * el del derivado que se sirvió de verdad.
   *
   * Se mide contra píxeles de DISPOSITIVO, no CSS. En una pantalla 2x cada
   * píxel CSS son cuatro físicos, así que ampliar hasta el límite CSS ya estaría
   * interpolando a la vista. Es la regla estricta, y es la honesta: la lupa
   * enseña detalle que existe o no se enciende.
   */
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const topePorResolucion =
    anchoCss > 0 && anchoNatural > 0 ? anchoNatural / (anchoCss * dpr) : 0;

  const zoom = Math.min(ZOOM_MAX, topePorResolucion);
  const hayLupa = zoom >= UMBRAL_LUPA;
  const ampliando = hayLupa && lente !== null;

  // El ancho pintado decide el tope, así que se vuelve a medir cuando cambia
  // —redimensionar la ventana, girar el dispositivo, abrir las herramientas—.
  useEffect(() => {
    const el = marco.current;
    if (!el) return;
    const ro = new ResizeObserver(([entrada]) => {
      setAnchoCss(entrada.contentRect.width);
      rect.current = null; // la caja se movió: la cacheada ya no vale
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  const finoDisponible = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches;

  const seguir = useCallback((e: React.PointerEvent) => {
    const r = rect.current ?? marco.current?.getBoundingClientRect() ?? null;
    if (!r) return;
    rect.current = r;
    const fx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const fy = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    // Un frame por repintado: el puntero dispara muchos más eventos de los que
    // la pantalla puede mostrar y cada `setState` de más es un render tirado.
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setLente({ fx, fy }));
  }, []);

  function onEnter(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || !finoDisponible()) return;
    rect.current = marco.current?.getBoundingClientRect() ?? null;
    seguir(e);
  }

  function onMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || !finoDisponible()) return;
    seguir(e);
  }

  function onLeave() {
    if (frame.current) cancelAnimationFrame(frame.current);
    setLente(null);
    // La capa de alta se desmonta con la lupa, así que su ancho medido ya no
    // describe nada. Se olvida a propósito: dejarlo puesto haría que la
    // siguiente entrada diera por pintada una imagen que aún no está en el DOM
    // y enseñara su fondo teñido —opaco— tapando la base.
    setAnchoAlta(0);
  }

  return (
    <button
      ref={marco}
      type="button"
      // Pulsar SIEMPRE abre el visor, con ratón, dedo o Enter. Es lo que
      // promete el nombre accesible del botón, y en táctil y teclado —donde no
      // hay hover que sostenga la lupa— es la única vía a ver la tela grande.
      onClick={onAbrirVisor}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-label={`Ampliar: ${foto.alt}`}
      className={cn(
        // La mezcla la acota `TelaTenida`, que aísla su propio grupo: aquí no
        // hace falta `isolate`. `bg-bone` solo se ve en las telas sin recoloreo
        // —en las que lo tienen, el fondo teñido lo tapa desde el primer frame—.
        "group relative aspect-4/3 w-full overflow-hidden bg-bone",
        hayLupa && "cursor-zoom-in",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      {/*
        EL CONTENEDOR QUE ESCALA. Dentro van las dos imágenes y el color, así
        que todo amplía junto. Fuera solo quedan las lecturas de instrumento
        —indicador y pista táctil—, que no deben crecer con la tela.
      */}
      <div
        className="absolute inset-0"
        style={{
          transform: ampliando ? `scale(${zoom})` : undefined,
          transformOrigin: lente
            ? `${lente.fx * 100}% ${lente.fy * 100}%`
            : undefined,
          // Solo la entrada y la salida del aumento se animan; el seguimiento
          // del cursor va sin transición para que el punto no resbale.
          transition: reduceMotion
            ? undefined
            : `transform ${LUPA.aumento}s ${CSS_EASE_ASENTAR}`,
        }}
      >
        {/*
          `loading="eager"` porque esta foto es el elemento más grande de la
          ficha y está sobre el pliegue: es el LCP, y Next lo avisa por consola
          en cuanto lo detecta cargando en diferido.

          `fetchPriority` alto y no `preload`: la etiqueta la monta un
          componente de cliente dentro del cuerpo, así que adelantar el <link>
          al <head> no aporta, y la documentación de next/image desaconseja
          combinarlo con `loading`.

          EL TINTE YA NO DEPENDE DE QUE ESTA FOTO LLEGUE A TIEMPO. Lo pinta el
          fondo de `TelaTenida`, que viaja en el HTML servido; adelantar la
          descarga sigue valiendo por el LCP, pero no es lo que sostiene el
          color. Cuando lo era, no bastaba — ver la cabecera de `TelaTenida`.

          `data-telon-espera` es lo que hace que el telón de carga inicial no
          se retire hasta que esta foto esté decodificada (con tope; ver
          `LoadCurtain`). Va aquí y no en la miniatura ni en la capa de alta
          porque esta es la imagen por la que la ficha se juzga cargada: la
          misma razón por la que lleva `loading="eager"`. Marcarla es también lo
          único que distingue a esta página del resto — sin la marca, el telón
          se retira al montar como en cualquier otra.
        */}
        <TelaTenida hex={colorHex} src={foto.ruta} k={foto.k}>
          <Image
            src={foto.ruta}
            alt=""
            fill
            sizes={sizes}
            loading="eager"
            fetchPriority="high"
            data-telon-espera=""
            className="object-cover"
            onLoad={(e) => setAnchoBase(e.currentTarget.naturalWidth)}
          />
        </TelaTenida>

        {/*
          Capa de alta: se monta al entrar el cursor y se desmonta al salir. La
          primera vez tarda lo que tarde la descarga y hasta entonces se amplía
          sobre la base, que ya aguanta bastante; después la sirve la caché.

          VA EN SU PROPIO `TelaTenida` Y NO DENTRO DEL DE LA BASE. Dos imágenes
          bajo el mismo fondo se mezclarían entre sí —la de alta multiplicando a
          la base ya teñida— y la tela saldría casi al cuadrado de oscura en
          cuanto entrara el cursor. Además cada una compensa con SU luminancia,
          que no es la misma cifra: mismo recorte, otro tamaño y otra compresión.

          Y oculta hasta que carga: su fondo teñido es opaco, así que mostrarlo
          antes que la imagen taparía la base con un rectángulo de color plano.
          Aparecen los dos juntos o no aparece ninguno.

          `unoptimized` a propósito: el archivo ya es un WebP recortado al ancho
          exacto que la lupa necesita. Pasarlo por el optimizador lo volvería a
          comprimir —perdiendo justo el detalle que este derivado existe para
          conservar— y además serviría un ancho elegido por `sizes`, con lo que
          `naturalWidth` dejaría de ser la resolución real y el tope mentiría.
        */}
        {alta && lente && (
          <TelaTenida
            hex={colorHex}
            src={alta.ruta}
            k={alta.k}
            className={anchoAlta ? undefined : "opacity-0"}
          >
            <Image
              src={alta.ruta}
              alt=""
              aria-hidden
              fill
              unoptimized
              sizes="100vw"
              className="object-cover"
              onLoad={(e) => setAnchoAlta(e.currentTarget.naturalWidth)}
            />
          </TelaTenida>
        )}
      </div>

      {/*
        Indicador de aumento. Lectura de instrumento, no tutorial: dice a cuánto
        se está mirando, en el mismo mono que la galga y el gramaje de la ficha.
        Muestra el aumento EFECTIVO —si la resolución lo topó por debajo del
        techo, se lee el número real, no el que nos gustaría—.
      */}
      {ampliando && (
        <span className="pointer-events-none absolute bottom-0 left-0 m-3 bg-ink/70 px-2 py-1 font-mono text-micro tracking-widest text-paper">
          {zoom.toFixed(1).replace(".", ",")}×
        </span>
      )}

      {/*
        Pista táctil. Un ícono y no una frase: el brief prohíbe el "click para
        hacer zoom" de plantilla, y con hover la señal ya la da el cursor. En
        táctil no hay cursor, así que queda esto. El nombre accesible lo da el
        `aria-label` del botón, no el ícono.
      */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 m-3 flex size-7 items-center justify-center bg-ink/70 text-paper sm:hidden"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="size-4">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M11 8.5v5M8.5 11h5M15.8 15.8 20 20" strokeLinecap="square" />
        </svg>
      </span>
    </button>
  );
}
