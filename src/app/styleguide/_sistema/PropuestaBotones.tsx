import { cn } from "@/lib/cn";
import { Muestra } from "./Medidor";
import {
  BASE,
  FLOTANTE_CAJA,
  HOY,
  PROPUESTA,
  VERDES,
  type Estado,
  type Tono,
} from "./variantes";

/**
 * PROPUESTA COMPLETA DEL SISTEMA DE BOTONES — solo styleguide.
 *
 * Ninguna página del sitio usa nada de esto todavía. El objetivo es poder
 * decidir mirando, no leyendo tablas: cada variante aparece como está HOY y
 * como se propone, una al lado de la otra, en sus cuatro estados y sobre las
 * dos superficies que existen en el sitio (clara y oscura).
 *
 * Los contrastes de debajo de cada muestra los calcula el navegador en vivo
 * (ver `Medidor.tsx`), no están escritos a mano.
 */

const ESTADOS: Estado[] = ["reposo", "hover", "foco", "inhabilitado"];

function GlifoWhatsApp({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={cn("size-5", className)}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.898 9.825 9.825 0 012.892 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function Titulo({ n, children, nota }: { n: string; children: React.ReactNode; nota?: React.ReactNode }) {
  return (
    <div className="mb-8 mt-20 flex flex-col gap-2 border-t border-ink pt-8">
      <span className="font-mono text-label uppercase text-accent">{n}</span>
      <h3 className="font-sans text-h2 font-medium text-ink">{children}</h3>
      {nota && <p className="max-w-2xl font-serif text-body-m text-graphite">{nota}</p>}
    </div>
  );
}

/** Una columna: los cuatro estados de una misma variante sobre un mismo tono. */
function Columna({
  titulo,
  clases,
  tono,
  etiqueta,
  glifo = false,
  sinLimite = false,
  destacar = false,
}: {
  titulo: string;
  clases: Record<Estado, string>;
  tono: Tono;
  etiqueta: string;
  glifo?: boolean;
  sinLimite?: boolean;
  destacar?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-px bg-greige", destacar && "outline outline-2 outline-accent")}>
      <div className={cn("px-5 py-3", tono === "oscuro" ? "bg-brand-deep" : "bg-bone")}>
        <span
          className={cn(
            "font-mono text-micro uppercase",
            tono === "oscuro" ? "text-paper" : "text-ink",
          )}
        >
          {titulo}
        </span>
      </div>
      {ESTADOS.map((e) => (
        <Muestra key={e} tono={tono} etiqueta={e} sinLimite={sinLimite} exento={e === "inhabilitado"}>
          <button
            type="button"
            data-medir
            disabled={e === "inhabilitado"}
            className={cn(BASE, clases[e], e === "inhabilitado" && "pointer-events-none")}
          >
            {glifo && <GlifoWhatsApp />}
            {etiqueta}
          </button>
        </Muestra>
      ))}
    </div>
  );
}

/** Bloque de una variante: hoy vs propuesta, en claro y en oscuro. */
function Bloque({
  n,
  nombre,
  porQue,
  hoy,
  propuesta,
  etiqueta,
  glifo = false,
  sinLimite = false,
}: {
  n: string;
  nombre: string;
  porQue: React.ReactNode;
  hoy: Record<Tono, Record<Estado, string>>;
  propuesta: Record<Tono, Record<Estado, string>>;
  etiqueta: string;
  glifo?: boolean;
  sinLimite?: boolean;
}) {
  return (
    <div className="mb-14">
      <div className="mb-5 flex flex-col gap-1.5">
        <span className="font-mono text-label uppercase text-graphite">{n}</span>
        <h4 className="font-sans text-body-l font-medium text-ink">{nombre}</h4>
        <p className="max-w-3xl font-serif text-body-m text-graphite">{porQue}</p>
      </div>
      {/* Pares en dos columnas hasta 2xl. A cuatro columnas la celda se queda en
          ~205px y un botón con glifo y `whitespace-nowrap` mide 257: se salía de
          su caja. En pares, «hoy» y «propuesta» del mismo tono siguen quedando
          uno al lado del otro, que es la comparación que importa. */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-4">
        <Columna titulo="Hoy · claro" clases={hoy.claro} tono="claro" etiqueta={etiqueta} glifo={glifo} sinLimite={sinLimite} />
        <Columna titulo="Propuesta · claro" clases={propuesta.claro} tono="claro" etiqueta={etiqueta} glifo={glifo} sinLimite={sinLimite} destacar />
        <Columna titulo="Hoy · oscuro" clases={hoy.oscuro} tono="oscuro" etiqueta={etiqueta} glifo={glifo} sinLimite={sinLimite} />
        <Columna titulo="Propuesta · oscuro" clases={propuesta.oscuro} tono="oscuro" etiqueta={etiqueta} glifo={glifo} sinLimite={sinLimite} destacar />
      </div>
    </div>
  );
}

/** Fila de la tabla final de mapeo. */
function Mapa({
  gesto,
  antes,
  ahora,
  nota,
}: {
  gesto: string;
  antes: string;
  ahora: string;
  nota?: string;
}) {
  return (
    <tr className="border-b border-greige align-top">
      <td className="py-3 pr-6 font-sans text-body-s font-medium text-ink">{gesto}</td>
      <td className="py-3 pr-6 font-serif text-body-s text-graphite">{antes}</td>
      {/* font-medium: la mono no tiene 600 cargado y el navegador lo sintetiza. */}
      <td className="py-3 pr-6 font-mono text-mono font-medium text-ink">{ahora}</td>
      <td className="py-3 font-serif text-body-s text-graphite">{nota}</td>
    </tr>
  );
}

export function PropuestaBotones() {
  return (
    <div className="border-t border-ink py-16">
      <div className="mb-4 flex flex-col gap-2">
        <span className="font-mono text-label uppercase text-accent">
          Sistema de botones y CTA · aplicado
        </span>
        <h2 className="font-sans text-display font-medium text-ink">
          Cuatro variantes
        </h2>
      </div>
      <p className="mb-6 max-w-3xl font-serif text-body-l text-graphite">
        Esto es lo que pintan las doce rutas. Antes había tres variantes declaradas y{" "}
        <strong className="text-ink">cinco tratamientos distintos solo para navegación
        interna</strong>; WhatsApp no tenía ninguno. El sistema baja a cuatro y cubre los
        cinco gestos del inventario. Las columnas «hoy» de más abajo son{" "}
        <strong className="text-ink">lo que había antes</strong>, conservadas para poder
        comparar contra lo que se publicó.
      </p>
      <p className="mb-10 max-w-3xl font-serif text-body-m text-graphite">
        Los números bajo cada muestra los mide el navegador en vivo sobre lo que hay
        pintado, resolviendo el color en un canvas —Tailwind v4 devuelve{" "}
        <code className="font-mono text-mono text-ink">oklch()</code> y parsearlo a mano
        da cifras falsas—. <strong className="text-ink">texto</strong> es el mínimo de
        WCAG 1.4.3 según el tamaño real; <strong className="text-ink">relleno</strong> y{" "}
        <strong className="text-ink">borde</strong> son el límite del control contra la
        página, 1.4.11, mínimo 3:1. La columna con filete terracota es la propuesta.
      </p>

      {/* ─────────────────────────────────────────────────────────────── */}
      <Titulo
        n="A · Las cuatro variantes"
        nota="Cada una en sus cuatro estados, sobre superficie clara y oscura. Ojo a las dos columnas «hoy · oscuro» de contorno y enlace: hoy esas variantes no tienen versión oscura, así que sobre un hero se pintan con las mismas clases y desaparecen. Es la razón de que todos los heroes acaben usando el azul."
      >
        Variante a variante, hoy contra propuesta
      </Titulo>

      <Bloque
        n="01"
        nombre="Sólida — la acción con más peso"
        porQue={
          <>
            El cambio es el color del texto: <code className="font-mono text-mono">text-ink</code>{" "}
            en vez de <code className="font-mono text-mono">text-paper</code>. El azul de marca es
            un color claro y solo admite texto oscuro. En claro suma un filete de tinta porque el
            relleno azul contra <code className="font-mono text-mono">paper</code> no llega a 3:1 y
            el botón se queda sin borde reconocible; sobre tinta no hace falta.
          </>
        }
        hoy={HOY.primary}
        propuesta={PROPUESTA.solida}
        etiqueta="Solicitar muestra →"
      />

      <Bloque
        n="02"
        nombre="Contorno — el caballo de batalla"
        porQue={
          <>
            El borde pasa de <code className="font-mono text-mono">greige</code> a{" "}
            <code className="font-mono text-mono">graphite</code>: en un botón sin relleno el borde
            es el botón, y greige contra paper no llega a 3:1. Y estrena versión oscura, que hoy no
            existe.
          </>
        }
        hoy={HOY.secondary}
        propuesta={PROPUESTA.contorno}
        etiqueta="Ver ficha técnica →"
      />

      <Bloque
        n="03"
        nombre="Enlace — terciario, dentro del texto"
        porQue={
          <>
            Absorbe el <code className="font-mono text-mono">ghost</code> de hoy y también los
            enlaces de texto escritos a mano que hacen de CTA. El hover deja de ir a{" "}
            <code className="font-mono text-mono">text-brand</code> y se marca con el subrayado,
            que ya era el gesto del ghost.
          </>
        }
        hoy={HOY.ghost}
        propuesta={PROPUESTA.enlace}
        etiqueta="Descargar catálogo →"
        sinLimite
      />

      <Bloque
        n="04"
        nombre="Enlace de texto escrito a mano → absorbido por «enlace»"
        porQue={
          <>
            Era el <code className="font-mono text-mono">secondaryCta</code> del hero y los «Ver
            ficha →» de las tarjetas: mismo gesto, tres implementaciones distintas y ninguna
            variante. Su hover en <code className="font-mono text-mono">text-brand</code> falla
            sobre claro.
          </>
        }
        hoy={HOY.enlaceTexto}
        propuesta={PROPUESTA.enlace}
        etiqueta="Ver nuestros locales →"
        sinLimite
      />

      <Bloque
        n="05"
        nombre="WhatsApp — la única variante nueva"
        porQue={
          <>
            Existe porque el destino cambia de canal: se sale de la web a una conversación. El
            glifo pasa de blanco a tinta —el blanco sobre el verde da 1,98:1 y no llega ni al
            mínimo no textual—. Y deja de ser un enlace mono de 13px escondido entre el teléfono y
            el correo.
          </>
        }
        hoy={HOY.enlaceTexto}
        propuesta={PROPUESTA.whatsapp}
        etiqueta="Escribir por WhatsApp"
        glifo
      />

      {/* ─────────────────────────────────────────────────────────────── */}
      <Titulo
        n="B · WhatsApp, tres opciones"
        nota="Cada opción en sus dos formas —flotante de solo icono y botón con texto— y sobre las dos superficies. El umbral no es el mismo: 3:1 para el glifo, 4,5:1 en cuanto lleva texto. «relleno» es el límite del botón contra la página."
      >
        Qué verde y qué color de glifo
      </Titulo>

      <div className="mb-8 min-w-0 overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="border-b border-ink">
              <th className="pb-3 pr-4 font-mono text-label uppercase text-graphite">Verde</th>
              <th className="pb-3 pr-4 font-mono text-label uppercase text-graphite">Blanco</th>
              <th className="pb-3 pr-4 font-mono text-label uppercase text-graphite">vs paper</th>
              <th className="pb-3 pr-4 font-mono text-label uppercase text-graphite">vs ink</th>
              <th className="pb-3 font-mono text-label uppercase text-graphite">De dónde sale</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["#25D366", "1,98", "1,78", "8,82", "Verde primario. El que usa el sitio hoy.", false],
              ["#1DA851", "3,10", "2,78", "5,64", "Verde de hover, ya en BotonWhatsApp.tsx.", false],
              ["#00A884", "3,03", "2,71", "5,77", "Teal del interfaz actual de la app.", false],
              ["#008069", "4,89", "4,38", "3,57", "Cabecera de WhatsApp Web y Business.", true],
              ["#128C7E", "4,14", "3,71", "4,23", "Teal Green, paleta clásica de marca.", false],
              ["#075E54", "7,67", "6,87", "2,28", "Teal Green Dark, paleta clásica.", false],
              ["#005C4B", "7,98", "7,15", "2,19", "Burbuja saliente en modo oscuro.", false],
            ].map(([hex, bl, vp, vi, origen, elegido]) => (
              <tr
                key={hex as string}
                className={cn(
                  "border-b border-greige align-top",
                  elegido && "bg-bone",
                )}
              >
                {/* Sin `<strong>`: la mono no tiene 700 cargado y a este
                    tamaño la negrita sintética solapa los glifos. La fila
                    elegida se marca con el plano `bone` y un cuadro de acento. */}
                <td className="py-2.5 pr-4 font-mono text-mono text-ink">
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className={cn("block size-1.5 shrink-0", elegido ? "bg-accent" : "bg-transparent")}
                    />
                    {hex}
                  </span>
                </td>
                <td className={cn("py-2.5 pr-4 font-mono text-mono", Number(String(bl).replace(",", ".")) >= 4.5 ? "text-ink" : "text-accent")}>
                  {bl}
                </td>
                <td className={cn("py-2.5 pr-4 font-mono text-mono", Number(String(vp).replace(",", ".")) >= 3 ? "text-ink" : "text-accent")}>
                  {vp}
                </td>
                <td className={cn("py-2.5 pr-4 font-mono text-mono", Number(String(vi).replace(",", ".")) >= 3 ? "text-ink" : "text-accent")}>
                  {vi}
                </td>
                <td className="py-2.5 font-serif text-body-s text-graphite">{origen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mb-10 max-w-3xl font-serif text-body-m text-graphite">
        Con glifo blanco hay que cumplir cuatro condiciones a la vez y{" "}
        <strong className="text-ink">solo #008069 las cumple</strong>. Los dos más
        profundos dan un blanco magnífico —7,67:1 y 7,98:1— pero contra{" "}
        <code className="font-mono text-mono text-ink">ink</code> caen a 2,2:1: sobre la
        banda oscura de un hero el botón se quedaría sin límite y habría que ponerle
        filete, que es justo lo que se quería evitar.{" "}
        <strong className="text-ink">
          Y tu hipótesis se confirma: #008069 contra paper da 4,38:1, así que no necesita
          borde en claro.
        </strong>{" "}
        El de hoy necesita 1,78:1 → sí lo necesitaría.
      </p>

      {(
        [
          ["hoy", "01 · Hoy — #25D366 + glifo blanco"],
          ["tinta", "02 · Mi propuesta anterior — #25D366 + glifo tinta"],
          ["profundo", "03 · Nueva — #008069 + glifo blanco"],
        ] as const
      ).map(([clave, titulo]) => {
        const v = VERDES[clave];
        return (
          <div key={clave} className="mb-10">
            <div className="mb-4 flex flex-col gap-1">
              <h4 className="font-sans text-body-l font-medium text-ink">{titulo}</h4>
              <p className="font-serif text-body-m text-graphite">{v.origen}</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-4">
              {(["claro", "oscuro"] as Tono[]).map((tono) => (
                <Muestra
                  key={`f-${tono}`}
                  tono={tono}
                  etiqueta={`flotante · solo icono · ${tono}`}
                  umbral={3}
                >
                  <span
                    data-medir
                    className={cn(FLOTANTE_CAJA, v.relleno, v.texto, tono === "claro" && v.bordeClaro)}
                  >
                    <GlifoWhatsApp className="size-7" />
                  </span>
                </Muestra>
              ))}
              {(["claro", "oscuro"] as Tono[]).map((tono) => (
                <Muestra key={`b-${tono}`} tono={tono} etiqueta={`botón con texto · ${tono}`}>
                  <button
                    type="button"
                    data-medir
                    className={cn(
                      BASE,
                      "h-12 border px-7.5",
                      v.relleno,
                      v.texto,
                      tono === "claro" ? v.bordeClaro : "border-transparent",
                    )}
                  >
                    <GlifoWhatsApp />
                    Escribir por WhatsApp
                  </button>
                </Muestra>
              ))}
            </div>
          </div>
        );
      })}

      <p className="max-w-3xl font-serif text-body-m text-graphite">
        Una advertencia de procedencia: <code className="font-mono text-mono text-ink">#008069</code>{" "}
        lo he tomado de la interfaz de WhatsApp Web y WhatsApp Business, no de un kit de
        marca que pueda verificar desde aquí. Lo que sí está medido es que es el único de
        los siete que cumple las cuatro condiciones. Conviene confirmarlo contra los
        recursos oficiales antes de publicar.
      </p>

      {/* ─────────────────────────────────────────────────────────────── */}
      <Titulo
        n="C · Estados activos"
        nota="El estado activo del navbar y la flecha del breadcrumb no son botones, pero fallan por la misma causa: brand usado como color de texto y greige usado como marca visible."
      >
        Navbar activo y flecha de breadcrumb
      </Titulo>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Muestra tono="claro" etiqueta="hoy · activo en text-brand" sinLimite>
          <span data-medir className="relative pb-1.75 font-sans text-body-s text-brand">
            Nuestros Productos
            <span aria-hidden className="absolute inset-x-0 -bottom-px block h-0.5 bg-brand" />
          </span>
        </Muestra>
        <Muestra tono="claro" etiqueta="ELEGIDA · tinta + filete tinta" sinLimite>
          <span data-medir className="relative pb-1.75 font-sans text-body-s font-medium text-ink">
            Nuestros Productos
            <span aria-hidden className="absolute inset-x-0 -bottom-px block h-0.5 bg-ink" />
          </span>
        </Muestra>
        <Muestra tono="claro" etiqueta="descartada · tinta + filete accent" sinLimite>
          <span data-medir className="relative pb-1.75 font-sans text-body-s font-medium text-ink">
            Nuestros Productos
            <span aria-hidden className="absolute inset-x-0 -bottom-px block h-0.5 bg-accent" />
          </span>
        </Muestra>
      </div>
      <p className="mt-4 max-w-3xl font-serif text-body-m text-graphite">
        El subrayado ya existe en el navbar, pero está en{" "}
        <code className="font-mono text-mono text-ink">bg-brand</code>: como marca visible
        contra paper da 2,56:1 y necesita 3:1. El filete pasa a tinta (15,67:1).{" "}
        <code className="font-mono text-mono text-ink">accent</code> también pasaba
        —3,76:1—, pero queda descartado: el terracota ya significa etiqueta mono y
        numeración de sección, y darle un segundo papel lo diluye.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Muestra tono="claro" etiqueta="flecha hoy · greige" sinLimite>
          <span data-medir className="font-mono text-label uppercase tracking-[0.12em] text-greige">
            →
          </span>
        </Muestra>
        <Muestra tono="claro" etiqueta="flecha propuesta · graphite" sinLimite>
          <span data-medir className="font-mono text-label uppercase tracking-[0.12em] text-graphite">
            →
          </span>
        </Muestra>
        <Muestra tono="oscuro" etiqueta="flecha hoy · paper/30" sinLimite>
          <span data-medir className="font-mono text-label uppercase tracking-[0.12em] text-paper/30">
            →
          </span>
        </Muestra>
        <Muestra tono="oscuro" etiqueta="flecha propuesta · paper/50" sinLimite>
          <span data-medir className="font-mono text-label uppercase tracking-[0.12em] text-paper/50">
            →
          </span>
        </Muestra>
      </div>

      {/* ─────────────────────────────────────────────────────────────── */}
      <Titulo
        n="D · Decidido: opción B"
        nota="Mismas cuatro variantes en las dos opciones. Lo que cambiaba no era el repertorio, era qué significa el relleno. Se queda B: el relleno marca compromiso. A se deja a la vista para poder volver sobre ella."
      >
        ¿El envío de formulario se distingue? Sí
      </Titulo>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Opción A */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-label uppercase text-graphite">
              Opción A · descartada
            </span>
            <h4 className="font-sans text-body-l font-medium text-graphite">
              El relleno marca jerarquía
            </h4>
            <p className="font-serif text-body-m text-graphite">
              Sólida = «la acción más importante de esta pantalla», haga lo que haga.
              Enviar el formulario y el CTA principal de navegación se ven igual. Una regla
              menos que explicar; a cambio, nada distingue «esto hace scroll» de «esto
              manda tus datos».
            </p>
          </div>
          <div className="flex flex-col gap-px bg-greige">
            <div className="flex flex-wrap items-center gap-5 bg-ink p-6">
              <button type="button" className={cn(BASE, PROPUESTA.solida.oscuro.reposo)}>
                Ver catálogo de telas →
              </button>
              <button type="button" className={cn(BASE, PROPUESTA.enlace.oscuro.reposo)}>
                Ver nuestros locales →
              </button>
              <span className="w-full font-mono text-micro uppercase text-paper/70">
                hero — navegación principal en sólida
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-5 bg-paper p-6">
              <button type="button" className={cn(BASE, PROPUESTA.solida.claro.reposo)}>
                Enviar mensaje →
              </button>
              <button type="button" className={cn(BASE, PROPUESTA.contorno.claro.reposo)}>
                Ver catálogo →
              </button>
              <span className="w-full font-mono text-micro uppercase text-graphite">
                formulario — el submit se ve igual que el CTA del hero
              </span>
            </div>
          </div>
        </div>

        {/* Opción B */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-label uppercase text-accent">Opción B · ELEGIDA</span>
            <h4 className="font-sans text-body-l font-medium text-ink">
              El relleno marca compromiso
            </h4>
            <p className="font-serif text-body-m text-graphite">
              Sólida solo para lo que compromete algo: enviar datos y abrir WhatsApp. La
              navegación nunca lleva relleno, por importante que sea —incluidos los
              heroes, que es justo lo que hoy hace Contacto—. Relleno azul pasa a
              significar una única cosa en todo el sitio.
            </p>
          </div>
          <div className="flex flex-col gap-px bg-greige">
            <div className="flex flex-wrap items-center gap-5 bg-ink p-6">
              <button type="button" className={cn(BASE, PROPUESTA.contorno.oscuro.reposo)}>
                Ver catálogo de telas →
              </button>
              <button type="button" className={cn(BASE, PROPUESTA.enlace.oscuro.reposo)}>
                Ver nuestros locales →
              </button>
              <span className="w-full font-mono text-micro uppercase text-paper/70">
                hero — navegación en contorno, sin relleno nunca
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-5 bg-paper p-6">
              <button type="button" className={cn(BASE, PROPUESTA.solida.claro.reposo)}>
                Enviar mensaje →
              </button>
              <button type="button" className={cn(BASE, PROPUESTA.contorno.claro.reposo)}>
                Ver catálogo →
              </button>
              <span className="w-full font-mono text-micro uppercase text-graphite">
                formulario — el único relleno azul de la página
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-5 bg-paper p-6 outline-1 outline-greige">
        <button type="button" className={cn(BASE, PROPUESTA.whatsapp.claro.reposo)}>
          <GlifoWhatsApp />
          Escribir por WhatsApp
        </button>
        <span className="font-mono text-micro uppercase text-graphite">
          en las dos opciones: verde = se sale a una conversación
        </span>
      </div>

      {/* ─────────────────────────────────────────────────────────────── */}
      <Titulo
        n="E · Alternativa"
        nota="No la pediste, pero sale sola al medir: si la sólida en claro fuera de tinta en vez de azul, pasaría todo con margen y el azul quedaría libre para lo que globals.css dice que es —logo y énfasis—."
      >
        Sólida en tinta, en vez de en azul
      </Titulo>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Muestra tono="claro" etiqueta="propuesta principal · azul + tinta">
          <button type="button" data-medir className={cn(BASE, PROPUESTA.solida.claro.reposo)}>
            Enviar mensaje →
          </button>
        </Muestra>
        <Muestra tono="claro" etiqueta="alternativa · tinta + papel">
          <button type="button" data-medir className={cn(BASE, "h-12 px-7.5 border border-ink bg-ink text-paper")}>
            Enviar mensaje →
          </button>
        </Muestra>
        <Muestra tono="oscuro" etiqueta="alternativa en oscuro · papel + tinta">
          <button type="button" data-medir className={cn(BASE, "h-12 px-7.5 border border-paper bg-paper text-ink")}>
            Enviar mensaje →
          </button>
        </Muestra>
      </div>

      {/* ─────────────────────────────────────────────────────────────── */}
      <Titulo
        n="F · Token nuevo, en uso"
        nota="Ya está en globals.css y ya se usa: la tile de catálogo («Ficha disponible»), la pestaña activa del recomendador y los eyebrow sobre bone del asesor y de «Ejemplo de aplicación». Entró para que los hover:text-brand sobre claro tuvieran a dónde ir cuando se aplique el sistema; se estrenó arreglando los 42 suspensos de text-brand sobre fondo claro que reportaba npm run marca."
      >
        <code className="font-mono">--color-brand-ink: #1a6d99</code>
      </Titulo>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Muestra tono="claro" etiqueta="hoy · text-brand sobre claro" sinLimite>
          <span data-medir className="font-sans text-body-s font-medium text-brand">
            Hablar con un asesor →
          </span>
        </Muestra>
        <Muestra tono="claro" etiqueta="token nuevo · text-brand-ink" sinLimite>
          <span data-medir className="font-sans text-body-s font-medium text-brand-ink">
            Hablar con un asesor →
          </span>
        </Muestra>
        <Muestra tono="claro" etiqueta="alternativa sin token · subrayado en tinta" sinLimite>
          <span data-medir className="border-b border-ink pb-0.5 font-sans text-body-s font-medium text-ink">
            Hablar con un asesor →
          </span>
        </Muestra>
      </div>
      <p className="mt-4 max-w-3xl font-serif text-body-m text-graphite">
        La paleta no tenía ningún azul que pudiera ser texto sobre fondo claro:{" "}
        <code className="font-mono text-mono text-ink">brand</code> da 2,56:1 y{" "}
        <code className="font-mono text-mono text-ink">brand-deep</code> pasa con 13,37:1
        pero se lee como negro, no como azul.{" "}
        <strong className="text-ink">Solo como color de texto o de icono sobre claro</strong>
        : como relleno no aporta nada que no dé ya{" "}
        <code className="font-mono text-mono text-ink">brand-deep</code>.
      </p>

      {/* ─────────────────────────────────────────────────────────────── */}
      <Titulo n="G · Mapeo" nota="Qué variante usar en cada caso, en cada una de las dos opciones.">
        Gesto → variante
      </Titulo>

      {/* `table-fixed` no es estético: es lo único que corta la cadena. El
          Container es ítem flex de esta página y no encoge por debajo del
          min-content de su contenido —ni `overflow-x-auto` ni `min-w-0` lo
          evitan en Chromium—, así que una tabla automática de cuatro columnas
          ponía la página entera en 481px a 375. Con anchos fijos el min-content
          deja de depender del texto. */}
      <div className="min-w-0 overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="border-b border-ink">
              <th className="pb-3 pr-6 font-mono text-label uppercase text-graphite">Gesto</th>
              <th className="pb-3 pr-6 font-mono text-label uppercase text-graphite">Antes</th>
              <th className="pb-3 pr-6 font-mono text-label uppercase text-accent">Variante</th>
              <th className="pb-3 font-mono text-label uppercase text-graphite">Dónde</th>
            </tr>
          </thead>
          <tbody>
            <Mapa
              gesto="Navegación interna · CTA de hero"
              antes="primary (6 páginas) o enlace a mano (Contacto)"
              ahora="contorno"
              nota="Las 7 cabeceras. Solo navega: nunca lleva relleno."
            />
            <Mapa
              gesto="Navegación interna · CTA de sección"
              antes="primary, secondary o ghost, según página"
              ahora="contorno"
              nota="Empresa, Productos, Blancos, ficha de subcategoría, asesor de la portada."
            />
            <Mapa
              gesto="Navegación interna · dentro del texto"
              antes="enlace a mano, 3 implementaciones"
              ahora="enlace"
              nota="Contacto, Empresa, Camisetas, Preparación, mapa de locales, «Ver evento»."
            />
            <Mapa
              gesto="Navegación interna · tarjeta de catálogo"
              antes="tarjeta enlazada + «Ver ficha →» a mano"
              ahora="tarjeta + enlace"
              nota="La tarjeta entera sigue siendo el área pulsable; el «Ver más →» es su señal."
            />
            <Mapa
              gesto="Acción en la página"
              antes="enlace a mano o tarjeta pulsable"
              ahora="contorno"
              nota="Recomendador de prendas, wizard del asesor."
            />
            <Mapa
              gesto="Envío de formulario"
              antes="primary"
              ahora="solida"
              nota="Contacto (claro) y asesor comercial (oscuro): mismas clases, dos formas."
            />
            <Mapa
              gesto="WhatsApp · CTA"
              antes="flotante de icono + nada más"
              ahora="whatsapp"
              nota="Cierre de la portada y del wizard. Flotante en el mismo #008069."
            />
            <Mapa
              gesto="WhatsApp · dato de contacto"
              antes="enlace mono 13px"
              ahora="texto, como el resto"
              nota="En la lista de canales va junto al teléfono y al correo: es un dato, no un CTA. Hacerlo botón rompería la lista y le daría un peso que los otros dos no tienen."
            />
            <Mapa
              gesto="Enlace externo"
              antes="enlace a mano"
              ahora="enlace + ↗"
              nota="Portal de clientes, «Cómo llegar»."
            />
          </tbody>
        </table>
      </div>

      <p className="mt-6 max-w-3xl font-serif text-body-m text-graphite">
        La diferencia entre A y B cabía en una fila: el CTA de hero. En A llevaba relleno
        porque era lo más importante de la pantalla; en B no lo lleva nunca porque solo
        navega. Todo lo demás era idéntico —ninguna de las dos añadía variantes.
      </p>
      <div className="mt-8 border-t border-ink pt-6">
        <span className="font-mono text-label uppercase text-accent">Estado · cerrado</span>
        <ul className="mt-3 flex max-w-3xl flex-col gap-1.5 font-serif text-body-m text-graphite">
          <li>
            <strong className="text-ink">Aplicado a las doce rutas.</strong>{" "}
            <code className="font-mono text-mono">primary</code>,{" "}
            <code className="font-mono text-mono">secondary</code> y{" "}
            <code className="font-mono text-mono">ghost</code> ya no existen.
          </li>
          <li>
            <strong className="text-ink">La sólida tiene dos formas</strong> — tinta sobre
            claro, claro sobre oscuro— y las resuelve sola: lee{" "}
            <code className="font-mono text-mono">--sup-tinta</code> y{" "}
            <code className="font-mono text-mono">--sup-papel</code>, que declara la propia
            utilidad que pinta el fondo. No hay clase de tono que se pueda olvidar.
          </li>
          <li>
            <strong className="text-ink">WhatsApp en #008069</strong> con glifo blanco, en
            la variante y en el flotante. Un solo verde en todo el sitio.
          </li>
          <li>
            El azul de marca <strong className="text-ink">ya no rellena ningún botón</strong>
            : contra <code className="font-mono text-mono">paper</code> daba 2,56:1 y contra
            el píxel claro de una foto de cabecera 1,71:1. Queda para lo que{" "}
            <code className="font-mono text-mono">globals.css</code> dice que es.
          </li>
        </ul>
      </div>
    </div>
  );
}
