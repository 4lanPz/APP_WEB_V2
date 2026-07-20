import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export interface CategoryCardProps {
  href: string;
  /** Posición en la grilla — se formatea como "01". */
  index: number;
  title: string;
  description: string;
  /** Fotografía real (Fase 2). Sin ella, se usa la textura "en preparación". */
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

/**
 * Card de familia de producto — reconstruida contra la grilla "03 Categorías"
 * de Productos.dc.html: tile de fondo oscuro con foto (o textura placeholder
 * "en preparación") + velo degradado, índice mono azul arriba, título +
 * descripción abajo. Sin borde propio: vive en una "seam grid" (gap-px
 * bg-greige + borde exterior), igual que ProductCard.
 *
 * Motion v1 §05: velo tinta se desliza desde abajo (opacity 0→1, 400ms) y
 * la flecha avanza (translateX +6px, asentar) al pasar el cursor. La card
 * no se mueve. El enlace "Ver más →" es una adición mínima: el export no
 * lo mostraba en estas 4 tiles, pero la interacción documentada requiere
 * un elemento que "avance" — se interpreta como necesario para cumplirla.
 */
export function CategoryCard({
  href,
  index,
  title,
  description,
  imageSrc,
  imageAlt,
  className,
}: CategoryCardProps) {
  const indexLabel = String(index).padStart(2, "0");

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex min-h-75 flex-col justify-between overflow-hidden bg-brand-deep p-7.5 text-paper",
        className,
      )}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt ?? ""}
          fill
          className="object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(245,242,238,0.05) 0 3px, transparent 3px 8px), radial-gradient(120% 120% at 25% 20%, #14333f 0%, #0D2937 60%, #091d27 100%)",
          }}
        />
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(9,20,25,0.15) 0%, rgba(9,20,25,0.78) 100%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-ink opacity-0 transition-[opacity,transform] duration-400 ease-asentar group-hover:scale-y-100 group-hover:opacity-45"
      />

      <span className="relative font-mono text-xs tracking-widest text-brand">
        {indexLabel}
      </span>
      <div className="relative">
        <h3 className="mb-2 font-sans text-[28px] font-medium tracking-[-0.01em] text-paper">
          {title}
        </h3>
        <p className="font-serif text-[15px] leading-normal text-greige">
          {description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-brand">
          Ver más
          <span className="inline-block transition-transform duration-220 ease-asentar group-hover:translate-x-1.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
