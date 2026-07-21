"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fondo de vídeo del hero — Motion v1 §06.
 *
 *   velocidad 0.5x · opacidad 0.85 · velo de tinta 28% · mudo · bucle · sin
 *   controles · póster visible desde el primer frame.
 *
 * PREFERS-REDUCED-MOTION
 * El vídeo no se renderiza en el HTML del servidor: se monta en un efecto, solo
 * si `matchMedia` dice que el sistema no pide menos animación. Eso resuelve dos
 * cosas de una vez — no hay desajuste de hidratación (servidor y primer render
 * de cliente pintan lo mismo, el póster), y quien pide menos animación no llega
 * a descargar los megas del vídeo, que es la parte que de verdad le importa.
 *
 * El póster se queda debajo siempre: es lo que se ve mientras carga, lo que
 * queda si el navegador no sabe reproducir ninguno de los dos formatos, lo
 * único que se ve con reduced-motion — y, mientras no haya vídeo procesado
 * (`hayVideo=false`), el fondo de la portada por sí solo. Sin esa última
 * condición el póster queda muerto: lleno en el manifiesto e invisible en la
 * página, porque solo se pintaba si antes existía el vídeo.
 */
export function HeroVideo({
  poster,
  hayVideo,
}: {
  poster: string;
  hayVideo: boolean;
}) {
  const [conVideo, setConVideo] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!hayVideo) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplicar = () => setConVideo(!mq.matches);
    aplicar();
    mq.addEventListener("change", aplicar);
    return () => mq.removeEventListener("change", aplicar);
  }, [hayVideo]);

  // playbackRate es propiedad del elemento, no atributo: no se puede poner en
  // el JSX y se pierde si el navegador recarga el recurso.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.playbackRate = 0.5;
    const fijar = () => {
      v.playbackRate = 0.5;
    };
    v.addEventListener("loadedmetadata", fijar);
    return () => v.removeEventListener("loadedmetadata", fijar);
  }, [conVideo]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element -- fondo decorativo
          a sangre; next/image no aporta aquí y el póster ya sale optimizado del
          pipeline de ffmpeg con el ancho exacto que se usa. */}
      <img
        src={poster}
        alt=""
        className="absolute inset-0 size-full object-cover opacity-85"
      />
      {conVideo && (
        <video
          ref={ref}
          className="absolute inset-0 size-full object-cover opacity-85"
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      )}
      {/* Velo de tinta: sin él el titular no llega a contraste AA sobre el
          vídeo, que cambia de luminancia a lo largo del bucle. */}
      <div className="absolute inset-0 bg-ink/[0.28]" />
    </div>
  );
}
