# Brief — Parpadeo, LCP y preprocesado de imágenes

Rama: `feat/macro-zoom-recoloreo`. La lupa y el recoloreo ya funcionan en la ficha de Athletic.

**Restricciones de siempre:** sin dependencias nuevas, build/lint/typecheck limpios al terminar, `prefers-reduced-motion` respetado, no romper la API de `Reveal`/`RevealGroup`.

---

## 1. Parpadeo en el primer render + aviso de LCP

Al abrir la ficha por primera vez, la foto principal se muestra unos milisegundos **sin la capa de color** y luego aparece coloreada. Al recargar o al cambiar de color ya no ocurre — es solo el primer render.

La foto debe salir **ya coloreada desde el primer pintado**, sin pasar por el estado blanco.

En la misma tanda, resolver el aviso de consola:

```
Image with src "/telas/athletic-macro.webp" was detected as the Largest Contentful Paint (LCP).
Please add the `loading="eager"` property if this image is above the fold.
```

La principal es el elemento más grande de la pantalla y está sobre el pliegue: debe cargar con prioridad.

---

## 2. Preprocesado en `preparar-imagenes.ts`

Añadir dos pasos **antes** de generar los derivados:

1. **Desaturar a gris puro.** Elimina cualquier dominante de color que ensucie el multiply.
2. **Normalizar niveles** hasta que el máximo de luminancia quede cerca de 250, sin quemar.

Motivo, con datos medidos:

| Foto | Resolución | k (lum. media / 255) | Croma |
|---|---|---|---|
| Athletic (3) | 6000×4000 | 0,749 | 0,0 |
| Titanium (1) | 3311×2484 | 0,469 | 2,5 |
| Titanium (2) | 3855×2891 | 0,578 | 2,9 |
| Titanium (3) | 4011×3008 | 0,600 | 3,0 |

Las de Titanium son bastante más oscuras y con leve tinte. Ninguna tiene píxeles quemados (máximo 211), así que hay margen para levantar niveles sin perder información. Normalizada, **Titanium (3) pasa de k=0,600 a k=0,712** — al nivel de Athletic.

---

## 3. El factor `k` se calcula por imagen y vive en el manifiesto

Hoy `0,722` está escrito a mano como constante para Athletic. Eso no escala: con cada tela nueva alguien tendría que calcular y pegar el número, y a la tercera se olvida.

Cambiar a: **el preprocesado calcula `k` de cada imagen ya normalizada y lo guarda en el manifiesto** (`imagenes.generado.ts`). El componente de recoloreo lo lee de ahí.

Con eso, agregar una tela es soltar la foto y correr el script.

**Medir también el croma** de cada imagen y guardarlo. Si supera un umbral (empieza en ~10, calibrable), el script **avisa por consola** de que esa foto puede no ser apta para recoloreo. Reportar, no bloquear — la decisión es humana.

---

## 4. Titanium: dos fotos en galería

- La foto **nueva** (Titanium (3), 4011×3008, ya viene en 4:3 — no necesita recorte de proporción) es la **primera** vista.
- La que **ya estaba subida** pasa a ser la **segunda**.

La segunda se subió sin ninguna revisión, y es justamente el caso de prueba del pipeline: **pásala por el mismo preprocesado y reporta su croma y su k**. Si el croma sale alto, dilo antes de dar el trabajo por terminado — puede que no sirva y Titanium se quede con una sola foto.

Activar el bloque de simulación de color en la ficha de Titanium, con los mismos cuatro colores que Athletic.

**Verificar que el bloque de color NO aparezca en las otras 18 telas**, cuyas fotos están a color.

---

## 5. Dos ajustes menores pendientes

Puede que ya estén hechos; si no, entran aquí:

- **Slot vacío con el "+"**: no dibujarlo cuando no hay imagen. Si la galería queda con una sola foto, la fila de miniaturas desaparece entera.
- **Nombre del color activo**: moverlo **encima** de los swatches (primero se lee en qué color está, luego el control para cambiarlo) y darle más presencia. **Reutilizar un estilo existente del sistema** — el mismo tratamiento que los valores de la ficha técnica. No crear uno nuevo. La etiqueta "SIMULACIÓN DE COLOR" en mono se queda como encabezado de sección.

---

## 6. Nota para más adelante (no es tarea de esta tanda)

Los colores del ERP están guardados como enteros **OLE de Windows (BGR, no RGB)**. La conversión, verificada contra tres colores:

```
R = valor & 255
G = (valor >> 8) & 255
B = (valor >> 16) & 255
```

| Color | Valor | Hex real |
|---|---|---|
| Azul Campana | 6371095 | `#173761` |
| Rojo Marlboro | 2236597 | `#B52022` |
| Amarillo Barcelona 2026 | 52464 | `#F0CC00` |

Leídos como RGB salen los complementarios exactos (el rojo sale azul, el amarillo sale cian), que confirma la inversión de canales.

Los hex actuales de `recoloreo.ts` siguen siendo provisionales hasta que se valide qué colores están activos en la base. **No cambiarlos todavía.**

---

## Verificación

- Build, lint y typecheck limpios; consola sin errores ni el aviso de LCP.
- Abrir la ficha de Athletic **en pestaña nueva** y confirmar que no hay parpadeo blanco.
- Ficha de Titanium con las dos fotos y el recoloreo funcionando en ambas.
- Dos o tres fichas de otras telas: sin bloque de color, sin regresiones.
- Diff de `imagenes.generado.ts`: solo entradas de Athletic y Titanium.
- Móvil: swatches cómodos al tacto, y el color se conserva al abrir el visor a pantalla completa.
- Teclado: foco visible en los swatches, cambio de color con Enter.

---

## Pendiente después de esta tanda

`MOTION.md` — documentar la lupa y el recoloreo una vez la técnica esté cerrada.
