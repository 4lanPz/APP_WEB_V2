"use client";

import { COLORES_RECOLOREO } from "@/data/recoloreo";
import { cn } from "@/lib/cn";
import {
  CIERRE_DEL_ANILLO_EN_SWATCHES,
  CLASES_BOTON_DE_SWATCH,
  clasesAnilloDeSwatch,
} from "@/lib/motion-interaccion";

/*
 * Las tres capas del marcado de "seleccionado", con sus colores reales. Estaban
 * escritas en línea dentro del `boxShadow` y salen aquí porque ahora hay dos
 * formas de dibujarlas —el anillo que se cierra y el de siempre— y las dos
 * tienen que pintar EXACTAMENTE lo mismo. Repetidas, se corregiría una sola.
 *
 * Hueco en Papel y aro azul, el gesto de "seleccionado" del sitio (el mismo del
 * muestrario de blancos). El filete de 1px en Greige lo lleva siempre todo
 * swatch, elegido o no: es el borde del chip, no parte de la selección.
 */
const BORDE_DEL_CHIP = "0 0 0 1px #C8C2B8";
const ANILLO_SELECCION = "0 0 0 3px #F5F2EE, 0 0 0 5px #33A2DC";

export interface SwatchesRecoloreoProps {
  /** Índice dentro de `COLORES_RECOLOREO`. */
  activo: number;
  onCambiar: (indice: number) => void;
}

/**
 * Muestrario de recoloreo, inmediatamente debajo de la foto.
 *
 * DEBAJO DE LA FOTO Y NO EN LAS ESPECIFICACIONES. La relación causa-efecto
 * tiene que verse sin leer nada: se pulsa un color y la tela de arriba cambia.
 * En una pestaña aparte o junto a la ficha técnica, el vínculo se pierde y hay
 * que explicarlo con una frase — que es exactamente lo que no queremos.
 *
 * El chip lleva el color REAL del tono, no el de la capa de mezcla: quien mira
 * compara el botón con la tela, y un botón pintado con el color compensado
 * (`#0062FF` para el azul) sería un botón que miente sobre su propio nombre.
 */
export function SwatchesRecoloreo({ activo, onCambiar }: SwatchesRecoloreoProps) {
  return (
    <div>
      {/*
        EL ORDEN ES: rótulo de sección, en qué color está, con qué cambiarlo.
        El nombre estaba antes a la derecha del rótulo, en mono pequeño y a la
        misma altura, y ahí se leía como un pie de la etiqueta y no como el
        estado del control. Arriba y con cuerpo se lee primero lo que se está
        viendo, y solo después el mando para cambiarlo.

        El tratamiento es el de los VALORES de la ficha técnica —`font-sans
        text-body-s font-medium text-ink`, ver `FichaTecnica`— y no uno nuevo:
        "Azul eléctrico" es un dato de la tela igual que su gramaje, y la ficha
        de al lado ya dice cómo se escriben los datos de esta página.
      */}
      <p className="font-mono text-label uppercase text-graphite">
        Simulación de color
      </p>
      <p
        aria-live="polite"
        className="mt-1.5 font-sans text-body-s font-medium text-ink"
      >
        {COLORES_RECOLOREO[activo].nombre}
      </p>

      <div className="mt-3 flex flex-wrap gap-3">
        {COLORES_RECOLOREO.map((color, i) => (
          <button
            key={color.hex}
            type="button"
            onClick={() => onCambiar(i)}
            aria-label={color.nombre}
            aria-pressed={i === activo}
            /*
              44px de lado: es el mínimo cómodo al tacto, y estos botones son
              redondos y van en fila, así que el área real ya es menor que el
              cuadro. Con 40 se fallaba el de al lado en móvil.
            */
            className={cn(
              "size-11 rounded-full transition-shadow duration-200 ease-asentar focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
              CLASES_BOTON_DE_SWATCH,
            )}
            style={{
              backgroundColor: color.hex,
              /*
                El seleccionado se marca con anillo, NO solo con el color: un
                muestrario cuyo estado activo se distinguiera por tono sería
                ilegible justo para quien más lo necesita. Mismo doble
                `box-shadow` que el muestrario de blancos —hueco en Papel y aro
                azul—, que ya es el gesto de "seleccionado" del sitio.

                Con el cierre encendido el chip solo lleva su filete y el anillo
                se va a la capa de abajo, que es la que puede escalar. La marca
                es la misma en los dos casos: lo que cambia es si aparece puesta
                o se cierra hasta su sitio.
              */
              boxShadow: CIERRE_DEL_ANILLO_EN_SWATCHES
                ? BORDE_DEL_CHIP
                : i === activo
                  ? `${BORDE_DEL_CHIP}, ${ANILLO_SELECCION}`
                  : BORDE_DEL_CHIP,
            }}
          >
            {CIERRE_DEL_ANILLO_EN_SWATCHES && (
              <span
                aria-hidden
                className={clasesAnilloDeSwatch(i === activo)}
                style={{ boxShadow: ANILLO_SELECCION }}
              />
            )}
          </button>
        ))}
      </div>

      {/*
        Obligatorio, y no es letra pequeña defensiva: la fidelidad de color en
        pantalla es un problema conocido del sector —perfil del monitor, luz de
        la sala, el propio multiply— y callarlo para no estropear el efecto es
        cómo alguien acaba comprando un lote por un tono que vio aquí.
      */}
      <p className="mt-3 font-mono text-micro text-graphite">
        Color referencial — solicite muestra física.
      </p>
    </div>
  );
}
