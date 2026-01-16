import type { Variants } from "framer-motion";

// ═══════════════════════════════════════════════════════════
// FRAMER MOTION VARIANTS - Reusable Animation System
// ═══════════════════════════════════════════════════════════

/** Fade + slide up - ideal para tarjetas, secciones, y contenido */
export const fadeUpVariant: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    filter: "blur(4px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { 
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] // ease-out-expo
    },
  },
};

/** Contenedor con stagger para hijos */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/** Scale up suave - para iconos y badges */
export const scaleUpVariant: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/** Slide desde la izquierda - para timelines */
export const slideLeftVariant: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Hover effects para tarjetas interactivas */
export const cardHoverEffect = {
  y: -8,
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
};
