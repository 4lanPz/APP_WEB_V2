/**
 * Vocabulario de movimiento — v2.
 *
 * Las cuatro curvas siguen siendo las de Motion Architecture §02. Lo que
 * cambió es el reparto: v1 aplicaba un único gesto (opacidad 0→1 + 20px de
 * translateY) a todo el sitio, así que un titular, una foto, una cifra y una
 * tarjeta entraban igual. 20px es línea y media de texto: técnicamente se
 * mueve, perceptualmente no.
 *
 * v2 asigna una técnica por TIPO DE CONTENIDO (ver `VOCABULARIO` y `MOTION.md`
 * en la raíz). Ningún componente define duraciones ni distancias propias: todo
 * valor de tiempo o distancia del sitio sale de este archivo.
 *
 * NO VOLVER AL GESTO ÚNICO
 * Si lees en algún sitio que el sistema es "fade + 20px para todo", es
 * documentación de v1 que se quedó atrás. Se sustituyó a propósito.
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
  paginaFase: 0.35, // 350ms por fase (cubre / retira) de la transición de página
  magnetico: 0.3, // 300ms — retorno del botón magnético, verificado en el código real
  cortinaFoto: 0.9, // 900ms — capa `shot` de la cortina de imagen
  cortinaVela: 0.76, // 760ms — capa `drape` de la cortina de imagen
  cortinaCarga: 0.72, // 720ms — telón de carga inicial (#tp-curtain)
} as const;

export const MAGNETIC_STRENGTH = 0.28;

/**
 * Disparo de scroll común. `amount` es cuánto del elemento debe verse para
 * arrancar; `stagger` el escalonado entre hermanos (rango 60–80ms del doc,
 * fijado en 70ms).
 */
export const SCROLL_REVEAL = {
  /**
   * 0.2 y no más: `amount` es fracción DEL ELEMENTO, así que un bloque más
   * alto que el viewport nunca llega a mostrar una fracción grande de sí
   * mismo y se quedaría invisible para siempre. Bajarlo es la diferencia
   * entre "entra un poco pronto" y "no entra nunca".
   */
  amount: 0.2,
  stagger: 0.07,
} as const;

/**
 * Distancias y ritmos por tipo de contenido.
 *
 * `revierte` decide si el gesto se deshace al salir del viewport (volver a
 * subir el scroll lo vuelve a mostrar al bajar).
 *
 * CRITERIO (revisado v2.1): manda la AMPLITUD del gesto, no si el contenido es
 * "periférico". Antes revertía todo lo repetible —incluida la tarjeta—, pero
 * `tarjeta` es el gesto más grande del sistema (56px + escala + el barrido del
 * panel de rejilla), y rehacerlo en cada pasada es justo lo que la marca llama
 * "entretenimiento, no subrayado": lo mismo que ya no hacemos con fotos ni
 * cifras. Además era el mayor coste medido de las caídas de fotogramas al
 * hacer scroll (grillas de categorías y, sobre todo, las 20 fichas de
 * microfibra). Así que ahora `tarjeta` ancla: se revela una vez.
 *   - Revierten los gestos pequeños y baratos —`etiqueta` (solo opacidad) y
 *     `cuerpo` (24px)—: rehacerlos es imperceptible y no cuesta.
 *   - No revierten los gestos grandes o que anclan/ya se leyeron —`tarjeta`,
 *     `ancla`, y (fuera de aquí) titulares, fotografías, cifras.
 * Ver MOTION.md §"Reversión al subir el scroll". No revertir esto sin volver a
 * medir: el re-disparo de `tarjeta` era el cuello de botella.
 */
export const VOCABULARIO = {
  /** Etiqueta mono, eyebrow, dato suelto: solo opacidad, sin desplazar. */
  etiqueta: { distancia: 0, duracion: 0.35, escala: 1, revierte: true },
  /** Párrafo, cita, bloque de lectura: corto y rápido, tiene que poder leerse ya. */
  cuerpo: { distancia: 24, duracion: 0.5, escala: 1, revierte: true },
  /** Tarjeta, tile, celda de grilla: recorrido largo y lento, se asienta una vez. */
  tarjeta: { distancia: 56, duracion: 0.7, escala: 0.985, revierte: false },
  /** Bloque que ancla una sección y no debe parpadear al volver a pasar. */
  ancla: { distancia: 40, duracion: 0.65, escala: 1, revierte: false },
} as const;

export type TipoMovimiento = keyof typeof VOCABULARIO;

/**
 * Titular recortado por máscara (`LineasEnMascara`). Cada línea sube desde
 * debajo de un `overflow-hidden`: no hay fade, hay revelado. Nació en el hero
 * y ahora es también el gesto de los titulares de sección.
 */
export const MASCARA = {
  duracion: DURATION.desenrollar, // 700ms
  stagger: 0.09, // 90ms entre líneas
} as const;

/**
 * Secuencia del hero. El orden importa y en v1 estaba roto: el subtítulo
 * compartía delay con el eyebrow (0.15), así que entraba ANTES que el titular.
 * Ahora arranca cuando la primera línea del titular ya está arriba.
 */
export const HERO_SECUENCIA = {
  eyebrow: 0.15,
  titular: 0.3,
  subhead: 0.5,
  cta: 0.8,
} as const;

/**
 * Grilla de hairlines. El `bg-greige` bajo el `gap-px` es la retícula; un
 * panel del color del fondo la tapa y se retira de izquierda a derecha, así
 * que las líneas se TRAZAN antes de que entre nada dentro de las celdas.
 * El panel usa `scaleX` (transform) a propósito: con prefers-reduced-motion
 * framer lo salta de golpe y la grilla queda visible y quieta.
 */
export const REJILLA = {
  trazo: 0.55, // 550ms de barrido del panel
  celdas: 0.3, // las celdas empiezan a entrar antes de que el trazo acabe
} as const;

/**
 * Cifras. Sustituye al conteo lineal desde 0 de v1 (`useCountUp`): los dígitos
 * cambian revueltos y se van fijando de izquierda a derecha, como un rótulo
 * mecánico asentándose. Un conteo desde 0 a 900 dice "estoy contando"; esto
 * dice "el dato se está fijando", que es lo que la cifra hace.
 */
export const CIFRA = {
  tick: 0.035, // 35ms entre cambios de dígito revuelto
  primerCierre: 0.28, // el primer dígito se fija a los 280ms
  escalonado: 0.16, // y cada siguiente 160ms después
} as const;

/**
 * Botón flotante de WhatsApp. Entra al final, cuando la secuencia del hero ya
 * ha terminado (`HERO_SECUENCIA.cta` + su duración): es una utilidad
 * permanente, no parte de la portada, y no debe competir con el titular.
 *
 * Solo escala — sin opacidad — a propósito. `MotionConfig reducedMotion="user"`
 * salta transform pero no opacidad, así que un fade seguiría animándose para
 * quien pidió no moverse. Escalando, con la preferencia activa el botón
 * aparece ya puesto y quieto.
 */
export const FLOTANTE = {
  entrada: 0.45,
  retardo: 1.5,
  escalaInicial: 0.7,
} as const;

/** CSS easing strings (para transiciones fuera de framer-motion). */
export const CSS_EASE_ASENTAR = "cubic-bezier(0.4, 0, 0.2, 1)";
export const CSS_EASE_REVELAR = "cubic-bezier(0.16, 1, 0.3, 1)";
export const CSS_EASE_PLEGAR = "cubic-bezier(0.7, 0, 0.84, 0)";
export const CSS_EASE_DESENROLLAR = "cubic-bezier(0.65, 0, 0.35, 1)";
