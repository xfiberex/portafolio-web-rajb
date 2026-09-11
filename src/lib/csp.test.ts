import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

/**
 * El script de tema vive inline en el <head> porque tiene que correr antes
 * del primer pintado (T3-06), y el CSP no permite `unsafe-inline`. Se
 * autoriza por hash, y un hash desincronizado NO se nota en desarrollo:
 * Vite no aplica el CSP. Se veria por primera vez en produccion, con la
 * pagina en blanco. Estas pruebas cierran ese hueco.
 */
const html = readFileSync("index.html", "utf8");
const csp = readFileSync("netlify.toml", "utf8");

// Solo los scripts que el navegador EJECUTA. Se excluyen los que tienen
// `src` (los cubre 'self') y el bloque de datos estructurados
// `application/ld+json`, que es datos y no pasa por script-src.
const EJECUTABLE = /<script(?![^>]*\ssrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g;
const inline = [...html.matchAll(EJECUTABLE)].map((m) => m[1]);

const hash = (codigo: string) => `sha256-${createHash("sha256").update(codigo, "utf8").digest("base64")}`;

describe("CSP y el script inline del tema", () => {
  it("index.html no tiene CRLF", () => {
    // El hash se calcula sobre los bytes. Con CRLF en Windows y LF en el
    // checkout de CI serian dos hashes distintos para el mismo archivo.
    // Lo garantiza .gitattributes; esto lo verifica.
    expect(html).not.toContain("\r\n");
  });

  it("todo script inline esta autorizado por su hash en netlify.toml", () => {
    expect(inline.length).toBeGreaterThan(0);
    for (const codigo of inline) expect(csp).toContain(hash(codigo));
  });

  it("el CSP no recurre a unsafe-inline para scripts", () => {
    const directiva = csp.match(/script-src[^;]*/)?.[0] ?? "";
    expect(directiva).not.toContain("unsafe-inline");
    expect(directiva).toContain("'self'");
  });
});
