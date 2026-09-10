import { expect, test } from "@playwright/test";

/**
 * T2-11 — Snapshots visuales.
 *
 * Los tres anchos son los cortes reales del diseño: 375 (móvil), 768 (`md`)
 * y 1440. El nav de escritorio aparece en `lg`, así que 375 y 768 capturan
 * la versión con menú hamburguesa y 1440 la de barra completa.
 *
 * **Se captura el primer viewport, no la página entera.** Es deliberado y
 * fue la decisión más difícil de esta tarea: con `fullPage` el snapshot
 * cubre más, pero las secciones salen de `src/data/`, así que añadir un
 * proyecto o un certificado —trabajo rutinario en un portafolio— pondría en
 * rojo los tres. Una suite que falla por lo que se espera que pase se acaba
 * ignorando, y entonces no protege de nada. Arriba del pliegue está el
 * diseño (tipografía, tokens, la fila de acciones, el navbar) y casi nunca
 * el contenido.
 *
 * Lo que esto NO cubre: regresiones visuales por debajo del pliegue. Las
 * vigila axe para accesibilidad y los e2e de comportamiento para el resto.
 *
 * Sobre el requisito de la tarea —«enmascarar la línea de texto animado»—:
 * **ya no hace falta**. `react-type-animation` escribe con `setTimeout` y
 * ninguna regla CSS la detiene, pero desde T1-02 el Hero **no la monta**
 * cuando hay `prefers-reduced-motion`, que es como corre toda esta suite
 * (ver `playwright.config.ts`). El texto es estático y determinista, así que
 * enmascararlo solo escondería regresiones reales. Si algún día se revierte
 * T1-02, estos snapshots empezarán a parpadear y esa será la señal.
 */

const ANCHOS = [375, 768, 1440];

for (const width of ANCHOS) {
  test(`@visual el pliegue no ha cambiado a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    // Las fuentes propias cambian métricas al cargar; comparar antes de que
    // estén listas es la fuente clásica de diferencias de un pixel.
    await page.evaluate(() => document.fonts.ready);

    /* El Hero entra con `staggerContainer`, que `prefers-reduced-motion` no
       apaga del todo: quita la duración pero no los retardos. Se espera a la
       CONDICIÓN —opacidad heredada 1 en todo lo del pliegue— y no a un
       tiempo fijo. */
    await page.waitForFunction(() => {
      const opacidadHeredada = (el: Element) => {
        let o = 1;
        for (let n: Element | null = el; n; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity);
        return o;
      };
      return [...document.querySelectorAll("#home a, #home button, header a, header button")].every(
        (el) => opacidadHeredada(el) === 1,
      );
    }, undefined, { timeout: 15_000 });

    await expect(page).toHaveScreenshot(`pliegue-${width}.png`, {
      // Congela animaciones CSS y las lleva a su estado final antes de tirar.
      animations: "disabled",
      /* SIN `maxDiffPixelRatio`. Se probó con 0.002 —que suena a margen
         mínimo— y resultó ser un colador: cambiar «Contactar» por
         «Contáctame» pasó sin rechistar, porque un ratio sobre una imagen
         grande tolera miles de píxeles. La comparación exacta funciona
         porque la página es determinista con `prefers-reduced-motion`:
         verificado con tres corridas idénticas en Windows y en Linux. */
    });
  });
}
