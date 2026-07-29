"use client";

import Link from "next/link";
import { useMagnetic } from "./useMagnetic";

export type MagneticLinkProps = React.ComponentProps<typeof Link>;

/**
 * `<Link>` con el gesto magnético — ver `useMagnetic`. Lo aplica siempre, sea
 * cual sea la variante de botón que lleve encima: hoy son `contorno` y un
 * `enlace`. No es "el CTA primario", que es lo que decía cuando existía esa
 * variante.
 */
export function MagneticLink({ style, ...props }: MagneticLinkProps) {
  const { ref, onMouseMove, onMouseLeave, style: magneticStyle } = useMagnetic<HTMLAnchorElement>();

  return (
    <Link
      {...props}
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ ...style, ...magneticStyle }}
    />
  );
}
