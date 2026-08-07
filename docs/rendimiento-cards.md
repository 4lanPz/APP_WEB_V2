# Rendimiento de cards y rejilla de telas

Respuesta a `brief-rendimiento.md`. Dos partes: **Fase 0** es la medición, escrita
antes de tocar nada; **Fase 1**, al final, es lo que se arregló y cuánto se ganó.

> **Corrección posterior, importante.** El §3 de la Fase 0 —el scroll suave— dice
> que es «lo único que afecta al móvil de verdad». **Es falso, y el error está en
> cómo se midió:** un viewport de 375 px con eventos de rueda no es un teléfono,
> es un portátil en una ventana estrecha. Medido después con táctil emulado y
> gestos de dedo, Lenis no interviene en táctil y no cuesta nada allí; el coste
> real es de la rueda, o sea de escritorio. Está desarrollado en la Fase 1 y
> anotado en `MOTION.md`. Lo demás de la Fase 0 se sostiene.

## Fase 0 — la medición

**No se había tocado ninguna animación.** Esto es solo lo que dicen los números.

**Titular: la hipótesis de partida es falsa.** El marcador de hueco —la trama
diagonal— no cuesta nada medible. Apagarlo no mueve una sola cifra en ninguna
de las tres pantallas, en ninguna de las dos pruebas, en ninguno de los dos
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

> **⚠ Este párrafo era el original y estaba equivocado. Se conserva tachado
> porque el error es instructivo:** decía que esto era «lo único de los tres que
> afecta al móvil de verdad», porque en un teléfono el hover no existe —Tailwind
> envuelve `hover:` en `@media (hover: hover)`— y §2 y §4 no se disparan allí.
> La primera mitad es cierta; la conclusión no. **Las cifras de «móvil 375» de
> arriba se tomaron con la RUEDA del ratón y sin emular táctil**, o sea sobre un
> portátil en una ventana estrecha. En un teléfono de verdad Lenis se aparta solo
> y el scroll ya es nativo. Ver la Fase 1.

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

---
---

# Fase 1 — lo que se arregló

Rama `fix/rendimiento`, desde `main` limpio. Se hicieron **dos de las tres**
cosas propuestas, y una de ellas resultó no hacer falta.

## Qué se cambió

Una sola corrección, en los **tres sitios** donde estaba la misma cadena de
clases copiada:

| fichero | dónde se ve |
| --- | --- |
| `src/components/ui/SubcategoryTile.tsx` | `/productos/microfibra`, `/productos/[categoria]`, `…/dortmund-plus` |
| `src/app/productos/microfibra/dortmund-plus/blancos/page.tsx` | la rejilla «Otras telas de Microfibra» |
| `src/components/ui/ProductCard.tsx` | solo `/styleguide` — pero es de donde se copia |

Antes:

```
group … border border-transparent … transition-colors duration-500 ease-revelar hover:border-graphite
```

Ahora el enlace se queda sin transición y el filete lo pone una capa propia:

```jsx
<span
  aria-hidden
  className="pointer-events-none absolute -inset-px border border-graphite opacity-0
             transition-opacity duration-500 ease-revelar group-hover:opacity-100"
/>
```

Mismo color, misma duración, misma curva. Lo que cambia es **por qué propiedad
se anima**: `opacity` la sabe animar el compositor, `border-color` no.

`-inset-px` y no `inset-0` porque la caja de contención de un absoluto es la de
*padding*, o sea por dentro del `border-transparent` de 1px que la tile ya
reservaba: con `inset-0` el filete caería 1px hacia dentro. Comprobado contra
`npm run dev`: la caja del filete coincide con la caja de borde del enlace con
**0 px de desviación en los cuatro lados**, en las tres pantallas.

## Antes y después

Mismo método, misma máquina, mismas dos pasadas de la Fase 0 (build de
producción, ventana real, freno de CPU 4× en escritorio y 6× a 375 px).

**HOVER** — paint total de la prueba, p95 del intervalo entre fotogramas, y
cuántos fotogramas pasan de 20 ms:

| pantalla | paint antes | paint después | Δ | p95 antes | p95 después | >20 ms |
| --- | --- | --- | --- | --- | --- | --- |
| **microfibra** · escritorio | 9253,7 ms | **1988,3 ms** | **−79 %** | 44,5 ms | **11,2 ms** | 265 → **47** |
| **microfibra** · móvil 375 | 3771,3 ms | **1006,4 ms** | **−73 %** | 38,9 ms | **16,7 ms** | 136 → **29** |
| **blancos** · escritorio | 2995,2 ms | **802,7 ms** | **−73 %** | 22,3 ms | **11,2 ms** | 58 → **16** |
| **blancos** · móvil 375 | 1849,6 ms | **763,3 ms** | **−59 %** | 33,3 ms | **11,2 ms** | 70 → **19** |
| Home · escritorio *(no tocada)* | 1526,6 ms | 1531,7 ms | 0 % | 16,7 ms | 16,6 ms | 36 → 35 |
| Home · móvil *(no tocada)* | 666 ms | 840,7 ms | +26 % | 16,7 ms | 16,7 ms | 27 → 29 |
| `/productos` · escritorio *(no tocada)* | 1383,5 ms | 765 ms | −45 % | 22 ms | 10,6 ms | 65 → 12 |
| `/productos` · móvil *(no tocada)* | 581 ms | 615 ms | +6 % | 11,1 ms | 11,2 ms | 21 → 17 |

**SCROLL**:

| pantalla | paint antes | paint después | Δ | p95 antes | p95 después |
| --- | --- | --- | --- | --- | --- |
| **microfibra** · móvil 375 | 4784,9 ms | **1388,4 ms** | **−71 %** | 50 ms | 38,9 ms |
| **microfibra** · escritorio | 2042,6 ms | **979,9 ms** | **−52 %** | 38,8 ms | 27,8 ms |
| **blancos** · móvil 375 | 1505,4 ms | **938 ms** | **−38 %** | 33,3 ms | 27,8 ms |
| **blancos** · escritorio | 463,6 ms | 380,1 ms | −18 % | 16,3 ms | 16,6 ms |
| Home · escritorio *(no tocada)* | 1652,5 ms | 1332 ms | −19 % | 50,4 ms | 33,2 ms |
| `/productos` · móvil *(no tocada)* | 894,6 ms | 918,2 ms | +3 % | 27,8 ms | 27,6 ms |

### Cómo leer esto, incluida la parte incómoda

**Donde estaba el defecto, la mejora es inequívoca.** En microfibra el p95 del
fotograma pasa de 44,5 a 11,2 ms y los fotogramas malos de 265 a 47: es la
diferencia entre un tirón visible cada dos fotogramas y ninguno. El muestrario
de blancos, con solo tres tiles, mejora en la misma proporción —lo que confirma
que el coste era por tile y no por rejilla.

**Donde no se tocó nada, los números se mueven en las dos direcciones, y eso es
ruido.** `/productos` sale un 45 % «mejor» y ahí no se cambió una línea: esa
página solo monta `CategoryCard`, que no se ha tocado. Para saber cuánto vale
el ruido se compararon **dos pasadas del mismo «antes»**, misma build y mismo
guion: las diferencias entre ellas llegan al ±20 % de forma habitual y hasta el
−49 % en un caso (Home móvil, hover: 1311 → 666 ms). Con esa vara, todo lo
marcado *(no tocada)* está dentro del ruido, en un sentido o en el otro. **No me
apunto esas mejoras.** Las que valen son las cuatro filas en negrita, que están
muy por fuera de esa banda y tienen un mecanismo que las explica.

**Por qué también baja el scroll, si el arreglo es de hover.** Porque al
desplazar con el cursor sobre la rejilla, las tiles pasan por debajo del ratón y
cada una disparaba su transición de 500 ms al entrar y otra al salir. Veinte
tiles pasando bajo el cursor eran veinte transiciones de `border-color`
encadenadas encima del scroll. No es un efecto de laboratorio: es exactamente lo
que hace alguien que recorre el catálogo con el ratón dentro de la rejilla.

## §3, el scroll suave: no se tocó, y el motivo cambió

**Se midió y la premisa era falsa.** Lenis trae `syncTouch: false` por defecto y
en `lenis.mjs:615` se sale sin hacer nada ante input táctil: en un teléfono el
scroll **ya es nativo**. Medido con táctil emulado de verdad (`isMobile` +
`hasTouch`, gestos por `Input.dispatchTouchEvent`), quitar Lenis en microfibra
mueve el pintado de 280 a 248 ms — ruido.

Las cifras de «móvil 375» de la Fase 0 se tomaron con la **rueda del ratón** y
sin emular táctil: eso es un portátil en una ventana estrecha, no un teléfono.

Y quitarlo tendría un coste propio: en modo `root`, `ReactLenis` es un
`Context.Provider`, así que montarlo con una condición cambia el tipo de
elemento y **React remonta la aplicación entera** justo después de hidratar.

**Queda pendiente, fuera de esta tanda:** el coste de Lenis con **rueda** en
escritorio es real y grande —paint −91 %, p95 de 22,3 a 11,1 ms al quitarlo— pero
tocar el scroll suave es una decisión de diseño sobre `MOTION.md` §04, no un
arreglo, y no se hace antes de la presentación del 15. Anotado allí con las
cifras y con cómo *no* volver a medirlo.

## Lo que no se tocó

- **§4, el hover de las cards de familia.** Vive en `motion/interaccion`, no en
  esta rama, y se queda como está hasta después de la presentación.
- **El velo tinta de `CategoryCard`**, que cuesta lo mismo que §4 y no está
  detrás de ningún interruptor. Sigue igual.
- **La trama de los huecos.** No costaba nada, no se toca. Las fotos siguen
  haciendo falta, pero por lo que hacen falta las fotos.

## Comprobaciones

- `npx tsc --noEmit` limpio.
- `npm run lint`: 0 errores. Un aviso, `'BRAND' is assigned a value but never
  used` en `scripts/verificar-botones.mjs`, que ya venía de antes y no es de
  aquí.
- `npm run build` limpio, y el CSS de producción emite `inset:-1px` y
  `transition-property:opacity` — o sea, Tailwind sí genera `-inset-px`, que era
  lo único de la corrección que podía no existir.
- Comprobación funcional contra `npm run dev`, en las tres pantallas y también
  con `prefers-reduced-motion`: opacidad 0 → 1 → 0, y con la preferencia puesta
  el estado final es el mismo (desaparece el recorrido, no el resultado).
