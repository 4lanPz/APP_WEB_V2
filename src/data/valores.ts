/**
 * LOS CUATRO VALORES Y LA CITA DE CIERRE — RETIRADOS DE /empresa, CONSERVADOS.
 *
 * La sección «Los valores que no negociamos» se quitó de la página a petición de
 * marketing (agosto de 2026). El contenido NO se borró: está aquí entero, tal
 * cual se publicaba, para que reponerlo sea volver a montar la sección y no
 * volver a escribir los textos.
 *
 * POR QUÉ UN ARCHIVO Y NO EL HISTORIAL DE GIT. Recuperar de git exige saber que
 * hubo algo que recuperar, y eso es justo lo que se pierde: dentro de seis meses
 * nadie va a buscar en el historial una sección cuya existencia desconoce. Un
 * archivo en `src/data/` sale en cualquier búsqueda por «valores» y se lee sin
 * arqueología.
 *
 * NO LO IMPORTA NADIE AHORA MISMO, y es correcto. Si algún día el linter avisa
 * de módulo sin usar, la decisión es reponer la sección o borrar el archivo —no
 * silenciar el aviso—.
 *
 * LA SECCIÓN NO TENÍA NINGÚN HUECO DE IMAGEN: eran cuatro filas de título y
 * texto separadas por filete, más la cita. Por eso al retirarla no se dio de baja
 * ningún slot ni cambió el encargo de fotografía.
 *
 * ESTABA PENDIENTE DE REDISEÑO cuando se retiró, y el encargo anterior dejó
 * escrito cómo tenía que volver: en `Container ancho="amplio"` y como rejilla de
 * cuatro piezas, no como lista de filas a todo lo ancho. Se anota aquí porque
 * era lo único que quedaba de esa decisión y vivía en un comentario de la página
 * que se ha ido con la sección.
 *
 * Y SE ANOTA TAMBIÉN EN `docs/pendientes.md` §2, porque este archivo lo abre
 * quien ya sabe que la sección existió —nadie llega aquí por casualidad, y menos
 * ahora que no lo importa ningún módulo—. La decisión de rediseño no sobrevive
 * escrita solo en el sitio que hay que conocer para encontrarla.
 */

export interface Valor {
  title: string;
  description: string;
}

export const VALORES: Valor[] = [
  {
    title: "Herencia",
    description:
      "El oficio como legado. Manos que conocen la tela por el tacto antes que por la ficha, y una memoria de taller que se transmite entre tiradas. No presumimos de tradición: la usamos.",
  },
  {
    title: "Precisión",
    description:
      "La tela como sistema. Gramaje, torsión, densidad y solidez del color: nada se deja al azar y todo se documenta. Hablamos en unidades —metros, gramos, referencias— porque el criterio se demuestra con datos.",
  },
  {
    title: "Vanguardia",
    description:
      "La materia al servicio de lo que aún no existe. Teñido a demanda, color exacto y respuesta ágil: tradición puesta a trabajar para que otros construyan sobre una base que no falla.",
  },
  {
    title: "Reserva",
    description:
      "La marca nunca grita. Preferimos la afirmación a la exclamación y el trabajo bien hecho al ruido. Servimos al color del cliente desde el criterio de quien conoce la materia —servicial, sin sumisión.",
  },
];

/** Rótulo mono que encabezaba la sección. */
export const ROTULO_VALORES = "Los valores que no negociamos";

/**
 * La cita que cerraba la sección. Iba en serif itálica a `text-body-l`, debajo
 * de las cuatro filas.
 *
 * OJO SI SE REPONE: esta frase TAMBIÉN aparece en el footer del sitio, que la
 * publica en todas las páginas. Mientras la sección estuvo montada, quien
 * llegaba al final de /empresa la leía dos veces seguidas.
 */
export const CITA_VALORES =
  "«No fabricamos la moda. Fabricamos aquello con lo que la moda se hace.»";
