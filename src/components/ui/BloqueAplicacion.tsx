import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

export interface BloqueAplicacionProps {
  /** Eyebrow mono. Deja claro que es un ejemplo, no producto propio. */
  eyebrow?: string;
  titulo: string;
  descripcion: string;
  /**
   * El contenido visual: hoy una imagen, mañana un objeto 3D interactivo. Se
   * inyecta desde la página a propósito para que ese cambio no toque ni el
   * marco ni la etiqueta —solo lo que se le pasa aquí dentro—.
   */
  media: ReactNode;
  className?: string;
}

/**
 * Banda "ejemplo de aplicación": ilustra para qué sirve una familia de tela
 * mostrando una prenda terminada, sin afirmar que la prenda sea producto de
 * Textil Padilla —vendemos tela, no prendas—.
 *
 * El marco y la etiqueta son fijos; el contenido visual entra como `media`, así
 * que sustituir la foto por el objeto 3D es cambiar lo que la página le pasa,
 * sin tocar este componente ni la página más allá de esa línea.
 *
 * Acentos solo en el azul de marca (`brand`), nunca en otro color.
 */
export function BloqueAplicacion({
  eyebrow = "Ejemplo de aplicación",
  titulo,
  descripcion,
  media,
  className,
}: BloqueAplicacionProps) {
  return (
    <section className={cn("bg-bone", className)}>
      <div className="mx-auto grid max-w-padilla grid-cols-1 items-center gap-8 px-[clamp(24px,7vw,120px)] py-16 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 flex flex-col gap-5 lg:order-1">
          <Reveal tipo="etiqueta">
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-brand">
              <span aria-hidden className="block size-1.5 bg-brand" />
              {eyebrow}
            </span>
          </Reveal>
          <Reveal tipo="cuerpo">
            <h2 className="font-sans text-h2 font-medium tracking-[-0.01em] text-ink">
              {titulo}
            </h2>
          </Reveal>
          <Reveal tipo="cuerpo">
            <p className="max-w-prose font-serif text-body-m text-graphite">
              {descripcion}
            </p>
          </Reveal>
          {/*
            AQUÍ VA LA PROCEDENCIA CUANDO EXISTA UNA PRENDA REAL.
            Hoy la imagen es una maqueta generada para la demo: no hay una
            prenda concreta ni un confeccionista al que atribuirla, así que
            afirmar "confeccionada por X con nuestra tela" sería falso. Cuando
            se fotografíe una prenda real, esa línea de crédito se añade aquí.
          */}
          <p className="font-serif text-caption italic text-graphite">
            Imagen ilustrativa del tipo de confección para el que sirve la
            familia. La prenda no es un producto de Textil Padilla.
          </p>
        </div>
        <div className="order-1 lg:order-2">{media}</div>
      </div>
    </section>
  );
}
