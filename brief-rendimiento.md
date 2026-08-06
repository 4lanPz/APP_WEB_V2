# Brief — Rendimiento: caída de FPS en cards y rejilla de telas

Rama: `fix/rendimiento-cards`, desde `main` actualizado.

## El síntoma

Los FPS caen visiblemente en tres sitios:

- **Home**, sección «Familias de tela» — solo **4 cards**.
- **`/productos`** — la misma rejilla de 4 cards.
- **`/productos/microfibra`** — la rejilla completa de tiles de tela.

Que cuatro elementos hagan caer los FPS no es un efecto pesado: es que algo está mal.

---

## Fase 0 — Mide antes de tocar nada

**No cambies ninguna animación todavía.** Diagnostica primero y repórtame la causa.

### Hipótesis de partida

Esas cards **no tienen foto**: llevan el marcador de hueco, que es un `repeating-linear-gradient` diagonal. Cuando se le aplica una escala, el navegador puede verse obligado a **repintar el degradado en cada fotograma** — los degradados no se promueven a capa de GPU como sí ocurre con una imagen.

Si es eso, el problema **desaparece solo cuando lleguen las fotos**, que están al caer. Sería un error rediseñar el efecto por una causa temporal.

### Qué medir

Con el perfilador de rendimiento del navegador, durante el hover y el scroll de esas tres pantallas:

- **Qué tarea domina el fotograma:** ¿*paint*, *layout*, *composite* o script? Es la pregunta que decide todo lo demás.
- Si el elemento animado está **promovido a su propia capa** o se está repintando.
- Si hay **recálculo de layout** en cada fotograma (señal de que se anima una propiedad que lo provoca).
- Cuántos elementos animan **a la vez** en la rejilla de microfibra.

### La comprobación que separa las dos causas

**Apaga el marcador de hueco** (`MARCAR_HUECOS_DE_IMAGEN = false` en `src/lib/huecos.ts`) y vuelve a medir las mismas tres pantallas.

- Si los FPS se recuperan → **la causa es la trama**, y se resuelve solo con las fotos.
- Si no cambian → la causa está en el efecto o en cómo se aplica, y hay que corregirlo.

Mide también con el interruptor `HOVER_EN_CARDS_DE_FAMILIA` apagado, para separar el coste del hover del coste de pintar la trama en reposo.

**Repórtame el resultado antes de arreglar nada.**

---

## Fase 1 — Corregir, según lo que salga

### Si la causa es la trama

No rediseñes la animación. Lo que hay que hacer es que **el marcador no cueste caro mientras siga encendido**: promoverlo a su propia capa, sustituir el degradado repetido por algo más barato de pintar, o no animarlo cuando el hueco esté vacío (que el hover escale solo cuando hay foto real).

Propón la salida y espera confirmación: es un cambio en un componente que se usa en todo el sitio.

### Si la causa es el efecto

Corrígelo por el camino barato antes de cambiar de animación:

- Animar solo **propiedades compuestas** (`transform`/`opacity`), nunca las que fuerzan layout.
- Promover a capa **solo mientras dura la animación**, no permanentemente — dejar cien elementos promovidos es peor que el problema.
- En la rejilla de microfibra, comprobar si están animando **todas las tiles a la vez** en vez de solo la que tiene el ratón encima.

### Si hace falta cambiar de animación

Solo entonces. Y dilo antes de hacerlo, con qué propones y por qué.

---

## Restricciones

Sin dependencias nuevas; build, lint y `tsc --noEmit` limpios; **verificar con `npm run dev` levantado**; `prefers-reduced-motion` respetado; los interruptores de `motion-interaccion.ts` siguen apagando cada efecto por separado.

---

## Verificación

- **Antes y después medidos con el mismo método**, con cifras. «Se ve mejor» no vale.
- Las tres pantallas: Home, `/productos` y `/productos/microfibra`.
- Comprobar también en **móvil a 375 px**, que es donde menos potencia hay y donde más se va a notar en la demo.
- `npm run auditoria:consistencia` sin hallazgos nuevos.
- `npm run botones` sin fallos nuevos.

## Al terminar, reporta

- **Qué era**, con los números del perfilador.
- Si se resuelve solo al llegar las fotos, dilo claramente: cambia la prioridad de todo lo demás.
- Qué tocaste y qué dejaste igual.

---

## Después de esta tanda

Mega-menú (ancho y espaciado), espaciados grandes entre secciones en Home y Empresa, y la línea de hitos (año en lugar del código interno, textos e imagen más grandes).

**Fuera del alcance hasta después de la presentación del 15:** el maniquí con prenda que cambia de tejido y el rediseño 80/20 de las páginas de familia.
