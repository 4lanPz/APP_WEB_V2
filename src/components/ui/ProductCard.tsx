import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export interface ProductCardProps {
  href: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  /** Ej. "TP-240" */
  reference: string;
  /** Ej. ["320 g/m²", "Sarga peinada"] */
  specs: string[];
  description: string;
  className?: string;
}

/**
 * Card de producto/tono — reconstruida contra el patrón real de tile que
 * usan los exports (Categoria Microfibra, Subcategoria Dortmund Plus):
 * sin borde propio, pensada para vivir dentro de una "seam grid" (gap-px
 * bg-greige + borde exterior) que dibuja las hairlines entre celdas.
 * Motion v1 §05: la card no se mueve; solo la imagen hace zoom lento dentro
 * de su marco (scale 1→1.04, 500ms, curva revelar) y el borde pasa a grafito.
 */
export function ProductCard({
  href,
  imageSrc,
  imageAlt,
  title,
  reference,
  specs,
  description,
  className,
}: ProductCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col border border-transparent bg-paper text-ink transition-colors duration-500 ease-revelar hover:border-graphite",
        className,
      )}
    >
      <div className="relative h-[clamp(150px,18vh,190px)] w-full overflow-hidden bg-bone">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 ease-revelar group-hover:scale-[1.04]"
        />
      </div>
      <div className="p-[clamp(22px,2.2vw,30px)]">
        <div className="mb-3.5 flex items-baseline justify-between gap-3">
          <h3 className="font-sans text-[clamp(21px,1.9vw,26px)] font-medium tracking-[-0.01em]">
            {title}
          </h3>
          <span className="whitespace-nowrap font-mono text-[11px] text-accent">
            {reference}
          </span>
        </div>
        <p className="mb-4.5 font-mono text-[13px] text-graphite">
          {specs.join(" · ")}
        </p>
        <p className="mb-4.5 font-serif text-[15px] leading-[1.6] text-graphite">
          {description}
        </p>
        <div className="flex items-center justify-end gap-2.25 border-t border-greige pt-3.75">
          <span className="font-sans text-[13px] font-medium text-ink">
            Ver ficha técnica →
          </span>
        </div>
      </div>
    </Link>
  );
}
