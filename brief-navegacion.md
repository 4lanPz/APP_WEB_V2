# Brief — Menú móvil e ícono de navegación

Rama: `fix/navegacion`, desde `main` ya actualizado.

**Restricciones de siempre:** sin dependencias nuevas; build, lint y `tsc --noEmit` limpios; `prefers-reduced-motion` respetado; no cambiar la API de `Reveal` ni `RevealGroup`.

**Verificación obligatoria:** además de build y typecheck, **levantar `npm run dev` y abrir las rutas**. En una tanda anterior los tres chequeos salieron limpios y el proyecto no arrancaba por un `ReferenceError` de evaluación de módulo.

---

## 1. El menú móvil despliega el catálogo entero

Hoy el menú lista los nombres de las **más de 40 telas** bajo «Nuestros Productos». Consecuencias:

- No cabe en pantalla: el botón del final del menú es inalcanzable.
- La **cuarta familia (Polialgodón) no llega a verse**, porque queda enterrada bajo la lista de telas de las tres anteriores.

**Qué debe mostrar:** solo los grupos, con su contador, tal como ya aparecen hoy:

```
MICROFIBRA    20
TEXTURIZADO    8
SPUN           8
POLIALGODÓN    n
```

Sin los nombres individuales de tela. Al tocar un grupo se navega a su página, que es donde el catálogo se explora con su rejilla y sus fotos.

**Verificar que las cuatro familias aparecen** y que el menú cabe sin scroll a 375 px. Un menú sirve para *ir a un sitio*, no para elegir producto.

> Antes de implementar, confirma que estás tocando el nivel correcto de la taxonomía: en `/productos/[categoria]/[subcategoria]`, «microfibra» es categoría y «athletic» subcategoría. Lo que se quita son las subcategorías; lo que se queda son las categorías.

Comprobar que la navegación de escritorio no se rompe con el cambio.

---

## 2. El ícono de menú se ve como una sola raya

Ocurre **en escritorio y en móvil**. En estado cerrado se ve una única línea horizontal, que no se lee como menú — parece un guion suelto o un elemento a medio cargar. La X del estado abierto está bien.

**Diagnostica primero, en el navegador y no en el código.** Inspecciona el elemento y determina si las otras líneas existen en el DOM con altura cero, opacidad cero, o el mismo color que el fondo.

- Si es un **fallo de CSS**, dilo: puede estar afectando a otros componentes por la misma causa, y conviene saberlo antes de parchear solo este.
- Si es una **decisión de diseño deliberada**, dilo también y no la cambies sin avisar.

**Corrección:** dos o tres líneas horizontales, que es la convención que la gente reconoce sin pensar. Mantener el color, el tamaño de área táctil y la transición a X del sistema actual.

---

## Verificación

- Build, lint y `tsc --noEmit` limpios; `npm run dev` levanta y las rutas responden.
- Menú móvil a 375 px: las **cuatro** familias visibles, cabe sin scroll, el botón del final alcanzable, los cuatro grupos navegan a su página.
- Menú de escritorio sin regresiones.
- Ícono legible como menú en ambos estados y en los dos tamaños de pantalla.
- Teclado: foco visible en el botón del menú y en los enlaces del desplegable.
- `npm run imagenes` y `npm run botones` sin fallos nuevos (el de `BotonWhatsApp` a 375 en la ruta de blancos es conocido y no se toca en esta tanda).

---

## Pendientes, fuera de esta tanda

- Error de hidratación React #418 en `/` con `prefers-reduced-motion`: la página se renderiza dos veces. Detectado y no tocado.
- `MOTION.md` sin documentar la lupa ni el recoloreo.
- Alturas de cabecera distintas por página sin criterio: pendiente de auditoría de consistencia.
