# Requisitos de fotografía — Textil Padilla

Lo que hay que fotografiar para que el sitio quede completo, agrupado por
tipo de toma: cada bloque es una sesión.

**GENERADO — no editar a mano.** Sale del registro de slots y del manifiesto
de imágenes. Se regenera con `npm run imagenes:requisitos`, y una foto
definitiva deja de pedirse sola.

Los mismos huecos ordenados por dónde van, página a página, están en
`requisitos-fotografia-por-pagina.md`. Esta vista es la de salir a
fotografiar: cada bloque es una sesión. Aquélla es la de revisar el sitio.

## Los tres estados

Aquí están **todos** los huecos del sitio, tengan foto o no. Que un hueco
tenga imagen no quiere decir que esté resuelto:

| Estado | Qué significa | ¿Se pide? |
|---|---|---|
| **FALTA** | No hay archivo. El sitio dibuja el marcador de hueco. | Sí |
| **PROVISIONAL** | Hay foto, pero hay que reemplazarla. | Sí |
| **DEFINITIVA** | Material real, en su sitio. | No |

Las provisionales llevan debajo **por qué** lo son y **según qué** se ha
determinado —el commit, el md5, la receta o la medida—, para que se pueda
comprobar en vez de creérselo. No todas piden lo mismo:

| Etiqueta | Qué pasa | Qué se pide |
|---|---|---|
| **PROVISIONAL** a secas | De maqueta, de relleno, generada o de banco. | La foto de verdad. |
| **NO SIRVE PARA EL RECOLOREO** | La medida del sitio rechaza la toma: tela teñida, dominante, zona quemada o subexposición. | **Volver a fotografiar** la tela. |
| **SIN VERIFICAR** | El original llegó ya en blanco y negro, así que no se puede comprobar si la tela era cruda. Lo publicado suele verse bien. | **El original a color** de esa misma toma. No hay que repetir la sesión. |
| **PENDIENTE DE CLASIFICAR** | No consta de dónde salió el archivo. | Mirarla y decidir. |

Las dos del medio salen de medir las fotos, no de opinar sobre ellas: el
croma, los píxeles quemados y la luminancia de cada original están en el
`Según` de cada una y se recalculan con `npm run imagenes:medir`.

Y **PENDIENTE DE CLASIFICAR** no se ha adivinado a propósito: una
clasificación inventada se lee igual que una comprobada y ya nadie vuelve a
revisarla.

## Resumen

Los **133 huecos** de imagen del sitio:

- **Faltan 88** — no hay archivo.
- **Provisionales 34** — hay foto, pero hay que reemplazarla. De estas, **3 están pendientes de clasificar**.
- **Definitivas 11** — no se piden.

**Hay que conseguir 122 fotos**, no 88: las provisionales ocupan su hueco pero no lo cierran.

| Tipo de toma | Faltan | Provisionales | Definitivas |
|---|---|---|---|
| Macro de tela del catálogo | 23 | 24 | 3 |
| Segunda vista de tela — el género en caída | 28 | 0 | 1 |
| Card de familia de tela | 4 | 0 | 0 |
| Cabecera de página | 1 | 7 | 0 |
| Industrial / proceso | 2 | 0 | 2 |
| Encuentros de la portada | 4 | 0 | 0 |
| Prendas del recomendador | 3 | 0 | 0 |
| Línea de hitos — archivo histórico | 9 | 0 | 0 |
| Miniaturas del cuestionario del asesor | 6 | 0 | 0 |
| Asesor virtual en portada | 3 | 0 | 0 |
| Huecos sueltos | 5 | 3 | 0 |
| Ya resueltas, fuera de sesión | 0 | 0 | 5 |

## Pendientes de clasificar — 3

**Tienen foto y no consta de dónde salió.** No se ha adivinado: hasta que
alguien las mire no se puede decir si son las buenas o hay que repetirlas.
Van contadas como provisionales porque un hueco sin confirmar no se puede
cerrar, pero puede que alguna resulte definitiva y salga del encargo.

- **`dortmund-plus-cancha`** — Entró en d55790f, un commit sobre el marcado de las cabeceras vacías que no menciona su origen.
- **`hero-microfibra`** — Archivo propio, no duplicado de los otros heroes. Entró en 55ffae7 —el commit del mapa de Contacto— mencionada de pasada y sin decir de dónde sale. No consta el origen.
- **`hero-home-poster`** — Entró en 8e485c6, al arreglar el póster de la portada. El commit explica por qué no se veía, no de dónde sale el archivo.

## Hay que decidir esto antes de la sesión — 5

No son dudas de fotografía sino de contenido: qué va en el hueco. Cada
uno tiene su nota escrita con lo que se sabe hoy y se puede disparar así,
pero si la decisión cae del otro lado la toma no sirve y hay que repetirla.

- **`evento-alianza-retail`** — El id anuncia una ALIANZA y la nota describe un DESPACHO, que no es lo mismo. Antes de disparar hay que confirmar qué ocurrió de verdad en este encuentro: si la foto no comunica el acuerdo, el titular de la tarjeta dirá una cosa y la imagen otra. La nota está escrita con lo que hay hoy, que es el alt; si el evento resulta ser otra cosa, se reescribe aquí antes de la sesión.
- **`hito-loc-04`** — El año 2013 NO está confirmado por administración. Si al validarlo cambia, el hito cambia de sitio en la línea y puede que la foto de archivo que se dispare no sea la de ese año.
- **`hito-loc-05`** — El año 2017 NO está confirmado por administración. Si al validarlo cambia, el hito cambia de sitio en la línea y puede que la foto de archivo que se dispare no sea la de ese año.
- **`hito-qlt-01`** — El año 2021 NO está confirmado por administración. Si al validarlo cambia, el hito cambia de sitio en la línea y puede que la foto de archivo que se dispare no sea la de ese año.
- **`hito-prd-02`** — El año 2024 NO está confirmado por administración. Si al validarlo cambia, el hito cambia de sitio en la línea y puede que la foto de archivo que se dispare no sea la de ese año.

---

## Macro de tela del catálogo — 47 fotos

El detalle del tejido de cada tela. Es la foto principal de su ficha y la miniatura de la rejilla de su familia. La más importante del encargo: sin ella una tela no se puede publicar.

- **Se ve a:** ficha de tela, ancho de la columna de galería (hasta ~860 px); en la rejilla de familia, tile de ~380 × 170 px (`MacroLupa`, `SubcategoryTile`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Estado:** 23 faltan · 24 provisionales · 3 definitivas

**Qué se necesita, igual para todas:** Macro del tejido a plano, apaisada (4:3) como el resto de la galería. Lo que tiene que leerse es la ESTRUCTURA del punto —la trama, el relieve, el canalé o la celda, según la tela—; luz rasante si el tejido tiene relieve. REQUISITOS DE RECOLOREO, y sin ellos la foto no sirve para la simulación de color de la ficha: (1) tela BLANCA O CRUDO, sin teñir — sobre una tela ya teñida el tono del chip sale sucio y no hay corrección posible; (2) luz NEUTRA, sin dominante cálida ni fría — se mide al procesar, el techo es croma 10 sobre 255 y la referencia del lote actual es Titanium, con croma medido de 2,3 a 3,0; (3) sin altas luces quemadas ni negros cerrados — el preprocesado sube los niveles hasta dejar el máximo en 250, y donde el original está a 255 no queda información que levantar; (4) la tela LLENA EL CUADRO: sin fondo, sin manos, sin prenda. Y SE ENTREGA EL ORIGINAL A COLOR, no una conversión a blanco y negro: el recoloreo desatura él solo, y una foto que llega ya desaturada hace imposible comprobar (1) y (2) — el croma de un archivo en blanco y negro da 0,0 siempre, venga de tela cruda o de tela azul. Una toma que incumpla (1) o (2) hay que repetirla: no se arregla después.

| Estado | Archivo a entregar | Dónde va | Ancho mín. | Qué debe verse |
|---|---|---|---|---|
| **PROVISIONAL · NO SIRVE PARA EL RECOLOREO** | `aston-plus.jpg` | Microfibra | 1280 px | Macrofotografía de la microfibra Aston Plus, muestra de fábrica sin teñir: tejido de relieve acanalado y estructura abierta. |
| **FALTA** | `athletic-plus.jpg` | Microfibra | 1280 px | Tela Athletic Plus de microfibra, detalle del tejido. |
| **PROVISIONAL · NO SIRVE PARA EL RECOLOREO** | `boston.jpg` | Microfibra | 1280 px | Macrofotografía de la microfibra Boston, muestra de fábrica sin teñir: punto liso de malla cerrada. |
| **FALTA** | `boston-plus.jpg` | Microfibra | 1280 px | Tela Boston Plus de microfibra, detalle del tejido. |
| **FALTA** | `chelsea-plus.jpg` | Microfibra | 1280 px | Tela Chelsea Plus de microfibra, detalle del tejido. |
| **PROVISIONAL · SIN VERIFICAR** | `dobleface-plus.jpg` | Microfibra | 1280 px | Macrofotografía de la microfibra Dobleface Plus, muestra de fábrica sin teñir: punto doble cara de malla fina y uniforme. |
| **PROVISIONAL · NO SIRVE PARA EL RECOLOREO** | `dortmund.jpg` | Microfibra | 1280 px | Tela Dortmund de microfibra en blanco, superficie lisa a color pleno. |
| **FALTA** | `dortmund-plus.jpg` | Microfibra | 1280 px | Tela Dortmund Plus de microfibra, detalle del tejido. |
| **PROVISIONAL · SIN VERIFICAR** | `dortmund-plus-brillante.jpg` | Microfibra | 1280 px | Tela Dortmund Plus Brillante, detalle del tejido con acabado brillante. |
| **FALTA** | `equatex-plus.jpg` | Microfibra | 1280 px | Tela Equatex Plus de microfibra, detalle del tejido. |
| **FALTA** | `equator-plus.jpg` | Microfibra | 1280 px | Tela Equator Plus de microfibra, detalle del tejido. |
| **FALTA** | `imperial.jpg` | Microfibra | 1280 px | Tela Imperial de microfibra, detalle del tejido. |
| **PROVISIONAL · NO SIRVE PARA EL RECOLOREO** | `juventus.jpg` | Microfibra | 1280 px | Macrofotografía de la microfibra Juventus, muestra de fábrica sin teñir, con el canalé vertical del tejido bien definido. |
| **PROVISIONAL · NO SIRVE PARA EL RECOLOREO** | `kansas.jpg` | Microfibra | 1280 px | Macrofotografía de la microfibra Kansas, muestra de fábrica sin teñir, con celdas tipo panal visibles en la superficie. |
| **PROVISIONAL · SIN VERIFICAR** | `sevilla.jpg` | Microfibra | 1280 px | Macrofotografía de la microfibra Sevilla, muestra de fábrica sin teñir, con el relieve del punto marcado en diagonal. |
| **PROVISIONAL · NO SIRVE PARA EL RECOLOREO** | `sevilla-plus.jpg` | Microfibra | 1280 px | Tela Sevilla Plus de microfibra, detalle del tejido. |
| **PROVISIONAL · SIN VERIFICAR** | `sevilla-plus-brillante.jpg` | Microfibra | 1280 px | Tela Sevilla Plus Brillante, detalle del tejido con acabado brillante. |
| **PROVISIONAL · NO SIRVE PARA EL RECOLOREO** | `gaby.jpg` | Texturizado | 1280 px | Macrofotografía del texturizado Gaby, muestra de fábrica sin teñir: trama diagonal fina y regular. |
| **PROVISIONAL · NO SIRVE PARA EL RECOLOREO** | `kiana.jpg` | Texturizado | 1280 px | Macrofotografía del texturizado Kiana, muestra de fábrica sin teñir, de superficie lisa y trama muy fina. |
| **PROVISIONAL · NO SIRVE PARA EL RECOLOREO** | `mezi.jpg` | Texturizado | 1280 px | Tela Mezi texturizada en negro, superficie lisa a color pleno. |
| **PROVISIONAL · NO SIRVE PARA EL RECOLOREO** | `napoles.jpg` | Texturizado | 1280 px | Macrofotografía del texturizado Napoles, muestra de fábrica sin teñir: canalé vertical de paso ancho. |
| **PROVISIONAL · NO SIRVE PARA EL RECOLOREO** | `napoli.jpg` | Texturizado | 1280 px | Macrofotografía del texturizado Napoli, muestra de fábrica sin teñir, con el acanalado del punto en sentido vertical. |
| **FALTA** | `napoli-open.jpg` | Texturizado | 1280 px | Tela Napoli Open de texturizado, detalle del tejido. |
| **PROVISIONAL · NO SIRVE PARA EL RECOLOREO** | `ribb-150.jpg` | Texturizado | 1280 px | Macrofotografía del texturizado Ribb 150, muestra de fábrica sin teñir: canalé elástico de rib, característico de cuellos y puños. |
| **PROVISIONAL · NO SIRVE PARA EL RECOLOREO** | `river.jpg` | Texturizado | 1280 px | Macrofotografía del texturizado River, muestra de fábrica sin teñir, con la estructura del punto visible al trasluz. |
| **FALTA** | `buff-romina-30.jpg` | Spun | 1280 px | Tela Buff Romina 30 de spun, detalle del tejido. |
| **FALTA** | `buff-romina-rev-30.jpg` | Spun | 1280 px | Tela Buff Romina Rev 30 de spun, detalle del tejido. |
| **PROVISIONAL · NO SIRVE PARA EL RECOLOREO** | `interlock-30.jpg` | Spun | 1280 px | Tela Interlock 30 de spun en blanco, mostrando la caída del género y su doble cara lisa. |
| **PROVISIONAL · NO SIRVE PARA EL RECOLOREO** | `interlock-40.jpg` | Spun | 1280 px | Macrofotografía del Interlock 40 de spun, muestra de fábrica sin teñir: doble punto liso por ambas caras. |
| **FALTA** | `interlock-plus-30.jpg` | Spun | 1280 px | Tela Interlock Plus 30 de spun, detalle del tejido. |
| **FALTA** | `ribb-20.jpg` | Spun | 1280 px | Tela Ribb 20 de spun, detalle del tejido. |
| **FALTA** | `ribb-30.jpg` | Spun | 1280 px | Tela Ribb 30 de spun, detalle del tejido. |
| **FALTA** | `ribb-40.jpg` | Spun | 1280 px | Tela Ribb 40 de spun, detalle del tejido. |
| **FALTA** | `amelia-24.jpg` | Polialgodón | 1280 px | Tela Amelia 24 de polialgodón, detalle del tejido. |
| **FALTA** | `australia-18.jpg` | Polialgodón | 1280 px | Tela Australia 18 de polialgodón, detalle del tejido. |
| **FALTA** | `austria-premium-18.jpg` | Polialgodón | 1280 px | Tela Austria Premium 18 de polialgodón, detalle del tejido. |
| **FALTA** | `balboa-24.jpg` | Polialgodón | 1280 px | Tela Balboa 24 de polialgodón, detalle del tejido. |
| **FALTA** | `cuellos-20-24.jpg` | Polialgodón | 1280 px | Tela Cuellos 20/24 de polialgodón, detalle del tejido. |
| **PROVISIONAL · NO SIRVE PARA EL RECOLOREO** | `denis-20.jpg` | Polialgodón | 1280 px | Macrofotografía del poli-algodón Denis 20, muestra de fábrica sin teñir, de punto liso y tacto de peinado. |
| **PROVISIONAL · NO SIRVE PARA EL RECOLOREO** | `lacoast-20.jpg` | Polialgodón | 1280 px | Macrofotografía del poli-algodón Lacoast 20, muestra de fábrica sin teñir, con las celdas de panal del piqué bien marcadas. |
| **PROVISIONAL · NO SIRVE PARA EL RECOLOREO** | `lacoast-kratos-22.jpg` | Polialgodón | 1280 px | Macrofotografía del poli-algodón Lacoast Kratos 22 en color marengo, con el hilo jaspeado visible en la trama. |
| **PROVISIONAL · NO SIRVE PARA EL RECOLOREO** | `lacoast-polo-20.jpg` | Polialgodón | 1280 px | Macrofotografía del poli-algodón Lacoast Polo 20, muestra de fábrica sin teñir: piqué de celda romboidal para polos. |
| **FALTA** | `melisa-24.jpg` | Polialgodón | 1280 px | Tela Melisa 24 de polialgodón, detalle del tejido. |
| **PROVISIONAL · NO SIRVE PARA EL RECOLOREO** | `pique-ares-24.jpg` | Polialgodón | 1280 px | Macrofotografía del poli-algodón Pique Ares 24, muestra de fábrica sin teñir, con el relieve regular del piqué. |
| **FALTA** | `punos-20-24.jpg` | Polialgodón | 1280 px | Tela Puños 20/24 de polialgodón, detalle del tejido. |
| **FALTA** | `ribb-18.jpg` | Polialgodón | 1280 px | Tela Ribb 18 de polialgodón, detalle del tejido. |
| **FALTA** | `ribb-20-24.jpg` | Polialgodón | 1280 px | Tela Ribb 20/24 de polialgodón, detalle del tejido. |

#### Hay foto, pero no sirve para el recoloreo — 20

Hay que **volver a fotografiar** estas telas: lo que falla es la toma, y ninguno de estos defectos se corrige procesando el archivo.

`aston-plus.jpg` —
> **⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.** La toma no cumple lo que la simulación de color necesita, y eso no se arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. Original ya desaturado —croma no verificable— y además k normalizada 0,401, por debajo de 0,50: ni estirada llega a la mitad del recorrido.

`boston.jpg` —
> **⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.** La toma no cumple lo que la simulación de color necesita, y eso no se arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. Original ya desaturado —croma no verificable— y además k normalizada 0,428, por debajo de 0,50: ni estirada llega a la mitad del recorrido.

`dortmund.jpg` —
> **⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.** La toma no cumple lo que la simulación de color necesita, y eso no se arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. Croma 10,3, justo sobre el techo de 10. Poco, pero es dominante real: el original es a color y el tinte multiplicaría al del chip.

`juventus.jpg` —
> **⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.** La toma no cumple lo que la simulación de color necesita, y eso no se arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. Original ya desaturado —croma no verificable— y además k normalizada 0,417, por debajo de 0,50: ni estirada llega a la mitad del recorrido.

`kansas.jpg` —
> **⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.** La toma no cumple lo que la simulación de color necesita, y eso no se arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. Original ya desaturado —croma no verificable— y además k normalizada 0,381, por debajo de 0,50: ni estirada llega a la mitad del recorrido.

`sevilla-plus.jpg` —
> **⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.** La toma no cumple lo que la simulación de color necesita, y eso no se arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. 4.116 píxeles quemados, un 0,251% del cuadro sobre un techo de 0,05%. El preprocesado lleva el máximo a 250, y donde el original ya está en 255 no queda información que levantar.

`gaby.jpg` —
> **⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.** La toma no cumple lo que la simulación de color necesita, y eso no se arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. Original ya desaturado —croma no verificable— y además k normalizada 0,307, por debajo de 0,50: ni estirada llega a la mitad del recorrido.

`kiana.jpg` —
> **⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.** La toma no cumple lo que la simulación de color necesita, y eso no se arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. Original ya desaturado —croma no verificable— y además k normalizada 0,350, por debajo de 0,50: ni estirada llega a la mitad del recorrido.

`mezi.jpg` —
> **⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.** La toma no cumple lo que la simulación de color necesita, y eso no se arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. Subexpuesta: su máximo es 113 sobre 255, así que habría que estirar ×2,21 (techo ×1,35) y 113 niveles repartidos en 250 dan banding. Es tela NEGRA, y por eso pasa el croma con 2,1: el negro es neutro. El croma mide el tinte, no si la tela está teñida.

`napoles.jpg` —
> **⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.** La toma no cumple lo que la simulación de color necesita, y eso no se arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. Original ya desaturado —croma no verificable— y además k normalizada 0,364, por debajo de 0,50: ni estirada llega a la mitad del recorrido.

`napoli.jpg` —
> **⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.** La toma no cumple lo que la simulación de color necesita, y eso no se arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. Original ya desaturado —croma no verificable— y además k normalizada 0,372, por debajo de 0,50: ni estirada llega a la mitad del recorrido.

`ribb-150.jpg` —
> **⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.** La toma no cumple lo que la simulación de color necesita, y eso no se arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. Original ya desaturado —croma no verificable— y además k normalizada 0,325, por debajo de 0,50: ni estirada llega a la mitad del recorrido.

`river.jpg` —
> **⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.** La toma no cumple lo que la simulación de color necesita, y eso no se arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. Original ya desaturado —croma no verificable— y además k normalizada 0,347, por debajo de 0,50: ni estirada llega a la mitad del recorrido.

`interlock-30.jpg` —
> **⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.** La toma no cumple lo que la simulación de color necesita, y eso no se arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. Croma 18,7, casi el doble del techo de 10 — y eso que la tela se llama «Blanco Frozen»: la dominante la trae la luz, no el género.

`interlock-40.jpg` —
> **⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.** La toma no cumple lo que la simulación de color necesita, y eso no se arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. Original ya desaturado —croma no verificable— y además k normalizada 0,383, por debajo de 0,50: ni estirada llega a la mitad del recorrido.

`denis-20.jpg` —
> **⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.** La toma no cumple lo que la simulación de color necesita, y eso no se arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. Original ya desaturado —croma no verificable— y además k normalizada 0,377, por debajo de 0,50: ni estirada llega a la mitad del recorrido.

`lacoast-20.jpg` —
> **⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.** La toma no cumple lo que la simulación de color necesita, y eso no se arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. Original ya desaturado —croma no verificable— y además k normalizada 0,277, por debajo de 0,50: ni estirada llega a la mitad del recorrido.

`lacoast-kratos-22.jpg` —
> **⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.** La toma no cumple lo que la simulación de color necesita, y eso no se arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. Original ya desaturado —croma no verificable— y además k normalizada 0,076, por debajo de 0,50: ni estirada llega a la mitad del recorrido.

`lacoast-polo-20.jpg` —
> **⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.** La toma no cumple lo que la simulación de color necesita, y eso no se arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. Original ya desaturado —croma no verificable— y además k normalizada 0,312, por debajo de 0,50: ni estirada llega a la mitad del recorrido.

`pique-ares-24.jpg` —
> **⚠ HAY FOTO, PERO NO SIRVE PARA EL RECOLOREO.** La toma no cumple lo que la simulación de color necesita, y eso no se arregla procesando: HAY QUE VOLVER A FOTOGRAFIAR la tela. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. Original ya desaturado —croma no verificable— y además k normalizada 0,351, por debajo de 0,50: ni estirada llega a la mitad del recorrido.

#### Hay foto, y no se puede verificar — 4

**No hay que repetir la sesión.** Lo publicado se ve bien; lo que falta es el ORIGINAL A COLOR de esa misma toma, porque el archivo que tenemos llegó ya en blanco y negro y sobre él no se puede comprobar si la tela era cruda. Es buscar un archivo, no montar una sesión.

`dobleface-plus.jpg` —
> **⚠ HAY FOTO, Y NO SE PUEDE VERIFICAR.** La foto que se ve puede estar bien; lo que falta es poder comprobarla. NO hay que repetir la sesión: se pide el ORIGINAL A COLOR de esa misma toma, que es el único que permite medir si la tela era cruda. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. El original tiene los tres canales idénticos píxel a píxel, o sea que ya venía desaturado, así que su croma 0,0 no demuestra que la tela fuera cruda: demuestra que ya no se puede saber. Por lo demás, K 0,552 · sin quemados · sin estirar.

`dortmund-plus-brillante.jpg` —
> **⚠ HAY FOTO, Y NO SE PUEDE VERIFICAR.** La foto que se ve puede estar bien; lo que falta es poder comprobarla. NO hay que repetir la sesión: se pide el ORIGINAL A COLOR de esa misma toma, que es el único que permite medir si la tela era cruda. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. El original tiene los tres canales idénticos píxel a píxel, o sea que ya venía desaturado, así que su croma 0,0 no demuestra que la tela fuera cruda: demuestra que ya no se puede saber. Por lo demás, K 0,566 · sin quemados · sin estirar.

`sevilla.jpg` —
> **⚠ HAY FOTO, Y NO SE PUEDE VERIFICAR.** La foto que se ve puede estar bien; lo que falta es poder comprobarla. NO hay que repetir la sesión: se pide el ORIGINAL A COLOR de esa misma toma, que es el único que permite medir si la tela era cruda. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. El original tiene los tres canales idénticos píxel a píxel, o sea que ya venía desaturado, así que su croma 0,0 no demuestra que la tela fuera cruda: demuestra que ya no se puede saber. Por lo demás, K 0,513 · sin quemados · sin estirar.

`sevilla-plus-brillante.jpg` —
> **⚠ HAY FOTO, Y NO SE PUEDE VERIFICAR.** La foto que se ve puede estar bien; lo que falta es poder comprobarla. NO hay que repetir la sesión: se pide el ORIGINAL A COLOR de esa misma toma, que es el único que permite medir si la tela era cruda. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. El original tiene los tres canales idénticos píxel a píxel, o sea que ya venía desaturado, así que su croma 0,0 no demuestra que la tela fuera cruda: demuestra que ya no se puede saber. Por lo demás, K 0,702 · 60 píxeles quemados (0,007%) · sin estirar.

**Ya resueltas — 3.** No se piden.

- `athletic.jpg` — Microfibra
- `chelsea.jpg` — Microfibra
- `titanium.jpg` — Microfibra

> Clasificadas según el origen del slot: salen de `SLOTS_TELA`, que se deriva de las subcategorías de `taxonomy.ts`, con nota común.

---

## Segunda vista de tela — el género en caída — 28 fotos

La segunda foto de la galería de cada tela: el mismo género drapeado, para que se vea el peso y la caída. Con ella la galería de la ficha se activa.

- **Se ve a:** mismo marco que la principal, hasta ~860 px de ancho (`MacroLupa`)
- **Proporción:** 4:3 apaisada — el marco de la galería es `aspect-4/3`
- **Estado:** 28 faltan · 0 provisionales · 1 definitiva

**Qué se necesita, igual para todas:** Segunda foto de la galería, la que activa el visor: el género drapeado o en caída, NO el macro plano del tejido (esa es la foto principal). Fondo neutro, apaisada (4:3) como el resto de la galería.

| Estado | Archivo a entregar | Dónde va | Ancho mín. | Qué debe verse |
|---|---|---|---|---|
| **FALTA** | `aston-plus-caida.jpg` | Microfibra | 1280 px | Tela Aston Plus de microfibra, el género en caída mostrando peso y drapeado. |
| **FALTA** | `athletic-caida.jpg` | Microfibra | 1280 px | Tela Athletic de microfibra, el género en caída mostrando peso y drapeado. |
| **FALTA** | `boston-caida.jpg` | Microfibra | 1280 px | Tela Boston de microfibra, el género en caída mostrando peso y drapeado. |
| **FALTA** | `boston-plus-caida.jpg` | Microfibra | 1280 px | Tela Boston Plus de microfibra, el género en caída mostrando peso y drapeado. |
| **FALTA** | `chelsea-caida.jpg` | Microfibra | 1280 px | Tela Chelsea de microfibra, el género en caída mostrando peso y drapeado. |
| **FALTA** | `chelsea-plus-caida.jpg` | Microfibra | 1280 px | Tela Chelsea Plus de microfibra, el género en caída mostrando peso y drapeado. |
| **FALTA** | `dobleface-plus-caida.jpg` | Microfibra | 1280 px | Tela Dobleface Plus de microfibra, el género en caída mostrando peso y drapeado. |
| **FALTA** | `dortmund-caida.jpg` | Microfibra | 1280 px | Tela Dortmund de microfibra, el género en caída mostrando peso y drapeado. |
| **FALTA** | `dortmund-plus-caida.jpg` | Microfibra | 1280 px | Tela Dortmund Plus de microfibra, el género en caída mostrando peso y drapeado. |
| **FALTA** | `juventus-caida.jpg` | Microfibra | 1280 px | Tela Juventus de microfibra, el género en caída mostrando peso y drapeado. |
| **FALTA** | `kansas-caida.jpg` | Microfibra | 1280 px | Tela Kansas de microfibra, el género en caída mostrando peso y drapeado. |
| **FALTA** | `sevilla-caida.jpg` | Microfibra | 1280 px | Tela Sevilla de microfibra, el género en caída mostrando peso y drapeado. |
| **FALTA** | `sevilla-plus-caida.jpg` | Microfibra | 1280 px | Tela Sevilla Plus de microfibra, el género en caída mostrando peso y drapeado. |
| **FALTA** | `gaby-caida.jpg` | Texturizado | 1280 px | Tela Gaby de texturizado, el género en caída mostrando peso y drapeado. |
| **FALTA** | `kiana-caida.jpg` | Texturizado | 1280 px | Tela Kiana de texturizado, el género en caída mostrando peso y drapeado. |
| **FALTA** | `mezi-caida.jpg` | Texturizado | 1280 px | Tela Mezi de texturizado, el género en caída mostrando peso y drapeado. |
| **FALTA** | `napoles-caida.jpg` | Texturizado | 1280 px | Tela Napoles de texturizado, el género en caída mostrando peso y drapeado. |
| **FALTA** | `napoli-caida.jpg` | Texturizado | 1280 px | Tela Napoli de texturizado, el género en caída mostrando peso y drapeado. |
| **FALTA** | `ribb-150-caida.jpg` | Texturizado | 1280 px | Tela Ribb 150 de texturizado, el género en caída mostrando peso y drapeado. |
| **FALTA** | `river-caida.jpg` | Texturizado | 1280 px | Tela River de texturizado, el género en caída mostrando peso y drapeado. |
| **FALTA** | `buff-romina-30-caida.jpg` | Spun | 1280 px | Tela Buff Romina 30 de spun, el género en caída mostrando peso y drapeado. |
| **FALTA** | `interlock-30-caida.jpg` | Spun | 1280 px | Tela Interlock 30 de spun, el género en caída mostrando peso y drapeado. |
| **FALTA** | `austria-premium-18-caida.jpg` | Polialgodón | 1280 px | Tela Austria Premium 18 de polialgodón, el género en caída mostrando peso y drapeado. |
| **FALTA** | `denis-20-caida.jpg` | Polialgodón | 1280 px | Tela Denis 20 de polialgodón, el género en caída mostrando peso y drapeado. |
| **FALTA** | `lacoast-20-caida.jpg` | Polialgodón | 1280 px | Tela Lacoast 20 de polialgodón, el género en caída mostrando peso y drapeado. |
| **FALTA** | `lacoast-kratos-22-caida.jpg` | Polialgodón | 1280 px | Tela Lacoast Kratos 22 de polialgodón, el género en caída mostrando peso y drapeado. |
| **FALTA** | `lacoast-polo-20-caida.jpg` | Polialgodón | 1280 px | Tela Lacoast Polo 20 de polialgodón, el género en caída mostrando peso y drapeado. |
| **FALTA** | `pique-ares-24-caida.jpg` | Polialgodón | 1280 px | Tela Pique Ares 24 de polialgodón, el género en caída mostrando peso y drapeado. |

**Ya resueltas — 1.** No se piden.

- `titanium-caida.jpg` — Microfibra

> Clasificadas según el origen del slot: salen de `SLOTS_GALERIA_TELA`, con nota común.

---

## Card de familia de tela — 4 fotos

Las cuatro cards de la rejilla «Familias de tela». Una foto por familia, que se ve en la portada, en /productos y en el styleguide — cuatro archivos, no doce.

- **Se ve a:** ~310 × 300 px en la rejilla de cuatro columnas (`CategoryCard`)
- **Proporción:** casi cuadrada; se recorta a la card con `object-cover`
- **Estado:** 4 faltan · 0 provisionales · 0 definitivas

#### **FALTA** `familia-microfibra`

- **Nombre del archivo a entregar:** `familia-microfibra.jpg`
- **Dónde va:** Inicio (`/`) · Familias de tela
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Rollos de microfibra alineados en bodega, con el brillo característico del poliéster ligero.
- **Nota:** Card de tres tamaños según la ventana: 550 × 300 px apilada (el caso más grande, hasta 639 px), 428 × 300 a dos columnas y ~290 × 300 a cuatro columnas en la portada. Lleva encima un velo que baja hasta rgba(9,20,25,0.78) en el borde inferior, y sobre esa franja van el título y la descripción: la foto tiene que aguantar oscurecerse abajo y no llevar detalle importante ahí. (En las cabeceras hay que despejar el tercio izquierdo; aquí es la parte de abajo.) Al pasar el cursor se acerca un 10%, así que el encuadre no puede depender de lo que hay justo en el borde. El mismo archivo se usa en la rejilla de /productos y en el styleguide: es un solo hueco, no tres.

#### **FALTA** `familia-polialgodon`

- **Nombre del archivo a entregar:** `familia-polialgodon.jpg`
- **Dónde va:** Inicio (`/`) · Familias de tela
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela de mezcla poliéster-algodón en plano abierto, con la trama del tejido visible.
- **Nota:** Card de tres tamaños según la ventana: 550 × 300 px apilada (el caso más grande, hasta 639 px), 428 × 300 a dos columnas y ~290 × 300 a cuatro columnas en la portada. Lleva encima un velo que baja hasta rgba(9,20,25,0.78) en el borde inferior, y sobre esa franja van el título y la descripción: la foto tiene que aguantar oscurecerse abajo y no llevar detalle importante ahí. (En las cabeceras hay que despejar el tercio izquierdo; aquí es la parte de abajo.) Al pasar el cursor se acerca un 10%, así que el encuadre no puede depender de lo que hay justo en el borde. El mismo archivo se usa en la rejilla de /productos y en el styleguide: es un solo hueco, no tres.

#### **FALTA** `familia-spun`

- **Nombre del archivo a entregar:** `familia-spun.jpg`
- **Dónde va:** Inicio (`/`) · Familias de tela
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tela de hilado spun en plano abierto, de superficie mate y aspecto algodonoso.
- **Nota:** Card de tres tamaños según la ventana: 550 × 300 px apilada (el caso más grande, hasta 639 px), 428 × 300 a dos columnas y ~290 × 300 a cuatro columnas en la portada. Lleva encima un velo que baja hasta rgba(9,20,25,0.78) en el borde inferior, y sobre esa franja van el título y la descripción: la foto tiene que aguantar oscurecerse abajo y no llevar detalle importante ahí. (En las cabeceras hay que despejar el tercio izquierdo; aquí es la parte de abajo.) Al pasar el cursor se acerca un 10%, así que el encuadre no puede depender de lo que hay justo en el borde. El mismo archivo se usa en la rejilla de /productos y en el styleguide: es un solo hueco, no tres.

#### **FALTA** `familia-texturizado`

- **Nombre del archivo a entregar:** `familia-texturizado.jpg`
- **Dónde va:** Inicio (`/`) · Familias de tela
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Tejido texturizado en plano abierto, con el cuerpo y el relieve del hilo a la vista.
- **Nota:** Card de tres tamaños según la ventana: 550 × 300 px apilada (el caso más grande, hasta 639 px), 428 × 300 a dos columnas y ~290 × 300 a cuatro columnas en la portada. Lleva encima un velo que baja hasta rgba(9,20,25,0.78) en el borde inferior, y sobre esa franja van el título y la descripción: la foto tiene que aguantar oscurecerse abajo y no llevar detalle importante ahí. (En las cabeceras hay que despejar el tercio izquierdo; aquí es la parte de abajo.) Al pasar el cursor se acerca un 10%, así que el encuadre no puede depender de lo que hay justo en el borde. El mismo archivo se usa en la rejilla de /productos y en el styleguide: es un solo hueco, no tres.

> Clasificadas según el origen del slot: prefijo `familia-`, con nota propia.

---

## Cabecera de página — 8 fotos

El fondo fotográfico a sangre de la banda oscura de cabecera. Mientras falte, la cabecera se queda en tinta plana.

- **Se ve a:** a sangre, 100% del ancho × 70vh (`FondoHero`)
- **Proporción:** muy apaisada; se recorta a 70vh
- **Estado:** 1 falta · 7 provisionales · 0 definitivas

#### **PROVISIONAL · PENDIENTE DE CLASIFICAR** `hero-home-poster`

- **Nombre del archivo a entregar:** `hero-home-poster.jpg`
- **Dónde va:** Inicio (`/`) · Cabecera
- **Ancho mínimo de entrega:** 1920 px
- **Qué debe verse:** —
- **Nota:** Cabecera de / (la portada). Mientras no haya vídeo procesado se ve ella sola, a sangre. Cuando corras `npm run video` pasa a ser el póster del bucle —lo que se ve mientras carga, si el navegador no reproduce, y con prefers-reduced-motion— y conviene que se parezca al primer fotograma o el salto se nota. Mismos requisitos que los demás heroes: tono bajo, sin detalle en el tercio izquierdo.

> **⚠ PENDIENTE DE CLASIFICAR.** NO CONSTA de dónde salió: hay que mirarla antes de decidir. Según: Entró en 8e485c6, al arreglar el póster de la portada. El commit explica por qué no se veía, no de dónde sale el archivo.

#### **PROVISIONAL** `hero-empresa`

- **Nombre del archivo a entregar:** `hero-empresa.jpg`
- **Dónde va:** Empresa (`/empresa`) · Cabecera
- **Ancho mínimo de entrega:** 2400 px
- **Qué debe verse:** Planta de Textil Padilla en Alangasí: vista general de la nave de producción.
- **Nota:** Cabecera de /empresa, a sangre. Tono bajo, sin detalle en el tercio izquierdo (ahí va el titular). Muy apaisada: se recorta a 70vh.

> **⚠ HAY FOTO, PERO ES PROVISIONAL.** Puesta solo para maquetar o valorar el tratamiento. Según: Lo dice el commit que la subió (b1e2e42): «entra como muestra para poder valorarlo; es la misma foto que ya sale más abajo en esa página, así que no es definitiva».

#### **PROVISIONAL** `hero-productos`

- **Nombre del archivo a entregar:** `hero-productos.jpg`
- **Dónde va:** Productos (`/productos`) · Cabecera
- **Ancho mínimo de entrega:** 2400 px
- **Qué debe verse:** Rollos de tela de distintos colores alineados en la bodega de producto terminado.
- **Nota:** Cabecera de /productos, a sangre. Tono bajo, sin detalle en el tercio izquierdo (ahí va el titular). Muy apaisada: se recorta a 70vh.

> **⚠ HAY FOTO, PERO ES PROVISIONAL.** Puesta solo para maquetar o valorar el tratamiento. Según: Los cuatro archivos son BYTE A BYTE el mismo (md5 56e355a4…), y el `alt` de cada slot describe una escena distinta: una sola imagen no puede ser a la vez el mostrador, los rollos, las camisetas y el asesor. Está puesta para poder maquetar la banda de cabecera.

#### **PROVISIONAL · PENDIENTE DE CLASIFICAR** `hero-microfibra`

- **Nombre del archivo a entregar:** `hero-microfibra.jpg`
- **Dónde va:** Microfibra (`/productos/microfibra`) · Cabecera
- **Ancho mínimo de entrega:** 2400 px
- **Qué debe verse:** Tejido de microfibra saliendo de la máquina de tejido circular.
- **Nota:** Cabecera de /productos/microfibra, a sangre. Tono bajo, sin detalle en el tercio izquierdo (ahí va el titular). Muy apaisada: se recorta a 70vh.

> **⚠ PENDIENTE DE CLASIFICAR.** NO CONSTA de dónde salió: hay que mirarla antes de decidir. Según: Archivo propio, no duplicado de los otros heroes. Entró en 55ffae7 —el commit del mapa de Contacto— mencionada de pasada y sin decir de dónde sale. No consta el origen.

#### **FALTA** `hero-dortmund-plus`

- **Nombre del archivo a entregar:** `hero-dortmund-plus.jpg`
- **Dónde va:** Dortmund Plus (`/productos/microfibra/dortmund-plus`) · Cabecera
- **Ancho mínimo de entrega:** 2400 px
- **Qué debe verse:** Rollo de Dortmund Plus en la nave de producción.
- **Nota:** Cabecera de /productos/microfibra/dortmund-plus, a sangre. Tono bajo, sin detalle en el tercio izquierdo (ahí va el titular). Muy apaisada: se recorta a 70vh.

#### **PROVISIONAL** `hero-camisetas`

- **Nombre del archivo a entregar:** `hero-camisetas.jpg`
- **Dónde va:** Camisetas (`/productos/camisetas`) · Cabecera
- **Ancho mínimo de entrega:** 2400 px
- **Qué debe verse:** Camisetas deportivas terminadas, confeccionadas con telas de Textil Padilla.
- **Nota:** Cabecera de /productos/camisetas, a sangre. Tono bajo, sin detalle en el tercio izquierdo (ahí va el titular). Muy apaisada: se recorta a 70vh.

> **⚠ HAY FOTO, PERO ES PROVISIONAL.** Puesta solo para maquetar o valorar el tratamiento. Según: Los cuatro archivos son BYTE A BYTE el mismo (md5 56e355a4…), y el `alt` de cada slot describe una escena distinta: una sola imagen no puede ser a la vez el mostrador, los rollos, las camisetas y el asesor. Está puesta para poder maquetar la banda de cabecera.

#### **PROVISIONAL** `hero-asesor-virtual`

- **Nombre del archivo a entregar:** `hero-asesor-virtual.jpg`
- **Dónde va:** Asesor Virtual (`/asesor-virtual`) · Cabecera
- **Ancho mínimo de entrega:** 2400 px
- **Qué debe verse:** Asesor de Textil Padilla revisando muestras de tela con un cliente.
- **Nota:** Cabecera de /asesor-virtual, a sangre. Tono bajo, sin detalle en el tercio izquierdo (ahí va el titular). Muy apaisada: se recorta a 70vh.

> **⚠ HAY FOTO, PERO ES PROVISIONAL.** Puesta solo para maquetar o valorar el tratamiento. Según: Los cuatro archivos son BYTE A BYTE el mismo (md5 56e355a4…), y el `alt` de cada slot describe una escena distinta: una sola imagen no puede ser a la vez el mostrador, los rollos, las camisetas y el asesor. Está puesta para poder maquetar la banda de cabecera.

#### **PROVISIONAL** `hero-contacto`

- **Nombre del archivo a entregar:** `hero-contacto.jpg`
- **Dónde va:** Contacto (`/contacto`) · Cabecera
- **Ancho mínimo de entrega:** 2400 px
- **Qué debe verse:** Mostrador de atención de Textil Padilla, con muestrarios de tela sobre la mesa.
- **Nota:** Cabecera de /contacto, a sangre. Tono bajo, sin detalle en el tercio izquierdo (ahí va el titular). Muy apaisada: se recorta a 70vh.

> **⚠ HAY FOTO, PERO ES PROVISIONAL.** Puesta solo para maquetar o valorar el tratamiento. Según: Los cuatro archivos son BYTE A BYTE el mismo (md5 56e355a4…), y el `alt` de cada slot describe una escena distinta: una sola imagen no puede ser a la vez el mostrador, los rollos, las camisetas y el asesor. Está puesta para poder maquetar la banda de cabecera.

> Clasificadas según el origen del slot: prefijo `hero-`, con nota propia.

---

## Industrial / proceso — 2 fotos

La planta trabajando. Son las que sostienen los argumentos de la página de Empresa — el teñido a demanda no se afirma, se enseña.

- **Se ve a:** media columna del bloque de Oficio, hasta ~620 px de ancho (`empresa/page.tsx`)
- **Proporción:** 4:3 apaisada
- **Estado:** 2 faltan · 0 provisionales · 2 definitivas

#### **FALTA** `oficio-carta-color`

- **Nombre del archivo a entregar:** `oficio-carta-color.jpg`
- **Dónde va:** Empresa (`/empresa`) · Oficio
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Carta de color de Textil Padilla: muestras de tela teñidas ordenadas por tono.
- **Nota:** Muestrario físico de colores. Apaisada (4:3).

#### **FALTA** `oficio-tintoreria`

- **Nombre del archivo a entregar:** `oficio-tintoreria.jpg`
- **Dónde va:** Empresa (`/empresa`) · Oficio
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Tintorería de Textil Padilla: barcas de teñido en proceso.
- **Nota:** Área de tintorería en marcha. Apaisada (4:3). Es la que sostiene el argumento del teñido a demanda.

**Ya resueltas — 2.** No se piden.

- `oficio-nave-tejido.jpg` — Empresa
- `oficio-taller-alangasi.jpg` — Empresa

> Clasificadas según la sección del slot: «Oficio», con nota propia.

---

## Encuentros de la portada — 4 fotos

Las cuatro tarjetas del carrusel de encuentros. Van en la portada presentadas como cosas que la empresa hizo, así que aquí no vale material genérico: cada una tiene que ser ese encuentro y no uno parecido.

- **Se ve a:** media anchura del carrusel, ~600 px (`EventCarousel`)
- **Proporción:** 4:3 apaisada — el marco es `aspect-4/3`
- **Estado:** 4 faltan · 0 provisionales · 0 definitivas

#### **FALTA** `evento-alianza-retail`

- **Nombre del archivo a entregar:** `evento-alianza-retail.jpg`
- **Dónde va:** Inicio (`/`) · Encuentros
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Rollos de tela preparados para un cliente de retail premium.
- **Nota:** Apaisada (4:3), a media anchura del carrusel de encuentros (~600 px). Documental: material y gente reales, sin posado de estudio ni rótulos quemados. La portada lo presenta como un hecho de la empresa, así que no admite imagen generada ni de banco (ver README-imagenes.md §5). Rollos etiquetados y preparados para despacho, en bodega. Sin marcas ni logotipos de terceros identificables: al cliente no se le nombra.

> **⚠ POR CONFIRMAR ANTES DE DISPARAR.** El id anuncia una ALIANZA y la nota describe un DESPACHO, que no es lo mismo. Antes de disparar hay que confirmar qué ocurrió de verdad en este encuentro: si la foto no comunica el acuerdo, el titular de la tarjeta dirá una cosa y la imagen otra. La nota está escrita con lo que hay hoy, que es el alt; si el evento resulta ser otra cosa, se reescribe aquí antes de la sesión.

#### **FALTA** `evento-feria-andina`

- **Nombre del archivo a entregar:** `evento-feria-andina.jpg`
- **Dónde va:** Inicio (`/`) · Encuentros
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Stand de Textil Padilla en la Feria Internacional del Textil Andino, con muestrario de telas.
- **Nota:** Apaisada (4:3), a media anchura del carrusel de encuentros (~600 px). Documental: material y gente reales, sin posado de estudio ni rótulos quemados. La portada lo presenta como un hecho de la empresa, así que no admite imagen generada ni de banco (ver README-imagenes.md §5). El stand en el recinto, con gente delante: se tiene que leer que es una feria y no una bodega. Luz de recinto, sin flash directo.

#### **FALTA** `evento-jornada-color`

- **Nombre del archivo a entregar:** `evento-jornada-color.jpg`
- **Dónde va:** Inicio (`/`) · Encuentros
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Jornada de color a demanda: cliente comparando su referencia contra una carta de color.
- **Nota:** Apaisada (4:3), a media anchura del carrusel de encuentros (~600 px). Documental: material y gente reales, sin posado de estudio ni rótulos quemados. La portada lo presenta como un hecho de la empresa, así que no admite imagen generada ni de banco (ver README-imagenes.md §5). Plano medio de las manos, la carta de color y la muestra del cliente sobre la mesa. La carta tiene que salir legible y en luz neutra: es lo que sostiene el argumento del teñido a demanda, y una carta con dominante no se puede enseñar.

#### **FALTA** `evento-performknit-320`

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
- **Estado:** 3 faltan · 0 provisionales · 0 definitivas

#### **FALTA** `prenda-camiseta`

- **Nombre del archivo a entregar:** `prenda-camiseta.jpg`
- **Dónde va:** Productos (`/productos`) · Recomendador
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Camiseta confeccionada en jersey de algodón peinado, mostrando la caída del punto.
- **Nota:** Apaisada (4:3) a media anchura del recomendador (~600 px), pero la MISMA foto se recorta a un cuadrado de 64 px (72 desde tablet) en las opciones del asesor virtual: la prenda tiene que quedar centrada y seguir reconociéndose dentro de ese cuadrado central. Prenda sola sobre fondo neutro, sin modelo y sin degradado de estudio. Camiseta lisa de frente, colgada o doblada de forma que se lea la caída del punto.

#### **FALTA** `prenda-chompa`

- **Nombre del archivo a entregar:** `prenda-chompa.jpg`
- **Dónde va:** Productos (`/productos`) · Recomendador
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Chompa en French Terry perchado, con el reverso afelpado a la vista.
- **Nota:** Apaisada (4:3) a media anchura del recomendador (~600 px), pero la MISMA foto se recorta a un cuadrado de 64 px (72 desde tablet) en las opciones del asesor virtual: la prenda tiene que quedar centrada y seguir reconociéndose dentro de ese cuadrado central. Prenda sola sobre fondo neutro, sin modelo y sin degradado de estudio. Chompa entera y centrada, de frente. El reverso afelpado a la vista es DESEABLE, no obligatorio: si compite con el encuadre, manda que la prenda se reconozca en el cuadrado de 64 px. Que el perchado asome en un puño o en el dobladillo, con la prenda dominando el cuadro; un detalle de perchado que ocupe el centro se pierde como chompa, y en una esquina se pierde al recortar.

#### **FALTA** `prenda-pantalon`

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
- **Estado:** 9 faltan · 0 provisionales · 0 definitivas

**Qué se necesita, igual para todas:** Opcional: la línea de hitos funciona sin fotos. Formato 4:3.

| Estado | Archivo a entregar | Dónde va | Ancho mín. | Qué debe verse |
|---|---|---|---|---|
| **FALTA** | `hito-fnd-01.jpg` | Empresa | 900 px | Textil Padilla, 1987 · Fundación en Alangasí. |
| **FALTA** | `hito-loc-01.jpg` | Empresa | 900 px | Textil Padilla, 1994 · Consolidación de la matriz. |
| **FALTA** | `hito-loc-02.jpg` | Empresa | 900 px | Textil Padilla, 2003 · Apertura de local · La Marín. |
| **FALTA** | `hito-loc-03.jpg` | Empresa | 900 px | Textil Padilla, 2008 · Apertura de local · Solanda. |
| **FALTA** | `hito-loc-04.jpg` | Empresa | 900 px | Textil Padilla, 2013 · Apertura de local · Sangolquí. |
| **FALTA** | `hito-loc-05.jpg` | Empresa | 900 px | Textil Padilla, 2017 · Apertura de local · Guayaquil. |
| **FALTA** | `hito-prd-01.jpg` | Empresa | 900 px | Textil Padilla, 1999 · Teñido a demanda. |
| **FALTA** | `hito-prd-02.jpg` | Empresa | 900 px | Textil Padilla, 2024 · Línea técnica PerformKnit. |
| **FALTA** | `hito-qlt-01.jpg` | Empresa | 900 px | Textil Padilla, 2021 · Protocolo de control por rollo. |

> Clasificadas según el origen del slot: salen de `SLOTS_HITOS`, con nota común.

---

## Miniaturas del cuestionario del asesor — 6 fotos

Miniaturas cuadradas pequeñas que acompañan a cada opción del asesor virtual. Acompañan a la opción, no la lideran.

- **Se ve a:** 64 px (72 px desde tablet), cuadrada (`AsesorWizard`)
- **Proporción:** 1:1
- **Estado:** 6 faltan · 0 provisionales · 0 definitivas

#### **FALTA** `asesor-prenda-otro`

- **Nombre del archivo a entregar:** `asesor-prenda-otro.jpg`
- **Dónde va:** Asesor Virtual (`/asesor-virtual`) · Opciones del cuestionario
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Retales y muestras de distintas telas sobre la mesa del asesor.
- **Nota:** Cuadrada (1:1). Opción «Otro»: bodegón de muestras variadas, sin una prenda concreta.

#### **FALTA** `asesor-sublimado-no`

- **Nombre del archivo a entregar:** `asesor-sublimado-no.jpg`
- **Dónde va:** Asesor Virtual (`/asesor-virtual`) · Opciones del cuestionario
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Tela en color liso teñido a demanda, sin estampado.
- **Nota:** Cuadrada (1:1). Tono sólido, sin estampado.

#### **FALTA** `asesor-sublimado-si`

- **Nombre del archivo a entregar:** `asesor-sublimado-si.jpg`
- **Dónde va:** Asesor Virtual (`/asesor-virtual`) · Opciones del cuestionario
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Prenda deportiva con estampado sublimado a todo color.
- **Nota:** Cuadrada (1:1). Base clara con full-print sublimado.

#### **FALTA** `asesor-uso-casual`

- **Nombre del archivo a entregar:** `asesor-uso-casual.jpg`
- **Dónde va:** Asesor Virtual (`/asesor-virtual`) · Opciones del cuestionario
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Prenda casual de uso diario, de caída suave.
- **Nota:** Cuadrada (1:1). Básico de retail, mano suave.

#### **FALTA** `asesor-uso-rendimiento`

- **Nombre del archivo a entregar:** `asesor-uso-rendimiento.jpg`
- **Dónde va:** Asesor Virtual (`/asesor-virtual`) · Opciones del cuestionario
- **Ancho mínimo de entrega:** 640 px
- **Qué debe verse:** Prenda deportiva de alto rendimiento en uso durante el gesto atlético.
- **Nota:** Cuadrada (1:1). Deporte de rendimiento, tela técnica.

#### **FALTA** `asesor-uso-uniforme`

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
- **Estado:** 3 faltan · 0 provisionales · 0 definitivas

#### **FALTA** `asesor-portada-prenda`

- **Nombre del archivo a entregar:** `asesor-portada-prenda.jpg`
- **Dónde va:** Inicio (`/`) · Asesor virtual
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Prendas deportivas en confección: camisetas y buzos que definen el punto de partida de la asesoría.
- **Nota:** Paso 01 (Prenda). Qué se va a producir: prenda deportiva terminada o en confección. Sin rótulos quemados. Formato flexible; se recorta a la caja del split.

#### **FALTA** `asesor-portada-sublimado`

- **Nombre del archivo a entregar:** `asesor-portada-sublimado.jpg`
- **Dónde va:** Inicio (`/`) · Asesor virtual
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Tela clara con estampado sublimado full-print, mostrando el color a sangre sobre la base.
- **Nota:** Paso 02 (Sublimado). Base clara con estampado full-print, o el contraste liso/sublimado. Formato flexible; se recorta a la caja del split.

#### **FALTA** `asesor-portada-uso`

- **Nombre del archivo a entregar:** `asesor-portada-uso.jpg`
- **Dónde va:** Inicio (`/`) · Asesor virtual
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Tela en uso deportivo, mostrando el rendimiento y la caída del género en movimiento.
- **Nota:** Paso 03 (Uso). El destino de la tela: alto rendimiento, casual o uniforme. Formato flexible; se recorta a la caja del split.

> Clasificadas según la sección del slot: «Asesor virtual», con nota propia.

---

## Huecos sueltos — 8 fotos

Tomas que no forman sesión con ninguna otra. Cada una pide una cosa distinta; la nota de cada slot es la especificación.

- **Se ve a:** ver cada hueco
- **Proporción:** ver cada hueco
- **Estado:** 5 faltan · 3 provisionales · 0 definitivas

#### **FALTA** `aplicacion-microfibra`

- **Nombre del archivo a entregar:** `aplicacion-microfibra.jpg`
- **Dónde va:** Microfibra (`/productos/microfibra`) · Ejemplo de aplicación
- **Se ve a:** columna del bloque de aplicación, hasta ~560 px (`productos/microfibra/page.tsx`)
- **Proporción:** 4:5 vertical
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Camiseta deportiva sobre pedestal, fondo oscuro — ejemplo de aplicación de la microfibra en confección.
- **Nota:** Demo: prenda deportiva sobre pedestal, fondo oscuro y neutro. Imagen generada para la maqueta, NO es producto de Textil Padilla. Se reemplazará por el objeto 3D. Vertical (4:5).

#### **PROVISIONAL · SIN VERIFICAR** `athletic-macro`

- **Nombre del archivo a entregar:** `athletic-macro.jpg`
- **Dónde va:** Microfibra (`/productos/microfibra`) · Galería · principal en alta
- **Ancho mínimo de entrega:** 2400 px
- **Qué debe verse:** Macrofotografía de la microfibra Athletic sin teñir: la malla de panal y los pliegues del género en luz rasante.
- **Nota:** Generado, no se entrega. Recorte 4:3 del original sobre la zona en foco.

> **⚠ HAY FOTO, Y NO SE PUEDE VERIFICAR.** La foto que se ve puede estar bien; lo que falta es poder comprobarla. NO hay que repetir la sesión: se pide el ORIGINAL A COLOR de esa misma toma, que es el único que permite medir si la tela era cruda. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. El original tiene los tres canales idénticos píxel a píxel, o sea que ya venía desaturado, así que su croma 0,0 no demuestra que la tela fuera cruda: demuestra que ya no se puede saber. Por lo demás, K 0,707, sin subexponer y sin zona quemada: LA FOTO EN USO ES ACEPTABLE y la ficha con lupa funciona con ella. Lo que se pide es el ORIGINAL A COLOR de `Microfibra/Athletic (3).jpeg`, para poder verificarla — no repetir la sesión. No se entrega un archivo nuevo: este slot lo genera el procesado recortando ese original (`ORIGEN_ALTA` en `preparar-imagenes.ts`), así que se rehace solo en cuanto llegue.

#### **PROVISIONAL · SIN VERIFICAR** `athletic-zoom`

- **Nombre del archivo a entregar:** `athletic-zoom.jpg`
- **Dónde va:** Microfibra (`/productos/microfibra`) · Galería · capa de lupa
- **Ancho mínimo de entrega:** 3000 px
- **Qué debe verse:** —
- **Nota:** Generado, no se entrega. Mismo recorte que athletic-macro, al ancho máximo que da el recorte sin escalar. Decorativo: la lupa lo monta con aria-hidden sobre la imagen que ya tiene alt.

> **⚠ HAY FOTO, Y NO SE PUEDE VERIFICAR.** La foto que se ve puede estar bien; lo que falta es poder comprobarla. NO hay que repetir la sesión: se pide el ORIGINAL A COLOR de esa misma toma, que es el único que permite medir si la tela era cruda. Según: Medido sobre el encuadre que se publica, con `npm run imagenes:medir`. El original tiene los tres canales idénticos píxel a píxel, o sea que ya venía desaturado, así que su croma 0,0 no demuestra que la tela fuera cruda: demuestra que ya no se puede saber. Por lo demás, K 0,708, mismo original y mismo recorte que `athletic-macro`: LA CAPA DE LA LUPA EN USO ES ACEPTABLE y lo que se pide es el ORIGINAL A COLOR para poder verificarla, no repetir la sesión. También lo genera el procesado, no se entrega.

#### **FALTA** `dortmund-plus-blancos-macro`

- **Nombre del archivo a entregar:** `dortmund-plus-blancos-macro.jpg`
- **Dónde va:** Dortmund Plus (`/productos/microfibra/dortmund-plus`)
- **Se ve a:** banda a todo el ancho del contenedor (`ProductGallery`)
- **Proporción:** 21:9, muy apaisada
- **Ancho mínimo de entrega:** 1920 px
- **Qué debe verse:** Macrofotografía de la microfibra Dortmund Plus en blanco, con la textura del punto a contraluz.
- **Nota:** Macro de textura, muy apaisada (21:9).

#### **PROVISIONAL · PENDIENTE DE CLASIFICAR** `dortmund-plus-cancha`

- **Nombre del archivo a entregar:** `dortmund-plus-cancha.jpg`
- **Dónde va:** Dortmund Plus (`/productos/microfibra/dortmund-plus`)
- **Ancho mínimo de entrega:** 1600 px
- **Qué debe verse:** Prenda deportiva confeccionada en Dortmund Plus, en uso durante un partido.
- **Nota:** Prenda hecha con la tela, en uso. Sin rótulos ni tipografía quemada.

> **⚠ PENDIENTE DE CLASIFICAR.** NO CONSTA de dónde salió: hay que mirarla antes de decidir. Según: Entró en d55790f, un commit sobre el marcado de las cabeceras vacías que no menciona su origen.

#### **FALTA** `camisetas-jersey`

- **Nombre del archivo a entregar:** `camisetas-jersey.jpg`
- **Dónde va:** Camisetas (`/productos/camisetas`)
- **Se ve a:** media columna, hasta ~620 px de ancho (`productos/camisetas/page.tsx`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Macrofotografía de jersey de algodón peinado, con el punto liso visible de cerca.
- **Nota:** Macro real de single jersey. Acompaña a la ficha de la tela 01.

#### **FALTA** `camisetas-pique`

- **Nombre del archivo a entregar:** `camisetas-pique.jpg`
- **Dónde va:** Camisetas (`/productos/camisetas`)
- **Se ve a:** media columna, hasta ~620 px de ancho (`productos/camisetas/page.tsx`)
- **Proporción:** 4:3 apaisada
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Macrofotografía de piqué, con las celdas en relieve tipo panal.
- **Nota:** Macro real de piqué. Acompaña a la ficha de la tela 02.

#### **FALTA** `retrato-asesor`

- **Nombre del archivo a entregar:** `retrato-asesor.jpg`
- **Dónde va:** Contacto (`/contacto`)
- **Se ve a:** columna derecha del formulario de contacto; en móvil ocupa el ancho (`contacto/page.tsx`)
- **Proporción:** 4:3 en móvil; en escritorio se estira a la altura del formulario
- **Ancho mínimo de entrega:** 1280 px
- **Qué debe verse:** Asesor comercial de Textil Padilla atendiendo en el mostrador, con muestrario de telas.
- **Nota:** Retrato de una persona real del equipo. Requiere su autorización para salir en la web.

> Clasificadas según la nota propia de cada slot.

---

## Ya resueltas, fuera de sesión — 5

Fotos definitivas que no forman sesión con ninguna otra. **No se piden.**
Están aquí para que el documento cuadre con los
133 huecos del sitio y no parezca que faltan.

- `macro-fibra-blanca.jpg` — Inicio (`/`)
- `macro-tejido.jpg` — Productos (`/productos`)
- `titanium-trama.jpg` — Microfibra (`/productos/microfibra`) · Galería · vistas extra
- `macro-punto-camiseta.jpg` — Camisetas (`/productos/camisetas`)
- `local-fachada.jpg` — Contacto (`/contacto`)

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

**El recoloreo se decide al disparar, no al procesar.** Las telas del catálogo
alimentan la simulación de color de su ficha, y eso impone condiciones a la TOMA
que están escritas en su bloque: tela sin teñir, luz neutra, sin quemados. No hay
corrección posterior para ninguna de las tres — una tela ya teñida o una toma con
dominante cálida obligan a repetir la sesión, no a reprocesar el archivo.
