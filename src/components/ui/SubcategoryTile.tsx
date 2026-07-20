import Link from "next/link";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { cn } from "@/lib/cn";
import type { EstadoFicha } from "@/data/fichas";
import type { Foto } from "@/data/imagenes";

export interface SubcategoryTileProps {
  href: string;
  index: string;
  title: string;
  description?: string;
  /**
   * Tres estados, no dos. "preliminar" existe porque hay telas con ficha cuyos
   * datos numéricos están bloqueados por incidencias del cliente: anunciarlas
   * como "Ficha disponible" y que al abrirlas todo diga "Pendiente de
   * confirmar" es exactamente la señal falsa que hay que evitar.
   */
  estado: EstadoFicha;
  /** Foto real de la tela, si se sabe con certeza cuál es. */
  foto?: Foto;
  /** Color plano de fondo — para tiles de tono (color real, no foto). */
  swatchColor?: string;
  className?: string;
}

const ETIQUETA: Record<EstadoFicha, { estado: string; accion: string; tono: string }> = {
  publicada: {
    estado: "Ficha disponible",
    accion: "Ver ficha →",
    tono: "text-brand",
  },
  preliminar: {
    estado: "Ficha preliminar",
    accion: "Ver ficha →",
    tono: "text-accent",
  },
  "sin-ficha": {
    estado: "En preparación",
    accion: "Próximamente →",
    tono: "text-graphite",
  },
};

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
  estado,
  foto,
  swatchColor,
  className,
}: SubcategoryTileProps) {
  const etiqueta = ETIQUETA[estado];

  return (
    <Link
      href={href}
      title={estado === "sin-ficha" ? "Página en preparación" : undefined}
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
          src={foto?.ruta}
          alt={foto?.alt ?? ""}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
              etiqueta.tono,
            )}
          >
            {etiqueta.estado}
          </span>
          <span className="font-sans text-[13px] font-medium text-ink">
            {etiqueta.accion}
          </span>
        </div>
      </div>
    </Link>
  );
}
