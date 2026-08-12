"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * EL TEMPORIZADOR DE TODO LO QUE AVANZA SOLO. Uno, y solo uno.
 *
 * Nació en el carrusel de «Encuentros» de la portada (`EventCarousel`) y estaba
 * escrito TRES VECES: allí, en el bloque del asesor virtual (`AsesorPasos`) y
 * —cuando se pidió que el riel del taller avanzara solo— casi una cuarta. Las
 * tres copias no eran idénticas: dos llamaban al mismo estado `auto` y `hover`,
 * la otra `detenido` y `pausado`, y la del asesor tenía una condición de más que
 * las otras no. Tres copias de una regla de accesibilidad son tres sitios donde
 * la regla puede dejar de cumplirse en uno solo, sin que nada avise.
 *
 * ── LAS TRES CONDICIONES QUE PARAN EL RELOJ ───────────────────────────────
 *
 *  1. `prefers-reduced-motion` — NO ARRANCA. No es una pausa: contenido que se
 *     mueve solo es exactamente lo que esa preferencia pide que no ocurra. Quien
 *     la tiene puesta ve la primera tarjeta y navega a mano.
 *  2. El cursor encima — pausa mientras dura, y al salir SIGUE. Es lo que
 *     impide que la pieza se mueva justo cuando alguien se ha parado a leerla.
 *  3. `detener()` — el usuario tomó el control y el ciclo NO vuelve. Esto es lo
 *     que separa "pausar" de "parar", y la diferencia importa: si el ciclo
 *     reanudara después de que alguien elige una etapa o un evento, le movería
 *     de debajo justo lo que acaba de pedir ver.
 *
 * `alternar()` existe para el único caso que necesita volver atrás: el botón de
 * pausa visible de «Encuentros», que es el mando de la pieza. Donde el propio
 * contenido es el mando —las etapas del riel, los pasos del asesor— no se usa:
 * pulsar una etapa ya es parar.
 *
 * ── LA CADENCIA NO VIVE AQUÍ ──────────────────────────────────────────────
 * `intervalo` lo pone cada pieza porque no es una duración de animación —esas
 * están en `motion.ts`— sino cuánto hay que dejar quieta una tarjeta para poder
 * LEERLA, y eso depende de cuánto texto tenga encima.
 */
export interface AvanceAutomatico {
  /** El reloj está corriendo ahora mismo. */
  corriendo: boolean;
  /** El usuario lo paró. `alternar()` es lo único que lo deshace. */
  detenido: boolean;
  /** Parar para siempre: el usuario tomó el control. */
  detener: () => void;
  /** Parar/reanudar. Solo para piezas con botón de pausa propio. */
  alternar: () => void;
  /**
   * `prefers-reduced-motion` está puesto. Se expone porque las piezas lo
   * necesitan para MÁS cosas que el reloj: retirar el botón de pausa (no hay
   * nada que pausar) y quitar la transición entre tarjetas.
   */
  sinMovimiento: boolean;
  /**
   * Se derrama sobre el elemento que pausa al pasar el cursor. Va como objeto y
   * no como dos funciones sueltas para que no se pueda poner una y olvidar la
   * otra — que deja la pieza pausada para siempre en cuanto alguien la roza.
   */
  cursor: { onMouseEnter: () => void; onMouseLeave: () => void };
}

export function useAvanceAutomatico({
  intervalo,
  avanzar,
  habilitado = true,
}: {
  /** Milisegundos que descansa cada tarjeta. */
  intervalo: number;
  /** Qué hacer en cada tic. */
  avanzar: () => void;
  /**
   * Condición extra de la pieza. El bloque del asesor la usa para no correr
   * donde no hay foto que cambiar (por debajo del split de 768px la columna de
   * fotografía no se pinta, así que el reloj movería algo invisible).
   */
  habilitado?: boolean;
}): AvanceAutomatico {
  const [detenido, setDetenido] = useState(false);
  const [cursorEncima, setCursorEncima] = useState(false);
  /*
   * `useReducedMotion()` da `null` en el servidor y en el primer render, y se
   * resuelve al montar. Se normaliza a `false` —que es lo que ya hacía cada
   * copia al usarlo dentro de un `!`—, así que el HTML del servidor y el del
   * cliente coinciden y no hay desajuste de hidratación.
   */
  const sinMovimiento = useReducedMotion() ?? false;

  const corriendo = habilitado && !detenido && !cursorEncima && !sinMovimiento;

  /*
   * EL CALLBACK VIAJA EN UN REF, y no es un adorno. `avanzar` es casi siempre
   * una función escrita en línea, o sea una identidad nueva en cada render; como
   * dependencia del efecto reiniciaría el `setInterval` en cada repintado y la
   * tarjeta no llegaría nunca al final de su turno. Con el ref, el temporizador
   * solo se rearma cuando cambia de verdad algo que lo gobierna.
   */
  const alTic = useRef(avanzar);
  useEffect(() => {
    alTic.current = avanzar;
  });

  useEffect(() => {
    if (!corriendo) return;
    const id = setInterval(() => alTic.current(), intervalo);
    return () => clearInterval(id);
  }, [corriendo, intervalo]);

  const detener = useCallback(() => setDetenido(true), []);
  const alternar = useCallback(() => setDetenido((d) => !d), []);
  const entra = useCallback(() => setCursorEncima(true), []);
  const sale = useCallback(() => setCursorEncima(false), []);

  return {
    corriendo,
    detenido,
    detener,
    alternar,
    sinMovimiento,
    cursor: { onMouseEnter: entra, onMouseLeave: sale },
  };
}
