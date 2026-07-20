"use client";

import { useCountUp } from "@/components/motion/useCountUp";

export interface StatNumberProps {
  target: number;
  prefix?: string;
  suffix?: string;
}

/**
 * Cifra que cuenta desde 0 al cruzar el viewport, una sola vez (ver
 * useCountUp — pedido del cliente, presente en los exports aprobados). El
 * `min-width` en `ch` reserva el espacio del valor final para que el conteo
 * no produzca layout-shift mientras cambia de dígitos.
 */
export function StatNumber({ target, prefix = "", suffix = "" }: StatNumberProps) {
  const { ref, display } = useCountUp(target, prefix, suffix);
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
