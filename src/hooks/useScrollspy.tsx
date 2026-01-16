import { useEffect, useState, useRef, useCallback } from "react";

interface ScrollspyOptions {
  rootMargin?: string;
  threshold?: number;
  bottomMargin?: number;
}

export const useScrollspy = (
  sections: string[] = [],
  { rootMargin = "0px 0px -60% 0px", threshold = 0.25, bottomMargin = 50 }: ScrollspyOptions = {}
): string => {
  const [activeId, setActiveId] = useState<string>(sections[0] || "");
  const isAtBottomRef = useRef<boolean>(false);
  const lastSection = sections[sections.length - 1];

  // Función para detectar si estamos al final de la página
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
      if (isAtBottomRef.current) {
        return;
      }

      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        if (id) {
          if (entry.isIntersecting) {
            visibleSections.add(id);
          } else {
            visibleSections.delete(id);
          }
        }
      });

      if (visibleSections.size > 0) {
        const visibleArray = Array.from(visibleSections);
        const topSection = sections.find((section) => visibleArray.includes(section));
        if (topSection) {
          setActiveId(topSection);
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin,
      threshold,
    });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      // PRIORIDAD: Detección de bottom-of-page
      const atBottom = checkIfAtBottom();
      isAtBottomRef.current = atBottom;

      if (atBottom) {
        setActiveId(lastSection);
        return;
      }

      // Fallback: Si ninguna sección es visible, usar posición de scroll
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

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Verificar estado inicial
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections, rootMargin, threshold, checkIfAtBottom, lastSection]);

  return activeId;
};

export default useScrollspy;
