import { expect, test } from "@playwright/test";

/**
 * Bloques 2 y 3 de T2-10: menú móvil, skip link y `aria-current`.
 */

const TOGGLE = /menú de navegación/i;
const MENU = "#menu-principal";

test.describe("Menú móvil", () => {
  // Por debajo de `lg` (1024px) el nav de escritorio está oculto.
  test.use({ viewport: { width: 390, height: 844 } });

  test("alterna aria-expanded y no cambia el alto del header", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: TOGGLE });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(MENU)).toBeHidden();

    /* El motivo de que el panel sea `absolute`: si estuviera en el flujo,
       abrir el menú empujaría todas las secciones hacia abajo y los anchors
       nativos aterrizarían desplazados. Ese fue el bug que obligaba a un
       setTimeout de 100ms + scrollTo manual. */
    const altoCerrado = (await page.locator("header").boundingBox())?.height;

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(MENU)).toBeVisible();

    const altoAbierto = (await page.locator("header").boundingBox())?.height;
    expect(altoAbierto, "el menú abierto cambió el alto del header").toBe(altoCerrado);
  });

  test("Escape cierra y devuelve el foco al botón", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: TOGGLE });
    await toggle.click();
    await expect(page.locator(MENU)).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.locator(MENU)).toBeHidden();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle, "Escape cerró el menú pero perdió el foco").toBeFocused();
  });

  test("pulsar un enlace cierra el menú", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: TOGGLE });
    await toggle.click();
    await page.locator(`${MENU} a[href="#projects"]`).click();

    await expect(page.locator(MENU)).toBeHidden();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("Skip link", () => {
  test("es el primer elemento del orden de foco y salta a <main>", async ({ page }) => {
    await page.goto("/");

    /* Un Tab desde el documento recién cargado. Si algún elemento se cuela
       delante, quien navega con teclado ya no puede saltar los 8 enlaces
       del nav sin tabular por todos ellos. */
    await page.keyboard.press("Tab");

    const skip = page.getByRole("link", { name: "Saltar al contenido" });
    await expect(skip).toBeFocused();
    // `sr-only` hasta recibir foco: si sigue oculto, nadie lo ve al tabular.
    await expect(skip, "el skip link no se hace visible al recibir foco").toBeVisible();

    await page.keyboard.press("Enter");

    /* `<main tabIndex={-1}>` existe precisamente para esto: sin el
       tabindex, varios navegadores hacen scroll pero dejan el foco atrás. */
    await expect(page.locator("#main")).toBeFocused();
  });
});

test.describe("aria-current sigue a la sección activa", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  for (const id of ["about", "projects", "skills", "education"]) {
    test(`marca #${id} al navegar hasta esa sección`, async ({ page }) => {
      await page.goto("/");

      await page.locator(`header a[href="#${id}"]`).first().click();

      const enlace = page.locator(`header ul a[href="#${id}"]`);
      await expect(enlace).toHaveAttribute("aria-current", "true", { timeout: 10_000 });

      /* Exactamente uno. El scrollspy cachea la geometría y la relee con un
         ResizeObserver; una regresión típica es que dos secciones queden
         marcadas a la vez, y el indicador `layoutId` entonces parpadea. */
      await expect(page.locator('header a[aria-current="true"]')).toHaveCount(1);
    });
  }

  test("el wordmark nunca recibe aria-current — hueco conocido (T3-18)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#home")).toBeInViewport();

    /* Esto NO es el comportamiento deseado: `navItems` no incluye `home`,
       así que arriba del todo el scrollspy marca "home" y ningún enlace lo
       refleja. Se congela tal cual para que, cuando T3-18 lo arregle, esta
       prueba falle y obligue a actualizarla en vez de quedar el arreglo sin
       cobertura. */
    await expect(
      page.locator('header a[aria-current="true"]'),
      "alguien añadió `home` al nav: T3-18 está resuelto, actualizar esta prueba",
    ).toHaveCount(0);
  });
});

test.describe("Descargar CV (disclosure del Hero)", () => {
  /* Es un <details> nativo, así que el navegador ya aporta el rol y el
     estado expandido. Lo que NO aporta —y se añadió a mano— es cerrar con
     Escape y al pulsar fuera; eso es lo que estas pruebas vigilan.

     Ojo con cómo se comprueba el estado: <summary> **no** lleva un
     atributo `aria-expanded` en el DOM. El navegador lo publica solo en el
     árbol de accesibilidad, como `DisclosureTriangle` con `expanded`
     (verificado por CDP), así que un lector de pantalla sí lo anuncia pero
     `toHaveAttribute("aria-expanded", …)` falla siempre. Se comprueba la
     propiedad `open` del <details>, que es la fuente de verdad. */
  const RESUMEN = 'summary:has-text("Descargar CV")';
  const DETALLES = 'details:has(summary:has-text("Descargar CV"))';

  test("abre, ofrece los dos formatos y no empuja el contenido de abajo", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(DETALLES)).toHaveJSProperty("open", false);
    await expect(page.getByRole("link", { name: "CV en PDF" })).toBeHidden();

    /* El panel es `absolute` justamente para no desplazar nada: si alguien
       lo devuelve al flujo, crecería la fila de acciones y empujaría todo
       lo de debajo. Se ancla en la SECCIÓN siguiente y no en un hermano de
       fila: desde que las acciones comparten una sola línea, un hermano ya
       no prueba gran cosa. */
    const antes = await page.locator("#about").boundingBox();

    await page.locator(RESUMEN).click();

    await expect(page.locator(DETALLES)).toHaveJSProperty("open", true);
    await expect(page.getByRole("link", { name: "CV en PDF" })).toBeVisible();
    await expect(page.getByRole("link", { name: "CV en texto plano (ATS)" })).toBeVisible();

    const despues = await page.locator("#about").boundingBox();
    expect(despues?.y, "abrir el panel movió el contenido de abajo").toBe(antes?.y);
  });

  test("Escape cierra y devuelve el foco al disparador", async ({ page }) => {
    await page.goto("/");

    await page.locator(RESUMEN).click();
    await expect(page.locator(DETALLES)).toHaveJSProperty("open", true);

    await page.keyboard.press("Escape");

    await expect(page.locator(DETALLES)).toHaveJSProperty("open", false);
    await expect(page.locator(RESUMEN), "Escape cerró el panel pero perdió el foco").toBeFocused();
  });

  test("pulsar fuera cierra el panel", async ({ page }) => {
    await page.goto("/");

    await page.locator(RESUMEN).click();
    await expect(page.locator(DETALLES)).toHaveJSProperty("open", true);

    await page.locator("h1").click();

    await expect(page.locator(DETALLES)).toHaveJSProperty("open", false);
    await expect(page.getByRole("link", { name: "CV en PDF" })).toBeHidden();
  });
});
