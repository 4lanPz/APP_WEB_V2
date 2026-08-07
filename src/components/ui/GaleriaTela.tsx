"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { MacroLupa } from "./MacroLupa";
import { TelaTenida } from "./TelaTenida";
import { SwatchesRecoloreo } from "./SwatchesRecoloreo";
import { cn } from "@/lib/cn";
import { COLORES_RECOLOREO } from "@/data/recoloreo";
import type { Foto, VistaTela } from "@/data/imagenes";

export interface GaleriaTelaProps {
  /** Vistas de la tela con archivo, en orden. */
  vistas: VistaTela[];
  /** Caption sobre el hueco vacío / la foto (p. ej. "Chelsea · Microfibra"). */
  caption: string;
  /** Anchos servidos para la imagen principal. */
  sizes: string;
  /** Derivado de alta para la lupa, si esta tela lo tiene. */
  zoom?: Foto;
  /** Muestrario de recoloreo. Solo donde la foto es gris neutro. */
  recoloreo?: boolean;
  className?: string;
}

/**
 * Galería de la página de tela.
 *
 *  - Sin ninguna foto → el hueco de siempre (`ImagePlaceholder`): no hay nada
 *    que enseñar todavía.
 *  - Con una sola foto → la principal, con su lupa y su visor, y NADA debajo.
 *    Una tira de miniaturas de un solo elemento no es un control: no hay a
 *    dónde ir. Antes se pintaban además recuadros con un "+" por cada vista
 *    pendiente, y en la mayoría de las telas —que tienen una foto— eso dejaba
 *    una fila de huecos que se lee como catálogo a medio hacer. Lo que falta se
 *    pide desde `/admin/imagenes`, no desde la ficha del cliente.
 *  - Con ≥2 fotos → galería completa: principal más la tira de miniaturas.
 *
 * RECOLOREO
 * Donde la tela lo admite, el muestrario va entre la principal y las
 * miniaturas, y el color alcanza a TODA la galería: principal, miniaturas y
 * visor. Teñir solo la principal dejaría una foto en rojo con sus miniaturas en
 * blanco, que se lee como un fallo de carga; y abrir el visor para encontrar la
 * tela otra vez blanca contradiría lo que el usuario acaba de elegir.
 *
 * RENDIMIENTO
 * No hay ningún efecto permanente. La lupa solo existe mientras el cursor está
 * encima y solo anima `transform`. El visor a pantalla completa solo vive
 * mientras está abierto. Nada corre en reposo.
 *
 * Sin dependencias nuevas: lupa, pellizco y mezcla son Pointer Events,
 * transform y `mix-blend-mode`.
 */
export function GaleriaTela({
  vistas,
  caption,
  sizes,
  zoom,
  recoloreo = false,
  className,
}: GaleriaTelaProps) {
  const [activa, setActiva] = useState(0);
  const [visorAbierto, setVisorAbierto] = useState(false);
  const [color, setColor] = useState(0);

  // El primer tono es el blanco óptico: apenas un tinte azulado sobre la foto,
  // que es el estado en que se ve la tela sin intervenir.
  const colorHex = recoloreo ? COLORES_RECOLOREO[color].hex : null;

  // Sin ninguna foto todavía: el hueco de siempre. No hay galería que mostrar,
  // así que se deja el placeholder.
  if (vistas.length === 0) {
    return (
      <ImagePlaceholder
        /*
         * hueco-registrado: este `src={undefined}` NO es un hueco sin slot.
         *
         * Es la rama de "esta tela no tiene todavía NINGUNA vista": `vistas` sale
         * de `vistasDeTela(slug)`, que ya resuelve los slots de la tela, y viene
         * vacío justo cuando ninguno tiene archivo. El slot existe y es el slug
         * de la tela (`SLOTS_TELA`, derivado de `taxonomy.ts`), así que la foto
         * SÍ está pedida en el inventario de /admin/imagenes.
         *
         * Escribir aquí `foto(slug)` para que se notara sería peor: volvería a
         * consultar lo que la llamada de arriba ya resolvió, y en este punto se
         * sabe que da `undefined`.
         *
         * La marca la lee el chequeo de `npm run imagenes`, que si no lo daría
         * por hueco sin registrar. Va aquí y no en una lista del script para que
         * quien lea este archivo sepa si es excepción o descuido sin salir de él.
         */
        src={undefined}
        alt=""
        sizes={sizes}
        label="Foto pendiente"
        caption={caption}
        className={cn("aspect-4/3", className)}
      />
    );
  }

  const foto = vistas[Math.min(activa, vistas.length - 1)].foto;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <MacroLupa
        foto={foto}
        zoom={zoom}
        sizes={sizes}
        colorHex={colorHex}
        onAbrirVisor={() => setVisorAbierto(true)}
      />

      {/*
        El muestrario va aquí, pegado a la foto y por encima de las miniaturas:
        pulsar un color y ver cambiar la tela justo arriba es lo que explica el
        control sin una sola línea de texto.
      */}
      {recoloreo && (
        <SwatchesRecoloreo activo={color} onCambiar={setColor} />
      )}

      {/*
        Miniaturas: una por vista con archivo. Con una sola foto no se pintan —
        un control con una única opción no controla nada y ocupa el sitio de la
        ficha técnica.
      */}
      {vistas.length > 1 && (
        <div
          role="tablist"
          aria-label="Vistas de la tela"
          className="flex flex-wrap gap-2.5"
        >
          {vistas.map((v, i) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={i === activa}
              aria-label={`Vista ${i + 1}`}
              onClick={() => setActiva(i)}
              className="relative size-16 isolate overflow-hidden transition-shadow duration-200 ease-asentar sm:size-18"
              style={{
                boxShadow:
                  i === activa
                    ? "0 0 0 1px #C8C2B8, 0 0 0 3px #F5F2EE, 0 0 0 5px var(--color-brand)"
                    : "0 0 0 1px #C8C2B8",
              }}
            >
              <TelaTenida hex={colorHex} src={v.foto.ruta} k={v.foto.k}>
                <Image
                  src={v.foto.ruta}
                  alt=""
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              </TelaTenida>
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {visorAbierto && (
          <VisorPantallaCompleta
            foto={foto}
            colorHex={colorHex}
            onCerrar={() => setVisorAbierto(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Visor a pantalla completa con pellizco, para táctil. Dos punteros escalan
 * (distancia entre dedos), uno arrastra cuando hay zoom, doble toque alterna
 * 1× / 2,5×. Escape y el botón cierran. Todo con `transform`.
 */
function VisorPantallaCompleta({
  foto,
  colorHex,
  onCerrar,
}: {
  foto: Foto;
  colorHex: string | null;
  onCerrar: () => void;
}) {
  const [t, setT] = useState({ escala: 1, x: 0, y: 0 });
  // Durante un pellizco activo se quita la transición (seguir el dedo al
  // instante); fuera del gesto vuelve para que soltar recentre suave. Es
  // estado y no ref porque decide el render.
  const [enGesto, setEnGesto] = useState(false);
  const punteros = useRef<Map<number, { x: number; y: number }>>(new Map());
  const base = useRef<{ dist: number; escala: number } | null>(null);
  const ultimoToque = useRef(0);

  // Bloquea el scroll del cuerpo mientras el visor está abierto.
  useEffect(() => {
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previo;
      document.removeEventListener("keydown", onKey);
    };
  }, [onCerrar]);

  const dist = () => {
    const [a, b] = [...punteros.current.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  const onDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    punteros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (punteros.current.size >= 1) setEnGesto(true);
    if (punteros.current.size === 2) {
      base.current = { dist: dist(), escala: t.escala };
    }
    // Doble toque: alterna zoom.
    if (punteros.current.size === 1) {
      const ahora = e.timeStamp;
      if (ahora - ultimoToque.current < 300) {
        setT((p) => (p.escala > 1 ? { escala: 1, x: 0, y: 0 } : { ...p, escala: 2.5 }));
      }
      ultimoToque.current = ahora;
    }
  };

  const onMove = (e: React.PointerEvent) => {
    if (!punteros.current.has(e.pointerId)) return;
    const previo = punteros.current.get(e.pointerId)!;
    punteros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (punteros.current.size >= 2 && base.current) {
      const escala = Math.min(
        4,
        Math.max(1, (dist() / base.current.dist) * base.current.escala),
      );
      setT((p) => ({ ...p, escala }));
    } else if (punteros.current.size === 1 && t.escala > 1) {
      setT((p) => ({ ...p, x: p.x + (e.clientX - previo.x), y: p.y + (e.clientY - previo.y) }));
    }
  };

  const onUp = (e: React.PointerEvent) => {
    punteros.current.delete(e.pointerId);
    if (punteros.current.size < 2) base.current = null;
    if (punteros.current.size === 0) {
      setEnGesto(false);
      // Al soltar todo el zoom, recentra.
      if (t.escala <= 1) setT({ escala: 1, x: 0, y: 0 });
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex touch-none items-center justify-center overflow-hidden bg-ink/95"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <button
        type="button"
        onClick={onCerrar}
        aria-label="Cerrar"
        className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center bg-paper/10 font-sans text-xl text-paper"
      >
        ✕
      </button>
      {/* La imagen: object-contain para verla entera, transform para el zoom. */}
      <div
        className="relative isolate h-full w-full"
        style={{
          transform: `translate3d(${t.x}px, ${t.y}px, 0) scale(${t.escala})`,
          transition: enGesto ? "none" : "transform 0.15s ease-out",
        }}
      >
        {/*
          El color viaja hasta aquí: quien abre el visor con la tela en azul
          tiene que encontrarla en azul. `contain` porque la foto se ve entera
          con franjas a los lados, y el color no debe salirse a ellas.
        */}
        <TelaTenida hex={colorHex} src={foto.ruta} k={foto.k} ajuste="contain">
          <Image
            src={foto.ruta}
            alt={foto.alt}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </TelaTenida>
      </div>
    </motion.div>
  );
}
