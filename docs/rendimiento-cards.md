# Rendimiento de cards y rejilla de telas — Fase 0, medición

Respuesta a `brief-rendimiento.md`. **No se ha tocado ninguna animación.** Esto
es solo lo que dicen los números.

**Titular: la hipótesis de partida es falsa.** El marcador de hueco —la trama
diagonal— no cuesta nada medible. Apagarlo no mueve una sola cifra en ninguna
de las tres pantallas, en ninguna de las dos prueba, en ninguno de los dos
tamaños. **Las fotos, cuando lleguen, no van a arreglar esto.** Eso cambia la
prioridad: no hay nada que esperar.

Hay tres causas reales, y ninguna de las tres es la que se sospechaba.

---

## Cómo se midió

- **Cuatro builds de producción** (`next build` + `next start`), una por
  combinación de interruptores. No en `npm run dev`: el modo desarrollo añade
  coste de React que taparía justo lo que se quiere ver.
- **Chromium con ventana real**, no headless — la rasterización por GPU y la
  promoción a capas no se comportan igual sin ventana, y eso es precisamente
  el objeto de la medida.
- Traza de `devtools.timeline`, el mismo motor que alimenta el panel
  Rendimiento del navegador. El árbol de capas y las razones de composición se
  leen del dominio `LayerTree`.
- **Freno de CPU 4×** en escritorio (1440×900) y **6×** en móvil (375×812,
  DPR 2). Sin freno, esta máquina absorbe el problema y no se ve nada.
- **Hover**: dos vueltas sobre las cards visibles, 0,7 s dentro y 0,4 s fuera
  de cada una. **Scroll**: 24 pasos de rueda de 200 px hacia abajo, 1,2 s de
  cola para el lerp, y otros tantos hacia arriba. **Reposo**: 4 s sin tocar.

**Por qué no verás "FPS medios" en ninguna tabla.** El monitor de esta máquina
va a 180 Hz: la mediana entre fotogramas en reposo es de 5,6 ms, no de 16,7. Un
promedio de FPS ahí no significa nada y además esconde los tirones, que es lo
que se ve. Se reporta **p95 del intervalo entre fotogramas** (el fotograma malo
de cada veinte) y **cuántos fotogramas superan los 20 ms**, que es cuando el ojo
lo nota. Los ms de cada tarea son totales de la prueba entera, comparables entre
configuraciones porque el guion de la prueba es idéntico.

---

## 0. En reposo no se paga nada

| pantalla (escritorio) | paint en 4 s | p95 fotograma | tareas > 50 ms |
| --- | --- | --- | --- |
| Home | 463 ms | 11,1 ms | 0 |
| `/productos` | 57 ms | 5,7 ms | 0 |
| `/productos/microfibra` | 49 ms | 5,8 ms | 0 |

Nada se anima solo. No hay bucle de fondo, ni canvas, ni reveal que se
redispare. **Todo el coste aparece con el gesto**, y eso descarta de entrada
media docena de sospechosos.

---

## 1. La trama no es la causa (la comprobación que pedía el brief)

`MARCAR_HUECOS_DE_IMAGEN = false`, build nueva, mismas pruebas:

| pantalla / prueba | A — trama encendida | B — trama apagada |
| --- | --- | --- |
| microfibra · móvil · scroll | **5650,4 ms** de paint | **5650,9 ms** |
| microfibra · escritorio · hover | 9384,9 ms | 9271,7 ms |
| Home · escritorio · hover | 1855,3 ms | 1830,6 ms |
| `/productos` · escritorio · hover | 1503,0 ms | 1491,2 ms |
| Home · móvil · scroll | 1610,8 ms | 1674,8 ms |

Diferencia: ninguna. La primera fila difiere en medio milisegundo sobre cinco
segundos y medio.

Por si la build introducía ruido, se repitió sobre **una sola build** quitando
el degradado por CSS (`background-image: none`) — misma conclusión: 1027 ms
frente a 965 ms en escritorio, 2940 frente a 2832 en móvil. Apagar la trama sale
**peor** dentro del margen de ruido.

> El razonamiento del brief era correcto —un degradado repetido no se promueve a
> capa como una imagen— pero le falta un paso: **estas cards tampoco se
> promueven cuando llevan foto**. La trama no es más cara que lo que la va a
> sustituir. Lo caro es otra cosa, y sigue ahí con foto o sin ella.

---

## 2. Microfibra: el borde que cambia de color transicionando

Es la pantalla peor con diferencia, y su coste **no depende de ninguno de los
dos interruptores**: las cuatro configuraciones dan lo mismo (paint en hover de
escritorio: 9385 / 9272 / 9287 / 9439 ms). Normal — las tiles de microfibra son
`SubcategoryTile`, no `CategoryCard`.

Aislando pieza por pieza sobre la misma build (escritorio, 4 tiles, freno 4×):

| variante | paint | eventos `Paint` | p95 fotograma | fotogramas > 20 ms |
| --- | --- | --- | --- | --- |
| tal cual | **4496 ms** | 1147 | 22,3 ms | 104 |
| el borde cambia, pero de golpe | 294 ms | 93 | 11,2 ms | 20 |
| hay transición, pero el borde no cambia | **185 ms** | 72 | 11,2 ms | 17 |
| quitar el zoom de la foto en su lugar | 5022 ms | 1480 | — | — |

El culpable es una línea de `SubcategoryTile`:

```
transition-colors duration-500 ease-revelar hover:border-graphite
```

`border-color` **no es una propiedad que se pueda componer**. Transicionarla
durante 500 ms obliga al hilo principal a volver a pintar en cada fotograma, y
como la tile no está promovida a capa propia, ese repintado se anota contra la
capa de la página entera (ver §5). Quitarlo se lleva el **96 % del paint**.

Quitar el zoom de la foto, en cambio, no mejora nada: sale igual o peor. **No es
el escalado. Es el color del borde.**

Y a la pregunta del brief sobre cuántos elementos animan a la vez: **solo el que
tiene el ratón encima.** `group-hover` está acotado a cada `<a>` y la traza lo
confirma — el coste escala con cuántas tiles se recorren, no hay veinte
animándose juntas. El problema no es cuántas animan; es lo que cuesta una.

---

## 3. El scroll: lo paga el scroll suave, no el contenido

Esto sale de la prueba de scroll, y es **la causa más grande de las tres**.

Primero, lo que **no** es. Sobre la misma build, quitando cada sospechoso por
CSS (microfibra, scroll):

| variante | paint escritorio | paint móvil 375 |
| --- | --- | --- |
| tal cual | 965 ms | 2832 ms |
| sin el desenfoque de la barra fija | 1007 ms | 2877 ms |
| sin la trama | 1027 ms | 2940 ms |
| sin la barra fija entera | 1077 ms | 3173 ms |

Ninguno mueve nada.

Ahora, con `prefers-reduced-motion` emulado —que hace que `SmoothScroll`
devuelva los hijos **sin Lenis**— y con un recorrido **corto** (±480 px) dentro
de la rejilla ya revelada, para que no entre ningún reveal nuevo y quede solo el
scroll:

| | paint | eventos `Paint` | p95 fotograma | fotogramas > 20 ms |
| --- | --- | --- | --- | --- |
| escritorio, con Lenis | **1833 ms** | 568 | 22,3 ms | 82 |
| escritorio, sin Lenis | **164 ms** | 92 | 11,1 ms | 24 |
| móvil 375, con Lenis | **2139 ms** | 335 | 38,9 ms | 162 |
| móvil 375, sin Lenis | **419 ms** | 80 | 11,2 ms | 40 |

−91 % de paint en escritorio, −80 % en móvil. El p95 del fotograma cae de 38,9 a
11,2 ms en móvil: de un tirón visible cada veinte fotogramas a ninguno.

En el recorrido largo, que sí dispara reveals, la mejora es de −72 % y −81 % y
el script baja también a la mitad (3576 → 1570 ms en móvil) — ahí se suma que
los reveals de tipo `etiqueta` y `cuerpo` tienen `revierte: true` y se
redisparan cada vez que se vuelve a pasar por ellos. Pero el recorrido corto
deja claro que **el grueso es Lenis por sí solo**: mueve el scroll con
`scrollTo` en cada fotograma y eso vuelve a grabar la lista de pintado de toda
la página, cada vez.

> Salvedad honesta: el interruptor que se acciona es `prefers-reduced-motion`,
> que además de quitar Lenis suprimiría cualquier animación de framer. En el
> recorrido corto no había ninguna pendiente de entrar, así que la diferencia es
> atribuible al scroll suave, pero no puedo descartar un residuo pequeño.

**Esto es lo único de los tres que afecta al móvil de verdad.** En un teléfono el
hover no existe —Tailwind envuelve `hover:` en `@media (hover: hover)`— así que
§2 y §4 no se disparan nunca allí. Lo que se va a ver en la demo del 15, en un
teléfono, es esto.

---

## 4. Home y `/productos`: sí, el hover de la card cuesta — y es lo de menos

`HOVER_EN_CARDS_DE_FAMILIA = false`, build nueva:

| pantalla / medida | A — hover encendido | C — hover apagado |
| --- | --- | --- |
| `/productos` escritorio · paint | 1503 ms | 805 ms |
| `/productos` escritorio · estilo | 1418 ms | 745 ms |
| `/productos` escritorio · p95 | 11,3 ms | **6,0 ms** |
| `/productos` escritorio · fotogramas > 20 ms | 30 | 12 |
| Home escritorio · paint | 1855 ms | 1477 ms |
| Home escritorio · estilo | 1211 ms | 695 ms |
| Home móvil · p95 | 33,3 ms | 22,3 ms |
| `/productos` móvil · p95 | 22,2 ms | 16,6 ms |

El efecto de la tanda es real: casi duplica el recálculo de estilo y el pintado
mientras dura el hover. Pero en cifras absolutas el p95 pasa de 6,0 a 11,3 ms en
escritorio —sigue dentro del presupuesto de 16,7 ms a 60 Hz— y en un móvil de
verdad no se dispara nunca.

Y hay un dato que conviene tener a mano antes de culpar a la tanda: **el velo
tinta cuesta lo mismo o más, y no está detrás de ningún interruptor porque ya
estaba antes.** Apagando todas las transiciones de la card, el estilo cae de
1482 a 393 ms y el prepaint de 1111 a 296; apagando solo el velo, o solo el zoom
de la foto, apenas cambia nada. Es el conjunto de transiciones no compuestas de
la card, no una de ellas.

---

## 5. Nada está promovido a capa, y esa es la razón de fondo

Árbol de capas en `/productos/microfibra` (escritorio, en reposo):

```
1425×900   Viewport, OverflowScrolling      (no dibuja)
1425×900   OverflowScrolling                (no dibuja)
1425×5285  RootScroller, OverflowScrolling  ← TODA la página, aquí
1425×68    FixedPosition, BackdropFilter    ← la barra
 120×120   Overlap                          ← el botón de WhatsApp
1425×900   FixedPosition
  15×900   Scrollbar
```

**Nueve capas para una página entera.** Ninguna card, ninguna tile, ninguna foto
tiene capa propia — ni en reposo ni durante el hover: se volvió a tomar el árbol
a mitad de la transición y en microfibra no aparece ni una capa nueva. En Home
aparece exactamente una (957×344, `ActiveOpacityAnimation`).

Eso significa que **cualquier repintado, por pequeño que sea el elemento, se
graba contra una capa de 1425×5285 px**. El rectángulo que Chrome anota en cada
evento `Paint` lo confirma: la mediana es de 7 531 125 px, que es exactamente
1425 × 5285 — 5,8 veces el viewport en escritorio, 11,5 veces en móvil.

Ese es el multiplicador que convierte «una tile cambia de color de borde» en
cuatro segundos y medio de pintado. Y también responde a las otras dos preguntas
del brief: **no hay recálculo de layout por fotograma** (`Layout` se queda entre
30 y 160 ms en todas las pruebas, es ruido), y **la tarea que domina el fotograma
es el pintado en el hilo principal**, no la rasterización —que es de 20 a 60 ms
en todo, despreciable— ni la composición.

---

## Qué propongo, por orden de rentabilidad

Nada de esto está hecho. Los tres tocan componentes compartidos, así que espero
confirmación antes de mover una línea.

**1 · El borde de `SubcategoryTile`** — el más barato de arreglar y el segundo
más caro. Cambiar la transición de `border-color` por una capa de borde con
opacidad: un `absolute inset-0 border border-graphite opacity-0` que pasa a
`opacity-100` en hover. La opacidad **sí** se compone y el borde se pinta una
sola vez; el aspecto es el mismo. Es el camino barato que pide el brief —animar
solo propiedades compuestas— y la medida dice que ahí el coste es de 185 ms
frente a 4496. Afecta a todas las páginas de categoría.

**2 · Lenis en táctil** — el más caro de todos y el único que se va a ver en la
demo en un teléfono. La propuesta acotada es dejar el scroll suave en escritorio
y devolver scroll nativo en táctil, que es donde el p95 pasa de 38,9 a 11,2 ms.
Es un cambio en Motion Architecture v1 §04, así que **no lo toco sin que me lo
digas**: es una decisión de diseño, no de rendimiento.

**3 · El hover de las cards de familia** — el menos rentable. Se puede promover
la capa de la foto solo mientras dura la transición, como sugiere el brief. Pero
si se hace, hay que hacerlo también con el velo tinta, que cuesta lo mismo y no
es de esta tanda. Yo lo dejaría para después de la presentación.

**Lo que no propongo: rediseñar ninguna animación.** Ninguna de las tres causas
lo pide. En los tres casos el gesto se conserva tal cual y lo que cambia es la
propiedad por la que se anima.

---

## Un asunto de rama, antes de arreglar nada

El brief pide `fix/rendimiento-cards` desde `main` actualizado. La medición se
ha hecho sobre el árbol de trabajo actual (`motion/interaccion`, con la tanda de
interacción sin commitear), que es donde se ve el síntoma.

Eso importa para el reparto: **§2 y §3 —las dos causas grandes— ya están en
`main`** y se pueden arreglar en una rama limpia desde ahí sin arrastrar nada.
**§4 es de la tanda sin commitear** y solo existe en esta rama. Dime si prefieres
una rama desde `main` para las dos primeras y dejar §4 donde está, o
mantenerlo todo junto.
