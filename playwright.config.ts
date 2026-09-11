import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright corre contra el BUILD, no contra el servidor de desarrollo:
 * lo que hay que auditar es lo que se publica.
 *
 * `reducedMotion: "reduce"` es deliberado y no un atajo. Con las variantes
 * `whileInView` en su estado inicial los elementos están a `opacity: 0`, y
 * ninguna herramienta automática audita lo invisible — así se calculó el 96
 * de accesibilidad del 2026-09-08, sobre poco más que el Hero. Con la
 * preferencia activa, <MotionConfig reducedMotion="user"> aplica el estado
 * final de golpe. Aun así hay que recorrer la página: la preferencia quita
 * la animación, pero el disparador sigue siendo entrar en el viewport.
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",

  use: {
    baseURL: "http://localhost:4173",
    reducedMotion: "reduce",
    /* Fijado a proposito. El tema sigue a `prefers-color-scheme` (T3-06) y
       el valor por defecto de Playwright es "light", asi que sin esta linea
       toda la suite auditaria el tema claro por accidente. Las pruebas que
       necesitan el otro tema lo piden con `emulateMedia`. */
    colorScheme: "dark",
    trace: "on-first-retry",
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  webServer: {
    command: "npm run preview",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
