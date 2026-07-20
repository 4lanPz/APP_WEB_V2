"use client";

import Link from "next/link";
import { useMagnetic } from "./useMagnetic";

export type MagneticLinkProps = React.ComponentProps<typeof Link>;

/** `<Link>` con el gesto magnético del CTA primario — ver `useMagnetic`. */
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
