import Link from "next/link";
import { cn } from "@/lib/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** dark = sobre hero oscuro (ancestros en paper/60, actual en paper). */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Migaja de pan — verificada contra Producto Dortmund Plus Blancos.dc.html:
 * mono 12px, +0.12em, ancestros en grafito con flecha greige, el actual en
 * tinta precedido de un cuadrado terracota de 6px.
 */
export function Breadcrumb({ items, tone = "light", className }: BreadcrumbProps) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.12em]",
        className,
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-3">
            {index > 0 && (
              <span className={dark ? "text-paper/30" : "text-greige"}>→</span>
            )}
            {isLast || !item.href ? (
              <span
                className={cn(
                  "flex items-center gap-2.5",
                  dark ? "text-paper" : "text-ink",
                )}
              >
                {isLast && (
                  <span className="block size-1.5 shrink-0 bg-accent" />
                )}
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "hover:text-brand",
                  dark ? "text-paper/60" : "text-graphite",
                )}
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
}
