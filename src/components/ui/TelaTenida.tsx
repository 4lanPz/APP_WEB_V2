"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { CSS_EASE_ASENTAR, RECOLOREO } from "@/lib/motion";
import { MODO_RECOLOREO, capaMultiply, lutDegradado } from "@/data/recoloreo";

interface TelaTenidaProps {
  /** Color objetivo del chip, o `null` para dejar la foto sin tocar. */
  hex: string | null;
  /**
   * Ruta de la imagen que va dentro. La usan las dos técnicas: el mapa de
   * degradado para leer sus píxeles, y multiply en `contain` para recortarse
   * con ella de máscara.
   */
  src: string;
  /**
   * Luminancia media MEDIDA de la imagen que va dentro (`Foto.k`), que es con
   * lo que se compensa el fondo. Sin ella se usa la supuesta y el tono sale
   * algo desviado, no roto — ver `LUMINANCIA_SUPUESTA`.
   */
  k?: number;
  /**
   * Cómo llena la foto su caja, para que el color cubra exactamente lo que la
   * foto pinta y ni un píxel más.
   *
   * `"cover"` — la foto llena la caja (principal y miniaturas): el fondo es la
   * caja entera.
   * `"contain"` — la foto se ve entera con franjas vacías a los lados (el visor
   * a pantalla completa): teñir la caja entera pintaría también las franjas y
   * el fondo del visor saldría de color.
   */
  ajuste?: "cover" | "contain";
  className?: string;
  /**
   * LA IMAGEN, Y UNA SOLA. Dos `<img>` aquí dentro se mezclarían una con otra
   * —la de arriba multiplicaría a la de abajo, ya teñida— y la tela saldría al
   * doble de oscuro. Cuando hay dos fotos apiladas, como en la lupa, cada una
   * va en su propio `TelaTenida`.
   */
  children: ReactNode;
}

/**
 * La tela teñida: el FONDO lleva el color y LA IMAGEN lleva la mezcla.
 *
 * ESTE ORDEN ES EL INVERSO DEL OBVIO, Y ESA ES TODA LA IDEA. Lo natural es
 * pintar la foto y poner encima un rectángulo de color en `multiply`; se hizo
 * así y parpadeaba. Mientras el color viva en una capa aparte existe siempre un
 * fotograma en que la imagen ya pintó y la capa todavía no, y no hay prioridad
 * de carga que lo cierre: son dos elementos, y nada garantiza que compongan en
 * el mismo frame. Era un problema de arquitectura, no de descarga —por eso
 * `loading="eager"` y `fetchPriority="high"` no lo arreglaron—.
 *
 * Aquí el contenedor lleva el `background-color` compensado y el `<img>` lleva
 * `mix-blend-mode: multiply`. El resultado es idéntico —multiply es
 * conmutativo— pero la mezcla pasa a ser una propiedad de la propia imagen: no
 * queda nada que sincronizar porque ya no hay dos elementos. De propina, el
 * color está pintado ANTES de que la foto exista y viaja en el HTML servido,
 * así que el hueco mientras carga ya es del tono correcto en lugar de un beis
 * que después cambia.
 *
 * La mezcla se aplica desde aquí con `[&>img]:mix-blend-multiply` y no en el
 * `className` de cada `<Image>` a propósito: fondo y mezcla son las dos mitades
 * de una misma operación, y separarlas sería volver a tener dos cosas que
 * alguien puede desemparejar. `next/image` con `fill` pinta un `<img>` suelto,
 * que es el hijo directo que busca el selector.
 *
 * `isolation: isolate` no es decorativo: sin él la mezcla se comería el fondo
 * de la página y teñiría lo que hay debajo de la foto.
 *
 * Dos técnicas tras la misma interfaz, elegidas con `MODO_RECOLOREO`. Están las
 * dos escritas porque cuál sirve no se sabe hasta ver los colores saturados en
 * pantalla, y esa comprobación se hace con la foto real, no razonando.
 */
export function TelaTenida({
  hex,
  src,
  k,
  ajuste = "cover",
  className,
  children,
}: TelaTenidaProps) {
  const reduceMotion = useReducedMotion();

  /*
    El mapa de degradado no puede invertirse: no mezcla nada, sustituye los
    píxeles. Su canvas sigue yendo encima de la foto, con el parpadeo que eso
    implica —lee los píxeles en la CPU, así que llega aún más tarde que una
    capa de color—. Es el precio conocido de la técnica que alcanza los tonos
    que multiply no; si algún día pasa a ser el modo por defecto, esto hay que
    resolverlo pintando el degradado en el servidor, no aquí.
  */
  if (MODO_RECOLOREO === "mapa-degradado") {
    return (
      <div className={cn("absolute inset-0", className)}>
        {children}
        {hex && <CapaDegradado hex={hex} src={src} ajuste={ajuste} />}
      </div>
    );
  }

  /*
    Con la foto en `contain` el fondo no puede ser la caja entera. Se recorta
    con la propia foto de máscara: la máscara es opaca donde hay imagen y no
    existe en las franjas, así que el color cae exactamente sobre la foto sin
    que haya que conocer su relación de aspecto —que cambia según la vista: 4:3
    el macro, 4:5 la caída—. Codificarla como número sería un valor mágico que
    se rompe la primera vez que entre una foto con otra proporción.

    La máscara recorta el grupo entero, fondo e imagen juntos, y como la imagen
    ya ocupa exactamente ese rectángulo no le quita nada.
  */
  const mascara =
    hex && ajuste === "contain"
      ? {
          maskImage: `url(${src})`,
          WebkitMaskImage: `url(${src})`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }
      : undefined;

  return (
    <div
      className={cn(
        "absolute inset-0",
        hex && "isolate [&>img]:mix-blend-multiply",
        className,
      )}
      style={
        hex
          ? {
              backgroundColor: capaMultiply(hex, k),
              transition: reduceMotion
                ? undefined
                : `background-color ${RECOLOREO.cambioDeTono}s ${CSS_EASE_ASENTAR}`,
              ...mascara,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}

/**
 * Mapa de degradado: cada nivel de gris de la foto se sustituye por su color en
 * una rampa sombra→color→luz.
 *
 * ALCANZA LO QUE MULTIPLY NO. Multiply solo puede oscurecer, así que el
 * amarillo Ecuador le sale oliva; aquí el gris medio de la tela cae sobre el
 * color pleno y el amarillo sale amarillo. A cambio recorre los píxeles en la
 * CPU: la capa de lupa son 6,75 M de píxeles y eso se nota al cambiar de color.
 *
 * Por eso los píxeles de origen se leen UNA vez por imagen y se guardan; cambiar
 * de color solo vuelve a pasar la tabla, que es la parte barata.
 */
function CapaDegradado({
  hex,
  src,
  ajuste,
}: {
  hex: string;
  src: string;
  ajuste: "cover" | "contain";
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  /**
   * Píxeles leídos, con el `src` del que salieron. Van juntos en un solo estado
   * y no en dos —ni en una ref con un booleano al lado— porque así no existe el
   * instante en que los datos son de una foto y la bandera dice que son de otra:
   * al cambiar de vista, `datos.src !== src` y el repintado espera.
   */
  const [datos, setDatos] = useState<{ src: string; pixeles: ImageData } | null>(
    null,
  );

  // Carga y lectura de la imagen: una vez por `src`.
  useEffect(() => {
    let vivo = true;

    const img = new window.Image();
    img.decoding = "async";
    img.src = src;

    img
      .decode()
      .then(() => {
        if (!vivo) return;
        const lienzo = document.createElement("canvas");
        lienzo.width = img.naturalWidth;
        lienzo.height = img.naturalHeight;
        const ctx = lienzo.getContext("2d", { willReadFrequently: false });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        setDatos({
          src,
          pixeles: ctx.getImageData(0, 0, lienzo.width, lienzo.height),
        });
      })
      .catch(() => {
        // Una foto que no decodifica deja la capa sin pintar y la tela en
        // blanco: se ve la foto original, que es un fallo legible.
      });

    return () => {
      vivo = false;
    };
  }, [src]);

  // Repintado por color. Solo la tabla cambia; los píxeles ya están leídos.
  useEffect(() => {
    const el = canvas.current;
    if (!el || !datos || datos.src !== src) return;
    const pixeles = datos.pixeles;

    el.width = pixeles.width;
    el.height = pixeles.height;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    const lut = lutDegradado(hex);
    const salida = new ImageData(pixeles.width, pixeles.height);
    const src8 = pixeles.data;
    const dst8 = salida.data;

    for (let i = 0; i < src8.length; i += 4) {
      // La foto es gris puro, así que cualquier canal sirve de luminancia y no
      // hace falta ponderar: leer uno es tres veces más rápido que promediar.
      const l = src8[i] * 3;
      dst8[i] = lut[l];
      dst8[i + 1] = lut[l + 1];
      dst8[i + 2] = lut[l + 2];
      dst8[i + 3] = src8[i + 3];
    }
    ctx.putImageData(salida, 0, 0);
  }, [hex, datos, src]);

  /*
    El canvas es contenido reemplazado y lleva sus píxeles reales en los
    atributos `width`/`height`, así que `object-fit` lo encaja igual que a la
    foto de debajo. Aquí no hace falta máscara: el propio canvas se recorta.
  */
  return (
    <canvas
      ref={canvas}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 size-full",
        ajuste === "contain" ? "object-contain" : "object-cover",
      )}
    />
  );
}
