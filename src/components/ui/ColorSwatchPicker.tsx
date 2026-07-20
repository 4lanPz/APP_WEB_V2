"use client";

import { cn } from "@/lib/cn";
import type { ColorSwatch } from "@/data/taxonomy";

export interface ColorSwatchPickerProps {
  swatches: ColorSwatch[];
  active: number;
  onChange: (index: number) => void;
}

/**
 * "Colores del muestrario" — swatches de color plano, sin foto (verdad
 * material). Motion v1 §05: al seleccionar, el anillo asienta con offset
 * 3px, 200ms, curva asentar (doble box-shadow: hueco en Papel + anillo azul).
 */
export function ColorSwatchPicker({ swatches, active, onChange }: ColorSwatchPickerProps) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-graphite">
          Colores del muestrario
        </span>
        <span className="font-mono text-[13px] text-ink">{swatches[active].name}</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {swatches.map((swatch, i) => (
          <button
            key={swatch.name}
            type="button"
            onClick={() => onChange(i)}
            aria-label={swatch.name}
            aria-pressed={i === active}
            className={cn("size-10 rounded-full transition-shadow duration-200 ease-asentar")}
            style={{
              backgroundColor: swatch.hex,
              boxShadow:
                i === active
                  ? "0 0 0 1px #C8C2B8, 0 0 0 3px #F5F2EE, 0 0 0 5px #33A2DC"
                  : "0 0 0 1px #C8C2B8",
            }}
          />
        ))}
      </div>
      <p className="mt-3 font-mono text-[11px] text-graphite">
        <span className="text-accent">●</span> Familia Blancos · se tiñe a
        pedido y se muestra como color plano hasta tener foto real.
      </p>
    </div>
  );
}
