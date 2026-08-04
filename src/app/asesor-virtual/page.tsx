import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AsesorWizard } from "@/components/ui/AsesorWizard";
import { FondoHero } from "@/components/ui/FondoHero";

export const metadata: Metadata = {
  title: "Asesor Virtual — Textil Padilla",
  description:
    "Tres preguntas y una recomendación técnica concreta: referencia, gramaje y tono, lista para pedir muestra.",
};

/**
 * Única página CENTRADA del sitio, a propósito.
 *
 * El resto es editorial y alineado a la izquierda. Aquí no: esto no es una
 * página de contenido, es un flujo de tarea, y centrar la columna quita
 * decisiones de recorrido visual mientras la persona responde. Lo que mantiene
 * la página reconocible como parte del sitio es todo lo demás —el breadcrumb
 * sigue en el margen izquierdo, la banda de llegada es la misma que la de
 * /empresa o /contacto, y el `Container` conserva el canalón
 * `clamp(24px,7vw,120px)`: la columna centrada es un max-width DENTRO de él, no
 * una retícula nueva.
 *
 * LA FOTO SOLO CUBRE LA BANDA DE LLEGADA. Antes `FondoHero` era `inset-0` del
 * contenedor que envolvía la página entera, así que la fotografía de fachada
 * corría también por detrás de la pregunta y de las opciones: el indicador de
 * pasos caía sobre un cartel de "PELIGRO" y cada opción competía con el
 * edificio. Partir la página en dos bandas es lo que deja el flujo sobre tinta
 * plana. No cambiar sin volver a mirar qué queda debajo del texto.
 */
export default function AsesorVirtualPage() {
  return (
    <div className="bg-ink text-paper">
      <div className="relative overflow-hidden">
        <FondoHero slot="hero-asesor-virtual" />
        {/*
         * Velo adicional, SOLO en esta página.
         *
         * `FondoHero` calibró su suelo de tinta (0,32) y su degradado a 115°
         * para texto alineado a la IZQUIERDA: el degradado va de 0,86 a 0,15
         * de izquierda a derecha, así que protege justo el tercio donde caen
         * los titulares del resto del sitio. Esta página centra la columna, y
         * al centrarla el texto sale de esa zona protegida y aterriza sobre la
         * pared clara de la fotografía. Medido: el párrafo caía a 4,28:1 en el
         * peor píxel bajo glifo a 375 (mínimo 4,5 para 20px normal).
         *
         * Más fuerte por debajo de `sm` porque ahí el recorte es más cerrado y
         * la pared ocupa más cuadro. A 1440 el texto ya cumplía sin esto; el
         * velo de escritorio solo da margen.
         *
         * Va aquí y no en `FondoHero` a propósito: ese componente lo comparten
         * los seis heroes del sitio y ninguno de los otros centra su columna.
         */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-ink/30 sm:bg-ink/15" />
        {/*
         * MISMA GEOMETRÍA QUE `Hero`, no una altura escrita a mano.
         *
         * Esta banda medía 448px a 1440 y 392 a 375, casi 200 menos que
         * cualquier otra cabecera del sitio. La causa no era el contenido: era
         * que aquí el relleno se puso a mano (`py-16 sm:py-20` en la banda) y
         * faltaba el suelo `min-h-[70vh]` que sí tiene el `Container` de `Hero`
         * —el mismo suelo del que salen los 630px de Dortmund Plus—. Ahora la
         * regla es la de todos: suelo de 70vh y `py-24`. Si esta cabecera queda
         * en el suelo y otra más alta, es porque su titular es más corto, que es
         * exactamente como varía el resto del grupo.
         *
         * Va aquí y no envolviendo la banda porque el fondo tiene que seguir
         * llegando a sangre por detrás del relleno.
         */}
        <Container className="relative flex min-h-[70vh] flex-col justify-center py-24">
          {/* El breadcrumb NO se centra: es chrome del sitio y es lo que ancla
              la página a la retícula editorial del resto. */}
          <Breadcrumb
            tone="dark"
            items={[{ label: "Inicio", href: "/" }, { label: "Asesor virtual" }]}
            className="mb-10"
          />
          {/*
           * Titular entero en `text-paper`, sin el tramo en `text-brand` que
           * tenía antes. Medido sobre esta foto: el azul de marca daba 2,70:1
           * en el peor píxel bajo glifo y el mínimo para texto grande es 3:1.
           * `#33a2dc` necesita un fondo de luminancia ≤ 0,072 (gris ~rgb(77))
           * para llegar, y el cielo de esta fachada no baja de ahí. En paper el
           * mismo peor píxel da 6,92:1. El azul de marca sigue en la página, en
           * el eyebrow de cada pregunta y en la regla de progreso.
           */}
          <h1 className="mx-auto max-w-3xl text-center font-sans text-display font-medium">
            Tres preguntas.
            <br />
            Tu tela exacta.
          </h1>
          {/* `text-pretty` evita que "ti." se quede sola en una tercera línea
              a 375. Centrado, un huérfano de una palabra se ve mucho más. */}
          <p className="mx-auto mt-6 max-w-lg text-pretty text-center font-serif text-body-l text-paper">
            Responde tres preguntas y te recomendamos el textil perfecto para ti.
          </p>
        </Container>
      </div>

      <div className="pb-20 pt-14 sm:pb-28 sm:pt-16">
        <Container>
          <AsesorWizard />
        </Container>
      </div>
    </div>
  );
}
