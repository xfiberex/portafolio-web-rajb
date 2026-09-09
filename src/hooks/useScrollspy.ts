import { useCallback, useEffect, useRef, useState } from "react";

interface ScrollspyOptions {
  rootMargin?: string;
  threshold?: number;
  bottomMargin?: number;
}

interface Geometry {
  /** Alto total del documento. */
  pageHeight: number;
  /** offsetTop de cada sección, en el mismo orden que `sections`. */
  offsets: number[];
}

/**
 * useScrollspy
 * ─────────────────────────────────────────────────────────────
 * Devuelve el id de la sección visible. Combina IntersectionObserver
 * (barato, asíncrono) con un listener de scroll para dos casos que el
 * observer no cubre: el final de la página y cuando ninguna sección
 * cumple el threshold.
 *
 * ── Por qué la geometría está cacheada (T2-05) ──
 * Antes `measure()` leía `document.documentElement.scrollHeight` en
 * cada frame de scroll, y `section.offsetTop` de las 8 secciones cuando
 * ninguna era visible. Ambas propiedades fuerzan un recálculo de layout
 * síncrono si los estilos están invalidados — y con ~56 elementos
 * animándose al entrar en pantalla, lo están casi siempre.
 *
 * Medido instrumentando los getters durante un recorrido completo de la
 * página: **567 lecturas de `scrollHeight` y 62 de `offsetTop`, el 97 %
 * de todas las lecturas de layout del recorrido.** Framer Motion sólo
 * aportaba 20. El coste no estaba en la librería.
 *
 * La geometría de la página no cambia al scrollear: sólo al redimensionar,
 * al cargar la fuente (cambia el alto del texto) o si crece el contenido.
 * Así que se lee en esos tres momentos y el scroll no toca el layout.
 */
export const useScrollspy = (
  sections: string[] = [],
  { rootMargin = "0px 0px -60% 0px", threshold = 0.25, bottomMargin = 50 }: ScrollspyOptions = {},
): string => {
  const [activeId, setActiveId] = useState<string>(sections[0] || "");
  const isAtBottomRef = useRef<boolean>(false);
  const geometryRef = useRef<Geometry>({ pageHeight: 0, offsets: [] });
  const lastSection = sections[sections.length - 1];

  /* Única función que toca el layout. Nunca se llama desde el scroll. */
  const readGeometry = useCallback((ids: string[]) => {
    geometryRef.current = {
      pageHeight: document.documentElement.scrollHeight,
      offsets: ids.map((id) => document.getElementById(id)?.offsetTop ?? Number.POSITIVE_INFINITY),
    };
  }, []);

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

    /* `scrollY` e `innerHeight` no fuerzan layout; los valores de
       `geometryRef` ya están medidos. Este callback no lee el DOM. */
    const measure = () => {
      const { pageHeight, offsets } = geometryRef.current;

      // PRIORIDAD: detección de final de página
      const atBottom = window.scrollY + window.innerHeight >= pageHeight - bottomMargin;
      isAtBottomRef.current = atBottom;

      if (atBottom) {
        setActiveId(lastSection);
        return;
      }

      // Fallback: si ninguna sección es visible, usar la posición de scroll
      if (visibleSections.size === 0) {
        const scrollPosition = window.scrollY + 100;

        for (let i = sections.length - 1; i >= 0; i--) {
          if (offsets[i] <= scrollPosition) {
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

    /* La geometría se refresca al redimensionar y cuando el contenido
       cambia de alto. El ResizeObserver cubre además el swap de la fuente
       (Inter se auto-hospeda con `font-display: swap`, y al aplicarse
       cambia el alto del texto). */
    /* Solo relee la geometría. NO llama a `measure()`: el
       ResizeObserver se dispara muchas veces mientras cargan las
       imágenes, y cada llamada entraba por la rama de respaldo —
       cuando aún no hay secciones visibles— pisando el estado
       inicial y marcando una sección arbitraria arriba del todo.
       El original solo medía al scrollear; se conserva así. */
    const refresh = () => readGeometry(sections);

    const resizeObserver = new ResizeObserver(refresh);
    resizeObserver.observe(document.documentElement);
    window.addEventListener("resize", refresh, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    refresh();
    measure();

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", refresh);
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [sections, rootMargin, threshold, bottomMargin, lastSection, readGeometry]);

  return activeId;
};

export default useScrollspy;
