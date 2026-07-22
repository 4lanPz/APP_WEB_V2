import type { Metadata } from "next";
import { Archivo, Newsreader, IBM_Plex_Mono } from "next/font/google";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { BotonWhatsApp } from "@/components/ui/BotonWhatsApp";
import { MotionProviders } from "@/components/motion/MotionProviders";
import { PageTransition } from "@/components/motion/PageTransition";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Textil Padilla",
  description:
    "Textil Padilla — seleccionamos, tejemos y teñimos. Manufactura textil de precisión para marcas, distribuidores y retail premium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} ${newsreader.variable} ${plexMono.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-paper text-ink antialiased">
        <MotionProviders>
          <Navbar />
          <main className="flex-1 pt-17">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          {/* Fuera de <main> y al final del DOM: es una utilidad de toda la
              web, no contenido de la página, y así queda el último en el orden
              de tabulación en vez de interrumpir la lectura. */}
          <BotonWhatsApp />
        </MotionProviders>
      </body>
    </html>
  );
}
