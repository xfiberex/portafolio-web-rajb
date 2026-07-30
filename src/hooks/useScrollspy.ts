import { useCallback, useEffect, useRef, useState } from "react";

interface ScrollspyOptions {
  rootMargin?: string;
  threshold?: number;
  bottomMargin?: number;
}

/**
 * useScrollspy
 * ─────────────────────────────────────────────────────────────
 * Devuelve el id de la sección visible. Combina IntersectionObserver
 * (barato, asíncrono) con un listener de scroll para dos casos que el
 * observer no cubre: el final de la página y cuando ninguna sección
 * cumple el threshold.
 *
 * El listener está throttleado con requestAnimationFrame: lee
 * scrollHeight/innerHeight, que fuerzan un recálculo de layout, y sin
 * throttle eso ocurría en cada evento de scroll.
 */
export const useScrollspy = (
  sections: string[] = [],
  { rootMargin = "0px 0px -60% 0px", threshold = 0.25, bottomMargin = 50 }: ScrollspyOptions = {},
): string => {
  const [activeId, setActiveId] = useState<string>(sections[0] || "");
  const isAtBottomRef = useRef<boolean>(false);
  const lastSection = sections[sections.length - 1];

  const checkIfAtBottom = useCallback((): boolean => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;

    return scrollTop + clientHeight >= scrollHeight - bottomMargin;
  }, [bottomMargin]);

  useEffect(() => {
    const visibleSections = new Set<string>();

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // Si estamos al final de la página, ignorar el observer
      if (isAtBottomRef.current) return;

      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        if (!id) return;
        if (entry.isIntersecting) {
          visibleSections.add(id);
        } else {
          visibleSections.delete(id);
        }
      });

      if (visibleSections.size > 0) {
        const topSection = sections.find((section) => visibleSections.has(section));
        if (topSection) setActiveId(topSection);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, { root: null, rootMargin, threshold });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const measure = () => {
      // PRIORIDAD: detección de final de página
      const atBottom = checkIfAtBottom();
      isAtBottomRef.current = atBottom;

      if (atBottom) {
        setActiveId(lastSection);
        return;
      }

      // Fallback: si ninguna sección es visible, usar la posición de scroll
      if (visibleSections.size === 0) {
        const scrollPosition = window.scrollY + 100;

        for (let i = sections.length - 1; i >= 0; i--) {
          const section = document.getElementById(sections[i]);
          if (section && section.offsetTop <= scrollPosition) {
            setActiveId(sections[i]);
            break;
          }
        }
      }
    };

    let frame = 0;
    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    measure();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [sections, rootMargin, threshold, checkIfAtBottom, lastSection]);

  return activeId;
};

export default useScrollspy;
