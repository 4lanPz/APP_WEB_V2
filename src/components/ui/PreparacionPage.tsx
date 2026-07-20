import Link from "next/link";
import { Container } from "./Container";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";
import { buttonVariants } from "./buttonVariants";

export interface PreparacionPageProps {
  breadcrumb: BreadcrumbItem[];
  title: string;
  description?: string;
  backHref: string;
  backLabel: string;
}

/**
 * Estado coherente "página en preparación" para cualquier categoría,
 * subcategoría o tono real del catálogo que todavía no tiene ficha —
 * nunca un 404 roto para una referencia que sí existe en taxonomy.ts.
 */
export function PreparacionPage({
  breadcrumb,
  title,
  description,
  backHref,
  backLabel,
}: PreparacionPageProps) {
  return (
    <Container
      id="en-preparacion"
      className="flex min-h-[60vh] flex-col justify-center gap-6 py-24"
    >
      <Breadcrumb items={breadcrumb} />
      <span className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
        En preparación
      </span>
      <h1 className="max-w-2xl font-sans text-h1 font-medium tracking-[-0.02em] text-ink">
        {title}
      </h1>
      <p className="max-w-xl font-serif text-body-l text-graphite">
        {description ??
          "Todavía no publicamos la ficha de esta referencia. Se tiñe y se produce a pedido, como el resto del catálogo — iremos sumando datos y fotografía real."}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-6">
        <Link href={backHref} className={buttonVariants({ variant: "secondary" })}>
          {backLabel}
        </Link>
        <Link
          href="/asesor-virtual"
          className="font-sans text-[15px] font-medium text-ink hover:text-brand"
        >
          Hablar con el asesor virtual →
        </Link>
      </div>
    </Container>
  );
}
