import Link from "next/link";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { cn } from "@/lib/cn";

export interface SubcategoryTileProps {
  href: string;
  index: string;
  title: string;
  description?: string;
  available: boolean;
  /** Color plano de fondo — para tiles de tono (color real, no foto). */
  swatchColor?: string;
  className?: string;
}

/**
 * Tile de subcategoría/tono — patrón verificado en Categoria Microfibra
 * ("Las subcategorías") y Subcategoria Dortmund Plus ("Tonos disponibles"):
 * imagen/color arriba, título + índice, descripción, pie con hairline
 * (estado + link). Sin borde propio: vive en una seam grid.
 */
export function SubcategoryTile({
  href,
  index,
  title,
  description,
  available,
  swatchColor,
  className,
}: SubcategoryTileProps) {
  return (
    <Link
      href={href}
      title={!available ? "Página en preparación" : undefined}
      className={cn(
        "group flex flex-col border border-transparent bg-paper text-ink transition-colors duration-500 ease-revelar hover:border-graphite",
        className,
      )}
    >
      {swatchColor ? (
        <div
          className="h-[clamp(150px,18vh,190px)] w-full"
          style={{ backgroundColor: swatchColor }}
        />
      ) : (
        <ImagePlaceholder
          zoomOnGroupHover
          className="h-[clamp(150px,18vh,190px)] w-full"
        />
      )}
      <div className="p-[clamp(22px,2.2vw,30px)]">
        <div className="mb-3.5 flex items-baseline justify-between gap-3">
          <h3 className="font-sans text-[clamp(21px,1.9vw,26px)] font-medium tracking-[-0.01em]">
            {title}
          </h3>
          <span className="whitespace-nowrap font-mono text-[11px] text-accent">
            {index}
          </span>
        </div>
        {description && (
          <p className="mb-4.5 max-w-[40ch] font-serif text-[15px] leading-normal text-graphite">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between gap-3 border-t border-greige pt-3.75">
          <span
            className={cn(
              "font-mono text-xs uppercase tracking-widest",
              available ? "text-brand" : "text-graphite",
            )}
          >
            {available ? "Ficha disponible" : "En preparación"}
          </span>
          <span className="font-sans text-[13px] font-medium text-ink">
            {available ? "Ver ficha →" : "Próximamente →"}
          </span>
        </div>
      </div>
    </Link>
  );
}
