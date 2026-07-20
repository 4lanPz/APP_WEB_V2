import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/Reveal";

export interface SectionHeaderProps {
  index: string;
  title: string;
  tag?: string;
  /** dark = sobre fondo azul profundo (índice en azul, hairline en paper/25). */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Cabecera numerada reutilizada en casi todas las secciones de los exports:
 * índice mono + h2 + etiqueta derecha, sobre una hairline.
 * Motion v1 §03/§08: el título revela (fade+rise); la hairline no se anima.
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
      <Reveal className="flex items-baseline gap-5">
        <span className={cn("font-mono text-mono", dark ? "text-brand" : "text-accent")}>
          {index}
        </span>
        <h2
          className={cn(
            "font-sans text-h2 font-medium tracking-[-0.01em]",
            dark ? "text-paper" : "text-ink",
          )}
        >
          {title}
        </h2>
        {tag && (
          <span
            className={cn(
              "ml-auto whitespace-nowrap font-mono text-xs uppercase tracking-widest",
              dark ? "text-paper/60" : "text-graphite",
            )}
          >
            {tag}
          </span>
        )}
      </Reveal>
    </div>
  );
}
