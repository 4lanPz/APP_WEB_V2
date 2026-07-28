"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { categories } from "@/data/taxonomy";
import { estadoFicha } from "@/data/fichas";
import { foto } from "@/data/imagenes";
import { whatsappHref } from "@/data/whatsapp";
import { buttonVariants } from "./buttonVariants";
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
 * Superficie de las tarjetas de esta página —opciones y resultado.
 *
 * ANTES ERA `bg-brand-deep` Y NO SEPARABA. La página es `bg-ink` (#1c1917,
 * oscuro cálido) y `brand-deep` es #0d2937 (oscuro frío): 1,17:1 entre las dos
 * superficies, ΔL* ≈ 6,6. Luminosidad casi igual y temperatura opuesta, así que
 * el ojo no lee "dos planos", lee suciedad. `brand-deep` no está mal en sí —en
 * el resto del sitio es la banda oscura sobre página `paper` y ahí funciona—;
 * está mal CONTRA `ink`.
 *
 * AHORA: misma familia que el fondo y separación por claridad. Un velo de
 * `paper` sobre `ink` da rgb(67,64,62): 1,69:1 de superficie, ΔL* ≈ 18 —casi el
 * triple de salto. No hace falta un token nuevo; es el mismo recurso que ya usa
 * este componente para los huecos de imagen (`bg-paper/8`).
 *
 * EL TECHO LO PONE EL TEXTO, no el gusto. Con el secundario a `paper/70`,
 * subir el velo por encima de ~/26 tira ese texto por debajo de 4,5:1. /18 base
 * y /24 en hover dejan 5,52:1 y 4,69:1. No subir sin volver a medir.
 *
 * OJO CON EL APILADO: al ser translúcidas, las tarjetas componen con lo que
 * tengan detrás. Las rejillas `gap-px` de esta página van SIN `bg-paper/15`
 * justamente por eso —la línea de separación ahora es el fondo `ink` que se ve
 * por el hueco, no un filete claro encima de la tarjeta.
 */
const TARJETA = "bg-paper/18";
const TARJETA_HOVER = "hover:bg-paper/24";

/**
 * Opción del cuestionario con miniatura. La imagen es de tamaño FIJO y va a la
 * izquierda: no le quita tamaño al área pulsable —la aumenta, toda la fila es
 * el botón— ni encoge el texto, que conserva su tamaño y contraste. Sin foto,
 * el hueco queda como plano de tinta con un punto de marca: se lee como parte
 * del diseño, no como imagen rota.
 *
 * SUPERFICIE: ver `TARJETA` arriba. El hover sube el mismo velo en vez de
 * cambiar de color: el estado es "más claro", no "otro tono".
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
      className={cn(
        "group flex items-center gap-4 p-4 text-left transition-colors duration-220 ease-asentar sm:p-5",
        TARJETA,
        TARJETA_HOVER,
      )}
    >
      {/* El hueco va MÁS OSCURO que la tarjeta, no más claro como antes: sobre
          una tarjeta ya levantada, un cuadro aún más claro añadía un tercer
          plano. En tinta se lee como agujero, que es lo que es. */}
      <span className="relative block size-16 shrink-0 overflow-hidden bg-ink/40 sm:size-18">
        {f ? (
          <Image src={f.ruta} alt="" fill sizes="72px" className="object-cover" />
        ) : (
          <span aria-hidden className="absolute inset-0 flex items-center justify-center">
            <span className="block size-2 bg-brand/70" />
          </span>
        )}
      </span>
      <span className="min-w-0">
        <span className="block font-sans text-body-s font-semibold text-paper">
          {title}
        </span>
        {/*
         * Ambos subtítulos a /70 y no a /50 y /60 como antes. Sobre la tarjeta
         * nueva —más clara que `brand-deep`— /50 caía a 3,x:1 y /60 a 4,3:1.
         * A /70 son 5,52:1 en reposo y 4,69:1 con el hover levantado. De paso
         * arregla el /50 mono, que ya venía fallando por poco (4,46:1) sobre
         * `brand-deep`. La jerarquía la marcan la fuente y la caja alta, no la
         * opacidad.
         */}
        <span
          className={cn(
            "mt-1 block text-paper/70",
            subtitleMono
              ? "font-mono text-label uppercase"
              : "font-serif text-body-s",
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

/** "Dortmund Plus, Athletic y Titanium" — enumeración en español, con "y". */
function enumerar(nombres: string[]) {
  if (nombres.length === 0) return "";
  if (nombres.length === 1) return nombres[0];
  return `${nombres.slice(0, -1).join(", ")} y ${nombres[nombres.length - 1]}`;
}

/**
 * Mensaje que llega ya escrito en WhatsApp al pulsar el cierre del resultado.
 *
 * Va PRECARGADO con las telas recomendadas para que el asesor no tenga que
 * preguntar de qué le hablan. Los nombres salen de `taxonomy.ts` (`sub.name`),
 * no escritos a mano: si una tela se renombra, el mensaje la sigue.
 *
 * Se queda corto a propósito —solo nombres, sin gramajes ni descripciones—
 * porque viaja en la query de la URL. Si `buildResults` no devolvió ninguna
 * tela (un slug renombrado que ya no resuelve), cae al mensaje genérico en vez
 * de mandar una frase con el hueco vacío.
 */
function mensajeAsesor(nombres: string[]) {
  const lista = enumerar(nombres);
  return lista
    ? `Hola, usé el asesor virtual y me recomendó ${lista}. Quisiera más información.`
    : undefined;
}

export function AsesorWizard() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [producto, setProducto] = useState<Producto | null>(null);
  const [sublimado, setSublimado] = useState<Sublimado | null>(null);
  const [uso, setUso] = useState<Uso | null>(null);
  const reduceMotion = useReducedMotion();

  const progress = { 1: 25, 2: 50, 3: 75, 4: 100 }[step];

  const results = useMemo(() => buildResults(uso ?? "casual"), [uso]);

  /** Mensaje precargado del cierre, con los nombres de las telas de arriba. */
  const mensajeWhatsApp = useMemo(
    () => mensajeAsesor(results.map(({ sub }) => sub.name)),
    [results],
  );

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
    <div className="mx-auto max-w-4xl">
      {/*
       * Indicador de pasos. A 375 la fila completa con flechas partía en dos
       * líneas y dejaba "→ Resultado" colgando solo, así que por debajo de `sm`
       * se sustituye por un contador. No es un rótulo distinto: es el mismo
       * dato en el ancho que cabe.
       */}
      <p className="text-center font-mono text-label uppercase text-paper/60 sm:hidden">
        {step < 4 ? `Paso 0${step} de 03` : "Resultado"}
      </p>
      <div className="hidden flex-wrap items-center justify-center gap-3 font-mono text-label uppercase sm:flex">
        {(["1", "2", "3", "4"] as const).map((key, i) => {
          const labels = ["01 Prenda", "02 Sublimado", "03 Uso", "Resultado"];
          const stepNum = i + 1;
          return (
            <span key={key} className="flex items-center gap-3">
              {/* Decorativa de verdad: no dice nada que no diga el orden de
                  lectura, y a `paper/20` da 1,81:1 —no llegaría nunca a 4,5
                  sin competir con las etiquetas. Marcada como tal en vez de
                  inflada, y de paso el lector de pantalla deja de leer
                  "flecha" entre cada paso. */}
              {i > 0 && <span aria-hidden className="text-paper/20">→</span>}
              {/* /50 y no /40: sobre la banda de tinta plana, paper/40 da
                  3,54:1 y un paso todavía por responder es información, no
                  adorno. A /50 son 4,80:1. */}
              <span className={stepNum <= step ? "text-brand" : "text-paper/50"}>
                {labels[i]}
              </span>
            </span>
          );
        })}
      </div>
      <div className="mx-auto mb-12 mt-5 h-0.5 w-full max-w-sm origin-left bg-paper/15">
        <motion.div
          className="h-0.5 origin-left bg-brand"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE_ASENTAR }}
        />
      </div>

      <motion.div layout className="text-center">
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 && (
            <motion.div
              key="1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="mx-auto max-w-2xl"
            >
              <span className="font-mono text-label uppercase text-brand">
                Pregunta 01
              </span>
              <h2 className="mt-3 font-sans text-h2 font-medium text-paper">
                ¿Qué prenda vas a producir?
              </h2>
              <p className="mx-auto mt-3 max-w-md font-serif text-body-m text-paper/70">
                Partamos de la prenda. Define desde dónde miramos la tela.
              </p>
              {/* `gap-px` sin `bg-paper/15`: la tarjeta es translúcida y el
                  filete claro se le colaba por debajo. El hueco enseña el
                  `ink` de la página y esa línea oscura ya separa. */}
              <div className="mt-8 grid grid-cols-1 gap-px sm:grid-cols-2">
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
              className="mx-auto max-w-2xl"
            >
              <span className="font-mono text-label uppercase text-brand">
                Pregunta 02
              </span>
              <h2 className="mt-3 font-sans text-h2 font-medium text-paper">
                ¿La tela irá sublimada?
              </h2>
              <p className="mx-auto mt-3 max-w-md font-serif text-body-m text-paper/70">
                La sublimación pide una base clara y con presencia de
                poliéster. Saberlo ahora acota la carta.
              </p>
              <div className="mt-8 flex flex-col gap-px">
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
                className="mt-6 font-sans text-caption font-medium text-paper/50 hover:text-paper"
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
              className="mx-auto max-w-2xl"
            >
              <span className="font-mono text-label uppercase text-brand">
                Pregunta 03
              </span>
              <h2 className="mt-3 font-sans text-h2 font-medium text-paper">
                ¿Cómo se va a usar?
              </h2>
              <p className="mx-auto mt-3 max-w-md font-serif text-body-m text-paper/70">
                El uso define el tacto y el gramaje. Elige lo que más se
                acerca y afinamos la recomendación.
              </p>
              <div className="mt-8 flex flex-col gap-px">
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
                className="mt-6 font-sans text-caption font-medium text-paper/50 hover:text-paper"
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
              <span className="font-mono text-label uppercase text-brand">
                Recomendación
              </span>
              <h2 className="mt-3 font-sans text-h2 font-medium text-paper">
                Estas telas encajan con lo que buscas.
              </h2>
              <p className="mx-auto mt-3 max-w-lg font-serif text-body-m text-paper/70">
                {summary}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-px text-left sm:grid-cols-3">
                {results.map(({ category, sub }) => (
                  <div key={sub.slug} className={cn("p-6", TARJETA)}>
                    <span className="font-mono text-label uppercase text-paper/70">
                      Familia {category.name}
                    </span>
                    <h3 className="mt-3 font-sans text-body-s font-semibold text-paper">
                      {sub.name}
                    </h3>
                    <p className="mt-2 font-serif text-mono text-paper/70">
                      {category.description}
                    </p>
                    {/*
                     * NINGUNO DE LOS DOS VUELVE A `hover:text-brand`. Sobre la
                     * tarjeta aclarada, `#33a2dc` da 3,67:1 y necesita 4,5 a
                     * 13px: el azul de marca solo es legible sobre planos casi
                     * negros —es el mismo límite que obligó a quitarlo del
                     * titular del hero. En vez de bajar el velo hasta que quepa
                     * el azul (haría falta ~/11 y volveríamos al fondo turbio),
                     * el estado se marca como ya lo marca el resto de enlaces
                     * sobre oscuro en el sitio: subiendo a `paper` (Footer,
                     * AsesorComercial, los "← Volver" de aquí mismo). El
                     * primario, que ya está a `paper` y no tiene a dónde subir,
                     * se subraya.
                     */}
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-paper/15 pt-3.75">
                      <Link
                        href={
                          estadoFicha(sub.slug) === "sin-ficha"
                            ? `/productos/${category.slug}/${sub.slug}#en-preparacion`
                            : `/productos/${category.slug}/${sub.slug}`
                        }
                        className="font-sans text-caption font-medium text-paper hover:underline hover:underline-offset-4"
                      >
                        Ver ficha →
                      </Link>
                      <Link
                        href="/contacto"
                        className="font-sans text-caption font-medium text-paper/70 hover:text-paper"
                      >
                        Hablar →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mx-auto mt-8 max-w-md font-serif text-caption italic text-paper/60">
                Una recomendación no reemplaza el tacto. Pide muestra o habla
                con una persona antes de decidir la tirada.
              </p>

              {/*
               * CIERRE. Este bloque —la identidad del asesor y el "no es un
               * chat que da vueltas"— estaba ARRIBA, junto a la primera
               * pregunta, donde describía lo que la persona ya estaba a punto
               * de hacer. Aquí sí tiene trabajo: ya hay tres telas concretas
               * sobre la mesa y la conversación tiene asunto.
               *
               * Vive dentro del `motion.div` del paso 4, así que entra con el
               * gesto que ya tiene el wizard: no añade movimiento nuevo, y
               * `prefers-reduced-motion` lo sigue resolviendo el `MotionConfig`
               * de la raíz.
               */}
              <div className="mt-14 border-t border-paper/15 pt-10">
                <p className="font-mono text-label uppercase text-paper/50">
                  Asesor Textil Padilla
                </p>
                <h3 className="mx-auto mt-3 max-w-lg text-balance font-sans text-h2 font-medium text-paper">
                  ¿Quieres hablar de estas telas con un asesor?
                </h3>
                <p className="mx-auto mt-4 max-w-md text-pretty font-serif text-body-m text-paper/80">
                  No es un chat que da vueltas. Estas tres salieron de tus
                  respuestas; un asesor las confirma contra tu tirada, tu color
                  y tu plazo —sobre telas que tejemos y teñimos de verdad.
                </p>

                <div className="mt-8">
                  <a
                    href={whatsappHref(mensajeWhatsApp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: "whatsapp" })}
                  >
                    Escribir por WhatsApp →
                  </a>
                </div>

                {/* /50 y no el /40 que traía del bloque original: sobre tinta
                    plana /40 se queda en 3,54:1. A /50 son 4,80:1. */}
                <p className="mt-8 font-mono text-label uppercase text-paper/50">
                  Seleccionamos · Tejemos · Teñimos
                  <br />
                  Quito · Guayaquil · Cuenca
                </p>
              </div>

              <button
                type="button"
                onClick={reset}
                className={cn(
                  buttonVariants({ variant: "enlace" }), "mt-10",
                )}
              >
                ↻ Empezar de nuevo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
