/**
 * ¿SE MARCAN LOS HUECOS DE IMAGEN?
 *
 * Un hueco MARCADO dibuja la trama diagonal y su rótulo — "Foto pendiente", el
 * nombre de la referencia, "Cabecera vacía · deja hero-empresa.jpg en entrega/".
 * Un hueco NEUTRO es un plano de color liso, sin texto ni trama.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  APAGAR (poner en `false`) ANTES DE PUBLICAR EL SITIO AL PÚBLICO.     │
 * │  Es esta línea, y solo esta línea. Ver "Antes de publicar" en          │
 * │  README-imagenes.md.                                                  │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * POR QUÉ EXISTE LA CONSTANTE
 * Esto era `process.env.NODE_ENV !== "production"` repetido en dos sitios, con
 * la lógica duplicada en `FondoHero`. El motivo original era bueno: el carrusel
 * de eventos le estaba enseñando "DOCUMENTAL DE TALLER · FOTO REAL" al visitante
 * final, que ni sabe ni le importa qué foto falta. Esos textos venían del mockup,
 * donde describían la foto que faltaba, y se transcribieron tal cual.
 *
 * POR QUÉ HOY ESTÁ EN `true`
 * Atarlo a `NODE_ENV` mezcla dos preguntas distintas: "¿esto es una build de
 * producción?" y "¿quién la va a mirar?". En la demo interna se compila en
 * producción y la miran nuestros ojos, que necesitan ver qué falta — un hueco sin
 * marcar es indistinguible de una decisión de diseño, y eso es exactamente lo que
 * dejó el inventario de fotos incompleto. El día que el sitio salga al público la
 * respuesta cambia, y entonces se cambia aquí.
 *
 * Es constante de módulo, así que servidor y cliente pintan lo mismo y no hay
 * desajuste de hidratación.
 *
 * NO CUBRE `tintColor` NI `swatchColor`. Ahí el plano de color ES el contenido
 * —un swatch de color real, no un hueco— y no depende de esto.
 */
export const MARCAR_HUECOS_DE_IMAGEN = true;
