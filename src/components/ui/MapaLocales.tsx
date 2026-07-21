"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { comoLlegar, PENDING, type Location } from "@/data/locations";
import { cn } from "@/lib/cn";

/**
 * Mapa real de los locales — Leaflet sobre teselas monocromáticas de CARTO.
 *
 * POR QUÉ LEAFLET Y NO GOOGLE: el mapa aquí es superficie editorial, y el estilo
 * por defecto de Google contradice §12 y §15 del Brand Experience. CARTO Dark
 * Matter es monocromo y no pide clave ni facturación. Google sí aparece, pero
 * solo en "Cómo llegar", que es navegación y no exposición.
 *
 * POR QUÉ DARK MATTER Y NO POSITRON: la sección #mapa es `bg-brand-deep`. Un
 * Positron blanco dentro de una banda oscura es un rectángulo que grita. Dark
 * Matter es la variante monocroma oscura de la misma familia.
 *
 * POR QUÉ LEAFLET PELADO Y NO react-leaflet: la ficha del local tiene que ser
 * tipografía del sistema, no el popup de Leaflet. Con la selección en estado de
 * React la ficha es un componente normal y el popup de Leaflet no se usa nunca.
 *
 * MOVIMIENTO: nada de vuelo al cargar —el encuadre inicial se fija de golpe—. Al
 * pulsar un marcador sí se centra, y ahí se consulta `prefers-reduced-motion`
 * para decidir si se anima. Se consulta en un efecto, no en el render, porque
 * este componente solo se monta en cliente y así no hay dos verdades.
 */

/** Teselas monocromas de CARTO. Sin clave; la licencia exige la atribución. */
const TESELAS = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const ATRIBUCION = "© OpenStreetMap · © CARTO";

/**
 * Marcador del sistema, no el pin azul por defecto de Leaflet. Reproduce el
 * punto del mapa esquemático anterior —azul de marca con halo para la matriz,
 * terracota para los locales— para que el mapa, la leyenda y los puntos de la
 * tabla de abajo sigan diciendo lo mismo.
 */
function icono(location: Location, activo: boolean): L.DivIcon {
  const lado = location.isMatriz ? 14 : 10;
  const color = location.isMatriz ? "#33A2DC" : "#A0715A";
  // El halo crece con la selección: es la única señal de "este es el abierto"
  // que sobrevive sin depender del color, que ya codifica matriz/local.
  const halo = activo
    ? `0 0 0 6px ${location.isMatriz ? "rgba(51,162,220,0.32)" : "rgba(160,113,90,0.32)"}`
    : location.isMatriz
      ? "0 0 0 5px rgba(51,162,220,0.18)"
      : "none";

  return L.divIcon({
    className: "", // sin la clase de Leaflet: trae fondo y borde propios
    iconSize: [lado, lado],
    iconAnchor: [lado / 2, lado / 2],
    html: `<span style="display:block;width:${lado}px;height:${lado}px;border-radius:9999px;background:${color};box-shadow:${halo};transition:box-shadow 180ms"></span>`,
  });
}

export function MapaLocales({ locations }: { locations: Location[] }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const mapa = useRef<L.Map | null>(null);
  const marcadores = useRef<Map<string, L.Marker>>(new Map());
  const [activo, setActivo] = useState<Location | null>(null);

  useEffect(() => {
    if (!contenedor.current || mapa.current) return;

    // Copia local para la limpieza: en el momento en que corre, `marcadores.current`
    // ya podría apuntar a otro sitio.
    const registro = marcadores.current;

    const menosMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const m = L.map(contenedor.current, {
      // La atribución por defecto de Leaflet trae su propio tamaño y color. Se
      // apaga y se pinta abajo con la tipografía del sistema; la licencia pide
      // que se vea, no que la dibuje Leaflet.
      attributionControl: false,
      scrollWheelZoom: false, // atrapar la rueda dentro del mapa da mala página
      zoomAnimation: !menosMovimiento,
      fadeAnimation: !menosMovimiento,
      markerZoomAnimation: !menosMovimiento,
    });

    L.tileLayer(TESELAS, { maxZoom: 19, subdomains: "abcd" }).addTo(m);

    // Encuadre inicial de golpe, sin vuelo: los locales van de Quito a
    // Samborondón y una animación entre esos dos extremos es mareante.
    m.fitBounds(L.latLngBounds(locations.map((l) => l.coords)), {
      padding: [56, 56],
      animate: false,
    });

    for (const location of locations) {
      const marcador = L.marker(location.coords, {
        icon: icono(location, false),
        title: location.name,
        // Sin esto el marcador no existe para el teclado ni para el lector.
        keyboard: true,
        alt: `${location.name} — ${location.zone}`,
      })
        .addTo(m)
        .on("click", () => setActivo(location));
      registro.set(location.ref, marcador);
    }

    mapa.current = m;
    return () => {
      m.remove();
      mapa.current = null;
      registro.clear();
    };
  }, [locations]);

  // Repinta los iconos y centra en el seleccionado. Va aparte del montaje para
  // no rehacer el mapa entero en cada clic.
  useEffect(() => {
    for (const location of locations) {
      marcadores.current
        .get(location.ref)
        ?.setIcon(icono(location, activo?.ref === location.ref));
    }
    if (!activo || !mapa.current) return;
    const menosMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    mapa.current.setView(activo.coords, Math.max(mapa.current.getZoom(), 14), {
      animate: !menosMovimiento,
    });
  }, [activo, locations]);

  return (
    <div>
      {/*
       * Índice de locales. No es un adorno: en el encuadre inicial —de Quito a
       * Samborondón, unos 430 km— los cuatro locales de la sierra caen a pocos
       * píxeles unos de otros y sus marcadores se tapan entre sí; medido con un
       * navegador real, el marcador de Sangolquí intercepta el clic destinado al
       * de Alangasí. Con el índice cada local se puede elegir siempre, se llega
       * por teclado, y el mapa se acerca lo suficiente para que además el
       * marcador sea pulsable.
       */}
      <div className="mb-4 flex flex-wrap gap-px border border-greige bg-greige">
        {locations.map((location) => {
          const seleccionado = activo?.ref === location.ref;
          return (
            <button
              key={location.ref}
              type="button"
              onClick={() => setActivo(seleccionado ? null : location)}
              aria-pressed={seleccionado}
              className={cn(
                "flex grow items-center justify-center gap-2 px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-colors",
                seleccionado
                  ? "bg-paper text-ink"
                  : "bg-brand-deep text-paper/70 hover:text-paper",
              )}
            >
              <span
                className={cn(
                  "block size-1.5 shrink-0 rounded-full",
                  location.isMatriz ? "bg-brand" : "bg-accent",
                )}
              />
              {location.name}
            </button>
          );
        })}
      </div>

      {/* Hairline greige, sin sombra ni esquina redondeada — como el resto de
          superficies del sitio. El z-0 mete a Leaflet en su propio contexto de
          apilado: sus panes usan z-index altos y sin esto se montan sobre la
          barra de navegación. */}
      <div className="relative z-0 aspect-4/3 w-full border border-greige sm:aspect-video">
        <div ref={contenedor} className="size-full bg-brand-deep" />

        {activo && (
          <FichaLocal location={activo} onCerrar={() => setActivo(null)} />
        )}

        {/* A la derecha a propósito: a la izquierda lo tapa el control de zoom
            de Leaflet. */}
        {!activo && (
          <span className="pointer-events-none absolute right-4 top-4 z-500 font-mono text-[10px] uppercase tracking-widest text-paper/50">
            Elige un local o pulsa un marcador
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex flex-wrap items-center gap-6 font-mono text-xs uppercase tracking-widest text-graphite">
          <span className="flex items-center gap-2.5">
            <span
              className="block size-2 rounded-full bg-brand"
              style={{ boxShadow: "0 0 0 4px rgba(51,162,220,0.18)" }}
            />
            Matriz de producción
          </span>
          <span className="flex items-center gap-2.5">
            <span className="block size-1.5 rounded-full bg-accent" />
            Local de atención
          </span>
        </div>
        {/* Atribución exigida por la licencia de OSM/CARTO: visible, pero en la
            tipografía del sitio y sin robar peso al mapa. */}
        <span className="font-mono text-[11px] text-graphite">{ATRIBUCION}</span>
      </div>
    </div>
  );
}

/**
 * Ficha del local seleccionado. Es un componente de React sobre el mapa, no un
 * `L.popup`: así usa la tipografía del sistema y no hereda la caja blanca con
 * esquina redondeada y pico que trae Leaflet.
 */
function FichaLocal({
  location,
  onCerrar,
}: {
  location: Location;
  onCerrar: () => void;
}) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-500 border-t border-greige bg-paper p-5 sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-w-xs sm:border">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-widest text-accent">
            {location.ref}
            <span
              className={cn(
                "block size-1.5 shrink-0 rounded-full",
                location.isMatriz ? "bg-brand" : "bg-accent",
              )}
            />
            {location.zone}
          </span>
          <h3 className="mt-2 font-sans text-[17px] font-semibold text-ink">
            {location.name}
          </h3>
        </div>
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar ficha del local"
          className="-m-2 p-2 font-mono text-xs text-graphite hover:text-ink"
        >
          ✕
        </button>
      </div>

      <dl className="mt-3 flex flex-col gap-1.5 font-mono text-[13px]">
        <div>
          <dt className="sr-only">Sector</dt>
          <dd className="text-ink">{location.sector}</dd>
        </div>
        <div>
          <dt className="sr-only">Dirección</dt>
          {/* La ficha de Google da coordenada, no calle y número. Mientras
              administración no la entregue, se dice que falta. */}
          <dd className="text-graphite">{PENDING}</dd>
        </div>
      </dl>

      <a
        href={comoLlegar(location)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block font-sans text-[15px] font-medium text-ink hover:text-brand"
      >
        Cómo llegar ↗
      </a>
    </div>
  );
}
