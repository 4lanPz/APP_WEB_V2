# Brief — Home, tanda 1: estructura y ancho amplio

Rama: `home/estructura`, desde `main` actualizado.

**Va después de `fix/rendimiento-cards`.** Esta tanda toca las mismas cards de familia, así que primero hay que saber por qué caen los FPS.

**Restricciones de siempre:** sin dependencias nuevas; build, lint y `tsc --noEmit` limpios; **verificar con `npm run dev` levantado**; `prefers-reduced-motion` respetado; los interruptores de `motion-interaccion.ts` siguen funcionando por separado.

---

## Fase 0 — Plan primero

Presenta un plan corto y espera aprobación. Debe decir qué archivos creas y tocas, y **si al leer el código descubres que algo aquí está mal diagnosticado, dilo**: este brief se escribió sin ejecutar nada.

---

## 1. Un segundo ancho de contenedor

Hoy todo el sitio usa un único contenedor que topa en **1240 px**, y la auditoría lo señaló como una de las pocas cosas perfectamente consistentes que hay. Vamos a introducir un segundo ancho, y hay que hacerlo **bien**: como una variante del `Container` existente, con nombre y regla escrita, no como una excepción suelta en cada sección.

Si no, en tres semanas hay cinco anchos y volvemos al problema que la auditoría acaba de descartar.

**Qué se pide:**

- Una **variante del contenedor**, no un contenedor nuevo. Que el ancho actual siga siendo el que se usa por defecto y esta sea la excepción explícita.
- **Nombre genérico**, no ligado a las secciones que la estrenan: se va a usar en más páginas y en otras pantallas. Algo del tipo `amplio`, no `familias`.
- **Valor:** más ancho que 1240, con margen lateral moderado a los lados. Ni pegado al borde de la pantalla ni tan contenido como el actual. **Propón el valor concreto en la Fase 0** y lo decidimos viéndolo.
- **En móvil se comporta exactamente como el contenedor actual.** El ancho amplio solo aplica desde tablet.
- Documentado donde estén los tokens, con la regla de cuándo se usa cada uno.

**Verificar que las secciones que conservan el ancho actual no se mueven ni un píxel.**

---

## 2. Reordenar las secciones de la Home

Orden nuevo, de arriba abajo:

1. **Verdad material**
2. **Textil Padilla en cifras**
3. **Familias de tela**
4. **Encuentros**
5. **Asesor virtual**

El hero se queda como está, arriba de todo. No se toca.

**Cuidados:**

- El **numerado de sección** (01, 02, 03…) debe recalcularse solo con el orden. Si hoy está escrito a mano, esta es la ocasión de derivarlo.
- Los **anclas de navegación** (`#seccion`) deben seguir apuntando a su destino. La auditoría ya detectó tres anclas rotas en el sitio; que este cambio no añada más. Comprueba también los enlaces que llegan desde otras páginas.

---

## 3. Quitar «El oficio en tres verbos» de la Home

Desaparece de la Home.

**Antes de borrar, comprueba dos cosas:**

- **Si esa sección o sus componentes se usan también en `/empresa`** u otra página. Si es un componente compartido, se retira de la Home pero no se borra.
- **Si tiene slots de imagen registrados.** Si los tiene y ya no existe el hueco, hay que darlos de baja en `slots-imagen.ts` y regenerar los documentos de fotografía — si no, marketing seguirá recibiendo un encargo de fotos para una sección que no existe.

Repórtame qué slots se dan de baja, si los hay.

---

## 4. «Verdad material»: fondo y composición

**Fondo:** hoy tiene un tono azulado; pasa al color de papel del resto de la página. Comprueba de dónde sale ese azul — si lo pinta un componente compartido, no lo cambies ahí sin decírmelo.

**Composición:** bloque de imagen y texto **con aire entre ambos**, no pegados como están hoy. La imagen no rompe el contenedor ni se sale de la rejilla: es una composición de dos columnas con separación generosa entre ellas.

Usa el **ancho amplio** en esta sección.

**En móvil**, las dos columnas se apilan. Define qué va primero y con cuánta separación.

Como imagen puedes usar provisionalmente `athletic` o `titanium`, que están procesadas y en gris. Se sustituirán cuando lleguen las de marketing.

---

## 5. Familias de tela: más anchas y separadas

Hoy las cuatro cards forman un bloque continuo, pegadas entre sí, y no se distingue dónde acaba una y empieza la siguiente.

- **Ancho amplio** en esta sección.
- **Separación entre las cuatro cards**, de modo que se lean como cuatro piezas y no como una banda.
- Las cards crecen: **actualiza el ancho mínimo de sus slots** (`familia-*`, hoy 1280 px) al valor que exija el tamaño nuevo, y **regenera los documentos de fotografía**. Marketing ya tiene el encargo enviado, así que dime el número nuevo para poder avisarles.
- En móvil se apilan, como ahora.

**Ojo con el hover:** el efecto de la rama `motion/interaccion` está aplicado a estas cards. Comprueba que sigue funcionando con el tamaño nuevo y que el texto no se sale del velo al subir.

---

## Verificación

- Build, lint y `tsc --noEmit` limpios; `npm run dev` levanta y las rutas responden.
- **Las secciones con el ancho actual no se han movido.** Compara antes y después.
- `npm run auditoria:consistencia`: los anchos de contenedor pasan de uno a **dos valores exactos**, ninguno más. Ningún ancla rota nueva.
- A 375 px: todo se apila bien, sin desborde horizontal.
- `npm run imagenes` y `npm run botones` sin fallos nuevos.
- Los cuatro interruptores de interacción siguen apagando cada efecto por separado.

## Al terminar, reporta

- El valor del ancho amplio y su nombre.
- Qué slots se dieron de baja al quitar «El oficio en tres verbos», si los hubo.
- El ancho mínimo nuevo de los slots `familia-*`.
- Si «El oficio en tres verbos» era compartido con otra página.

---

## Fuera de esta tanda

Mega-menú (ancho y espaciado), espaciados grandes entre secciones, línea de hitos (año en vez del código interno, textos e imagen más grandes).

**Después de la presentación del 15:** maniquí con prenda que cambia de tejido, rediseño 80/20 de las páginas de familia, `MOTION.md`, hidratación #418, bloques 2 y 3 de la auditoría.
