"use client";

import { useState } from "react";
import Link from "next/link";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { buttonVariants } from "./buttonVariants";
import { cn } from "@/lib/cn";
import { foto } from "@/data/imagenes";

export interface GarmentOption {
  key: string;
  label: string;
  recommendedFor: string;
  title: string;
  description: string;
  /** Solo Camiseta tiene ficha propia (/productos/camisetas) — el resto va a Categorías. */
  href: string;
}

const OPTIONS: GarmentOption[] = [
  {
    key: "camiseta",
    label: "Camiseta",
    recommendedFor: "Recomendado para camiseta",
    title: "Jersey de algodón peinado 30/1",
    description:
      "Punto liso, ligero y de mano suave. Cae bien sobre el cuerpo, respira y sostiene el color en prendas de uso diario. Peinado para reducir pilling y ganar tacto.",
    href: "/productos/camisetas",
  },
  {
    key: "chompa",
    label: "Chompa",
    recommendedFor: "Recomendado para chompa",
    title: "French Terry perchado / Fleece",
    description:
      "Estructura con cuerpo y reverso afelpado que abriga sin apelmazar. Sostiene la forma en capuchas, puños y bolsillos, y aguanta lavados sin perder el pelo interior.",
    href: "#categorias",
  },
  {
    key: "pantalon",
    label: "Pantalón deportivo",
    recommendedFor: "Recomendado para pantalón deportivo",
    title: "Sarga stretch / Fleece medio",
    description:
      "Tejido con caída y elasticidad de recuperación para movimiento sin deformar la rodilla. Resistente a la abrasión y con superficie que sostiene el color en zonas de roce.",
    href: "#categorias",
  },
];

/** "02 Recomendador" — filtro por prenda. Fase 2: cambio de tab instantáneo. */
export function GarmentRecommender() {
  const [active, setActive] = useState(OPTIONS[0].key);
  const option = OPTIONS.find((o) => o.key === active) ?? OPTIONS[0];

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2 border-b border-greige">
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => setActive(o.key)}
            aria-pressed={active === o.key}
            className={cn(
              "border-b-2 px-1 py-3 font-sans text-[15px] font-medium",
              active === o.key
                ? "border-brand text-brand"
                : "border-transparent text-graphite hover:text-ink",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
        <ImagePlaceholder
          src={foto(`prenda-${option.key}`)?.ruta}
          alt={foto(`prenda-${option.key}`)?.alt ?? ""}
          sizes="(min-width: 640px) 50vw, 100vw"
          label="Tela · foto real"
          sublabel={option.title}
          className="aspect-4/3"
        />
        <div className="flex flex-col justify-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            {option.recommendedFor}
          </span>
          <h3 className="font-sans text-h3 font-semibold text-ink">
            {option.title}
          </h3>
          <p className="font-serif text-[15px] text-graphite">
            {option.description}
          </p>
          <div className="mt-2 flex flex-col gap-5">
            <Link
              href={option.href}
              className={cn(buttonVariants({ variant: "ghost" }), "w-fit whitespace-normal")}
            >
              Ver todas las telas para {option.label.toLowerCase()} →
            </Link>
            {/*
              El asesor sube desde el pie a la columna y pasa a botón. Como
              el fill `primary` (azul) está reservado a un solo CTA por
              pantalla —y esta página ya lo gasta en el hero y en "Hablar con
              un asesor"— el asesor toma la variante `secondary` (borde) y
              "Ver todas" queda en `ghost`: el asesor pesa más sin robar el
              azul. Copy alineado con la portada ("Probar el asesor virtual").
            */}
            <div className="flex flex-col gap-2.5">
              <span className="font-serif text-[15px] text-graphite">
                ¿No sabes qué elegir?
              </span>
              <Link
                href="/asesor-virtual"
                className={cn(buttonVariants({ variant: "secondary" }), "w-fit")}
              >
                Probar el asesor virtual →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
