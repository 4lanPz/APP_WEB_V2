/**
 * ══════════════════════════════════════════════════════════════════════════
 *  LOS CINCO INTERRUPTORES DE LA FAMILIA INTERACCIÓN
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Movimiento que dispara el visitante al tocar o pasar el ratón. Cada efecto se
 * apaga por separado poniendo su constante en `false`, y con los cinco en
 * `false` el sitio queda EXACTAMENTE como estaba antes de esta tanda: ni una
 * clase de más en el HTML, ni un nodo extra, ni una transición inerte.
 *
 * Es una tanda de prueba —los cinco se miran en el navegador y alguno se
 * descarta—, así que apagar tiene que ser esto y no un desmontaje. Misma idea
 * que `MARCAR_HUECOS_DE_IMAGEN` en `@/lib/huecos`: la pregunta vive en una
 * línea, y los componentes solo la leen.
 *
 * ── POR QUÉ AQUÍ VIVEN TAMBIÉN LAS CLASES ─────────────────────────────────
 * Cada interruptor va seguido de las clases que enciende. Podrían quedarse en
 * su componente detrás de un `&&`, pero entonces apagar un efecto sería ir a
 * leer el componente y decidir qué parte de su `className` sobra — que es justo
 * el desmontaje que esto evita. Aquí las dos caras (encendido / apagado) están
 * escritas una al lado de la otra y se ve de un vistazo qué repone el apagado.
 *
 * Las clases son literales de texto y no plantillas con variables PORQUE
 * TAILWIND LEE EL CÓDIGO COMO TEXTO: una clase compuesta en tiempo de ejecución
 * no llega nunca al CSS. Por eso este archivo no importa nada de `@/lib/motion`
 * aunque las amplitudes vivan allí (`INTERACCION`): no hay forma de que las
 * consuma. Cada clase de aquí cita en su comentario el campo que representa, y
 * `INTERACCION` cita de vuelta la clase que lo escribe.
 *
 * ── `prefers-reduced-motion` NO APARECE EN NINGUNA PARTE, Y ES CORRECTO ────
 * Los cinco efectos son transiciones CSS, y `globals.css` colapsa TODA
 * transición CSS a 0,01ms cuando la preferencia está activa. Con ella puesta,
 * el hover sigue cambiando el aspecto —foto acercada, hito acercado, filete
 * puesto, anillo cerrado, botón hundido— pero sin recorrido. No hay nada que
 * ramificar: el estado final es el mismo, lo único que desaparece es el camino
 * hasta él. Por eso los cinco se resuelven en CSS y ninguno en JS.
 *
 * ── EL HOVER NO SE QUEDA PEGADO EN TÁCTIL ─────────────────────────────────
 * Tailwind v4 envuelve `hover:` y `group-hover:` en `@media (hover: hover)`, así
 * que en un móvil esas reglas no existen y no hay estado a medias que limpiar al
 * tocar y soltar. `active:` —el hundimiento— sí se genera sin envolver, que es
 * lo que se quiere: ahí el gesto es pulsar, y en táctil también se pulsa.
 */

/* ── 1. Cards de familia con hover ──────────────────────────────────────── */

/** `CategoryCard`: la foto se acerca y el bloque de texto sube. */
export const HOVER_EN_CARDS_DE_FAMILIA = true;

/**
 * Acercamiento de la foto, 1,10 (`INTERACCION.cardDeFamilia.escalaFoto`).
 *
 * ARRANCÓ SIENDO EL `zoomOnGroupHover` DE `ImagePlaceholder` Y YA NO LO ES, por
 * una razón de calibración: ese prop escribe un 1,04 fijo que comparten
 * `SubcategoryTile` y el muestrario de blancos, así que subirlo movía tres
 * pantallas a la vez y por fuera de este interruptor. La card escala su propia
 * capa de imagen —el contenedor del `ImagePlaceholder`, que es exactamente la
 * caja de la foto y del marcador— y así se calibra sola.
 *
 * Si 1,10 se queda, hay una decisión que tomar y no la resuelve este archivo:
 * si las tiles de subcategoría y las de blancos deben seguir a la card o quedarse
 * en 1,04. Hoy divergen a propósito, mientras se juzga.
 */
export const CLASES_FOTO_DE_CARD = HOVER_EN_CARDS_DE_FAMILIA
  ? "transition-transform duration-500 ease-revelar group-hover:scale-[1.1]"
  : "";

/**
 * Subida del bloque de texto: 10px, y el mismo par duración/curva que la foto
 * (`INTERACCION.cardDeFamilia`). Van juntos a propósito — son un gesto, no dos:
 * con tiempos distintos la card se leería como dos cosas moviéndose a la vez.
 *
 * A 10px el texto sigue dentro del tramo denso del velo (arranca a 30px del
 * borde inferior por el `p-7.5`), así que el contraste no baja. Es también el
 * motivo por el que este es el valor que antes tocará bajar si algo se pasa: por
 * encima de ~20px el bloque empieza a salirse de donde el degradado es opaco.
 *
 * `transition-transform` y no `transition-[transform]`: en Tailwind v4 la
 * utilidad con nombre cubre `transform, translate, scale, rotate`, y la
 * subida se aplica con la propiedad `translate`. La lista arbitraria con
 * `transform` dentro NO la cubriría (ver `buttonVariants`).
 */
export const CLASES_TEXTO_DE_CARD = HOVER_EN_CARDS_DE_FAMILIA
  ? "transition-transform duration-500 ease-revelar group-hover:-translate-y-2.5"
  : "";

/* ── 2. Botones con respuesta al pulsar ─────────────────────────────────── */

/** Sistema de botones entero: se hunde 3px mientras se mantiene pulsado. */
export const HUNDIMIENTO_EN_BOTONES = true;

/**
 * La lista de propiedades en transición del botón, con `translate` dentro.
 *
 * NO ES DECORACIÓN, ES LO QUE HACE QUE EL HUNDIMIENTO SE VEA. Tailwind v4 aplica
 * `translate-y-*` con la propiedad CSS `translate`, que es independiente de
 * `transform`: una transición declarada sobre `transform` no la cubre y el
 * desplazamiento salta de golpe. La lista de la izquierda es la de siempre más
 * `translate`; la de la derecha es la que había, intacta.
 *
 * Efecto lateral conocido de encenderlo: la elevación de 2px que ya tenían
 * `solida` y `contorno` en hover (`hover:-translate-y-0.5`) pasa también a
 * transicionar, porque arrastra la misma propiedad. Hoy salta —quedó así al
 * migrar a v4— y con esto se asienta. Es una corrección, pero va atada a este
 * interruptor para que apagar los cuatro deje el sitio idéntico y la comparación
 * sea limpia.
 *
 * LA DURACIÓN VIAJA AQUÍ, y eso arrastra al color. `transition-duration` es una
 * sola declaración para todas las propiedades de la lista, así que subir el
 * hundimiento a 400ms sube también el cruce de relleno, borde y texto del hover,
 * que estaba en 220. Se podría separar con una lista de duraciones por posición
 * y no se hace: sería un valor atado al ORDEN de la lista de arriba, ilegible y
 * fácil de descuadrar. Mientras se calibra, el botón entero responde en el mismo
 * tiempo —que además es lo que se quiere juzgar: el botón, no una propiedad—.
 * Apagado, vuelve a 220ms y a la lista de siempre.
 */
export const CLASES_TRANSICION_DE_BOTON = HUNDIMIENTO_EN_BOTONES
  ? "transition-[background-color,border-color,color,transform,translate] duration-400"
  : "transition-[background-color,border-color,color,transform] duration-220";

/**
 * 3px, `INTERACCION.hundimientoDeBoton`. En una caja de 48px de alto y con la
 * elevación de hover a 2px por encima, el recorrido visible al pulsar es de 5px
 * —de −2 a +3—, que es lo que hace falta para poder decir si sobra o falta.
 *
 * Va después del hover en el orden de variantes de Tailwind, así que mientras se
 * mantiene pulsado gana al `hover:-translate-y-0.5` y el botón baja de verdad en
 * vez de quedarse elevado. No toca `:focus-visible` —que es un contorno, no un
 * desplazamiento— ni ningún `:active` existente: no había ninguno.
 */
export const CLASES_HUNDIMIENTO_DE_BOTON = HUNDIMIENTO_EN_BOTONES
  ? "active:translate-y-0.75"
  : "";

/**
 * Añadido a la transición EN LÍNEA del gesto magnético (`useMagnetic`).
 *
 * El gesto magnético escribe `style={{ transition: "transform …" }}` en el
 * elemento, y un `transition` en línea gana a la clase entera: sin esto, los
 * botones magnéticos —la `solida` de los cuatro formularios y los siete
 * `MagneticLink`— serían los únicos del sitio donde el hundimiento salta. Se
 * añade `translate` conservando el `transform 300ms` del magnetismo, que es
 * suyo y no se toca.
 */
export const TRANSICION_HUNDIMIENTO_EN_LINEA = HUNDIMIENTO_EN_BOTONES
  ? ", translate 400ms cubic-bezier(0.4, 0, 0.2, 1)"
  : "";

/* ── 3. Enlaces con el filete que se traza ──────────────────────────────── */

/**
 * Variante `enlace` del sistema de botones: el subrayado se dibuja de izquierda
 * a derecha en vez de aparecer de golpe.
 *
 * ALCANCE. Se aplica en un solo sitio —la variante `enlace`— y eso cubre los 16
 * enlaces de texto en contenido del sitio, ni uno más. No entra en la navegación
 * (`Navbar` ya traza su propio filete, `Breadcrumb` y `Footer` marcan con
 * color), ni en los botones con caja (`solida`, `contorno`, `whatsapp`), que no
 * llevan subrayado. La clase vive en `globals.css` porque necesita un `::after`,
 * y un pseudo-elemento no se puede escribir desde el JSX.
 */
export const FILETE_TRAZADO_EN_ENLACES = true;

/**
 * Encendido: el filete lo dibuja `.filete-trazado`. Apagado: vuelve el
 * `border-b` que se pinta entero de una vez, que es lo que había.
 *
 * El `border-b border-transparent` de la variante se queda puesto en los dos
 * casos: es lo que reserva el hueco del filete, y es por lo que activarlo no
 * mueve el texto ni cambia la altura de línea.
 */
export const CLASES_FILETE_DE_ENLACE = FILETE_TRAZADO_EN_ENLACES
  ? "filete-trazado"
  : "hover:border-(color:--sup-tinta)";

/* ── 4. Swatches de color con confirmación ──────────────────────────────── */

/**
 * `SwatchesRecoloreo`: el anillo de selección se cierra alrededor del swatch.
 *
 * SOLO EL ANILLO. El cambio de color de la tela no se toca y sigue donde estaba
 * (`RECOLOREO.cambioDeTono`, en `TelaTenida`): todo el valor del recoloreo está
 * en comparar dos tonos tocando de un lado a otro.
 */
export const CIERRE_DEL_ANILLO_EN_SWATCHES = true;

/**
 * El anillo pasa a ser una capa propia porque un `box-shadow` no se puede
 * escalar: crece de golpe o no crece. Como capa, entra al 115%
 * (`INTERACCION.anilloDeSwatch.escalaInicial`) y se cierra hasta el borde del
 * swatch. Al cambiar de color, el anillo del anterior se abre y se va mientras
 * el del nuevo se cierra — el mismo gesto en las dos direcciones.
 *
 * `pointer-events-none` para no robarle el clic al botón que la contiene, y
 * `aria-hidden` porque el estado ya lo dice `aria-pressed`.
 */
export const CLASES_BOTON_DE_SWATCH = CIERRE_DEL_ANILLO_EN_SWATCHES
  ? "relative"
  : "";

/** Clases de la capa del anillo, según el swatch esté elegido o no. */
export function clasesAnilloDeSwatch(activo: boolean) {
  return activo
    ? "pointer-events-none absolute inset-0 rounded-full transition-[opacity,scale] duration-400 ease-asentar scale-100 opacity-100"
    : "pointer-events-none absolute inset-0 rounded-full transition-[opacity,scale] duration-400 ease-asentar scale-115 opacity-0";
}

/* ── 5. Hitos de la línea de tiempo con hover ───────────────────────────── */

/**
 * `Timeline`: al señalar un hito se acerca la TARJETA ENTERA —foto, año, título
 * y descripción—, no solo la foto.
 *
 * Va el quinto porque el orden de este archivo es el de la tanda: los cuatro
 * primeros se calibran juntos y este entra después, con la línea de hitos ya en
 * horizontal. Se mira igual que los otros y se apaga igual.
 *
 * SUSTITUYE AL `zoomOnGroupHover` DE LA FOTO, no se suma a él. Con los dos
 * puestos habría dos acercamientos anidados —la foto al 1,04 dentro de una
 * tarjeta al 1,04— y el marco se leería como si resbalara por dentro. El hito es
 * una pieza: o se mueve entero o no se mueve.
 */
export const HOVER_EN_HITOS_DE_LINEA = true;

/**
 * Acercamiento de la tarjeta, 1,04 (`INTERACCION.hitoDeLinea.escala`), con el
 * mismo par duración/curva que la card de familia: 500ms y `revelar`. Es el
 * mismo gesto que el del catálogo y por eso comparte tiempos, aunque no
 * amplitud — el porqué, en `INTERACCION.hitoDeLinea`.
 *
 * ESTAS CLASES NO PUEDEN IR EN EL MISMO NODO QUE ANIMA GSAP, y no es cuestión de
 * gusto: al tomar el control de las transformaciones de un elemento, GSAP le
 * escribe EN LÍNEA `translate: none; rotate: none; scale: none` para que su
 * matriz de `transform` sea la única fuente. Un estilo en línea gana a cualquier
 * hoja, así que puesto sobre `[data-timeline-content]` —que es lo que GSAP anima
 * al entrar en pantalla— el acercamiento no ocurre: la regla casa, el `:hover`
 * está puesto y el `scale` calculado se queda en `none`. `Timeline` lo resuelve
 * con un nodo dentro del que anima GSAP; quien reutilice esto tiene el mismo
 * deber.
 *
 * `transition-[scale]` Y NO `transition-transform`, que sería lo habitual. En
 * Tailwind v4 `scale-*` se aplica con la propiedad `scale`, independiente de
 * `transform`, y la utilidad con nombre cubre las cuatro (`transform, translate,
 * scale, rotate`). Nombrar solo la que se mueve deja fuera de la transición
 * cualquier `transform` que ponga GSAP en un ancestro y evita heredar el
 * problema de arriba por la puerta de al lado.
 *
 * EL ORIGEN NO ESTÁ AQUÍ, a propósito: depende de a qué lado de la línea caiga
 * el hito (`origin-bottom` arriba, `origin-top` abajo) y eso es maquetación del
 * componente, no calibración de la tanda. Lo que sí es común es la consecuencia
 * buscada: el borde pegado a la línea se queda quieto y la tarjeta crece hacia
 * afuera, así que la línea de tiempo no se mueve al señalar un hito.
 */
export const CLASES_HITO_DE_LINEA = HOVER_EN_HITOS_DE_LINEA
  ? "transition-[scale] duration-500 ease-revelar group-hover:scale-[1.04]"
  : "";
