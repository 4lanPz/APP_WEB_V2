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
| **Grids con hairline** (`gap-px` sobre fondo greige) | **La retícula se traza primero**: un panel del color del fondo destapa la grilla vacía de izquierda a derecha (550ms) y las celdas entran después, escalonadas 70ms | `RevealGroup variante="rejilla"` | Celdas sí, trazo no |
| **Cifras** | **Dígitos revueltos que se asientan de izquierda a derecha** — el 3 de `39` se fija mientras el 9 sigue girando | `StatNumber` / `useDigitosAsentados` | No |
| **Cuerpos de texto** | Opacidad + 24px, 500ms. Corto y rápido: es texto, tiene que poder leerse ya | `Reveal tipo="cuerpo"` | Sí |
| **Tarjetas** | Opacidad + 56px + escala 0.985→1, 700ms. Recorrido largo, se asienta | `Reveal tipo="tarjeta"` / celdas de `RevealGroup` | Sí |
| **Etiquetas mono, eyebrows** | Solo opacidad, 350ms. No se desplazan: acompañan, no lideran | `Reveal tipo="etiqueta"` | Sí |
| **Línea de hitos** | La línea vertical se dibuja atada al progreso de scroll (GSAP ScrollTrigger, único caso) y cada hito entra detrás de su punto | `Timeline` | No |

Todos los valores viven en [`src/lib/motion.ts`](src/lib/motion.ts)
(`VOCABULARIO`, `MASCARA`, `REJILLA`, `CIFRA`, `HERO_SECUENCIA`). **Ningún
componente define duraciones ni distancias propias.**

## Reversión al subir el scroll

v1 era `once: true` en todo: al volver a bajar no pasaba nada. Ahora depende
del tipo, y el criterio es:

- **Revierte** lo repetible y periférico: celdas, tarjetas, párrafos,
  etiquetas. Volver a pasar por ahí y verlo entrar otra vez es coherente.
- **No revierte** lo que ancla la sección o ya se leyó: titulares,
  fotografías, cifras. Deshacer un barrido de foto a media pantalla cada vez
  que pasas por delante deja de subrayar y empieza a entretener. Y una cifra
  que se vuelve a desordenar sola es ruido, no dato.

## Secuencia del hero

`HERO_SECUENCIA`: eyebrow 150ms → titular 300ms (líneas cada 90ms) →
subtítulo 500ms → CTA 800ms.

En v1 el subtítulo estaba en 150ms, empatado con el eyebrow, así que **entraba
antes que el titular al que subtitula**. Ahora arranca cuando la primera línea
del titular ya está arriba.

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

## Lo que este vocabulario NO es

Ni píldoras con blur, ni glassmorphism, ni rebotes elásticos, ni parallax de
fondo. Los radios siguen siendo 0, 2 y 4px. Es una marca industrial-editorial:
el movimiento ordena la lectura, no la decora.
