"use client";

import { useDigitosAsentados } from "@/components/motion/useDigitosAsentados";

export interface StatNumberProps {
  target: number;
  prefix?: string;
  suffix?: string;
}

/**
 * Cifra que se asienta por dígitos al cruzar el viewport, una sola vez (ver
 * `useDigitosAsentados`). Ya no cuenta desde 0: los dígitos giran revueltos y
 * se fijan de izquierda a derecha.
 *
 * `tabular-nums` no es decorativo: sin ancho fijo por dígito, un 8 y un 1
 * miden distinto y la cifra tiembla mientras gira. El `min-width` en `ch`
 * reserva además el hueco del valor final para que nada empuje el layout.
 */
export function StatNumber({ target, prefix = "", suffix = "" }: StatNumberProps) {
  const { ref, display } = useDigitosAsentados(target, prefix, suffix);
  const chars = prefix.length + String(target).length + suffix.length;

  return (
    <span
      ref={ref}
      style={{
        fontVariantNumeric: "tabular-nums",
        fontFeatureSettings: "'tnum' 1",
        minWidth: `${chars}ch`,
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {display}
    </span>
  );
}
