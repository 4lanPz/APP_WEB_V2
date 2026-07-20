import { cn } from "@/lib/cn";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Full-bleed drops the max-width/margin — reservado a macro material o el rollo. */
  fullBleed?: boolean;
}

/**
 * Contenedor de página: máx. 1240px, margen fluido clamp(24px,7vw,120px) —
 * verificado contra los exports de Claude Design (Home, Productos, etc.),
 * que usan este clamp en vez del margen fijo de 64px del doc de marca.
 */
export function Container({
  className,
  fullBleed = false,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        !fullBleed && "mx-auto max-w-padilla px-[clamp(24px,7vw,120px)]",
        className,
      )}
      {...props}
    />
  );
}
