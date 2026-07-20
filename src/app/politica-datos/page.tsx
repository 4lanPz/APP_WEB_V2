import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Política de tratamiento de datos — Textil Padilla",
  robots: { index: false, follow: true },
};

/**
 * Verificado contra Politica Datos.dc.html: es un placeholder intencional,
 * no un documento legal completo. No inventamos cláusulas legales — se
 * respeta el mismo estado "pendiente de redacción legal" del export.
 */
export default function PoliticaDatosPage() {
  return (
    <Container className="flex flex-col gap-6 py-24">
      <span className="font-mono text-xs uppercase tracking-[0.08em] text-graphite">Legal</span>
      <h1 className="max-w-2xl font-sans text-display font-medium tracking-[-0.03em] text-ink">
        Política de tratamiento de datos
      </h1>
      <p className="max-w-xl font-serif text-body-l text-graphite">
        Contenido pendiente de redacción legal. Esta sección será completada
        por el equipo legal de Textil Padilla.
      </p>
      <div className="mt-6 border-t border-greige pt-6">
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-graphite">
          Documento en preparación
        </span>
      </div>
    </Container>
  );
}
