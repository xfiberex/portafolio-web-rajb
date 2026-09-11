/**
 * Prerender (T4-04): escribe el HTML de la app dentro del `#root` de
 * `dist/index.html`, para que el navegador pinte el contenido sin esperar a
 * descargar y ejecutar el bundle. React luego lo hidrata (`main.tsx`).
 *
 * Lo lanza `npm run build`, después de `vite build` (cliente) y de
 * `vite build --ssr src/entry-server.tsx --outDir dist-ssr` (servidor).
 *
 * Falla el build —en vez de publicar algo roto— si:
 *   - `#root` no está vacío o no existe (se prerenderizaría dos veces, o nada);
 *   - el HTML generado es sospechosamente corto (un render que no pintó nada);
 *   - el correo literal aparece en el HTML: el prerender lo escribiría en un
 *     archivo que leen justo los rastreadores de los que protege la
 *     ofuscación (T3-13). `contact.test.ts` solo mira el código fuente.
 */
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const RAIZ = process.cwd();
const HTML = resolve(RAIZ, "dist/index.html");
const SSR = resolve(RAIZ, "dist-ssr");
const MARCADOR = '<div id="root"></div>';

const fallar = (motivo) => {
  console.error(`\n✗ prerender: ${motivo}\n`);
  process.exit(1);
};

const { render, correoLiteral } = await import(pathToFileURL(resolve(SSR, "entry-server.js")).href);

const plantilla = readFileSync(HTML, "utf8");
const apariciones = plantilla.split(MARCADOR).length - 1;
if (apariciones !== 1) fallar(`se esperaba exactamente un ${MARCADOR} vacío y hay ${apariciones}.`);

const app = render();
if (app.length < 5000) fallar(`el HTML generado mide ${app.length} caracteres; el render no pintó la página.`);

const resultado = plantilla.replace(MARCADOR, `<div id="root">${app}</div>`);

if (!correoLiteral?.includes("@")) fallar("entry-server no exporta el correo; no se puede comprobar que no se filtra.");
if (resultado.includes(correoLiteral)) fallar("el correo literal aparece en dist/index.html (ver T3-13).");

writeFileSync(HTML, resultado);
rmSync(SSR, { recursive: true, force: true });

console.log(`✓ prerender: ${(app.length / 1024).toFixed(1)} kB de HTML en #root (dist/index.html)`);
