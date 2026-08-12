# Inventario de botones y CTA

> **Nota posterior — `--color-brand` cambió de `#33a2dc` a `#55a4db`.** Este informe
> es una foto fija de `6796460` y se deja tal cual: reescribirle las cifras
> convertiría un registro en una suposición. Lo que se movió, medido con
> `npm run marca`, que fotografía las doce rutas: el azul COMO TEXTO da sobre `paper`
> 2,56 → **2,44**, sobre `bone` 2,37 → **2,25** y sobre `brand-deep` 5,28 → **5,56**.
> La fila de `brand` como RELLENO no la mide ese barrido —hoy no hay ningún control
> con el azul de fondo, y por eso la tabla es una hipótesis—; por luminancia, el azul
> nuevo sube ahí a ~6,5:1 con `ink` encima. Ninguna combinación cruza su umbral por el
> cambio: las que fallaban siguen fallando y las que pasaban siguen pasando. Los
> recuentos de elementos siguen siendo válidos.
>
> **Segunda nota — el azul de texto sobre claro ya se está arreglando.** De la fila
> «Estado activo en `text-brand` sobre `paper`» (12 elementos, §resumen) el
> recomendador de `/productos` pasó a `text-brand-ink` —5,10:1, filete incluido— y
> con él las tres rejillas de catálogo («Ficha disponible», 36 medidas) y los
> eyebrow sobre `bone` del asesor de la portada y de «Ejemplo de aplicación»
> (4,70:1). Sigue pendiente el **paso activo del stepper de la portada**
> (fila «01 PRENDA»): ahí el azul claro también gobierna la barra de progreso, así
> que no es un cambio de token sino una decisión del rediseño del stepper.
>
> **Tercera nota — ese pendiente ya no es solo «de la portada».** Desde agosto de
> 2026 el bloque `AsesorPasos` también cierra `/empresa`, así que el mismo 2,25:1 se
> publica en dos páginas y cuatro apariciones. Sigue en `docs/pendientes.md` §1, que
> es donde se lleva ahora la cuenta.

Fase de diagnóstico. **No propone solución ni cambia código**: solo levanta el mapa de
lo que hay hoy en `main` para poder decidir con datos.

- Rama `inventario/botones-cta`, desde `main` (`6796460`).
- Medido: **12 rutas públicas + 1 estado adicional** (el asesor virtual en su paso de
  resultado, que tiene CTA propios). Quedan fuera `/styleguide` y `/admin/imagenes`,
  que son internas.
- **322 elementos interactivos** capturados. 317 son botones o enlaces; los otros 5 son
  marcadores de Leaflet en el mapa de Contacto: interactivos, pero no CTA.

## Cómo se midió

Contraste **del peor píxel bajo cada texto**, no promedio.

1. El color del texto **no se parsea**: Tailwind v4 lo devuelve en `oklch(...)` y leer
   esos números como si fueran RGB da basura. Se resuelve pintándolo en un `<canvas>`
   sobre negro y sobre blanco: la pasada negra da `alpha × color`, y la diferencia
   entre ambas da `1 − alpha`. Funciona con cualquier sintaxis de color.
2. El fondo sale de una segunda captura con **todo el texto en `transparent`** — no con
   `visibility:hidden`, que se llevaría por delante el fondo del propio botón.
3. Se compone el color sobre **cada píxel** de la caja del texto y se reporta el peor.
4. La medida se acota a la **máscara real de glifo** (diferencia entre las dos
   capturas). Sin esto, la caja de un enlace que envuelve una tarjeta entera incluye la
   foto, y la del logotipo incluye el cuadrado azul de marca: salían "fallos" en
   píxeles donde no hay ninguna letra.
5. Antes de medir se recorre la página entera y se espera a que **toda imagen diferida**
   haya cargado. Sin la pasada de scroll, lo que entra con `whileInView` sigue a
   opacidad 0 y el filtro de visibilidad lo descarta — se perdían las 20 tarjetas de
   subcategoría de Microfibra. Sin la espera de imágenes, una foto que termina de
   cargar entre las dos capturas ensucia la máscara.
6. Se descartan los elementos que están en el DOM pero **no se ven**: el mega-menú y el
   menú móvil viven con `opacity: 0`. Sin ese filtro aparecían enlaces de navbar
   "fallando" que en pantalla no existen.

Umbral por tamaño real: **3:1** si ≥24px, o ≥18,66px con peso ≥700; **4,5:1** en el
resto. Los controles de solo icono se miden aparte, contra el mínimo no textual de
WCAG 1.4.11 (3:1).

---

## 1 · Las tres variantes que existen hoy

`src/components/ui/buttonVariants.ts` define exactamente tres:

| Variante | Clases | Sobre `paper` | |
|---|---|---|---|
| `primary` | `h-12 bg-brand px-7.5 text-paper` | **2,56:1** | ❌ mín. 4,5 |
| `secondary` | `h-12 border border-greige px-7.5 text-ink` | 15,67:1 | ✅ |
| `ghost` | `border-b border-transparent text-body-s text-ink` | 15,67:1 | ✅ |

El `primary` solo alcanza contraste **mientras está en hover**: `hover:bg-brand-deep`
lleva el texto a 13,4:1. En reposo —que es como se ve casi siempre, y como se ve
*siempre* en táctil— está en 2,56:1.

---

## 2 · Tablas por tipo de destino

✅ cumple · ❌ por debajo del mínimo · n/d sin texto (ver §3).
Navbar, footer y breadcrumb se repiten idénticos en las 13 vistas: se colapsan a una
fila con el número de páginas y el **peor** contraste de todas ellas.

### WhatsApp — 16 puntos de entrada

| | Dónde | Texto | Variante hoy | Peor píxel | Mín. |
|---|---|---|---|---|---|
| ❌ | flotante · 13 vistas | *(solo icono)* `aria-label`: "Escribir a Textil Padilla por WhatsApp" | `bg-[#25D366]` + glifo blanco | **1,98:1** | 3:1 |
| ✅ | Camisetas · cuerpo | WhatsApp · +593 99 999 9999 | enlace de texto mono 13px | 9,16:1 | 4,5:1 |
| ✅ | Microfibra · cuerpo | WhatsApp · +593 99 999 9999 | enlace de texto mono 13px | 9,16:1 | 4,5:1 |
| ✅ | Dortmund Plus · cuerpo | WhatsApp · +593 99 999 9999 | enlace de texto mono 13px | 9,16:1 | 4,5:1 |

Todos apuntan a `https://wa.me/593999999999?text=…` desde `src/data/whatsapp.ts`.
**Ningún CTA de WhatsApp usa una variante de botón.**

### Envío de formulario — 4

| | Dónde | Texto | Variante hoy | Peor píxel | Mín. |
|---|---|---|---|---|---|
| ❌ | Camisetas · cuerpo | Enviar consulta → | botón primary | **2,56:1** | 4,5:1 |
| ❌ | Microfibra · cuerpo | Enviar consulta → | botón primary | **2,56:1** | 4,5:1 |
| ❌ | Dortmund Plus · cuerpo | Enviar consulta → | botón primary | **2,56:1** | 4,5:1 |
| ❌ | Contacto · cuerpo | Enviar mensaje → | botón primary | **2,56:1** | 4,5:1 |

Los cuatro fallan. Es el gesto más irreversible del sitio y su botón es ilegible en
reposo.

### Enlace externo — 15 controles distintos (51 instancias)

| | Dónde | Texto | Variante hoy | Destino | Peor píxel |
|---|---|---|---|---|---|
| ✅ | Camisetas / Microfibra / Dortmund Plus · cuerpo ×3 | Teléfono · +593 2 000 0000 | enlace de texto | `tel:` | 9,16:1 |
| ✅ | Camisetas / Microfibra / Dortmund Plus · cuerpo ×3 | asesor@textilpadilla.ec | enlace de texto | `mailto:` | 9,16:1 |
| ✅ | Contacto · cuerpo | hola@textilpadilla.ec | enlace de texto | `mailto:` | 15,67:1 |
| ✅ | Contacto · cuerpo ×5 | Cómo llegar ↗ | enlace de texto | Google Maps | 15,67:1 |
| ✅ | navbar · 13 vistas | Portal Clientes ↗ | enlace de texto | `clientes.textilpadilla…` | 15,70:1 |
| ✅ | footer · 13 vistas | hola@textilpadilla.ec | enlace de texto | `mailto:` | 8,54:1 |
| ✅ | footer · 13 vistas | +593 2 000 0000 | enlace de texto | `tel:` | 8,54:1 |

Ninguna incidencia. Ningún enlace externo se distingue hoy de uno interno salvo por la
flecha `↗` que llevan dos de ellos.

### Navegación interna — 92 controles distintos (216 instancias)

**Los que fallan, todos por la misma causa:**

| | Dónde | Texto | Variante hoy | Destino | Peor píxel |
|---|---|---|---|---|---|
| ❌ | Home · hero | Ver catálogo de telas → | botón primary | `/productos` | **2,56:1** |
| ❌ | Home · cuerpo | Probar el asesor virtual → | botón primary | `/asesor-virtual` | **2,56:1** |
| ❌ | Empresa · hero | Conocer nuestra historia → | botón primary | `#historia` | **2,56:1** |
| ❌ | Empresa · cuerpo | Hablar con un asesor → | botón primary | `/#asesor` | **2,56:1** |
| ❌ | Productos · hero | Encontrar mi tela → | botón primary | `#recomendador` | **2,56:1** |
| ❌ | Productos · cuerpo | Hablar con un asesor → | botón primary | `/#asesor` | **2,56:1** |
| ❌ | Camisetas · hero | Ver telas para camiseta → | botón primary | `#telas` | **2,56:1** |
| ❌ | Microfibra · hero | Ver las subcategorías → | botón primary | `#subcategorias` | **2,56:1** |
| ❌ | Dortmund Plus · hero | Ver especificaciones → | botón primary | `#especificaciones` | **2,56:1** |
| ❌ | Athletic · cuerpo | Pedir muestra → | botón primary | `/contacto` | **2,56:1** |
| ❌ | Blancos · cuerpo | Solicitar muestra de este color → | botón primary | `…/blancos#muestra` | **2,56:1** |
| ❌ | Contacto · cuerpo | Escríbenos ahora → | botón primary | `#escribenos` | **2,56:1** |
| ❌ | navbar · 13 vistas | Enlace de la página actual (`Inicio`, `Nuestra Empresa`, `Nuestros Productos` ×7, `Contacto`) | `text-brand` como estado activo | — | **2,57:1** |
| ❌ | footer · 13 vistas | POLÍTICA DE TRATAMIENTO DE DATOS | `text-graphite` sobre `brand-deep` | `/politica-datos` | **2,63:1** |

**Los que cumplen:**

| | Dónde | Texto | Variante hoy | Peor píxel |
|---|---|---|---|---|
| ✅ | Contacto · hero | Ver nuestros locales → | enlace de texto (`secondaryCta`) | 7,56:1 |
| ✅ | Productos · cuerpo | Probar el asesor virtual → | botón secondary | 15,67:1 |
| ✅ | Athletic · cuerpo | Ver Microfibra → | botón secondary | 15,67:1 |
| ✅ | Productos · cuerpo | Ver todas las telas para camiseta → | botón ghost | 15,67:1 |
| ✅ | Blancos · cuerpo | Ver Dortmund Plus → | botón ghost | 15,67:1 |
| ✅ | Empresa · cuerpo | Ver catálogo de telas → | enlace de texto | 13,54:1 |
| ✅ | Contacto · cuerpo | Ver catálogo de telas → | enlace de texto | 15,67:1 |
| ✅ | Home y Productos · cuerpo ×8 | Tarjetas de las 4 familias (`01 Microfibra`…) | tarjeta enlazada | 11,71 – 11,87:1 |
| ✅ | Microfibra · cuerpo ×20 | Tarjetas de subcategoría, cada una con "Ver ficha →" | tarjeta enlazada / enlace de texto | 13,20 – 15,67:1 |
| ✅ | Texturizado · cuerpo ×8 | Tarjetas de subcategoría | tarjeta enlazada / enlace de texto | 13,20 – 15,67:1 |
| ✅ | Dortmund Plus · cuerpo ×5 | Tarjetas de tono (`Blancos 01`…) | enlace de texto | 15,67:1 |
| ✅ | Blancos · cuerpo ×3 | Telas relacionadas | enlace de texto | 13,20:1 |
| ✅ | Asesor · resultado ×3 | Ver ficha → | enlace de texto | 13,54:1 |
| ✅ | Asesor · resultado ×3 | Hablar → | enlace de texto | 5,76:1 |
| ✅ | Contacto · cuerpo ×2 | `+` / `−` (zoom del mapa) | enlace de texto 22px/700 | 21,00:1 |
| ✅ | breadcrumb · 5 rutas | PRODUCTOS · CATEGORÍAS · MICROFIBRA · DORTMUND PLUS · INICIO | enlace de texto mono 12px | 4,84 – 6,46:1 |
| ✅ | navbar · 13 vistas | Textil Padilla (logotipo) | enlace de texto | 15,70:1 |
| ✅ | footer · 13 vistas | Textil Padilla · Misión y visión · Nuestra historia · Hitos | enlace de texto | 12,50 – 13,54:1 |

Los breadcrumbs pasan, pero por poco: `INICIO` sobre la foto del asesor virtual se
queda en **4,84:1** frente a un mínimo de 4,5.

### Acción en la página, sin destino de URL — 30

| | Dónde | Texto | Variante hoy | Peor píxel | Mín. |
|---|---|---|---|---|---|
| ❌ | Home · cuerpo | 01 PRENDA (paso activo del asesor) | `text-brand` | **2,37:1** | 4,5:1 |
| ❌ | Productos · cuerpo | Camiseta (pestaña activa del recomendador) | `border-brand text-brand` | **2,56:1** | 4,5:1 |
| ✅ | Home · cuerpo ×2 | 02 SUBLIMADO · 03 USO (pasos inactivos) | enlace de texto | 4,75:1 | 4,5:1 |
| ✅ | Productos · cuerpo ×2 | Chompa · Pantalón deportivo (pestañas inactivas) | enlace de texto | 5,15:1 | 4,5:1 |
| ✅ | Home · cuerpo | Ver evento → | enlace de texto | 14,46:1 | 4,5:1 |
| ✅ | Home · cuerpo | ❚❚ Pausa | enlace de texto | 5,15:1 | 4,5:1 |
| ✅ | Home · cuerpo ×2 | ← · → (carrusel) | enlace de texto | 15,67:1 | 4,5:1 |
| ✅ | Contacto · cuerpo ×5 | MATRIZ ALANGASÍ · LA MARÍN · SOLANDA · SANGOLQUÍ · GUAYAQUIL | enlace de texto 11px | 4,75:1 | 4,5:1 |
| ✅ | Asesor · cuerpo ×4 | Camiseta · Chompa / buzo · Pantalón deportivo · Otro | tarjeta pulsable | 13,54:1 | 4,5:1 |
| ✅ | Asesor · resultado | ↻ Empezar de nuevo | enlace de texto | 4,60:1 | 4,5:1 |
| n/d | Home · cuerpo ×4 | Puntos del carrusel de eventos | icono | — | 3:1 |
| n/d | Blancos · cuerpo ×5 | Muestras de color | icono | — | 3:1 |
| n/d | Athletic · cuerpo | Vista 1 | icono | — | 3:1 |

Detalle que se repite: **el estado activo siempre contrasta peor que el inactivo.**
En el asesor de la portada el paso activo da 2,37:1 y los inactivos 4,75:1; en el
recomendador de Productos la pestaña activa da 2,56:1 y las inactivas 5,15:1.

---

## 3 · Los CTA de solo icono

El flotante de WhatsApp aparece en las 13 vistas. Sin texto, su umbral es el no textual
(3:1). Medido a escala 2× sobre la captura real, contando colores del recorte:

| Elemento | Trazo | Fondo | Contraste | Mín. | |
|---|---|---|---|---|---|
| Flotante WhatsApp (`BotonWhatsApp.tsx`) | `#ffffff` | `#25D366` | **1,98:1** | 3:1 | ❌ |

**Esto corrige la premisa del encargo.** El flotante *no* se salva por llevar icono:
1,98:1 tampoco llega al 3:1 no textual. El problema del verde de WhatsApp con relleno
blanco ya existe hoy, en las 13 vistas. No es algo que fuera a aparecer al introducir
el criterio de color: es algo que el criterio de color **hereda**.

### Capacidad de cada fondo

Qué texto admite cada color de relleno, para que la decisión de la siguiente fase no
vaya a ciegas:

| Fondo | con `paper` #f5f2ee | con `ink` #1c1917 |
|---|---|---|
| `brand` #33a2dc | 2,56:1 ❌ | **6,19:1** ✅ |
| `brand-deep` #0d2937 | **13,40:1** ✅ | 1,17:1 ❌ |
| WhatsApp #25D366 | 1,98:1 ❌ | **8,82:1** ✅ |

Los dos colores claros —el azul de marca y el verde de WhatsApp— solo admiten texto
oscuro. Es el mismo límite en ambos: el criterio nuevo no añade un problema distinto
del que ya hay.

---

## 4 · Carga por pantalla

Cuántos controles hay en cada vista y de qué peso. El chrome (navbar, footer) es
idéntico en todas y no se cuenta aquí.

| Página | primary | secondary | ghost | tarjeta pulsable | tarjeta enlazada | flotante | enlace de texto | Total |
|---|---|---|---|---|---|---|---|---|
| Home | **2** | · | · | · | · | 1 | 15 | 18 |
| Empresa | **2** | · | · | · | · | 1 | 1 | 4 |
| Productos | **2** | 1 | 1 | · | · | 1 | 7 | 12 |
| Productos · Camisetas | **2** | · | · | · | · | 1 | 4 | 7 |
| Categoría · Microfibra | **2** | · | · | · | 13 | 1 | 12 | 28 |
| Categoría · Texturizado | 0 | · | · | · | 7 | 1 | 1 | 9 |
| Subcategoría · Dortmund Plus | **2** | · | · | · | · | 1 | 10 | 13 |
| Subcategoría · Athletic | 1 | 1 | · | · | · | 1 | 1 | 4 |
| Tono · Blancos | 1 | · | 1 | · | · | 1 | 9 | 12 |
| Contacto | **2** | · | · | · | · | 1 | 15 | 23 |
| Asesor virtual | 0 | · | · | 4 | · | 1 | · | 5 |
| Asesor virtual · resultado | 0 | · | · | · | · | 1 | 7 | 8 |
| Política de datos | 0 | · | · | · | · | 1 | · | 1 |

`globals.css` documenta el azul de marca como *"CTA principal (máx. uno por pantalla)"*.
**Siete de las trece vistas llevan dos.** Otras cuatro no llevan ninguno, incluido el
asesor virtual, que es el flujo con la intención de compra más clara del sitio.

Dónde se rompe la jerarquía, en concreto:

- **Home** — hero "Ver catálogo de telas →" y sección "Probar el asesor virtual →":
  dos azules idénticos compitiendo, con destinos distintos.
- **Empresa, Productos, Camisetas, Microfibra, Dortmund Plus** — el CTA del hero y el
  del formulario o del asesor tienen exactamente el mismo peso.
- **Contacto** — "Escríbenos ahora →" (ancla que solo hace scroll) y "Enviar mensaje →"
  (envío real del formulario) son visualmente idénticos.
- **Categoría · Microfibra** — 28 controles, 20 de ellos tarjetas de subcategoría, cada
  una con su "Ver ficha →".

---

## 5 · Resumen

### Cuántas variantes distintas hay para el mismo gesto

| Gesto | Variantes | Reparto |
|---|---|---|
| **Navegación interna** | **5** | enlace de texto 41 · tarjeta enlazada 20 · primary 12 · secondary 2 · ghost 2 |
| **WhatsApp** | **2** | flotante de icono 13 · enlace de texto mono 3 |
| **Acción en la página** | **2** | enlace de texto 26 · tarjeta pulsable 4 |
| **Envío de formulario** | **1** | primary 4 |
| **Enlace externo** | **1** | enlace de texto 12 |

Dos lecturas salen de aquí:

1. **El azul primario significa cuatro cosas distintas.** Navegar dentro de la página
   (`#historia`, `#telas`, `#especificaciones`), navegar a otra página (`/productos`,
   `/asesor-virtual`), pedir muestra y **enviar un formulario** usan el mismo botón. No
   hay ninguna señal visual que distinga "esto hace scroll" de "esto envía tus datos".
2. **WhatsApp no tiene tratamiento de botón en ningún sitio.** Es el único destino con
   cero botones: 13 iconos flotantes y 3 enlaces de texto mono a 13px, metidos en un
   bloque de datos de contacto junto al teléfono y el email. Hoy no se distingue de un
   enlace `tel:`.

### El hero de Contacto, confirmado

`Hero` acepta `primaryCta` (botón azul) y `secondaryCta` (enlace de texto blanco). De
las siete páginas que usan `<Hero>`:

| Página | primaryCta | secondaryCta |
|---|---|---|
| Home | Ver catálogo de telas → | — |
| Empresa | Conocer nuestra historia → | — |
| Productos | Encontrar mi tela → | — |
| Productos · Camisetas | Ver telas para camiseta → | — |
| Categoría · Microfibra | Ver las subcategorías → | — |
| Subcategoría · Dortmund Plus | Ver especificaciones → | — |
| **Contacto** | **ninguno** | **Ver nuestros locales →** |

Contacto es la única que pasa solo `secondaryCta` (`src/app/contacto/page.tsx:36`).
Con la ironía de que es la página cuyo objetivo es que la persona actúe. Y de rebote es
el único hero cuyo CTA **sí cumple contraste** (7,56:1), precisamente por no ser el
botón azul.

> **Resuelto.** Este apartado es el estado ANTERIOR al sistema de botones y se conserva
> como diagnóstico; las medidas de arriba son las de entonces. Al aplicar el sistema se
> convirtió `primaryCta` a `contorno` y Contacto, que no pasaba ninguno, se quedó con su
> enlace de texto: fuera del patrón de las otras seis cabeceras. Ahora pasa su CTA por
> `primaryCta` y el prop `secondaryCta` **se ha retirado de `Hero`** —era el hueco que
> permitía la divergencia—. Medido de nuevo con `npm run botones`: **5,20:1 a 375 y
> 7,22:1 a 1440** de texto, y 5,50:1 / 7,83:1 de límite de borde.

Las otras seis vistas no usan `<Hero>`: Texturizado y Athletic montan
`PreparacionPage`/`FichaSubcategoria`, Blancos tiene cabecera propia, y el asesor
virtual y Política de datos no tienen cabecera con CTA.

### Qué falla contraste

**54 instancias** por debajo de su mínimo, de tres causas —y la tercera y la cuarta son
la misma:

| Causa | Instancias | Medido | Mín. |
|---|---|---|---|
| `primary`: `text-paper` sobre `bg-brand` | **16** | 2,56:1 | 4,5:1 |
| Flotante WhatsApp: glifo blanco sobre `#25D366` | **13** | 1,98:1 | 3:1 |
| Footer legal: `text-graphite` sobre `bg-brand-deep` | **13** | 2,63:1 | 4,5:1 |
| Estado activo en `text-brand` sobre `paper` | **12** | 2,37 – 2,57:1 | 4,5:1 |

El primero y el último son el mismo token en dos papeles. `globals.css` le asigna a
`--color-brand` tres funciones a la vez —*"logo, CTA principal, estado activo"*— y como
texto falla en dos de las tres:

- enlace activo del navbar (`Inicio`, `Nuestra Empresa`, `Nuestros Productos` ×7,
  `Contacto`) — 2,57:1;
- paso activo del asesor de la portada (`01 PRENDA`) — 2,37:1;
- pestaña activa del recomendador de Productos (`Camiseta`) — 2,56:1.

El azul de marca solo es legible sobre fondos casi negros. Es el mismo techo que ya
apareció en el asesor virtual, donde hubo que sacarlo del titular del hero y de los
hover de las tarjetas de resultado.

### Lo que está sano

- `secondary` y `ghost`: 15,67:1, sin una sola incidencia.
- Las 28 tarjetas enlazadas de catálogo: 13,20 – 15,67:1.
- Los tres enlaces de WhatsApp en texto: 9,16:1.
- Todos los `tel:` y `mailto:`: 8,54 – 15,67:1.
- Las tarjetas pulsables del asesor virtual: 13,54:1.

El problema no está repartido por el sistema: **está concentrado en el azul de marca
—como fondo y como texto— y en el verde de WhatsApp con relleno blanco.** El resto del
sistema de botones cumple.
