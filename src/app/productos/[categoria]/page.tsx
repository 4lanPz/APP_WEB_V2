import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SubcategoryTile } from "@/components/ui/SubcategoryTile";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DraftNotice } from "@/components/ui/DraftNotice";
import { getCategory, categories } from "@/data/taxonomy";
import { estadoFicha } from "@/data/fichas";
import { fotoDeTela } from "@/data/imagenes";

interface Props {
  params: Promise<{ categoria: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const category = await getCategory(categoria);
  if (!category) return {};
  return {
    title: `${category.name} — Textil Padilla`,
    description: category.description,
  };
}

/**
 * Categorías reales del catálogo sin ficha propia todavía (Texturizado,
 * Spun, Polialgodón) — "página en preparación" coherente, no un 404 roto.
 * (Microfibra y Camisetas tienen página estática dedicada, que Next.js
 * prioriza automáticamente sobre esta ruta dinámica.)
 */
export default async function CategoriaPage({ params }: Props) {
  const { categoria } = await params;
  const category = await getCategory(categoria);
  if (!category) notFound();

  return (
    <Container id="en-preparacion" className="flex flex-col gap-6 py-16 sm:py-24">
      <Breadcrumb
        items={[
          { label: "Productos", href: "/productos" },
          { label: "Categorías", href: "/productos#categorias" },
          { label: category.name },
        ]}
      />
      <DraftNotice>Categoría en preparación</DraftNotice>
      <h1 className="font-sans text-h1 font-medium tracking-[-0.02em] text-ink">
        {category.name}
      </h1>
      <p className="max-w-xl font-serif text-body-l text-graphite">
        {category.description} Estamos publicando las fichas de esta familia
        una a una; mientras tanto, esta es su estructura completa de
        catálogo.
      </p>

      <div className="mt-6">
        <SectionHeader
          index={String(category.index).padStart(2, "0")}
          title="Subcategorías"
          tag={`${category.subcategories.length} referencias`}
        />
        <div className="grid grid-cols-1 gap-px border border-greige bg-greige sm:grid-cols-2 lg:grid-cols-3">
          {category.subcategories.map((sub, i) => {
            const estado = estadoFicha(sub.slug);
            return (
              <SubcategoryTile
                key={sub.slug}
                href={
                  estado === "sin-ficha"
                    ? `/productos/${category.slug}/${sub.slug}#en-preparacion`
                    : `/productos/${category.slug}/${sub.slug}`
                }
                index={String(i + 1).padStart(2, "0")}
                title={sub.name}
                estado={estado}
                foto={fotoDeTela(sub.slug)}
              />
            );
          })}
        </div>
      </div>
    </Container>
  );
}

export async function generateStaticParams() {
  return categories
    .filter((category) => !category.available)
    .map((category) => ({ categoria: category.slug }));
}
