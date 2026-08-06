# Brief — Auditoría, bloque 1: los fallos objetivos

Rama: `fix/auditoria-1`, desde `main` actualizado.

Sale de `docs/auditoria-consistencia.md`. Son tres cosas independientes, todas medidas, todas visibles. **Nada más entra en esta tanda:** el resto del informe se aborda después, y mezclarlo haría el diff irrevisable.

**Restricciones de siempre:** sin dependencias nuevas; build, lint y `tsc --noEmit` limpios; `prefers-reduced-motion` respetado; no cambiar la API de `Reveal` ni `RevealGroup`. **Verificar además con `npm run dev` levantado**, no solo con los tres chequeos.

---

## 1. Tres enlaces con ancla que no existe (§7)

| Desde | Enlace |
|---|---|
| `/productos/camisetas` | `/productos/microfibra#en-preparacion` |
| `/productos/microfibra/dortmund-plus/blancos` | `/productos/microfibra/dortmund-plus#en-preparacion` |
| `/productos/microfibra/dortmund-plus/blancos` | `/productos/microfibra#en-preparacion` |

Las páginas destino existen, pero **ninguna tiene un `id="en-preparacion"`**: el usuario llega arriba del todo sin entender por qué.

**Antes de arreglar, determina qué se pretendía.** Hay dos salidas posibles y son distintas:

- Si en esas páginas existe una sección de telas en preparación **sin id**, ponerle el id y ya.
- Si esa sección **no existe**, el ancla sobra: el enlace debe apuntar a la página sin fragmento.

No inventes una sección para justificar el ancla. Dime cuál es el caso de cada uno antes de tocar nada si no está claro.

Comprueba de paso si hay más enlaces a `#en-preparacion` que la auditoría no viera por vivir en componentes que solo se montan tras interacción.

---

## 2. Controles imposibles de tocar (§8)

De los 73 controles bajo 44 px, **esta tanda ataca solo los que están rotos de verdad**, no los que se quedan cerca:

| Control | Tamaño | Dónde |
|---|---|---|
| Sin texto (×4) | **8 × 8 px** | `/` |
| Sin texto (×4) | **10 × 10 px** | `/contacto` |
| Sin texto (×1) | **14 × 14 px** | `/contacto` |

Un objetivo de 8 px no es «pequeño»: es intocable con un dedo. Y son puntos de paginación o indicadores sin etiqueta, así que el usuario ni siquiera sabe que ha fallado el toque.

**Cómo arreglarlo: ampliar el área táctil sin cambiar el aspecto visual.** El punto sigue viéndose de 8 px; lo que crece es la zona sensible al toque, con padding o un pseudo-elemento. Si se agranda el punto, se rompe el diseño.

**Y dales nombre accesible.** Son controles sin texto: necesitan `aria-label` que diga a qué llevan («Ir a la vista 2», «Siguiente local»). Hoy un lector de pantalla no puede usarlos.

**Los de 30, 36 y 37 px quedan fuera de esta tanda.** Son un ajuste distinto —altura de línea o padding, aplicado una vez— y entran en el bloque 2.

---

## 3. La cabecera de `/asesor-virtual` es la anomalía real (§1)

El informe lista cinco alturas de banda, pero no son cinco decisiones:

| Ancho | Valores | Lectura |
|---|---|---|
| 1440 px | 448 / 630 / 648 / 648 / 648 / 680 / 680 / **720** | La Home a 720 es legítima: es la portada. El grupo de 630–680 baila ~50 px, probablemente por longitud de titular. **448 se sale de todo.** |
| 375 px | **392** / 628 / 676 / 676 / 676 / 688 / 688 / 764 | Mismo patrón: 392 muy por debajo del resto. |

**Solo se toca `/asesor-virtual`.** Averigua por qué su banda mide casi 200 px menos que las demás: si usa un componente distinto, un padding propio, o le falta la altura mínima que sí tienen las otras. Alinéala con el grupo (~648 px a 1440, ~676 a 375).

**No unifiques las demás.** La Home debe seguir siendo más alta, y si el grupo de 630–680 varía por longitud del titular, eso es comportamiento correcto y no hay nada que arreglar. Si al mirarlo descubres que la variación **no** viene del titular sino de valores escritos a mano, dilo — pero no lo cambies en esta tanda.

---

## Verificación

- Build, lint y `tsc --noEmit` limpios; `npm run dev` levanta y las rutas responden.
- **Vuelve a correr `npm run auditoria:consistencia`** y confirma en el informe regenerado: los enlaces con ancla rota bajan a 0, los controles de 8–14 px desaparecen del listado, y la banda de `/asesor-virtual` entra en el rango del grupo.
- A 375 px, los controles ampliados se pueden tocar y **no se solapan entre sí ni con nada**: al crecer un área táctil es fácil que muerda la de al lado.
- Los puntos siguen viéndose del mismo tamaño que antes. Compara antes y después.
- Teclado: los controles con `aria-label` nuevo siguen enfocables y el foco se ve.
- `npm run botones` sin fallos nuevos (el de `BotonWhatsApp` en la ruta de blancos es conocido).

## Al terminar, reporta

- Qué resultó ser cada uno de los tres anclas: sección sin id, o ancla que sobraba.
- Por qué la banda de `/asesor-virtual` medía distinto.
- Si el grupo de 630–680 px varía por longitud de titular o por valores escritos a mano.

---

## Fuera de esta tanda

Bloque 2: enlaces de 36–37 px de alto, y decidir si el grupo de cabeceras se normaliza.
Bloque 3: valores arbitrarios (§12), colores literales en `Timeline` (§13), plantillas sin `<section>` (§2).
Sin bloque: hidratación #418 en `/`, y `MOTION.md` sin documentar lupa ni recoloreo.
