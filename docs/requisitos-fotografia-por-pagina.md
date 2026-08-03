# Requisitos de fotografía por página — Textil Padilla

Qué le falta a CADA PÁGINA para poder publicarse completa: sus secciones, y
dentro de cada una todos sus huecos de imagen con su estado.

**GENERADO — no editar a mano.** Sale del registro de slots y del manifiesto
de imágenes. Se regenera con `npm run imagenes:requisitos`, que escribe este
documento y su pareja a la vez.

Es la **segunda vista de `requisitos-fotografia.md`**, no otro encargo: los
mismos huecos, ordenados por dónde van en vez de por qué sesión los dispara.
Para salir a fotografiar sirve la otra —cada bloque suyo es una sesión—; esta
sirve para revisar el sitio página a página y para priorizar por página.

## Los tres estados

Aquí están **todos** los huecos del sitio, tengan foto o no. Que un hueco
tenga imagen no quiere decir que esté resuelto:

| Estado | Qué significa | ¿Se pide? |
|---|---|---|
| **FALTA** | No hay archivo. El sitio dibuja el marcador de hueco. | Sí |
| **PROVISIONAL** | Hay foto, pero es de relleno, de maqueta, generada o de banco. Hay que reemplazarla. | Sí |
| **DEFINITIVA** | Material real, en su sitio. | No |

Las provisionales llevan debajo **por qué** lo son y **según qué** se ha
determinado —el commit, el md5 o la receta—, para que se pueda comprobar en
vez de creérselo.

**PENDIENTE DE CLASIFICAR** es una provisional de la que no consta de dónde
salió. No se ha adivinado a propósito: una clasificación inventada se lee
igual que una comprobada y ya nadie vuelve a revisarla. Hay que mirarla y
decidir.

## Resumen

Los **133 huecos** de imagen del sitio, repartidos en **11 páginas**:

- **Faltan 88** — no hay archivo.
- **Provisionales 8** — hay foto, pero hay que reemplazarla. De estas, **3 están pendientes de clasificar**.
- **Definitivas 37** — no se piden.

**Hay que conseguir 96 fotos**, no 88.

| Página | Faltan | Provisionales | Definitivas | Total |
|---|---|---|---|---|
| [Inicio](#inicio--) (`/`) | 11 | 1 | 1 | 13 |
| [Empresa](#empresa--empresa) (`/empresa`) | 11 | 1 | 2 | 14 |
| [Productos](#productos--productos) (`/productos`) | 3 | 1 | 1 | 5 |
| [Microfibra](#microfibra--productosmicrofibra) (`/productos/microfibra`) | 21 | 1 | 17 | 39 |
| [Dortmund Plus](#dortmund-plus--productosmicrofibradortmund-plus) (`/productos/microfibra/dortmund-plus`) | 2 | 1 | 0 | 3 |
| [Camisetas](#camisetas--productoscamisetas) (`/productos/camisetas`) | 2 | 1 | 1 | 4 |
| [Texturizado](#texturizado--productostexturizado) (`/productos/texturizado`) | 8 | 0 | 7 | 15 |
| [Spun](#spun--productosspun) (`/productos/spun`) | 8 | 0 | 2 | 10 |
| [Polialgodón](#polialgodón--productospolialgodon) (`/productos/polialgodon`) | 15 | 0 | 5 | 20 |
| [Asesor Virtual](#asesor-virtual--asesor-virtual) (`/asesor-virtual`) | 6 | 1 | 0 | 7 |
| [Contacto](#contacto--contacto) (`/contacto`) | 1 | 1 | 1 | 3 |

---

## Inicio — `/`

**11 faltan · 1 provisional · 1 definitiva** — 13 huecos en total. Quedan 12 fotos por conseguir.

### Cabecera — 1 (1 por conseguir)

#### **PROVISIONAL · PENDIENTE DE CLASIFICAR** `hero-home-poster.jpg`

- **Se ve a:** a sangre, 100% del ancho × 70vh (`FondoHero`)
- **Proporción:** muy apaisada; se recorta a 70vh
- **Ancho mínimo de entrega:** 1920 px
- **Qué debe verse:** —
- **Nota:** Cabecera de / (la portada). Mientras no haya vídeo procesado se ve ella sola, a sangre. Cuando corras `npm run video` pasa a ser el póster del bucle —lo que se ve mientras carga, si el navegador no reproduce, y con prefers-reduced-motion— y conviene que se parezca al primer fotograma o el salto se nota. Mismos requisitos que los demás heroes: tono bajo, sin detalle en el tercio izquierdo.

> **⚠ PENDIENTE DE CLASIFICAR.** NO CONSTA de dónde salió: hay que mirarla antes de decidir. Según: Entró en 8e485c6, al arreglar el póster de la portada. El commit explica por qué no se veía, no de dónde sale el archivo.

### Contenido principal — 1 (resuelta)

#### **DEFINITIVA** `macro-fibra-blanca.jpg`

No se pide: ya está resuelta.

### Familias de tela — 4 (4 por conseguir)

#### **FALTA** `familia-microfibra.jpg`

- **Se ve a:** ~310 × 300 px en la rejilla de cuatro columnas (`CategoryCard`)
- **Proporción:** casi cuadrada; se recorta a la card con `object-cover`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Rollos de microfibra alineados en bodega, con el brillo característico del poliéster ligero.
- **Nota:** Card de la rejilla de cuatro columnas, ~310 × 300 px. Lleva encima un velo que baja hasta rgba(9,20,25,0.78) en el borde inferior, y sobre esa franja van el título y la descripción: la foto tiene que aguantar oscurecerse abajo y no llevar detalle importante ahí. (En las cabeceras hay que despejar el tercio izquierdo; aquí es la parte de abajo.) El mismo archivo se usa en la rejilla de /productos y en el styleguide: es un solo hueco, no tres.

#### **FALTA** `familia-texturizado.jpg`

- **Se ve a:** ~310 × 300 px en la rejilla de cuatro columnas (`CategoryCard`)
- **Proporción:** casi cuadrada; se recorta a la card con `object-cover`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tejido texturizado en plano abierto, con el cuerpo y el relieve del hilo a la vista.
- **Nota:** Card de la rejilla de cuatro columnas, ~310 × 300 px. Lleva encima un velo que baja hasta rgba(9,20,25,0.78) en el borde inferior, y sobre esa franja van el título y la descripción: la foto tiene que aguantar oscurecerse abajo y no llevar detalle importante ahí. (En las cabeceras hay que despejar el tercio izquierdo; aquí es la parte de abajo.) El mismo archivo se usa en la rejilla de /productos y en el styleguide: es un solo hueco, no tres.

#### **FALTA** `familia-spun.jpg`

- **Se ve a:** ~310 × 300 px en la rejilla de cuatro columnas (`CategoryCard`)
- **Proporción:** casi cuadrada; se recorta a la card con `object-cover`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela de hilado spun en plano abierto, de superficie mate y aspecto algodonoso.
- **Nota:** Card de la rejilla de cuatro columnas, ~310 × 300 px. Lleva encima un velo que baja hasta rgba(9,20,25,0.78) en el borde inferior, y sobre esa franja van el título y la descripción: la foto tiene que aguantar oscurecerse abajo y no llevar detalle importante ahí. (En las cabeceras hay que despejar el tercio izquierdo; aquí es la parte de abajo.) El mismo archivo se usa en la rejilla de /productos y en el styleguide: es un solo hueco, no tres.

#### **FALTA** `familia-polialgodon.jpg`

- **Se ve a:** ~310 × 300 px en la rejilla de cuatro columnas (`CategoryCard`)
- **Proporción:** casi cuadrada; se recorta a la card con `object-cover`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela de mezcla poliéster-algodón en plano abierto, con la trama del tejido visible.
- **Nota:** Card de la rejilla de cuatro columnas, ~310 × 300 px. Lleva encima un velo que baja hasta rgba(9,20,25,0.78) en el borde inferior, y sobre esa franja van el título y la descripción: la foto tiene que aguantar oscurecerse abajo y no llevar detalle importante ahí. (En las cabeceras hay que despejar el tercio izquierdo; aquí es la parte de abajo.) El mismo archivo se usa en la rejilla de /productos y en el styleguide: es un solo hueco, no tres.

### Encuentros — 4 (4 por conseguir)

#### **FALTA** `evento-feria-andina.jpg`

- **Se ve a:** media anchura del carrusel, ~600 px (`EventCarousel`)
- **Proporción:** 4:3 apaisada — el marco es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Stand de Textil Padilla en la Feria Internacional del Textil Andino, con muestrario de telas.
- **Nota:** Apaisada (4:3), a media anchura del carrusel de encuentros (~600 px). Documental: material y gente reales, sin posado de estudio ni rótulos quemados. La portada lo presenta como un hecho de la empresa, así que no admite imagen generada ni de banco (ver README-imagenes.md §5). El stand en el recinto, con gente delante: se tiene que leer que es una feria y no una bodega. Luz de recinto, sin flash directo.

#### **FALTA** `evento-jornada-color.jpg`

- **Se ve a:** media anchura del carrusel, ~600 px (`EventCarousel`)
- **Proporción:** 4:3 apaisada — el marco es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Jornada de color a demanda: cliente comparando su referencia contra una carta de color.
- **Nota:** Apaisada (4:3), a media anchura del carrusel de encuentros (~600 px). Documental: material y gente reales, sin posado de estudio ni rótulos quemados. La portada lo presenta como un hecho de la empresa, así que no admite imagen generada ni de banco (ver README-imagenes.md §5). Plano medio de las manos, la carta de color y la muestra del cliente sobre la mesa. La carta tiene que salir legible y en luz neutra: es lo que sostiene el argumento del teñido a demanda, y una carta con dominante no se puede enseñar.

#### **FALTA** `evento-alianza-retail.jpg`

- **Se ve a:** media anchura del carrusel, ~600 px (`EventCarousel`)
- **Proporción:** 4:3 apaisada — el marco es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Rollos de tela preparados para un cliente de retail premium.
- **Nota:** Apaisada (4:3), a media anchura del carrusel de encuentros (~600 px). Documental: material y gente reales, sin posado de estudio ni rótulos quemados. La portada lo presenta como un hecho de la empresa, así que no admite imagen generada ni de banco (ver README-imagenes.md §5). Rollos etiquetados y preparados para despacho, en bodega. Sin marcas ni logotipos de terceros identificables: al cliente no se le nombra.

> **⚠ POR CONFIRMAR ANTES DE DISPARAR.** El id anuncia una ALIANZA y la nota describe un DESPACHO, que no es lo mismo. Antes de disparar hay que confirmar qué ocurrió de verdad en este encuentro: si la foto no comunica el acuerdo, el titular de la tarjeta dirá una cosa y la imagen otra. La nota está escrita con lo que hay hoy, que es el alt; si el evento resulta ser otra cosa, se reescribe aquí antes de la sesión.

#### **FALTA** `evento-performknit-320.jpg`

- **Se ve a:** media anchura del carrusel, ~600 px (`EventCarousel`)
- **Proporción:** 4:3 apaisada — el marco es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Presentación de la línea PerformKnit 320: detalle del tejido sobre la mesa de muestras.
- **Nota:** Apaisada (4:3), a media anchura del carrusel de encuentros (~600 px). Documental: material y gente reales, sin posado de estudio ni rótulos quemados. La portada lo presenta como un hecho de la empresa, así que no admite imagen generada ni de banco (ver README-imagenes.md §5). El tejido de la línea sobre la mesa de muestras, cenital o en tres cuartos. Prima que se lea el tejido, no la sala.

### Asesor virtual — 3 (3 por conseguir)

#### **FALTA** `asesor-portada-prenda.jpg`

- **Se ve a:** media pantalla del split, mínimo 380 px de alto, solo desde tablet (`AsesorPasos`)
- **Proporción:** flexible — la caja recorta con `object-cover`
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Prendas deportivas en confección: camisetas y buzos que definen el punto de partida de la asesoría.
- **Nota:** Paso 01 (Prenda). Qué se va a producir: prenda deportiva terminada o en confección. Sin rótulos quemados. Formato flexible; se recorta a la caja del split.

#### **FALTA** `asesor-portada-sublimado.jpg`

- **Se ve a:** media pantalla del split, mínimo 380 px de alto, solo desde tablet (`AsesorPasos`)
- **Proporción:** flexible — la caja recorta con `object-cover`
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Tela clara con estampado sublimado full-print, mostrando el color a sangre sobre la base.
- **Nota:** Paso 02 (Sublimado). Base clara con estampado full-print, o el contraste liso/sublimado. Formato flexible; se recorta a la caja del split.

#### **FALTA** `asesor-portada-uso.jpg`

- **Se ve a:** media pantalla del split, mínimo 380 px de alto, solo desde tablet (`AsesorPasos`)
- **Proporción:** flexible — la caja recorta con `object-cover`
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Tela en uso deportivo, mostrando el rendimiento y la caída del género en movimiento.
- **Nota:** Paso 03 (Uso). El destino de la tela: alto rendimiento, casual o uniforme. Formato flexible; se recorta a la caja del split.

---

## Empresa — `/empresa`

**11 faltan · 1 provisional · 2 definitivas** — 14 huecos en total. Quedan 12 fotos por conseguir.

### Cabecera — 1 (1 por conseguir)

#### **PROVISIONAL** `hero-empresa.jpg`

- **Se ve a:** a sangre, 100% del ancho × 70vh (`FondoHero`)
- **Proporción:** muy apaisada; se recorta a 70vh
- **Ancho mínimo de entrega:** 2400 px
- **Qué debe verse:** Planta de Textil Padilla en Alangasí: vista general de la nave de producción.
- **Nota:** Cabecera de /empresa, a sangre. Tono bajo, sin detalle en el tercio izquierdo (ahí va el titular). Muy apaisada: se recorta a 70vh.

> **⚠ HAY FOTO, PERO ES PROVISIONAL.** Puesta solo para maquetar o valorar el tratamiento. Según: Lo dice el commit que la subió (b1e2e42): «entra como muestra para poder valorarlo; es la misma foto que ya sale más abajo en esa página, así que no es definitiva».

### Oficio — 4 (2 por conseguir)

#### **DEFINITIVA** `oficio-nave-tejido.jpg`

No se pide: ya está resuelta.

#### **DEFINITIVA** `oficio-taller-alangasi.jpg`

No se pide: ya está resuelta.

#### **FALTA** `oficio-tintoreria.jpg`

- **Se ve a:** media columna del bloque de Oficio, hasta ~620 px de ancho (`empresa/page.tsx`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Tintorería de Textil Padilla: barcas de teñido en proceso.
- **Nota:** Área de tintorería en marcha. Apaisada (4:3). Es la que sostiene el argumento del teñido a demanda.

#### **FALTA** `oficio-carta-color.jpg`

- **Se ve a:** media columna del bloque de Oficio, hasta ~620 px de ancho (`empresa/page.tsx`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Carta de color de Textil Padilla: muestras de tela teñidas ordenadas por tono.
- **Nota:** Muestrario físico de colores. Apaisada (4:3).

### Línea de hitos — 9 (9 por conseguir)

#### **FALTA** `hito-fnd-01.jpg`

- **Se ve a:** columna lateral de 240 px de ancho (`Timeline`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 900 px
- **Qué debe verse:** Textil Padilla, 1987 · Fundación en Alangasí.
- **Nota:** Opcional: la línea de hitos funciona sin fotos. Formato 4:3.

#### **FALTA** `hito-loc-01.jpg`

- **Se ve a:** columna lateral de 240 px de ancho (`Timeline`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 900 px
- **Qué debe verse:** Textil Padilla, 1994 · Consolidación de la matriz.
- **Nota:** Opcional: la línea de hitos funciona sin fotos. Formato 4:3.

#### **FALTA** `hito-prd-01.jpg`

- **Se ve a:** columna lateral de 240 px de ancho (`Timeline`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 900 px
- **Qué debe verse:** Textil Padilla, 1999 · Teñido a demanda.
- **Nota:** Opcional: la línea de hitos funciona sin fotos. Formato 4:3.

#### **FALTA** `hito-loc-02.jpg`

- **Se ve a:** columna lateral de 240 px de ancho (`Timeline`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 900 px
- **Qué debe verse:** Textil Padilla, 2003 · Local de La Marín.
- **Nota:** Opcional: la línea de hitos funciona sin fotos. Formato 4:3.

#### **FALTA** `hito-loc-03.jpg`

- **Se ve a:** columna lateral de 240 px de ancho (`Timeline`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 900 px
- **Qué debe verse:** Textil Padilla, 2008 · Local de Solanda.
- **Nota:** Opcional: la línea de hitos funciona sin fotos. Formato 4:3.

#### **FALTA** `hito-loc-04.jpg`

- **Se ve a:** columna lateral de 240 px de ancho (`Timeline`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 900 px
- **Qué debe verse:** Textil Padilla, Apertura de local.
- **Nota:** Opcional: la línea de hitos funciona sin fotos. Formato 4:3.

#### **FALTA** `hito-loc-05.jpg`

- **Se ve a:** columna lateral de 240 px de ancho (`Timeline`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 900 px
- **Qué debe verse:** Textil Padilla, Apertura de local.
- **Nota:** Opcional: la línea de hitos funciona sin fotos. Formato 4:3.

#### **FALTA** `hito-qlt-01.jpg`

- **Se ve a:** columna lateral de 240 px de ancho (`Timeline`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 900 px
- **Qué debe verse:** Textil Padilla, Control de calidad.
- **Nota:** Opcional: la línea de hitos funciona sin fotos. Formato 4:3.

#### **FALTA** `hito-prd-02.jpg`

- **Se ve a:** columna lateral de 240 px de ancho (`Timeline`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 900 px
- **Qué debe verse:** Textil Padilla, Ampliación de producción.
- **Nota:** Opcional: la línea de hitos funciona sin fotos. Formato 4:3.

---

## Productos — `/productos`

**3 faltan · 1 provisional · 1 definitiva** — 5 huecos en total. Quedan 4 fotos por conseguir.

### Cabecera — 1 (1 por conseguir)

#### **PROVISIONAL** `hero-productos.jpg`

- **Se ve a:** a sangre, 100% del ancho × 70vh (`FondoHero`)
- **Proporción:** muy apaisada; se recorta a 70vh
- **Ancho mínimo de entrega:** 2400 px
- **Qué debe verse:** Rollos de tela de distintos colores alineados en la bodega de producto terminado.
- **Nota:** Cabecera de /productos, a sangre. Tono bajo, sin detalle en el tercio izquierdo (ahí va el titular). Muy apaisada: se recorta a 70vh.

> **⚠ HAY FOTO, PERO ES PROVISIONAL.** Puesta solo para maquetar o valorar el tratamiento. Según: Los cuatro archivos son BYTE A BYTE el mismo (md5 56e355a4…), y el `alt` de cada slot describe una escena distinta: una sola imagen no puede ser a la vez el mostrador, los rollos, las camisetas y el asesor. Está puesta para poder maquetar la banda de cabecera.

### Contenido principal — 1 (resuelta)

#### **DEFINITIVA** `macro-tejido.jpg`

No se pide: ya está resuelta.

### Recomendador — 3 (3 por conseguir)

#### **FALTA** `prenda-camiseta.jpg`

- **Se ve a:** media anchura del recomendador, ~600 px (`GarmentRecommender`) — Y ADEMÁS 64 px (72 desde tablet) cuadrada en el asesor virtual (`AsesorWizard`)
- **Proporción:** 4:3 apaisada, recortada a 1:1 en la miniatura
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Camiseta confeccionada en jersey de algodón peinado, mostrando la caída del punto.
- **Nota:** Apaisada (4:3) a media anchura del recomendador (~600 px), pero la MISMA foto se recorta a un cuadrado de 64 px (72 desde tablet) en las opciones del asesor virtual: la prenda tiene que quedar centrada y seguir reconociéndose dentro de ese cuadrado central. Prenda sola sobre fondo neutro, sin modelo y sin degradado de estudio. Camiseta lisa de frente, colgada o doblada de forma que se lea la caída del punto.

#### **FALTA** `prenda-chompa.jpg`

- **Se ve a:** media anchura del recomendador, ~600 px (`GarmentRecommender`) — Y ADEMÁS 64 px (72 desde tablet) cuadrada en el asesor virtual (`AsesorWizard`)
- **Proporción:** 4:3 apaisada, recortada a 1:1 en la miniatura
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Chompa en French Terry perchado, con el reverso afelpado a la vista.
- **Nota:** Apaisada (4:3) a media anchura del recomendador (~600 px), pero la MISMA foto se recorta a un cuadrado de 64 px (72 desde tablet) en las opciones del asesor virtual: la prenda tiene que quedar centrada y seguir reconociéndose dentro de ese cuadrado central. Prenda sola sobre fondo neutro, sin modelo y sin degradado de estudio. Chompa entera y centrada, de frente. El reverso afelpado a la vista es DESEABLE, no obligatorio: si compite con el encuadre, manda que la prenda se reconozca en el cuadrado de 64 px. Que el perchado asome en un puño o en el dobladillo, con la prenda dominando el cuadro; un detalle de perchado que ocupe el centro se pierde como chompa, y en una esquina se pierde al recortar.

#### **FALTA** `prenda-pantalon.jpg`

- **Se ve a:** media anchura del recomendador, ~600 px (`GarmentRecommender`) — Y ADEMÁS 64 px (72 desde tablet) cuadrada en el asesor virtual (`AsesorWizard`)
- **Proporción:** 4:3 apaisada, recortada a 1:1 en la miniatura
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Pantalón deportivo en sarga stretch, mostrando la caída y la recuperación del tejido.
- **Nota:** Apaisada (4:3) a media anchura del recomendador (~600 px), pero la MISMA foto se recorta a un cuadrado de 64 px (72 desde tablet) en las opciones del asesor virtual: la prenda tiene que quedar centrada y seguir reconociéndose dentro de ese cuadrado central. Prenda sola sobre fondo neutro, sin modelo y sin degradado de estudio. El pantalón entero, para que se vea la caída; el detalle de la sarga en el mismo cuadro si cabe sin perder la prenda.

---

## Microfibra — `/productos/microfibra`

**21 faltan · 1 provisional · 17 definitivas** — 39 huecos en total. Quedan 22 fotos por conseguir.

### Cabecera — 1 (1 por conseguir)

#### **PROVISIONAL · PENDIENTE DE CLASIFICAR** `hero-microfibra.jpg`

- **Se ve a:** a sangre, 100% del ancho × 70vh (`FondoHero`)
- **Proporción:** muy apaisada; se recorta a 70vh
- **Ancho mínimo de entrega:** 2400 px
- **Qué debe verse:** Tejido de microfibra saliendo de la máquina de tejido circular.
- **Nota:** Cabecera de /productos/microfibra, a sangre. Tono bajo, sin detalle en el tercio izquierdo (ahí va el titular). Muy apaisada: se recorta a 70vh.

> **⚠ PENDIENTE DE CLASIFICAR.** NO CONSTA de dónde salió: hay que mirarla antes de decidir. Según: Archivo propio, no duplicado de los otros heroes. Entró en 55ffae7 —el commit del mapa de Contacto— mencionada de pasada y sin decir de dónde sale. No consta el origen.

### Ejemplo de aplicación — 1 (1 por conseguir)

#### **FALTA** `aplicacion-microfibra.jpg`

- **Se ve a:** columna del bloque de aplicación, hasta ~560 px (`productos/microfibra/page.tsx`)
- **Proporción:** 4:5 vertical
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Camiseta deportiva sobre pedestal, fondo oscuro — ejemplo de aplicación de la microfibra en confección.
- **Nota:** Demo: prenda deportiva sobre pedestal, fondo oscuro y neutro. Imagen generada para la maqueta, NO es producto de Textil Padilla. Se reemplazará por el objeto 3D. Vertical (4:5).

### Telas del catálogo — 20 (7 por conseguir)

#### **DEFINITIVA** `chelsea.jpg`

No se pide: ya está resuelta.

#### **DEFINITIVA** `athletic.jpg`

No se pide: ya está resuelta.

#### **DEFINITIVA** `boston.jpg`

No se pide: ya está resuelta.

#### **DEFINITIVA** `dortmund.jpg`

No se pide: ya está resuelta.

#### **FALTA** `imperial.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Imperial de microfibra, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **DEFINITIVA** `sevilla.jpg`

No se pide: ya está resuelta.

#### **DEFINITIVA** `titanium.jpg`

No se pide: ya está resuelta.

#### **FALTA** `chelsea-plus.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Chelsea Plus de microfibra, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **FALTA** `athletic-plus.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Athletic Plus de microfibra, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **FALTA** `dortmund-plus.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Dortmund Plus de microfibra, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **FALTA** `equatex-plus.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Equatex Plus de microfibra, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **DEFINITIVA** `juventus.jpg`

No se pide: ya está resuelta.

#### **DEFINITIVA** `kansas.jpg`

No se pide: ya está resuelta.

#### **DEFINITIVA** `sevilla-plus.jpg`

No se pide: ya está resuelta.

#### **FALTA** `boston-plus.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Boston Plus de microfibra, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **DEFINITIVA** `dobleface-plus.jpg`

No se pide: ya está resuelta.

#### **FALTA** `equator-plus.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Equator Plus de microfibra, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **DEFINITIVA** `sevilla-plus-brillante.jpg`

No se pide: ya está resuelta.

#### **DEFINITIVA** `dortmund-plus-brillante.jpg`

No se pide: ya está resuelta.

#### **DEFINITIVA** `aston-plus.jpg`

No se pide: ya está resuelta.

### Galería · segunda vista — 14 (13 por conseguir)

#### **FALTA** `chelsea-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Chelsea de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `athletic-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Athletic de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `boston-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Boston de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `dortmund-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Dortmund de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `sevilla-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Sevilla de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **DEFINITIVA** `titanium-caida.jpg`

No se pide: ya está resuelta.

#### **FALTA** `chelsea-plus-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Chelsea Plus de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `dortmund-plus-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Dortmund Plus de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `juventus-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Juventus de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `kansas-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Kansas de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `sevilla-plus-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Sevilla Plus de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `boston-plus-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Boston Plus de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `dobleface-plus-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Dobleface Plus de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `aston-plus-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Aston Plus de microfibra, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

### Galería · vistas extra — 1 (resuelta)

#### **DEFINITIVA** `titanium-trama.jpg`

No se pide: ya está resuelta.

### Galería · principal en alta — 1 (resuelta)

#### **DEFINITIVA** `athletic-macro.jpg`

No se pide: ya está resuelta.

### Galería · capa de lupa — 1 (resuelta)

#### **DEFINITIVA** `athletic-zoom.jpg`

No se pide: ya está resuelta.

---

## Dortmund Plus — `/productos/microfibra/dortmund-plus`

**2 faltan · 1 provisional · 0 definitivas** — 3 huecos en total. Quedan 3 fotos por conseguir.

### Cabecera — 1 (1 por conseguir)

#### **FALTA** `hero-dortmund-plus.jpg`

- **Se ve a:** a sangre, 100% del ancho × 70vh (`FondoHero`)
- **Proporción:** muy apaisada; se recorta a 70vh
- **Ancho mínimo de entrega:** 2400 px
- **Qué debe verse:** Rollo de Dortmund Plus en la nave de producción.
- **Nota:** Cabecera de /productos/microfibra/dortmund-plus, a sangre. Tono bajo, sin detalle en el tercio izquierdo (ahí va el titular). Muy apaisada: se recorta a 70vh.

### Contenido principal — 2 (2 por conseguir)

#### **PROVISIONAL · PENDIENTE DE CLASIFICAR** `dortmund-plus-cancha.jpg`

- **Se ve a:** — sin declarar —
- **Proporción:** — sin declarar —
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Prenda deportiva confeccionada en Dortmund Plus, en uso durante un partido.
- **Nota:** Prenda hecha con la tela, en uso. Sin rótulos ni tipografía quemada.

> **⚠ PENDIENTE DE CLASIFICAR.** NO CONSTA de dónde salió: hay que mirarla antes de decidir. Según: Entró en d55790f, un commit sobre el marcado de las cabeceras vacías que no menciona su origen.

#### **FALTA** `dortmund-plus-blancos-macro.jpg`

- **Se ve a:** banda a todo el ancho del contenedor (`ProductGallery`)
- **Proporción:** 21:9, muy apaisada
- **Ancho mínimo de entrega:** 1920 px
- **Qué debe verse:** Macrofotografía de la microfibra Dortmund Plus en blanco, con la textura del punto a contraluz.
- **Nota:** Macro de textura, muy apaisada (21:9).

---

## Camisetas — `/productos/camisetas`

**2 faltan · 1 provisional · 1 definitiva** — 4 huecos en total. Quedan 3 fotos por conseguir.

### Cabecera — 1 (1 por conseguir)

#### **PROVISIONAL** `hero-camisetas.jpg`

- **Se ve a:** a sangre, 100% del ancho × 70vh (`FondoHero`)
- **Proporción:** muy apaisada; se recorta a 70vh
- **Ancho mínimo de entrega:** 2400 px
- **Qué debe verse:** Camisetas deportivas terminadas, confeccionadas con telas de Textil Padilla.
- **Nota:** Cabecera de /productos/camisetas, a sangre. Tono bajo, sin detalle en el tercio izquierdo (ahí va el titular). Muy apaisada: se recorta a 70vh.

> **⚠ HAY FOTO, PERO ES PROVISIONAL.** Puesta solo para maquetar o valorar el tratamiento. Según: Los cuatro archivos son BYTE A BYTE el mismo (md5 56e355a4…), y el `alt` de cada slot describe una escena distinta: una sola imagen no puede ser a la vez el mostrador, los rollos, las camisetas y el asesor. Está puesta para poder maquetar la banda de cabecera.

### Contenido principal — 3 (2 por conseguir)

#### **DEFINITIVA** `macro-punto-camiseta.jpg`

No se pide: ya está resuelta.

#### **FALTA** `camisetas-jersey.jpg`

- **Se ve a:** media columna, hasta ~620 px de ancho (`productos/camisetas/page.tsx`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Macrofotografía de jersey de algodón peinado, con el punto liso visible de cerca.
- **Nota:** Macro real de single jersey. Acompaña a la ficha de la tela 01.

#### **FALTA** `camisetas-pique.jpg`

- **Se ve a:** media columna, hasta ~620 px de ancho (`productos/camisetas/page.tsx`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Macrofotografía de piqué, con las celdas en relieve tipo panal.
- **Nota:** Macro real de piqué. Acompaña a la ficha de la tela 02.

---

## Texturizado — `/productos/texturizado`

**8 faltan · 0 provisionales · 7 definitivas** — 15 huecos en total. Quedan 8 fotos por conseguir.

### Telas del catálogo — 8 (1 por conseguir)

#### **DEFINITIVA** `gaby.jpg`

No se pide: ya está resuelta.

#### **DEFINITIVA** `kiana.jpg`

No se pide: ya está resuelta.

#### **DEFINITIVA** `napoli.jpg`

No se pide: ya está resuelta.

#### **FALTA** `napoli-open.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Napoli Open de texturizado, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **DEFINITIVA** `napoles.jpg`

No se pide: ya está resuelta.

#### **DEFINITIVA** `river.jpg`

No se pide: ya está resuelta.

#### **DEFINITIVA** `mezi.jpg`

No se pide: ya está resuelta.

#### **DEFINITIVA** `ribb-150.jpg`

No se pide: ya está resuelta.

### Galería · segunda vista — 7 (7 por conseguir)

#### **FALTA** `gaby-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Gaby de texturizado, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `kiana-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Kiana de texturizado, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `napoli-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Napoli de texturizado, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `napoles-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Napoles de texturizado, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `river-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela River de texturizado, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `mezi-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Mezi de texturizado, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `ribb-150-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Ribb 150 de texturizado, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

---

## Spun — `/productos/spun`

**8 faltan · 0 provisionales · 2 definitivas** — 10 huecos en total. Quedan 8 fotos por conseguir.

### Telas del catálogo — 8 (6 por conseguir)

#### **FALTA** `ribb-20.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Ribb 20 de spun, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **DEFINITIVA** `interlock-30.jpg`

No se pide: ya está resuelta.

#### **FALTA** `interlock-plus-30.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Interlock Plus 30 de spun, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **FALTA** `buff-romina-30.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Buff Romina 30 de spun, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **FALTA** `buff-romina-rev-30.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Buff Romina Rev 30 de spun, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **FALTA** `ribb-30.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Ribb 30 de spun, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **DEFINITIVA** `interlock-40.jpg`

No se pide: ya está resuelta.

#### **FALTA** `ribb-40.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Ribb 40 de spun, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

### Galería · segunda vista — 2 (2 por conseguir)

#### **FALTA** `interlock-30-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Interlock 30 de spun, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `buff-romina-30-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Buff Romina 30 de spun, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

---

## Polialgodón — `/productos/polialgodon`

**15 faltan · 0 provisionales · 5 definitivas** — 20 huecos en total. Quedan 15 fotos por conseguir.

### Telas del catálogo — 14 (9 por conseguir)

#### **DEFINITIVA** `denis-20.jpg`

No se pide: ya está resuelta.

#### **FALTA** `balboa-24.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Balboa 24 de polialgodón, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **FALTA** `melisa-24.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Melisa 24 de polialgodón, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **FALTA** `austria-premium-18.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Austria Premium 18 de polialgodón, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **FALTA** `australia-18.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Australia 18 de polialgodón, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **FALTA** `amelia-24.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Amelia 24 de polialgodón, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **FALTA** `ribb-18.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Ribb 18 de polialgodón, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **FALTA** `ribb-20-24.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Ribb 20/24 de polialgodón, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **DEFINITIVA** `lacoast-20.jpg`

No se pide: ya está resuelta.

#### **DEFINITIVA** `lacoast-polo-20.jpg`

No se pide: ya está resuelta.

#### **DEFINITIVA** `lacoast-kratos-22.jpg`

No se pide: ya está resuelta.

#### **DEFINITIVA** `pique-ares-24.jpg`

No se pide: ya está resuelta.

#### **FALTA** `cuellos-20-24.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Cuellos 20/24 de polialgodón, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

#### **FALTA** `punos-20-24.jpg`

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Puños 20/24 de polialgodón, detalle del tejido.
- **Nota:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

### Galería · segunda vista — 6 (6 por conseguir)

#### **FALTA** `denis-20-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Denis 20 de polialgodón, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `austria-premium-18-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Austria Premium 18 de polialgodón, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `lacoast-20-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Lacoast 20 de polialgodón, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `lacoast-polo-20-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Lacoast Polo 20 de polialgodón, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `lacoast-kratos-22-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Lacoast Kratos 22 de polialgodón, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

#### **FALTA** `pique-ares-24-caida.jpg`

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela Pique Ares 24 de polialgodón, el género en caída mostrando peso y drapeado.
- **Nota:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

---

## Asesor Virtual — `/asesor-virtual`

**6 faltan · 1 provisional · 0 definitivas** — 7 huecos en total. Quedan 7 fotos por conseguir.

### Cabecera — 1 (1 por conseguir)

#### **PROVISIONAL** `hero-asesor-virtual.jpg`

- **Se ve a:** a sangre, 100% del ancho × 70vh (`FondoHero`)
- **Proporción:** muy apaisada; se recorta a 70vh
- **Ancho mínimo de entrega:** 2400 px
- **Qué debe verse:** Asesor de Textil Padilla revisando muestras de tela con un cliente.
- **Nota:** Cabecera de /asesor-virtual, a sangre. Tono bajo, sin detalle en el tercio izquierdo (ahí va el titular). Muy apaisada: se recorta a 70vh.

> **⚠ HAY FOTO, PERO ES PROVISIONAL.** Puesta solo para maquetar o valorar el tratamiento. Según: Los cuatro archivos son BYTE A BYTE el mismo (md5 56e355a4…), y el `alt` de cada slot describe una escena distinta: una sola imagen no puede ser a la vez el mostrador, los rollos, las camisetas y el asesor. Está puesta para poder maquetar la banda de cabecera.

### Opciones del cuestionario — 6 (6 por conseguir)

#### **FALTA** `asesor-prenda-otro.jpg`

- **Se ve a:** 64 px (72 px desde tablet), cuadrada (`AsesorWizard`)
- **Proporción:** 1:1
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Retales y muestras de distintas telas sobre la mesa del asesor.
- **Nota:** Cuadrada (1:1). Opción «Otro»: bodegón de muestras variadas, sin una prenda concreta.

#### **FALTA** `asesor-sublimado-si.jpg`

- **Se ve a:** 64 px (72 px desde tablet), cuadrada (`AsesorWizard`)
- **Proporción:** 1:1
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Prenda deportiva con estampado sublimado a todo color.
- **Nota:** Cuadrada (1:1). Base clara con full-print sublimado.

#### **FALTA** `asesor-sublimado-no.jpg`

- **Se ve a:** 64 px (72 px desde tablet), cuadrada (`AsesorWizard`)
- **Proporción:** 1:1
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Tela en color liso teñido a demanda, sin estampado.
- **Nota:** Cuadrada (1:1). Tono sólido, sin estampado.

#### **FALTA** `asesor-uso-rendimiento.jpg`

- **Se ve a:** 64 px (72 px desde tablet), cuadrada (`AsesorWizard`)
- **Proporción:** 1:1
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Prenda deportiva de alto rendimiento en uso durante el gesto atlético.
- **Nota:** Cuadrada (1:1). Deporte de rendimiento, tela técnica.

#### **FALTA** `asesor-uso-casual.jpg`

- **Se ve a:** 64 px (72 px desde tablet), cuadrada (`AsesorWizard`)
- **Proporción:** 1:1
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Prenda casual de uso diario, de caída suave.
- **Nota:** Cuadrada (1:1). Básico de retail, mano suave.

#### **FALTA** `asesor-uso-uniforme.jpg`

- **Se ve a:** 64 px (72 px desde tablet), cuadrada (`AsesorWizard`)
- **Proporción:** 1:1
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Uniforme corporativo confeccionado en tela de color estable.
- **Nota:** Cuadrada (1:1). Uniforme corporativo, color estable al lavado.

---

## Contacto — `/contacto`

**1 falta · 1 provisional · 1 definitiva** — 3 huecos en total. Quedan 2 fotos por conseguir.

### Cabecera — 1 (1 por conseguir)

#### **PROVISIONAL** `hero-contacto.jpg`

- **Se ve a:** a sangre, 100% del ancho × 70vh (`FondoHero`)
- **Proporción:** muy apaisada; se recorta a 70vh
- **Ancho mínimo de entrega:** 2400 px
- **Qué debe verse:** Mostrador de atención de Textil Padilla, con muestrarios de tela sobre la mesa.
- **Nota:** Cabecera de /contacto, a sangre. Tono bajo, sin detalle en el tercio izquierdo (ahí va el titular). Muy apaisada: se recorta a 70vh.

> **⚠ HAY FOTO, PERO ES PROVISIONAL.** Puesta solo para maquetar o valorar el tratamiento. Según: Los cuatro archivos son BYTE A BYTE el mismo (md5 56e355a4…), y el `alt` de cada slot describe una escena distinta: una sola imagen no puede ser a la vez el mostrador, los rollos, las camisetas y el asesor. Está puesta para poder maquetar la banda de cabecera.

### Contenido principal — 2 (1 por conseguir)

#### **DEFINITIVA** `local-fachada.jpg`

No se pide: ya está resuelta.

#### **FALTA** `retrato-asesor.jpg`

- **Se ve a:** columna derecha del formulario de contacto; en móvil ocupa el ancho (`contacto/page.tsx`)
- **Proporción:** 4:3 en móvil; en escritorio se estira a la altura del formulario
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Asesor comercial de Textil Padilla atendiendo en el mostrador, con muestrario de telas.
- **Nota:** Retrato de una persona real del equipo. Requiere su autorización para salir en la web.

---

## Proceso de entrega

Vale para todas las fotos de este documento. Son cinco cosas, y ninguna es
de gusto: cada una tapa un fallo concreto que ya ha pasado.

### 1. El nombre del archivo es lo único que hay que acertar

Cada hueco espera un archivo con **su nombre exacto** (`athletic.jpg`,
`hero-empresa.jpg`…), el que aparece en su ficha aquí. La extensión da igual
—`.jpg`, `.png`, `.webp`, `.tif`—; el nombre, no.

Con el nombre bien puesto la foto entra en la web sin tocar código. Mal
puesto **no da error**: deja el hueco vacío y parece un fallo de la web. Por
eso el nombre va en cada ficha y por eso se pide así de literal.

### 2. El original de cámara, sin re-exportar ni comprimir

Se entrega el archivo **tal y como sale de la cámara**. Sin re-exportar, sin
volver a comprimir y sin redimensionar.

El sitio genera sus propios tamaños y su propio WebP a partir de lo que
llegue. Un JPEG que ya venía comprimido y se vuelve a comprimir pierde dos
veces, y esa pérdida no se recupera después: se ve como grano sucio en los
macros de tejido, que es justo donde hay que leer la trama. El ancho mínimo
de cada ficha es sobre el original, no sobre una copia reducida.

### 3. Sin editar

Sin filtros, sin virados, sin recortes «para que quede mejor», y **sin
rótulos, logotipos ni tipografía quemados sobre la imagen**. Un rótulo
quemado no se quita con un recorte y deja la foto inservible para la web.

El recorte lo hace el sitio, que sabe a qué proporción va cada hueco y que
recorta distinto el mismo archivo según dónde se use —hay fotos que salen
apaisadas en un sitio y cuadradas en otro—. Una foto ya recortada a mano
solo sirve para uno de los dos.

### 4. Trípode, con exposición y enfoque bloqueados

Dentro de una misma serie —las telas del catálogo son la serie grande— las
tomas tienen que ser **comparables entre sí**. Si la cámara vuelve a medir y
a enfocar en cada disparo, dos telas del mismo lote salen con luminancias
distintas y la ficha las enseña como si fueran géneros distintos, cuando lo
único que cambió fue el automatismo.

En las telas que alimentan la simulación de color esto además decide si la
foto sirve o no: el recoloreo multiplica canal a canal, así que la
exposición y la dominante de la toma son el resultado, no un ajuste
posterior.

### 5. Entrega por la carpeta compartida

Un archivo por hueco, con su nombre, en la carpeta compartida.

**No por correo ni por mensajería.** Los dos recomprimen y bajan la
resolución «para que quepa», que es exactamente lo que pide evitar el punto
2 — y lo hacen en silencio, así que el archivo llega con aspecto correcto y
la mitad de la información.

### Y una restricción que no es de fotografía

**Un hueco que afirma algo nuestro no admite imagen generada ni de banco.**
Si el hueco dice «nuestra planta», «nuestros clientes» o «nuestro asesor»,
la imagen tiene que documentar eso de verdad. Una imagen generada puede
estar perfectamente licenciada y seguir siendo una afirmación falsa sobre la
empresa; la licencia resuelve el derecho a usarla, no el que diga la verdad.
Para huecos de ambiente, sin afirmación, no hay problema.

**Una persona real identificable necesita su autorización**, que no es lo
mismo que una licencia de stock: marketing puede tener la licencia y seguir
faltando el permiso de quien sale en la foto.

El registro completo de qué material está bloqueado y por qué está en
`README-imagenes.md` §5 y en `npm run catalogo`.

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
