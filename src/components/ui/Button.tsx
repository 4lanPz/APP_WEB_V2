"use client";

import { cn } from "@/lib/cn";
import { useMagnetic } from "@/components/motion/useMagnetic";
import { buttonVariants, type ButtonVariantProps } from "./buttonVariants";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {}

/**
 * El gesto magnético (ver `useMagnetic`) solo se aplica al primario en el
 * código real — se llama siempre (regla de hooks) pero solo se conecta
 * cuando el botón es primario (el default de `buttonVariants`).
 */
export function Button({ className, variant, style, ...props }: ButtonProps) {
  const { ref, onMouseMove, onMouseLeave, style: magneticStyle } = useMagnetic<HTMLButtonElement>();
  const isPrimary = (variant ?? "primary") === "primary";

  return (
    <button
      {...props}
      className={cn(buttonVariants({ variant }), className)}
      style={isPrimary ? { ...style, ...magneticStyle } : style}
      ref={isPrimary ? ref : undefined}
      onMouseMove={isPrimary ? onMouseMove : undefined}
      onMouseLeave={isPrimary ? onMouseLeave : undefined}
    />
  );
}
