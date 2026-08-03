"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE_DESENROLLAR, DURATION, TOPE_ESPERA_FOTO } from "@/lib/motion";

/**
 * 4ª técnica encontrada en el barrido final del JS de los 10 .dc.html —
 * ausente del documento y no nombrada por el usuario: un telón color Papel
 * (`#tp-curtain`, mismo hex que el token `paper`) cubre toda la vista y se
 * retira (translateY 0→-100%, 720ms, curva "desenrollar") una sola vez,
 * al montar la aplicación. Distinto de `PageTransition`: ese cubre las
 * transiciones de ruta del lado del cliente; este solo la primera carga.
 *
 * Se monta una única vez como hermano fijo en `MotionProviders` (fuera del
 * árbol que `PageTransition` reemplaza en cada navegación), así que nunca
 * vuelve a aparecer tras la primera carga — igual que en el código real,
 * donde el telón vive en el HTML estático de cada export y solo se retira
 * una vez por carga de página.
 *
 * Interpretación: el código real retrasa el arranque de la secuencia del
 * Hero 430ms para que no corra oculto detrás del telón. No se acopló esa
 * espera aquí para no introducir estado global en `Hero.tsx` (componente
 * compartido y hoy agnóstico de esto); el resultado final es equivalente,
 * con una diferencia de sincronía fina en los primeros ~700ms.
 *
 * ESPERA POR LA FOTO
 * El telón se retiraba al montar, pasara lo que pasara detrás. En la ficha de
 * tela eso significaba descubrir el hueco de la foto principal todavía vacío y
 * verla aparecer un instante después: el telón tapaba exactamente el momento
 * que valía la pena tapar y lo soltaba justo antes. Ahora, cuando la página
 * declara una foto LCP (ver `SELECTOR_FOTO`), el telón la espera.
 *
 * Con dos límites, porque un telón opaco que espera a la red es peor que el
 * problema que resuelve:
 *  - Tope duro de `TOPE_ESPERA_FOTO`. Vence el tope, sube el telón, haya foto
 *    o no. Nunca hay espera indefinida.
 *  - Solo donde hay algo que esperar. Sin marca en el DOM no hay espera ni
 *    temporizador: el telón se comporta exactamente como antes de este cambio,
 *    que es el caso de todas las páginas menos la ficha de tela.
 */

/**
 * La marca que activa la espera. La pone el `<img>` de la foto principal de la
 * ficha de tela (`MacroLupa`), que es la única que hoy se declara LCP.
 *
 * Es un contrato de una sola dirección: quien quiera que el telón espere por su
 * imagen, la marca; quien no la marque, no cambia nada. Lo que NO debe hacerse
 * es marcar varias imágenes de la misma página —se espera por la primera del
 * documento, no por la mayor— ni marcar una imagen en diferido, que no empieza
 * a descargarse hasta acercarse a la vista y agotaría el tope sin remedio.
 */
const SELECTOR_FOTO = "img[data-telon-espera]";

/**
 * En cliente hace falta efecto de LAYOUT, no de pintado. La decisión de esperar
 * o no se toma leyendo el DOM ya montado, y tiene que estar tomada antes del
 * primer pintado: con `useEffect` el telón alcanzaría a arrancar su subida y
 * habría que abortarla a media animación. En el servidor no hay layout que
 * medir —y React avisa por consola si se usa—, así que allí es `useEffect`.
 */
const useEfectoDeMontaje =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function useTelonListo() {
  const [listo, setListo] = useState(false);

  useEfectoDeMontaje(() => {
    const foto = document.querySelector<HTMLImageElement>(SELECTOR_FOTO);

    // Nada que esperar: ni foto declarada, o ya está pintada porque venía de
    // caché. Se retira en este mismo fotograma, como toda la vida.
    if (!foto || (foto.complete && foto.naturalWidth > 0)) {
      setListo(true);
      return;
    }

    let abierto = false;
    const abrir = () => {
      if (abierto) return;
      abierto = true;
      setListo(true);
    };

    const tope = window.setTimeout(abrir, TOPE_ESPERA_FOTO * 1000);

    /*
      `decode()` y no el evento `load`: `load` dice que los bytes llegaron, no
      que haya píxeles listos para pintar. Entre uno y otro cabe el decodificado
      de un WebP grande, que es tiempo suficiente para que el telón suba sobre
      un hueco todavía vacío — el fallo que esta espera existe para evitar.

      Se retira igual si la promesa falla: `decode()` rechaza con una imagen
      rota o si el `src` cambia mientras tanto, y ninguna de las dos cosas puede
      dejar el telón puesto.
    */
    foto.decode().then(abrir, abrir);

    return () => {
      abierto = true;
      window.clearTimeout(tope);
    };
  }, []);

  return listo;
}

export function LoadCurtain() {
  const listo = useTelonListo();

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-999 bg-paper"
      initial={{ y: "0%" }}
      /*
        Mientras se espera, el destino es el sitio donde ya está: framer no
        anima nada y el telón se queda quieto y opaco. Al pasar a `listo` el
        destino cambia y ahí sí arranca la subida — una sola vez, porque el
        estado no vuelve atrás.

        `y` es transform, así que con `prefers-reduced-motion` activo el
        `reducedMotion="user"` de `MotionConfig` lo salta y el telón desaparece
        de golpe, sin recorrido. La espera por la foto sigue en pie —esperar no
        es moverse—, pero la retirada no anima. Es la misma regla que ya
        gobierna el resto del sitio.
      */
      animate={{ y: listo ? "-100%" : "0%" }}
      transition={{ duration: DURATION.cortinaCarga, ease: EASE_DESENROLLAR }}
    />
  );
}
