"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { categories } from "@/data/taxonomy";
import { estadoFicha } from "@/data/fichas";
import { foto } from "@/data/imagenes";
import { EASE_REVELAR, EASE_PLEGAR, EASE_ASENTAR } from "@/lib/motion";

/**
 * Motion v1 §07 — Wizard: el paso saliente pliega (fade + rise -12px,
 * 300ms) y el entrante revela (fade + rise 12px, 400ms), encadenados sin
 * solapar (AnimatePresence mode="wait" más abajo).
 *
 * Los mismos valores se usan siempre (sin ramificar sobre
 * prefers-reduced-motion aquí): MotionConfig en el layout raíz resuelve la
 * preferencia sin arriesgar un mismatch de hidratación servidor/cliente.
 */
const stepVariants = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_REVELAR } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3, ease: EASE_PLEGAR } },
};

type Producto = "camiseta" | "chompa" | "pantalon" | "otro";
type Sublimado = "si" | "no";
type Uso = "rendimiento" | "casual" | "uniforme";

/**
 * `slot` es el id de imagen de cada opción (ver `slots-imagen.ts`). Las tres
 * primeras prendas reutilizan la foto del recomendador de /productos —misma
 * prenda, misma foto—; el resto tiene su propio slot. Sin archivo, la opción
 * muestra un hueco intencional, no una imagen rota.
 */
const PRODUCTOS: { key: Producto; title: string; sublabel: string; slot: string }[] = [
  { key: "camiseta", title: "Camiseta", sublabel: "punto / jersey", slot: "prenda-camiseta" },
  { key: "chompa", title: "Chompa / buzo", sublabel: "peso medio", slot: "prenda-chompa" },
  { key: "pantalon", title: "Pantalón deportivo", sublabel: "movilidad / secado", slot: "prenda-pantalon" },
  { key: "otro", title: "Otro", sublabel: "lo vemos con el asesor", slot: "asesor-prenda-otro" },
];

const SUBLIMADOS: { key: Sublimado; title: string; description: string; slot: string }[] = [
  { key: "si", title: "Sí, lleva sublimación", description: "Estampado full-print sobre base clara.", slot: "asesor-sublimado-si" },
  { key: "no", title: "No, color liso o teñido", description: "Tono sólido, teñido a demanda.", slot: "asesor-sublimado-no" },
];

const USOS: { key: Uso; title: string; description: string; slot: string }[] = [
  {
    key: "rendimiento",
    title: "Deportivo de alto rendimiento",
    description: "Seca rápido, aguanta el gesto, no pesa.",
    slot: "asesor-uso-rendimiento",
  },
  {
    key: "casual",
    title: "Casual, día a día",
    description: "Mano suave, caída natural, básicos de retail.",
    slot: "asesor-uso-casual",
  },
  {
    key: "uniforme",
    title: "Uniforme corporativo",
    description: "Color estable, resistente al lavado frecuente.",
    slot: "asesor-uso-uniforme",
  },
];

/**
 * Opción del cuestionario con miniatura. La imagen es de tamaño FIJO y va a la
 * izquierda: no le quita tamaño al área pulsable —la aumenta, toda la fila es
 * el botón— ni encoge el texto, que conserva su tamaño y contraste. Sin foto,
 * el hueco queda como plano de tinta con un punto de marca: se lee como parte
 * del diseño, no como imagen rota.
 */
function OpcionConImagen({
  slot,
  title,
  subtitle,
  subtitleMono = false,
  onClick,
}: {
  slot: string;
  title: string;
  subtitle: string;
  subtitleMono?: boolean;
  onClick: () => void;
}) {
  const f = foto(slot);
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-4 bg-brand-deep p-4 text-left transition-colors duration-220 ease-asentar hover:bg-paper/5 sm:p-5"
    >
      <span className="relative block size-16 shrink-0 overflow-hidden bg-paper/8 sm:size-18">
        {f ? (
          <Image src={f.ruta} alt="" fill sizes="72px" className="object-cover" />
        ) : (
          <span aria-hidden className="absolute inset-0 flex items-center justify-center">
            <span className="block size-2 bg-brand/70" />
          </span>
        )}
      </span>
      <span className="min-w-0">
        <span className="block font-sans text-[15px] font-semibold text-paper">
          {title}
        </span>
        <span
          className={cn(
            "mt-1 block",
            subtitleMono
              ? "font-mono text-xs uppercase tracking-widest text-paper/50"
              : "font-serif text-[15px] text-paper/60",
          )}
        >
          {subtitle}
        </span>
      </span>
    </button>
  );
}

const PLABEL: Record<Producto, string> = {
  camiseta: "camisetas",
  chompa: "chompas y buzos",
  pantalon: "pantalones deportivos",
  otro: "tu prenda",
};

const ULABEL: Record<Uso, string> = {
  rendimiento: "alto rendimiento",
  casual: "casual, día a día",
  uniforme: "uniforme corporativo",
};

/**
 * Recomendación por uso, con telas REALES del catálogo (taxonomy.ts).
 *
 * Nota histórica: aquí decía que "Melisa/Austria/Aruba/Doble Face" no existían
 * en el Excel. Era falso, y venía de una extracción incompleta del catálogo.
 * Melisa 24 y Austria Premium 18 SÍ son productos de línea y hoy están en
 * taxonomy; Aruba y Doble Face existen pero son A PEDIDO, así que no se
 * publican. Ver `08_catalogo_definitivo.md`.
 */
const RECOMMENDATION_SLUGS: Record<Uso, { category: string; subcategory: string }[]> = {
  rendimiento: [
    { category: "microfibra", subcategory: "dortmund-plus" },
    { category: "microfibra", subcategory: "athletic" },
    { category: "microfibra", subcategory: "titanium" },
  ],
  casual: [
    { category: "polialgodon", subcategory: "lacoast-20" },
    { category: "spun", subcategory: "interlock-30" },
    { category: "texturizado", subcategory: "gaby" },
  ],
  uniforme: [
    { category: "polialgodon", subcategory: "lacoast-polo-20" },
    { category: "polialgodon", subcategory: "pique-ares-24" },
    { category: "spun", subcategory: "ribb-30" },
  ],
};

/**
 * Los slugs de arriba están escritos a mano. Antes esto usaba `!` y un slug
 * renombrado reventaba en runtime en el navegador, sin error de compilación;
 * ahora la recomendación simplemente omite la tela que ya no exista. El test
 * de coherencia (`fichas.test.ts`) avisa en CI de que hay que actualizarlos.
 */
function buildResults(uso: Uso) {
  return RECOMMENDATION_SLUGS[uso].flatMap(
    ({ category: categorySlug, subcategory: subSlug }) => {
      const category = categories.find((c) => c.slug === categorySlug);
      const sub = category?.subcategories.find((s) => s.slug === subSlug);
      return category && sub ? [{ category, sub }] : [];
    },
  );
}

export function AsesorWizard() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [producto, setProducto] = useState<Producto | null>(null);
  const [sublimado, setSublimado] = useState<Sublimado | null>(null);
  const [uso, setUso] = useState<Uso | null>(null);
  const reduceMotion = useReducedMotion();

  const progress = { 1: 25, 2: 50, 3: 75, 4: 100 }[step];

  const results = useMemo(() => buildResults(uso ?? "casual"), [uso]);

  const summary = uso
    ? `Para ${producto ? PLABEL[producto] : "tu prenda"} de uso ${ULABEL[uso]}${
        sublimado === "si" ? ", listas para sublimar," : ""
      } empezaría por estas telas.`
    : "Según tus respuestas, empezaría por aquí.";

  function reset() {
    setStep(1);
    setProducto(null);
    setSublimado(null);
    setUso(null);
  }

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-widest">
        {(["1", "2", "3", "4"] as const).map((key, i) => {
          const labels = ["01 Prenda", "02 Sublimado", "03 Uso", "Resultado"];
          const stepNum = i + 1;
          return (
            <span key={key} className="flex items-center gap-3">
              {i > 0 && <span className="text-paper/20">→</span>}
              <span className={stepNum <= step ? "text-brand" : "text-paper/40"}>
                {labels[i]}
              </span>
            </span>
          );
        })}
      </div>
      <div className="mb-12 h-0.5 w-full max-w-sm origin-left bg-paper/15">
        <motion.div
          className="h-0.5 origin-left bg-brand"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE_ASENTAR }}
        />
      </div>

      <motion.div layout className="grid grid-cols-1 gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <div className="flex flex-col gap-6 border-t border-paper/15 pt-8 lg:border-t-0 lg:pt-0">
          <div>
            <p className="font-sans text-[15px] font-semibold text-paper">
              Asesor Textil Padilla
            </p>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-paper/50">
              Guía de selección de tela
            </p>
          </div>
          <p className="max-w-xs font-serif text-body-m text-paper/80">
            No es un chat que da vueltas. Son tres preguntas rectas y una
            recomendación concreta —gramaje, composición y tono— sobre telas
            que tejemos y teñimos de verdad.
          </p>
          <p className="font-mono text-xs uppercase tracking-widest text-paper/40">
            Seleccionamos · Tejemos · Teñimos
            <br />
            Quito · Guayaquil · Cuenca
          </p>
        </div>

        <div>
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 && (
            <motion.div
              key="1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-brand">
                Pregunta 01
              </span>
              <h2 className="mt-3 font-sans text-h2 font-medium text-paper">
                ¿Qué prenda vas a producir?
              </h2>
              <p className="mt-3 font-serif text-body-m text-paper/70">
                Partamos de la prenda. Define desde dónde miramos la tela.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-px bg-paper/15 sm:grid-cols-2">
                {PRODUCTOS.map((p) => (
                  <OpcionConImagen
                    key={p.key}
                    slot={p.slot}
                    title={p.title}
                    subtitle={p.sublabel}
                    subtitleMono
                    onClick={() => {
                      setProducto(p.key);
                      setStep(2);
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="2"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-brand">
                Pregunta 02
              </span>
              <h2 className="mt-3 font-sans text-h2 font-medium text-paper">
                ¿La tela irá sublimada?
              </h2>
              <p className="mt-3 font-serif text-body-m text-paper/70">
                La sublimación pide una base clara y con presencia de
                poliéster. Saberlo ahora acota la carta.
              </p>
              <div className="mt-8 flex flex-col gap-px bg-paper/15">
                {SUBLIMADOS.map((s) => (
                  <OpcionConImagen
                    key={s.key}
                    slot={s.slot}
                    title={s.title}
                    subtitle={s.description}
                    onClick={() => {
                      setSublimado(s.key);
                      setStep(3);
                    }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-6 font-sans text-[13px] font-medium text-paper/50 hover:text-paper"
              >
                ← Volver a la pregunta anterior
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="3"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-brand">
                Pregunta 03
              </span>
              <h2 className="mt-3 font-sans text-h2 font-medium text-paper">
                ¿Cómo se va a usar?
              </h2>
              <p className="mt-3 font-serif text-body-m text-paper/70">
                El uso define el tacto y el gramaje. Elige lo que más se
                acerca y afinamos la recomendación.
              </p>
              <div className="mt-8 flex flex-col gap-px bg-paper/15">
                {USOS.map((u) => (
                  <OpcionConImagen
                    key={u.key}
                    slot={u.slot}
                    title={u.title}
                    subtitle={u.description}
                    onClick={() => {
                      setUso(u.key);
                      setStep(4);
                    }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-6 font-sans text-[13px] font-medium text-paper/50 hover:text-paper"
              >
                ← Volver a la pregunta anterior
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="4"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-brand">
                Recomendación
              </span>
              <h2 className="mt-3 font-sans text-h2 font-medium text-paper">
                Estas telas encajan con lo que buscas.
              </h2>
              <p className="mt-3 font-serif text-body-m text-paper/70">{summary}</p>

              <div className="mt-8 grid grid-cols-1 gap-px bg-paper/15 sm:grid-cols-3">
                {results.map(({ category, sub }) => (
                  <div key={sub.slug} className="bg-brand-deep p-6">
                    <span className="font-mono text-xs uppercase tracking-widest text-paper/50">
                      Familia {category.name}
                    </span>
                    <h3 className="mt-3 font-sans text-[15px] font-semibold text-paper">
                      {sub.name}
                    </h3>
                    <p className="mt-2 font-serif text-[14px] text-paper/70">
                      {category.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-paper/15 pt-3.75">
                      <Link
                        href={
                          estadoFicha(sub.slug) === "sin-ficha"
                            ? `/productos/${category.slug}/${sub.slug}#en-preparacion`
                            : `/productos/${category.slug}/${sub.slug}`
                        }
                        className="font-sans text-[13px] font-medium text-paper hover:text-brand"
                      >
                        Ver ficha →
                      </Link>
                      <Link
                        href="/contacto"
                        className="font-sans text-[13px] font-medium text-paper/60 hover:text-brand"
                      >
                        Hablar →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-8 font-serif text-caption italic text-paper/60">
                Una recomendación no reemplaza el tacto. Pide muestra o habla
                con una persona antes de decidir la tirada.
              </p>

              <button
                type="button"
                onClick={reset}
                className={cn(
                  "mt-6 font-sans text-[15px] font-medium text-paper hover:text-brand",
                )}
              >
                ↻ Empezar de nuevo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
