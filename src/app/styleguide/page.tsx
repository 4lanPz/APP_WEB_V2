import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ProductCard } from "@/components/ui/ProductCard";
import { CategoryCard } from "@/components/ui/CategoryCard";

export const metadata: Metadata = {
  title: "Styleguide — Textil Padilla",
  robots: { index: false, follow: false },
};

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-ink py-16">
      <Container>
        <div className="mb-10 flex flex-col gap-2">
          <span className="font-mono text-label uppercase text-accent">
            {eyebrow}
          </span>
          <h2 className="font-sans text-h2 font-medium text-ink">{title}</h2>
        </div>
        {children}
      </Container>
    </section>
  );
}

const spacingScale = [
  { label: "space-1", px: 4 },
  { label: "space-2", px: 8 },
  { label: "space-3", px: 12 },
  { label: "space-4", px: 16 },
  { label: "space-6", px: 24 },
  { label: "space-8", px: 32 },
  { label: "space-12", px: 48 },
  { label: "space-16", px: 64 },
  { label: "space-24", px: 96 },
  { label: "space-32", px: 128 },
];

export default function StyleguidePage() {
  return (
    <div className="flex flex-col">
      <Container className="flex flex-col gap-3 py-16">
        <span className="font-mono text-label uppercase text-graphite">
          Fase 1 · Validación interna — no indexar, no es una página del sitio
        </span>
        <h1 className="font-sans text-display font-medium text-ink">
          Fundaciones
        </h1>
        <p className="max-w-xl font-serif text-body-l text-graphite">
          Tokens y componentes base del Design System v1.1, en estado de
          reposo. Cero animación — solo transiciones de color instantáneas en
          hover.
        </p>
      </Container>

      <Section eyebrow="01 · Tokens" title="Color">
        <div className="grid grid-cols-2 gap-px border border-greige bg-greige sm:grid-cols-4">
          <div className="flex flex-col gap-16 bg-paper p-6">
            <div className="h-16 w-full bg-paper border border-greige" />
            <div>
              <p className="font-sans text-[15px] font-medium text-ink">
                Papel
              </p>
              <p className="font-mono text-mono text-graphite">
                #F5F2EE · paper
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-16 bg-paper p-6">
            <div className="h-16 w-full bg-bone" />
            <div>
              <p className="font-sans text-[15px] font-medium text-ink">
                Hueso
              </p>
              <p className="font-mono text-mono text-graphite">
                #EDE9E3 · bone
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-16 bg-paper p-6">
            <div className="h-16 w-full bg-greige" />
            <div>
              <p className="font-sans text-[15px] font-medium text-ink">
                Greige
              </p>
              <p className="font-mono text-mono text-graphite">
                #C8C2B8 · greige
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-16 bg-paper p-6">
            <div className="h-16 w-full bg-graphite" />
            <div>
              <p className="font-sans text-[15px] font-medium text-ink">
                Grafito
              </p>
              <p className="font-mono text-mono text-graphite">
                #6B6560 · graphite
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-16 bg-paper p-6">
            <div className="h-16 w-full bg-ink" />
            <div>
              <p className="font-sans text-[15px] font-medium text-ink">
                Tinta
              </p>
              <p className="font-mono text-mono text-graphite">
                #1C1917 · ink
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-16 bg-paper p-6">
            <div className="h-16 w-full bg-brand" />
            <div>
              <p className="font-sans text-[15px] font-medium text-ink">
                Azul Padilla
              </p>
              <p className="font-mono text-mono text-graphite">
                #33A2DC · brand
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-16 bg-paper p-6">
            <div className="h-16 w-full bg-brand-deep" />
            <div>
              <p className="font-sans text-[15px] font-medium text-ink">
                Azul profundo
              </p>
              <p className="font-mono text-mono text-graphite">
                #0D2937 · brand-deep
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-16 bg-paper p-6">
            <div className="h-16 w-full bg-accent" />
            <div>
              <p className="font-sans text-[15px] font-medium text-ink">
                Terracota
              </p>
              <p className="font-mono text-mono text-graphite">
                #A0715A · accent · máx. 5% de superficie
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="02 · Tokens" title="Tipografía">
        <div className="flex flex-col gap-10">
          <div className="border-b border-greige pb-6">
            <p className="font-sans text-display font-medium text-ink">
              Display 72/44
            </p>
            <p className="font-mono text-mono text-graphite">
              Archivo Medium · clamp 44→72px · -0.03em
            </p>
          </div>
          <div className="border-b border-greige pb-6">
            <p className="font-sans text-h1 font-medium text-ink">
              H1 — Materia, precisión, silencio
            </p>
            <p className="font-mono text-mono text-graphite">
              Archivo Medium · clamp 36→48px · -0.02em
            </p>
          </div>
          <div className="border-b border-greige pb-6">
            <p className="font-sans text-h2 font-medium text-ink">
              H2 — Seleccionar, tejer, teñir
            </p>
            <p className="font-mono text-mono text-graphite">
              Archivo Medium · clamp 26→32px · -0.01em
            </p>
          </div>
          <div className="border-b border-greige pb-6">
            <p className="font-sans text-h3 font-semibold text-ink">
              H3 — Carta de color
            </p>
            <p className="font-mono text-mono text-graphite">
              Archivo Semibold · clamp 19→22px · -0.005em
            </p>
          </div>
          <div className="border-b border-greige pb-6">
            <p className="max-w-xl font-serif text-body-l text-ink">
              Body L — No fabricamos la moda. Fabricamos aquello con lo que la
              moda se hace.
            </p>
            <p className="font-mono text-mono text-graphite">
              Newsreader Regular · 20px · 1.6
            </p>
          </div>
          <div className="border-b border-greige pb-6">
            <p className="max-w-xl font-serif text-body-m text-ink">
              Body M — Compra hilo ya fabricado y lo convierte en tela: rollos
              tejidos con precisión y, cuando el cliente lo pide, teñidos a su
              color exacto.
            </p>
            <p className="font-mono text-mono text-graphite">
              Newsreader Regular · 16px · 1.6
            </p>
          </div>
          <div className="border-b border-greige pb-6">
            <p className="max-w-xl font-serif text-caption italic text-graphite">
              Caption — muestra teñida, referencia TP-240
            </p>
            <p className="font-mono text-mono text-graphite">
              Newsreader Italic · 13px · 1.5
            </p>
          </div>
          <div className="border-b border-greige pb-6">
            <p className="font-mono text-label font-medium uppercase text-ink">
              Label — Teñido a demanda
            </p>
            <p className="font-mono text-mono text-graphite">
              IBM Plex Mono Medium · 12px · uppercase +0.08em
            </p>
          </div>
          <div>
            <p className="font-mono text-mono text-ink">
              Mono — 320 g/m² · Sarga 3/1 · TP-240
            </p>
            <p className="font-mono text-mono text-graphite">
              IBM Plex Mono Regular · 14px · 1.55
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="03 · Tokens" title="Espaciado">
        <p className="mb-8 max-w-xl font-serif text-body-m text-graphite">
          Escala base-4, idéntica a la escala de espaciado por defecto de
          Tailwind (space-1 … space-32).
        </p>
        <div className="flex flex-col gap-4">
          {spacingScale.map((step) => (
            <div key={step.label} className="flex items-center gap-4">
              <span className="w-20 shrink-0 font-mono text-mono text-graphite">
                {step.label}
              </span>
              <div
                className="h-3 bg-brand"
                style={{ width: `${step.px}px` }}
              />
              <span className="font-mono text-mono text-graphite">
                {step.px}px
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="04 · Tokens" title="Radios de esquina">
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col items-start gap-3">
            <div className="h-20 w-20 rounded-none border border-ink bg-bone" />
            <span className="font-mono text-mono text-graphite">
              none · 0px
            </span>
          </div>
          <div className="flex flex-col items-start gap-3">
            <div className="h-20 w-20 rounded-sm border border-ink bg-bone" />
            <span className="font-mono text-mono text-graphite">
              sm · 2px — controles
            </span>
          </div>
          <div className="flex flex-col items-start gap-3">
            <div className="h-20 w-20 rounded-md border border-ink bg-bone" />
            <span className="font-mono text-mono text-graphite">
              md · 4px — techo absoluto
            </span>
          </div>
        </div>
      </Section>

      <Section eyebrow="05 · Componente" title="Botones">
        <div className="flex flex-col gap-10">
          <div className="flex flex-wrap items-center gap-6">
            <Button variant="primary">Solicitar muestra</Button>
            <Button variant="secondary">Ver ficha técnica</Button>
            <Button variant="ghost">Descargar catálogo</Button>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Button variant="primary" disabled>
              Solicitar muestra
            </Button>
            <Button variant="secondary" disabled>
              Ver ficha técnica
            </Button>
            <Button variant="ghost" disabled>
              Descargar catálogo
            </Button>
          </div>
        </div>
      </Section>

      <Section eyebrow="06 · Componente" title="Input de texto">
        <div className="grid max-w-md gap-8">
          <Input label="Nombre" placeholder="Nombre y apellidos" />
          <Input label="Email" type="email" placeholder="nombre@empresa.com" />
          <Input label="Referencia" placeholder="TP-240" disabled />
        </div>
      </Section>

      <Section eyebrow="07 · Componente" title="Badge / etiqueta técnica">
        <div className="flex flex-wrap gap-3">
          <Badge>320 g/m²</Badge>
          <Badge>Algodón 100%</Badge>
          <Badge>Sarga 3/1</Badge>
          <Badge>Teñido a demanda</Badge>
          <Badge active>Activo</Badge>
        </div>
      </Section>

      <Section eyebrow="08 · Componente" title="Cards">
        <p className="mb-6 max-w-xl font-serif text-body-m text-graphite">
          Ambas cards viven en una &quot;seam grid&quot;: gap de 1px sobre fondo
          greige + borde exterior, tal como en los exports — no llevan borde
          propio.
        </p>
        <div className="mb-12 grid grid-cols-1 gap-px border border-greige bg-greige sm:grid-cols-3">
          <ProductCard
            href="/productos/microfibra/dortmund-plus/blancos"
            imageSrc="/placeholder-rollo.svg"
            imageAlt="Tono Blancos, Dortmund Plus"
            title="Blancos"
            reference="TP-240"
            specs={["320 g/m²", "Sarga peinada"]}
            description="Blanco óptico y crudos. Base ideal para sublimación y estampado."
          />
          <ProductCard
            href="/productos/microfibra/athletic"
            imageSrc="/placeholder-rollo.svg"
            imageAlt="Construcción Athletic"
            title="Athletic"
            reference="TP-118"
            specs={["145 g/m²", "Poliéster 100%"]}
            description="Microfibra ligera de secado rápido para prenda deportiva."
          />
          <ProductCard
            href="/productos/microfibra/boston"
            imageSrc="/placeholder-rollo.svg"
            imageAlt="Construcción Boston"
            title="Boston"
            reference="TP-062"
            specs={["180 g/m²", "Jersey"]}
            description="Punto de mano suave, solidez de color verificada para teñido a demanda."
          />
        </div>
        <div className="grid grid-cols-1 gap-px border border-greige bg-greige sm:grid-cols-2 lg:grid-cols-4">
          <CategoryCard
            href="/productos/microfibra"
            index={1}
            title="Microfibra"
            description="Poliéster ligero de secado rápido para prenda deportiva."
          />
          <CategoryCard
            href="/productos#categorias"
            index={2}
            title="Texturizado"
            description="Hilo texturizado con cuerpo y frescura. En preparación."
          />
          <CategoryCard
            href="/productos#categorias"
            index={3}
            title="Spun"
            description="Hilado spun de tacto algodonoso. En preparación."
          />
          <CategoryCard
            href="/productos#categorias"
            index={4}
            title="Polialgodón"
            description="Mezcla poliéster-algodón resistente. En preparación."
          />
        </div>
      </Section>
    </div>
  );
}
