import { cn } from "@/lib/cn";

/**
 * Los dos anchos del sitio. Definidos en `globals.css` (`--container-padilla*`),
 * que es donde está escrita la regla de cuándo se usa cada uno.
 *
 * NO ES UN CONTENEDOR NUEVO, ES UNA VARIANTE DEL MISMO. La diferencia importa:
 * un `<ContenedorAmplio>` aparte invita a que cada sección que se quede corta se
 * escriba el suyo, y en tres semanas hay cinco anchos. Aquí el ancho es un
 * parámetro con un valor por defecto, así que pedir el amplio obliga a
 * escribirlo —queda en el diff, se puede contar— y no pedirlo devuelve el de
 * siempre.
 */
const ANCHOS = {
  /** 1240 px. El del sitio entero. Si dudas, es este. */
  normal: "max-w-padilla",
  /** 1440 px. Excepción explícita: rejillas de piezas y splits imagen + texto. */
  amplio: "max-w-padilla-amplio",
} as const;

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Full-bleed drops the max-width/margin — reservado a macro material o el rollo. */
  fullBleed?: boolean;
  /**
   * Ancho máximo. `normal` (1240 px) es el del sitio; `amplio` (1440 px) es la
   * excepción para composiciones donde el ancho ES el contenido.
   *
   * Por debajo de 1240 px de ventana los dos rinden IDÉNTICO —mismo padding,
   * mismo `mx-auto`, y un `max-width` mayor que la ventana no recorta nada—, así
   * que en móvil no hay nada que verificar aparte: es el mismo contenedor.
   */
  ancho?: keyof typeof ANCHOS;
}

/**
 * Contenedor de página: máx. 1240px (o 1440 en la variante `amplio`), margen
 * fluido clamp(24px,7vw,120px) — verificado contra los exports de Claude Design
 * (Home, Productos, etc.), que usan este clamp en vez del margen fijo de 64px
 * del doc de marca.
 *
 * EL PADDING NO CAMBIA ENTRE VARIANTES, y es deliberado: es lo único que
 * garantiza que las dos se comporten igual en móvil sin un breakpoint de por
 * medio, y lo que mantiene alineado el borde del texto entre secciones de ancho
 * distinto en pantallas de más de 1440.
 */
export function Container({
  className,
  fullBleed = false,
  ancho = "normal",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        !fullBleed && `mx-auto ${ANCHOS[ancho]} px-[clamp(24px,7vw,120px)]`,
        className,
      )}
      {...props}
    />
  );
}
