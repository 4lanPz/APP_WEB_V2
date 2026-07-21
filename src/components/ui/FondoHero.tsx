import Image from "next/image";
import { foto } from "@/data/imagenes";

/**
 * Fondo fotográfico a sangre para bandas oscuras de cabecera.
 *
 * El diseño aprobado no llevaba foto en los heroes — su fondo es la trama CSS a
 * propósito—, así que si el slot no tiene archivo esto no pinta fondo y quien lo
 * usa se queda con el de siempre. Añadirlo a una página no cambia nada hasta que
 * hay foto. En desarrollo, eso sí, marca el hueco (ver abajo).
 *
 * Vive aparte de `Hero` porque `/asesor-virtual` tiene su propia banda oscura y
 * no usa ese componente; sin extraerlo habría que duplicar los velos, y un velo
 * duplicado es un velo que un día se corrige solo en uno de los dos sitios.
 */

/** Rejilla de 34px al 4% — la textura del hero del diseño aprobado. */
export const REJILLA_HERO =
  "repeating-linear-gradient(0deg, rgba(245,242,238,0.04) 0 1px, transparent 1px 34px), repeating-linear-gradient(90deg, rgba(245,242,238,0.04) 0 1px, transparent 1px 34px)";

/** Degradado del diseño aprobado. Se usa tal cual, con y sin foto. */
export const DEGRADADO_HERO =
  "linear-gradient(115deg, rgba(13,25,30,0.86) 0%, rgba(28,25,23,0.55) 45%, rgba(28,25,23,0.15) 100%)";

export function FondoHero({
  slot,
  priority = true,
}: {
  /** Id del slot de imagen. Si está vacío, no se pinta nada. */
  slot: string;
  /** La cabecera suele ser el LCP; solo desactívalo si no está en el viewport. */
  priority?: boolean;
}) {
  const imagen = foto(slot);

  /*
   * Hueco vacío: en producción no se pinta nada y la cabecera se queda con su
   * trama CSS, que es el diseño aprobado.
   *
   * En desarrollo sí se marca. Un hueco de cabecera vacío es invisible —el
   * respaldo es una textura a sangre, no un recuadro— y eso lo vuelve
   * indistinguible de "aquí no hay slot". El resto del sitio no tiene el
   * problema porque `ImagePlaceholder` ya dibuja el hueco. `NODE_ENV` es
   * constante de build, así que servidor y cliente pintan lo mismo y no hay
   * desajuste de hidratación.
   */
  if (!imagen) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 border border-dashed border-paper/15"
      >
        <span className="absolute bottom-5 right-5 border border-dashed border-paper/25 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-paper/45">
          Cabecera vacía · deja {slot}.jpg en entrega/
        </span>
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Image
        src={imagen.ruta}
        alt=""
        fill
        sizes="100vw"
        priority={priority}
        className="object-cover"
      />
      {/*
       * Legibilidad en dos capas, en este orden a propósito:
       *
       *  1. Suelo plano de tinta al 32%. El degradado aprobado baja al 15% en el
       *     extremo derecho: sobre la trama CSS —siempre oscura— sobra, pero
       *     sobre una foto cualquiera no. Sin este suelo el contraste dependería
       *     de qué imagen se cargue, y quien la carga no lo va a medir.
       *  2. El degradado aprobado, sin tocar: es el tratamiento que ya usan los
       *     heroes y lo que mantiene el peso a la izquierda, bajo el titular.
       *
       * Medido sobre foto real de planta: 10,9:1 en el titular y 6,7:1 en la
       * zona más clara. AA con margen incluso donde la foto casi es blanca.
       */}
      <div className="absolute inset-0 bg-ink/[0.32]" />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `${REJILLA_HERO}, ${DEGRADADO_HERO}` }}
      />
    </div>
  );
}
