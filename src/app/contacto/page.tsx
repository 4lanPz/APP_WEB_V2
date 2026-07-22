import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/ui/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PhotoCurtain } from "@/components/motion/Curtain";
import { ContactForm } from "@/components/ui/ContactForm";
import { LocationsMap } from "@/components/ui/LocationsMap";
import { DraftNotice } from "@/components/ui/DraftNotice";
import { buttonVariants } from "@/components/ui/buttonVariants";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { locations, comoLlegar, PENDING } from "@/data/locations";
import { foto } from "@/data/imagenes";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contacto — Textil Padilla",
  description:
    "Escríbenos o visita uno de nuestros locales en Ecuador: Alangasí, La Marín, Solanda, Sangolquí y Guayaquil.",
};

const directChannels = [
  { label: "Correo", value: "hola@textilpadilla.ec", href: "mailto:hola@textilpadilla.ec" },
  { label: "Teléfono central", value: PENDING },
  { label: "Horario general", value: PENDING },
];

export default function ContactoPage() {
  return (
    <div className="flex flex-col">
      <Hero
        imagen="hero-contacto"
        eyebrow="Contacto · Escríbenos o visita un local · Ecuador"
        headlineLines={["Hablemos de tu", "tela, tu color,", "tu referencia."]}
        subhead="Detrás del formulario hay un asesor comercial, no un buzón. Cuéntanos qué buscas —uso, gramaje, tono— y te respondemos con criterio de taller. O acércate a cualquiera de nuestros locales en Ecuador."
        secondaryCta={{ label: "Ver nuestros locales →", href: "#mapa" }}
      />

      <section id="escribenos" className="py-16 sm:py-24">
        <Container>
          <SectionHeader index="01" title="Escríbenos" tag="Te responde un asesor" />
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.25fr_0.8fr] lg:gap-16">
            <ContactForm />
            <PhotoCurtain
              dark
              src={foto("retrato-asesor")?.ruta}
              alt={foto("retrato-asesor")?.alt ?? ""}
              sizes="(min-width: 1024px) 50vw, 100vw"
              label="Oficio · manos y máquina"
              sublabel="Retrato de asesor comercial"
              caption="Tu asesor · Asesoría técnica · Selección de tela y color"
              className="order-first aspect-4/3 min-h-[280px] lg:order-last lg:aspect-auto lg:h-full"
            />
          </div>

          <RevealGroup
            variante="rejilla"
            className="mt-12 grid grid-cols-1 gap-px border-y border-greige bg-greige sm:grid-cols-3">
            {directChannels.map((channel) => (
              <RevealItem key={channel.label} className="bg-paper p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-graphite">
                  {channel.label}
                </p>
                {channel.href ? (
                  <a
                    href={channel.href}
                    className="mt-1 block font-sans text-[15px] font-medium text-ink hover:text-brand"
                  >
                    {channel.value}
                  </a>
                ) : (
                  <p className="mt-1 font-sans text-[15px] font-medium text-graphite">
                    {channel.value}
                  </p>
                )}
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section id="mapa" className="bg-brand-deep py-16 text-paper sm:py-24">
        <Container>
          <SectionHeader index="02" title="Dónde encontrarnos" tag="5 locales · Ecuador" tone="dark" />
          <p className="mb-10 max-w-2xl font-serif text-body-m text-paper/80">
            Matriz en Alangasí, tres puntos de venta en Quito y el valle de los
            Chillos, y distribución en la costa. Pulsa un marcador para ver la
            ficha del local y abrir la ruta.
          </p>
          <LocationsMap locations={locations} />
        </Container>
      </section>

      <section id="locales" className="py-16 sm:py-24">
        <Container>
          <SectionHeader index="03" title="Fichas de local" tag="Dirección · contacto · horario" />
          <div className="mb-8 flex flex-col gap-3">
            <DraftNotice>Datos de local pendientes de confirmar</DraftNotice>
            <p className="font-serif text-caption italic text-graphite">
              Direcciones, teléfonos y horarios se confirman con
              administración antes de publicar.
            </p>
          </div>

          {/*
            Ilustra la sección, no una sucursal concreta: no se sabe cuál de los
            cinco locales es, así que ni el caption ni el alt lo atribuyen.
          */}
          <PhotoCurtain
            src={foto("local-fachada")?.ruta}
            alt={foto("local-fachada")?.alt}
            sizes="(min-width: 1024px) 80vw, 100vw"
            caption="Textil Padilla e Hijos"
            className="mb-10 aspect-21/9"
          />

          <div className="hidden grid-cols-[40px_1.1fr_1.4fr_1fr_auto] gap-4 border-b border-ink pb-3 font-mono text-xs uppercase tracking-widest text-graphite sm:grid">
            <span>Ref</span>
            <span>Local</span>
            <span>Sector · dirección</span>
            <span>Contacto · horario</span>
            <span className="sr-only">Ir</span>
          </div>

          <RevealGroup className="flex flex-col">
            {locations.map((location) => (
              <RevealItem
                key={location.ref}
                className="grid grid-cols-1 gap-2 border-b border-greige py-5 sm:grid-cols-[40px_1.1fr_1.4fr_1fr_auto] sm:items-baseline sm:gap-4"
              >
                <span className="font-mono text-[11px] text-accent">{location.ref}</span>
                <span className="flex items-center gap-2.5 font-sans text-[15px] font-semibold text-ink">
                  <span
                    className="block size-1.5 shrink-0"
                    style={{ backgroundColor: location.isMatriz ? "#33A2DC" : "#A0715A" }}
                  />
                  {location.name}
                  <span className="font-mono text-xs font-normal uppercase tracking-widest text-graphite">
                    {location.zone}
                  </span>
                </span>
                {/* El sector está confirmado (ficha de Google + OSM); la calle y
                    el número no llegaron, así que ese campo sigue pendiente. */}
                <span className="flex flex-col font-mono text-[13px]">
                  <span className="text-ink">{location.sector}</span>
                  <span className="text-graphite">{PENDING}</span>
                </span>
                <span className="font-mono text-[13px] text-graphite">{PENDING}</span>
                <a
                  href={comoLlegar(location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[15px] font-medium text-ink hover:text-brand"
                >
                  Cómo llegar ↗
                </a>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <MagneticLink href="#escribenos" className={buttonVariants({ variant: "primary" })}>
              Escríbenos ahora →
            </MagneticLink>
            <Link
              href="/productos"
              className="font-sans text-[15px] font-medium text-ink hover:text-brand"
            >
              Ver catálogo de telas →
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
