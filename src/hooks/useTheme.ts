import { useCallback, useEffect, useState } from "react";

export type Tema = "light" | "dark";

/** Misma clave que usa el script inline de `index.html`. */
export const CLAVE_TEMA = "tema";

/**
 * El color que pinta la barra del navegador movil. Son los hex exactos de
 * `--value-background` en cada tema, convertidos de oklch por Chromium y
 * comprobados: el valor que habia antes (#1a1c22) no correspondia a ningun
 * color del sitio y la barra salia mas clara que la pagina.
 */
const COLOR_DE_BARRA: Record<Tema, string> = { dark: "#080c11", light: "#f0f2f5" };

const esTema = (v: unknown): v is Tema => v === "light" || v === "dark";

/**
 * En condiciones normales basta el atributo: el script inline del <head> ya
 * resolvio la preferencia antes del primer pintado, y leerlo de ahi impide
 * que React discrepe de lo que ya se ve.
 *
 * Los dos respaldos no son decorativos. Si el script inline no llega a
 * correr —un hash de CSP desincronizado, por ejemplo— el atributo no
 * existe, y sin ellos este hook daria "dark" y **sobreescribiria en
 * silencio la preferencia guardada** del usuario. Se descubrio simulando
 * justo esa averia.
 */
const temaActual = (): Tema => {
  // Prerender (T4-04): en Node no hay DOM. El valor no llega a pintarse:
  // el Navbar elige el icono por CSS y la etiqueta solo tras hidratar.
  if (typeof document === "undefined") return "dark";

  const attr = document.documentElement.getAttribute("data-theme");
  if (esTema(attr)) return attr;

  try {
    const guardado = localStorage.getItem(CLAVE_TEMA);
    if (esTema(guardado)) return guardado;
  } catch {
    // Almacenamiento bloqueado: queda la preferencia del sistema.
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

export default function useTheme() {
  const [tema, setTema] = useState<Tema>(temaActual);

  // Refleja el estado en el DOM. Nada de escribir en localStorage aqui:
  // ver `alternar`.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", COLOR_DE_BARRA[tema]);
  }, [tema]);

  /**
   * **Solo se guarda cuando el usuario elige.** Persistir tambien al montar
   * parece inofensivo y no lo es: con una simple visita el tema quedaba
   * congelado, y a partir de ahi cambiar el tema del sistema operativo ya
   * no tenia ningun efecto sobre el sitio. Lo destapo una prueba que
   * cargaba con el sistema en claro y recargaba con el sistema en oscuro.
   */
  const alternar = useCallback(() => {
    setTema((anterior) => {
      const siguiente = anterior === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(CLAVE_TEMA, siguiente);
      } catch {
        // Modo privado o almacenamiento bloqueado: el tema cambia igual en
        // esta pestana, solo no se recuerda. No es motivo para romper nada.
      }
      return siguiente;
    });
  }, []);

  return { tema, alternar };
}
