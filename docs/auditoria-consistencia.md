# Auditoría de consistencia

Medido sobre el commit `e6ecca3`.

> **Aviso —** el árbol tenía 4 archivo(s) sin commitear al medir. Este informe NO describe exactamente el commit `e6ecca3`.

Generado por `npm run auditoria:consistencia`. **No editar a mano:** cada pasada lo reescribe entero.

Este documento **mide, no arregla**. Cada apartado dice qué valores hay, dónde, si es fallo objetivo o variación de criterio, y qué valor estándar se propone.

## Cómo se ha medido

El sitio sirve **66 rutas reales**, pero no 66 diseños: se agrupan en **15 plantillas**. El barrido de layout va sobre una ruta por plantilla —medir 48 páginas idénticas no añade información, solo filas—, y cada hallazgo indica a cuántas rutas reales afecta.

Anchos: 375 px y 1440 px. Las rutas salen del árbol de `src/app` y de `src/data/taxonomy.ts`, no de una lista escrita a mano.

> **Sobre el número de rutas.** El encargo hablaba de 16. La derivación desde el enrutador da **66 rutas reales agrupadas en 15 plantillas**, y no hay forma de llegar a 16 sin escribir a mano alguna de las dos cifras. Se deja el número que sale del código, que es el que se pidió como fuente. Las tres categorías en preparación (`texturizado`, `spun`, `polialgodon`) comparten plantilla y aquí cuentan como una: lo que las diferencia es el texto de su descripción, no el diseño.

| Ruta medida | Plantilla | Rutas reales que cubre |
| --- | --- | ---: |
| `/` | estática / | 1 |
| `/asesor-virtual` | estática /asesor-virtual | 1 |
| `/contacto` | estática /contacto | 1 |
| `/empresa` | estática /empresa | 1 |
| `/politica-datos` | estática /politica-datos | 1 |
| `/productos` | estática /productos | 1 |
| `/productos/camisetas` | estática /productos/camisetas | 1 |
| `/productos/microfibra` | estática /productos/microfibra | 1 |
| `/productos/microfibra/athletic` | [subcategoria] ficha publicada | 19 |
| `/productos/microfibra/chelsea` | [subcategoria] ficha preliminar | 9 |
| `/productos/microfibra/dortmund-plus` | estática /productos/microfibra/dortmund-plus | 1 |
| `/productos/microfibra/dortmund-plus/blancos` | estática /productos/microfibra/dortmund-plus/blancos | 1 |
| `/productos/microfibra/dortmund-plus/claros` | [tono] en preparación | 4 |
| `/productos/microfibra/imperial` | [subcategoria] ficha sin-ficha | 21 |
| `/productos/texturizado` | [categoria] en preparación | 3 |

**Las dos medidas de cabecera.** Se reportan por separado a propósito:

- **Banda de cabecera** — alto del bloque oscuro, detectado por estructura (el padre del fondo `absolute inset-0` que pintan `FondoHero` y `HeroVideo`). Es lo que se ve como "cabecera más alta o más baja".
- **Fin del `<h1>`** — a qué distancia del inicio del contenido termina el titular. Existe también en las plantillas que no tienen banda.

Pueden divergir: dos bandas de igual alto con distinto relleno interno dejan el titular en sitios distintos, y al revés. Con una sola de las dos métricas, el informe podría decir que las cabeceras cuadran mientras el problema visible sigue ahí.

---

## 1 · Altura de cabecera

### A 375 px

**Banda de cabecera — 5 alturas distintas** en 8 plantillas con banda.

| Alto | Rutas |
| ---: | --- |
| 392 px | `/asesor-virtual` |
| 628 px | `/productos/camisetas` |
| 676 px | `/contacto`, `/empresa`, `/productos` |
| 688 px | `/`, `/productos/microfibra/dortmund-plus` |
| 764 px | `/productos/microfibra` |

Sin banda de cabecera identificable (7 plantillas): `/politica-datos`, `/productos/microfibra/athletic (×19 rutas)`, `/productos/microfibra/chelsea (×9 rutas)`, `/productos/microfibra/dortmund-plus/blancos`, `/productos/microfibra/dortmund-plus/claros (×4 rutas)`, `/productos/microfibra/imperial (×21 rutas)`, `/productos/texturizado (×3 rutas)`. No es un fallo de medición: estas plantillas entran directamente en el contenido, sin bloque oscuro.

**Fin del `<h1>` — 12 posiciones distintas.**

| Fin del h1 | Rutas |
| ---: | --- |
| 276 px | `/asesor-virtual` |
| 288 px | `/productos/texturizado (×3 rutas)` |
| 310 px | `/productos/microfibra/imperial (×21 rutas)` |
| 336 px | `/politica-datos`, `/productos/camisetas` |
| 348 px | `/productos/microfibra/dortmund-plus/claros (×4 rutas)` |
| 352 px | `/contacto`, `/empresa`, `/productos` |
| 364 px | `/productos/microfibra/dortmund-plus` |
| 396 px | `/` |
| 408 px | `/productos/microfibra` |
| 540 px | `/productos/microfibra/chelsea (×9 rutas)` |
| 685 px | `/productos/microfibra/athletic (×19 rutas)` |
| 1069 px | `/productos/microfibra/dortmund-plus/blancos` |

### A 1440 px

**Banda de cabecera — 5 alturas distintas** en 8 plantillas con banda.

| Alto | Rutas |
| ---: | --- |
| 448 px | `/asesor-virtual` |
| 630 px | `/productos/microfibra/dortmund-plus` |
| 648 px | `/empresa`, `/productos`, `/productos/camisetas` |
| 680 px | `/contacto`, `/productos/microfibra` |
| 720 px | `/` |

Sin banda de cabecera identificable (7 plantillas): `/politica-datos`, `/productos/microfibra/athletic (×19 rutas)`, `/productos/microfibra/chelsea (×9 rutas)`, `/productos/microfibra/dortmund-plus/blancos`, `/productos/microfibra/dortmund-plus/claros (×4 rutas)`, `/productos/microfibra/imperial (×21 rutas)`, `/productos/texturizado (×3 rutas)`. No es un fallo de medición: estas plantillas entran directamente en el contenido, sin bloque oscuro.

**Fin del `<h1>` — 9 posiciones distintas.**

| Fin del h1 | Rutas |
| ---: | --- |
| 258 px | `/productos/microfibra/athletic (×19 rutas)`, `/productos/microfibra/chelsea (×9 rutas)` |
| 292 px | `/productos/microfibra/dortmund-plus/blancos` |
| 304 px | `/productos/texturizado (×3 rutas)` |
| 319 px | `/productos/microfibra/imperial (×21 rutas)` |
| 335 px | `/productos/microfibra/dortmund-plus/claros (×4 rutas)` |
| 348 px | `/asesor-virtual`, `/politica-datos` |
| 375 px | `/productos/microfibra/dortmund-plus` |
| 420 px | `/contacto`, `/empresa`, `/productos`, `/productos/camisetas`, `/productos/microfibra` |
| 492 px | `/` |

---

## 2 · Espaciado vertical entre secciones

### A 375 px

**Padding superior de sección — 3 valores distintos.**

| Padding | Secciones en |
| ---: | --- |
| 0 px | `/productos/microfibra` |
| 40 px | `/productos/microfibra/dortmund-plus/blancos` |
| 64 px | `/` ×5, `/contacto` ×3, `/empresa` ×5, `/productos` ×4, `/productos/camisetas` ×3, `/productos/microfibra` ×2, `/productos/microfibra/dortmund-plus` ×3, `/productos/microfibra/dortmund-plus/blancos` ×2 |

**Hueco real entre secciones consecutivas — 1 valor.** Medido borde a borde, así que recoge el efecto combinado de margin y padding.

Todas las secciones se tocan: **el ritmo vertical no lo pone ningún margen, lo pone el padding interno de cada sección.** Es coherente y es buena noticia —hay un solo mecanismo, no dos compitiendo—, así que la tabla de arriba (padding de sección) es la que manda para juzgar el ritmo.

**Plantillas sin ninguna `<section>`** (7): `/asesor-virtual`, `/politica-datos`, `/productos/microfibra/athletic (×19 rutas)`, `/productos/microfibra/chelsea (×9 rutas)`, `/productos/microfibra/dortmund-plus/claros (×4 rutas)`, `/productos/microfibra/imperial (×21 rutas)`, `/productos/texturizado (×3 rutas)`. Son de una sola pieza: no tienen ritmo vertical que medir. Es un hallazgo de consistencia en sí mismo —conviven dos formas de construir una página—, no un fallo del script.

### A 1440 px

**Padding superior de sección — 3 valores distintos.**

| Padding | Secciones en |
| ---: | --- |
| 0 px | `/productos/microfibra` |
| 64 px | `/`, `/productos/microfibra/dortmund-plus/blancos` |
| 96 px | `/` ×4, `/contacto` ×3, `/empresa` ×5, `/productos` ×4, `/productos/camisetas` ×3, `/productos/microfibra` ×2, `/productos/microfibra/dortmund-plus` ×3, `/productos/microfibra/dortmund-plus/blancos` ×2 |

**Hueco real entre secciones consecutivas — 1 valor.** Medido borde a borde, así que recoge el efecto combinado de margin y padding.

Todas las secciones se tocan: **el ritmo vertical no lo pone ningún margen, lo pone el padding interno de cada sección.** Es coherente y es buena noticia —hay un solo mecanismo, no dos compitiendo—, así que la tabla de arriba (padding de sección) es la que manda para juzgar el ritmo.

**Plantillas sin ninguna `<section>`** (7): `/asesor-virtual`, `/politica-datos`, `/productos/microfibra/athletic (×19 rutas)`, `/productos/microfibra/chelsea (×9 rutas)`, `/productos/microfibra/dortmund-plus/claros (×4 rutas)`, `/productos/microfibra/imperial (×21 rutas)`, `/productos/texturizado (×3 rutas)`. Son de una sola pieza: no tienen ritmo vertical que medir. Es un hallazgo de consistencia en sí mismo —conviven dos formas de construir una página—, no un fallo del script.

---

## 3 · Ancho de contenedor y padding lateral

### A 375 px

Anchos de contenedor: **375 px**. Padding lateral: **26 px**.

✅ Consistente: un solo ancho y un solo padding en todas las plantillas. Es el `Container` compartido haciendo su trabajo.

### A 1440 px

Anchos de contenedor: **679 px**, **1240 px**, **1440 px**. Padding lateral: **101 px**.

| Ancho | Rutas |
| ---: | --- |
| 679 px | `/productos/microfibra/dortmund-plus/blancos` |
| 1240 px | `/`, `/asesor-virtual`, `/contacto`, `/empresa`, `/politica-datos`, `/productos`, `/productos/camisetas`, `/productos/microfibra`, `/productos/microfibra/athletic (×19 rutas)`, `/productos/microfibra/chelsea (×9 rutas)`, `/productos/microfibra/dortmund-plus`, `/productos/microfibra/dortmund-plus/blancos`, `/productos/microfibra/dortmund-plus/claros (×4 rutas)`, `/productos/microfibra/imperial (×21 rutas)`, `/productos/texturizado (×3 rutas)` |
| 1440 px | `/`, `/empresa` |

---

## 4 · Tamaños de titular

### A 375 px

**`h1` — 2 tamaños:** 36,4 px, 44 px

  - **36,4 px** — `text-h1` — `/productos/microfibra/athletic (×19 rutas)`, `/productos/microfibra/chelsea (×9 rutas)`, `/productos/microfibra/dortmund-plus/claros (×4 rutas)`, `/productos/microfibra/imperial (×21 rutas)`, `/productos/texturizado (×3 rutas)`
  - **44 px** — `text-display` — `/`, `/asesor-virtual`, `/contacto`, `/empresa`, `/politica-datos`, `/productos`, `/productos/camisetas`, `/productos/microfibra`, `/productos/microfibra/dortmund-plus`, `/productos/microfibra/dortmund-plus/blancos`

**`h2` — 1 tamaño:** 26,2 px

  - **26,2 px** — `text-h2` — `/`, `/asesor-virtual`, `/contacto`, `/empresa`, `/productos`, `/productos/camisetas`, `/productos/microfibra`, `/productos/microfibra/dortmund-plus`, `/productos/microfibra/dortmund-plus/blancos`, `/productos/texturizado (×3 rutas)`

**`h3` — 4 tamaños:** 15 px, 19,1 px, 21 px, 28 px

  - **15 px** — `text-body-s` — `/empresa`, `/productos/camisetas`, `/productos/microfibra/dortmund-plus/blancos`
  - **19,1 px** — `text-h3` — `/`, `/empresa`, `/productos`, `/productos/camisetas`, `/productos/microfibra/dortmund-plus`
  - **21 px** — **fuera de la escala de tokens** — `/productos/microfibra`, `/productos/microfibra/dortmund-plus`, `/productos/texturizado (×3 rutas)`
  - **28 px** — **fuera de la escala de tokens** — `/`, `/productos`

### A 1440 px

**`h1` — 2 tamaños:** 48 px, 72 px

  - **48 px** — `text-h1` — `/productos/microfibra/athletic (×19 rutas)`, `/productos/microfibra/chelsea (×9 rutas)`, `/productos/microfibra/dortmund-plus/claros (×4 rutas)`, `/productos/microfibra/imperial (×21 rutas)`, `/productos/texturizado (×3 rutas)`
  - **72 px** — `text-display` — `/`, `/asesor-virtual`, `/contacto`, `/empresa`, `/politica-datos`, `/productos`, `/productos/camisetas`, `/productos/microfibra`, `/productos/microfibra/dortmund-plus`, `/productos/microfibra/dortmund-plus/blancos`

**`h2` — 1 tamaño:** 32 px

  - **32 px** — `text-h2` — `/`, `/asesor-virtual`, `/contacto`, `/empresa`, `/productos`, `/productos/camisetas`, `/productos/microfibra`, `/productos/microfibra/dortmund-plus`, `/productos/microfibra/dortmund-plus/blancos`, `/productos/texturizado (×3 rutas)`

**`h3` — 4 tamaños:** 15 px, 22 px, 26 px, 28 px

  - **15 px** — `text-body-s` — `/empresa`, `/productos/camisetas`, `/productos/microfibra/dortmund-plus/blancos`
  - **22 px** — `text-h3` — `/`, `/empresa`, `/productos`, `/productos/camisetas`, `/productos/microfibra/dortmund-plus`
  - **26 px** — **fuera de la escala de tokens** — `/productos/microfibra`, `/productos/microfibra/dortmund-plus`, `/productos/texturizado (×3 rutas)`
  - **28 px** — **fuera de la escala de tokens** — `/`, `/productos`

La columna del medio es la distinción que de verdad separa lo deliberado de lo accidental: un tamaño que sale de un token es una decisión del sistema; uno que no sale de ninguno se escribió a mano. Los que aparecen **fuera de la escala** aquí son, uno por uno, los títulos de card con escala propia que ya están inventariados como excepción aprobada en §13 — no son deriva silenciosa, pero sí son la razón de que `h3` muestre cuatro tamaños.

---

## 5 · Errores y avisos de consola

✅ Ninguna ruta emitió errores ni avisos, más allá del ruido conocido listado al final.

---

## 6 · Desborde horizontal

✅ Ninguna plantilla desborda horizontalmente en los anchos medidos.

---

## 7 · Enlaces internos y anclas

Comprobado sobre **las 66 rutas reales** —no sobre la muestra por plantilla: cada página enlaza a destinos distintos, y verificarlo cuesta una petición, no una captura—, más los 9 destinos adicionales que aparecieron enlazados desde ellas.

No cubre los enlaces que solo existen tras una interacción de cliente. El panel del mega-menú sí entra (se renderiza en servidor), pero un desplegable que se montara al abrirlo no estaría aquí.

**3 enlaces con problema.** Fallo objetivo.

| Desde | Enlace | Problema |
| --- | --- | --- |
| `/productos/camisetas` | `/productos/microfibra#en-preparacion` | la página existe pero no tiene ningún id="en-preparacion" |
| `/productos/microfibra/dortmund-plus/blancos` | `/productos/microfibra/dortmund-plus#en-preparacion` | la página existe pero no tiene ningún id="en-preparacion" |
| `/productos/microfibra/dortmund-plus/blancos` | `/productos/microfibra#en-preparacion` | la página existe pero no tiene ningún id="en-preparacion" |

---

## 8 · Áreas táctiles por debajo de 44 px

**73 controles** por debajo del mínimo a 375 px. Los enlaces en línea dentro de un párrafo quedan fuera del recuento: no son objetivos táctiles en el sentido de la norma.

Son **34 controles distintos**, repetidos por el sitio. Ordenados por su dimensión más corta: arriba, lo que de verdad falla al tocarse; abajo, lo que se queda cerca del mínimo.

| Control | Tamaño | Rutas afectadas |
| --- | ---: | --- |
| (sin texto) (×4) | 8×8 px | `/` |
| (sin texto) (×4) | 10×10 px | `/contacto` |
| (sin texto) | 14×14 px | `/contacto` |
| ❚❚ Pausa | 54×16 px | `/` |
| 01 Prenda | 76×16 px | `/` |
| 02 Sublimado | 101×16 px | `/` |
| 03 Uso | 50×16 px | `/` |
| Categorías | 86×16 px | `/productos/microfibra`, `/productos/texturizado (×3 rutas)` |
| Dortmund Plus | 112×16 px | `/productos/microfibra/dortmund-plus/blancos`, `/productos/microfibra/dortmund-plus/claros (×4 rutas)` |
| Inicio | 52×16 px | `/asesor-virtual` |
| Microfibra | 86×16 px | `/productos/microfibra/athletic (×19 rutas)`, `/productos/microfibra/chelsea (×9 rutas)`, `/productos/microfibra/dortmund-plus` y 3 más |
| Productos | 78×16 px | `/productos/camisetas`, `/productos/microfibra`, `/productos/microfibra/athletic (×19 rutas)` y 6 más |
| asesor@textilpadilla.ec | 195×20 px | `/productos/camisetas`, `/productos/microfibra`, `/productos/microfibra/dortmund-plus` |
| Teléfono · +593 2 000 0000 | 219×20 px | `/productos/camisetas`, `/productos/microfibra`, `/productos/microfibra/dortmund-plus` |
| WhatsApp · +593 99 999 9999 | 227×20 px | `/productos/camisetas`, `/productos/microfibra`, `/productos/microfibra/dortmund-plus` |
| + | 30×30 px | `/contacto` |
| − | 30×30 px | `/contacto` |
| ← | 36×36 px | `/` |
| → | 36×36 px | `/` |
| Cómo llegar ↗ (×5) | 323×36 px | `/contacto` |
| Hablar con el asesor virtual → | 203×36 px | `/productos/microfibra/dortmund-plus/claros (×4 rutas)`, `/productos/microfibra/imperial (×21 rutas)` |
| hola@textilpadilla.ec | 146×36 px | `/contacto` |
| Ver catálogo de telas → | 162×36 px | `/contacto`, `/empresa` |
| Ver Dortmund Plus → | 149×36 px | `/productos/microfibra/dortmund-plus/blancos` |
| Ver evento → | 94×36 px | `/` |
| Ver ficha técnica y colores → (×2) | 197×36 px | `/productos/camisetas` |
| Ver Microfibra → | 115×36 px | `/productos/microfibra/athletic (×19 rutas)`, `/productos/microfibra/chelsea (×9 rutas)` |
| Ver todas las telas para camiseta → | 242×36 px | `/productos` |
| Guayaquil | 297×37 px | `/contacto` |
| La Marín | 121×37 px | `/contacto` |
| Matriz Alangasí | 175×37 px | `/contacto` |
| Sangolquí | 155×37 px | `/contacto` |
| Solanda | 140×37 px | `/contacto` |
| (sin texto) (×5) | 40×40 px | `/productos/microfibra/dortmund-plus/blancos` |

---

## 9 · Imágenes sin `alt`

✅ Toda imagen declara `alt`. Un `alt=""` no cuenta como fallo: es la forma correcta de marcar una imagen decorativa, y los fondos de cabecera lo llevan a propósito.

**No comprobado automáticamente:** si el `alt` describe lo que de verdad hay en el slot. Es una pregunta semántica y ningún script la puede contestar; queda para revisión humana cuando lleguen las fotografías.

---

## 10 · Foco de teclado invisible

✅ Todo control interactivo cambia de aspecto al recibir el foco.

---

## 11 · Clases de Tailwind que no llegan al CSS

Tailwind v4 descarta **en silencio** las utilidades cuyo valor suelto no es múltiplo de 0,25: sin error de build ni de lint. Es el fallo de `translate-y-1.625` que dejó el icono del menú en una sola raya. Ningún otro chequeo del proyecto lo detecta; ahora es `npm run tailwind:numericas`.

✅ Ninguna clase escrita se está cayendo del CSS compilado.

---

## 12 · Valores arbitrarios con token equivalente

Solo se listan los arbitrarios con medida absoluta (`px`/`rem`) en utilidades que **sí** tienen escala de tokens. Los de layout (`[70vh]`, `[clamp(…)]`, `grid-cols-[…]`) quedan fuera por el mismo criterio con el que `eslint.config.mjs` decidió no prohibirlos: no hay token que los sustituya y marcarlos sería ruido.

| Fichero | Clase | Token equivalente |
| --- | --- | --- |
| `src/components/ui/CategoryCard.tsx:147` | `text-[28px]` | sin equivalente exacto |
| `src/components/ui/Footer.tsx:31` | `text-[19px]` | `text-body-l` |
| `src/components/ui/Navbar.tsx:496` | `text-[24px]` | sin equivalente exacto |

---

## 13 · Colores y tipografías fuera del sistema

Las clases arbitrarias de color y tamaño de fuente ya las bloquea eslint en build, así que aquí se listan las dos cosas que esa regla no ve: los colores literales dentro de `style={{…}}`, que llegan al DOM sin pasar por Tailwind, y las excepciones que alguien aprobó con `eslint-disable`. Las segundas no son fallos —son las salidas del sistema, y tenerlas inventariadas es parte de esto.

| Tipo | Fichero | Fragmento |
| --- | --- | --- |
| color literal en estilo en línea | `src/components/ui/Timeline.tsx:89` | `gsap.set(dot, { backgroundColor: "#F5F2EE", borderColor: "#C8C2B8" });` |
| color literal en estilo en línea | `src/components/ui/Timeline.tsx:98` | `backgroundColor: "#A0715A",` |
| color literal en estilo en línea | `src/components/ui/Timeline.tsx:99` | `borderColor: "#A0715A",` |
| excepción aprobada al guardarraíl de tokens | `src/app/page.tsx:158` | `// eslint-disable-next-line no-restricted-syntax -- display "Verdad material": tamaño fluido único, fuera de la escala e` |
| excepción aprobada al guardarraíl de tokens | `src/components/ui/BotonWhatsApp.tsx:76` | `// eslint-disable-next-line no-restricted-syntax -- teal de cabecera de WhatsApp Web, marca ajena, no es color de paleta` |
| excepción aprobada al guardarraíl de tokens | `src/components/ui/BotonWhatsApp.tsx:79` | `// eslint-disable-next-line no-restricted-syntax -- Teal Green Dark de WhatsApp, marca ajena` |
| excepción aprobada al guardarraíl de tokens | `src/components/ui/buttonVariants.ts:103` | `// eslint-disable-next-line no-restricted-syntax -- teal de cabecera de WhatsApp Web, marca ajena` |
| excepción aprobada al guardarraíl de tokens | `src/components/ui/buttonVariants.ts:105` | `// eslint-disable-next-line no-restricted-syntax -- Teal Green Dark de WhatsApp, marca ajena` |
| excepción aprobada al guardarraíl de tokens | `src/components/ui/CategoryCard.tsx:146` | `{/* eslint-disable-next-line no-restricted-syntax -- título de card: escala propia del componente, no de la escala edito` |
| excepción aprobada al guardarraíl de tokens | `src/components/ui/Footer.tsx:30` | `{/* eslint-disable-next-line no-restricted-syntax -- tagline itálica del footer, tamaño decorativo único (fase 3) */}` |
| excepción aprobada al guardarraíl de tokens | `src/components/ui/Navbar.tsx:495` | `{/* eslint-disable-next-line no-restricted-syntax -- tamaño de glifo "+" del acordeón, no es texto (fase 3) */}` |
| excepción aprobada al guardarraíl de tokens | `src/components/ui/ProductCard.tsx:66` | `{/* eslint-disable-next-line no-restricted-syntax -- título de card fluido: escala propia del componente, no editorial (` |
| excepción aprobada al guardarraíl de tokens | `src/components/ui/SubcategoryTile.tsx:87` | `{/* eslint-disable-next-line no-restricted-syntax -- título de card fluido: escala propia del componente, no editorial (` |

---

## Priorización

Tres niveles. El criterio de orden dentro de cada uno es **a cuántas rutas reales afecta**: lo que se repite en 48 páginas no cuesta lo mismo que lo que pasa en dos.

### 1 · Rompe algo — hay que arreglarlo

- **3 enlaces internos rotos o con ancla sin destino** (§7). Un enlace que no lleva a ningún sitio es el fallo más barato de encontrar y el más caro de enseñar en una presentación.

### 2 · Se nota en la presentación

- **5 alturas de banda de cabecera distintas a 375 px** (§1): 392 px, 628 px, 676 px, 688 px, 764 px. Es lo primero que se ve al pasar de una página a otra.
- **5 alturas de banda de cabecera distintas a 1440 px** (§1): 448 px, 630 px, 648 px, 680 px, 720 px. Es lo primero que se ve al pasar de una página a otra.
- **73 áreas táctiles por debajo de 44 px** (§8). No impide usar el sitio, pero en una demo hecha desde el móvil se falla el toque.
- **4 tamaños de titular fuera de la escala de tokens** (§4): h3 21 px @375, h3 26 px @1440, h3 28 px @1440, h3 28 px @375. Todos corresponden a títulos de card con escala propia ya aprobada (§13), así que la decisión es si esa escala paralela se consolida como token o se retira.

### 3 · Cosmético — puede esperar

- **3 valores arbitrarios con token equivalente** (§12). No se ven; encarecen el siguiente cambio de escala.
- **3 colores literales en estilos en línea** (§13). Fuera del alcance del guardarraíl de eslint; hoy no rompen nada.
- **7 plantillas construidas sin `<section>`** (§2), frente al resto que sí las usa. Conviven dos formas de montar una página; unificarlo es refactor, no arreglo.

---

## Ruido conocido — excluido a propósito

Ya diagnosticado en otras tandas. Se deja escrito en vez de borrarlo: un hallazgo que desaparece sin rastro se vuelve a descubrir dentro de un mes y se vuelve a investigar desde cero.

- **Contraste de `BotonWhatsApp` a 375 px en la ruta de blancos (1,72:1)** — lo causa el marcador de hueco encendido; desaparece cuando lleguen las fotos.
- **`npm run imagenes` sale con código 1 por el hueco sin slot en `blancos/page.tsx`** — es Parte B, ya planificada.
- **Aviso de lint en `scripts/verificar-botones.mjs`** — conocido.
- **Error de hidratación React #418 en `/` con `prefers-reduced-motion`** — conocido y diagnosticado.
- **Marcadores de hueco de imagen visibles** — están encendidos a propósito mientras faltan las fotografías.

