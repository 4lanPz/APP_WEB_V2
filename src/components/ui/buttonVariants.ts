import { cva, type VariantProps } from "class-variance-authority";

/**
 * Design System v1.1 §04 — Botones. Motion Architecture v1 §05 — verbo
 * "asentar" (220ms, curva 0.40,0,0.20,1) para las tres variantes:
 *
 * - Primario: bg azul→azul profundo + eleva 2px.
 * - Secundario: el doc de motion completa la interacción del design system
 *   ("hover: borde pasa a azul") con un tratamiento distinto — "el borde y
 *   el texto pasan a tinta; el fondo, a hueso" — que solo tiene sentido si
 *   el reposo NO es ya tinta. Se interpreta borde de reposo greige (no
 *   tinta) para que la transición a tinta sea real; ver informe de fase.
 * - Ghost: no está en la tabla de micro-interacciones — se le aplica el
 *   mismo timing "asentar" por consistencia, sin inventar un nuevo gesto.
 *
 * Vive fuera de `Button.tsx` (que es "use client" por el gesto magnético)
 * porque varias páginas Server Component la llaman directamente sobre un
 * `<Link>` en vez de renderizar `<Button>` — una función pura de un
 * archivo cliente no se puede invocar desde el servidor.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-sans text-base font-medium transition-[background-color,border-color,color,transform] duration-220 ease-asentar focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-40 rounded-sm",
  {
    variants: {
      variant: {
        primary:
          "h-12 bg-brand px-7.5 text-paper hover:-translate-y-0.5 hover:bg-brand-deep",
        secondary:
          "h-12 border border-greige px-7.5 text-ink hover:border-ink hover:bg-bone",
        ghost:
          "gap-2.25 border-b border-transparent px-0.5 py-1.5 text-[15px] text-ink hover:border-ink rounded-none",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
