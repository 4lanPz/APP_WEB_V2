"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { ColorSwatchPicker } from "./ColorSwatchPicker";
import { PhotoCurtain } from "@/components/motion/Curtain";
import type { ProductDetail } from "@/data/taxonomy";

/**
 * Motion v1 §07 — Galería de producto: crossfade puro 350ms entre imágenes
 * (sin slide). Al cambiar de swatch, la imagen principal hace crossfade a
 * la variante de color (400ms) y la miniatura activa asienta su anillo
 * azul (delegado a ColorSwatchPicker, §05).
 *
 * Sin fotografía real todavía: el "crossfade a la variante teñida" se
 * representa con el color plano real del swatch (mismo patrón "verdad
 * material" que las cards de tono) en vez de inventar una foto.
 */
export function ProductGallery({ product, title }: { product: ProductDetail; title: string }) {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const swatch = product.swatches[active];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="relative aspect-4/5 w-full overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={swatch.name}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <ImagePlaceholder
                label="Foto pendiente"
                sublabel={swatch.name}
                caption={`Dortmund Plus ${title} · ${swatch.name} · color plano`}
                className="h-full w-full"
                tintColor={swatch.hex}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="font-serif text-caption italic text-graphite">
          Elige un tono de la familia {title} para previsualizar el color.
          La fotografía real de cada tono se publica cuando se produce.
        </p>
        <PhotoCurtain
          dark
          label="Macro de microfibra"
          caption="Macro de microfibra · referencia de textura"
          className="aspect-21/9"
        />
      </div>

      <ColorSwatchPicker swatches={product.swatches} active={active} onChange={setActive} />
    </div>
  );
}
