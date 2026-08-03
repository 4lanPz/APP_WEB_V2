# Requisitos de fotografía por página — Textil Padilla

Lo que le falta a CADA PÁGINA para poder publicarse completa: sus secciones,
y dentro de cada una los huecos que siguen vacíos con su especificación.

**GENERADO — no editar a mano.** Sale del registro de slots y del manifiesto
de imágenes. Se regenera con `npm run imagenes:requisitos`, que escribe este
documento y su pareja a la vez.

Es la **segunda vista de `requisitos-fotografia.md`**, no otro encargo: los
mismos huecos, ordenados por dónde van en vez de por qué sesión los dispara.
Para salir a fotografiar sirve la otra —cada bloque suyo es una sesión—; esta
sirve para revisar el sitio página a página y para priorizar por página.

Los huecos que YA tienen foto no se listan, igual que en la otra vista: este
documento es lo que falta. El «faltan X de Y» de cada página da el total real,
y `npm run imagenes:slots` lista todos los huecos, llenos incluidos.

## Resumen

De **133 huecos** de imagen del sitio, **45 tienen foto** y **faltan 88**, repartidos en **11 páginas**.

| Página | Faltan | De |
|---|---|---|
| [Inicio](#inicio--) (`/`) | 11 | 13 |
| [Empresa](#empresa--empresa) (`/empresa`) | 11 | 14 |
| [Productos](#productos--productos) (`/productos`) | 3 | 5 |
| [Microfibra](#microfibra--productosmicrofibra) (`/productos/microfibra`) | 21 | 39 |
| [Dortmund Plus](#dortmund-plus--productosmicrofibradortmund-plus) (`/productos/microfibra/dortmund-plus`) | 2 | 3 |
| [Camisetas](#camisetas--productoscamisetas) (`/productos/camisetas`) | 2 | 4 |
| [Texturizado](#texturizado--productostexturizado) (`/productos/texturizado`) | 8 | 15 |
| [Spun](#spun--productosspun) (`/productos/spun`) | 8 | 10 |
| [Polialgodón](#polialgodón--productospolialgodon) (`/productos/polialgodon`) | 15 | 20 |
| [Asesor Virtual](#asesor-virtual--asesor-virtual) (`/asesor-virtual`) | 6 | 7 |
| [Contacto](#contacto--contacto) (`/contacto`) | 1 | 3 |

---

## Inicio — `/`

**Faltan 11 de 13 huecos.**

### Familias de tela — 4

#### `familia-microfibra.jpg`

- **Se ve a:** ~310 × 300 px en la rejilla de cuatro columnas (`CategoryCard`)
- **Proporción:** casi cuadrada; se recorta a la card con `object-cover`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Rollos de microfibra alineados en bodega, con el brillo característico del poliéster ligero.
- **Nota:** Card de la rejilla de cuatro columnas, ~310 × 300 px. Lleva encima un velo que baja hasta rgba(9,20,25,0.78) en el borde inferior, y sobre esa franja van el título y la descripción: la foto tiene que aguantar oscurecerse abajo y no llevar detalle importante ahí. (En las cabeceras hay que despejar el tercio izquierdo; aquí es la parte de abajo.) El mismo archivo se usa en la rejilla de /productos y en el styleguide: es un solo hueco, no tres.

#### `familia-texturizado.jpg`

- **Se ve a:** ~310 × 300 px en la rejilla de cuatro columnas (`CategoryCard`)
- **Proporción:** casi cuadrada; se recorta a la card con `object-cover`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tejido texturizado en plano abierto, con el cuerpo y el relieve del hilo a la vista.
- **Nota:** Card de la rejilla de cuatro columnas, ~310 × 300 px. Lleva encima un velo que baja hasta rgba(9,20,25,0.78) en el borde inferior, y sobre esa franja van el título y la descripción: la foto tiene que aguantar oscurecerse abajo y no llevar detalle importante ahí. (En las cabeceras hay que despejar el tercio izquierdo; aquí es la parte de abajo.) El mismo archivo se usa en la rejilla de /productos y en el styleguide: es un solo hueco, no tres.

#### `familia-spun.jpg`

- **Se ve a:** ~310 × 300 px en la rejilla de cuatro columnas (`CategoryCard`)
- **Proporción:** casi cuadrada; se recorta a la card con `object-cover`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela de hilado spun en plano abierto, de superficie mate y aspecto algodonoso.
- **Nota:** Card de la rejilla de cuatro columnas, ~310 × 300 px. Lleva encima un velo que baja hasta rgba(9,20,25,0.78) en el borde inferior, y sobre esa franja van el título y la descripción: la foto tiene que aguantar oscurecerse abajo y no llevar detalle importante ahí. (En las cabeceras hay que despejar el tercio izquierdo; aquí es la parte de abajo.) El mismo archivo se usa en la rejilla de /productos y en el styleguide: es un solo hueco, no tres.

#### `familia-polialgodon.jpg`

- **Se ve a:** ~310 × 300 px en la rejilla de cuatro columnas (`CategoryCard`)
- **Proporción:** casi cuadrada; se recorta a la card con `object-cover`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela de mezcla poliéster-algodón en plano abierto, con la trama del tejido visible.
- **Nota:** Card de la rejilla de cuatro columnas, ~310 × 300 px. Lleva encima un velo que baja hasta rgba(9,20,25,0.78) en el borde inferior, y sobre esa franja van el título y la descripción: la foto tiene que aguantar oscurecerse abajo y no llevar detalle importante ahí. (En las cabeceras hay que despejar el tercio izquierdo; aquí es la parte de abajo.) El mismo archivo se usa en la rejilla de /productos y en el styleguide: es un solo hueco, no tres.

### Encuentros — 4

#### `evento-feria-andina.jpg`

- **Se ve a:** media anchura del carrusel, ~600 px (`EventCarousel`)
- **Proporción:** 4:3 apaisada — el marco es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Stand de Textil Padilla en la Feria Internacional del Textil Andino, con muestrario de telas.
- **Nota:** Apaisada (4:3), a media anchura del carrusel de encuentros (~600 px). Documental: material y gente reales, sin posado de estudio ni rótulos quemados. La portada lo presenta como un hecho de la empresa, así que no admite imagen generada ni de banco (ver README-imagenes.md §5). El stand en el recinto, con gente delante: se tiene que leer que es una feria y no una bodega. Luz de recinto, sin flash directo.

#### `evento-jornada-color.jpg`

- **Se ve a:** media anchura del carrusel, ~600 px (`EventCarousel`)
- **Proporción:** 4:3 apaisada — el marco es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Jornada de color a demanda: cliente comparando su referencia contra una carta de color.
- **Nota:** Apaisada (4:3), a media anchura del carrusel de encuentros (~600 px). Documental: material y gente reales, sin posado de estudio ni rótulos quemados. La portada lo presenta como un hecho de la empresa, así que no admite imagen generada ni de banco (ver README-imagenes.md §5). Plano medio de las manos, la carta de color y la muestra del cliente sobre la mesa. La carta tiene que salir legible y en luz neutra: es lo que sostiene el argumento del teñido a demanda, y una carta con dominante no se puede enseñar.

#### `evento-alianza-retail.jpg`

- **Se ve a:** media anchura del carrusel, ~600 px (`EventCarousel`)
- **Proporción:** 4:3 apaisada — el marco es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Rollos de tela preparados para un cliente de retail premium.
- **Nota:** Apaisada (4:3), a media anchura del carrusel de encuentros (~600 px). Documental: material y gente reales, sin posado de estudio ni rótulos quemados. La portada lo presenta como un hecho de la empresa, así que no admite imagen generada ni de banco (ver README-imagenes.md §5). Rollos etiquetados y preparados para despacho, en bodega. Sin marcas ni logotipos de terceros identificables: al cliente no se le nombra.

> **⚠ POR CONFIRMAR ANTES DE DISPARAR.** El id anuncia una ALIANZA y la nota describe un DESPACHO, que no es lo mismo. Antes de disparar hay que confirmar qué ocurrió de verdad en este encuentro: si la foto no comunica el acuerdo, el titular de la tarjeta dirá una cosa y la imagen otra. La nota está escrita con lo que hay hoy, que es el alt; si el evento resulta ser otra cosa, se reescribe aquí antes de la sesión.

#### `evento-performknit-320.jpg`

- **Se ve a:** media anchura del carrusel, ~600 px (`EventCarousel`)
- **Proporción:** 4:3 apaisada — el marco es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Presentación de la línea PerformKnit 320: detalle del tejido sobre la mesa de muestras.
- **Nota:** Apaisada (4:3), a media anchura del carrusel de encuentros (~600 px). Documental: material y gente reales, sin posado de estudio ni rótulos quemados. La portada lo presenta como un hecho de la empresa, así que no admite imagen generada ni de banco (ver README-imagenes.md §5). El tejido de la línea sobre la mesa de muestras, cenital o en tres cuartos. Prima que se lea el tejido, no la sala.

### Asesor virtual — 3

#### `asesor-portada-prenda.jpg`

- **Se ve a:** media pantalla del split, mínimo 380 px de alto, solo desde tablet (`AsesorPasos`)
- **Proporción:** flexible — la caja recorta con `object-cover`
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Prendas deportivas en confección: camisetas y buzos que definen el punto de partida de la asesoría.
- **Nota:** Paso 01 (Prenda). Qué se va a producir: prenda deportiva terminada o en confección. Sin rótulos quemados. Formato flexible; se recorta a la caja del split.

#### `asesor-portada-sublimado.jpg`

- **Se ve a:** media pantalla del split, mínimo 380 px de alto, solo desde tablet (`AsesorPasos`)
- **Proporción:** flexible — la caja recorta con `object-cover`
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Tela clara con estampado sublimado full-print, mostrando el color a sangre sobre la base.
- **Nota:** Paso 02 (Sublimado). Base clara con estampado full-print, o el contraste liso/sublimado. Formato flexible; se recorta a la caja del split.

#### `asesor-portada-uso.jpg`

- **Se ve a:** media pantalla del split, mínimo 380 px de alto, solo desde tablet (`AsesorPasos`)
- **Proporción:** flexible — la caja recorta con `object-cover`
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Tela en uso deportivo, mostrando el rendimiento y la caída del género en movimiento.
- **Nota:** Paso 03 (Uso). El destino de la tela: alto rendimiento, casual o uniforme. Formato flexible; se recorta a la caja del split.

---

## Empresa — `/empresa`

**Faltan 11 de 14 huecos.**

### Oficio — 2

#### `oficio-tintoreria.jpg`

- **Se ve a:** media columna del bloque de Oficio, hasta ~620 px de ancho (`empresa/page.tsx`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Tintorería de Textil Padilla: barcas de teñido en proceso.
- **Nota:** Área de tintorería en marcha. Apaisada (4:3). Es la que sostiene el argumento del teñido a demanda.

#### `oficio-carta-color.jpg`

- **Se ve a:** media columna del bloque de Oficio, hasta ~620 px de ancho (`empresa/page.tsx`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Carta de color de Textil Padilla: muestras de tela teñidas ordenadas por tono.
- **Nota:** Muestrario físico de colores. Apaisada (4:3).

### Línea de hitos — 9

#### `hito-fnd-01.jpg`

- **Se ve a:** columna lateral de 240 px de ancho (`Timeline`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 900 px
- **Qué debe verse:** Textil Padilla, 1987 · Fundación en Alangasí.
- **Nota:** Opcional: la línea de hitos funciona sin fotos. Formato 4:3.

#### `hito-loc-01.jpg`

- **Se ve a:** columna lateral de 240 px de ancho (`Timeline`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 900 px
- **Qué debe verse:** Textil Padilla, 1994 · Consolidación de la matriz.
- **Nota:** Opcional: la línea de hitos funciona sin fotos. Formato 4:3.

#### `hito-prd-01.jpg`

- **Se ve a:** columna lateral de 240 px de ancho (`Timeline`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 900 px
- **Qué debe verse:** Textil Padilla, 1999 · Teñido a demanda.
- **Nota:** Opcional: la línea de hitos funciona sin fotos. Formato 4:3.

#### `hito-loc-02.jpg`

- **Se ve a:** columna lateral de 240 px de ancho (`Timeline`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 900 px
- **Qué debe verse:** Textil Padilla, 2003 · Local de La Marín.
- **Nota:** Opcional: la línea de hitos funciona sin fotos. Formato 4:3.

#### `hito-loc-03.jpg`

- **Se ve a:** columna lateral de 240 px de ancho (`Timeline`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 900 px
- **Qué debe verse:** Textil Padilla, 2008 · Local de Solanda.
- **Nota:** Opcional: la línea de hitos funciona sin fotos. Formato 4:3.

#### `hito-loc-04.jpg`

- **Se ve a:** columna lateral de 240 px de ancho (`Timeline`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 900 px
- **Qué debe verse:** Textil Padilla, Apertura de local.
- **Nota:** Opcional: la línea de hitos funciona sin fotos. Formato 4:3.

#### `hito-loc-05.jpg`

- **Se ve a:** columna lateral de 240 px de ancho (`Timeline`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 900 px
- **Qué debe verse:** Textil Padilla, Apertura de local.
- **Nota:** Opcional: la línea de hitos funciona sin fotos. Formato 4:3.

#### `hito-qlt-01.jpg`

- **Se ve a:** columna lateral de 240 px de ancho (`Timeline`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 900 px
- **Qué debe verse:** Textil Padilla, Control de calidad.
- **Nota:** Opcional: la línea de hitos funciona sin fotos. Formato 4:3.

#### `hito-prd-02.jpg`

- **Se ve a:** columna lateral de 240 px de ancho (`Timeline`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 900 px
- **Qué debe verse:** Textil Padilla, Ampliación de producción.
- **Nota:** Opcional: la línea de hitos funciona sin fotos. Formato 4:3.

---

## Productos — `/productos`

**Faltan 3 de 5 huecos.**

### Recomendador — 3

#### `prenda-camiseta.jpg`

- **Se ve a:** media anchura del recomendador, ~600 px (`GarmentRecommender`) — Y ADEMÁS 64 px (72 desde tablet) cuadrada en el asesor virtual (`AsesorWizard`)
- **Proporción:** 4:3 apaisada, recortada a 1:1 en la miniatura
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Camiseta confeccionada en jersey de algodón peinado, mostrando la caída del punto.
- **Nota:** Apaisada (4:3) a media anchura del recomendador (~600 px), pero la MISMA foto se recorta a un cuadrado de 64 px (72 desde tablet) en las opciones del asesor virtual: la prenda tiene que quedar centrada y seguir reconociéndose dentro de ese cuadrado central. Prenda sola sobre fondo neutro, sin modelo y sin degradado de estudio. Camiseta lisa de frente, colgada o doblada de forma que se lea la caída del punto.

#### `prenda-chompa.jpg`

- **Se ve a:** media anchura del recomendador, ~600 px (`GarmentRecommender`) — Y ADEMÁS 64 px (72 desde tablet) cuadrada en el asesor virtual (`AsesorWizard`)
- **Proporción:** 4:3 apaisada, recortada a 1:1 en la miniatura
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Chompa en French Terry perchado, con el reverso afelpado a la vista.
- **Nota:** Apaisada (4:3) a media anchura del recomendador (~600 px), pero la MISMA foto se recorta a un cuadrado de 64 px (72 desde tablet) en las opciones del asesor virtual: la prenda tiene que quedar centrada y seguir reconociéndose dentro de ese cuadrado central. Prenda sola sobre fondo neutro, sin modelo y sin degradado de estudio. Chompa entera y centrada, de frente. El reverso afelpado a la vista es DESEABLE, no obligatorio: si compite con el encuadre, manda que la prenda se reconozca en el cuadrado de 64 px. Que el perchado asome en un puño o en el dobladillo, con la prenda dominando el cuadro; un detalle de perchado que ocupe el centro se pierde como chompa, y en una esquina se pierde al recortar.

#### `prenda-pantalon.jpg`

- **Se ve a:** media anchura del recomendador, ~600 px (`GarmentRecommender`) — Y ADEMÁS 64 px (72 desde tablet) cuadrada en el asesor virtual (`AsesorWizard`)
- **Proporción:** 4:3 apaisada, recortada a 1:1 en la miniatura
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Pantalón deportivo en sarga stretch, mostrando la caída y la recuperación del tejido.
- **Nota:** Apaisada (4:3) a media anchura del recomendador (~600 px), pero la MISMA foto se recorta a un cuadrado de 64 px (72 desde tablet) en las opciones del asesor virtual: la prenda tiene que quedar centrada y seguir reconociéndose dentro de ese cuadrado central. Prenda sola sobre fondo neutro, sin modelo y sin degradado de estudio. El pantalón entero, para que se vea la caída; el detalle de la sarga en el mismo cuadro si cabe sin perder la prenda.

---

## Microfibra — `/productos/microfibra`

**Faltan 21 de 39 huecos.**

### Ejemplo de aplicación — 1

#### `aplicacion-microfibra.jpg`

- **Se ve a:** columna del bloque de aplicación, hasta ~560 px (`productos/microfibra/page.tsx`)
- **Proporción:** 4:5 vertical
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Camiseta deportiva sobre pedestal, fondo oscuro — ejemplo de aplicación de la microfibra en confección.
- **Nota:** Demo: prenda deportiva sobre pedestal, fondo oscuro y neutro. Imagen generada para la maqueta, NO es producto de Textil Padilla. Se reemplazará por el objeto 3D. Vertical (4:5).

### Telas del catálogo — 7

#### `imperial.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Imperial de microfibra, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### `chelsea-plus.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Chelsea Plus de microfibra, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### `athletic-plus.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Athletic Plus de microfibra, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### `dortmund-plus.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Dortmund Plus de microfibra, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### `equatex-plus.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Equatex Plus de microfibra, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### `boston-plus.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Boston Plus de microfibra, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### `equator-plus.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Equator Plus de microfibra, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

### Galería · segunda vista — 13

#### `chelsea-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Chelsea de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `athletic-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Athletic de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `boston-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Boston de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `dortmund-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Dortmund de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `sevilla-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Sevilla de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `chelsea-plus-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Chelsea Plus de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `dortmund-plus-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Dortmund Plus de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `juventus-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Juventus de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `kansas-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Kansas de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `sevilla-plus-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Sevilla Plus de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `boston-plus-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Boston Plus de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `dobleface-plus-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Dobleface Plus de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `aston-plus-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Aston Plus de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

---

## Dortmund Plus — `/productos/microfibra/dortmund-plus`

**Faltan 2 de 3 huecos.**

### Cabecera — 1

#### `hero-dortmund-plus.jpg`

- **Se ve a:** a sangre, 100% del ancho × 70vh (`FondoHero`)
- **Proporción:** muy apaisada; se recorta a 70vh
- **Ancho mínimo de entrega:** 2400 px
- **Qué debe verse:** Rollo de Dortmund Plus en la nave de producción.
- **Nota:** Cabecera de /productos/microfibra/dortmund-plus, a sangre. Tono bajo, sin detalle en el tercio izquierdo (ahí va el titular). Muy apaisada: se recorta a 70vh.

### Contenido principal — 1

#### `dortmund-plus-blancos-macro.jpg`

- **Se ve a:** banda a todo el ancho del contenedor (`ProductGallery`)
- **Proporción:** 21:9, muy apaisada
- **Ancho mínimo de entrega:** 1920 px
- **Qué debe verse:** Macrofotografía de la microfibra Dortmund Plus en blanco, con la textura del punto a contraluz.
- **Nota:** Macro de textura, muy apaisada (21:9).

---

## Camisetas — `/productos/camisetas`

**Faltan 2 de 4 huecos.**

### Contenido principal — 2

#### `camisetas-jersey.jpg`

- **Se ve a:** media columna, hasta ~620 px de ancho (`productos/camisetas/page.tsx`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Macrofotografía de jersey de algodón peinado, con el punto liso visible de cerca.
- **Nota:** Macro real de single jersey. Acompaña a la ficha de la tela 01.

#### `camisetas-pique.jpg`

- **Se ve a:** media columna, hasta ~620 px de ancho (`productos/camisetas/page.tsx`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Macrofotografía de piqué, con las celdas en relieve tipo panal.
- **Nota:** Macro real de piqué. Acompaña a la ficha de la tela 02.

---

## Texturizado — `/productos/texturizado`

**Faltan 8 de 15 huecos.**

### Telas del catálogo — 1

#### `napoli-open.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Napoli Open de texturizado, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

### Galería · segunda vista — 7

#### `gaby-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Gaby de texturizado, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `kiana-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Kiana de texturizado, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `napoli-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Napoli de texturizado, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `napoles-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Napoles de texturizado, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `river-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela River de texturizado, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `mezi-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Mezi de texturizado, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `ribb-150-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Ribb 150 de texturizado, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

---

## Spun — `/productos/spun`

**Faltan 8 de 10 huecos.**

### Telas del catálogo — 6

#### `ribb-20.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Ribb 20 de spun, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### `interlock-plus-30.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Interlock Plus 30 de spun, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### `buff-romina-30.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Buff Romina 30 de spun, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### `buff-romina-rev-30.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Buff Romina Rev 30 de spun, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### `ribb-30.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Ribb 30 de spun, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### `ribb-40.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Ribb 40 de spun, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

### Galería · segunda vista — 2

#### `interlock-30-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Interlock 30 de spun, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `buff-romina-30-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Buff Romina 30 de spun, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

---

## Polialgodón — `/productos/polialgodon`

**Faltan 15 de 20 huecos.**

### Telas del catálogo — 9

#### `balboa-24.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Balboa 24 de polialgodón, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### `melisa-24.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Melisa 24 de polialgodón, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### `austria-premium-18.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Austria Premium 18 de polialgodón, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### `australia-18.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Australia 18 de polialgodón, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### `amelia-24.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Amelia 24 de polialgodón, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### `ribb-18.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Ribb 18 de polialgodón, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### `ribb-20-24.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Ribb 20/24 de polialgodón, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### `cuellos-20-24.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Cuellos 20/24 de polialgodón, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### `punos-20-24.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Puños 20/24 de polialgodón, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

### Galería · segunda vista — 6

#### `denis-20-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Denis 20 de polialgodón, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `austria-premium-18-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Austria Premium 18 de polialgodón, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `lacoast-20-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Lacoast 20 de polialgodón, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `lacoast-polo-20-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Lacoast Polo 20 de polialgodón, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `lacoast-kratos-22-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Lacoast Kratos 22 de polialgodón, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### `pique-ares-24-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Pique Ares 24 de polialgodón, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

---

## Asesor Virtual — `/asesor-virtual`

**Faltan 6 de 7 huecos.**

### Opciones del cuestionario — 6

#### `asesor-prenda-otro.jpg`

- **Se ve a:** 64 px (72 px desde tablet), cuadrada (`AsesorWizard`)
- **Proporción:** 1:1
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Retales y muestras de distintas telas sobre la mesa del asesor.
- **Nota:** Cuadrada (1:1). Opción «Otro»: bodegón de muestras variadas, sin una prenda concreta.

#### `asesor-sublimado-si.jpg`

- **Se ve a:** 64 px (72 px desde tablet), cuadrada (`AsesorWizard`)
- **Proporción:** 1:1
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Prenda deportiva con estampado sublimado a todo color.
- **Nota:** Cuadrada (1:1). Base clara con full-print sublimado.

#### `asesor-sublimado-no.jpg`

- **Se ve a:** 64 px (72 px desde tablet), cuadrada (`AsesorWizard`)
- **Proporción:** 1:1
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Tela en color liso teñido a demanda, sin estampado.
- **Nota:** Cuadrada (1:1). Tono sólido, sin estampado.

#### `asesor-uso-rendimiento.jpg`

- **Se ve a:** 64 px (72 px desde tablet), cuadrada (`AsesorWizard`)
- **Proporción:** 1:1
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Prenda deportiva de alto rendimiento en uso durante el gesto atlético.
- **Nota:** Cuadrada (1:1). Deporte de rendimiento, tela técnica.

#### `asesor-uso-casual.jpg`

- **Se ve a:** 64 px (72 px desde tablet), cuadrada (`AsesorWizard`)
- **Proporción:** 1:1
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Prenda casual de uso diario, de caída suave.
- **Nota:** Cuadrada (1:1). Básico de retail, mano suave.

#### `asesor-uso-uniforme.jpg`

- **Se ve a:** 64 px (72 px desde tablet), cuadrada (`AsesorWizard`)
- **Proporción:** 1:1
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Uniforme corporativo confeccionado en tela de color estable.
- **Nota:** Cuadrada (1:1). Uniforme corporativo, color estable al lavado.

---

## Contacto — `/contacto`

**Faltan 1 de 3 huecos.**

### Contenido principal — 1

#### `retrato-asesor.jpg`

- **Se ve a:** columna derecha del formulario de contacto; en móvil ocupa el ancho (`contacto/page.tsx`)
- **Proporción:** 4:3 en móvil; en escritorio se estira a la altura del formulario
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Asesor comercial de Textil Padilla atendiendo en el mostrador, con muestrario de telas.
- **Nota:** Retrato de una persona real del equipo. Requiere su autorización para salir en la web.

---

## Avisos

Son los mismos de `requisitos-fotografia.md`, y valen igual aquí:

**El recoloreo se decide al disparar, no al procesar.** Las telas del catálogo
alimentan la simulación de color de su ficha, y eso impone condiciones a la TOMA
—tela sin teñir, luz neutra, sin quemados— que no tienen arreglo posterior.

**Material que no puede ir en cualquier hueco.** Ver `README-imagenes.md` §5:
el material generado por IA no puede ocupar un hueco que afirme algo nuestro
(«nuestra planta», «nuestro asesor»), y `retrato-asesor` es una persona real y
necesita su autorización, que no es lo mismo que una licencia.
