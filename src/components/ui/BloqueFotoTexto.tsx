import type { ReactNode } from "react";
import { PhotoCurtain, type PhotoCurtainProps } from "@/components/motion/Curtain";
import { cn } from "@/lib/cn";

/**
 * Alto del marco de la foto cuando la página no pide otro. La foto ya no es
 * media pantalla a sangre sino una columna de rejilla, y una columna se queda
 * a la altura del texto que tiene al lado: sin alto propio, una macro dejaría
 * de verse como macro.
 *
 * Se pisa entero pasando `className` en `foto` —no se fusiona—, porque una
 * página que pide `aspect-*` está eligiendo proporción, y dejarle debajo un
 * `min-h` heredado son dos mecanismos de tamaño discutiendo por el mismo marco.
 */
const ALTO_FOTO = "min-h-[62vw] sm:min-h-90 lg:min-h-130";

export interface BloqueFotoTextoProps {
  /** Props de la foto. Su `className` sustituye al alto por defecto. */
  foto: PhotoCurtainProps;
  /**
   * Texto a la izquierda y foto a la derecha, en vez de al revés.
   *
   * NO ES UN `order-*`: cambia el orden en el DOM. Así el orden de lectura
   * —y el apilado en móvil, que es ese mismo orden— acompaña a lo que se ve
   * en escritorio en lugar de contradecirlo. Sin invertir, la foto abre el
   * bloque también en móvil; invertido, abre el texto.
   */
  invertido?: boolean;
  /** La columna de texto. Se apila con la separación del bloque. */
  children: ReactNode;
  className?: string;
}

/**
 * DOS COLUMNAS CON AIRE: foto y texto en la misma rejilla, separados.
 *
 * El patrón que estrenó «Verdad material» en la portada. Las dos columnas viven
 * dentro del mismo contenedor —la foto no rompe a sangre— con una separación
 * que a 1440 son 80 px. Va pensado para el contenedor ANCHO (`ancho="amplio"`),
 * que es la excepción reservada justo a esto: splits de imagen + texto donde el
 * ancho es parte del contenido. El contenedor lo pone la página, porque es ella
 * la que decide si la cabecera de sección entra o no en el mismo ancho.
 *
 * En móvil se apilan, con 40 px entre las dos partes.
 *
 * El gesto de la foto es el de siempre —barrido de `Curtain`—; el del texto lo
 * decide cada página con lo que meta dentro.
 */
export function BloqueFotoTexto({
  foto,
  invertido = false,
  children,
  className,
}: BloqueFotoTextoProps) {
  const columnaFoto = (
    <PhotoCurtain {...foto} className={foto.className ?? ALTO_FOTO} />
  );
  const columnaTexto = <div className="flex flex-col gap-5">{children}</div>;

  return (
    <div
      className={cn(
        "grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20",
        className,
      )}
    >
      {invertido ? columnaTexto : columnaFoto}
      {invertido ? columnaFoto : columnaTexto}
    </div>
  );
}
