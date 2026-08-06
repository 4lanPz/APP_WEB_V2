import { cva, type VariantProps } from "class-variance-authority";
import {
  CLASES_FILETE_DE_ENLACE,
  CLASES_HUNDIMIENTO_DE_BOTON,
  CLASES_TRANSICION_DE_BOTON,
} from "@/lib/motion-interaccion";

/**
 * SISTEMA DE BOTONES — cuatro variantes, y ninguna elige su forma a mano.
 *
 * Sustituye a `primary` / `secondary` / `ghost`. El inventario medido
 * (`docs/inventario-botones-cta.md`) encontró cinco tratamientos distintos solo
 * para navegación interna, ninguno para WhatsApp, y un `primary` a 2,56:1 en
 * reposo. La propuesta y las mediciones viven en `/styleguide`.
 *
 * ── QUÉ SIGNIFICA EL RELLENO (opción B) ────────────────────────────────────
 * COMPROMISO, no jerarquía. Sólida solo para lo que compromete algo: enviar
 * datos y abrir WhatsApp. La navegación nunca lleva relleno por importante que
 * sea, heroes incluidos. Así el relleno significa una única cosa en todo el
 * sitio.
 *
 * ── LA SÓLIDA TIENE DOS FORMAS, NO UNA ─────────────────────────────────────
 * Sobre claro es relleno de tinta con texto papel (14,41:1 sobre hueso). Sobre
 * oscuro se da la vuelta: relleno claro con texto tinta, porque la tinta sobre
 * una banda oscura da 1,15:1 y desaparece. No es una variante nueva: es la
 * misma adaptándose, igual que el contorno.
 *
 * Ninguna clase de aquí lleva un color escrito. Todas leen `--sup-*`, que
 * declara la superficie desde `globals.css` — y la declara la propia utilidad
 * que pinta el fondo (`bg-ink`, `bg-brand-deep`, `bg-paper`, `bg-bone`), así
 * que no hay nada que emparejar a mano ni que se pueda quedar sin marcar.
 * El hover invierte la polaridad sin más que intercambiar las dos variables.
 *
 * ── POR QUÉ VIVE FUERA DE `Button.tsx` ─────────────────────────────────────
 * `Button.tsx` es "use client" por el gesto magnético, y seis páginas Server
 * Component llaman esta función directamente sobre un `<Link>`. Una función
 * pura de un archivo cliente no se puede invocar desde el servidor — y por lo
 * mismo la superficie se resuelve en CSS y no con contexto de React, que no
 * existe en el servidor.
 *
 * Motion Architecture v1 §05 — verbo "asentar" (220ms, curva 0.40,0,0.20,1)
 * y elevación de 2px en hover para las variantes con caja.
 */

/**
 * El anillo de foco iba en `outline-brand`: sobre `paper` da 2,53:1 y el mínimo
 * no textual es 3:1. Pasa a `--sup-tinta`, que es 15,67:1 sobre las dos
 * superficies sin tener que pensarlo.
 */
/*
 * El hundimiento al pulsar va en BASE y no en cada variante: es el sistema
 * entero el que responde igual al gesto. Ver `HUNDIMIENTO_EN_BOTONES` en
 * `@/lib/motion-interaccion` — de ahí salen tanto la clase del `:active` como la
 * lista de propiedades en transición, que tiene que incluir `translate` para que
 * el desplazamiento se vea recorrer en vez de saltar.
 *
 * El foco no se toca: sigue siendo el mismo contorno, y un contorno no se mueve
 * con el botón porque `:focus-visible` y `:active` marcan cosas distintas —dónde
 * está el teclado y qué se está pulsando— y pueden convivir sin estorbarse.
 */
const BASE = [
  "inline-flex items-center justify-center gap-2.25 whitespace-nowrap rounded-sm",
  "font-sans text-base font-medium",
  // La duración viaja dentro de la constante: cambia con el interruptor.
  `${CLASES_TRANSICION_DE_BOTON} ease-asentar`,
  // Se cae de la lista —sin dejar hueco— cuando el hundimiento está apagado.
  CLASES_HUNDIMIENTO_DE_BOTON,
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
  "focus-visible:outline-(color:--sup-tinta) disabled:pointer-events-none",
]
  .filter(Boolean)
  .join(" ");

const CAJA = "h-12 border px-7.5";

/**
 * Inhabilitado deja de ser `opacity-40`. WCAG exime a los controles inactivos
 * de los mínimos de contraste, pero "exento" no es "utilizable": el `primary`
 * inhabilitado se quedaba en 1,45:1 porque el `opacity` fundía el texto papel
 * contra la página papel. Se sustituye por un plano muerto, sin color de marca,
 * que se sigue leyendo: 4,75:1 en claro y 5,92:1 en oscuro.
 */
const INHABILITADO =
  "disabled:border-(color:--sup-inhab-borde) disabled:bg-(--sup-inhab-relleno) " +
  "disabled:text-(color:--sup-inhab-texto)";

/*
 * WHATSAPP — el verde y el glifo son de marca ajena y no entran en el tema:
 * viven aquí, en la única variante que los usa, para que nadie los tome por
 * color de paleta. Es la misma decisión que ya documentaba `BotonWhatsApp.tsx`.
 *
 *   #008069  blanco 4,89:1 · vs paper 4,38:1 · vs ink 3,57:1 — cabecera de
 *            WhatsApp Web y Business. De los siete verdes medidos es el único
 *            que cumple las cuatro condiciones a la vez con glifo blanco, y el
 *            único que no necesita filete sobre claro.
 *   #075E54  blanco 7,67:1 · vs paper 6,87:1 — Teal Green Dark, paleta clásica.
 *            Hover: más profundo y también suyo.
 *
 * Es la única variante que NO cambia con la superficie: el verde identifica el
 * canal, y si se adaptara dejaría de hacerlo.
 */
const WHATSAPP =
  // eslint-disable-next-line no-restricted-syntax -- teal de cabecera de WhatsApp Web, marca ajena
  "border-transparent bg-[#008069] text-white hover:-translate-y-0.5 " +
  // eslint-disable-next-line no-restricted-syntax -- Teal Green Dark de WhatsApp, marca ajena
  "hover:bg-[#075E54]";

export const buttonVariants = cva(BASE, {
  variants: {
    variant: {
      /**
       * SÓLIDA — la acción con más peso. Solo compromiso: envío de formulario.
       * Relleno y texto son las dos caras de la superficie, así que el hover no
       * necesita colores propios: se limita a intercambiarlas.
       */
      solida: `${CAJA} border-(color:--sup-tinta) bg-(--sup-tinta) text-(color:--sup-papel) hover:-translate-y-0.5 hover:bg-(--sup-papel) hover:text-(color:--sup-tinta) ${INHABILITADO}`,

      /**
       * CONTORNO — el caballo de batalla: toda la navegación, heroes incluidos.
       * El borde pasa de `greige` a `graphite` en claro: en un botón sin relleno
       * el borde ES el botón, y greige contra paper da 1,59:1. Y estrena versión
       * oscura, que antes no existía —`secondary` era `text-ink` y sobre tinta
       * daba 1:1, que es por lo que todos los heroes acababan tirando del azul.
       */
      contorno: `${CAJA} border-(color:--sup-borde) text-(color:--sup-tinta) hover:-translate-y-0.5 hover:border-(color:--sup-tinta) hover:bg-(--sup-velo) ${INHABILITADO}`,

      /**
       * ENLACE — terciario, dentro del flujo de lectura. Absorbe el `ghost` y
       * los enlaces de texto escritos a mano que hacían de CTA. El hover ya no
       * va a `text-brand` (2,53:1 sobre claro): lo marca el subrayado, que ya
       * era el gesto del ghost.
       *
       * ESTA ES LA VARIANTE QUE TRAZA EL FILETE. Es la que el sistema define
       * como "el enlace de texto dentro del flujo de lectura", así que es donde
       * cabe el gesto: las tres variantes con caja no llevan subrayado, y la
       * navegación traza el suyo desde `Navbar`. `border-b border-transparent`
       * se queda —reserva el hueco— y lo que cambia es quién lo pinta:
       * `.filete-trazado` recorriéndolo, o el `hover:border` de antes de una vez.
       */
      enlace:
        "gap-2.25 rounded-none border-b border-transparent px-0.5 py-1.5 text-body-s " +
        `text-(color:--sup-tinta) ${CLASES_FILETE_DE_ENLACE} disabled:text-(color:--sup-inhab-texto)`,

      /** WHATSAPP — se sale de la web a una conversación. Ver arriba. */
      whatsapp: `${CAJA} ${WHATSAPP}`,
    },
  },
  defaultVariants: {
    variant: "contorno",
  },
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
