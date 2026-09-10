/**
 * Imprime en una línea las métricas de la última corrida de Lighthouse CI.
 *
 * Por qué existe: `lhci autorun` en verde no dice ni un número, así que la
 * única forma de conocer el margen real contra los umbrales sería esperar a
 * que rompa. Con esto la tendencia queda en el log de cada build — igual que
 * el recuento de nodos de axe, que es lo que permitió confirmar que la
 * auditoría de accesibilidad corría de verdad en el runner.
 *
 * No falla nunca: los umbrales los impone `lhci assert`, no este script.
 *
 * Ojo con el recuento: `lhci` deja CADA informe dos veces —el crudo en
 * `.lighthouseci/lhr-*.json` y una copia volcada en el `outputDir`—, así
 * que hay que deduplicar o se anuncian 6 corridas donde hubo 3. La mediana
 * no se altera (los duplicados van en pares), pero el número mentía.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const RAIZ = ".lighthouseci";

const jsonsRecursivos = (dir) => {
  let salida = [];
  for (const entrada of readdirSync(dir)) {
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) salida = salida.concat(jsonsRecursivos(ruta));
    else if (entrada.endsWith(".json")) salida.push(ruta);
  }
  return salida;
};

let informes = [];
try {
  informes = jsonsRecursivos(RAIZ)
    .map((f) => {
      try {
        const r = JSON.parse(readFileSync(f, "utf8"));
        return r?.categories && r?.audits ? r : null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
} catch {
  console.log(`(sin informes en ${RAIZ}/)`);
  process.exit(0);
}

if (informes.length === 0) {
  console.log(`(sin informes en ${RAIZ}/)`);
  process.exit(0);
}

// Deduplicar por `fetchTime`: identifica la corrida, no el archivo.
const porCorrida = new Map();
for (const r of informes) porCorrida.set(r.fetchTime, r);
informes = [...porCorrida.values()];

const mediana = (valores) => [...valores].sort((a, b) => a - b)[Math.floor(valores.length / 2)];
const porCategoria = (id) => mediana(informes.map((r) => Math.round(r.categories[id].score * 100)));
const porAuditoria = (id) => mediana(informes.map((r) => r.audits[id].numericValue));

const kB = (bytes) => Math.round(bytes / 1024);
const js = mediana(
  informes.map((r) => r.audits["resource-summary"].details.items.find((i) => i.resourceType === "script")?.transferSize ?? 0),
);

console.log(
  `Lighthouse (mediana de ${informes.length}): ` +
    `rendimiento ${porCategoria("performance")} · accesibilidad ${porCategoria("accessibility")} · ` +
    `buenas practicas ${porCategoria("best-practices")} · SEO ${porCategoria("seo")}`,
);
console.log(
  `  LCP ${Math.round(porAuditoria("largest-contentful-paint"))} ms (umbral 2500) · ` +
    `TBT ${Math.round(porAuditoria("total-blocking-time"))} ms (300) · ` +
    `CLS ${porAuditoria("cumulative-layout-shift").toFixed(3)} (0.1) · ` +
    `JS ${kB(js)} kB (160)`,
);
console.log(`  elemento LCP: ${informes[0].audits["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.snippet ?? "?"}`);
