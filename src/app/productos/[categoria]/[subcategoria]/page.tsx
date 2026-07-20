import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PreparacionPage } from "@/components/ui/PreparacionPage";
import { getSubcategory, categories } from "@/data/taxonomy";

interface Props {
  params: Promise<{ categoria: string; subcategoria: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria, subcategoria } = await params;
  const result = await getSubcategory(categoria, subcategoria);
  if (!result) return {};
  return { title: `${result.subcategory.name} — Textil Padilla` };
}

/**
 * Cualquier subcategoría real del catálogo sin ficha propia — "en
 * preparación" coherente. Dortmund Plus nunca llega aquí: su página
 * estática (/productos/microfibra/dortmund-plus) tiene prioridad.
 */
export default async function SubcategoriaPage({ params }: Props) {
  const { categoria, subcategoria } = await params;
  const result = await getSubcategory(categoria, subcategoria);
  if (!result) notFound();
  const { category, subcategory } = result;

  return (
    <PreparacionPage
      breadcrumb={[
        { label: "Productos", href: "/productos" },
        { label: category.name, href: `/productos/${category.slug}` },
        { label: subcategory.name },
      ]}
      title={subcategory.name}
      description={`Construcción de la familia ${category.name}. Todavía no publicamos su ficha técnica ni carta de color —se produce y se tiñe a pedido.`}
      backHref={`/productos/${category.slug}`}
      backLabel={`Ver ${category.name} →`}
    />
  );
}

export async function generateStaticParams() {
  return categories.flatMap((category) =>
    category.subcategories
      .filter((sub) => !sub.available)
      .map((sub) => ({ categoria: category.slug, subcategoria: sub.slug })),
  );
}
