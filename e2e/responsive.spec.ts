import { expect, test } from "@playwright/test";
import { elementosQueDesbordan, revelarTodaLaPagina } from "./util/pagina";

/**
 * Bloque 4 de T2-10: cero scroll horizontal.
 *
 * 320 es el mínimo que exige WCAG 2.2 (1.4.10 Reflow, AA). Los demás son
 * los cortes reales del diseño: 360 (Android típico), 768 (`md`), 1280
 * (`lg`, donde aparece el nav de escritorio) y 1440.
 */
const ANCHOS = [320, 360, 768, 1280, 1440];

for (const width of ANCHOS) {
  test(`sin scroll horizontal a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    // Con la página a medio revelar hay elementos desplazados por las
    // variantes de entrada; medir ahí daría falsos positivos y negativos.
    await revelarTodaLaPagina(page);

    const medidas = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    const culpables = medidas.scrollWidth > medidas.clientWidth ? await elementosQueDesbordan(page) : [];

    expect(
      medidas.scrollWidth,
      `desborde de ${medidas.scrollWidth - medidas.clientWidth}px a ${width}px.` +
        (culpables.length ? ` Candidatos:\n  ${culpables.join("\n  ")}` : ""),
    ).toBeLessThanOrEqual(medidas.clientWidth);
  });
}
