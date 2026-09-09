import { describe, expect, it } from "vitest";
import { placeholderImage, safeExternalUrl, toAssetUrl } from "./assets";

describe("safeExternalUrl", () => {
  it("deja pasar http y https", () => {
    expect(safeExternalUrl("https://github.com/xfiberex")).toBe("https://github.com/xfiberex");
    expect(safeExternalUrl("http://example.com")).toBe("http://example.com");
  });

  /* El motivo de existir de la función: que un dato de src/data/ no pueda
     convertirse en ejecución de script al pintarlo como href. */
  it.each([
    ["javascript:alert(1)", "javascript:"],
    ["JavaScript:alert(1)", "javascript: con mayúsculas"],
    ["  javascript:alert(1)", "javascript: con espacios delante"],
    ["data:text/html;base64,PHNjcmlwdD4=", "data:"],
    ["vbscript:msgbox(1)", "vbscript:"],
    ["file:///etc/passwd", "file://"],
  ])("bloquea %s (%s)", (url) => {
    expect(safeExternalUrl(url)).toBeUndefined();
  });

  it("devuelve undefined con entradas vacías o inválidas", () => {
    expect(safeExternalUrl(undefined)).toBeUndefined();
    expect(safeExternalUrl("")).toBeUndefined();
    expect(safeExternalUrl("   ")).toBeUndefined();
    expect(safeExternalUrl("no-es-una-url")).toBeUndefined();
  });

  /* `//evil.com` hereda el esquema de la página. Es una URL externa real,
     no un intento de inyección, pero conviene fijar el comportamiento por
     escrito para que un cambio futuro sea deliberado y no accidental. */
  it("fija el comportamiento ante un protocolo relativo", () => {
    expect(safeExternalUrl("//example.com")).toBeUndefined();
  });
});

describe("toAssetUrl", () => {
  it("resuelve rutas relativas contra BASE_URL", () => {
    expect(toAssetUrl("projects/x.webp")).toBe(`${import.meta.env.BASE_URL}projects/x.webp`);
  });

  it("no duplica la barra inicial", () => {
    expect(toAssetUrl("/projects/x.webp")).toBe(`${import.meta.env.BASE_URL}projects/x.webp`);
  });

  /* Trampa: la comprobación de "absoluta" es `^(https?:)?//`, así que
     CUALQUIER ruta que empiece por dos barras se devuelve intacta y el
     navegador la resuelve como protocolo relativo — `//projects/x.webp`
     apunta al host `projects`, no a una carpeta local. No hay ningún dato
     así hoy; queda fijado por escrito para que nadie lo escriba en
     `src/data/` creyendo que es una ruta del sitio. */
  it("trata como absoluta cualquier ruta que empiece por //", () => {
    expect(toAssetUrl("//projects/x.webp")).toBe("//projects/x.webp");
    expect(toAssetUrl("///projects/x.webp")).toBe("///projects/x.webp");
  });

  it("deja pasar las absolutas sin tocarlas", () => {
    expect(toAssetUrl("https://cdn.example.com/x.png")).toBe("https://cdn.example.com/x.png");
    expect(toAssetUrl("//cdn.example.com/x.png")).toBe("//cdn.example.com/x.png");
  });

  it("cae al placeholder si no hay ruta", () => {
    expect(toAssetUrl(undefined)).toBe(placeholderImage);
    expect(toAssetUrl("")).toBe(placeholderImage);
  });
});
