import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const SECCIONES = ["home", "about", "projects", "experience", "skills", "education", "certificates", "contact"];

/**
 * Recorre la página entera para disparar todas las variantes `whileInView`
 * y vuelve arriba. Sin esto, axe auditaría un documento donde la mayoría de
 * `<main>` está a `opacity: 0` y devolvería un verde que no significa nada.
 */
const revelarTodaLaPagina = async (page: Page) => {
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
     heredada, así que una tarjeta a 0.93 se reporta como
     `#4376ec` en vez de `#487fff` y produce una violación fantasma de
     4.47:1. Descubierto así, con dos falsos positivos en Certificados. */
  await page.waitForFunction(
    () => {
      const opacidadHeredada = (el: Element) => {
        let o = 1;
        for (let n: Element | null = el; n; n = n.parentElement) {
          o *= parseFloat(getComputedStyle(n).opacity);
        }
        return o;
      };
      return [...document.querySelectorAll("main a, main button, main [tabindex]")].every(
        (el) => opacidadHeredada(el) === 1,
      );
    },
    undefined,
    { timeout: 15_000 },
  );
};

test.describe("Accesibilidad", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await revelarTodaLaPagina(page);
  });

  /* Guarda contra la trampa: si esto falla, el scan de abajo no vale nada
     aunque salga verde. Va primero a propósito. */
  test("todo <main> está visible cuando se audita", async ({ page }) => {
    const invisibles = await page.evaluate(() => {
      const opacidadCero = (el: Element) => {
        for (let n: Element | null = el; n; n = n.parentElement) {
          if (parseFloat(getComputedStyle(n).opacity) === 0) return true;
        }
        return false;
      };
      const interactivos = [...document.querySelectorAll("main a, main button, main [tabindex]")];
      return {
        total: interactivos.length,
        invisibles: interactivos.filter(opacidadCero).length,
      };
    });

    expect(invisibles.total, "no se encontró ningún elemento interactivo: el selector o el build cambiaron").toBeGreaterThan(20);
    expect(invisibles.invisibles, "hay elementos a opacity:0 — axe no los auditaría").toBe(0);
  });

  test("las 8 secciones están presentes y visibles", async ({ page }) => {
    for (const id of SECCIONES) {
      await expect(page.locator(`#${id}`), `falta la sección #${id}`).toBeVisible();
    }
  });

  test("axe no encuentra violaciones serias ni críticas", async ({ page }) => {
    const resultado = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
      .analyze();

    const graves = resultado.violations.filter((v) => v.impact === "serious" || v.impact === "critical");

    /* Mensaje útil en CI: qué regla, en qué elemento y cómo arreglarlo. */
    const detalle = graves
      .map((v) => `\n· [${v.impact}] ${v.id}: ${v.help}\n  ${v.helpUrl}\n  ${v.nodes.map((n) => n.target.join(" ")).join("\n  ")}`)
      .join("");

    expect(graves, `axe encontró ${graves.length} violación(es) seria(s) o crítica(s):${detalle}`).toHaveLength(0);

    /* El criterio de T2-09: comprobar que se auditó la página entera y no
       solo el Hero. Se compara contra el número de nodos que axe llegó a
       evaluar, no contra una impresión. */
    const nodosEvaluados = [...resultado.passes, ...resultado.violations, ...resultado.incomplete]
      .reduce((total, r) => total + r.nodes.length, 0);
    // Queda en el log de CI: es la evidencia de que se auditó la página entera.
    console.log(`axe evaluó ${nodosEvaluados} nodos en ${resultado.passes.length} reglas superadas`);
    expect(nodosEvaluados, "axe evaluó muy pocos nodos: probablemente midió con la página a medio revelar").toBeGreaterThan(100);
  });
});
