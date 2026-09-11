import { StrictMode } from "react";
import { MotionConfig } from "framer-motion";
import App from "./App.tsx";
import ErrorBoundary from "./components/ui/ErrorBoundary";

/**
 * El árbol completo, compartido por el cliente (`main.tsx`) y el prerender
 * (`entry-server.tsx`, T4-04). Tiene que ser **el mismo** en los dos lados:
 * cualquier diferencia entre lo que genera Node y lo que hidrata el
 * navegador es un desajuste de hidratación.
 */
export default function Raiz() {
  return (
    <StrictMode>
      {/*
        reducedMotion="user" hace que Framer Motion respete
        `prefers-reduced-motion` en toda la app: los transform y opacity
        se aplican de golpe en su valor final, sin animar. Las
        transiciones CSS y el scroll suave los cubre index.css.
      */}
      <ErrorBoundary>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </ErrorBoundary>
    </StrictMode>
  );
}
