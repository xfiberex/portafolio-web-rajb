import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Lightbox Component
 * ─────────────────────────────────────────────────────────────
 * Visor de imagen a pantalla completa con el contrato de diálogo
 * modal completo:
 * - Escape y click en el scrim cierran
 * - foco atrapado dentro del panel (Tab no se escapa a la página)
 * - el foco vuelve al botón que lo abrió al cerrar
 * - scroll del body bloqueado, compensando el ancho de la barra
 */
const Lightbox = ({ src, alt, onClose }: LightboxProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  // Bloquea el scroll de fondo sin provocar salto de layout
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, []);

  // Mueve el foco al cierre y lo devuelve al disparador al desmontar
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => trigger?.focus?.();
  }, []);

  // Escape para cerrar, Tab circular dentro del panel
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Portal a <body>: evita que un ancestro con transform/filter
  // convierta el `fixed` en relativo a la sección contenedora.
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-scrim p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <motion.div
        ref={panelRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative flex w-full max-w-6xl items-center justify-center"
        onClick={(event) => event.stopPropagation()}
      >
        <span id={titleId} className="sr-only">
          {alt} — vista ampliada
        </span>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute -top-4 -right-2 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border-strong bg-elevated text-muted shadow-lg hover:bg-primary hover:text-primary-foreground sm:top-2 sm:right-2"
          aria-label="Cerrar visor de imagen"
        >
          <X size={22} />
        </button>

        <img
          src={src}
          alt={alt}
          className="max-h-[85vh] max-w-[95vw] rounded-card border border-border object-contain shadow-2xl sm:max-w-[90vw]"
        />
      </motion.div>
    </motion.div>,
    document.body,
  );
};

export default Lightbox;
