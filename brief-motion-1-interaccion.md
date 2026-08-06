# Brief — Motion, rama 1: interacción

Rama: `motion/interaccion`, desde `main` actualizado.

## Qué es esta tanda

Cuatro efectos de la familia **interacción**: movimiento que dispara el usuario al tocar o pasar el ratón. Hoy esta familia está vacía — las cards de familia, por ejemplo, no reaccionan a nada.

Es una **prueba para decidir**, no una implementación definitiva. Los cuatro se van a mirar en el navegador y algunos se van a descartar.

**Restricciones de siempre:** sin dependencias nuevas (Motion ya está, no entra GSAP); build, lint y `tsc --noEmit` limpios; **verificar además con `npm run dev` levantado**; no cambiar la API de `Reveal` ni `RevealGroup`.

---

## Dos condiciones de forma, y son importantes

**1. Cada efecto se puede apagar por separado, tocando una línea.** Una constante con nombre explícito por efecto, agrupadas en un solo sitio, no lógica entretejida en cada componente. Voy a descartar alguno y quiero que quitarlo sea trivial, no un desmontaje.

**2. `prefers-reduced-motion` desde el principio, no como añadido.** Con la preferencia activa, el estado final se aplica sin recorrido: el hover sigue cambiando el aspecto, pero sin transición. La funcionalidad no se pierde, se pierde el movimiento.

Los valores de duración y curva salen de `lib/motion.ts`. Si hace falta alguno que no existe, propónlo antes de inventarlo suelto.

---

## Los cuatro efectos

### 1. Cards de familia con hover

`CategoryCard`, en la Home, `/productos` y el styleguide. Al pasar el ratón: **la foto se acerca ligeramente y el bloque de texto sube un poco.**

- El acercamiento es **contenido**: lo justo para que se perciba profundidad, no un zoom. La card tiene `overflow` recortado, así que la foto crece dentro del marco sin desbordarlo.
- El texto va sobre el velo del borde inferior. Al subir, comprobar que **no se sale del velo** ni pierde contraste.
- Hoy la card ya lleva el marcador de hueco de imagen encendido: el efecto tiene que verse razonable también sobre el marcador, no solo sobre una foto.
- En táctil no hay hover: que no quede ningún estado a medias al tocar y soltar.

### 2. Botones con respuesta al pulsar

Un **hundimiento mínimo** al mantener pulsado, que vuelve al soltar. Es lo que hace que un botón se sienta físico.

- Aplica al sistema de botones existente, no a un botón concreto: si hay variantes, todas se comportan igual.
- **Muy sutil.** Un desplazamiento perceptible pero pequeño; si se nota como "salta", está de más.
- No debe interferir con el estado de foco de teclado ni con `:active` existente.

### 3. Enlaces con el filete que se traza

En los enlaces de texto: el subrayado **se dibuja de izquierda a derecha** al entrar el ratón, en vez de aparecer de golpe. Al salir, se retira.

- Es el efecto de registro más editorial de los cuatro y el que mejor encaja con la marca.
- **Ojo con el alcance:** aplicarlo a *todos* los enlaces del sitio sería demasiado. Empieza por los enlaces de texto en contenido, no por los de navegación ni por los que ya son botones. Dime dónde lo has aplicado.
- Que no altere la altura de línea ni desplace el texto al activarse.

### 4. Swatches de color con confirmación

En `SwatchesRecoloreo`, ficha de Athletic y Titanium. Al elegir un color, **el anillo de selección se cierra alrededor** del swatch en vez de aparecer instantáneo.

- **El cambio de color de la tela sigue siendo instantáneo.** Todo el valor del recoloreo está en poder comparar azul contra rojo tocando de un lado a otro; si se mete una transición en la tela, se pierde. Lo que se anima es **solo el anillo del swatch**, no la foto.
- El estado seleccionado debe seguir siendo distinguible sin color (anillo, marca), como está hoy.
- Verificar que sigue funcionando con teclado y que el `aria-label` no cambia.

---

## Verificación

- Build, lint y `tsc --noEmit` limpios; `npm run dev` levanta y las rutas responden.
- Los cuatro efectos se pueden apagar de uno en uno tocando su constante, y con todos apagados el sitio queda exactamente como está hoy. **Compruébalo apagándolos todos y comparando.**
- `prefers-reduced-motion` activo: los estados finales se aplican, sin recorrido. Ningún efecto queda a medias ni desaparece la funcionalidad.
- Teclado: el foco sigue visible en botones, enlaces y swatches; ningún efecto lo tapa ni lo sustituye.
- Móvil a 375 px: nada queda en estado de hover pegado tras tocar y soltar.
- `npm run botones` sin fallos nuevos (el contraste de `BotonWhatsApp` en la ruta de blancos es conocido).
- `npm run auditoria:consistencia`: sin hallazgos nuevos.

## Al terminar, reporta

- Dónde has aplicado el subrayado trazado, y por qué ahí y no en más sitios.
- Si algún efecto te obligó a tocar algo que el brief no anticipaba.
- Las constantes de apagado, con su nombre y su archivo, para poder desactivarlas yo.

---

## Fuera de esta tanda

Rama 2 (entrada y scroll): escalonado de cards, máscara en titulares, blur del hero al bajar, contador de cifras.
Rama 3 (estado y retroalimentación): formulario de contacto, validación, acordeón del menú, miniaturas de galería.
Después de las tres: transición entre páginas reutilizando `LoadCurtain`.
Sin fecha: `MOTION.md`, hidratación #418, bloques 2 y 3 de la auditoría.
