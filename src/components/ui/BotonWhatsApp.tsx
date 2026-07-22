"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { WHATSAPP_HREF } from "@/data/whatsapp";
import { EASE_REVELAR, FLOTANTE } from "@/lib/motion";

/**
 * Botón flotante de WhatsApp, presente en todas las páginas.
 *
 * DÓNDE SE APARTA DEL DESIGN SYSTEM, Y POR QUÉ
 * El verde (#25D366) y el glifo son de WhatsApp, no nuestros, y no pasan por
 * `globals.css`: viven aquí, en el único sitio que los usa, para que nadie los
 * tome por color de marca. Aquí la identificación inmediata pesa más que la
 * coherencia de paleta — quien busca el botón de WhatsApp busca ese verde.
 * Lo demás sí es del sistema: radio de 4px, curva "asentar", elevación de 2px
 * en hover, igual que el botón primario.
 *
 * NO ES REDONDO A PROPÓSITO. El FAB circular es la convención, pero
 * `globals.css` prohíbe `rounded-full` por norma de marca ("escala permitida:
 * 0 · 2 · 4px"), y el glifo blanco sobre el verde ya identifica el botón sin
 * el círculo. La excepción que valía la pena gastar era el color y el icono.
 *
 * El número sale de `data/whatsapp.ts` y hoy es un placeholder.
 */
export function BotonWhatsApp() {
  return (
    <motion.a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir a Textil Padilla por WhatsApp (se abre en una pestaña nueva)"
      className={cn(
        /*
         * z-900: por debajo del telón de carga y de la transición de página
         * (z-999), que sí deben poder taparlo, y por encima de los paneles de
         * Leaflet —sus controles llegan a z-800 y participan del contexto de
         * apilamiento raíz—. Con un z-50 el mapa de Contacto se le montaba
         * encima.
         *
         * A 16px de las esquinas en móvil: dentro del alcance del pulgar y
         * fuera de las flechas del carrusel de eventos, que van a la derecha
         * pero con su propio margen inferior.
         */
        "fixed bottom-4 right-4 z-900 flex size-14 items-center justify-center sm:bottom-6 sm:right-6 sm:size-15",
        "rounded-md bg-[#25D366] text-white shadow-[0_4px_20px_rgba(28,25,23,0.22)]",
        "transition-[background-color,transform,box-shadow] duration-220 ease-asentar",
        "hover:-translate-y-0.5 hover:bg-[#1DA851] hover:shadow-[0_8px_28px_rgba(28,25,23,0.3)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink",
      )}
      /*
       * Entrada solo por escala (ver `FLOTANTE` en lib/motion.ts): con
       * prefers-reduced-motion framer omite el transform vía
       * <MotionConfig reducedMotion="user"> y el botón aparece ya puesto y
       * quieto. Un fade sí se seguiría animando, porque la opacidad no la
       * suprime.
       */
      initial={{ scale: FLOTANTE.escalaInicial }}
      animate={{ scale: 1 }}
      transition={{
        duration: FLOTANTE.entrada,
        ease: EASE_REVELAR,
        delay: FLOTANTE.retardo,
      }}
    >
      {/* Glifo oficial de WhatsApp. */}
      <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-7 sm:size-7.5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.898 9.825 9.825 0 012.892 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    </motion.a>
  );
}
