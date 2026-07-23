"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "./Container";
import { cn } from "@/lib/cn";
import { EASE_ASENTAR, EASE_DESENROLLAR, EASE_PLEGAR, DURATION } from "@/lib/motion";
import {
  catalogStats,
  externalPortalHref,
  primaryNavLinks,
  productCategories,
} from "@/lib/nav-data";

const NAV_HEIGHT = "68px";

/** Motion v1 §05 — subrayado activo: scaleX 0→1, origin left, 220ms, asentar. El texto no se mueve. */
function NavUnderline({ visible }: { visible: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute inset-x-0 -bottom-px h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-220 ease-asentar",
        visible && "scale-x-100",
      )}
    />
  );
}

function NavLink({
  href,
  label,
  onClick,
  external,
  className,
}: {
  href: string;
  label: string;
  onClick?: () => void;
  external?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const isActive = !external && pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative pb-1.75 font-sans text-[15px] text-ink hover:text-brand",
        isActive && "text-brand",
        className,
      )}
    >
      {label}
      {external && <span className="ml-0.75 inline-block">↗</span>}
      <NavUnderline visible={isActive} />
      {!isActive && (
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-220 ease-asentar group-hover:scale-x-100"
        />
      )}
    </Link>
  );
}

const megaPanelVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.asentar, ease: EASE_ASENTAR },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: DURATION.asentar, ease: EASE_ASENTAR },
  },
};

const mobilePanelVariants = {
  hidden: { height: 0 },
  visible: {
    height: "auto",
    transition: { duration: 0.4, ease: EASE_DESENROLLAR },
  },
  exit: {
    height: 0,
    transition: { duration: DURATION.plegar, ease: EASE_PLEGAR },
  },
};

const mobileListVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const mobileItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.plegar, ease: EASE_ASENTAR },
  },
};

/**
 * Navbar — reconstruido contra los exports de Claude Design (base-design.zip):
 * fijo con velo translúcido + blur, 68px de alto, sin CTA propio (no existe
 * en las 10 pantallas aprobadas), mega-menú con la taxonomía real de
 * catálogo. Breakpoint de colapso a móvil: 900px (no el md=768px por defecto).
 *
 * Motion v1 §05: subrayado de nav (scaleX asentar), menú móvil (desenrollar
 * al abrir / plegar al cerrar, items con stagger 50ms). El panel del
 * mega-menú de escritorio no está en la tabla del documento — se le aplica
 * el mismo tratamiento "asentar" (fade+rise breve) por analogía con el
 * menú móvil, no un patrón inventado desde cero.
 */
export function Navbar() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const disparadorRef = useRef<HTMLAnchorElement>(null);
  const cierreTimer = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();

  // El disparador de catálogo está activo en /productos y en toda su rama
  // (fichas de tela, categorías…), no solo en la coincidencia exacta que usan
  // los demás enlaces. Así "Nuestros Productos" marca sección igual que el
  // resto en cualquier página de producto.
  const catalogoActivo =
    pathname === "/productos" || pathname.startsWith("/productos/");
  const disparadorMarcado = megaOpen || catalogoActivo;

  /*
   * Apertura por hover con RETARDO AL CERRAR, no por ampliar cajas invisibles.
   *
   * El problema clásico del desplegable: al ir del enlace al panel el cursor
   * cruza un hueco vacío un instante y, si el cierre es inmediato, el menú se
   * va antes de llegar. La solución es un único temporizador compartido: salir
   * del enlace programa el cierre a 220ms (curva "asentar"), y entrar en el
   * panel —que es descendiente en el DOM, así que dispara `pointerenter` del
   * contenedor— lo cancela. El recorrido en diagonal cabe de sobra en 220ms.
   */
  const abrirMenu = useCallback(() => {
    if (cierreTimer.current) {
      clearTimeout(cierreTimer.current);
      cierreTimer.current = null;
    }
    setMegaOpen(true);
  }, []);

  const cerrarMenu = useCallback(() => {
    if (cierreTimer.current) {
      clearTimeout(cierreTimer.current);
      cierreTimer.current = null;
    }
    setMegaOpen(false);
  }, []);

  const cerrarConRetardo = useCallback(() => {
    if (cierreTimer.current) clearTimeout(cierreTimer.current);
    cierreTimer.current = window.setTimeout(() => {
      cierreTimer.current = null;
      setMegaOpen(false);
    }, 220);
  }, []);

  useEffect(() => {
    return () => {
      if (cierreTimer.current) clearTimeout(cierreTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!megaOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!megaRef.current?.contains(event.target as Node)) {
        cerrarMenu();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        cerrarMenu();
        // Escape devuelve el foco al disparador, no lo deja en un panel oculto.
        disparadorRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [megaOpen, cerrarMenu]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 border-b border-greige bg-paper/92 backdrop-blur-[6px]"
      style={{ height: NAV_HEIGHT }}
    >
      <Container
        className="flex items-center justify-between"
        style={{ height: NAV_HEIGHT }}
      >
        <Link
          href="/"
          className="flex items-center gap-3 text-ink"
          onClick={() => setMobileOpen(false)}
        >
          <span className="block size-2.5 shrink-0 bg-brand" />
          <span className="font-sans text-[17px] font-semibold tracking-[0.02em]">
            Textil Padilla
          </span>
        </Link>

        <nav className="hidden items-center gap-9.5 tablet:flex">
          <NavLink href={primaryNavLinks[0].href} label={primaryNavLinks[0].label} />
          <NavLink href={primaryNavLinks[1].href} label={primaryNavLinks[1].label} />

          {/*
            El contenedor gobierna la apertura por hover y foco. `onPointerEnter`
            solo abre con ratón (`pointerType === "mouse"`): en táctil no hay
            hover y el evento no aplica, así que un toque en el enlace navega al
            catálogo, como antes. `onFocus`/`onBlur` (que en React burbujean vía
            focusin/focusout) abren y cierran para el teclado. El panel es
            descendiente del contenedor, así que al entrar en él se dispara de
            nuevo `onPointerEnter` y el cierre programado se cancela.
          */}
          <div
            ref={megaRef}
            /*
             * `flex`, no un div en bloque: sin él el enlace de dentro queda
             * `inline` y su `pb-1.75` no cuenta para la altura del contenedor,
             * así que el disparador medía menos que los demás enlaces y caía
             * ~7px más abajo en la fila. Como flex, el enlace se blockifica y
             * su caja iguala a la de los NavLink hermanos.
             */
            className="relative flex"
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") abrirMenu();
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") cerrarConRetardo();
            }}
            onFocus={abrirMenu}
            onBlur={(e) => {
              // Cierra solo si el foco sale del contenedor (no al saltar de
              // enlace a enlace dentro del panel).
              if (!e.currentTarget.contains(e.relatedTarget as Node)) cerrarMenu();
            }}
          >
            {/*
              Disparador = ENLACE al catálogo. El clic directo lleva a /productos
              igual que "Ver todo el catálogo"; el hover/foco abre el panel. Es
              un enlace con `aria-expanded` porque además controla el desplegable.
            */}
            <Link
              ref={disparadorRef}
              href="/productos"
              onClick={cerrarMenu}
              aria-expanded={megaOpen}
              aria-haspopup="menu"
              aria-current={catalogoActivo ? "page" : undefined}
              className={cn(
                "group relative pb-1.75 font-sans text-[15px] text-ink hover:text-brand",
                disparadorMarcado && "text-brand",
              )}
            >
              Nuestros Productos
              {/* Igual que los NavLink: subrayado persistente cuando la sección
                  está activa (o el menú abierto); subrayado de hover cuando no. */}
              <NavUnderline visible={disparadorMarcado} />
              {!disparadorMarcado && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-px h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-220 ease-asentar group-hover:scale-x-100"
                />
              )}
            </Link>

            <AnimatePresence>
              {megaOpen && (
                <motion.div
                  className="fixed inset-x-0 top-17 z-20 border-t border-b border-greige bg-paper/98 backdrop-blur-sm"
                  initial={reduceMotion ? undefined : "hidden"}
                  animate="visible"
                  exit={reduceMotion ? undefined : "exit"}
                  variants={megaPanelVariants}
                >
                  <Container>
                    <div
                      className="grid gap-[clamp(24px,3vw,52px)] py-[clamp(26px,3vw,46px)]"
                      style={{ gridTemplateColumns: "1.7fr 1fr 1fr 1fr" }}
                    >
                      {productCategories.map((category) => (
                        <div key={category.label} className="min-w-0">
                          <Link
                            href={category.href}
                            onClick={cerrarMenu}
                            className="mb-3.5 flex items-baseline gap-2.25 border-b border-greige pb-3 font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-ink hover:text-brand"
                          >
                            {category.label}
                            <span className="font-mono text-[11px] font-normal tracking-normal text-accent">
                              {category.count}
                            </span>
                          </Link>
                          <div
                            className={cn(
                              "grid grid-cols-1 gap-y-px",
                              category.subcategories.length > 9 &&
                                "grid-cols-2 gap-x-[clamp(16px,2vw,36px)]",
                            )}
                          >
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                title={
                                  sub.estado === "sin-ficha"
                                    ? "Página en preparación"
                                    : undefined
                                }
                                onClick={cerrarMenu}
                                className="py-1.25 font-sans text-[14px] text-graphite hover:text-brand"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}

                      <div className="col-span-full mt-2.5 flex items-center justify-between gap-5 border-t border-greige pt-5 font-mono text-xs uppercase tracking-[0.08em] text-graphite">
                        <span>{catalogStats}</span>
                        <Link
                          href="/productos"
                          onClick={cerrarMenu}
                          className="font-sans text-sm font-medium text-ink hover:text-brand"
                        >
                          Ver todo el catálogo →
                        </Link>
                      </div>
                    </div>
                  </Container>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink href={primaryNavLinks[2].href} label={primaryNavLinks[2].label} />
          <NavLink href={externalPortalHref} label="Portal Clientes" external />
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          className="relative flex size-11.5 items-center justify-center tablet:hidden"
        >
          <span
            className={cn(
              "absolute h-px w-6 bg-ink transition-transform duration-220 ease-asentar",
              mobileOpen ? "translate-y-0 rotate-45" : "-translate-y-1.625",
            )}
          />
          <span
            className={cn(
              "absolute h-px w-6 bg-ink transition-opacity duration-220 ease-asentar",
              mobileOpen && "opacity-0",
            )}
          />
          <span
            className={cn(
              "absolute h-px w-6 bg-ink transition-transform duration-220 ease-asentar",
              mobileOpen ? "translate-y-0 -rotate-45" : "translate-y-1.625",
            )}
          />
        </button>
      </Container>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-x-0 overflow-hidden bg-paper/97 backdrop-blur-[10px] tablet:hidden"
            style={{ top: NAV_HEIGHT }}
            initial={reduceMotion ? undefined : "hidden"}
            animate="visible"
            exit={reduceMotion ? undefined : "exit"}
            variants={mobilePanelVariants}
          >
            <div className="max-h-[calc(100vh-68px)] overflow-y-auto">
              <motion.nav
                initial={reduceMotion ? undefined : "hidden"}
                animate="visible"
                variants={mobileListVariants}
              >
                <Container className="flex flex-col py-1.5">
                  <motion.div variants={mobileItemVariants}>
                    <Link
                      href={primaryNavLinks[0].href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between border-b border-bone py-4.25 font-sans text-xl font-medium text-ink"
                    >
                      {primaryNavLinks[0].label}
                      <span className="text-greige">→</span>
                    </Link>
                  </motion.div>
                  <motion.div variants={mobileItemVariants}>
                    <Link
                      href={primaryNavLinks[1].href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between border-b border-bone py-4.25 font-sans text-xl font-medium text-ink"
                    >
                      {primaryNavLinks[1].label}
                      <span className="text-greige">→</span>
                    </Link>
                  </motion.div>

                  <motion.details
                    variants={mobileItemVariants}
                    className="border-b border-bone py-4.25"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between font-sans text-xl font-medium text-ink marker:content-none">
                      Nuestros Productos
                      <span className="text-[24px] leading-none text-greige">+</span>
                    </summary>
                    <div className="mt-4 flex flex-col gap-4">
                      {productCategories.map((category) => (
                        <div
                          key={category.label}
                          className="border-b border-[#E1DBD1] py-4 last:border-b-0"
                        >
                          <Link
                            href={category.href}
                            onClick={() => setMobileOpen(false)}
                            className="mb-3 inline-flex items-baseline gap-2.25 font-sans text-sm font-semibold uppercase tracking-[0.06em] text-ink"
                          >
                            {category.label}
                            <span className="font-mono text-[11px] font-normal tracking-normal text-accent">
                              {category.count}
                            </span>
                          </Link>
                          <div className="flex flex-wrap gap-x-4 gap-y-2.25">
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                title={
                                  sub.estado === "sin-ficha"
                                    ? "Página en preparación"
                                    : undefined
                                }
                                onClick={() => setMobileOpen(false)}
                                className="font-sans text-[15px] text-graphite"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.details>

                  <motion.div variants={mobileItemVariants}>
                    <Link
                      href={primaryNavLinks[2].href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between border-b border-bone py-4.25 font-sans text-xl font-medium text-ink"
                    >
                      {primaryNavLinks[2].label}
                      <span className="text-greige">→</span>
                    </Link>
                  </motion.div>
                  <motion.div variants={mobileItemVariants}>
                    <a
                      href={externalPortalHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between py-4.25 font-sans text-xl font-medium text-ink"
                    >
                      Portal Clientes
                      <span className="text-greige">↗</span>
                    </a>
                  </motion.div>
                </Container>
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
