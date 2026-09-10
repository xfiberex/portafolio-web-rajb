import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { buildEmail, EMAIL_PARTS, CV_URL, CV_ATS_URL } from "./contact";

describe("buildEmail", () => {
  it("ensambla las tres partes", () => {
    expect(buildEmail(["ana", "example", "org"])).toBe("ana@example.org");
  });

  it("no toca las partes: no recorta ni pasa a minúsculas", () => {
    expect(buildEmail([" A ", "Example", "ORG"])).toBe(" A @Example.ORG");
  });
});

describe("las URLs del CV apuntan a los dos PDF", () => {
  it.each([CV_URL, CV_ATS_URL])("%s termina en .pdf", (url) => {
    expect(url).toMatch(/\.pdf$/);
  });
});

/**
 * El correo se parte en tres para que el literal `usuario@dominio.tld` no
 * exista en nada de lo que se sirve: solo lo ensambla el JS en tiempo de
 * ejecución. Es la única protección real que quedaba del antiguo componente
 * `ObfuscatedEmail`, cuyo estado de "revelado" nunca llegaba a ejecutarse
 * (T3-13). Al borrarlo había que fijar esta propiedad, o se pierde en el
 * próximo refactor sin que nadie se entere.
 *
 * Se comprueba sobre el CÓDIGO FUENTE y no sobre `dist/`, porque los tests
 * unitarios corren antes del build en CI. Es donde se introduciría la
 * regresión de todos modos.
 */
describe("el correo literal no está escrito en ningún sitio", () => {
  const literal = buildEmail(EMAIL_PARTS);

  const archivos = (dir: string): string[] =>
    readdirSync(dir).flatMap((entrada) => {
      const ruta = join(dir, entrada);
      return statSync(ruta).isDirectory() ? archivos(ruta) : [ruta];
    });

  it("ni en src/ ni en index.html", () => {
    const candidatos = [...archivos("src").filter((f) => /\.(ts|tsx|css)$/.test(f)), "index.html"];
    const culpables = candidatos.filter((f) => readFileSync(f, "utf8").includes(literal));

    expect(candidatos.length, "no se encontró ningún archivo: cambió la estructura").toBeGreaterThan(10);
    expect(
      culpables,
      `el correo aparece literal; debe ensamblarse con buildEmail(EMAIL_PARTS) en tiempo de ejecución`,
    ).toEqual([]);
  });
});
