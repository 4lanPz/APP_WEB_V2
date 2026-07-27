import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/*
 * Guardarraíl de tokens (fase 3, ítem 8).
 *
 * Rechaza valores arbitrarios de Tailwind en las DOS categorías que tienen un
 * token como fuente única de verdad y donde un arbitrario es siempre deriva del
 * sistema: tamaño de fuente (`text-[…]`) y color de paleta (`bg-[#…]`,
 * `border-[#…]`, `text-[#…]`…).
 *
 * A propósito NO cubre layout arbitrario legítimo (alturas `vh`/`clamp`,
 * `grid-cols-[…]`, `w-[40ch]`, `blur-[…]`, `scale-[…]`, `shadow-[…]`): esos no
 * tienen token equivalente y prohibirlos solo generaría ruido y disables. Si en
 * el futuro se quiere endurecer tracking/leading/spacing, se amplía aquí.
 *
 * Vía de excepción: `// eslint-disable-next-line no-restricted-syntax` con el
 * motivo, en el punto de uso (títulos de card, glifos, marca WhatsApp).
 */
const ARBITRARIO = String.raw`(?:\btext-\[)|(?:\b(?:bg|border|ring|outline|divide|from|via|to|fill|stroke|decoration|caret|accent|placeholder)-\[#)`;

const MENSAJE =
  "Valor arbitrario de Tailwind fuera del sistema de tokens (fase 3). Usa un token de tipografía (text-display … text-caption/label/mono/micro) o de color (text-ink, bg-brand, border-greige …). Si es una excepción legítima (título de card, marca WhatsApp, glifo), añade `// eslint-disable-next-line no-restricted-syntax` con el motivo.";

const guardarrailTokens = {
  files: ["src/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-syntax": [
      "error",
      { selector: `Literal[value=/${ARBITRARIO}/]`, message: MENSAJE },
      { selector: `TemplateElement[value.raw=/${ARBITRARIO}/]`, message: MENSAJE },
    ],
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  guardarrailTokens,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Reference-only exports from Claude Design — not app source.
    "design-reference/**",
  ]),
]);

export default eslintConfig;
