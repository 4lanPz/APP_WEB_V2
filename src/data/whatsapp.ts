/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  NÚMERO PROVISIONAL — CAMBIAR ANTES DE PUBLICAR                          │
 * │                                                                          │
 * │  593999999999 es un placeholder, no el número de Textil Padilla. Es el    │
 * │  único sitio del que sale el destino del botón flotante: cámbialo aquí y  │
 * │  cambia en todo el sitio.                                                │
 * │                                                                          │
 * │  Formato: código de país + número, sin +, sin espacios, sin guiones —     │
 * │  es lo que espera wa.me. Ecuador es 593 y el móvil va SIN el 0 inicial    │
 * │  (099 123 4567 → 593991234567).                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */
export const WHATSAPP_NUMERO = "593999999999";

/** Mensaje que llega ya escrito en la caja de texto de WhatsApp. */
export const WHATSAPP_MENSAJE = "Hola, escribo desde la web de Textil Padilla.";

/** URL final. wa.me se encarga de abrir app o web según el dispositivo. */
export const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
  WHATSAPP_MENSAJE,
)}`;

/**
 * El mismo número, escrito para leerse: `+593 99 999 9999`.
 *
 * Se deriva de `WHATSAPP_NUMERO` en vez de escribirse aparte. Un número visible
 * escrito a mano es una segunda fuente del mismo dato, y al poner el real se
 * cambia una y se olvida la otra — es exactamente lo que pasaba: el flotante
 * apuntaba a 593999999999 y el asesor comercial mostraba +593 99 000 0000.
 *
 * Solo agrupa la forma de móvil ecuatoriano (593 + nueve dígitos). Con
 * cualquier otra longitud devuelve el número con el + y sin agrupar: preferible
 * a inventarse una separación que no corresponda a cómo se lee allí.
 */
export const WHATSAPP_VISIBLE = (() => {
  const resto = WHATSAPP_NUMERO.startsWith("593") ? WHATSAPP_NUMERO.slice(3) : "";
  if (resto.length !== 9) return `+${WHATSAPP_NUMERO}`;
  return `+593 ${resto.slice(0, 2)} ${resto.slice(2, 5)} ${resto.slice(5)}`;
})();
