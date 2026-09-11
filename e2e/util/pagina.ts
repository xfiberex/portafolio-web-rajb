import type { Page } from "@playwright/test";

export const SECCIONES = [
  "home",
  "about",
  "projects",
  "experience",
  "skills",
  "education",
  "certificates",
  "contact",
] as const;

/** Las secciones que sí tienen entrada en el nav (`Navbar.tsx: navItems`). */
export const SECCIONES_CON_ENLACE = SECCIONES.filter((id) => id !== "home");

/**
 * Recorre la página entera para disparar todas las variantes `whileInView`
 * y vuelve arriba. Sin esto se auditaría —o se intentaría pulsar— un
 * documento donde la mayoría de `<main>` está a `opacity: 0`.
 */
export const revelarTodaLaPagina = async (page: Page) => {
  await page.evaluate(async () => {
    const pausa = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const alto = document.documentElement.scrollHeight;
    for (let y = 0; y < alto; y += 400) {
      window.scrollTo(0, y);
      await pausa(60);
    }
    window.scrollTo(0, 0);
  });

  /* Esperar a la CONDICIÓN, no a un tiempo fijo, y exigir opacidad **1**,
     no simplemente distinta de 0.
     `reducedMotion` quita la duración de la animación pero no los
     `delayChildren`/`staggerChildren` del contenedor, así que tras el
     recorrido queda algún elemento a medio revelar durante unos
     milisegundos. Y una opacidad intermedia no es inocua para axe: su
     regla de contraste **mezcla el color con el fondo** según la opacidad
     heredada, así que una tarjeta a 0.93 se reporta como `#4376ec` en vez
     de `#487fff` y produce una violación fantasma de 4.47:1. Descubierto
     así, con dos falsos positivos en Certificados. */
  /* Y además, que NADA se esté moviendo, y que siga así varios fotogramas.
     Mirar solo la opacidad en un instante no basta: Framer anima la
     opacidad con la Web Animations API y escribe el valor final en línea
     un momento DESPUÉS de que la animación termine. En ese hueco la
     opacidad ya se leía 1 y la espera se daba por cumplida, pero justo
     después Contacto volvía a leerse 0, y la guarda de a11y.spec.ts
     fallaba de forma intermitente: 1 de cada ~4 bajo carga en local, y
     como «flaky» en CI el 2026-09-10. Se ignoran las animaciones
     infinitas (el cursor del texto animado, cuando se monta), que por
     definición nunca terminan. */
  await page.waitForFunction(
    () => {
      const w = window as unknown as { __fotogramasEstables?: number };
      const opacidadHeredada = (el: Element) => {
        let o = 1;
        for (let n: Element | null = el; n; n = n.parentElement) {
          o *= parseFloat(getComputedStyle(n).opacity);
        }
        return o;
      };
      const todoVisible = [...document.querySelectorAll("main a, main button, main [tabindex]")].every(
        (el) => opacidadHeredada(el) === 1,
      );
      const nadaEnMarcha = document
        .getAnimations()
        .every((a) => a.playState !== "running" || a.effect?.getTiming().iterations === Infinity);
      w.__fotogramasEstables = todoVisible && nadaEnMarcha ? (w.__fotogramasEstables ?? 0) + 1 : 0;
      return w.__fotogramasEstables >= 3;
    },
    undefined,
    { timeout: 15_000, polling: "raf" },
  );
};

/**
 * Devuelve una descripción de los elementos que sobresalen del ancho del
 * viewport. Es solo para el MENSAJE de error: un elemento puede sobresalir
 * sin causar scroll si un ancestro lo recorta con `overflow: hidden`. La
 * aserción real se hace sobre `scrollWidth`.
 */
export const elementosQueDesbordan = (page: Page) =>
  page.evaluate(() => {
    const ancho = document.documentElement.clientWidth;
    return [...document.querySelectorAll<HTMLElement>("body *")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && Math.round(r.right) > ancho + 1;
      })
      .slice(0, 10)
      .map((el) => {
        const clases = el.className?.toString().split(/\s+/).slice(0, 4).join(".");
        return `${el.tagName.toLowerCase()}${clases ? `.${clases}` : ""} → right=${Math.round(el.getBoundingClientRect().right)}`;
      });
  });
