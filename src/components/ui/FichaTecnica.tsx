import { PENDIENTE } from "@/data/fichas";

export interface FichaTecnicaRowProps {
  label: string;
  /**
   * `null` = dato sin confirmar. Se pasa `null` y no el string `PENDIENTE` a
   * propósito: si el componente decidiera el estilo comparando el texto, un
   * valor libre que casualmente dijera "Pendiente de confirmar" se pintaría
   * como pendiente sin serlo.
   */
  value: string | null;
}

export interface FichaTecnicaProps {
  rows: FichaTecnicaRowProps[];
  title?: string;
}

/**
 * Tabla de especificaciones. Extraída de la página de Dortmund Plus · Blancos,
 * que era el único sitio donde existía, para que la ruta dinámica de tela y esa
 * página no diverjan visualmente.
 *
 * Es una tabla pura: el aviso de datos pendientes (`DraftNotice`) va fuera, a
 * nivel de bloque, como en `contacto/page.tsx`.
 */
export function FichaTecnica({ rows, title = "Ficha técnica" }: FichaTecnicaProps) {
  return (
    <div>
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-graphite">
        {title}
      </p>
      <div className="border-t border-greige">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 border-b border-greige py-3.75"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-graphite">
              {row.label}
            </span>
            {row.value === null ? (
              <span className="text-right font-mono text-[13px] text-graphite">
                {PENDIENTE}
              </span>
            ) : (
              <span className="text-right font-sans text-[15px] font-medium text-ink">
                {row.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
