# Brief — Parpadeo, menú móvil e ícono de navegación

Rama: `feat/macro-zoom-recoloreo`.

**Restricciones de siempre:** sin dependencias nuevas, build/lint/typecheck limpios, `prefers-reduced-motion` respetado, no romper la API de `Reveal`/`RevealGroup`.

---

## 1. El parpadeo sigue ocurriendo — cambiar el enfoque

`loading="eager"` + `fetchPriority="high"` no lo resolvió. Al abrir la ficha por primera vez la foto se pinta en blanco y unos milisegundos después aparece el color.

**No hay que insistir en sincronizar mejor.** Mientras el color viva en una capa separada por encima de la imagen, siempre existe un instante en que la imagen ya pintó y la capa todavía no. Es un problema de arquitectura, no de prioridad de carga.

### El cambio

Invertir el orden de composición:

- **Hoy:** `<img>` + un `<div>` encima con `background-color` y `mix-blend-mode: multiply`.
- **Debe ser:** el contenedor lleva el `background-color` del tono, y **la imagen misma** lleva `mix-blend-mode: multiply`.

El resultado visual es idéntico —multiply es conmutativo— pero la mezcla pasa a ser una propiedad de la propia imagen. **No existe ningún fotograma en que la imagen pueda pintarse sin teñir**, porque no hay dos elementos que sincronizar.

Aplicarlo en los tres sitios donde se recolorea: **foto principal, miniaturas y visor a pantalla completa**.

Verificar que el **blanco óptico** sigue saliendo intacto: sin color el contenedor queda blanco, y multiply sobre blanco no altera la imagen.

### Cómo verificarlo de verdad

Recargar no sirve: la imagen sale de caché y llega a tiempo, que es por lo que "solo pasaba la primera vez".

- DevTools → Network → **Disable cache**, y además **throttling a 3G lento**. Con la carga ralentizada, si el parpadeo existe se vuelve obvio en vez de durar milisegundos.
- Probar en pestaña nueva, no solo recargando.
- Repetir en la ficha de Athletic y en la de Titanium.

---

## 2. Menú móvil: quitar la lista de telas

Hoy el menú despliega los nombres de las más de 40 telas. Eso no cabe en una pantalla: el botón del final queda inalcanzable y no se llega a ver el listado completo.

**El menú debe mostrar solo los grupos con su contador** — tal como ya aparecen hoy:

```
MICROFIBRA   20
TEXTURIZADO   8
SPUN          8
```

Sin los nombres individuales de tela. Al tocar un grupo, se navega a su página, que es donde el catálogo se explora con su rejilla y sus fotos.

Con eso el menú cabe sin scroll y el botón de ver todas las categorías vuelve a ser alcanzable.

> **Confirmar la nomenclatura antes de implementar:** en las rutas `/productos/[categoria]/[subcategoria]`, "microfibra" es categoría y "athletic" subcategoría. Verificar que se está tocando el nivel correcto y no al revés.

Verificar que en escritorio la navegación no se rompe con este cambio.

---

## 3. Ícono de menú: se ve una sola raya

Ocurre **en escritorio y en móvil**, no solo en móvil. En estado cerrado se ve una única línea horizontal, que no se lee como menú — parece un guion suelto o un elemento a medio cargar. La X del estado abierto sí está bien.

**Diagnosticar antes de cambiar nada:** inspeccionar el elemento y determinar si las otras líneas existen en el DOM con altura cero, opacidad cero, o el mismo color que el fondo. Si es un fallo de CSS puede estar afectando a otros componentes; si es una decisión de diseño deliberada, decirlo.

**Corrección:** dos o tres líneas horizontales, que es la convención que la gente reconoce sin pensar. Mantener el color, el tamaño y la transición a X del sistema actual.

---

## Verificación

- Build, lint y typecheck limpios; consola sin errores.
- Parpadeo: probado con caché deshabilitada y throttling 3G, en Athletic y Titanium, en pestaña nueva. Los cuatro colores y el blanco óptico correctos en foto principal, miniaturas y visor.
- Menú móvil: cabe sin scroll, el botón del final es alcanzable, los tres grupos navegan bien.
- Menú escritorio: sin regresiones.
- Ícono: se lee como menú en ambos estados y en los dos tamaños de pantalla.
- Las fichas de `/productos/[categoria]/[subcategoria]` siguen cargando (hubo un 404 que resultó ser un servidor viejo en el puerto 3000 — confirmar que el dev server corre donde se está mirando).

---

## Pendiente, sin bloquear

- Revisar la vista de Titanium en azul pasando por sus tres fotos: `titanium-caida` tiene k=0,579 frente a 0,706 y 0,690 de las otras dos. Si a ojo se ve más apagada que sus hermanas en la misma galería, habrá que normalizar contra una k objetivo común en lugar de igualar solo el máximo.
- `MOTION.md` — documentar lupa y recoloreo cuando la técnica esté cerrada.
