import { categories, catalogTotals, type Category } from "@/data/taxonomy";
import { estadoFicha, type EstadoFicha } from "@/data/fichas";

export interface NavSubcategory {
  label: string;
  href: string;
  estado: EstadoFicha;
}

export interface NavCategory {
  label: string;
  href: string;
  count: number;
  available: boolean;
  subcategories: NavSubcategory[];
}

function categoryHref(category: Category): string {
  return category.available
    ? `/productos/${category.slug}`
    : `/productos/${category.slug}#en-preparacion`;
}

/**
 * El ancla `#en-preparacion` solo tiene sentido si el destino es la página de
 * preparación. Una tela con ficha —aunque sea preliminar— renderiza contenido
 * real y ese ancla no existe allí.
 */
function subcategoryHref(
  category: Category,
  slug: string,
  estado: EstadoFicha,
): string {
  const base = `/productos/${category.slug}/${slug}`;
  return estado === "sin-ficha" ? `${base}#en-preparacion` : base;
}

/**
 * Mega-menú del navbar — derivado de src/data/taxonomy.ts (única fuente).
 * Antes el navbar mantenía su propia copia de categorías y quedó desactualizada
 * (nombres viejos de Polialgodón); ahora no puede volver a divergir.
 */
export const productCategories: NavCategory[] = categories.map((category) => ({
  label: category.name,
  href: categoryHref(category),
  count: category.subcategories.length,
  available: category.available,
  subcategories: category.subcategories.map((sub) => {
    const estado = estadoFicha(sub.slug);
    return {
      label: sub.name,
      href: subcategoryHref(category, sub.slug, estado),
      estado,
    };
  }),
}));

export const catalogStats = `${catalogTotals.telas} telas · ${catalogTotals.familias} familias · teñido a demanda`;

export const primaryNavLinks = [
  { label: "Inicio", href: "/" },
  { label: "Nuestra Empresa", href: "/empresa" },
  { label: "Contacto", href: "/contacto" },
];

/** URL real del Portal Clientes, tomada del export de Claude Design. */
export const externalPortalHref =
  "https://clientes.textilpadilla.com.ec/clientes_tp";

export const footerBrandQuote =
  "No fabricamos la moda. Fabricamos aquello con lo que la moda se hace.";

export const footerEmpresaLinks = [
  { label: "Misión y visión", href: "/empresa#manifiesto" },
  { label: "Nuestra historia", href: "/empresa#historia" },
  { label: "Hitos", href: "/empresa#hitos" },
];

export const footerContact = {
  email: "hola@textilpadilla.ec",
  phone: "+593 2 000 0000",
  address: ["Av. de la Industria 1487", "Quito · Ecuador"],
};

export const footerLegalLink = {
  label: "Política de tratamiento de datos",
  href: "/politica-datos",
};

export const footerTagline = "Materia · Precisión · Silencio";
