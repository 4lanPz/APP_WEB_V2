import { cn } from "@/lib/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Azul solo para estado activo — Design System v1.1 §04. */
  active?: boolean;
}

/**
 * Badge / etiqueta técnica. Ej.: "320 g/m²" · "Algodón 100%" · "Sarga 3/1" ·
 * "Teñido a demanda". Tamaño 11px alineado a la escala mono micro que usan
 * los exports (tp-megacount, tp-flabel) en vez del token Label de 12px.
 */
export function Badge({ className, active = false, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2.5 py-1 font-mono text-xs uppercase tracking-widest",
        active ? "border-brand text-brand" : "border-greige text-graphite",
        className,
      )}
      {...props}
    />
  );
}
