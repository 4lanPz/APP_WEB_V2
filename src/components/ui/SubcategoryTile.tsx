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

/*
 * LOS TRES TONOS SON TEXTO DE 12px SOBRE `paper`: los tres necesitan 4,5:1, sin
 * excepción de texto grande que valga.
 *
 * `publicada` iba en `brand` y daba 2,44:1 — el suspenso más repetido del
 * sitio, porque esta tile se dibuja en las tres rejillas de catálogo. Pasa a
 * `brand-ink` (5,10:1 sobre `paper`), que es el token que existe justamente
 * para escribir el azul sobre claro. Sigue leyéndose como marca: queda al mismo
 * peso visual que la tile `preliminar` de al lado, que es la relación correcta
 * entre tres estados hermanos. Medido con `npm run marca`.
 *
 * `graphite` cumple (5,15:1). `accent` daba 3,76:1 sobre `paper` —el mismo
 * problema en terracota— y aquí quedó anotado a mano porque `npm run marca` no
 * lo veía: aquel barrido solo seguía los azules. RESUELTO: el token pasó de
 * `#a0715a` a `#8a5d46` (5,04:1 sobre `paper`) y el verificador sigue ya los
 * tres colores de marca, así que esto vuelve a medirse solo. Ver el bloque de
 * `--color-accent` en `globals.css`.
 */
const ETIQUETA: Record<EstadoFicha, { estado: string; accion: string; tono: string }> = {
  publicada: {
    estado: "Ficha disponible",
    accion: "Ver ficha →",
    tono: "text-brand-ink",
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
        "group relative flex flex-col border border-transparent bg-paper text-ink",
        className,
      )}
    >
      {/*
        EL FILETE DE HOVER ES UNA CAPA CON OPACIDAD, NO UN `border-color` QUE
        TRANSICIONA. Aquí ponía `transition-colors duration-500 hover:border-graphite`
        y era, medido, el 96% del pintado de esta pantalla: `border-color` no es
        una propiedad que el compositor sepa animar, así que los 500ms obligaban
        al hilo principal a repintar en cada fotograma —y como la tile no está
        promovida a capa propia, cada repintado se anota contra la capa de la
        página entera, que en `/productos/microfibra` mide 1425×5285 px. Veinte
        tiles con eso dentro es la caída de FPS que se veía. Ver
        `docs/rendimiento-cards.md`.

        La opacidad sí se compone: el filete se pinta UNA vez y luego solo se
        funde. El aspecto es idéntico —mismo color, misma duración, misma curva—
        y el gesto no cambia.

        `-inset-px` y no `inset-0`: la caja de contención de un absoluto es la
        caja de PADDING del ancestro, o sea por dentro del `border-transparent`
        de 1px que la tile ya reserva. Con `inset-0` el filete se dibujaría 1px
        hacia dentro y se notaría el salto al encenderse.

        El `border border-transparent` del enlace se queda: es lo que reserva el
        hueco del filete y por lo que esto no mueve ni un píxel de la retícula.
      */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px border border-graphite opacity-0 transition-opacity duration-500 ease-revelar group-hover:opacity-100"
      />
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
          {/* eslint-disable-next-line no-restricted-syntax -- título de card fluido: escala propia del componente, no editorial (fase 3) */}
          <h3 className="font-sans text-[clamp(21px,1.9vw,26px)] font-medium tracking-[-0.01em]">
            {title}
          </h3>
          <span className="whitespace-nowrap font-mono text-micro text-accent">
            {index}
          </span>
        </div>
        {description && (
          <p className="mb-4.5 max-w-[40ch] font-serif text-body-s leading-normal text-graphite">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between gap-3 border-t border-greige pt-3.75">
          <span
            className={cn(
              "font-mono text-label uppercase",
              etiqueta.tono,
            )}
          >
            {etiqueta.estado}
          </span>
          <span className="font-sans text-caption font-medium text-ink">
            {etiqueta.accion}
          </span>
        </div>
      </div>
    </Link>
  );
}
