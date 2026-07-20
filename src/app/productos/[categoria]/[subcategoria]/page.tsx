import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PreparacionPage } from "@/components/ui/PreparacionPage";
import { FichaSubcategoria } from "@/components/product/FichaSubcategoria";
import { getSubcategory, categories } from "@/data/taxonomy";
import { getFichaTecnica } from "@/data/fichas";
import { tienePaginaPropia } from "@/lib/rutas";

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
 * Ruta de tela. Dos ramas:
 *  - con ficha técnica del cliente → `FichaSubcategoria`
 *  - sin ficha → "en preparación", que al menos ofrece salida al asesor
 *
 * Dortmund Plus nunca llega aquí: su página estática tiene prioridad (ver
 * `SUBCATEGORIAS_CON_PAGINA_PROPIA` en `lib/rutas.ts`).
 */
export default async function SubcategoriaPage({ params }: Props) {
  const { categoria, subcategoria } = await params;
  const result = await getSubcategory(categoria, subcategoria);
  if (!result) notFound();
  const { category, subcategory } = result;

  const breadcrumb = [
    { label: "Productos", href: "/productos" },
    { label: category.name, href: `/productos/${category.slug}` },
    { label: subcategory.name },
  ];

  const ficha = await getFichaTecnica(subcategory.slug);

  if (!ficha) {
    return (
      <PreparacionPage
        breadcrumb={breadcrumb}
        title={subcategory.name}
        description={`Construcción de la familia ${category.name}. Todavía no publicamos su ficha técnica ni carta de color —se produce y se tiñe a pedido.`}
        backHref={`/productos/${category.slug}`}
        backLabel={`Ver ${category.name} →`}
      />
    );
  }

  return (
    <FichaSubcategoria
      breadcrumb={breadcrumb}
      category={category}
      subcategory={subcategory}
      ficha={ficha}
    />
  );
}

export async function generateStaticParams() {
  return categories.flatMap((category) =>
    category.subcategories
      .filter((sub) => !tienePaginaPropia(category.slug, sub.slug))
      .map((sub) => ({ categoria: category.slug, subcategoria: sub.slug })),
  );
}
