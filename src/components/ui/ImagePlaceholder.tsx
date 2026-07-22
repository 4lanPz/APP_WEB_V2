import Image from "next/image";
import { cn } from "@/lib/cn";

export interface ImagePlaceholderProps {
  src?: string;
  alt?: string;
  /**
   * Anchos servidos según viewport. `next/image` con `fill` no puede deducirlos
   * y sin esto descarga siempre la variante más grande. Por defecto asume ancho
   * completo; pásalo cuando la imagen viva en una columna o en una grid.
   */
  sizes?: string;
  /** Marca la imagen como prioritaria (LCP). Solo para la primera del viewport. */
  priority?: boolean;
  /**
   * Texto centrado cuando no hay foto real. Por defecto "Foto pendiente".
   * SOLO SE PINTA EN DESARROLLO — ver la nota del componente.
   */
  label?: string;
  /** Línea secundaria bajo el label, p. ej. el nombre de la referencia. Solo en desarrollo. */
  sublabel?: string;
  /**
   * Caption superpuesto en la esquina inferior izquierda. Describe la foto, así
   * que sobre un hueco vacío en producción no se pinta: no hay foto que
   * describir y el hueco debe quedar neutro.
   */
  caption?: string;
  /** Fondo oscuro (tinta/azul profundo) en vez del hueso claro por defecto. */
  dark?: boolean;
  /** Color plano real (p. ej. un swatch de color) en vez del hueso/tinta por defecto. */
  tintColor?: string;
  /**
   * Motion v1 §05 — zoom lento (scale 1→1.04, 500ms, curva revelar) cuando
   * un ancestro con clase `group` recibe hover. Requiere `group` en el
   * contenedor (p. ej. la card/Link que envuelve este componente).
   */
  zoomOnGroupHover?: boolean;
  className?: string;
}

/**
 * Traducción de `<image-slot>` de los exports de Claude Design: usa next/image
 * cuando hay `src` real y dibuja el hueco cuando no. No inventa fotografías.
 *
 * EL MARCADOR DE HUECO ES DE DESARROLLO, NO DE DISEÑO
 * La trama diagonal y los textos ("Foto pendiente", "DOCUMENTAL DE TALLER ·
 * FOTO REAL"…) vienen del mockup, donde describían la foto que faltaba. Se
 * transcribieron tal cual y acabaron mostrándose al usuario final —en el
 * carrusel de eventos de la portada, entre otros—, que ni sabe ni le importa
 * qué foto falta.
 *
 * Mismo criterio que `FondoHero` con su marcador punteado: en desarrollo se
 * marca (nos avisa de qué queda por entregar) y en producción el hueco queda
 * neutro, un plano de color liso sin texto ni trama. `NODE_ENV` es constante
 * de build, así que servidor y cliente pintan lo mismo y no hay desajuste de
 * hidratación.
 *
 * `tintColor` es la excepción y no depende de esto: ahí el plano de color ES
 * el contenido (un swatch), no un hueco.
 */
const MARCAR_HUECO = process.env.NODE_ENV !== "production";
export function ImagePlaceholder({
  src,
  alt = "",
  sizes = "100vw",
  priority = false,
  label = "Foto pendiente",
  sublabel,
  caption,
  dark = false,
  tintColor,
  zoomOnGroupHover = false,
  className,
}: ImagePlaceholderProps) {
  const zoomClass = zoomOnGroupHover
    ? "transition-transform duration-500 ease-revelar group-hover:scale-[1.04]"
    : "";

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", zoomClass)}
        />
      ) : (
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-6 text-center",
            zoomClass,
          )}
          style={{
            backgroundColor: tintColor ?? (dark ? "#0D2937" : "#EDE9E3"),
            backgroundImage:
              tintColor || !MARCAR_HUECO
                ? undefined
                : dark
                  ? "repeating-linear-gradient(45deg, rgba(245,242,238,0.05) 0 3px, transparent 3px 8px)"
                  : "repeating-linear-gradient(45deg, #E4DFD8 0 9px, #EDE9E3 9px 18px)",
          }}
        >
          {MARCAR_HUECO && (
            <>
              <span
                className={cn(
                  "font-mono text-xs uppercase tracking-widest",
                  dark ? "text-brand" : "text-accent",
                )}
              >
                {label}
              </span>
              {sublabel && (
                <span
                  className={cn(
                    "font-sans text-[15px] font-medium",
                    dark ? "text-paper" : "text-ink",
                  )}
                >
                  {sublabel}
                </span>
              )}
            </>
          )}
        </div>
      )}
      {caption && (src || MARCAR_HUECO) && (
        <span className="absolute bottom-0 left-0 p-4 font-mono text-xs uppercase tracking-widest text-paper mix-blend-difference">
          {caption}
        </span>
      )}
    </div>
  );
}
