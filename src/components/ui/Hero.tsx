"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "./Container";
import { HeroVideo } from "./HeroVideo";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";
import { buttonVariants } from "./buttonVariants";
import { MagneticLink } from "@/components/motion/MagneticLink";
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
}: HeroProps) {
  // Con vídeo la rejilla va POR ENCIMA, no de fondo: si se queda debajo el
  // vídeo la tapa y se pierde la textura que define el hero.
  const rejilla =
    "repeating-linear-gradient(0deg, rgba(245,242,238,0.04) 0 1px, transparent 1px 34px), repeating-linear-gradient(90deg, rgba(245,242,238,0.04) 0 1px, transparent 1px 34px)";
  const degradado =
    "linear-gradient(115deg, rgba(13,25,30,0.86) 0%, rgba(28,25,23,0.55) 45%, rgba(28,25,23,0.15) 100%)";

  return (
    <header
      className="relative overflow-hidden bg-ink text-paper"
      style={video ? undefined : { backgroundImage: `${rejilla}, ${degradado}` }}
    >
      {video && (
        <>
          <HeroVideo poster="/video/hero-poster.jpg" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: rejilla }}
          />
        </>
      )}
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
