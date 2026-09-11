import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  children: ReactNode;
  /** Borde superior divisorio. El Hero lo omite. */
  divider?: boolean;
  className?: string;
}

/**
 * Section Component
 * ─────────────────────────────────────────────────────────────
 * Único responsable del ritmo vertical, el ancho de contenedor
 * y el `scroll-margin-top` que compensa el navbar sticky.
 *
 * El `scroll-mt-header-total` es lo que hace que los anchors nativos
 * (`href="#projects"`) caigan en el lugar correcto — sin él haría
 * falta calcular el offset a mano en JS. Es `-total` y no `-header`
 * porque el offset debe contar el `border-b` del header: con 4rem
 * justos quedaba 1px de la sección bajo la barra.
 */
const Section = ({ id, children, divider = true, className = "" }: SectionProps) => (
  <section
    id={id}
    className={`scroll-mt-header-total py-section ${divider ? "border-t border-border" : ""} ${className}`}
  >
    <div className="mx-auto max-w-6xl px-gutter">{children}</div>
  </section>
);

export default Section;
