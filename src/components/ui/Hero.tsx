"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "./Container";
import { HeroVideo } from "./HeroVideo";
import { FondoHero, DEGRADADO_HERO } from "./FondoHero";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";
import { buttonVariants } from "./buttonVariants";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { LineasEnMascara } from "@/components/motion/LineasEnMascara";
import { foto } from "@/data/imagenes";
import { HERO_VIDEO_LISTO } from "@/data/video.generado";
import { EASE_REVELAR, DURATION, HERO_SECUENCIA } from "@/lib/motion";

export interface HeroProps {
  eyebrow?: string;
  breadcrumb?: BreadcrumbItem[];
  /** Cada elemento es una línea del titular (para la máscara con stagger 90ms). */
  headlineLines: React.ReactNode[];
  subhead: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /**
   * Fondo de vídeo en bucle (Motion v1 §06). Solo lo usa la portada; el resto
   * de heroes se quedan con su foto de slot.
   */
  video?: boolean;
  /**
   * Id de slot con fotografía de fondo a sangre (ver `FondoHero`).
   *
   * Si el slot no tiene archivo, el hero se queda en tinta plana: es un estado
   * provisional a la espera de la foto, no una alternativa de diseño. No se
   * rellena con una trama para taparlo — ver la nota de `FondoHero`.
   *
   * No se combina con `video`: la portada usa vídeo y su imagen va de póster.
   */
  imagen?: string;
}

/**
 * Hero oscuro reutilizado en Home, Empresa, Productos, Categoria Microfibra,
 * Camisetas, Contacto, Subcategoria Dortmund Plus: fondo de tinta con foto a
 * sangre, eyebrow/migaja, titular grande, subtítulo, hasta dos CTA.
 *
 * Secuencia orquestada (`HERO_SECUENCIA` en lib/motion.ts):
 *   0ms fondo ya visible · 150ms eyebrow · 300ms titular desenrolla por líneas
 *   (máscara, stagger 90ms) · 500ms subtítulo · 800ms CTA.
 * El subtítulo estaba en 150ms, empatado con el eyebrow, así que entraba ANTES
 * que el titular al que subtitula. Ahora arranca cuando la primera línea del
 * titular ya está arriba, y el CTA cierra detrás.
 * Con `video`, fondo de vídeo en bucle (§06); el póster cubre el "visible desde
 * el primer frame". Sin ninguna fuente, tinta plana con su degradado.
 *
 * NO REPONER EL CAPTION NI EL "DESLIZA"
 * La cabecera llevaba un caption mono arriba a la derecha ("MACRO DE FIBRA ·
 * LOOP") y un rótulo "Desliza" abajo. El primero describía el fondo a quien ya
 * lo está viendo; el segundo explica el scroll. Ninguno de los dos informaba de
 * nada y competían con el titular por la atención en la única pantalla que se
 * ve entera. Se retiraron de las siete cabeceras, no solo de la portada.
 *
 * NO REPONER LA REJILLA
 * Estas cabeceras llevaron una rejilla CSS de 34px encima del fondo. Salía de
 * los exports .dc.html, donde esa trama marcaba "aquí va una imagen": era un
 * marcador de hueco del mockup y se transcribió como si fuera diseño, hasta
 * quedar pintada también sobre fotografías reales. Se retiró. No reponerla.
 *
 * prefers-reduced-motion se resuelve vía <MotionConfig reducedMotion="user">
 * en el layout raíz — no se ramifica aquí (ver Reveal.tsx) para evitar un
 * mismatch de hidratación servidor/cliente. La excepción es `HeroVideo`, que sí
 * lo consulta: ahí la alternativa sería descargar megas de vídeo para no
 * reproducirlos, y lo resuelve montando en efecto, sin desajuste.
 */
export function Hero({
  eyebrow,
  breadcrumb,
  headlineLines,
  subhead,
  primaryCta,
  secondaryCta,
  video = false,
  imagen,
}: HeroProps) {
  const conFoto = Boolean(imagen && foto(imagen));

  // El póster sale del slot `hero-home-poster` si lo has cargado a mano; si no,
  // del fotograma que saca `npm run video` —que solo existe si hay vídeo—.
  const poster =
    foto("hero-home-poster")?.ruta ??
    (HERO_VIDEO_LISTO ? "/video/hero-poster.jpg" : undefined);

  // `video` marca "esta es la portada", no "hay vídeo". La portada pinta su
  // banda con lo que tenga: vídeo si está procesado, póster si solo hay foto, y
  // si no hay ninguno se queda en tinta plana como cualquier otro hero vacío.
  const conBanda = video && Boolean(poster);

  return (
    <header
      className="relative overflow-hidden bg-ink text-paper"
      style={conBanda || conFoto ? undefined : { backgroundImage: DEGRADADO_HERO }}
    >
      {conBanda && poster && <HeroVideo poster={poster} hayVideo={HERO_VIDEO_LISTO} />}
      {/* Portada sin póster ni vídeo: FondoHero no pinta fondo, pero marca el
          hueco en desarrollo igual que en las demás cabeceras. */}
      {video && !poster && <FondoHero slot="hero-home-poster" />}

      {!video && imagen && <FondoHero slot={imagen} />}
      <Container className="relative flex min-h-[70vh] flex-col justify-center gap-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: DURATION.revelar,
            ease: EASE_REVELAR,
            delay: HERO_SECUENCIA.eyebrow,
          }}
        >
          {breadcrumb ? (
            <Breadcrumb items={breadcrumb} tone="dark" />
          ) : (
            eyebrow && (
              <span className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-paper/70">
                <span className="block size-1.5 shrink-0 bg-brand" />
                {eyebrow}
              </span>
            )
          )}
        </motion.div>

        <LineasEnMascara
          as="h1"
          disparo="entrada"
          delay={HERO_SECUENCIA.titular}
          lineas={headlineLines}
          className="max-w-3xl font-sans text-display font-medium tracking-[-0.03em] text-paper"
        />

        <motion.p
          className="max-w-xl font-serif text-body-l text-paper/80"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: DURATION.revelar,
            ease: EASE_REVELAR,
            delay: HERO_SECUENCIA.subhead,
          }}
        >
          {subhead}
        </motion.p>

        {(primaryCta || secondaryCta) && (
          <motion.div
            className="mt-2 flex flex-wrap items-center gap-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: DURATION.revelar,
              ease: EASE_REVELAR,
              delay: HERO_SECUENCIA.cta,
            }}
          >
            {primaryCta && (
              <MagneticLink
                href={primaryCta.href}
                className={buttonVariants({ variant: "primary" })}
              >
                {primaryCta.label}
              </MagneticLink>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="font-sans text-[15px] font-medium text-paper hover:text-brand"
              >
                {secondaryCta.label}
              </Link>
            )}
          </motion.div>
        )}
      </Container>
    </header>
  );
}
