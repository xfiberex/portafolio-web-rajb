import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
    children: ReactNode;
}

/**
 * Layout Component
 * ─────────────────────────────────────────────────────────────
 * Maneja la estructura global de la aplicación:
 * - Fondo con gradiente sutil
 * - Navegación sticky
 * - Footer consistente
 */
const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-(--color-background) text-(--color-text) selection:bg-(--color-primary)/30 selection:text-(--color-text)">
            {/* Gradient overlay sutil para profundidad */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(62.8%_0.2_264_/_8%),transparent)] pointer-events-none" />

            <div className="relative">
                <Navbar />
                <main>{children}</main>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
