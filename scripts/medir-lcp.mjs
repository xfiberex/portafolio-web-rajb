/**
 * Mide FCP, LCP y CLS del build servido en localhost:4173.
 *
 * Requiere `npm run build && npm run preview` en otra terminal.
 *
 * Por qué existe (T2-06 / T2-23): capturar solo el valor final del LCP
 * esconde lo importante. Este script registra **cada candidato**, que es lo
 * que destapó que el LCP de esta página no era el arranque de React —el
 * navbar ya estaba pintado— sino el final de la animación de entrada del
 * Hero. Y toma la mediana de varias corridas: una sola medición de LCP no
 * dice nada.
 *
 * Uso:
 *   node scripts/medir-lcp.mjs            # sin estrangular
 *   node scripts/medir-lcp.mjs --lento    # 4G lento + CPU x4
 */
import { chromium } from "@playwright/test";

const URL_OBJETIVO = process.env.URL_LCP ?? "http://localhost:4173/";
const LENTO = process.argv.includes("--lento");
const CORRIDAS = 3;

const unaCorrida = async () => {
  const navegador = await chromium.launch();
  const contexto = await navegador.newContext();
  const page = await contexto.newPage();

  if (LENTO) {
    const cdp = await contexto.newCDPSession(page);
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
      latency: 150,
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  }

  await page.addInitScript(() => {
    window.__candidatos = [];
    window.__cls = 0;
    new PerformanceObserver((lista) => {
      for (const e of lista.getEntries()) {
        window.__candidatos.push({ t: Math.round(e.startTime), tag: e.element?.tagName ?? "?" });
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((lista) => {
      for (const e of lista.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });

  await page.goto(URL_OBJETIVO, { waitUntil: "load" });
  await page.waitForTimeout(LENTO ? 4000 : 2500);

  const r = await page.evaluate(() => ({
    candidatos: window.__candidatos,
    fcp: Math.round(performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? -1),
    cls: +window.__cls.toFixed(4),
  }));
  await navegador.close();
  return r;
};

const corridas = [];
for (let i = 0; i < CORRIDAS; i++) corridas.push(await unaCorrida());

const mediana = (valores) => [...valores].sort((a, b) => a - b)[Math.floor(valores.length / 2)];
const lcps = corridas.map((r) => r.candidatos.at(-1)?.t ?? -1);

console.log(`${URL_OBJETIVO}${LENTO ? "  [4G lento + CPU x4]" : ""}`);
console.log(`  FCP  ${mediana(corridas.map((r) => r.fcp))} ms`);
console.log(`  LCP  ${mediana(lcps)} ms   (corridas: ${lcps.join(", ")})`);
console.log(`  CLS  ${mediana(corridas.map((r) => r.cls))}`);
console.log(`  Candidatos de LCP de la primera corrida:`);
for (const c of corridas[0].candidatos) console.log(`    ${String(c.t).padStart(6)} ms  <${c.tag}>`);
