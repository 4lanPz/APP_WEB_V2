import Image from "next/image";
import { cn } from "@/lib/cn";

export interface ImagePlaceholderProps {
  src?: string;
  alt?: string;
  /** Texto centrado cuando no hay foto real. Por defecto "Foto pendiente". */
  label?: string;
  /** Línea secundaria bajo el label, p. ej. el nombre de la referencia. */
  sublabel?: string;
  /** Caption superpuesto en la esquina inferior izquierda. */
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
 * Traducción de `<image-slot>` de los exports de Claude Design: mismo
 * tratamiento (fondo hueso con trama diagonal, texto "Foto pendiente"),
 * usando next/image cuando sí hay `src` real. No inventa fotografías.
 */
export function ImagePlaceholder({
  src,
  alt = "",
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
        <Image src={src} alt={alt} fill className={cn("object-cover", zoomClass)} />
      ) : (
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-6 text-center",
            zoomClass,
          )}
          style={{
            backgroundColor: tintColor ?? (dark ? "#0D2937" : "#EDE9E3"),
            backgroundImage: tintColor
              ? undefined
              : dark
                ? "repeating-linear-gradient(45deg, rgba(245,242,238,0.05) 0 3px, transparent 3px 8px)"
                : "repeating-linear-gradient(45deg, #E4DFD8 0 9px, #EDE9E3 9px 18px)",
          }}
        >
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
        </div>
      )}
      {caption && (
        <span className="absolute bottom-0 left-0 p-4 font-mono text-xs uppercase tracking-widest text-paper mix-blend-difference">
          {caption}
        </span>
      )}
    </div>
  );
}
