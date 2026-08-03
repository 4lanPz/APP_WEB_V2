import Image from "next/image";
import { foto } from "@/data/imagenes";
import { MARCAR_HUECOS_DE_IMAGEN } from "@/lib/huecos";

/**
 * Fondo fotográfico a sangre para bandas oscuras de cabecera.
 *
 * Los heroes SÍ llevan foto. Si el slot no tiene archivo esto no pinta fondo y
 * la cabecera se queda en tinta plana, que es un estado provisional —falta la
 * foto—, no un diseño. Con el marcador encendido se señala el hueco (ver abajo).
 *
 * NO REPONER LA REJILLA
 * Aquí hubo una rejilla CSS de 34px (`REJILLA_HERO`) que se pintaba con foto y
 * sin ella. Venía de los exports .dc.html, donde la trama marcaba "aquí va una
 * imagen": era un marcador de hueco del mockup, no un elemento de diseño, y al
 * transcribir se tomó por diseño y acabó pintada también ENCIMA de fotografías
 * reales. Se retiró a propósito. No volver a añadirla.
 *
 * Vive aparte de `Hero` porque `/asesor-virtual` tiene su propia banda oscura y
 * no usa ese componente; sin extraerlo habría que duplicar los velos, y un velo
 * duplicado es un velo que un día se corrige solo en uno de los dos sitios.
 */

/**
 * Degradado de cabecera. Este sí es diseño: es lo que sostiene la legibilidad
 * del titular sobre la foto. Se usa tal cual, con y sin foto.
 */
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
   * Hueco vacío: sin marcar no se pinta nada y la cabecera se queda en tinta
   * plana. Eso es "falta la foto", no un diseño alternativo — no se rellena con
   * una textura para disimularlo.
   *
   * Marcado sí se señala. Un hueco de cabecera vacío es invisible —el respaldo
   * va a sangre, no es un recuadro— y eso lo vuelve indistinguible de "aquí no
   * hay slot". El resto del sitio no tiene el problema porque `ImagePlaceholder`
   * ya dibuja el hueco; por eso este marcador es distinto (punteado en el borde,
   * no trama) y por eso los dos leen la MISMA constante: son la misma decisión.
   */
  if (!imagen) {
    if (!MARCAR_HUECOS_DE_IMAGEN) return null;
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 border border-dashed border-paper/15"
      >
        <span className="absolute bottom-5 right-5 border border-dashed border-paper/25 px-2.5 py-1.5 font-mono text-micro uppercase tracking-widest text-paper/45">
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
       *  1. Suelo plano de tinta. El degradado baja al 15% en el extremo
       *     derecho, y sobre una foto cualquiera eso no basta. Sin este suelo el
       *     contraste dependería de qué imagen se cargue, y quien la carga no lo
       *     va a medir.
       *  2. El degradado, sin tocar: es el tratamiento que ya usan los heroes y
       *     lo que mantiene el peso a la izquierda, bajo el titular.
       *
       * EL SUELO SUBE SOLO EN MÓVIL. `object-fit: cover` recorta distinto según
       * la forma del viewport: a 375 la banda es casi cuadrada y encuadra una
       * zona más clara de la foto justo donde caen la migaja y el CTA. Medido
       * con `npm run botones`, a 375 el texto papel del CTA se quedaba entre
       * 3,98:1 y 4,41:1 y la migaja `paper/60` entre 4,12:1 y 4,21:1 —por
       * debajo del 4,5:1— mientras que a 1440 no fallaba ninguna de las seis
       * cabeceras.
       *
       * Por eso el 32% se queda tal cual desde `tablet` (900px, el mismo
       * breakpoint donde el sitio pasa a escritorio) y solo por debajo sube.
       * Oscurecer también el escritorio sería deshacer lo que se ganó al
       * retirar la rejilla: que la fotografía se vea.
       *
       * El 45% se buscó midiendo, no a ojo. El caso más apretado es la migaja
       * de Microfibra, que es `paper/60` y por tanto lo peor que hay: 40% la
       * dejaba en 4,36:1 y 42% en 4,43:1, los dos por debajo. Pasa a partir del
       * 44%; se deja en 45 porque las fotos de cabecera son slots que se
       * reemplazan y quedarse clavado en el umbral significa que la siguiente
       * foto que entre lo rompe sin que nadie se entere.
       */}
      <div className="absolute inset-0 bg-ink/45 tablet:bg-ink/[0.32]" />
      <div className="absolute inset-0" style={{ backgroundImage: DEGRADADO_HERO }} />
    </div>
  );
}
