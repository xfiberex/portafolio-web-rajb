import type { Variants } from "framer-motion";

// ═══════════════════════════════════════════════════════════
// FRAMER MOTION - Sistema de animación compartido
// ───────────────────────────────────────────────────────────
// Fuente única de verdad. Antes cada sección redeclaraba sus
// propios `containerVariants`/`itemVariants` inline (5 copias)
// y este archivo solo lo consumía el Hero.
//
// El respeto a `prefers-reduced-motion` no vive acá: lo aplica
// <MotionConfig reducedMotion="user"> en main.tsx, que neutraliza
// todo transform/opacity de golpe.
// ═══════════════════════════════════════════════════════════

/* Tupla mutable a propósito: un `as const` la vuelve readonly y
   deja de ser asignable al tipo `Easing` de Framer Motion. */
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Config de viewport compartida para las animaciones de entrada.
 * `once: true` evita re-animar al volver a scrollear; el margen
 * negativo dispara la animación un poco antes de entrar en pantalla.
 */
export const sectionViewport = { once: true, margin: "-80px" } as const;

/** Fade + slide up — tarjetas, secciones y contenido general */
export const fadeUpVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: EASE_OUT_EXPO,
    },
  },
};

/**
 * Contenedor con stagger para hijos. **Solo orquesta**: no anima nada
 * propio.
 *
 * Tenía un `opacity: 0 → 1` que era un doble fundido: los nueve sitios que
 * usan este contenedor tienen hijos con su propio fundido (`fadeUpVariant`,
 * `scaleUpVariant`, `slideLeftVariant`), así que la opacidad del padre se
 * multiplicaba con la del hijo sin aportar nada visible.
 *
 * Y sí costaba: el LCP se registra cuando **termina** la animación de
 * entrada del elemento, incluidos los ancestros que animan. Ver T2-23.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

/** Scale up suave — iconos, badges y tarjetas en grilla */
export const scaleUpVariant: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: EASE_OUT_EXPO },
  },
};

/** Slide desde la izquierda — timelines y listas verticales */
export const slideLeftVariant: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO },
  },
};

/** Elevación al hover para tarjetas interactivas */
export const cardLift = {
  y: -6,
  transition: { duration: 0.25, ease: EASE_OUT_EXPO },
};
