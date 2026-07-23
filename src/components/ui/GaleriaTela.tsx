"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { cn } from "@/lib/cn";
import { EASE_REVELAR } from "@/lib/motion";
import type { Foto } from "@/data/imagenes";

export interface GaleriaTelaProps {
  /** Fotos disponibles de la tela, en orden (macro base primero). */
  fotos: Foto[];
  /** Caption sobre el hueco vacío / la foto (p. ej. "Chelsea · Microfibra"). */
  caption: string;
  /** Anchos servidos para la imagen principal. */
  sizes: string;
  className?: string;
}

/** Aumento de la lupa. 2,2× enseña la trama sin pixelar los webp de 1280px. */
const LUPA_ZOOM = 2.2;

/**
 * Galería de la página de tela. DEGRADA SOLA según cuántas fotos haya:
 *
 *  - 0 fotos → el hueco de siempre (`ImagePlaceholder`). Igual que antes.
 *  - 1 foto  → la imagen fija, sin miniaturas ni controles. Igual que antes.
 *  - ≥2      → galería: principal + miniaturas, lupa en escritorio, visor a
 *              pantalla completa con pellizco en móvil.
 *
 * Casi ninguna tela tiene hoy más de una foto, así que el camino de 0–1 es el
 * que se ve en producción y el que no puede cambiar. La galería solo aparece
 * cuando de verdad hay varias vistas que mirar.
 *
 * RENDIMIENTO
 * No hay ningún efecto permanente. La lupa solo existe mientras el cursor está
 * encima (se monta en `pointerenter`, se desmonta en `pointerleave`) y solo
 * anima `transform`/`transform-origin`. El visor a pantalla completa solo vive
 * mientras está abierto. Nada corre en reposo.
 *
 * Sin dependencias nuevas: lupa y pellizco son Pointer Events + transform.
 */
export function GaleriaTela({ fotos, caption, sizes, className }: GaleriaTelaProps) {
  const [activa, setActiva] = useState(0);
  const [visorAbierto, setVisorAbierto] = useState(false);
  const reduceMotion = useReducedMotion();

  // Degradación: 0 o 1 foto → comportamiento de siempre, sin galería.
  if (fotos.length <= 1) {
    const foto = fotos[0];
    return (
      <ImagePlaceholder
        src={foto?.ruta}
        alt={foto?.alt ?? ""}
        sizes={sizes}
        label="Foto pendiente"
        caption={caption}
        className={cn("aspect-4/3", className)}
      />
    );
  }

  const foto = fotos[Math.min(activa, fotos.length - 1)];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <PrincipalConLupa
        foto={foto}
        sizes={sizes}
        reduceMotion={Boolean(reduceMotion)}
        onAbrirVisor={() => setVisorAbierto(true)}
      />

      {/* Miniaturas: anillo azul en la activa, mismo gesto que el muestrario. */}
      <div
        role="tablist"
        aria-label="Vistas de la tela"
        className="flex flex-wrap gap-2.5"
      >
        {fotos.map((f, i) => (
          <button
            key={f.ruta}
            type="button"
            role="tab"
            aria-selected={i === activa}
            aria-label={`Vista ${i + 1}`}
            onClick={() => setActiva(i)}
            className="relative size-16 overflow-hidden transition-shadow duration-200 ease-asentar sm:size-18"
            style={{
              boxShadow:
                i === activa
                  ? "0 0 0 1px #C8C2B8, 0 0 0 3px #F5F2EE, 0 0 0 5px #33A2DC"
                  : "0 0 0 1px #C8C2B8",
            }}
          >
            <Image
              src={f.ruta}
              alt=""
              fill
              sizes="72px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {visorAbierto && (
          <VisorPantallaCompleta foto={foto} onCerrar={() => setVisorAbierto(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Imagen principal con lupa de escritorio. La lupa es una segunda copia de la
 * imagen que se escala 2,2× con `transform-origin` en el punto del cursor, así
 * que el punto bajo el ratón se queda fijo y la trama crece a su alrededor a
 * tamaño real —no la foto entera más grande—. Solo se monta con puntero fino.
 *
 * En puntero grueso (táctil) no hay lupa: un toque abre el visor a pantalla
 * completa, que es donde el pellizco tiene sentido.
 */
function PrincipalConLupa({
  foto,
  sizes,
  reduceMotion,
  onAbrirVisor,
}: {
  foto: Foto;
  sizes: string;
  reduceMotion: boolean;
  onAbrirVisor: () => void;
}) {
  const marco = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const frame = useRef<number | null>(null);
  const [lente, setLente] = useState<{ fx: number; fy: number } | null>(null);

  const finoDisponible = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches;

  function onEnter(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || !finoDisponible()) return;
    rect.current = marco.current?.getBoundingClientRect() ?? null;
  }

  function onMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || !finoDisponible()) return;
    const r = rect.current ?? marco.current?.getBoundingClientRect() ?? null;
    if (!r) return;
    rect.current = r;
    const fx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const fy = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setLente({ fx, fy }));
  }

  function onLeave() {
    if (frame.current) cancelAnimationFrame(frame.current);
    setLente(null);
  }

  useEffect(() => {
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div
      ref={marco}
      className="group relative aspect-4/3 w-full cursor-zoom-in overflow-hidden bg-bone"
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={(e) => {
        // Solo el táctil abre el visor con un toque; el ratón usa la lupa.
        if (e.nativeEvent instanceof PointerEvent && e.nativeEvent.pointerType !== "mouse") {
          onAbrirVisor();
        }
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={foto.ruta}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE_REVELAR }}
        >
          <Image
            src={foto.ruta}
            alt={foto.alt}
            fill
            sizes={sizes}
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Capa de lupa: solo montada mientras hay cursor encima. */}
      {lente && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden sm:block"
          style={{
            transform: `scale(${LUPA_ZOOM})`,
            transformOrigin: `${lente.fx * 100}% ${lente.fy * 100}%`,
          }}
        >
          <Image
            src={foto.ruta}
            alt=""
            fill
            sizes={sizes}
            className="object-cover"
          />
        </div>
      )}

      {/* Pista discreta, solo en táctil (con hover se ve la propia lupa). */}
      <span className="pointer-events-none absolute bottom-0 right-0 m-3 bg-ink/70 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-paper sm:hidden">
        Toca para ampliar
      </span>
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
  onCerrar,
}: {
  foto: Foto;
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
        className="relative h-full w-full"
        style={{
          transform: `translate3d(${t.x}px, ${t.y}px, 0) scale(${t.escala})`,
          transition: enGesto ? "none" : "transform 0.15s ease-out",
        }}
      >
        <Image
          src={foto.ruta}
          alt={foto.alt}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>
    </motion.div>
  );
}
