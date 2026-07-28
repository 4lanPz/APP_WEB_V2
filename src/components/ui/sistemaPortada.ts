import { cn } from "@/lib/cn";

/**
 * EL SISTEMA DE BOTONES, APLICADO — SOLO EN LA PORTADA (`/`).
 *
 * Las clases de `/styleguide/_sistema/variantes.ts` son ESTÁTICAS a propósito
 * (allí hay que pintar reposo, hover, foco e inhabilitado uno al lado de otro).
 * Aquí van con sus pseudo-clases reales, que es lo que necesita un botón vivo.
 * Mientras la propuesta esté a prueba, las dos fuentes conviven: la styleguide
 * sigue midiendo, esto se pinta. Cuando se cierre, `buttonVariants.ts` pasa a
 * leer de aquí y el resto del sitio viene detrás.
 *
 * OPCIÓN B — el relleno marca COMPROMISO, no jerarquía. En la portada eso deja
 * exactamente un relleno legítimo: WhatsApp (se sale a una conversación). Toda
 * la navegación —hero incluido— va en contorno.
 *
 * Las tres decisiones abiertas NO se resuelven aquí: entran por parámetro desde
 * `src/app/page.tsx`, que es el único sitio donde hay que tocar un valor.
 */

/** Común a todo botón con caja. Igual que `BASE` en la styleguide. */
const BASE =
  "inline-flex items-center justify-center gap-2.25 whitespace-nowrap rounded-sm " +
  "font-sans text-base font-medium transition-[background-color,border-color,color,transform] " +
  "duration-220 ease-asentar";

const CAJA = "h-12 px-7.5 border";

/**
 * El anillo de foco no puede seguir en `outline-brand`: sobre `paper` da 2,53:1
 * y el mínimo no textual es 3:1. Tinta en claro, papel en oscuro — 15,67:1 los
 * dos, y funcionan sobre cualquiera de las dos superficies.
 */
const FOCO_CLARO =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
const FOCO_OSCURO =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper";

/** Verbo "asentar" del documento de motion: el botón se levanta 2px. */
const ELEVA = "hover:-translate-y-0.5";

/**
 * CONTORNO · claro — el caballo de batalla sobre `paper`/`bone`.
 * Borde `graphite` y no `greige`: en un botón sin relleno el borde ES el botón,
 * y greige contra paper da 1,59:1. Con graphite, 5,15:1.
 */
export const CONTORNO_CLARO = cn(
  BASE,
  CAJA,
  "border-graphite text-ink hover:border-ink hover:bg-bone",
  ELEVA,
  FOCO_CLARO,
);

/**
 * CONTORNO · oscuro — la versión que hoy NO EXISTE. `secondary` es `text-ink` y
 * sobre tinta da 1:1; por eso todos los heroes acababan tirando del azul.
 */
export const CONTORNO_OSCURO = cn(
  BASE,
  CAJA,
  "border-paper/50 text-paper hover:border-paper hover:bg-paper/10",
  ELEVA,
  FOCO_OSCURO,
);

/**
 * ENLACE · claro — terciario, dentro del flujo de lectura. Absorbe el `ghost` y
 * los enlaces de texto escritos a mano que hacen de CTA. El hover NO vuelve a
 * `text-brand` (2,53:1 sobre claro): se marca con el subrayado, que ya era el
 * gesto del ghost.
 */
export const ENLACE_CLARO = cn(
  "inline-flex items-center gap-2.25 whitespace-nowrap rounded-none border-b border-transparent",
  "px-0.5 py-1.5 font-sans text-body-s font-medium text-ink",
  "transition-[border-color,color] duration-220 ease-asentar hover:border-ink",
  FOCO_CLARO,
);

/*
 * WHATSAPP — opción 3 de la styleguide §B: #008069 con glifo BLANCO.
 *
 * El verde y el glifo son de WhatsApp, marca ajena: no entran en globals.css.
 * Misma decisión (y mismo motivo) que ya documenta `BotonWhatsApp.tsx`.
 *
 *   #008069  blanco 4,89:1 · vs paper 4,38:1 · vs ink 3,57:1 — cabecera de
 *            WhatsApp Web y Business. El único de los siete medidos que pasa
 *            las cuatro condiciones a la vez.
 *   #075E54  blanco 7,67:1 · vs paper 6,87:1 — Teal Green Dark, paleta clásica.
 *            Sirve de hover: es más profundo y sigue siendo suyo.
 *
 * Sin filete en claro: 4,38:1 contra `paper` ya separa la caja de la página.
 * Era justo la hipótesis que había que confirmar y se confirmó.
 */
// eslint-disable-next-line no-restricted-syntax -- teal de cabecera de WhatsApp Web, marca ajena
const VERDE = "bg-[#008069]";
// eslint-disable-next-line no-restricted-syntax -- Teal Green Dark de WhatsApp, marca ajena
const VERDE_HOVER = "hover:bg-[#075E54]";

/**
 * WHATSAPP · claro — la única variante nueva de verdad. El glifo va en blanco
 * (`text-white`, no `paper`): los 4,89:1 se midieron contra blanco puro, y es
 * color de marca ajena, no de nuestra paleta.
 */
export const WHATSAPP_CLARO = cn(
  BASE,
  CAJA,
  "border-transparent text-white",
  VERDE,
  VERDE_HOVER,
  ELEVA,
  FOCO_CLARO,
);

export interface DecisionesSolida {
  /** §1 — filete de tinta alrededor del relleno. */
  filete: boolean;
  /** §2 — el hover invierte la polaridad (fondo oscuro, texto claro). */
  hoverInvierte: boolean;
  /** §3 — relleno de tinta en vez de azul de marca (styleguide §E). */
  tinta: boolean;
}

/**
 * SÓLIDA · clara — la acción con más peso. Texto OSCURO sobre el relleno: el
 * azul de marca es un color claro y sobre él `text-paper` da 2,56:1 mientras
 * que `text-ink` da 6,11:1.
 *
 * Las tres decisiones abiertas se resuelven desde `src/app/page.tsx`; lo que
 * hace cada una está documentado allí. Aquí solo se traducen a clases:
 *
 *  - `filete`        borde de tinta sí/no. En `tinta: true` es indistinguible:
 *                    el borde y el relleno son el mismo color.
 *  - `hoverInvierte` sí → el fondo se va a oscuro y el texto a claro.
 *                    no → el relleno se mantiene claro y solo se aclara/oscurece
 *                    un paso; el texto no cambia de polaridad. Como el filete
 *                    puede estar apagado, la inversión se trae el borde de tinta
 *                    consigo o el botón se quedaría sin límite en pleno hover.
 *  - `tinta`         relleno `ink` + texto `paper` en vez de `brand` + `ink`.
 */
export function solidaClara({ filete, hoverInvierte, tinta }: DecisionesSolida) {
  const relleno = tinta ? "bg-ink text-paper" : "bg-brand text-ink";
  const borde = filete ? "border-ink" : "border-transparent";
  const hover = tinta
    ? hoverInvierte
      ? "hover:border-ink hover:bg-paper hover:text-ink"
      : "hover:bg-ink/85"
    : hoverInvierte
      ? "hover:bg-brand-deep hover:text-paper"
      : "hover:bg-brand/80";

  return cn(BASE, CAJA, borde, relleno, hover, ELEVA, FOCO_CLARO);
}
