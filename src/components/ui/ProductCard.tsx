import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export interface ProductCardProps {
  href: string;
  /**
   * Obligatoria y sin rama de hueco a propósito: hoy este componente solo vive
   * en el styleguide, que le pasa `/placeholder-rollo.svg`, un asset de muestra
   * explícito. Por eso no le falta ninguna foto y no tiene slot.
   *
   * SI ALGÚN DÍA ENTRA EN UNA PÁGINA REAL, no basta con pasarle una ruta: hay
   * que registrar su hueco en `slots-imagen.ts` y dibujarlo con
   * `ImagePlaceholder`, como el resto. La regla del sitio es que un sitio donde
   * va a haber foto y no la hay se ve marcado; un `<Image>` con una ruta puesta
   * a mano no se ve marcado, no sale en el inventario y por tanto nadie le pide
   * esa foto a marketing. Es exactamente lo que pasó con `CategoryCard`.
   */
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
        "group relative flex flex-col border border-transparent bg-paper text-ink",
        className,
      )}
    >
      {/*
        Filete de hover como capa con opacidad, no como `border-color` que
        transiciona — misma corrección y mismo motivo que en `SubcategoryTile`,
        donde está la explicación larga y las cifras (`docs/rendimiento-cards.md`).

        Esta card solo se ve hoy en `/styleguide`, así que su coste no salía en
        la medición. Se cambia igual y a propósito: el styleguide es el sitio del
        que se copia, y una copia con el defecto dentro es cómo volvería a
        entrar en una página real.
      */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px border border-graphite opacity-0 transition-opacity duration-500 ease-revelar group-hover:opacity-100"
      />
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
          {/* eslint-disable-next-line no-restricted-syntax -- título de card fluido: escala propia del componente, no editorial (fase 3) */}
          <h3 className="font-sans text-[clamp(21px,1.9vw,26px)] font-medium tracking-[-0.01em]">
            {title}
          </h3>
          <span className="whitespace-nowrap font-mono text-micro text-accent">
            {reference}
          </span>
        </div>
        <p className="mb-4.5 font-mono text-caption text-graphite">
          {specs.join(" · ")}
        </p>
        <p className="mb-4.5 font-serif text-body-s leading-[1.6] text-graphite">
          {description}
        </p>
        <div className="flex items-center justify-end gap-2.25 border-t border-greige pt-3.75">
          <span className="font-sans text-caption font-medium text-ink">
            Ver ficha técnica →
          </span>
        </div>
      </div>
    </Link>
  );
}
