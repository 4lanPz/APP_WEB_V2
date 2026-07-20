import Link from "next/link";
import { Container } from "./Container";
import {
  footerBrandQuote,
  footerContact,
  footerEmpresaLinks,
  footerLegalLink,
  footerTagline,
} from "@/lib/nav-data";

/**
 * Footer — reconstruido contra los exports de Claude Design: grid de 3
 * columnas (marca+cita / Empresa / Contacto), datos de contacto reales,
 * un solo link legal y el lema "Materia · Precisión · Silencio".
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-paper/15 bg-brand-deep text-paper">
      <Container className="pt-18 pb-10">
        <div className="grid grid-cols-1 gap-10 border-b border-paper/15 pb-12 sm:grid-cols-3 sm:gap-10">
          <div>
            <Link href="/" className="mb-5.5 flex items-center gap-3">
              <span className="block size-2.5 shrink-0 bg-brand" />
              <span className="font-sans text-[17px] font-semibold tracking-[0.02em]">
                Textil Padilla
              </span>
            </Link>
            <p className="max-w-[32ch] font-serif text-[19px] italic leading-normal text-greige">
              {footerBrandQuote}
            </p>
          </div>

          <nav>
            <div className="mb-5 font-mono text-xs uppercase tracking-widest text-graphite">
              Empresa
            </div>
            <div className="flex flex-col">
              {footerEmpresaLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-1.5 font-sans text-[15px] text-bone hover:text-paper"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <div>
            <div className="mb-5 font-mono text-xs uppercase tracking-widest text-graphite">
              Contacto
            </div>
            <div className="font-mono text-[13px] leading-[1.9] text-greige">
              <a href={`mailto:${footerContact.email}`} className="block hover:text-paper">
                {footerContact.email}
              </a>
              <a
                href={`tel:${footerContact.phone.replace(/\s/g, "")}`}
                className="block hover:text-paper"
              >
                {footerContact.phone}
              </a>
              {footerContact.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-6.5 font-mono text-xs uppercase tracking-[0.06em] text-graphite">
          <span className="flex flex-wrap items-center gap-4.5">
            <span>
              © {year} Textil Padilla
            </span>
            <Link href={footerLegalLink.href} className="text-graphite hover:text-paper">
              {footerLegalLink.label}
            </Link>
          </span>
          <span>{footerTagline}</span>
        </div>
      </Container>
    </footer>
  );
}
