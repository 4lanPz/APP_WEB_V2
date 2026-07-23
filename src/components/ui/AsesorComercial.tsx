"use client";

import { useState, type FormEvent } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { SectionHeader } from "./SectionHeader";
import { Container } from "./Container";
import { WHATSAPP_HREF, WHATSAPP_VISIBLE } from "@/data/whatsapp";

export interface AsesorComercialProps {
  index: string;
  title: string;
  intro: string;
  questionLabel: string;
  questionPlaceholder: string;
}

/*
 * El canal de WhatsApp sale de `data/whatsapp.ts`, igual que el botón
 * flotante. Aquí había un segundo número escrito a mano (+593 99 000 0000) que
 * ya no coincidía con el del flotante: dos fuentes del mismo dato garantizan
 * que al poner el real se cambie una y se olvide la otra. El resto de canales
 * siguen aquí porque son datos distintos, no copias de este.
 */
const CONTACT_CHANNELS = [
  { label: `WhatsApp · ${WHATSAPP_VISIBLE}`, href: WHATSAPP_HREF },
  { label: "Teléfono · +593 2 000 0000", href: "tel:+59320000000" },
  { label: "asesor@textilpadilla.ec", href: "mailto:asesor@textilpadilla.ec" },
];

/**
 * "02 Asesor comercial" — patrón reutilizado tal cual en Categoria Microfibra,
 * Subcategoria Dortmund Plus y Camisetas.dc.html (marcado en el propio export
 * como "patrón reutilizado"). Sin backend: confirmación editorial en sitio,
 * igual que el formulario de Contacto.
 */
export function AsesorComercial({
  index,
  title,
  intro,
  questionLabel,
  questionPlaceholder,
}: AsesorComercialProps) {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section className="bg-brand-deep py-16 sm:py-24">
      <Container>
        <SectionHeader index={index} title={title} tag="Asesoría técnica" tone="dark" />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-8">
            <p className="max-w-md font-serif text-body-l text-paper/85">{intro}</p>
            <div>
              <p className="font-sans text-[15px] font-semibold text-paper">
                Andrés Padilla
              </p>
              <p className="font-mono text-xs uppercase tracking-widest text-paper/60">
                Asesor técnico textil
              </p>
            </div>
            <ul className="flex flex-col gap-3">
              {CONTACT_CHANNELS.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    className="inline-flex items-center gap-2.5 font-mono text-[13px] text-paper/80 hover:text-paper"
                  >
                    <span className="block size-1.5 shrink-0 bg-brand" />
                    {channel.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {sent ? (
              <div className="border border-brand bg-paper/5 p-8">
                <p className="mb-2 font-mono text-xs uppercase tracking-widest text-brand">
                  Consulta recibida
                </p>
                <p className="font-serif text-body-m text-paper/85">
                  Gracias. Andrés revisa tu proyecto y te escribe con una
                  recomendación concreta —normalmente el mismo día.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <Input
                  label="Nombre y empresa"
                  placeholder="Cómo te llamas y para quién produces"
                  required
                  className="border-paper/25 text-paper placeholder:text-paper/40 focus:border-brand"
                />
                <Input
                  label={questionLabel}
                  placeholder={questionPlaceholder}
                  required
                  className="border-paper/25 text-paper placeholder:text-paper/40 focus:border-brand"
                />
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="tp-consulta"
                    className="font-mono text-xs uppercase tracking-widest text-paper/60"
                  >
                    Tu consulta técnica
                  </label>
                  <textarea
                    id="tp-consulta"
                    required
                    placeholder="Gramaje, color, cantidad, plazos… lo que necesites resolver"
                    rows={3}
                    className="w-full resize-y border-0 border-b border-paper/25 bg-transparent px-0.5 py-3 font-sans text-[17px] text-paper outline-none placeholder:text-paper/40 focus:border-brand"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-5">
                  <Button type="submit" variant="primary">
                    Enviar consulta →
                  </Button>
                  <span className="font-serif text-caption italic text-paper/60">
                    Te responde una persona, normalmente el mismo día. Sin
                    compromiso.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
