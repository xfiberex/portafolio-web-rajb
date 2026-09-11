import { expect, test } from "@playwright/test";

/**
 * T3-06 — Conmutador de tema.
 *
 * `playwright.config.ts` fija `colorScheme: "dark"` para toda la suite, asi
 * que aqui se pide explicitamente el esquema que cada prueba necesita.
 */

const BOTON_A_CLARO = 'button[aria-label="Cambiar al tema claro"]';
const BOTON_A_OSCURO = 'button[aria-label="Cambiar al tema oscuro"]';
const raiz = "html";
const barra = 'meta[name="theme-color"]';

test.describe("Tema", () => {
  test("sin preferencia guardada sigue a prefers-color-scheme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(page.locator(raiz)).toHaveAttribute("data-theme", "light");

    await page.emulateMedia({ colorScheme: "dark" });
    await page.reload();
    await expect(page.locator(raiz)).toHaveAttribute("data-theme", "dark");
  });

  test("el boton alterna y la eleccion sobrevive a una recarga", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(raiz)).toHaveAttribute("data-theme", "dark");

    await page.locator(BOTON_A_CLARO).click();
    await expect(page.locator(raiz)).toHaveAttribute("data-theme", "light");

    // El sistema sigue diciendo "dark": si tras recargar sale claro, es que
    // la eleccion explicita gana a la preferencia del sistema, que es lo que
    // se espera de un conmutador.
    await page.reload();
    await expect(page.locator(raiz)).toHaveAttribute("data-theme", "light");
    await expect(page.locator(BOTON_A_OSCURO)).toBeVisible();
  });

  test("el tema se aplica aunque el bundle no llegue a ejecutarse", async ({ page }) => {
    /* Esta es la prueba que de verdad descarta el destello. Si el tema
       dependiera de React, con el JS bloqueado el atributo no aparecería.
       Que aparezca demuestra que lo pone el script inline del <head>,
       antes del primer pintado. */
    await page.route("**/assets/*.js", (ruta) => ruta.abort());
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator(raiz)).toHaveAttribute("data-theme", "light");
  });

  test("el color de la barra del navegador sigue al tema", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(barra)).toHaveAttribute("content", "#080c11");

    await page.locator(BOTON_A_CLARO).click();
    await expect(page.locator(barra)).toHaveAttribute("content", "#f0f2f5");
  });

  test("el fondo pintado cambia de verdad, no solo el atributo", async ({ page }) => {
    await page.goto("/");
    const luminanciaDelFondo = () =>
      page.evaluate(() => {
        /* Se lee sobre un canvas y no del texto de `getComputedStyle`: al
           cambiar de tema hay una transicion de color de 150ms (0.01ms con
           `prefers-reduced-motion`), y durante ella Chromium devuelve el
           color interpolado y ademas en `oklab(...)` en vez de `oklch(...)`.
           Leer una sola vez daba el color ANTERIOR con otro nombre, que es
           justo el falso negativo que hace desconfiar de una suite. */
        const css = getComputedStyle(document.body).backgroundColor;
        const lienzo = document.createElement("canvas");
        lienzo.width = lienzo.height = 1;
        const ctx = lienzo.getContext("2d")!;
        ctx.fillStyle = css;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      });

    const oscuro = await luminanciaDelFondo();
    expect(oscuro, "el fondo del tema oscuro deberia ser muy oscuro").toBeLessThan(0.1);

    await page.locator(BOTON_A_CLARO).click();
    await expect.poll(luminanciaDelFondo, { timeout: 5_000 }).toBeGreaterThan(0.8);
  });
});
