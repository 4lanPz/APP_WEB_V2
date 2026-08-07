# Brief — Auditoría de consistencia

Rama: `audit/consistencia`, desde `main` actualizado.

## Qué se pide, y qué NO

Se pide **un inventario medido de inconsistencias**. No se pide arreglar nada.

**No toques ni un componente en esta tanda.** El único cambio de código permitido es el script de auditoría y el documento que produce. Si encuentras algo que te parece trivial de arreglar, anótalo igual y sigue: una tanda que mide y arregla a la vez produce un diff que no se puede revisar, y el valor de esto está en la lista completa, no en tres arreglos sueltos.

## Por qué

Todo lo corregido en las últimas semanas apareció por casualidad: las mallas de las cards de familia, el ícono de una sola raya, el enlace al catálogo que faltaba en móvil. Nunca se ha recorrido el sitio buscando. Quedan tres semanas antes de la presentación y hace falta la lista entera de una vez, no seguir descubriendo cosas de una en una.

---

## Criterio: variación deliberada vs. accidental

**El objetivo no es que todo sea idéntico.** Que la portada tenga una cabecera más alta que una ficha de producto es legítimo: es la portada y tiene más peso. Lo que no es legítimo es que las diferencias sean **accidentales** — valores distintos porque cada pantalla se escribió en un momento distinto, no porque alguien lo decidiera.

Por eso, para cada inconsistencia el informe debe decir:

- **Qué valores hay** y en qué pantallas.
- **Si el valor sale del sistema de diseño** o es arbitrario. Esta es la distinción mecánica más útil: un valor que no está en la escala de tokens es casi siempre accidental.
- **Cuál debería ser el valor estándar**, propuesto, y cuáles serían las excepciones justificadas.

---

## Qué medir

Con Playwright, en **375 px y 1440 px**, sobre **todas las rutas** (son 16 según la última tanda; no las escribas a mano, sácalas del enrutador).

### Layout y ritmo

- **Altura de cada cabecera.** Ya sabemos que difieren sin criterio: la portada es más alta, contacto más baja, productos otra. Medir todas y agruparlas.
- **Espaciado vertical entre secciones.** Padding y margin de cada bloque de sección.
- **Ancho de contenedor** por pantalla, y su padding lateral.
- **Tamaños de titular** (h1, h2, h3) por pantalla.

### Fallos objetivos

- **Errores y avisos de consola** en cada ruta y cada tamaño.
- **Desborde horizontal** en móvil (`scrollWidth > clientWidth`).
- **Enlaces rotos**: recorre todos los `href` internos y comprueba que no devuelven 404. Incluye los anclas (`#seccion`) — que el destino exista en la página.
- **Áreas táctiles** por debajo de 44 px en móvil.
- **Imágenes sin `alt`**, o con `alt` que no corresponde al contenido esperado del slot.
- **Foco de teclado invisible** en controles interactivos.

### Valores fuera del sistema

Este apartado sale de lo aprendido con `translate-y-1.625`:

- **Clases numéricas de Tailwind que no llegan al CSS compilado.** Tailwind v4 descarta en silencio las utilidades cuyo valor suelto no es múltiplo de 0,25 — sin error de build ni de lint. Ese escaneo ya lo hiciste una vez a mano; **conviértelo en script ejecutable** y déjalo como comando de npm. Es el único fallo de esta clase que ningún chequeo detecta hoy.
- **Valores arbitrarios** (`[13px]`, `[0.87rem]`) usados donde existe un token equivalente.
- **Colores y tipografías fuera de los definidos** en el design system.

---

## Formato del informe

Un documento en `docs/`, generado por el script y regenerable.

**Agrupado por tipo de inconsistencia, no por página.** «Las cabeceras miden cinco alturas distintas» es una decisión; «la Home tiene una cabecera de X» repetido siete veces no lo es.

Para cada hallazgo: qué es, dónde ocurre, los valores medidos, si es fallo objetivo o inconsistencia de criterio, y una propuesta de valor estándar.

**Al final, una priorización tuya** en tres niveles: lo que rompe algo y hay que arreglar; lo que se nota en la presentación; y lo cosmético que puede esperar.

---

## Ruido conocido — exclúyelo o márcalo como conocido

Para que la lista sea legible, estos ya están diagnosticados y no deben aparecer como hallazgos nuevos:

- Contraste de `BotonWhatsApp` a 375 px en la ruta de blancos (1,72:1). Causado por el marcador de hueco encendido; desaparece cuando lleguen las fotos.
- `npm run imagenes` con exit 1 por el hueco sin slot en `blancos/page.tsx`. Es Parte B.
- Aviso de lint en `scripts/verificar-botones.mjs`.
- Error de hidratación React #418 en `/` con `prefers-reduced-motion`.
- Los marcadores de hueco de imagen, que están encendidos a propósito.

---

## Verificación

- Build, lint y `tsc --noEmit` limpios; `npm run dev` levanta y las rutas responden.
- El script es idempotente: dos pasadas dan el mismo documento.
- **Diff limpio:** solo el script, su entrada en `package.json` y el documento. Ningún componente tocado.

## Al terminar, reporta

- El resumen del informe: cuántos hallazgos, de qué tipo.
- **Los tres que más te preocupan**, con tu razón.
- Si algo no se pudo medir de forma fiable, dilo en vez de dar un número inventado.
