import { Component, type ErrorInfo, type ReactNode } from "react";
import { CV_URL, EMAIL_PARTS, buildEmail } from "../../lib/contact";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * ErrorBoundary
 * ─────────────────────────────────────────────────────────────
 * Sin esto, una excepción en cualquier componente deja la página
 * completamente en blanco y sin un solo mensaje — el mismo síntoma
 * que tener JavaScript desactivado. Para un portafolio eso equivale
 * a perder al visitante, así que el fallback prioriza una cosa:
 * que siga habiendo forma de contactar.
 *
 * El fallback no importa Framer Motion, lucide-react ni ningún
 * componente propio a propósito: lo que se pinta cuando la UI se ha
 * roto no debe depender de la UI que se ha roto. Solo HTML y clases.
 *
 * Tiene que ser clase: React no expone equivalente en hooks.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // No hay servicio de telemetría; la consola es el único registro.
    console.error("ErrorBoundary capturó un error:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const email = buildEmail(EMAIL_PARTS);

    return (
      <div className="flex min-h-dvh items-center justify-center bg-background px-6 py-16 text-foreground">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold">Algo se ha roto en esta página</h1>

          <p className="mt-4 leading-relaxed text-muted">
            Es un fallo del sitio, no de tu navegador. Si venías a ver mi perfil, aquí tienes las dos vías que no
            dependen de que esto funcione:
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center justify-center rounded-lg bg-primary-strong px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-strong-hover"
            >
              Escribirme a {email}
            </a>

            <a
              href={CV_URL}
              className="inline-flex items-center justify-center rounded-lg border border-border-strong px-6 py-3 text-sm text-muted hover:bg-surface-hover hover:text-foreground"
            >
              Descargar mi CV en PDF
            </a>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm text-subtle hover:text-foreground"
            >
              Recargar la página
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
