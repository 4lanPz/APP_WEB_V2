"use client";

import dynamic from "next/dynamic";
import type { Location } from "@/data/locations";

/**
 * Carga diferida del mapa.
 *
 * `ssr: false` no es una preferencia: Leaflet toca `window` al importarse, así
 * que en el servidor revienta. Además saca sus ~150 kB del bundle inicial de
 * Contacto, que es lo que pedía el requisito de no bloquear el primer render.
 *
 * El hueco reserva exactamente la misma caja que el mapa —hairline greige y la
 * misma proporción— para que al llegar no empuje nada y no haya salto de
 * maquetación.
 */
const MapaLocales = dynamic(
  () => import("./MapaLocales").then((m) => m.MapaLocales),
  {
    ssr: false,
    loading: () => (
      <div className="relative aspect-4/3 w-full border border-greige bg-brand-deep sm:aspect-video">
        <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-widest text-paper/40">
          Cargando mapa…
        </span>
      </div>
    ),
  },
);

export function LocationsMap({ locations }: { locations: Location[] }) {
  return <MapaLocales locations={locations} />;
}
