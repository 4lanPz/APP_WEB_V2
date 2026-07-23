import { Container } from "@/components/ui/Container";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { DraftNotice } from "@/components/ui/DraftNotice";
import { FichaTecnica } from "@/components/ui/FichaTecnica";
import { GaleriaTela } from "@/components/ui/GaleriaTela";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { buttonVariants } from "@/components/ui/buttonVariants";
import { valorEstandar, type FichaPublicable } from "@/data/fichas";
import { vistasDeTela } from "@/data/imagenes";
import type { Category, Subcategory } from "@/data/taxonomy";
import { cn } from "@/lib/cn";

interface Props {
  breadcrumb: BreadcrumbItem[];
  category: Category;
  subcategory: Subcategory;
  ficha: FichaPublicable;
}

/**
 * Página de una tela con ficha técnica del cliente.
 *
 * Se muestra solo la calidad LC (estándar). El cliente mide tres calidades
 * (LCI/LC/LCD) y el dato está en `fichas.ts`, pero la tabla de tres columnas es
 * un componente que no estaba en el diseño aprobado — queda como propuesta.
 */
export function FichaSubcategoria({
  breadcrumb,
  category,
  subcategory,
  ficha,
}: Props) {
  const vistas = vistasDeTela(subcategory.slug);

  const rows = [
    { label: "Composición", value: ficha.composicion },
    { label: "Ancho tubular", value: valorEstandar(ficha.anchoTubular, "m") },
    { label: "Gramaje", value: valorEstandar(ficha.pesoPorArea, "g/m²") },
    { label: "Rendimiento", value: valorEstandar(ficha.rendimiento, "m/kg") },
    { label: "Uso de confección", value: ficha.usoConfeccion },
  ];

  return (
    <Container className="py-10 sm:py-16">
      <Breadcrumb items={breadcrumb} />

      <div className="mt-8 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        {/*
          Galería: con ≥1 foto real aparece completa —principal + miniaturas,
          con recuadros marcador para las vistas que faltan, lupa en escritorio
          y visor con pellizco en móvil—. Sin ninguna foto real queda el hueco
          de siempre. No se pone una foto "parecida" para rellenar.
        */}
        <GaleriaTela
          vistas={vistas}
          caption={`${subcategory.name} · ${category.name}`}
          sizes="(min-width: 1024px) 55vw, 100vw"
        />

        <div className="flex flex-col gap-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-graphite">
              {category.name}
            </p>
            <h1 className="mt-3 font-sans text-h1 font-medium tracking-[-0.02em] text-ink">
              {subcategory.name}
            </h1>
          </div>

          {ficha.tieneDatosPendientes && (
            <div className="flex flex-col gap-3">
              <DraftNotice>Datos técnicos pendientes de confirmar</DraftNotice>
              {ficha.motivo && (
                <p className="font-serif text-caption italic text-graphite">
                  {ficha.motivo}
                </p>
              )}
            </div>
          )}

          <FichaTecnica rows={rows} />

          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-graphite">
              Sublimación
            </p>
            <div className="border-t border-greige">
              {ficha.sublimacion.map((fila) => (
                <div
                  key={fila.gramaje}
                  className="flex items-center justify-between gap-4 border-b border-greige py-3"
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-graphite">
                    {fila.gramaje}
                  </span>
                  <span className="text-right font-sans text-[15px] text-ink">
                    {fila.temperatura} · {fila.tiempo}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-graphite">
              Cuidados
            </p>
            <ul className="flex flex-col gap-2">
              {ficha.cuidados.map((cuidado) => (
                <li
                  key={cuidado}
                  className="font-serif text-body-m text-graphite"
                >
                  {cuidado}
                </li>
              ))}
            </ul>
          </div>

          <p className="font-serif text-caption italic text-graphite">
            Valores nominales con las tolerancias indicadas por el fabricante.
            La carta de color se publica cuando se produce el tono.
          </p>

          <div className="flex flex-col gap-4">
            <MagneticLink
              href="/contacto"
              className={cn(buttonVariants({ variant: "primary" }), "w-fit")}
            >
              Pedir muestra →
            </MagneticLink>
            <MagneticLink
              href={`/productos/${category.slug}`}
              className={cn(buttonVariants({ variant: "secondary" }), "w-fit")}
            >
              Ver {category.name} →
            </MagneticLink>
          </div>
        </div>
      </div>
    </Container>
  );
}
