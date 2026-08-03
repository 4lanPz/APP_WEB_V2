# Brief — Huecos de imagen con marcador único + Dortmund Plus es una tela

Proyecto: `frontend-v2`. Rama nueva a partir de `main` (sugerido: `fix/huecos-imagen-y-modelo-tela`).

**Restricciones de siempre:** sin dependencias nuevas; build, lint y `tsc --noEmit` limpios al terminar; `prefers-reduced-motion` respetado; no cambiar la API de `Reveal` ni de `RevealGroup`.

---

## Fase 0 — Plan primero, no escribas código todavía

Presenta un plan corto y espera aprobación explícita. El plan debe decir:

- Qué archivos creas y cuáles tocas, separando **Parte A** de **Parte B**.
- En la Parte B: qué rutas dejan de generarse, qué archivos se borran, y qué pasa con los enlaces que hoy apuntan a ellas.
- Si encuentras algún hueco de imagen que este brief no menciona, dilo antes de tocarlo.

Si al leer el código descubres que algo aquí está mal diagnosticado, dilo. Este brief está escrito leyendo el `src`, no ejecutándolo.

---

# PARTE A — Todo hueco de imagen se ve igual y está registrado

El problema de fondo: hoy hay huecos de imagen que **no se distinguen de contenido real**. Un recuadro con textura o con un color plano parece una decisión de diseño, y tanto una persona como un agente leyendo el código concluyen que ahí no falta nada. Eso ya provocó que el inventario que alimenta el documento de fotografía para marketing saliera incompleto.

Regla que hay que dejar establecida: **si en un sitio va a haber una foto y hoy no la hay, se ve un marcador que lo dice, y ese hueco tiene un slot registrado en `slots-imagen.ts`.** Sin excepciones nuevas.

Hay dos excepciones legítimas que **ya existen y se mantienen**:

- `tintColor` en `ImagePlaceholder`, cuando el plano de color **es** el contenido y no sustituye a nada.
- `swatchColor` en `SubcategoryTile`, por la misma razón.

El criterio para distinguirlas: ¿algún día llegará una foto que ocupe ese espacio? Si sí, es un hueco. Si no, es contenido.

## A1 — `CategoryCard` pinta su propio hueco a mano

`src/components/ui/CategoryCard.tsx` acepta `imageSrc` e `imageAlt`, y su propio comentario dice que la fotografía real es de Fase 2. Ninguna de las dos páginas que lo usan se las pasa:

- `src/app/page.tsx` — sección `#categorias`, "Familias de tela"
- `src/app/productos/page.tsx` — misma rejilla

Cuando no hay `imageSrc`, el componente pinta un `<span>` con esta trama:

```
repeating-linear-gradient(45deg, rgba(245,242,238,0.05) 0 3px, transparent 3px 8px)
```

que es **idéntica** a la que `ImagePlaceholder` usa en su rama de hueco vacío con `dark`. Es el marcador de hueco copiado a mano, sin la etiqueta y sin la guarda de entorno.

Consecuencia concreta: en `ImagePlaceholder` la trama va detrás de `MARCAR_HUECO` y desaparece en producción. En `CategoryCard` no hay guarda, así que **la trama se pinta también en producción**. Es el único punto del sitio donde eso ocurre.

**Qué hacer:**

1. `CategoryCard` deja de dibujar su propio fondo y usa `ImagePlaceholder` para la capa de imagen, conservando el velo degradado y el bloque de texto que van encima.
2. Registrar cuatro slots nuevos en `SLOTS_UNICOS`, uno por familia. Ids sugeridos, derivados del slug de la categoría: `familia-microfibra`, `familia-texturizado`, `familia-spun`, `familia-polialgodon`.
3. Las dos páginas leen la foto por slot y se la pasan al componente. **Las dos usan la misma foto por familia** — son cuatro archivos, no ocho.

**Especificación de estos cuatro slots, que es distinta a la de las cabeceras y hay que escribirla bien en la `nota`:** la card mide en torno a 310 × 300 px en la rejilla de cuatro columnas, lleva un velo `linear-gradient(180deg, rgba(9,20,25,0.15), rgba(9,20,25,0.78))` encima, y el título con la descripción van sobre el **borde inferior**. La foto tiene que aguantar oscurecerse abajo y no llevar detalle importante en esa franja. En las cabeceras lo que hay que despejar es el tercio izquierdo; aquí es la parte de abajo. `ancho: 1280` es suficiente.

Sobre la `pagina` del slot: estos cuatro huecos viven en dos rutas a la vez. Elige una y déjalo dicho en la `nota` — no dupliques el slot, porque entonces el inventario le pediría a marketing ocho fotos.

## A2 — "Otras telas de Microfibra" no puede llenarse nunca

En `src/app/productos/microfibra/dortmund-plus/blancos/page.tsx`, la sección `#relacionados` pinta tres tiles con un `ImagePlaceholder` **sin `src`**, solo con `label="Microfibra · foto pendiente"`.

No es que falte la foto: **`chelsea` y `athletic` ya están en `imagenes.generado.ts`**. Salen en gris teniendo la foto publicada.

La causa está en `src/data/taxonomy.ts`: `RelatedFabric` solo tiene `name` y `description`. Sin el slug no hay forma de resolver ni la foto ni el enlace.

**Qué hacer:**

1. Añadir `slug: string` a `RelatedFabric` y rellenarlo en `dortmundPlusBlancosProduct.related` (`chelsea`, `athletic`, `imperial`).
2. El tile lee su foto con `fotoDeTela(item.slug)`, igual que hace `SubcategoryTile`.
3. Corregir el `href`: hoy los tres apuntan a `/productos/microfibra#en-preparacion`. Deben apuntar a la tela, y el estado debe salir de `estadoFicha(slug)` en vez de estar escrito a mano como "En preparación" — Athletic tiene ficha publicada y aquí se anuncia como si no.
4. Valora reutilizar `SubcategoryTile` en vez del `Link` a mano que hay ahí: hace exactamente esto y ya está resuelto. Si ves un motivo para no hacerlo, dilo en el plan.

## A3 — El marcador de hueco, visible o no, en un solo sitio

Hoy `MARCAR_HUECO` en `ImagePlaceholder.tsx` es `process.env.NODE_ENV !== "production"`. Se hizo por un motivo válido: el carrusel de eventos le estaba enseñando "DOCUMENTAL DE TALLER · FOTO REAL" al usuario final.

Ese motivo ya no aplica igual, porque lo que viene es una demo interna a gerencia donde conviene que se vea qué falta. Pero puede volver a aplicar en cuanto el sitio se publique.

**Qué hacer:** sacar la condición a una constante única, con nombre explícito y su porqué escrito al lado, de modo que cambiar entre "marcar" y "hueco neutro" sea tocar **una línea en un archivo**. Que `FondoHero`, que tiene su propio marcador punteado con el mismo criterio, lea esa misma constante en vez de duplicar la lógica.

Déjala en **marcador visible** por defecto, y documenta en el mismo comentario dónde se apaga antes de publicar.

Los textos del marcador siguen la misma regla que el resto de la interfaz: dicen qué falta y de qué, sin disculparse y sin adjetivos. `label` + `sublabel` con el nombre de la referencia ya lo hace bien; mantén ese formato en los huecos nuevos.

## A4 — Un chequeo que impida que esto se repita

`npm run imagenes` hoy detecta slots que ningún componente lee. No detecta lo contrario, que es el fallo que causó todo esto: **un hueco de imagen en la interfaz que no viene de un slot**.

**Qué hacer:** añadir esa verificación en la dirección que falta. Lo mínimo útil: recorrer el `src` y marcar todo uso de `ImagePlaceholder` o `PhotoCurtain` que no reciba `src`/`foto` derivado de `foto()`, `fotoDeTela()` o `vistasDeTela()`, salvo que use `tintColor`. Que **falle**, no que avise: un aviso más en una lista que ya tiene 29 falsos positivos no lo va a leer nadie.

Sobre esos 29: son los `-caida`, se consumen por plantilla y el chequeo los busca por id literal. **No los arregles en esta tanda**, pero deja anotado en el propio script que son falsos positivos conocidos, para que quien lea la salida no descarte la lista entera por ruido.

---

# PARTE B — Dortmund Plus es una tela, no una subcategoría

## El error

En `taxonomy.ts`, `Subcategory` **es** la tela: `chelsea`, `athletic`, `boston`, `dortmund`, `sevilla` son telas del catálogo, y `SLOTS_TELA` lo dice explícitamente ("un slot por tela del catálogo"). El nombre del tipo es engañoso pero el modelo es correcto.

Donde se rompe es en Dortmund Plus. Sus cinco tonos — Blancos, Claros, Medios, Oscuros, Especiales — **son colores de esa tela**, no productos. Y hoy se presentan como si fueran telas:

- Se pintan con `SubcategoryTile`, cuyo vocabulario entero es de producto con ficha: "Ficha disponible", "En preparación", "Ver ficha →", "Próximamente →", numeración 01–05.
- Cada uno tiene su propia URL bajo `/productos/microfibra/dortmund-plus/{tono}`, servida por la ruta `[tono]` con `PreparacionPage`, que dice *"Todavía no publicamos la ficha de esta referencia"*. Un color no es una referencia.
- El texto de la sección lo agrava: *"Cada una tendrá su ficha con carta completa y datos de tiraje"*.
- Y lo más raro del modelo: **la ficha técnica vive en el tono**, no en la tela. `dortmundPlusBlancosProduct.fichaTecnica` contiene composición, ancho, gramaje y rendimiento, que son de Dortmund Plus y no cambian con el color. Para todas las demás telas la ficha vive en la tela, vía `FichaSubcategoria`.

Resultado: hay dos sitios distintos donde puede vivir una ficha técnica, y el catálogo enseña cinco productos donde hay uno.

## Qué tiene que quedar

Dortmund Plus es **una tela**, con **una** ficha técnica y **una** página. Sus tonos son colores que se eligen dentro de esa página, no destinos a los que se navega.

## Qué hacer

1. **La ficha técnica sube a Dortmund Plus.** El contenido de `dortmundPlusBlancosProduct` — ficha, cuidados, sublimación, relacionadas — pasa a ser de la tela. La fila "Tono: Blancos · óptico y crudos" desaparece de la ficha: el tono es una elección del usuario, no un dato fijo de la tabla.

2. **Los tonos pasan a ser un selector de color dentro de la página.** Ya existe el componente: `ColorSwatchPicker`. Que la sección "Tonos disponibles" deje de ser una rejilla de tiles navegables y sea la carta de color de la tela. Mantén la descripción de cada familia de color — es información útil —, pero sin estado de ficha, sin numeración de producto y sin enlace.

3. **Desaparecen las páginas de tono.** Se borra `src/app/productos/microfibra/dortmund-plus/blancos/page.tsx`, se retira `TONOS_CON_PAGINA_PROPIA` y `tonoTienePaginaPropia` de `lib/rutas.ts`, y se elimina la ruta `[tono]` completa si no queda nada que sirva.

   **Antes de borrar, comprueba dónde se enlazan esas URLs.** Yo encontré dos sitios: la propia página de Dortmund Plus y `src/app/styleguide/page.tsx:395`. Verifica que no haya más — incluido cualquier sitemap o metadata — y arregla lo que quede colgando. Ninguna ruta debe quedar en 404.

4. **`ProductGallery` y sus cinco planos de color.** Hoy la imagen principal de la página de Blancos es un `ImagePlaceholder` con `tintColor` por cada uno de los cinco swatches — cinco fotos que nunca se pidieron a marketing. Al colapsar la página, ese componente o se retira o se reduce a la carta de color.

   **La galería de Dortmund Plus pasa a ser la galería normal de tela** (`GaleriaTela`), como Athletic y Titanium.

5. **Conexión con el recoloreo, y es la parte que hace que todo esto valga la pena.** Ya tienes construida la simulación de color en tiempo real: `TELAS_CON_RECOLOREO` con `athletic` y `titanium`, foto en gris neutro normalizado y capa multiply compensada por `k`. Eso es exactamente lo que la página de Dortmund Plus necesita: una tela, una foto, el color encima.

   **No lo actives todavía.** Dortmund Plus no tiene hoy una foto en gris apta — en el manifiesto están `dortmund-plus-cancha` y `dortmund-plus-brillante`, ninguna procesada como gris. Lo que sí hay que hacer es **registrar el slot de esa foto**, marcado `gris`, para que entre en el documento de marketing con el requisito correcto. El día que llegue la foto, añadir `dortmund-plus` a `TELAS_CON_RECOLOREO` es una línea.

6. **Renombrar `Subcategory` a `Tela`** (y `subcategories` a `telas`, `SubcategoryTile` a `TelaTile`, la ruta `[subcategoria]` a `[tela]`).

   **Esto va aparte y solo si la Parte B sale limpia.** Es un cambio mecánico y amplio, y mezclarlo con lo anterior hace el diff ilegible. Si lo haces, que sea en un commit propio que no toque nada más. Si el tiempo aprieta, sáltalo: el modelo queda correcto sin renombrar nada, solo con el nombre viejo.

---

## Verificación

- Build, lint y `tsc --noEmit` limpios. Consola del navegador sin errores.
- Las cuatro cards de familia muestran el marcador con la etiqueta, en Home y en `/productos`, y en **build de producción** también.
- Ningún hueco de imagen del sitio pinta una trama o un color plano sin etiqueta, salvo los `tintColor`/`swatchColor` legítimos.
- "Otras telas de Microfibra" muestra las fotos reales de Chelsea y Athletic, con el estado correcto de cada una y enlazando a su ficha.
- El chequeo nuevo falla si le añades a propósito un `ImagePlaceholder` sin slot, y pasa al quitarlo.
- Ninguna URL de tono en 404. Recorre a mano `/productos/microfibra/dortmund-plus` y confirma que no queda ningún enlace a un tono.
- `npm run botones` sin fallos: `SubcategoryTile` y `CategoryCard` tienen controles medidos y este trabajo los toca.
- Móvil a 375 px: las cards de familia con el marcador puesto siguen legibles y el texto no se pisa con la etiqueta.
- Diff de `slots-imagen.ts`: solo las entradas nuevas descritas aquí.

## Al terminar, reporta

- El inventario de `/admin/imagenes` con el total de slots antes y después.
- Qué huecos encontraste que este brief no menciona, si hubo alguno.
- Si algo de la Parte B resultó tener más alcance del previsto, dilo en vez de resolverlo por tu cuenta.

## Pendiente, fuera de esta tanda

- `MOTION.md` sigue sin documentar la lupa y el recoloreo.
- Los colores reales del ERP (`#173761`, `#B52022`, `#F0CC00`) siguen sin entrar en `recoloreo.ts`.
- Las fichas de local de `/contacto` no contemplan foto por local. Decisión de contenido, no de código.
