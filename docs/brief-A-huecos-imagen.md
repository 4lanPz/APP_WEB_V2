# Brief — Huecos de imagen registrados (Parte A)

Proyecto: `frontend-v2`. Rama nueva desde `main`: `fix/huecos-imagen`.

**Objetivo inmediato:** que el inventario de `/admin/imagenes` liste **todos** los espacios que van a llevar foto, para poder enviar el documento de requisitos a marketing. Hoy sale incompleto.

**Restricciones de siempre:** sin dependencias nuevas; build, lint y `tsc --noEmit` limpios; `prefers-reduced-motion` respetado; no cambiar la API de `Reveal` ni `RevealGroup`.

---

## Fase 0 — Plan primero, no escribas código todavía

Presenta un plan corto y espera aprobación. Debe decir qué archivos creas y cuáles tocas, y **si encuentras algún hueco de imagen que este brief no menciona, dilo antes de tocarlo**.

Si al leer el código ves que algo aquí está mal diagnosticado, dilo. Este brief se escribió leyendo el `src`, no ejecutándolo.

---

## La regla que hay que dejar establecida

Hoy hay huecos de imagen que **no se distinguen de contenido real**. Un recuadro con textura o color plano parece una decisión de diseño, y tanto una persona como un agente leyendo el código concluyen que ahí no falta nada. Eso es exactamente lo que dejó el inventario incompleto.

**Si en un sitio va a haber una foto y hoy no la hay, se ve un marcador que lo dice, y ese hueco tiene un slot registrado en `slots-imagen.ts`.** Sin excepciones nuevas.

Dos excepciones legítimas que **ya existen y se mantienen**: `tintColor` en `ImagePlaceholder` y `swatchColor` en `SubcategoryTile`, cuando el plano de color **es** el contenido.

Criterio: ¿algún día llegará una foto que ocupe ese espacio? Si sí, es un hueco. Si no, es contenido.

---

## 1. El chequeo que detecta huecos sin slot — hazlo primero

`npm run imagenes` hoy detecta slots que ningún componente lee. **No detecta lo contrario**, que es el fallo que causó todo esto: un hueco en la interfaz que no viene de un slot.

Añadir esa verificación. Lo mínimo útil: recorrer el `src` y marcar todo uso de `ImagePlaceholder` o `PhotoCurtain` que no reciba `src`/`foto` derivado de `foto()`, `fotoDeTela()` o `vistasDeTela()`, salvo que use `tintColor`. Que **falle**, no que avise.

> **Va primero a propósito.** Corriéndolo una vez obtienes la lista completa de huecos sin registrar, incluidos los que este brief no conoce. Esa lista es lo que necesito para el documento de marketing — **repórtala antes de arreglar nada**.

Sobre los 29 falsos positivos actuales (los `-caida`, que se consumen por plantilla y el chequeo busca por id literal): **no los arregles en esta tanda**, pero deja anotado en el propio script que son conocidos, para que nadie descarte la lista entera por ruido.

---

## 2. `CategoryCard` pinta su propio hueco a mano

`src/components/ui/CategoryCard.tsx` acepta `imageSrc` e `imageAlt`, pero ninguna de las dos páginas que lo usa se las pasa:

- `src/app/page.tsx` — sección `#categorias`, "Familias de tela"
- `src/app/productos/page.tsx` — misma rejilla

Sin `imageSrc`, el componente pinta un `<span>` con esta trama:

```
repeating-linear-gradient(45deg, rgba(245,242,238,0.05) 0 3px, transparent 3px 8px)
```

Es **idéntica** a la que `ImagePlaceholder` usa en su rama de hueco vacío con `dark` — el marcador copiado a mano, sin etiqueta y sin guarda de entorno. Como no hay guarda, **la trama se pinta también en producción**. Es el único punto del sitio donde eso ocurre.

**Qué hacer:**

1. `CategoryCard` deja de dibujar su propio fondo y usa `ImagePlaceholder` para la capa de imagen, conservando el velo degradado y el bloque de texto que van encima.
2. Registrar cuatro slots en `SLOTS_UNICOS`: `familia-microfibra`, `familia-texturizado`, `familia-spun`, `familia-polialgodon`.
3. Las dos páginas leen la foto por slot. **Las dos usan la misma foto por familia** — cuatro archivos, no ocho.

**Especificación para la `nota` de estos slots, distinta a la de las cabeceras:** la card mide ~310 × 300 px en la rejilla de cuatro columnas, lleva un velo `linear-gradient(180deg, rgba(9,20,25,0.15), rgba(9,20,25,0.78))` encima, y el título con la descripción van sobre el **borde inferior**. La foto tiene que aguantar oscurecerse abajo y no llevar detalle importante en esa franja. En las cabeceras hay que despejar el tercio izquierdo; aquí es la parte de abajo. `ancho: 1280` es suficiente.

Estos cuatro huecos viven en dos rutas a la vez: elige una para el campo `pagina` y déjalo dicho en la `nota`. **No dupliques el slot**, o el inventario le pediría a marketing ocho fotos.

---

## 3. El marcador de hueco, en un solo sitio

Hoy `MARCAR_HUECO` en `ImagePlaceholder.tsx` es `process.env.NODE_ENV !== "production"`. Se hizo por un motivo válido: el carrusel de eventos le enseñaba "DOCUMENTAL DE TALLER · FOTO REAL" al usuario final.

Ese motivo no aplica en una demo interna donde conviene ver qué falta, pero volverá a aplicar al publicar.

**Qué hacer:** sacarlo a una constante única, con nombre explícito y su porqué al lado, de modo que alternar entre "marcar" y "hueco neutro" sea **una línea en un archivo**. Que `FondoHero`, que duplica la lógica con su marcador punteado, lea esa misma constante.

Déjala en **marcador visible** por defecto, y documenta en el comentario dónde se apaga antes de publicar.

Los textos siguen la regla del resto de la interfaz: dicen qué falta y de qué, sin disculparse y sin adjetivos. `label` + `sublabel` con el nombre de la referencia ya lo hace bien.

---

## 4. `slug` en `RelatedFabric`

En `src/data/taxonomy.ts`, `RelatedFabric` solo tiene `name` y `description`. Sin el slug no hay forma de resolver ni la foto ni el enlace, y por eso "Otras telas de Microfibra" pinta tiles en gris aunque Chelsea y Athletic ya tengan foto publicada.

**Añadir `slug: string` y rellenarlo** en `dortmundPlusBlancosProduct.related` (`chelsea`, `athletic`, `imperial`).

> Solo el modelo de datos. **La corrección del renderizado va en la Parte B**, porque la página que lo pinta se elimina allí y sería trabajo repetido.

---

## Verificación

- Build, lint y `tsc --noEmit` limpios. Consola sin errores.
- Las cuatro cards de familia muestran el marcador con etiqueta, en Home y en `/productos`, y **también en build de producción**.
- Ningún hueco del sitio pinta trama o color plano sin etiqueta, salvo los `tintColor`/`swatchColor` legítimos.
- El chequeo nuevo falla si le añades a propósito un `ImagePlaceholder` sin slot, y pasa al quitarlo.
- `npm run botones` sin fallos: `CategoryCard` tiene controles medidos y este trabajo lo toca.
- Móvil a 375 px: las cards siguen legibles con el marcador puesto y el texto no se pisa con la etiqueta.
- Diff de `slots-imagen.ts`: solo las cuatro entradas nuevas.

## Al terminar, reporta

- **La lista completa de huecos sin slot que encontró el chequeo nuevo** — esto es lo más importante de la tanda.
- El inventario de `/admin/imagenes` con el total de slots antes y después.
- Si algo resultó tener más alcance del previsto, dilo en vez de resolverlo por tu cuenta.

## Fuera de esta tanda

- Parte B: Dortmund Plus como tela única, colapso de las páginas de tono, y el renderizado de "Otras telas de Microfibra".
- Menú móvil e ícono de navegación.
- `MOTION.md` sin documentar la lupa ni el recoloreo.
- Los colores reales del ERP (`#173761`, `#B52022`, `#F0CC00`) sin entrar en `recoloreo.ts`.
