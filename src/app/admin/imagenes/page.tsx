import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SLOTS, type SlotImagen } from "@/data/slots-imagen";
import { SLOTS_LLENOS } from "@/data/imagenes.generado";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Estado de imágenes",
  // No debe indexarse aunque alguien la despliegue por error.
  robots: { index: false, follow: false },
};

/**
 * Lista de tareas visual: qué huecos de imagen tiene el sitio, cuáles están
 * llenos y —lo importante— cómo hay que llamar al archivo para llenar cada uno.
 *
 * SOLO EN DESARROLLO. En producción devuelve 404: es una vista interna que
 * enseña la estructura completa del catálogo, incluidos huecos vacíos, y no
 * tiene por qué ser pública. La comprobación es de servidor y `NODE_ENV` es
 * constante en build, así que el contenido no llega al cliente.
 */
export default function AdminImagenesPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const grupos = new Map<string, SlotImagen[]>();
  for (const slot of SLOTS) {
    const lista = grupos.get(slot.grupo) ?? [];
    lista.push(slot);
    grupos.set(slot.grupo, lista);
  }

  const llenos = SLOTS.filter((s) => SLOTS_LLENOS.has(s.id)).length;
  const pct = Math.round((llenos / SLOTS.length) * 100);

  return (
    <Container className="flex flex-col gap-10 py-16">
      <header className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          Interno · solo desarrollo
        </span>
        <h1 className="font-sans text-h1 font-medium tracking-[-0.02em] text-ink">
          Estado de imágenes
        </h1>
        <p className="max-w-2xl font-serif text-body-m text-graphite">
          Deja el archivo en <code className="font-mono text-ink">entrega/</code>{" "}
          con el nombre exacto que aparece bajo cada hueco y corre{" "}
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
      </header>

      {[...grupos].map(([grupo, slots]) => {
        const llenosGrupo = slots.filter((s) => SLOTS_LLENOS.has(s.id)).length;
        return (
          <section key={grupo} className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-3 border-b border-greige pb-2">
              <h2 className="font-sans text-h3 font-semibold text-ink">{grupo}</h2>
              <span
                className={cn(
                  "font-mono text-xs uppercase tracking-widest",
                  llenosGrupo === slots.length ? "text-brand" : "text-graphite",
                )}
              >
                {llenosGrupo} de {slots.length}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {slots.map((slot) => {
                const lleno = SLOTS_LLENOS.has(slot.id);
                return (
                  <div key={slot.id} className="flex flex-col gap-1.5">
                    <div
                      className={cn(
                        "relative aspect-4/3 overflow-hidden border",
                        lleno ? "border-greige" : "border-dashed border-graphite/40",
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
                    {/* El nombre de archivo es el dato útil de esta página: se
                        muestra seleccionable y en mono para poder copiarlo. */}
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
          </section>
        );
      })}
    </Container>
  );
}
