import { cn } from "@/lib/cn";

export interface FlechaCarrilProps {
  /** Hacia dónde mueve. Decide el glifo; el nombre accesible va aparte. */
  direccion: "anterior" | "siguiente";
  /** Nombre accesible: «Hitos anteriores», «Evento siguiente»… */
  etiqueta: string;
  onClick: () => void;
  /** Apagada porque el carril ya está en ese extremo. */
  disabled?: boolean;
}

/**
 * FLECHA DE CARRIL — el mando de recorrer una fila, en un solo sitio.
 *
 * Estaba escrita tres veces: la constante `FLECHA` de la línea de hitos y las
 * dos clases en línea del carrusel de encuentros. Mismo gesto, mismo aspecto y
 * —lo que la ha traído aquí— el mismo defecto: 36×36 px, por debajo del mínimo
 * táctil de 44. Arreglarlo en dos ficheros era arreglarlo dos veces y arriesgarse
 * a que el tercero que aparezca vuelva a nacer con 36.
 *
 * ── LA CAJA CRECE, LA FLECHA NO ───────────────────────────────────────────
 *
 * El botón mide 44 px y el filete que se ve mide 36, centrado dentro. Es el
 * mismo reparto que ya usan los puntos del carrusel —donde el punto mide 8 px y
 * su botón 44— y por la misma razón: el objetivo táctil es EL CONTROL, no lo que
 * se pinta. Medido sobre un pseudo-elemento no contaría, porque un `::after` no
 * recibe el toque; medido sobre un padre que además hace de contenedor,
 * tampoco, porque el área quedaría a merced del layout de al lado.
 *
 * Ninguna de las dos piezas cambia de aspecto: el filete sigue siendo la misma
 * caja de 36 con el mismo borde y el mismo glifo. Lo que cambia es que hay 4 px
 * invisibles alrededor que también reciben el toque. Quien las coloca se
 * encarga de descontar esos 4 px de su separación —`gap-2` donde había `gap-4`,
 * `gap-1` donde había `gap-3`— para que el aire ENTRE FILETES siga siendo el
 * mismo que antes.
 *
 * ── POR QUÉ IMPORTA MÁS AHORA ─────────────────────────────────────────────
 *
 * Las dos ya salían en el §8 de la auditoría de consistencia, así que el fallo
 * no lo introduce nadie hoy. Lo que ha cambiado es el peso: desde que la línea
 * de hitos no pinta barra de scroll, estas flechas son el mando principal para
 * recorrer nueve hitos, y un control que falla al tocarse en un móvil es de lo
 * que antes se nota.
 *
 * ── EL ANILLO DE FOCO VA EN EL BOTÓN, CON DESPLAZAMIENTO NEGATIVO ─────────
 *
 * Lo obvio sería dibujarlo sobre el filete —es lo que se ve— y sería un error de
 * los que no se notan hasta que alguien navega con teclado: la auditoría toma la
 * huella de estilo DEL CONTROL antes y después de enfocarlo, y si el anillo lo
 * pinta un hijo, el botón sale sin cambio y se reporta como foco invisible. Va
 * en el botón, que es además lo que dice WCAG 2.4.7.
 *
 * `-outline-offset-2` y no `outline-offset-2`: el desplazamiento se mide desde
 * el borde de la caja de 44, así que en positivo el anillo quedaría a 6 px del
 * filete y se leería suelto. En −2 el anillo cae a 40 px, o sea 2 px por fuera
 * del filete de 36: exactamente donde estaba cuando el botón medía 36.
 */
export function FlechaCarril({
  direccion,
  etiqueta,
  onClick,
  disabled,
}: FlechaCarrilProps) {
  return (
    <button
      type="button"
      aria-label={etiqueta}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex size-11 items-center justify-center",
        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
      )}
    >
      {/*
        El hover se dispara desde el botón (`group-hover`) y no desde el filete:
        si los 4 px de más reciben el clic, tienen que encender también la
        respuesta, o habría un anillo de píxeles que actúa sin avisar de que
        actúa.
      */}
      <span
        aria-hidden
        className={cn(
          "flex size-9 items-center justify-center border border-graphite text-ink",
          "transition-colors duration-220 ease-asentar group-hover:border-ink",
          "group-disabled:border-greige group-disabled:text-greige",
        )}
      >
        {direccion === "anterior" ? "←" : "→"}
      </span>
    </button>
  );
}
