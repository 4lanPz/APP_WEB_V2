/**
 * Motion Architecture v1 §02 — curvas y duraciones exactas de la tabla.
 * No se inventan valores: todo lo que no está aquí no se anima.
 */

export const EASE_REVELAR = [0.16, 1, 0.3, 1] as const; // Entrada · Revelar
export const EASE_PLEGAR = [0.7, 0, 0.84, 0] as const; // Salida · Plegar
export const EASE_ASENTAR = [0.4, 0, 0.2, 1] as const; // Interacción · Asentar
export const EASE_DESENROLLAR = [0.65, 0, 0.35, 1] as const; // Página · Desenrollar

export const DURATION = {
  revelar: 0.6, // 600ms
  plegar: 0.4, // 400ms
  asentar: 0.22, // 220ms
  desenrollar: 0.7, // 700ms — fila "Página · Desenrollar" de la tabla de curvas
  paginaFase: 0.35, // 350ms por fase (cubre / retira) de la transición de página, mitad de 700ms
  contar: 1.5, // 1500ms — conteo de cifras, verificado en el código real (data-count en los exports)
  magnetico: 0.3, // 300ms — retorno del botón magnético, verificado en el código real
  cortinaFoto: 0.9, // 900ms — capa `shot` de la cortina de imagen, verificado en el código real
  cortinaVela: 0.76, // 760ms — capa `drape` de la cortina de imagen, verificado en el código real
  cortinaCarga: 0.72, // 720ms — telón de carga inicial (#tp-curtain), verificado en el código real
} as const;

/**
 * Las técnicas ausentes del documento (conteo, magnético, cortina, telón de
 * carga) NO introducen curvas nuevas: reutilizan exactamente las 4 curvas de
 * §02 ya definidas arriba (revelar/asentar/desenrollar), solo con duraciones
 * propias. El conteo usa un ease-out cúbico manual (`1 - (1-t)^3`) porque
 * anima un valor numérico cuadro a cuadro vía requestAnimationFrame, no una
 * propiedad CSS. Se conserva pese a §08: está en los exports aprobados
 * (data-count) y fue pedido por el cliente — la implementación verificada
 * manda sobre el documento. Cuenta una sola vez (once) y no se re-anima.
 */
export const MAGNETIC_STRENGTH = 0.28;

/**
 * §03 Animaciones de scroll — parámetros exactos.
 * Stagger documentado como rango 60–80ms; se fija en 70ms (punto medio).
 */
export const SCROLL_REVEAL = {
  distance: 20, // translateY 20px → 0
  amount: 0.25, // trigger al 25% visible
  stagger: 0.07, // 70ms — punto medio del rango 60-80ms del doc
} as const;

/** CSS easing strings (para transiciones fuera de framer-motion). */
export const CSS_EASE_ASENTAR = "cubic-bezier(0.4, 0, 0.2, 1)";
export const CSS_EASE_REVELAR = "cubic-bezier(0.16, 1, 0.3, 1)";
export const CSS_EASE_PLEGAR = "cubic-bezier(0.7, 0, 0.84, 0)";
export const CSS_EASE_DESENROLLAR = "cubic-bezier(0.65, 0, 0.35, 1)";
