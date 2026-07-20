import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PreparacionPage } from "@/components/ui/PreparacionPage";
import { getTone, categories } from "@/data/taxonomy";

interface Props {
  params: Promise<{ categoria: string; subcategoria: string; tono: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria, subcategoria, tono } = await params;
  const result = await getTone(categoria, subcategoria, tono);
  if (!result) return {};
  return { title: `${result.subcategory.name} · ${result.tone.name} — Textil Padilla` };
}

/**
 * Tonos reales (p. ej. Dortmund Plus → Claros/Medios/Oscuros/Especiales)
 * sin ficha propia todavía — "en preparación" coherente. Blancos nunca
 * llega aquí: su página estática tiene prioridad.
 */
export default async function TonoPage({ params }: Props) {
  const { categoria, subcategoria, tono } = await params;
  const result = await getTone(categoria, subcategoria, tono);
  if (!result) notFound();
  const { category, subcategory, tone: toneData } = result;

  return (
    <PreparacionPage
      breadcrumb={[
        { label: "Productos", href: "/productos" },
        { label: category.name, href: `/productos/${category.slug}` },
        {
          label: subcategory.name,
          href: `/productos/${category.slug}/${subcategory.slug}`,
        },
        { label: toneData.name },
      ]}
      title={`${subcategory.name} · ${toneData.name}`}
      description={toneData.description}
      backHref={`/productos/${category.slug}/${subcategory.slug}`}
      backLabel={`Ver ${subcategory.name} →`}
    />
  );
}

export async function generateStaticParams() {
  return categories.flatMap((category) =>
    category.subcategories.flatMap((sub) =>
      (sub.tones ?? [])
        .filter((tone) => !tone.available)
        .map((tone) => ({
          categoria: category.slug,
          subcategoria: sub.slug,
          tono: tone.slug,
        })),
    ),
  );
}
