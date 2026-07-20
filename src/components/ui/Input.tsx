import { forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

/**
 * Design System v1.1 §04 — Input de texto.
 * Sin caja: filete inferior 1px greige. Focus → filete azul. Sin sombras.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const field = (
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "w-full border-0 border-b border-greige bg-transparent px-0.5 py-3 font-sans text-[17px] text-ink outline-none placeholder:text-graphite focus:border-brand disabled:cursor-not-allowed disabled:border-greige/50 disabled:text-graphite",
          className,
        )}
        {...props}
      />
    );

    if (!label) return field;

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={inputId}
          className="font-mono text-xs uppercase tracking-widest text-graphite"
        >
          {label}
        </label>
        {field}
      </div>
    );
  },
);
Input.displayName = "Input";
