"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "./Container";
import { HeroVideo } from "./HeroVideo";
import { FondoHero, REJILLA_HERO, DEGRADADO_HERO } from "./FondoHero";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";
import { buttonVariants } from "./buttonVariants";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { foto } from "@/data/imagenes";
import { HERO_VIDEO_LISTO } from "@/data/video.generado";
import { EASE_REVELAR, EASE_DESENROLLAR, DURATION } from "@/lib/motion";

export interface HeroProps {
  eyebrow?: string;
  breadcrumb?: BreadcrumbItem[];
  /** Cada elemento es una línea del titular (para la máscara con stagger 90ms). */
  headlineLines: React.ReactNode[];
  subhead: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  caption?: string;
  /**
   * Fondo de vídeo en bucle (Motion v1 §06). Solo lo usa la portada; el resto
   * de heroes se quedan con la textura estática, que el propio documento da por
   * válida como fallback.
   */
  video?: boolean;
  /**
   * PRUEBA — id de slot con fotografía de fondo a sangre (ver `FondoHero`).
   *
   * El diseño aprobado no lleva foto en los heroes: su fondo es la trama CSS a
   * propósito. Está a evaluación en todas las páginas que tienen hero. Si el
   * slot no tiene archivo, el hero cae a la trama de siempre, así que pasarlo
   * no cambia nada hasta que hay foto.
   *
   * No se combina con `video`: la portada usa vídeo y su imagen va de póster.
   */
  imagen?: string;
}

const HEADLINE_START = 0.3;
const HEADLINE_STAGGER = 0.09;
const CTA_DELAY = 0.65;

/**
 * Hero oscuro reutilizado en Home, Empresa, Productos, Categoria Microfibra,
 * Camisetas, Contacto, Subcategoria Dortmund Plus: fondo tinta con textura
 * de rejilla, eyebrow/migaja, titular grande, subtítulo, hasta dos CTA.
 *
 * Motion v1 §06 — secuencia orquestada exacta:
 *   0ms textura ya visible · 150ms eyebrow fade+rise 16px · 300ms titular
 *   desenrolla por líneas (máscara, stagger 90ms) · 650ms CTA revela.
 * Con `video`, fondo de vídeo en bucle (§06); el póster cubre el "textura
 * visible desde el primer frame". Sin él, el fondo estático, que el propio
 * documento da por válido como fallback.
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
  caption,
  video = false,
  imagen,
}: HeroProps) {
  // Con vídeo la rejilla va POR ENCIMA, no de fondo: si se queda debajo el
  // vídeo la tapa y se pierde la textura que define el hero.
  const conFoto = Boolean(imagen && foto(imagen));

  // El póster sale del slot `hero-home-poster` si lo has cargado a mano; si no,
  // del fotograma que saca `npm run video` —que solo existe si hay vídeo—.
  const poster =
    foto("hero-home-poster")?.ruta ??
    (HERO_VIDEO_LISTO ? "/video/hero-poster.jpg" : undefined);

  // `video` marca "esta es la portada", no "hay vídeo". La portada pinta su
  // banda con lo que tenga: vídeo si está procesado, póster si solo hay foto, y
  // si no hay ninguno cae a la trama CSS como cualquier otro hero.
  const conBanda = video && Boolean(poster);

  return (
    <header
      className="relative overflow-hidden bg-ink text-paper"
      style={
        conBanda || conFoto
          ? undefined
          : { backgroundImage: `${REJILLA_HERO}, ${DEGRADADO_HERO}` }
      }
    >
      {conBanda && poster && (
        <>
          <HeroVideo poster={poster} hayVideo={HERO_VIDEO_LISTO} />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: REJILLA_HERO }}
          />
        </>
      )}

      {!video && imagen && <FondoHero slot={imagen} />}
      <Container className="relative flex min-h-[70vh] flex-col justify-center gap-6 py-24">
        {caption && (
          <span
            className="absolute right-0 top-8 hidden font-mono text-xs uppercase tracking-widest text-paper/50 sm:block"
            style={{ right: "clamp(24px,7vw,120px)" }}
          >
            {caption}
          </span>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.revelar, ease: EASE_REVELAR, delay: 0.15 }}
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

        <h1 className="max-w-3xl font-sans text-display font-medium tracking-[-0.03em] text-paper">
          {headlineLines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: DURATION.desenrollar,
                  ease: EASE_DESENROLLAR,
                  delay: HEADLINE_START + i * HEADLINE_STAGGER,
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="max-w-xl font-serif text-body-l text-paper/80"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.revelar, ease: EASE_REVELAR, delay: 0.15 }}
        >
          {subhead}
        </motion.p>

        {(primaryCta || secondaryCta) && (
          <motion.div
            className="mt-2 flex flex-wrap items-center gap-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.revelar, ease: EASE_REVELAR, delay: CTA_DELAY }}
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

        <span className="mt-10 font-mono text-xs uppercase tracking-widest text-paper/40">
          Desliza
        </span>
      </Container>
    </header>
  );
}
