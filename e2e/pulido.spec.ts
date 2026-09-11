import { expect, test, type Page } from "@playwright/test";
import { revelarTodaLaPagina } from "./util/pagina";

/**
 * T3-08 a T3-12 — Pulido de interfaz.
 *
 * Cada prueba congela una medida, no una impresión: las cinco tareas se
 * cerraron midiendo, y lo que las rompería (añadir una feature, alargar un
 * título, cambiar una frase del Hero, meter tecnologías en Competencias)
 * es trabajo rutinario de contenido. Estas pruebas avisan cuando pase.
 */

const irA = async (page: Page, width: number) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto("/");
  await revelarTodaLaPagina(page);
};

test("T3-08: ninguna tarjeta destacada deja más de 120 px bajo los tags", async ({ page }) => {
  await irA(page, 1440);
  const huecos = await page.evaluate(() =>
    [...document.querySelectorAll("#projects article")].slice(0, 3).map((a) => {
      const tags = a.querySelector("ul[aria-label]")!.getBoundingClientRect().bottom;
      const enlaces = a.querySelector(".mt-auto")!.getBoundingClientRect().top;
      return Math.round(enlaces - tags);
    }),
  );
  for (const h of huecos) expect(h, `huecos: ${huecos.join(" / ")} px`).toBeLessThanOrEqual(120);
});

for (const width of [1024, 1440]) {
  test(`T3-09: los subtítulos de las destacadas arrancan a la misma altura a ${width}px`, async ({ page }) => {
    await irA(page, width);
    const tops = await page.evaluate(() =>
      [...document.querySelectorAll("#projects article")].slice(0, 3).map((a) => {
        const sub = a.querySelector("h4")!.nextElementSibling!;
        return Math.round(sub.getBoundingClientRect().top - a.getBoundingClientRect().top);
      }),
    );
    expect(Math.max(...tops) - Math.min(...tops), `tops: ${tops.join(" / ")}`).toBeLessThanOrEqual(1);
  });
}

for (const width of [320, 375, 640, 1440]) {
  test(`T3-10: el hueco del texto animado reserva justo la frase más larga a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    // Las frases se leen del propio bundle no: se escriben aquí a propósito.
    // Si cambian en Hero.tsx sin cambiar aquí, esta lista queda obsoleta y
    // la prueba deja de medir la frase más larga real: mantener en sincronía.
    const ROLES = [
      "Desarrollador Web Full-Stack",
      "Especialista en .NET & MERN/PERN",
      "Creador de interfaces modernas con agentes de IA",
    ];
    const r = await page.evaluate((roles) => {
      const c = document.querySelector('[data-testid="hero-rol"]')!;
      const s = c.querySelector("span")!;
      const reservado = Math.round(c.getBoundingClientRect().height);
      const altos = roles.map((t) => {
        s.textContent = t;
        return Math.round(s.getBoundingClientRect().height);
      });
      return { reservado, maximo: Math.max(...altos) };
    }, ROLES);
    expect(r.maximo, "la frase más larga desborda la reserva: volvería el CLS").toBeLessThanOrEqual(r.reservado);
    expect(r.reservado - r.maximo, "sobra reserva: el hueco del Hero volvió").toBeLessThanOrEqual(1);
  });
}

test("T3-11: Certificados es una sola tarjeta con una fila por curso", async ({ page }) => {
  await irA(page, 1440);
  const r = await page.evaluate(() => {
    const s = document.querySelector("#certificates")!;
    return { tarjetas: s.querySelectorAll("article").length, filas: s.querySelectorAll("ul > li").length };
  });
  expect(r.tarjetas).toBe(0);
  expect(r.filas).toBeGreaterThan(0);
});

test("T3-12: en escritorio las tres columnas cierran en un rectángulo sin estirar de más", async ({ page }) => {
  await irA(page, 1440);
  const r = await page.evaluate(() => {
    const columnas = [...document.querySelectorAll<HTMLElement>("#skills [data-columna]")];
    /* El fondo de la ÚLTIMA TARJETA, no del contenedor de columna: la grilla
       estira los contenedores a la misma altura siempre, así que medirlos
       daba verde aunque se quitara el `lg:flex-1` que cierra el rectángulo.
       Lo destapó la prueba de mutación. */
    const fondos = columnas.map((c) => Math.round(c.lastElementChild!.getBoundingClientRect().bottom));
    // Cuánto se estira la última tarjeta de cada columna: su alto con y sin flex-grow.
    const estirado = columnas.map((c) => {
      const ultima = c.lastElementChild as HTMLElement;
      const con = ultima.getBoundingClientRect().height;
      ultima.style.flexGrow = "0";
      const sin = ultima.getBoundingClientRect().height;
      ultima.style.flexGrow = "";
      return Math.round(con - sin);
    });
    return { n: columnas.length, fondos, estirado };
  });
  expect(r.n).toBe(3);
  expect(Math.max(...r.fondos) - Math.min(...r.fondos), `fondos: ${r.fondos.join(" / ")}`).toBeLessThanOrEqual(1);
  /* 60 px de margen sobre los 17 medidos al cerrar la tarea. Si falla, no es
     un fallo de código: el contenido cambió y el reparto de `columna` en
     src/data/skills.ts ya no es el mejor. Recalcularlo (ver ROADMAP T3-12). */
  for (const e of r.estirado)
    expect(e, `estiramiento por columna: ${r.estirado.join(" / ")} px`).toBeLessThanOrEqual(60);
});

test("T3-12: en móvil las categorías se leen en el orden de los datos", async ({ page }) => {
  await irA(page, 375);
  const orden = await page.evaluate(() =>
    [...document.querySelectorAll("#skills h3")]
      .map((h) => ({ t: h.textContent!.trim(), y: h.getBoundingClientRect().top }))
      .sort((a, b) => a.y - b.y)
      .map((x) => x.t),
  );
  expect(orden.slice(0, 3)).toEqual(["Frontend", "Backend", "Bases de datos & ORMs"]);
});

test("T3-12: Principios no usa pills de tecnología", async ({ page }) => {
  await irA(page, 1440);
  const pills = await page.evaluate(() => {
    const h = [...document.querySelectorAll("#skills h3")].find((x) => x.textContent!.trim() === "Principios")!;
    return h.parentElement!.querySelectorAll("li.border").length;
  });
  expect(pills).toBe(0);
});
