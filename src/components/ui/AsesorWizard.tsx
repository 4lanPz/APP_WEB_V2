"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { categories } from "@/data/taxonomy";
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

const PRODUCTOS: { key: Producto; title: string; sublabel: string }[] = [
  { key: "camiseta", title: "Camiseta", sublabel: "punto / jersey" },
  { key: "chompa", title: "Chompa / buzo", sublabel: "peso medio" },
  { key: "pantalon", title: "Pantalón deportivo", sublabel: "movilidad / secado" },
  { key: "otro", title: "Otro", sublabel: "lo vemos con el asesor" },
];

const SUBLIMADOS: { key: Sublimado; title: string; description: string }[] = [
  { key: "si", title: "Sí, lleva sublimación", description: "Estampado full-print sobre base clara." },
  { key: "no", title: "No, color liso o teñido", description: "Tono sólido, teñido a demanda." },
];

const USOS: { key: Uso; title: string; description: string }[] = [
  {
    key: "rendimiento",
    title: "Deportivo de alto rendimiento",
    description: "Seca rápido, aguanta el gesto, no pesa.",
  },
  {
    key: "casual",
    title: "Casual, día a día",
    description: "Mano suave, caída natural, básicos de retail.",
  },
  {
    key: "uniforme",
    title: "Uniforme corporativo",
    description: "Color estable, resistente al lavado frecuente.",
  },
];

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
 * Recomendación por uso, con telas REALES del catálogo (taxonomy.ts) — no
 * los nombres viejos del mockup (Melisa/Austria/Aruba/Doble Face) que no
 * existen en el Excel de productos.
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

function buildResults(uso: Uso) {
  return RECOMMENDATION_SLUGS[uso].map(({ category: categorySlug, subcategory: subSlug }) => {
    const category = categories.find((c) => c.slug === categorySlug)!;
    const sub = category.subcategories.find((s) => s.slug === subSlug)!;
    return { category, sub };
  });
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
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => {
                      setProducto(p.key);
                      setStep(2);
                    }}
                    className="bg-brand-deep p-6 text-left hover:bg-paper/5"
                  >
                    <p className="font-sans text-[15px] font-semibold text-paper">
                      {p.title}
                    </p>
                    <p className="mt-1 font-mono text-xs uppercase tracking-widest text-paper/50">
                      {p.sublabel}
                    </p>
                  </button>
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
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => {
                      setSublimado(s.key);
                      setStep(3);
                    }}
                    className="bg-brand-deep p-6 text-left hover:bg-paper/5"
                  >
                    <p className="font-sans text-[15px] font-semibold text-paper">
                      {s.title}
                    </p>
                    <p className="mt-1 font-serif text-[15px] text-paper/60">
                      {s.description}
                    </p>
                  </button>
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
                  <button
                    key={u.key}
                    type="button"
                    onClick={() => {
                      setUso(u.key);
                      setStep(4);
                    }}
                    className="bg-brand-deep p-6 text-left hover:bg-paper/5"
                  >
                    <p className="font-sans text-[15px] font-semibold text-paper">
                      {u.title}
                    </p>
                    <p className="mt-1 font-serif text-[15px] text-paper/60">
                      {u.description}
                    </p>
                  </button>
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
                          sub.available
                            ? `/productos/${category.slug}/${sub.slug}`
                            : `/productos/${category.slug}/${sub.slug}#en-preparacion`
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
