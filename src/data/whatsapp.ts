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

/** URL final del flotante. wa.me se encarga de abrir app o web según el dispositivo. */
export const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
  WHATSAPP_MENSAJE,
)}`;
