import Link from "next/link";
import { ImagePlaceholder } from "./ImagePlaceholder";
import type { Foto } from "@/data/imagenes";
import { cn } from "@/lib/cn";

export interface CategoryCardProps {
  href: string;
  /** Posición en la grilla — se formatea como "01". */
  index: number;
  title: string;
  description: string;
  /**
   * Foto de la familia, ya resuelta: `foto("familia-<slug>")`. Sin ella el hueco
   * se dibuja marcado, como en el resto del sitio — aquí va una foto, y hasta
   * que llegue tiene que verse que falta.
   *
   * Recibe la `Foto` entera y no una ruta suelta, igual que `SubcategoryTile`:
   * el `alt` viaja con la imagen. Separarlos deja abierta la puerta a pasar una
   * ruta con el alt de otra, que es un fallo que nadie ve porque solo lo nota
   * quien usa lector de pantalla.
   */
  foto?: Foto;
  className?: string;
}

/**
 * Card de familia de producto — reconstruida contra la grilla "03 Categorías"
 * de Productos.dc.html: tile de fondo oscuro con foto + velo degradado, índice
 * mono azul arriba, título + descripción abajo. Sin borde propio: vive en una
 * "seam grid" (gap-px bg-greige + borde exterior), igual que ProductCard.
 *
 * LA CAPA DE IMAGEN ES `ImagePlaceholder`, NO UN FONDO PROPIO
 * Aquí se dibujaba a mano la misma trama diagonal que usa `ImagePlaceholder` en
 * su rama de hueco vacío: copiada, sin rótulo y sin la guarda que la apaga al
 * publicar. El efecto es que el hueco no se leía como hueco —parecía la textura
 * elegida para la card—, así que nadie registró su slot y las cuatro familias no
 * figuraban en el inventario de fotos que se le pide a marketing. Un marcador
 * copiado deja de ser un marcador. Que la capa de imagen la ponga el componente
 * que sabe dibujar huecos.
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
  foto,
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
      <ImagePlaceholder
        dark
        src={foto?.ruta}
        alt={foto?.alt ?? ""}
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        label="Foto de familia"
        /*
         * `marcadorEnAlto` y sin `sublabel`, las dos por lo mismo: el tercio
         * inferior de esta card es el bloque de texto, que va SOBRE el hueco.
         * Centrado, el rótulo caía en la línea del título y quedaban ilegibles
         * los dos. Y el `sublabel` natural aquí sería el nombre de la familia,
         * que la card ya escribe como título: repetirlo no añadía nada.
         */
        marcadorEnAlto
        className="absolute inset-0"
      />
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

      <span className="relative font-mono text-label text-brand">
        {indexLabel}
      </span>
      <div className="relative">
        {/* eslint-disable-next-line no-restricted-syntax -- título de card: escala propia del componente, no de la escala editorial (fase 3) */}
        <h3 className="mb-2 font-sans text-[28px] font-medium tracking-[-0.01em] text-paper">
          {title}
        </h3>
        <p className="font-serif text-body-s leading-normal text-greige">
          {description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-label uppercase text-brand">
          Ver más
          <span className="inline-block transition-transform duration-220 ease-asentar group-hover:translate-x-1.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
