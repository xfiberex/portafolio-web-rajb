import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { revelarTodaLaPagina, SECCIONES } from "./util/pagina";

/*
  Los dos temas se auditan por separado porque **los valores de uno no dicen
  nada del otro**: cada paleta tiene sus propios ratios de contraste (T3-07).

  El tema no se fuerza escribiendo `data-theme` a mano, se induce con
  `prefers-color-scheme`. Asi la prueba recorre el mismo camino que un
  visitante que llega por primera vez, script inline del <head> incluido, en
  vez de saltarselo.
*/
const TEMAS = [
  { nombre: "oscuro", colorScheme: "dark" as const, atributo: "dark" },
  { nombre: "claro", colorScheme: "light" as const, atributo: "light" },
];

for (const tema of TEMAS) {
  test.describe(`Accesibilidad (tema ${tema.nombre})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ colorScheme: tema.colorScheme });
      await page.goto("/");
      await revelarTodaLaPagina(page);
    });

    test("el tema bajo prueba es realmente el que esta aplicado", async ({ page }) => {
      // Sin esto, un fallo del script inline haria que las dos vueltas
      // auditaran el tema oscuro y la segunda saldria verde sin medir nada.
      await expect(page.locator("html")).toHaveAttribute("data-theme", tema.atributo);
    });

    /* Guarda contra la trampa: si esto falla, el scan de abajo no vale nada
     aunque salga verde. Va primero a propósito. */
    test("todo <main> está visible cuando se audita", async ({ page }) => {
      const invisibles = await page.evaluate(() => {
        /* Devuelve QUÉ elemento y QUÉ ancestro lo tapa, no solo cuántos: un
           fallo de CI con «Received: 2» no se puede diagnosticar desde el log. */
        const tapadoPor = (el: Element) => {
          for (let n: Element | null = el; n; n = n.parentElement) {
            if (parseFloat(getComputedStyle(n).opacity) === 0) {
              const clases = String(n.className).split(/\s+/).slice(0, 3).join(".");
              return `${el.tagName.toLowerCase()} «${(el.textContent ?? "").trim().slice(0, 30)}» ← ${n.tagName.toLowerCase()}.${clases}`;
            }
          }
          return null;
        };
        const interactivos = [...document.querySelectorAll("main a, main button, main [tabindex]")];
        const detalle = interactivos.map(tapadoPor).filter((d): d is string => d !== null);
        return { total: interactivos.length, invisibles: detalle.length, detalle };
      });

      expect(
        invisibles.total,
        "no se encontró ningún elemento interactivo: el selector o el build cambiaron",
      ).toBeGreaterThan(20);
      expect(
        invisibles.invisibles,
        `hay elementos a opacity:0 — axe no los auditaría:\n  ${invisibles.detalle.join("\n  ")}`,
      ).toBe(0);
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
        .map(
          (v) =>
            `\n· [${v.impact}] ${v.id}: ${v.help}\n  ${v.helpUrl}\n  ${v.nodes.map((n) => n.target.join(" ")).join("\n  ")}`,
        )
        .join("");

      expect(graves, `axe encontró ${graves.length} violación(es) seria(s) o crítica(s):${detalle}`).toHaveLength(0);

      /* El criterio de T2-09: comprobar que se auditó la página entera y no
       solo el Hero. Se compara contra el número de nodos que axe llegó a
       evaluar, no contra una impresión. */
      const nodosEvaluados = [...resultado.passes, ...resultado.violations, ...resultado.incomplete].reduce(
        (total, r) => total + r.nodes.length,
        0,
      );
      // Queda en el log de CI: es la evidencia de que se auditó la página entera.
      console.log(`axe evaluó ${nodosEvaluados} nodos en ${resultado.passes.length} reglas superadas`);
      expect(
        nodosEvaluados,
        "axe evaluó muy pocos nodos: probablemente midió con la página a medio revelar",
      ).toBeGreaterThan(100);
    });
  });
}
