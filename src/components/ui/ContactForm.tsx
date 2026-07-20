"use client";

import { useState, type FormEvent } from "react";
import { Input } from "./Input";
import { Button } from "./Button";

/** "01 Escríbenos" — sin backend: confirmación editorial en sitio (igual que Asesor comercial). */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex items-center gap-3 border border-brand bg-bone p-6">
        <span className="block size-2 shrink-0 bg-brand" />
        <p className="font-serif text-body-m text-ink">
          Mensaje registrado. Un asesor te escribirá pronto.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input label="Nombre" placeholder="Nombre y apellido" required />
        <Input label="Email" type="email" placeholder="nombre@empresa.com" required />
      </div>
      <Input label="Asunto" placeholder="Cotización, muestra, teñido a demanda…" />
      <div className="flex flex-col gap-2">
        <label
          htmlFor="tp-mensaje"
          className="font-mono text-xs uppercase tracking-widest text-graphite"
        >
          Mensaje
        </label>
        <textarea
          id="tp-mensaje"
          required
          rows={4}
          placeholder="Uso previsto, gramaje aproximado, color o referencia Pantone, cantidad estimada…"
          className="w-full resize-y border-0 border-b border-greige bg-transparent px-0.5 py-3 font-sans text-[17px] text-ink outline-none placeholder:text-graphite focus:border-brand"
        />
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <Button type="submit" variant="primary">
          Enviar mensaje →
        </Button>
        <span className="font-serif text-caption italic text-graphite">
          Respondemos en horario de taller, sin prisa y con criterio.
        </span>
      </div>
    </form>
  );
}
