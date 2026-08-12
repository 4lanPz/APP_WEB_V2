# Pendientes

Decisiones aplazadas **a propósito**: cosas que se sabe que están, que se sabe por
qué no se han tocado, y que no se arreglan sueltas porque el arreglo suelto empeora
otra cosa.

No es una lista de bugs. Un bug se arregla; esto se decide.

> **Este archivo no existía hasta el 12 de agosto de 2026.** Hasta entonces cada
> pendiente vivía comentado junto al código que lo causaba —que es donde hay que
> leerlo cuando se toca ese código, y por eso los comentarios se quedan—, pero eso
> no da ninguna vista de conjunto: para saber qué hay aplazado había que abrir
> `MOTION.md`, un `data/*.ts` y dos comentarios de componente. Aquí está la lista;
> el detalle sigue en su sitio y desde aquí se enlaza.

---

## 1 · Paso activo del stepper de `AsesorPasos` — 2,25:1

**Dónde:** `src/components/ui/AsesorPasos.tsx` (el botón del paso activo y la barra
de progreso que hay debajo).

**Qué pasa:** el paso activo va en `text-brand` sobre `bg-bone` — **2,25:1 a 12 px,
contra un mínimo de 4,5:1**. Sale en `npm run marca` como cuatro suspensos: «01» y
«Prenda», a 375 y a 1440.

**Por qué no se arregla suelto:** no es un cambio de token y ya. El mismo azul claro
gobierna la **barra de progreso** de debajo, y ahí es lo que hace visible el avance.
Bajar solo la palabra a `brand-ink` —que sí cumple, 4,70:1 sobre el mismo fondo—
deja la barra descolgada del texto que la etiqueta: dos azules distintos para el
mismo estado. Se decide con el rediseño del stepper, no antes.

**Lo que cambió (agosto de 2026) y por lo que está aquí:**

- **Ya no es un caso aislado.** El bloque `AsesorPasos` cerraba solo la portada;
  desde que también cierra `/empresa` el mismo suspenso se publica en **dos páginas
  y cuatro apariciones**. No es un fallo nuevo —es el mismo en un sitio más—, pero
  duplica lo que cuesta seguir aplazándolo, y lo duplicaría otra vez a la tercera
  página que reutilice el bloque. **Si el bloque se monta en algún sitio más, esto
  sube de nivel.**
- **Ya lo ve el verificador.** Un comentario del componente decía que este suspenso
  no salía en `npm run marca` porque el ciclo avanza solo y el barrido descartaba lo
  que se movía. Era cierto cuando se escribió; dejó de serlo al pasar el barrido a
  medir con `reducedMotion` (`scripts/verificar-marca.mjs`), y este fue el primer
  suspenso que destapó ese arreglo.

**Ya anotado antes en:** `docs/inventario-botones-cta.md` (segunda nota de cabecera),
que es de cuando el problema estaba en una sola página.

---

## 2 · Rediseño de «Los valores que no negociamos»

**Dónde:** `src/data/valores.ts`. La sección **ya no se publica**: marketing la
retiró de `/empresa` en agosto de 2026.

**Qué queda pendiente:** la sección se retiró **estando ya pendiente de rediseño**, y
esa decisión sigue viva por si vuelve. Estaba escrita: reponerla como **rejilla de
cuatro piezas en `Container ancho="amplio"`**, no como las cuatro filas a todo lo
ancho separadas por filete que era cuando se quitó.

**Por qué está en esta lista y no solo en el archivo de datos:** `valores.ts` lo
encuentra quien busca «valores» —que es quien ya sabe que la sección existió—. Nadie
lo abre por casualidad, y menos aún ahora que **no lo importa ningún módulo**. La
decisión de rediseño no sobrevive a eso sin una línea aquí.

**Sin coste de fotografía:** la sección **no tenía ningún hueco de imagen**, así que
retirarla no dio de baja ningún slot y reponerla no pedirá ninguno.

**Ojo si vuelve:** la cita de cierre (`CITA_VALORES`) es **la misma frase que el
footer publica en las trece páginas** (`footerBrandQuote` en `src/lib/nav-data.ts`).
Mientras la sección estuvo montada se leía dos veces seguidas al final de `/empresa`.

---

## 3 · La cobertura de `npm run marca` no es reproducible

**Dónde:** `scripts/verificar-marca.mjs`, el recuento de «Sin medir» del pie del
informe.

**Qué pasa:** los **veredictos son estables** —tres pasadas seguidas dan los mismos
suspensos—, pero el **bucket de «sin medir» cambia en cada pasada**: 4 textos en una,
59 en la siguiente, ~75 en la tercera, y en rutas distintas. Con eso, «X textos sin
medir» no es un dato: es un sorteo. Y como los suspensos que caen ahí desaparecen de
la lista de fallos, el recuento de fallos también se mueve —8 en una pasada, 6 en la
siguiente— sin que haya cambiado nada del sitio.

**Lo que ya se descartó:** no es el scroll. Medido en `/empresa` @375 con
`reducedMotion`: `window.scrollTo` deja la ventana exactamente donde se le pide y
sigue ahí 950 ms después, en los tres tramos probados. Lenis no está interfiriendo.

**Dónde está, entonces:** en el filtro de «esto se ha movido entre la lectura y la
captura», que descarta el texto cuyo rectángulo o color cambió. Las entradas
`whileInView` arrancan cuando el elemento entra en pantalla, o sea justo después del
scroll del tramo, y la espera de 950 ms las cubre por poco: los casos que quedan
al borde caen a un lado o a otro según lo que tarde esa pasada. Un texto descartado
solo se reintenta si vuelve a caer entero dentro de la ventana en el tramo siguiente,
y el que está cerca del borde inferior no tiene segunda oportunidad.

**Y el rótulo miente.** «Sin medir (no caben enteros en el viewport)» sale de
`perdidos = claves.size - vistas.size`, que mete en el mismo saco tres cosas
distintas: lo que no cabe entero (`dentro`), lo que está tapado por un elemento fijo
(`pisado`) y lo que se movió. Solo la primera es la que el rótulo nombra, y es
probablemente la minoría.

**Por qué no se arregla en la misma tanda en que se encuentra:** el arreglo es una
pasada de reintento al final del barrido —volver a por lo descartado con la página ya
asentada— y separar el recuento por causa. Eso es tocar la herramienta de
verificación justo antes de un merge, con lo que ya no verifica el merge. Se hace
suelto y se compara contra una línea base conocida.

**Mientras tanto:** de este informe fíese de la **lista de suspensos**, que sí
reproduce, y no del número de «sin medir».

---

## Anotados en otro sitio

Pendientes que ya tienen su registro y su diagnóstico completo en otro documento. Se
listan aquí para que esta página no se lea como «solo hay dos».

- **Coste de pintado del scroll suave (Lenis) con rueda y trackpad** — medido: en
  `/productos/microfibra`, quitarlo baja el pintado de 1833 a 164 ms. Es una decisión
  de diseño sobre §04, no un arreglo. → `MOTION.md`, §«Scroll suave — lo que cuesta y
  dónde (medido)».
- **Ruido conocido de las verificaciones** (contraste del flotante de WhatsApp en la
  ruta de blancos, hueco sin slot en `blancos/page.tsx`, hidratación #418 con
  `prefers-reduced-motion`, marcadores de hueco encendidos) — cada uno con su causa
  escrita. → `docs/auditoria-consistencia.md`, §«Ruido conocido — excluido a
  propósito», que se regenera desde `scripts/auditoria-consistencia.ts`.
- **Escala paralela de títulos de card** (4 tamaños de titular fuera de los tokens,
  con excepción aprobada al guardarraíl) — la decisión es consolidarla como token o
  retirarla. → `docs/auditoria-consistencia.md`, §Priorización, nivel 2.
