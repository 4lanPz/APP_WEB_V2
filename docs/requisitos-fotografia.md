# Requisitos de fotografía — Textil Padilla

Lo que falta fotografiar para que el sitio quede completo, agrupado por tipo
de toma: cada bloque es una sesión.

**GENERADO — no editar a mano.** Sale del registro de slots y del manifiesto
de imágenes. Se regenera con `npm run imagenes:requisitos`, y una foto
entregada desaparece sola de este documento.

## Resumen

De **133 huecos** de imagen del sitio, **45 tienen foto** y **faltan 88**.

| Tipo de toma | Faltan |
|---|---|
| Macro de tela del catálogo | 23 |
| Segunda vista de tela — el género en caída | 28 |
| Card de familia de tela | 4 |
| Cabecera de página | 1 |
| Industrial / proceso | 2 |
| Encuentros de la portada | 4 |
| Prendas del recomendador | 3 |
| Línea de hitos — archivo histórico | 9 |
| Miniaturas del cuestionario del asesor | 6 |
| Asesor virtual en portada | 3 |
| Huecos sueltos | 5 |

## Hay que decidir esto antes de la sesión — 1

No son dudas de fotografía sino de contenido: qué va en el hueco. Cada
uno tiene su nota escrita con lo que se sabe hoy y se puede disparar así,
pero si la decisión cae del otro lado la toma no sirve y hay que repetirla.

- **`evento-alianza-retail`** — El id anuncia una ALIANZA y la nota describe un DESPACHO, que no es lo mismo. Antes de disparar hay que confirmar qué ocurrió de verdad en este encuentro: si la foto no comunica el acuerdo, el titular de la tarjeta dirá una cosa y la imagen otra. La nota está escrita con lo que hay hoy, que es el alt; si el evento resulta ser otra cosa, se reescribe aquí antes de la sesión.

**El nombre del archivo es lo único que hay que acertar.** Cada hueco espera
un archivo con su nombre exacto (`athletic.jpg`, `hero-empresa.jpg`…). La
extensión da igual. Con el nombre bien puesto la foto entra en la web sin
tocar código.

---

## Macro de tela del catálogo — 23 fotos

El detalle del tejido de cada tela. Es la foto principal de su ficha y la miniatura de la rejilla de su familia. La más importante del encargo: sin ella una tela no se puede publicar.

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`

**Qué se necesita, igual para todas:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Athletic, con croma 0,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

| Archivo a entregar | Dónde va | Ancho mín. | Qué debe verse |
|---|---|---|---|
| `athletic-plus.jpg` | Microfibra | 1280 px | Tela Athletic Plus de microfibra, detalle del tejido. |
| `boston-plus.jpg` | Microfibra | 1280 px | Tela Boston Plus de microfibra, detalle del tejido. |
| `chelsea-plus.jpg` | Microfibra | 1280 px | Tela Chelsea Plus de microfibra, detalle del tejido. |
| `dortmund-plus.jpg` | Microfibra | 1280 px | Tela Dortmund Plus de microfibra, detalle del tejido. |
| `equatex-plus.jpg` | Microfibra | 1280 px | Tela Equatex Plus de microfibra, detalle del tejido. |
| `equator-plus.jpg` | Microfibra | 1280 px | Tela Equator Plus de microfibra, detalle del tejido. |
| `imperial.jpg` | Microfibra | 1280 px | Tela Imperial de microfibra, detalle del tejido. |
| `napoli-open.jpg` | Texturizado | 1280 px | Tela Napoli Open de texturizado, detalle del tejido. |
| `buff-romina-30.jpg` | Spun | 1280 px | Tela Buff Romina 30 de spun, detalle del tejido. |
| `buff-romina-rev-30.jpg` | Spun | 1280 px | Tela Buff Romina Rev 30 de spun, detalle del tejido. |
| `interlock-plus-30.jpg` | Spun | 1280 px | Tela Interlock Plus 30 de spun, detalle del tejido. |
| `ribb-20.jpg` | Spun | 1280 px | Tela Ribb 20 de spun, detalle del tejido. |
| `ribb-30.jpg` | Spun | 1280 px | Tela Ribb 30 de spun, detalle del tejido. |
| `ribb-40.jpg` | Spun | 1280 px | Tela Ribb 40 de spun, detalle del tejido. |
| `amelia-24.jpg` | Polialgodón | 1280 px | Tela Amelia 24 de polialgodón, detalle del tejido. |
| `australia-18.jpg` | Polialgodón | 1280 px | Tela Australia 18 de polialgodón, detalle del tejido. |
| `austria-premium-18.jpg` | Polialgodón | 1280 px | Tela Austria Premium 18 de polialgodón, detalle del tejido. |
| `balboa-24.jpg` | Polialgodón | 1280 px | Tela Balboa 24 de polialgodón, detalle del tejido. |
| `cuellos-20-24.jpg` | Polialgodón | 1280 px | Tela Cuellos 20/24 de polialgodón, detalle del tejido. |
| `melisa-24.jpg` | Polialgodón | 1280 px | Tela Melisa 24 de polialgodón, detalle del tejido. |
| `punos-20-24.jpg` | Polialgodón | 1280 px | Tela Puños 20/24 de polialgodón, detalle del tejido. |
| `ribb-18.jpg` | Polialgodón | 1280 px | Tela Ribb 18 de polialgodón, detalle del tejido. |
| `ribb-20-24.jpg` | Polialgodón | 1280 px | Tela Ribb 20/24 de polialgodón, detalle del tejido. |

> Clasificadas según el origen del slot: salen de `SLOTS_TELA`, que se deriva de las subcategorías de `taxonomy.ts`, con nota común.

---

## Segunda vista de tela — el género en caída — 28 fotos

La segunda foto de la galería de cada tela: el mismo género drapeado, para que se vea el peso y la caída. Con ella la galería de la ficha se activa.

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`

**Qué se necesita, igual para todas:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

| Archivo a entregar | Dónde va | Ancho mín. | Qué debe verse |
|---|---|---|---|
| `aston-plus-caida.jpg` | Microfibra | 1280 px | Tela Aston Plus de microfibra, el género en caída mostrando peso y drapeado. |
| `athletic-caida.jpg` | Microfibra | 1280 px | Tela Athletic de microfibra, el género en caída mostrando peso y drapeado. |
| `boston-caida.jpg` | Microfibra | 1280 px | Tela Boston de microfibra, el género en caída mostrando peso y drapeado. |
| `boston-plus-caida.jpg` | Microfibra | 1280 px | Tela Boston Plus de microfibra, el género en caída mostrando peso y drapeado. |
| `chelsea-caida.jpg` | Microfibra | 1280 px | Tela Chelsea de microfibra, el género en caída mostrando peso y drapeado. |
| `chelsea-plus-caida.jpg` | Microfibra | 1280 px | Tela Chelsea Plus de microfibra, el género en caída mostrando peso y drapeado. |
| `dobleface-plus-caida.jpg` | Microfibra | 1280 px | Tela Dobleface Plus de microfibra, el género en caída mostrando peso y drapeado. |
| `dortmund-caida.jpg` | Microfibra | 1280 px | Tela Dortmund de microfibra, el género en caída mostrando peso y drapeado. |
| `dortmund-plus-caida.jpg` | Microfibra | 1280 px | Tela Dortmund Plus de microfibra, el género en caída mostrando peso y drapeado. |
| `juventus-caida.jpg` | Microfibra | 1280 px | Tela Juventus de microfibra, el género en caída mostrando peso y drapeado. |
| `kansas-caida.jpg` | Microfibra | 1280 px | Tela Kansas de microfibra, el género en caída mostrando peso y drapeado. |
| `sevilla-caida.jpg` | Microfibra | 1280 px | Tela Sevilla de microfibra, el género en caída mostrando peso y drapeado. |
| `sevilla-plus-caida.jpg` | Microfibra | 1280 px | Tela Sevilla Plus de microfibra, el género en caída mostrando peso y drapeado. |
| `gaby-caida.jpg` | Texturizado | 1280 px | Tela Gaby de texturizado, el género en caída mostrando peso y drapeado. |
| `kiana-caida.jpg` | Texturizado | 1280 px | Tela Kiana de texturizado, el género en caída mostrando peso y drapeado. |
| `mezi-caida.jpg` | Texturizado | 1280 px | Tela Mezi de texturizado, el género en caída mostrando peso y drapeado. |
| `napoles-caida.jpg` | Texturizado | 1280 px | Tela Napoles de texturizado, el género en caída mostrando peso y drapeado. |
| `napoli-caida.jpg` | Texturizado | 1280 px | Tela Napoli de texturizado, el género en caída mostrando peso y drapeado. |
| `ribb-150-caida.jpg` | Texturizado | 1280 px | Tela Ribb 150 de texturizado, el género en caída mostrando peso y drapeado. |
| `river-caida.jpg` | Texturizado | 1280 px | Tela River de texturizado, el género en caída mostrando peso y drapeado. |
| `buff-romina-30-caida.jpg` | Spun | 1280 px | Tela Buff Romina 30 de spun, el género en caída mostrando peso y drapeado. |
| `interlock-30-caida.jpg` | Spun | 1280 px | Tela Interlock 30 de spun, el género en caída mostrando peso y drapeado. |
| `austria-premium-18-caida.jpg` | Polialgodón | 1280 px | Tela Austria Premium 18 de polialgodón, el género en caída mostrando peso y drapeado. |
| `denis-20-caida.jpg` | Polialgodón | 1280 px | Tela Denis 20 de polialgodón, el género en caída mostrando peso y drapeado. |
| `lacoast-20-caida.jpg` | Polialgodón | 1280 px | Tela Lacoast 20 de polialgodón, el género en caída mostrando peso y drapeado. |
| `lacoast-kratos-22-caida.jpg` | Polialgodón | 1280 px | Tela Lacoast Kratos 22 de polialgodón, el género en caída mostrando peso y drapeado. |
| `lacoast-polo-20-caida.jpg` | Polialgodón | 1280 px | Tela Lacoast Polo 20 de polialgodón, el género en caída mostrando peso y drapeado. |
| `pique-ares-24-caida.jpg` | Polialgodón | 1280 px | Tela Pique Ares 24 de polialgodón, el género en caída mostrando peso y drapeado. |

> Clasificadas según el origen del slot: salen de `SLOTS_GALERIA_TELA`, con nota común.

---

## Card de familia de tela — 4 fotos

Las cuatro cards de la rejilla «Familias de tela». Una foto por familia, que se ve en la portada, en /productos y en el styleguide — cuatro archivos, no doce.

- **Se ve a:** ~310 × 300 px en la rejilla de cuatro columnas (`CategoryCard`)
- **Proporción:** casi cuadrada; se recorta a la card con `object-cover`

#### `familia-microfibra`

- **Nombre del archivo a entregar:** `familia-microfibra.jpg`
- **Dónde va:** Inicio (`/`) · Familias de tela
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Rollos de microfibra alineados en bodega, con el brillo característico del poliéster ligero.
- **Nota:** Card de la rejilla de cuatro columnas, ~310 × 300 px. Lleva encima un velo que baja hasta rgba(9,20,25,0.78) en el borde inferior, y sobre esa franja van el título y la descripción: la foto tiene que aguantar oscurecerse abajo y no llevar detalle importante ahí. (En las cabeceras hay que despejar el tercio izquierdo; aquí es la parte de abajo.) El mismo archivo se usa en la rejilla de /productos y en el styleguide: es un solo hueco, no tres.

#### `familia-polialgodon`

- **Nombre del archivo a entregar:** `familia-polialgodon.jpg`
- **Dónde va:** Inicio (`/`) · Familias de tela
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela de mezcla poliéster-algodón en plano abierto, con la trama del tejido visible.
- **Nota:** Card de la rejilla de cuatro columnas, ~310 × 300 px. Lleva encima un velo que baja hasta rgba(9,20,25,0.78) en el borde inferior, y sobre esa franja van el título y la descripción: la foto tiene que aguantar oscurecerse abajo y no llevar detalle importante ahí. (En las cabeceras hay que despejar el tercio izquierdo; aquí es la parte de abajo.) El mismo archivo se usa en la rejilla de /productos y en el styleguide: es un solo hueco, no tres.

#### `familia-spun`

- **Nombre del archivo a entregar:** `familia-spun.jpg`
- **Dónde va:** Inicio (`/`) · Familias de tela
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela de hilado spun en plano abierto, de superficie mate y aspecto algodonoso.
- **Nota:** Card de la rejilla de cuatro columnas, ~310 × 300 px. Lleva encima un velo que baja hasta rgba(9,20,25,0.78) en el borde inferior, y sobre esa franja van el título y la descripción: la foto tiene que aguantar oscurecerse abajo y no llevar detalle importante ahí. (En las cabeceras hay que despejar el tercio izquierdo; aquí es la parte de abajo.) El mismo archivo se usa en la rejilla de /productos y en el styleguide: es un solo hueco, no tres.

#### `familia-texturizado`

- **Nombre del archivo a entregar:** `familia-texturizado.jpg`
- **Dónde va:** Inicio (`/`) · Familias de tela
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tejido texturizado en plano abierto, con el cuerpo y el relieve del hilo a la vista.
- **Nota:** Card de la rejilla de cuatro columnas, ~310 × 300 px. Lleva encima un velo que baja hasta rgba(9,20,25,0.78) en el borde inferior, y sobre esa franja van el título y la descripción: la foto tiene que aguantar oscurecerse abajo y no llevar detalle importante ahí. (En las cabeceras hay que despejar el tercio izquierdo; aquí es la parte de abajo.) El mismo archivo se usa en la rejilla de /productos y en el styleguide: es un solo hueco, no tres.

> Clasificadas según el origen del slot: prefijo `familia-`, con nota propia.

---

## Cabecera de página — 1 foto

El fondo fotográfico a sangre de la banda oscura de cabecera. Mientras falte, la cabecera se queda en tinta plana.

- **Se ve a:** a sangre, 100% del ancho × 70vh (`FondoHero`)
- **Proporción:** muy apaisada; se recorta a 70vh

#### `hero-dortmund-plus`

- **Nombre del archivo a entregar:** `hero-dortmund-plus.jpg`
- **Dónde va:** Dortmund Plus (`/productos/microfibra/dortmund-plus`) · Cabecera
- **Ancho mínimo de entrega:** 2400 px
- **Qué debe verse:** Rollo de Dortmund Plus en la nave de producción.
- **Nota:** Cabecera de /productos/microfibra/dortmund-plus, a sangre. Tono bajo, sin detalle en el tercio izquierdo (ahí va el titular). Muy apaisada: se recorta a 70vh.

> Clasificadas según el origen del slot: prefijo `hero-`, con nota propia.

---

## Industrial / proceso — 2 fotos

La planta trabajando. Son las que sostienen los argumentos de la página de Empresa — el teñido a demanda no se afirma, se enseña.

- **Se ve a:** media columna del bloque de Oficio, hasta ~620 px de ancho (`empresa/page.tsx`)
- **Proporción:** 4:3 apaisada

#### `oficio-carta-color`

- **Nombre del archivo a entregar:** `oficio-carta-color.jpg`
- **Dónde va:** Empresa (`/empresa`) · Oficio
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Carta de color de Textil Padilla: muestras de tela teñidas ordenadas por tono.
- **Nota:** Muestrario físico de colores. Apaisada (4:3).

#### `oficio-tintoreria`

- **Nombre del archivo a entregar:** `oficio-tintoreria.jpg`
- **Dónde va:** Empresa (`/empresa`) · Oficio
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Tintorería de Textil Padilla: barcas de teñido en proceso.
- **Nota:** Área de tintorería en marcha. Apaisada (4:3). Es la que sostiene el argumento del teñido a demanda.

> Clasificadas según la sección del slot: «Oficio», con nota propia.

---

## Encuentros de la portada — 4 fotos

Las cuatro tarjetas del carrusel de encuentros. Van en la portada presentadas como cosas que la empresa hizo, así que aquí no vale material genérico: cada una tiene que ser ese encuentro y no uno parecido.

- **Se ve a:** media anchura del carrusel, ~600 px (`EventCarousel`)
- **Proporción:** 4:3 apaisada — el marco es `aspect-4/3`

#### `evento-alianza-retail`

- **Nombre del archivo a entregar:** `evento-alianza-retail.jpg`
- **Dónde va:** Inicio (`/`) · Encuentros
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Rollos de tela preparados para un cliente de retail premium.
- **Nota:** Apaisada (4:3), a media anchura del carrusel de encuentros (~600 px). Documental: material y gente reales, sin posado de estudio ni rótulos quemados. La portada lo presenta como un hecho de la empresa, así que no admite imagen generada ni de banco (ver README-imagenes.md §5). Rollos etiquetados y preparados para despacho, en bodega. Sin marcas ni logotipos de terceros identificables: al cliente no se le nombra.

> **⚠ POR CONFIRMAR ANTES DE DISPARAR.** El id anuncia una ALIANZA y la nota describe un DESPACHO, que no es lo mismo. Antes de disparar hay que confirmar qué ocurrió de verdad en este encuentro: si la foto no comunica el acuerdo, el titular de la tarjeta dirá una cosa y la imagen otra. La nota está escrita con lo que hay hoy, que es el alt; si el evento resulta ser otra cosa, se reescribe aquí antes de la sesión.

#### `evento-feria-andina`

- **Nombre del archivo a entregar:** `evento-feria-andina.jpg`
- **Dónde va:** Inicio (`/`) · Encuentros
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Stand de Textil Padilla en la Feria Internacional del Textil Andino, con muestrario de telas.
- **Nota:** Apaisada (4:3), a media anchura del carrusel de encuentros (~600 px). Documental: material y gente reales, sin posado de estudio ni rótulos quemados. La portada lo presenta como un hecho de la empresa, así que no admite imagen generada ni de banco (ver README-imagenes.md §5). El stand en el recinto, con gente delante: se tiene que leer que es una feria y no una bodega. Luz de recinto, sin flash directo.

#### `evento-jornada-color`

- **Nombre del archivo a entregar:** `evento-jornada-color.jpg`
- **Dónde va:** Inicio (`/`) · Encuentros
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Jornada de color a demanda: cliente comparando su referencia contra una carta de color.
- **Nota:** Apaisada (4:3), a media anchura del carrusel de encuentros (~600 px). Documental: material y gente reales, sin posado de estudio ni rótulos quemados. La portada lo presenta como un hecho de la empresa, así que no admite imagen generada ni de banco (ver README-imagenes.md §5). Plano medio de las manos, la carta de color y la muestra del cliente sobre la mesa. La carta tiene que salir legible y en luz neutra: es lo que sostiene el argumento del teñido a demanda, y una carta con dominante no se puede enseñar.

#### `evento-performknit-320`

- **Nombre del archivo a entregar:** `evento-performknit-320.jpg`
- **Dónde va:** Inicio (`/`) · Encuentros
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Presentación de la línea PerformKnit 320: detalle del tejido sobre la mesa de muestras.
- **Nota:** Apaisada (4:3), a media anchura del carrusel de encuentros (~600 px). Documental: material y gente reales, sin posado de estudio ni rótulos quemados. La portada lo presenta como un hecho de la empresa, así que no admite imagen generada ni de banco (ver README-imagenes.md §5). El tejido de la línea sobre la mesa de muestras, cenital o en tres cuartos. Prima que se lea el tejido, no la sala.

> Clasificadas según la sección del slot: «Encuentros», con nota propia.

---

## Prendas del recomendador — 3 fotos

Las tres prendas del recomendador de /productos. OJO: estas tres se reutilizan recortadas a cuadrado en el asesor virtual, así que cada una tiene que funcionar en dos tamaños muy distintos. Está en la nota de cada una.

- **Se ve a:** media anchura del recomendador, ~600 px (`GarmentRecommender`) — Y ADEMÁS 64 px (72 desde tablet) cuadrada en el asesor virtual (`AsesorWizard`)
- **Proporción:** 4:3 apaisada, recortada a 1:1 en la miniatura

#### `prenda-camiseta`

- **Nombre del archivo a entregar:** `prenda-camiseta.jpg`
- **Dónde va:** Productos (`/productos`) · Recomendador
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Camiseta confeccionada en jersey de algodón peinado, mostrando la caída del punto.
- **Nota:** Apaisada (4:3) a media anchura del recomendador (~600 px), pero la MISMA foto se recorta a un cuadrado de 64 px (72 desde tablet) en las opciones del asesor virtual: la prenda tiene que quedar centrada y seguir reconociéndose dentro de ese cuadrado central. Prenda sola sobre fondo neutro, sin modelo y sin degradado de estudio. Camiseta lisa de frente, colgada o doblada de forma que se lea la caída del punto.

#### `prenda-chompa`

- **Nombre del archivo a entregar:** `prenda-chompa.jpg`
- **Dónde va:** Productos (`/productos`) · Recomendador
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Chompa en French Terry perchado, con el reverso afelpado a la vista.
- **Nota:** Apaisada (4:3) a media anchura del recomendador (~600 px), pero la MISMA foto se recorta a un cuadrado de 64 px (72 desde tablet) en las opciones del asesor virtual: la prenda tiene que quedar centrada y seguir reconociéndose dentro de ese cuadrado central. Prenda sola sobre fondo neutro, sin modelo y sin degradado de estudio. Chompa entera y centrada, de frente. El reverso afelpado a la vista es DESEABLE, no obligatorio: si compite con el encuadre, manda que la prenda se reconozca en el cuadrado de 64 px. Que el perchado asome en un puño o en el dobladillo, con la prenda dominando el cuadro; un detalle de perchado que ocupe el centro se pierde como chompa, y en una esquina se pierde al recortar.

#### `prenda-pantalon`

- **Nombre del archivo a entregar:** `prenda-pantalon.jpg`
- **Dónde va:** Productos (`/productos`) · Recomendador
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Pantalón deportivo en sarga stretch, mostrando la caída y la recuperación del tejido.
- **Nota:** Apaisada (4:3) a media anchura del recomendador (~600 px), pero la MISMA foto se recorta a un cuadrado de 64 px (72 desde tablet) en las opciones del asesor virtual: la prenda tiene que quedar centrada y seguir reconociéndose dentro de ese cuadrado central. Prenda sola sobre fondo neutro, sin modelo y sin degradado de estudio. El pantalón entero, para que se vea la caída; el detalle de la sarga en el mismo cuadro si cabe sin perder la prenda.

> Clasificadas según la sección del slot: «Recomendador», con nota propia.

---

## Línea de hitos — archivo histórico — 9 fotos

Fotos de archivo para la línea de tiempo de Empresa. OPCIONALES: la línea funciona sin ellas y no bloquean nada. Van al final de la prioridad.

- **Se ve a:** columna lateral de 240 px de ancho (`Timeline`)
- **Proporción:** 4:3 apaisada

**Qué se necesita, igual para todas:** Opcional: la línea de hitos funciona sin fotos. Formato 4:3.

| Archivo a entregar | Dónde va | Ancho mín. | Qué debe verse |
|---|---|---|---|
| `hito-fnd-01.jpg` | Empresa | 900 px | Textil Padilla, 1987 · Fundación en Alangasí. |
| `hito-loc-01.jpg` | Empresa | 900 px | Textil Padilla, 1994 · Consolidación de la matriz. |
| `hito-loc-02.jpg` | Empresa | 900 px | Textil Padilla, 2003 · Local de La Marín. |
| `hito-loc-03.jpg` | Empresa | 900 px | Textil Padilla, 2008 · Local de Solanda. |
| `hito-loc-04.jpg` | Empresa | 900 px | Textil Padilla, Apertura de local. |
| `hito-loc-05.jpg` | Empresa | 900 px | Textil Padilla, Apertura de local. |
| `hito-prd-01.jpg` | Empresa | 900 px | Textil Padilla, 1999 · Teñido a demanda. |
| `hito-prd-02.jpg` | Empresa | 900 px | Textil Padilla, Ampliación de producción. |
| `hito-qlt-01.jpg` | Empresa | 900 px | Textil Padilla, Control de calidad. |

> Clasificadas según el origen del slot: salen de `SLOTS_HITOS`, con nota común.

---

## Miniaturas del cuestionario del asesor — 6 fotos

Miniaturas cuadradas pequeñas que acompañan a cada opción del asesor virtual. Acompañan a la opción, no la lideran.

- **Se ve a:** 64 px (72 px desde tablet), cuadrada (`AsesorWizard`)
- **Proporción:** 1:1

#### `asesor-prenda-otro`

- **Nombre del archivo a entregar:** `asesor-prenda-otro.jpg`
- **Dónde va:** Asesor Virtual (`/asesor-virtual`) · Opciones del cuestionario
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Retales y muestras de distintas telas sobre la mesa del asesor.
- **Nota:** Cuadrada (1:1). Opción «Otro»: bodegón de muestras variadas, sin una prenda concreta.

#### `asesor-sublimado-no`

- **Nombre del archivo a entregar:** `asesor-sublimado-no.jpg`
- **Dónde va:** Asesor Virtual (`/asesor-virtual`) · Opciones del cuestionario
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Tela en color liso teñido a demanda, sin estampado.
- **Nota:** Cuadrada (1:1). Tono sólido, sin estampado.

#### `asesor-sublimado-si`

- **Nombre del archivo a entregar:** `asesor-sublimado-si.jpg`
- **Dónde va:** Asesor Virtual (`/asesor-virtual`) · Opciones del cuestionario
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Prenda deportiva con estampado sublimado a todo color.
- **Nota:** Cuadrada (1:1). Base clara con full-print sublimado.

#### `asesor-uso-casual`

- **Nombre del archivo a entregar:** `asesor-uso-casual.jpg`
- **Dónde va:** Asesor Virtual (`/asesor-virtual`) · Opciones del cuestionario
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Prenda casual de uso diario, de caída suave.
- **Nota:** Cuadrada (1:1). Básico de retail, mano suave.

#### `asesor-uso-rendimiento`

- **Nombre del archivo a entregar:** `asesor-uso-rendimiento.jpg`
- **Dónde va:** Asesor Virtual (`/asesor-virtual`) · Opciones del cuestionario
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Prenda deportiva de alto rendimiento en uso durante el gesto atlético.
- **Nota:** Cuadrada (1:1). Deporte de rendimiento, tela técnica.

#### `asesor-uso-uniforme`

- **Nombre del archivo a entregar:** `asesor-uso-uniforme.jpg`
- **Dónde va:** Asesor Virtual (`/asesor-virtual`) · Opciones del cuestionario
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Uniforme corporativo confeccionado en tela de color estable.
- **Nota:** Cuadrada (1:1). Uniforme corporativo, color estable al lavado.

> Clasificadas según la sección del slot: «Opciones del cuestionario», con nota propia.

---

## Asesor virtual en portada — 3 fotos

Una foto grande y editorial por paso del cuestionario en la portada. Se cambian solas al avanzar el paso.

- **Se ve a:** media pantalla del split, mínimo 380 px de alto, solo desde tablet (`AsesorPasos`)
- **Proporción:** flexible — la caja recorta con `object-cover`

#### `asesor-portada-prenda`

- **Nombre del archivo a entregar:** `asesor-portada-prenda.jpg`
- **Dónde va:** Inicio (`/`) · Asesor virtual
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Prendas deportivas en confección: camisetas y buzos que definen el punto de partida de la asesoría.
- **Nota:** Paso 01 (Prenda). Qué se va a producir: prenda deportiva terminada o en confección. Sin rótulos quemados. Formato flexible; se recorta a la caja del split.

#### `asesor-portada-sublimado`

- **Nombre del archivo a entregar:** `asesor-portada-sublimado.jpg`
- **Dónde va:** Inicio (`/`) · Asesor virtual
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Tela clara con estampado sublimado full-print, mostrando el color a sangre sobre la base.
- **Nota:** Paso 02 (Sublimado). Base clara con estampado full-print, o el contraste liso/sublimado. Formato flexible; se recorta a la caja del split.

#### `asesor-portada-uso`

- **Nombre del archivo a entregar:** `asesor-portada-uso.jpg`
- **Dónde va:** Inicio (`/`) · Asesor virtual
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Tela en uso deportivo, mostrando el rendimiento y la caída del género en movimiento.
- **Nota:** Paso 03 (Uso). El destino de la tela: alto rendimiento, casual o uniforme. Formato flexible; se recorta a la caja del split.

> Clasificadas según la sección del slot: «Asesor virtual», con nota propia.

---

## Huecos sueltos — 5 fotos

Tomas que no forman sesión con ninguna otra. Cada una pide una cosa distinta; la nota de cada slot es la especificación.

- **Se ve a:** ver cada hueco
- **Proporción:** ver cada hueco

#### `aplicacion-microfibra`

- **Nombre del archivo a entregar:** `aplicacion-microfibra.jpg`
- **Dónde va:** Microfibra (`/productos/microfibra`) · Ejemplo de aplicación
- **Se ve a:** columna del bloque de aplicación, hasta ~560 px (`productos/microfibra/page.tsx`)
- **Proporción:** 4:5 vertical
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Camiseta deportiva sobre pedestal, fondo oscuro — ejemplo de aplicación de la microfibra en confección.
- **Nota:** Demo: prenda deportiva sobre pedestal, fondo oscuro y neutro. Imagen generada para la maqueta, NO es producto de Textil Padilla. Se reemplazará por el objeto 3D. Vertical (4:5).

#### `dortmund-plus-blancos-macro`

- **Nombre del archivo a entregar:** `dortmund-plus-blancos-macro.jpg`
- **Dónde va:** Dortmund Plus (`/productos/microfibra/dortmund-plus`)
- **Se ve a:** banda a todo el ancho del contenedor (`ProductGallery`)
- **Proporción:** 21:9, muy apaisada
- **Ancho mínimo de entrega:** 1920 px
- **Qué debe verse:** Macrofotografía de la microfibra Dortmund Plus en blanco, con la textura del punto a contraluz.
- **Nota:** Macro de textura, muy apaisada (21:9).

#### `camisetas-jersey`

- **Nombre del archivo a entregar:** `camisetas-jersey.jpg`
- **Dónde va:** Camisetas (`/productos/camisetas`)
- **Se ve a:** media columna, hasta ~620 px de ancho (`productos/camisetas/page.tsx`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Macrofotografía de jersey de algodón peinado, con el punto liso visible de cerca.
- **Nota:** Macro real de single jersey. Acompaña a la ficha de la tela 01.

#### `camisetas-pique`

- **Nombre del archivo a entregar:** `camisetas-pique.jpg`
- **Dónde va:** Camisetas (`/productos/camisetas`)
- **Se ve a:** media columna, hasta ~620 px de ancho (`productos/camisetas/page.tsx`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Macrofotografía de piqué, con las celdas en relieve tipo panal.
- **Nota:** Macro real de piqué. Acompaña a la ficha de la tela 02.

#### `retrato-asesor`

- **Nombre del archivo a entregar:** `retrato-asesor.jpg`
- **Dónde va:** Contacto (`/contacto`)
- **Se ve a:** columna derecha del formulario de contacto; en móvil ocupa el ancho (`contacto/page.tsx`)
- **Proporción:** 4:3 en móvil; en escritorio se estira a la altura del formulario
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Asesor comercial de Textil Padilla atendiendo en el mostrador, con muestrario de telas.
- **Nota:** Retrato de una persona real del equipo. Requiere su autorización para salir en la web.

> Clasificadas según la nota propia de cada slot.

---

## Avisos

**El recoloreo se decide al disparar, no al procesar.** Las telas del catálogo
alimentan la simulación de color de su ficha, y eso impone condiciones a la TOMA
que están escritas en su bloque: tela sin teñir, luz neutra, sin quemados. No hay
corrección posterior para ninguna de las tres — una tela ya teñida o una toma con
dominante cálida obligan a repetir la sesión, no a reprocesar el archivo.

**Material que no puede ir en cualquier hueco.** Ver `README-imagenes.md` §5:
el material generado por IA no puede ocupar un hueco que afirme algo nuestro
(«nuestra planta», «nuestro asesor»), y `retrato-asesor` es una persona real y
necesita su autorización, que no es lo mismo que una licencia.
