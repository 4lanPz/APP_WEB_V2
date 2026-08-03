import Image from "next/image";
import { cn } from "@/lib/cn";
import { MARCAR_HUECOS_DE_IMAGEN } from "@/lib/huecos";

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
   * Solo se pinta con el marcador encendido — ver `MARCAR_HUECOS_DE_IMAGEN`.
   *
   * `label=""` marca el hueco con la trama SOLA. Es para huecos demasiado
   * pequeños para que quepa un rótulo legible (las miniaturas de 64 px del
   * asesor): ahí un texto recortado no informa de nada y la trama sí.
   */
  label?: string;
  /**
   * Línea secundaria bajo el label, p. ej. el nombre de la referencia. Misma
   * condición que `label`.
   */
  sublabel?: string;
  /**
   * Caption superpuesto en la esquina inferior izquierda. Describe la foto, así
   * que sobre un hueco vacío sin marcar no se pinta: no hay foto que describir y
   * el hueco debe quedar neutro.
   */
  caption?: string;
  /** Fondo oscuro (tinta/azul profundo) en vez del hueso claro por defecto. */
  dark?: boolean;
  /** Color plano real (p. ej. un swatch de color) en vez del hueso/tinta por defecto. */
  tintColor?: string;
  /**
   * No pinta color de fondo propio: la trama del hueco cae sobre la superficie
   * que ya tenga el contenedor.
   *
   * Para huecos que viven DENTRO de una superficie medida. El caso es el asesor
   * virtual: su página es `ink` (#1c1917, oscuro cálido) y ahí `brand-deep`
   * (#0d2937, oscuro frío) da 1,17:1 —el ojo no lee dos planos, lee suciedad—,
   * cosa que esa pantalla ya corrigió una vez. Con esto el hueco conserva su
   * `ink/40` y aun así se marca como hueco.
   */
  sinFondoPropio?: boolean;
  /**
   * Centra el rótulo en el 60% superior del hueco en vez de en el hueco entero.
   *
   * Para huecos que llevan contenido SUPERPUESTO en su mitad inferior. El caso
   * es `CategoryCard`: la card mide 300 px y sus últimos ~120 son el título, la
   * descripción y el enlace, así que el centro geométrico del hueco es
   * exactamente la línea del título y el rótulo caía encima, ilegibles los dos.
   */
  marcadorEnAlto?: boolean;
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
 * EL MARCADOR DE HUECO NO ES DISEÑO
 * La trama diagonal y los textos ("Foto pendiente", "DOCUMENTAL DE TALLER ·
 * FOTO REAL"…) vienen del mockup, donde describían la foto que faltaba. Dicen
 * que ahí falta algo; no son un tratamiento gráfico.
 *
 * Encenderlos o apagarlos es una sola línea, en `@/lib/huecos`, y la comparte
 * con `FondoHero` — que tenía la misma lógica duplicada con su marcador
 * punteado. Que sean dos componentes distintos con la misma pregunta detrás es
 * justo lo que hace que un día se corrijan solo en uno de los dos.
 *
 * `tintColor` es la excepción y no depende de esto: ahí el plano de color ES
 * el contenido (un swatch), no un hueco.
 */
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
  sinFondoPropio = false,
  marcadorEnAlto = false,
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
          className={cn("absolute inset-0", zoomClass)}
          style={{
            backgroundColor:
              tintColor ?? (sinFondoPropio ? undefined : dark ? "#0D2937" : "#EDE9E3"),
            backgroundImage:
              tintColor || !MARCAR_HUECOS_DE_IMAGEN
                ? undefined
                : dark
                  ? "repeating-linear-gradient(45deg, rgba(245,242,238,0.05) 0 3px, transparent 3px 8px)"
                  : "repeating-linear-gradient(45deg, #E4DFD8 0 9px, #EDE9E3 9px 18px)",
          }}
        >
          {/*
            El rótulo va en su propia caja, aparte de la que pinta el fondo: la
            trama tiene que llenar el hueco entero siempre, y el texto no —hay
            huecos con contenido superpuesto abajo, y ahí se centra arriba.
          */}
          {MARCAR_HUECOS_DE_IMAGEN && label && (
            <div
              className={cn(
                "absolute flex flex-col items-center justify-center gap-1.5 px-6 text-center",
                marcadorEnAlto ? "inset-x-0 top-0 h-3/5" : "inset-0",
              )}
            >
              <span
                className={cn(
                  "font-mono text-label uppercase",
                  dark ? "text-brand" : "text-accent",
                )}
              >
                {label}
              </span>
              {sublabel && (
                <span
                  className={cn(
                    "font-sans text-body-s font-medium",
                    dark ? "text-paper" : "text-ink",
                  )}
                >
                  {sublabel}
                </span>
              )}
            </div>
          )}
        </div>
      )}
      {caption && (src || MARCAR_HUECOS_DE_IMAGEN) && (
        <span className="absolute bottom-0 left-0 p-4 font-mono text-label uppercase text-paper mix-blend-difference">
          {caption}
        </span>
      )}
    </div>
  );
}
