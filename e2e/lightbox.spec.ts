import { expect, test } from "@playwright/test";
import { revelarTodaLaPagina } from "./util/pagina";

/**
 * Bloque 1 de T2-10. Todo esto se verificó a mano sobre producción el
 * 2026-09-08 y hasta hoy no tenía red: es un diálogo modal escrito a mano
 * (no un `<dialog>` nativo), así que cada pieza del contrato —foco inicial,
 * trampa de Tab, retorno del foco, bloqueo del scroll— puede romperse por
 * separado sin que nada más lo note.
 */

const DISPARADOR = 'button[aria-label^="Ampliar imagen de"]';
const CIERRE = 'button[aria-label="Cerrar visor de imagen"]';

test.describe("Lightbox", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await revelarTodaLaPagina(page);
  });

  test("abre con el foco en el cierre, atrapa el Tab y lo devuelve al disparador", async ({ page }) => {
    const disparador = page.locator(DISPARADOR).first();
    await expect(disparador, "ningún proyecto ofrece «Ampliar imagen»: cambió ProjectLinks").toBeVisible();

    /* El overflow del body ANTES de abrir, para comparar con el de después
       de cerrar. No se asume que sea "": Lightbox guarda y restaura el
       valor previo, sea cual sea. */
    const overflowInicial = await page.evaluate(() => document.body.style.overflow);

    await disparador.click();

    const dialogo = page.getByRole("dialog");
    await expect(dialogo).toBeVisible();
    await expect(dialogo).toHaveAttribute("aria-modal", "true");
    /* aria-labelledby apunta al <span class="sr-only"> con el título: sin
       nombre accesible, un lector de pantalla anuncia "diálogo" y nada más. */
    await expect(dialogo).toHaveAttribute("aria-labelledby", /.+/);

    await expect(page.locator(CIERRE), "el foco no se movió al botón de cierre").toBeFocused();

    // El scroll de fondo queda bloqueado mientras el modal está abierto.
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .toBe("hidden");

    /* Trampa de foco: se pulsa Tab más veces que elementos focalizables hay
       dentro del panel, en ambas direcciones. El foco nunca debe salir. */
    for (const modificadores of ["Tab", "Tab", "Tab", "Shift+Tab", "Shift+Tab"]) {
      await page.keyboard.press(modificadores);
      const dentro = await page.evaluate(() =>
        Boolean(document.activeElement?.closest('[role="dialog"]')),
      );
      expect(dentro, `el foco se escapó del diálogo tras ${modificadores}`).toBe(true);
    }

    await page.keyboard.press("Escape");

    await expect(dialogo).toBeHidden();
    await expect(disparador, "el foco no volvió al botón que abrió el visor").toBeFocused();
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .toBe(overflowInicial);
  });

  test("el clic en el scrim cierra el visor", async ({ page }) => {
    const disparador = page.locator(DISPARADOR).first();
    await disparador.click();

    const dialogo = page.getByRole("dialog");
    await expect(dialogo).toBeVisible();

    /* Esquina superior izquierda del scrim: fuera del panel, que está
       centrado. Un clic en el centro daría sobre la imagen, donde el
       stopPropagation del panel impide el cierre —y eso es lo correcto. */
    await dialogo.click({ position: { x: 5, y: 5 } });

    await expect(dialogo).toBeHidden();
    await expect(disparador).toBeFocused();
  });
});
