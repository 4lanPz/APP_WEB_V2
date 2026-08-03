# Brief — Lupa macro + recoloreo en tiempo real (ficha de producto Athletic)

## Contexto

Proyecto: `frontend-v2` (maqueta Next.js para presentación a gerencia).
Pantalla objetivo: **ficha de producto de la tela Athletic** — la vista que muestra la galería de fotos y los datos técnicos de la tela.

Se van a construir dos funcionalidades sobre la **foto principal** de esa ficha:

1. Una **lupa macro** que reemplaza el zoom actual.
2. Un **recoloreo en tiempo real** de la tela mediante swatches de color.

Ambas operan sobre la misma imagen y deben componerse en un solo componente (ver sección "Composición").

---

## Restricciones duras

- **No instalar dependencias nuevas.** `motion` (framer-motion) ya está en el proyecto y es suficiente. No agregar GSAP, ni librerías de zoom, ni de color.
- **No modificar la API de `Reveal` ni de `RevealGroup`.** Se pueden leer los easings y duraciones de `lib/motion.ts`, pero no cambiar su firma ni su comportamiento: se usan en las 7 páginas.
- El **build debe seguir pasando completo** al terminar.
- `prefers-reduced-motion` respetado en ambos efectos.
- Trabajo en rama aparte (`feat/macro-zoom-recoloreo`), sin tocar `main`.

---

## Fase 0 — Antes de escribir código

**No implementes nada todavía.** Primero presenta un plan corto y espera aprobación explícita. El plan debe cubrir:

- Qué archivo(s) vas a crear y cuáles vas a tocar de los existentes.
- Cómo está armada hoy la foto principal de la ficha y qué hace el zoom actual que se va a reemplazar.
- Cómo piensas calibrar el nivel máximo de aumento.
- Cómo resuelves la interacción en móvil (no hay hover).
- Cómo se componen la capa de color y el contenedor que amplía.

En las dos iteraciones anteriores de este proyecto se escribió mucho código antes de poder corregir el rumbo. Esta vez el plan va primero.

---

## Entregable A — Lupa macro

Reemplaza el zoom actual de la foto principal.

**Comportamiento**

- El usuario amplía sobre el punto donde apunta, no sobre el centro fijo de la imagen.
- El aumento máximo debe ser una **constante única y editable** en un solo lugar del código. No repartir valores mágicos por el archivo.
- Empieza con un valor **conservador**. La foto es buena pero tiene profundidad de campo real: hay zonas fuera de foco por óptica, no por compresión, y ampliar de más las expone. Propón un valor, muéstralo funcionando, y ajústalo visualmente conmigo antes de fijarlo.
- Móvil: tocar para activar, arrastrar para mover la lupa. Verificar que no se rompa el scroll de la página mientras la lupa está activa.

**Pistas de interfaz**

- El cursor cambia al pasar sobre la imagen (lupa o cruz). Esta es la señal principal.
- **No** poner texto explicativo del tipo "click para hacer zoom". Choca con el registro de marca (editorial, industrial, orgullo discreto) y se lee como plantilla.
- Sí incluir un **indicador de aumento** discreto, tipo `2.4×`, en IBM Plex Mono, visible mientras se amplía. Se lee como lectura de instrumento, no como tutorial, y es coherente con las fichas técnicas que ya muestran galga y título.

**Accesibilidad**

- Foco de teclado visible.
- Con `prefers-reduced-motion`, el cambio de aumento es instantáneo, sin transición animada. La funcionalidad se mantiene; lo que se elimina es la animación.

---

## Entregable B — Recoloreo en tiempo real

**Ubicación:** swatches inmediatamente debajo de la foto principal. No en la zona de especificaciones ni en una pestaña aparte — la relación causa-efecto debe ser evidente sin leer nada.

**Técnica:** capa de color sobre la imagen en `mix-blend-mode: multiply`. La foto de la Athletic es una tela blanca fotografiada casi en escala de grises: toda la textura vive en la luminosidad, que es exactamente la condición que la técnica necesita.

**Colores (valores provisionales, pendientes de confirmar contra la base de datos)**

| Color | Hex provisional | Nota |
|---|---|---|
| Blanco óptico | `#F2F5FA` | **Estado por defecto.** Es la foto sin capa de color, o con un tinte azulado casi imperceptible que simula el blanqueador óptico. |
| Azul eléctrico | `#0047CC` | Caso saturado — verificar que no salga apagado. |
| Rojo Marlboro | `#C8102E` | Debería salir bien; es el rango donde la técnica funciona mejor. |
| Amarillo Ecuador | `#FFCD00` | Caso saturado — verificar que no salga apagado. |

Los cuatro colores van en **un solo array constante**, fácil de editar cuando lleguen los valores reales.

**Alcance**

- Solo la **foto principal**. Las miniaturas de la galería no se recolorean y no muestran swatches — el resto de las fotos todavía no está en gris neutro. Evitar que quede la inconsistencia de una foto principal en rojo con miniaturas en blanco.

**Copy obligatorio**

- Nota pequeña, en mono, junto a los swatches: **"Color referencial — solicite muestra física."**
  La fidelidad de color en pantalla es un problema conocido en textil. Decirlo abiertamente no resta al efecto: evita un problema comercial real si alguien compra confiando en el color de pantalla.

**Accesibilidad**

- Los swatches son botones reales, navegables por teclado, con `aria-label` que diga el nombre del color.
- El estado seleccionado **no puede indicarse solo por color**: usar borde, marca o cambio de tamaño.

---

## Composición de A + B

Las dos capas van **dentro del mismo contenedor que escala**. La capa de color debe ampliarse junto con la imagen; si queda fuera, al hacer zoom la foto crece y el color se queda quieto y se rompe el efecto.

El resultado buscado: el usuario pone la tela en azul eléctrico y **entonces** amplía sobre el tejido azul, viendo la trama y los pliegues en ese color.

---

## Preparación de imágenes

- Verificar si `next.config.mjs` de `frontend-v2` arrastra `unoptimized: true` (venía del proyecto anterior por un tema de nginx). Si está activo, Next.js no genera derivados y se estaría sirviendo el archivo completo al navegador.
- El original pesa **9.4 MB (6000×4000)**. Nunca se sirve tal cual.
- Generar derivados en WebP: ~2400px para la vista normal, ~3500px para la capa de zoom, cargada solo cuando el usuario activa la lupa.

---

## Punto de control (obligatorio, antes de dar por terminado)

Mostrar el resultado y evaluar juntos:

1. ¿El **azul eléctrico** y el **amarillo Ecuador** se ven saturados o apagados? El multiply tiende a apagar colores intensos.
2. ¿El aumento máximo de la lupa llega hasta donde la foto aguanta, sin exponer las zonas fuera de foco?

**Si los colores salen apagados, no lo damos por bueno ni se deja así.** Hay correcciones (una segunda capa de mezcla, o pasar el recoloreo a canvas para tener más control sobre saturación y brillos especulares). Esa decisión se toma viendo el resultado en pantalla, no antes.

---

## Verificación final

- Build completo sin errores.
- Las 7 páginas se siguen viendo correctamente; nada quedó invisible por un observer o un estado inicial mal puesto.
- Revisión en móvil (la lupa es lo más frágil ahí).
- `prefers-reduced-motion` activado y probado.
- Cero errores en consola.

---

## Documentación

Al terminar, registrar ambas técnicas en el documento de **Motion Architecture**: qué hacen, en qué pantalla se usan y cuándo aplican.

Si no queda escrito, la próxima pantalla vuelve al mismo fade de siempre. Ya pasó antes con la rejilla: se corrigió el CSS pero el comentario del código seguía diciendo que lo viejo era lo aprobado, y casi se revierte.
