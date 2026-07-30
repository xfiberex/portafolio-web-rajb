import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SkipLink from "./ui/SkipLink";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout Component
 * ─────────────────────────────────────────────────────────────
 * Maneja la estructura global de la aplicación:
 * - Skip link para navegación por teclado
 * - Fondo con gradiente sutil
 * - Navegación sticky
 * - Footer consistente
 */
const Layout = ({ children }: LayoutProps) => (
  <div className="min-h-dvh bg-background text-foreground selection:bg-primary/30 selection:text-foreground">
    <SkipLink />

    {/* Gradiente de profundidad. Tokenizado: sigue al tema, no a un valor fijo. */}
    <div
      className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--color-primary-soft),transparent)]"
      aria-hidden="true"
    />

    <div className="relative">
      <Navbar />
      {/* tabIndex -1: sin esto varios navegadores no mueven el foco
          al destino del skip link, solo hacen scroll. */}
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer />
    </div>
  </div>
);

export default Layout;
