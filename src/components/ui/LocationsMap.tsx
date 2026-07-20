import type { Location } from "@/data/locations";
import { Curtain } from "@/components/motion/Curtain";
import { cn } from "@/lib/cn";

/**
 * Mapa esquemático (no fotografía satelital): solo retícula, posición y dato.
 * Verificado en Contacto.dc.html — pura gráfica CSS, no es un image-slot.
 * El propio `.tp-mapwrap` lleva `data-curtain` en el código real (no una
 * foto separada dentro): la cortina envuelve el mapa esquemático mismo.
 */
export function LocationsMap({ locations }: { locations: Location[] }) {
  return (
    <div>
      <Curtain
        className="aspect-4/3 w-full border border-paper/20 bg-brand-deep sm:aspect-video"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(245,242,238,0.05) 0 1px, transparent 1px 32px), repeating-linear-gradient(90deg, rgba(245,242,238,0.05) 0 1px, transparent 1px 32px)",
        }}
      >
        <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-widest text-paper/40">
          Ecuador · esc. no métrica
        </span>
        <span className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-widest text-paper/40">
          N ↑
        </span>
        <span className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-widest text-paper/40">
          — Quito · Valle de los Chillos
        </span>
        <span className="absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-widest text-paper/40">
          Costa · Guayaquil —
        </span>

        {locations.map((location) => (
          <div
            key={location.ref}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
            style={{ left: `${location.position.left}%`, top: `${location.position.top}%` }}
          >
            <span
              className={cn(
                "block rounded-full",
                location.isMatriz ? "size-3 bg-brand" : "size-2 bg-accent",
              )}
              style={
                location.isMatriz
                  ? { boxShadow: "0 0 0 5px rgba(51,162,220,0.18)" }
                  : undefined
              }
            />
            <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-paper/80">
              {location.name}
            </span>
          </div>
        ))}
      </Curtain>

      <div className="mt-4 flex flex-wrap items-center gap-6 font-mono text-xs uppercase tracking-widest text-graphite">
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
    </div>
  );
}
