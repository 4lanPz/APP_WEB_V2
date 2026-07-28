"use client";

import { cn } from "@/lib/cn";
import { useMagnetic } from "@/components/motion/useMagnetic";
import { buttonVariants, type ButtonVariantProps } from "./buttonVariants";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {}

/**
 * El gesto magnético (ver `useMagnetic`) se reserva a la variante con más peso
 * — se llama siempre (regla de hooks) pero solo se conecta en la `solida`, que
 * en el sistema es la que compromete algo: enviar un formulario. Antes era el
 * `primary`, que además de los envíos cubría toda la navegación.
 */
export function Button({ className, variant, style, ...props }: ButtonProps) {
  const { ref, onMouseMove, onMouseLeave, style: magneticStyle } = useMagnetic<HTMLButtonElement>();
  const conGesto = variant === "solida";

  return (
    <button
      {...props}
      className={cn(buttonVariants({ variant }), className)}
      style={conGesto ? { ...style, ...magneticStyle } : style}
      ref={conGesto ? ref : undefined}
      onMouseMove={conGesto ? onMouseMove : undefined}
      onMouseLeave={conGesto ? onMouseLeave : undefined}
    />
  );
}
