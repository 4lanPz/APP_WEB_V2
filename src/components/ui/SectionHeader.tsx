import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/Reveal";
import { LineasEnMascara } from "@/components/motion/LineasEnMascara";
import { MASCARA } from "@/lib/motion";

export interface SectionHeaderProps {
  index: string;
  title: string;
  tag?: string;
  /** dark = sobre fondo azul profundo (índice en azul, hairline en paper/25). */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Cabecera numerada reutilizada en casi todas las secciones: índice mono + h2
 * + etiqueta derecha, sobre una hairline.
 *
 * El título va por MÁSCARA, no por fade: se destapa subiendo desde debajo del
 * recorte (`LineasEnMascara`). El índice y la etiqueta entran detrás, solo con
 * opacidad, para que el titular lidere y no se muevan tres cosas a la vez. La
 * hairline no se anima. Ver `MOTION.md`.
 */
export function SectionHeader({
  index,
  title,
  tag,
  tone = "light",
  className,
}: SectionHeaderProps) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "mb-10 border-b pb-5",
        dark ? "border-paper/25" : "border-ink",
        className,
      )}
    >
      {/*
        `flex-wrap`: la etiqueta baja a su propia línea bajo 640px. Lleva
        `whitespace-nowrap`, así que compartiendo fila con un título largo le
        robaba el ancho y desbordaba el viewport a 375 (p. ej. "Las
        subcategorías" + "20 construcciones"). Desde 640 vuelve a la derecha en
        la misma línea de base, que es la cabecera de siempre.
      */}
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <Reveal tipo="etiqueta">
          <span className={cn("font-mono text-mono", dark ? "text-brand" : "text-accent")}>
            {index}
          </span>
        </Reveal>
        <LineasEnMascara
          as="h2"
          lineas={[title]}
          className={cn(
            "font-sans text-h2 font-medium tracking-[-0.01em]",
            dark ? "text-paper" : "text-ink",
          )}
        />
        {tag && (
          <Reveal tipo="etiqueta" delay={MASCARA.stagger * 2} className="w-full sm:ml-auto sm:w-auto">
            <span
              className={cn(
                "whitespace-nowrap font-mono text-xs uppercase tracking-widest",
                dark ? "text-paper/60" : "text-graphite",
              )}
            >
              {tag}
            </span>
          </Reveal>
        )}
      </div>
    </div>
  );
}
