import { expect, test } from "@playwright/test";

/**
 * Bloque 5 de T2-10, y el cierre de T1-02.
 *
 * `react-type-animation` escribe con `setTimeout` y `repeat={Infinity}`:
 * ninguna regla CSS la detiene, así que con movimiento reducido no basta
 * con acelerarla, hay que NO montarla. Eso incumplía WCAG 2.2.2 (Pause,
 * Stop, Hide, nivel A) — una animación de más de 5 s en bucle sin forma de
 * pararla. El 2026-09-08 sólo se pudo verificar parcheando `matchMedia` a
 * mano porque la herramienta de entonces no emulaba la preferencia;
 * Playwright sí la emula de verdad.
 */

const ROL_ESTATICO = "Desarrollador Web Full-Stack";
const ROL = '[data-testid="hero-rol"]';

/** Muestrea el texto durante `ms` y devuelve los valores distintos vistos. */
const textosVistos = async (page: import("@playwright/test").Page, ms: number) => {
  const vistos = new Set<string>();
  const fin = Date.now() + ms;
  while (Date.now() < fin) {
    vistos.add(((await page.locator(ROL).textContent()) ?? "").trim());
    await page.waitForTimeout(120);
  }
  return vistos;
};

test.describe("Con prefers-reduced-motion: reduce", () => {
  // Es el valor por defecto de playwright.config.ts, pero se declara aquí
  // para que la prueba no dependa de una opción global que alguien podría
  // cambiar por otro motivo.
  test.use({ reducedMotion: "reduce" });

  test("el rol del Hero es texto estático y no cambia nunca", async ({ page }) => {
    await page.goto("/");

    const vistos = await textosVistos(page, 3_000);

    expect(
      [...vistos],
      "el texto del rol cambió: la animación de tecleo sigue montada con movimiento reducido",
    ).toEqual([ROL_ESTATICO]);
  });
});

test.describe("Sin preferencia de movimiento", () => {
  test.use({ reducedMotion: "no-preference" });

  /* Esta prueba existe para que la de arriba no sea vacua: si el Hero
     mostrara texto fijo SIEMPRE —por un bug en el hook, por ejemplo— la
     primera pasaría igual y no demostraría nada. */
  test("el rol del Hero sí se anima", async ({ page }) => {
    await page.goto("/");

    const vistos = await textosVistos(page, 3_000);

    expect(
      vistos.size,
      `el texto nunca cambió (${[...vistos].join(" | ")}): la prueba de movimiento reducido no distingue nada`,
    ).toBeGreaterThan(1);
  });
});
