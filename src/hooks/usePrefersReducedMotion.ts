import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void): (() => void) => {
  const list = window.matchMedia(QUERY);
  list.addEventListener("change", onChange);
  return () => list.removeEventListener("change", onChange);
};

const getSnapshot = (): boolean => window.matchMedia(QUERY).matches;

/**
 * usePrefersReducedMotion
 * ─────────────────────────────────────────────────────────────
 * Devuelve `true` si el visitante pide movimiento reducido, y se
 * vuelve a renderizar si cambia la preferencia sin recargar.
 *
 * Hace falta en JS porque la vía CSS no alcanza a todo: la regla
 * `animation-duration: .01ms` de index.css solo apaga @keyframes
 * —en este sitio, el parpadeo del cursor— y <MotionConfig
 * reducedMotion="user"> solo cubre Framer Motion. Lo que anima con
 * setTimeout, como react-type-animation, no lo detiene ninguna de
 * las dos: hay que no renderizarlo. Ver T1-02.
 *
 * `useSyncExternalStore` y no useState+useEffect para que el primer
 * render ya tenga el valor correcto y no se teclee un fotograma
 * antes de apagarse.
 */
export const usePrefersReducedMotion = (): boolean =>
  // El tercer argumento (getServerSnapshot) evita reventar si algún día
  // se prerenderiza el HTML en build (T4-04), donde no existe matchMedia.
  useSyncExternalStore(subscribe, getSnapshot, () => false);

export default usePrefersReducedMotion;
