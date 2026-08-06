# Vocabulario de movimiento — v2

**Este documento sustituye al sistema anterior.** Si encuentras en el repo un
comentario que diga que el movimiento del sitio es "opacidad 0→1 más
translateY de 20px" aplicado a todo, es documentación de v1 que se quedó
atrás: corrígela o bórrala, no la sigas.

## Por qué cambió

v1 tenía un solo gesto. Un titular, una fotografía, una cifra y una tarjeta
entraban exactamente igual, y a 20px —línea y media de texto— el movimiento
existía técnicamente pero no se percibía. El resultado era un sitio que no se
leía como quieto ni como vivo: se leía como indeciso.

La regla de marca sigue siendo **"el movimiento subraya, nunca entretiene"**.
Subrayar exige que se note. El listón de calibración es: alguien que entra por
primera vez y hace scroll normal debe **notar** que las cosas entran, sin poder
describir el efecto. Si hay que mirar fijo para percibirlo, está mal calibrado.

## El mapeo

| Contenido | Técnica | Dónde vive | Revierte al subir |
|---|---|---|---|
| **Titulares** (h1 del hero, h2 de sección, declaraciones) | **Máscara por líneas** — cada línea sube desde debajo de un recorte, 90ms entre líneas. Sin opacidad: el texto no aparece, se destapa | `LineasEnMascara` | No |
| **Fotografía** | **Barrido** — un panel de tinta se retira de derecha a izquierda mientras la foto entra con zoom-out 1.06→1 | `Curtain` / `PhotoCurtain` | No |
| **Grids con hairline** (`gap-px` sobre fondo greige) | **La retícula se traza primero**: un panel del color del fondo destapa la grilla vacía de izquierda a derecha (550ms) y las celdas entran después, escalonadas 70ms | `RevealGroup variante="rejilla"` | No (una vez) |
| **Cifras** | **Dígitos revueltos que se asientan de izquierda a derecha** — el 3 de `39` se fija mientras el 9 sigue girando | `StatNumber` / `useDigitosAsentados` | No |
| **Cuerpos de texto** | Opacidad + 24px, 500ms. Corto y rápido: es texto, tiene que poder leerse ya | `Reveal tipo="cuerpo"` | Sí |
| **Tarjetas** | Opacidad + 56px + escala 0.985→1, 700ms. Recorrido largo, se asienta | `Reveal tipo="tarjeta"` / celdas de `RevealGroup` | No (una vez) |
| **Etiquetas mono, eyebrows** | Solo opacidad, 350ms. No se desplazan: acompañan, no lideran | `Reveal tipo="etiqueta"` | Sí |
| **Línea de hitos** | La línea vertical se dibuja atada al progreso de scroll (GSAP ScrollTrigger, único caso) y cada hito entra detrás de su punto | `Timeline` | No |
| **Flotante de WhatsApp** | Escala 0.7→1 a los 1,5s, cuando la secuencia del hero ya terminó. **Solo transform, sin opacidad**: con `prefers-reduced-motion` la opacidad sí se seguiría animando y el encargo pedía entrada sin animación | `BotonWhatsApp` | No (no es de scroll) |

Todos los valores viven en [`src/lib/motion.ts`](src/lib/motion.ts)
(`VOCABULARIO`, `MASCARA`, `REJILLA`, `CIFRA`, `HERO_SECUENCIA`, `FLOTANTE`). **Ningún
componente define duraciones ni distancias propias.**

## Reversión al subir el scroll

v1 era `once: true` en todo: al volver a bajar no pasaba nada. Ahora depende
del tipo. El criterio manda por **amplitud del gesto**, no por si el contenido
es "periférico":

- **Revierten** los gestos pequeños y baratos: `etiqueta` (solo opacidad) y
  `cuerpo` (24px). Volver a pasar y verlos re-entrar es imperceptible y no
  cuesta nada.
- **No revierten** los gestos grandes ni lo que ancla/ya se leyó: `tarjeta`
  (celdas de grilla incluidas), titulares, fotografías, cifras. Se revelan una
  vez. Deshacer un barrido de foto a media pantalla cada vez que pasas por
  delante deja de subrayar y empieza a entretener; una cifra que se vuelve a
  desordenar sola es ruido, no dato; y una grilla de tarjetas que se re-anima
  en cada pasada es lo mismo.

**Por qué `tarjeta` dejó de revertir (v2.1).** En v2 revertía —era el gesto más
grande del sistema (56px + escala + el barrido del panel de rejilla)— y una
auditoría de rendimiento lo señaló como el mayor coste de las caídas de
fotogramas al hacer scroll: la ráfaga de framer-motion re-disparaba en **cada**
pasada por la sección (grillas de categorías en /productos y, sobre todo, las
20 fichas de /productos/microfibra). Apagar el re-disparo eliminó ese coste sin
tocar el gesto en sí. No revertir este cambio sin volver a medir; el valor vive
en `VOCABULARIO.tarjeta.revierte` de [`src/lib/motion.ts`](src/lib/motion.ts).

## Secuencia del hero

`HERO_SECUENCIA`: eyebrow 150ms → titular 300ms (líneas cada 90ms) →
subtítulo 500ms → CTA 800ms.

En v1 el subtítulo estaba en 150ms, empatado con el eyebrow, así que **entraba
antes que el titular al que subtitula**. Ahora arranca cuando la primera línea
del titular ya está arriba.

La cabecera ya no lleva caption ni rótulo "Desliza": no informaban de nada y se
comían atención en la única pantalla que se ve entera. No reponerlos.

## Reglas técnicas

- Solo se anima `transform` y `opacity`. Nada que dispare layout.
- **`clip-path` está descartado a propósito** para el trazado de rejilla, aunque
  sería el camino obvio: framer-motion con `reducedMotion="user"` solo suprime
  transform y layout, así que un `clip-path` seguiría animándose para quien
  pidió no tener movimiento. El panel de `scaleX` sí se salta.
- `prefers-reduced-motion` se resuelve en un único sitio, el
  `<MotionConfig reducedMotion="user">` del layout raíz. **No ramificar sobre
  `useReducedMotion()` para omitir `initial`**: el servidor no conoce la
  preferencia y eso rompe la hidratación. Las excepciones justificadas montan
  en efecto (`HeroVideo`, `useDigitosAsentados`, `Timeline`).
- `SCROLL_REVEAL.amount` es **0.2 y no más**. Es fracción *del elemento*: un
  bloque más alto que el viewport nunca llega a mostrar una fracción grande de
  sí mismo, y con un umbral alto se quedaría invisible para siempre.
- Sin dependencias nuevas: framer-motion y el GSAP que ya estaba.

## Scroll suave — lo que cuesta y dónde (medido)

Referido en el código como «Motion Architecture v1 §04». Lo pone `SmoothScroll`
con `<ReactLenis root>`. Medido en agosto de 2026; método y cifras completas en
`docs/rendimiento-cards.md`.

**En táctil el scroll YA es nativo, y Lenis no interviene.** Lenis trae
`syncTouch: false` por defecto y en `lenis.mjs:615` se sale sin hacer nada
cuando el input es táctil. Medido con dedo emulado de verdad en un teléfono de
375 px, quitarlo mueve el pintado de 280 a 248 ms — ruido. **No hay nada que
apagar ahí, y apagarlo tendría un coste:** en modo `root`, `ReactLenis` es un
`Context.Provider`, así que quitarlo con una condición cambia el tipo de
elemento y React remonta la aplicación entera justo después de hidratar.

**El coste real es de la RUEDA, o sea de escritorio y trackpad.** En
`/productos/microfibra`, con un recorrido corto dentro de la rejilla ya
revelada, quitar Lenis baja el pintado de 1833 a 164 ms —un 91 %— y el p95 del
intervalo entre fotogramas de 22,3 a 11,1 ms. Lenis mueve el scroll con
`scrollTo` en cada fotograma, y como la página es una sola capa de composición
(1425×5285 px en esa ruta), eso vuelve a grabar la lista de pintado entera cada
vez. **Pendiente, fuera de la tanda de rendimiento de agosto:** es un problema
real y medido, pero quitar o rebajar el scroll suave es una decisión de diseño
sobre §04, no un arreglo, y no se toca antes de la presentación del 15.

> **Cómo NO medirlo, que ya costó una vuelta entera.** Un viewport de 375 px con
> `isMobile` desactivado y eventos de rueda **no es un teléfono**: es un portátil
> en una ventana estrecha, y ahí Lenis sí actúa. Con esa medida se concluyó que
> el scroll suave era lo que más se iba a notar en un móvil, y es al revés. Para
> hablar de táctil hace falta emular táctil (`isMobile` + `hasTouch`) y mandar el
> gesto con `Input.dispatchTouchEvent`: los `TouchEvent` sintéticos desde
> `evaluate` no hacen scroll.

## Lo que este vocabulario NO es

Ni píldoras con blur, ni glassmorphism, ni rebotes elásticos, ni parallax de
fondo. Los radios siguen siendo 0, 2 y 4px. Es una marca industrial-editorial:
el movimiento ordena la lectura, no la decora.
