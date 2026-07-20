/**
 * Catálogo de Textil Padilla — Categoría → Subcategoría → Tono.
 *
 * Fuente: Excel de productos del cliente (líneas DE LÍNEA, Fase 2 kickoff).
 * Estructurado como si viniera de una API: los accesores son `async` a
 * propósito, para que en Fase 4 solo cambie la implementación (fetch a un
 * backend real) y no la forma en que las páginas consumen los datos.
 *
 * Solo Microfibra → Dortmund Plus → Blancos tiene ficha construida; el resto
 * resuelve a "página en preparación".
 */

export interface ProductTone {
  slug: string;
  name: string;
  /** Aproximación de color plano para el placeholder — no es el Pantone real. */
  swatchColor: string;
  description: string;
  available: boolean;
}

export interface FichaTecnicaRow {
  label: string;
  value: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface CareStep {
  title: string;
  description: string;
}

export interface RelatedFabric {
  name: string;
  description: string;
}

export interface ProductDetail {
  title: string;
  subtitle: string;
  description: string;
  fichaTecnica: FichaTecnicaRow[];
  swatches: ColorSwatch[];
  cuidados: CareStep[];
  related: RelatedFabric[];
}

export interface Subcategory {
  slug: string;
  name: string;
  available: boolean;
  tones?: ProductTone[];
}

export interface Category {
  slug: string;
  name: string;
  index: number;
  description: string;
  /** true solo si la categoría tiene al menos una subcategoría con página propia. */
  available: boolean;
  subcategories: Subcategory[];
}

export const categories: Category[] = [
  {
    slug: "microfibra",
    name: "Microfibra",
    index: 1,
    description:
      "Poliéster ligero de secado rápido para prenda deportiva.",
    available: true,
    subcategories: [
      { slug: "chelsea", name: "Chelsea", available: false },
      { slug: "athletic", name: "Athletic", available: false },
      { slug: "boston", name: "Boston", available: false },
      { slug: "dortmund", name: "Dortmund", available: false },
      { slug: "imperial", name: "Imperial", available: false },
      { slug: "sevilla", name: "Sevilla", available: false },
      { slug: "titanium", name: "Titanium", available: false },
      { slug: "chelsea-plus", name: "Chelsea Plus", available: false },
      { slug: "athletic-plus", name: "Athletic Plus", available: false },
      {
        slug: "dortmund-plus",
        name: "Dortmund Plus",
        available: true,
        tones: [
          {
            slug: "blancos",
            name: "Blancos",
            swatchColor: "#F5F2EE",
            description:
              "Blanco óptico y crudos. Base ideal para sublimación y estampado.",
            available: true,
          },
          {
            slug: "claros",
            name: "Claros",
            swatchColor: "#D9D2C6",
            description: "Pasteles y arenas. Tonos suaves de alta luminosidad.",
            available: false,
          },
          {
            slug: "medios",
            name: "Medios",
            swatchColor: "#8A8681",
            description: "Grises, jaspes y tonos tierra de intensidad media.",
            available: false,
          },
          {
            slug: "oscuros",
            name: "Oscuros",
            swatchColor: "#2A2A2E",
            description: "Marinos, negros y tonos profundos de color estable.",
            available: false,
          },
          {
            slug: "especiales",
            name: "Especiales",
            swatchColor: "#2F5566",
            description: "Tonos de temporada y desarrollos a pedido del cliente.",
            available: false,
          },
        ],
      },
      { slug: "equatex-plus", name: "Equatex Plus", available: false },
      { slug: "juventus", name: "Juventus", available: false },
      { slug: "kansas", name: "Kansas", available: false },
      { slug: "sevilla-plus", name: "Sevilla Plus", available: false },
    ],
  },
  {
    slug: "texturizado",
    name: "Texturizado",
    index: 2,
    description: "Hilo texturizado con cuerpo y frescura. En preparación.",
    available: false,
    subcategories: [
      { slug: "gaby", name: "Gaby", available: false },
      { slug: "kiana", name: "Kiana", available: false },
      { slug: "napoli", name: "Napoli", available: false },
      { slug: "napoli-open", name: "Napoli Open", available: false },
      { slug: "napoles", name: "Napoles", available: false },
      { slug: "river", name: "River", available: false },
      { slug: "mezi", name: "Mezi", available: false },
      { slug: "ribb-150", name: "Ribb 150", available: false },
    ],
  },
  {
    slug: "spun",
    name: "Spun",
    index: 3,
    description: "Hilado spun de tacto algodonoso. En preparación.",
    available: false,
    subcategories: [
      { slug: "ribb-20", name: "Ribb 20", available: false },
      { slug: "interlock-30", name: "Interlock 30", available: false },
      { slug: "interlock-plus-30", name: "Interlock Plus 30", available: false },
      { slug: "buff-romina-30", name: "Buff Romina 30", available: false },
      { slug: "buff-romina-rev-30", name: "Buff Romina Rev 30", available: false },
      { slug: "ribb-30", name: "Ribb 30", available: false },
      { slug: "ribb-40", name: "Ribb 40", available: false },
    ],
  },
  {
    slug: "polialgodon",
    name: "Polialgodón",
    index: 4,
    description: "Mezcla poliéster-algodón resistente. En preparación.",
    available: false,
    subcategories: [
      { slug: "lacoast-20", name: "Lacoast 20", available: false },
      { slug: "lacoast-polo-20", name: "Lacoast Polo 20", available: false },
      { slug: "lacoast-kratos-22", name: "Lacoast Kratos 22", available: false },
      { slug: "pique-ares-24", name: "Pique Ares 24", available: false },
      { slug: "cuellos-20-24", name: "Cuellos 20/24", available: false },
      { slug: "punos-20-24", name: "Puños 20/24", available: false },
    ],
  },
];

/** Estadísticas nominales mostradas en "01 · Beneficios y usos" de Dortmund Plus. */
export const dortmundPlusStats = [
  { value: "1.2 m", label: "Ancho tubular (±0,01 m)" },
  { value: "134.41 g/m²", label: "Gramaje (±5%)" },
  { value: "2.94 m/kg", label: "Rendimiento lineal inf." },
  { value: "3.1 m/kg", label: "Rendimiento lineal" },
];

export const dortmundPlusReasons = [
  {
    title: "134 g/m² de tejido",
    eyebrow: "Ligereza",
    description:
      "La microfibra fina baja el peso sin perder cobertura. La prenda se siente ligera en movimiento y no estorba el gesto atlético.",
  },
  {
    title: "Poliéster microfibra",
    eyebrow: "Secado rápido",
    description:
      "El poliéster aparta la humedad de la piel y la evapora rápido. La camiseta pesa menos con el sudor y vuelve seca al poco tiempo.",
  },
  {
    title: "Vuelve a su forma",
    eyebrow: "Recuperación",
    description:
      "Alta recuperación elástica: la prenda no se deforma tras estirarse en el juego. Cuellos y sisas mantienen su línea lavado tras lavado.",
  },
];

export const dortmundPlusBlancosProduct: ProductDetail = {
  title: "Blancos",
  subtitle: "Microfibra · tono Blancos",
  description:
    "Dortmund Plus en su familia de tonos Blancos: microfibra 100% poliéster, ligera y de secado rápido. El blanco óptico y los crudos dan la base más limpia para sublimación y estampado —color estable y alta recuperación lavado tras lavado.",
  fichaTecnica: [
    { label: "Tipo de tejido", value: "Single jersey microfibra" },
    { label: "Composición", value: "100% poliéster microfibra" },
    { label: "Ancho", value: "1.2 m tubular (±0,01 m)" },
    { label: "Gramaje", value: "134.41 g/m² (±5%)" },
    { label: "Rendimiento", value: "3.1 m/kg · inf. 2.94 m/kg" },
    { label: "Tono", value: "Blancos · óptico y crudos" },
  ],
  swatches: [
    { name: "Blanco óptico", hex: "#F4F2EE" },
    { name: "Crudo", hex: "#EDE6D8" },
    { name: "Marfil", hex: "#EFE9DC" },
    { name: "Perla", hex: "#E9E7E2" },
    { name: "Hueso", hex: "#E7E0D2" },
  ],
  cuidados: [
    {
      title: "Lavar a 40°C",
      description: "Ciclo normal, del revés. Color estable a temperatura media.",
    },
    {
      title: "Sin lejía",
      description:
        "No usar blanqueadores; pueden virar el tono, también en blancos.",
    },
    {
      title: "Secado suave",
      description: "Tambor a baja temperatura. Seca rápido: mejor al aire.",
    },
    {
      title: "Plancha media",
      description: "Temperatura media, nunca directa sobre estampados.",
    },
    {
      title: "No lavar en seco",
      description: "No requiere solventes; el lavado doméstico es suficiente.",
    },
  ],
  related: [
    {
      name: "Chelsea",
      description: "Otra construcción de microfibra de la misma familia deportiva.",
    },
    {
      name: "Athletic",
      description: "Microfibra de rendimiento pensada para uso atlético intenso.",
    },
    {
      name: "Imperial",
      description: "Microfibra de la línea, con su propio acabado y gramaje.",
    },
  ],
};

export const catalogTotals = {
  telas: categories.reduce(
    (sum, category) => sum + category.subcategories.length,
    0,
  ),
  familias: categories.length,
};

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return categories.find((category) => category.slug === slug);
}

export async function getSubcategory(
  categorySlug: string,
  subcategorySlug: string,
): Promise<{ category: Category; subcategory: Subcategory } | undefined> {
  const category = await getCategory(categorySlug);
  const subcategory = category?.subcategories.find(
    (sub) => sub.slug === subcategorySlug,
  );
  if (!category || !subcategory) return undefined;
  return { category, subcategory };
}

export async function getTone(
  categorySlug: string,
  subcategorySlug: string,
  toneSlug: string,
): Promise<
  | { category: Category; subcategory: Subcategory; tone: ProductTone }
  | undefined
> {
  const result = await getSubcategory(categorySlug, subcategorySlug);
  const tone = result?.subcategory.tones?.find((t) => t.slug === toneSlug);
  if (!result || !tone) return undefined;
  return { ...result, tone };
}

/** Solo existe ficha completa para microfibra/dortmund-plus/blancos por ahora. */
export async function getProductDetail(
  categorySlug: string,
  subcategorySlug: string,
  toneSlug: string,
): Promise<ProductDetail | undefined> {
  if (
    categorySlug === "microfibra" &&
    subcategorySlug === "dortmund-plus" &&
    toneSlug === "blancos"
  ) {
    return dortmundPlusBlancosProduct;
  }
  return undefined;
}
