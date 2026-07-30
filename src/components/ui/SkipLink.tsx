/**
 * SkipLink Component
 * ─────────────────────────────────────────────────────────────
 * Permite a quien navega con teclado saltar los 8 enlaces del nav
 * y llegar directo al contenido. Invisible hasta recibir foco.
 */
const SkipLink = () => (
  <a
    href="#main"
    className="sr-only rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:inline-flex focus:min-h-11 focus:items-center"
  >
    Saltar al contenido
  </a>
);

export default SkipLink;
