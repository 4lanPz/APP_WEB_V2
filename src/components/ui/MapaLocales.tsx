"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { comoLlegar, PENDING, type Location } from "@/data/locations";
import { buttonVariants } from "./buttonVariants";
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

/** Teselas monocromas de CARTO Positron (claras). Sin clave; la licencia exige
 *  la atribución. */
const TESELAS = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const ATRIBUCION = "© OpenStreetMap · © CARTO";

/**
 * Caja táctil del marcador. El PUNTO sigue midiendo 14px (matriz) o 10px
 * (local) —el mapa se lee igual—, pero el elemento que recibe el toque es esta
 * caja de 44 con el punto centrado dentro. Antes el elemento medía exactamente
 * el punto: un objetivo de 10px es intocable con un dedo.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * POR QUÉ EL SOLAPE DEL RACIMO DE LA SIERRA NO SE ARREGLA AQUÍ
 *
 * Medido a 375px en el encuadre inicial, los centros de Matriz Alangasí, La
 * Marín, Solanda y Sangolquí caen a 1–6px unos de otros: los cuatro ocupan casi
 * el mismo píxel. Ya se tapaban entre sí cuando el marcador medía 10px, y con
 * 44 se tapan más. Guayaquil, a 100px, no toca a nadie.
 *
 * No es un problema de tamaño de objetivo, así que agrandarlo o encogerlo no lo
 * resuelve: la posición de un marcador la fija su coordenada, y el encuadre
 * inicial tiene que abarcar de Quito a Samborondón —unos 430km— porque ahí están
 * los locales. Cualquier caja, de 10 o de 44, cae dentro de la de al lado.
 * Separarlos exigiría moverlos de su coordenada —un marcador que miente sobre
 * dónde está el local— o agruparlos en un racimo que se abre al pulsarlo, que es
 * otro control y otra tanda.
 *
 * Lo que SÍ cubre el caso, y por eso existe: el índice de locales de abajo —cada
 * local se elige siempre, y por teclado— y el acercamiento al seleccionar uno,
 * que separa los marcadores hasta que son pulsables de verdad. Ver la nota del
 * índice, más abajo.
 * ───────────────────────────────────────────────────────────────────────────
 */
const CAJA_TACTIL = 44;

/**
 * Marcador del sistema, no el pin azul por defecto de Leaflet. Reproduce el
 * punto del mapa esquemático anterior —azul de marca con halo para la matriz,
 * terracota para los locales— para que el mapa, la leyenda y los puntos de la
 * tabla de abajo sigan diciendo lo mismo.
 *
 * El punto se pinta dentro de la caja de `CAJA_TACTIL`; ver ahí por qué el
 * toque no se mide sobre el punto.
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
    iconSize: [CAJA_TACTIL, CAJA_TACTIL],
    iconAnchor: [CAJA_TACTIL / 2, CAJA_TACTIL / 2],
    html:
      `<span style="display:flex;width:${CAJA_TACTIL}px;height:${CAJA_TACTIL}px;align-items:center;justify-content:center">` +
      `<span style="display:block;width:${lado}px;height:${lado}px;border-radius:9999px;background:${color};box-shadow:${halo};transition:box-shadow 180ms"></span>` +
      `</span>`,
  });
}

/**
 * Nombre accesible y tecla de activación del marcador. Las dos cosas van juntas
 * porque las dos las deja a medias Leaflet:
 *
 *  - NOMBRE. Solo pone `title` —tooltip del sistema, que un lector de pantalla
 *    puede o no anunciar— y el `alt` que se le pasa lo ignora en los `divIcon`,
 *    que no son `<img>`. Sin esto son cinco controles con `role="button"` y sin
 *    texto: el lector anuncia "botón" y nada más.
 *  - TECLA. Leaflet marca el marcador como `role="button"` y `tabindex="0"`,
 *    pero solo ata Enter cuando el marcador lleva un popup suyo (`bindPopup` →
 *    `_onKeyPress`), y aquí la ficha es un componente de React a propósito. Se
 *    llegaba al marcador con el tabulador y no pasaba nada al pulsar.
 *
 * Se reaplica en cada `setIcon`: ahí Leaflet reconstruye el elemento. Se usa la
 * propiedad `onkeydown` y no `addEventListener` para que reaplicarlo sustituya
 * al anterior en vez de acumular manejadores.
 */
function prepararMarcador(
  marcador: L.Marker,
  location: Location,
  activar: () => void,
) {
  const el = marcador.getElement();
  if (!el) return;
  el.setAttribute(
    "aria-label",
    `${location.name} — ${location.zone}. Ver ficha del local`,
  );
  el.onkeydown = (evento) => {
    if (evento.key !== "Enter" && evento.key !== " ") return;
    evento.preventDefault(); // el espacio, si no, hace scroll de la página
    activar();
  };
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
      prepararMarcador(marcador, location, () => setActivo(location));
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
      const marcador = marcadores.current.get(location.ref);
      if (!marcador) continue;
      marcador.setIcon(icono(location, activo?.ref === location.ref));
      prepararMarcador(marcador, location, () => setActivo(location));
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
    // Panel papel: las teselas Positron son casi blancas, y un bloque claro a
    // sangre dentro de la banda `bg-brand-deep` se lee como un widget incrustado,
    // no como parte del sistema. Matado en papel con su propio respiro, el mapa
    // pasa a leerse como una muestra prendida sobre la superficie oscura —misma
    // familia de superficie que la ficha del local, que también es papel—.
    <div className="bg-paper p-3 sm:p-4">
      {/*
       * LEYENDA ARRIBA (encima del mapa). Los dos marcadores van cada uno en
       * una caja de tamaño fijo (`size-3`) que centra el punto: la matriz lleva
       * halo (box-shadow) y punto mayor que el local, y sin esa caja los dos
       * textos arrancaban a distinta x y las líneas no cuadraban entre sí. El
       * halo se pinta fuera de la caja sin empujar el texto.
       */}
      <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-label uppercase text-graphite sm:mb-4">
        <span className="flex items-center gap-2.5">
          <span className="flex size-3 shrink-0 items-center justify-center">
            <span
              className="block size-2 rounded-full bg-brand"
              style={{ boxShadow: "0 0 0 4px rgba(51,162,220,0.18)" }}
            />
          </span>
          Matriz de producción
        </span>
        <span className="flex items-center gap-2.5">
          <span className="flex size-3 shrink-0 items-center justify-center">
            <span className="block size-1.5 rounded-full bg-accent" />
          </span>
          Local de atención
        </span>
      </div>

      {/* Hairline greige, sin sombra ni esquina redondeada — como el resto de
          superficies del sitio. El z-0 mete a Leaflet en su propio contexto de
          apilado: sus panes usan z-index altos y sin esto se montan sobre la
          barra de navegación. */}
      <div className="relative z-0 aspect-4/3 w-full border border-greige sm:aspect-video">
        <div ref={contenedor} className="size-full bg-bone" />

        {/*
          Ficha en ESCRITORIO: flotante en la esquina inferior izquierda del
          mapa, que ahí sobra sitio. En móvil no se pinta aquí —la caja del mapa
          es baja (4:3) y la ficha la tapaba entera—; va debajo del mapa (fuera
          de esta caja), ver más abajo.
        */}
        {activo && (
          <FichaLocal
            location={activo}
            onCerrar={() => setActivo(null)}
            className="absolute bottom-4 left-4 z-500 hidden max-w-xs border border-greige sm:block"
          />
        )}

        {/* Grafito, no papel: sobre las teselas claras de Positron un texto claro
            desaparece. A la derecha a propósito: a la izquierda lo tapa el
            control de zoom de Leaflet. */}
        {!activo && (
          <span className="pointer-events-none absolute right-4 top-4 z-500 font-mono text-micro uppercase tracking-widest text-graphite">
            Elige un local o pulsa un marcador
          </span>
        )}

        {/* Atribución exigida por la licencia (ODbL de OSM + términos de CARTO):
            NO es opcional, tiene que verse. Compacta en la esquina del mapa
            —tipografía menor y color de menos peso, sobre un velo papel para
            que se lea sobre las teselas— en vez de una fila propia que robaba
            altura al mapa. `pointer-events-none` para no atrapar el mapa. */}
        <span className="pointer-events-none absolute bottom-0 right-0 z-500 bg-paper/75 px-1.5 py-0.5 font-mono text-micro text-graphite/80">
          {ATRIBUCION}
        </span>
      </div>

      {/*
        Ficha en MÓVIL: debajo del mapa, no encima. El mapa se centra en el
        marcador elegido al seleccionar, así que queda entero a la vista con su
        punto, y la ficha se lee debajo sin taparlo.
      */}
      {activo && (
        <FichaLocal
          location={activo}
          onCerrar={() => setActivo(null)}
          className="mt-3 border border-greige sm:hidden"
        />
      )}

      {/*
       * ÍNDICE DE LOCALES, ABAJO. No es un adorno: en el encuadre inicial —de
       * Quito a Samborondón, unos 430 km— los cuatro locales de la sierra caen a
       * pocos píxeles unos de otros y sus marcadores se tapan entre sí; medido
       * con un navegador real, el marcador de Sangolquí intercepta el clic
       * destinado al de Alangasí. Con el índice cada local se puede elegir
       * siempre, se llega por teclado, y el mapa se acerca lo suficiente para
       * que además el marcador sea pulsable.
       *
       * Sigue siendo cierto después de subir la caja táctil del marcador a 44px:
       * el racimo se solapa por dónde caen las coordenadas, no por el tamaño del
       * objetivo. Ver la nota de `CAJA_TACTIL` arriba, con las distancias
       * medidas. Este índice es la vía fiable, no un adorno de respaldo.
       */}
      <div className="mt-3 flex flex-wrap gap-px border border-greige bg-greige sm:mt-4">
        {locations.map((location) => {
          const seleccionado = activo?.ref === location.ref;
          return (
            <button
              key={location.ref}
              type="button"
              onClick={() => setActivo(seleccionado ? null : location)}
              aria-pressed={seleccionado}
              className={cn(
                "flex grow items-center justify-center gap-2 px-4 py-2.5 font-mono text-micro uppercase tracking-widest transition-colors",
                seleccionado
                  ? "bg-ink text-paper"
                  : "bg-bone text-graphite hover:text-ink",
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
  className,
}: {
  location: Location;
  onCerrar: () => void;
  /** Posición/estado: flotante sobre el mapa en escritorio, bloque debajo en móvil. */
  className?: string;
}) {
  return (
    <div className={cn("bg-paper p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="flex items-center gap-2.5 font-mono text-micro uppercase tracking-widest text-accent">
            {location.ref}
            <span
              className={cn(
                "block size-1.5 shrink-0 rounded-full",
                location.isMatriz ? "bg-brand" : "bg-accent",
              )}
            />
            {location.zone}
          </span>
          <h3 className="mt-2 font-sans text-body-ml font-semibold text-ink">
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

      <dl className="mt-3 flex flex-col gap-1.5 font-mono text-caption">
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
        className={cn(buttonVariants({ variant: "enlace" }), "mt-4")}
      >
        Cómo llegar ↗
      </a>
    </div>
  );
}
