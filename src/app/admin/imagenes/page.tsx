import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import {
  SLOTS,
  ordenPagina,
  tituloPagina,
  type SlotImagen,
} from "@/data/slots-imagen";
import { SLOTS_LLENOS } from "@/data/imagenes.generado";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Estado de imágenes",
  // No debe indexarse aunque alguien la despliegue por error.
  robots: { index: false, follow: false },
};

/**
 * Inventario visual del material fotográfico, ORGANIZADO POR PÁGINA. Es la
 * herramienta con la que se le pide el material a marketing: entrar en una
 * página y ver de un vistazo todo lo que tiene y lo que le falta, cabecera
 * incluida.
 *
 * Antes agrupaba por un campo `grupo` de texto libre, y las cabeceras vivían
 * todas juntas en su propio grupo. El efecto: Inicio figuraba con una sola
 * imagen cuando en realidad tiene su hero MÁS las demás, y el hero salía
 * listado lejos de la página a la que pertenece. Ahora cada slot declara su
 * `pagina` (la ruta real) y aquí se agrupa por ella, en orden de navegación;
 * dentro de cada página, la cabecera primero y luego el resto por secciones.
 *
 * SOLO EN DESARROLLO. En producción devuelve 404: es una vista interna que
 * enseña la estructura completa del catálogo, incluidos huecos vacíos. La
 * comprobación es de servidor y `NODE_ENV` es constante en build, así que el
 * contenido no llega al cliente.
 */

/** El hero encabeza; el resto de secciones en el orden en que se registraron. */
function ordenSeccion(slots: SlotImagen[], seccion: string): number {
  if (seccion === "Cabecera") return -1;
  // Primer índice de aparición de la sección en la lista de la página.
  return slots.findIndex((s) => (s.seccion ?? "") === seccion);
}

export default function AdminImagenesPage() {
  if (process.env.NODE_ENV === "production") notFound();

  // Agrupar por página, en orden de navegación.
  const porPagina = new Map<string, SlotImagen[]>();
  for (const slot of SLOTS) {
    const lista = porPagina.get(slot.pagina) ?? [];
    lista.push(slot);
    porPagina.set(slot.pagina, lista);
  }
  const paginas = [...porPagina.entries()].sort(
    ([a], [b]) => ordenPagina(a) - ordenPagina(b),
  );

  const llenos = SLOTS.filter((s) => SLOTS_LLENOS.has(s.id)).length;
  const pct = Math.round((llenos / SLOTS.length) * 100);

  return (
    <Container className="flex flex-col gap-12 py-16">
      <header className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          Interno · solo desarrollo
        </span>
        <h1 className="font-sans text-h1 font-medium tracking-[-0.02em] text-ink">
          Estado de imágenes
        </h1>
        <p className="max-w-2xl font-serif text-body-m text-graphite">
          Inventario por página: cada bloque es una página del sitio con todos
          sus huecos, la cabecera incluida. Deja el archivo en{" "}
          <code className="font-mono text-ink">entrega/</code> con el nombre
          exacto que aparece bajo cada hueco y corre{" "}
          <code className="font-mono text-ink">npm run imagenes</code>. La
          extensión da igual (jpg, png, webp): lo que importa es el nombre.
        </p>
        <div className="flex items-baseline gap-3">
          <span className="font-sans text-h2 font-medium text-ink">
            {llenos}
            <span className="text-graphite">/{SLOTS.length}</span>
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-graphite">
            {pct}% con imagen
          </span>
        </div>
        <div className="h-1 w-full max-w-md bg-greige">
          <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
        </div>
        {/* Índice de páginas: salta a cada bloque. */}
        <nav className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
          {paginas.map(([ruta]) => (
            <a
              key={ruta}
              href={`#pagina-${ruta === "/" ? "inicio" : ruta.replace(/\//g, "-")}`}
              className="font-mono text-xs uppercase tracking-widest text-graphite hover:text-brand"
            >
              {tituloPagina(ruta)}
            </a>
          ))}
        </nav>
      </header>

      {paginas.map(([ruta, slots]) => {
        const llenosPagina = slots.filter((s) => SLOTS_LLENOS.has(s.id)).length;

        // Secciones dentro de la página: cabecera primero, resto en orden de
        // registro. Los huecos sin sección son el contenido principal.
        const secciones = [...new Set(slots.map((s) => s.seccion ?? ""))].sort(
          (a, b) => ordenSeccion(slots, a) - ordenSeccion(slots, b),
        );

        return (
          <section
            key={ruta}
            id={`pagina-${ruta === "/" ? "inicio" : ruta.replace(/\//g, "-")}`}
            className="flex scroll-mt-24 flex-col gap-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b-2 border-ink pb-2">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="font-sans text-h2 font-medium text-ink">
                  {tituloPagina(ruta)}
                </h2>
                <code className="font-mono text-xs text-graphite">{ruta}</code>
              </div>
              <span
                className={cn(
                  "font-mono text-xs uppercase tracking-widest",
                  llenosPagina === slots.length ? "text-brand" : "text-graphite",
                )}
              >
                {llenosPagina} de {slots.length}
              </span>
            </div>

            {secciones.map((seccion) => {
              const slotsSeccion = slots.filter(
                (s) => (s.seccion ?? "") === seccion,
              );
              return (
                <div key={seccion || "principal"} className="flex flex-col gap-3">
                  {seccion && (
                    <h3 className="font-mono text-xs uppercase tracking-widest text-graphite">
                      {seccion}
                    </h3>
                  )}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {slotsSeccion.map((slot) => {
                      const lleno = SLOTS_LLENOS.has(slot.id);
                      return (
                        <div key={slot.id} className="flex flex-col gap-1.5">
                          <div
                            className={cn(
                              "relative aspect-4/3 overflow-hidden border",
                              lleno
                                ? "border-greige"
                                : "border-dashed border-graphite/40",
                            )}
                          >
                            {lleno ? (
                              <Image
                                src={slot.destino}
                                alt={slot.alt}
                                fill
                                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <span className="font-mono text-[11px] uppercase tracking-widest text-graphite">
                                  vacío
                                </span>
                              </div>
                            )}
                          </div>
                          {/* El nombre de archivo es el dato útil: seleccionable
                              y en mono para poder copiarlo. */}
                          <code
                            className={cn(
                              "select-all break-all font-mono text-[11px]",
                              lleno ? "text-graphite" : "text-ink",
                            )}
                          >
                            {slot.id}.jpg
                          </code>
                          {slot.nota && !lleno && (
                            <p className="font-serif text-[12px] leading-snug text-graphite">
                              {slot.nota}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>
        );
      })}
    </Container>
  );
}
