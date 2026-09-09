import { describe, expect, it } from "vitest";
import { pickColor, pickIcon } from "./TechIcon";
import { projects } from "../data/projects";
import { skills } from "../data/skills";

/**
 * Test de tabla sobre la resolución de iconos.
 * ─────────────────────────────────────────────────────────────
 * `pickIcon` y `pickColor` son ~90 heurísticas regex evaluadas en orden,
 * donde la primera que casa gana. Es el punto más frágil del proyecto: al
 * añadir una tecnología a `src/data/` no hay nada que avise de que se
 * quedó sin icono, y el fallo es silencioso — sale el glifo genérico.
 *
 * Este test recorre TODOS los tags reales y exige que cada uno resuelva,
 * salvo los que estén en una de las dos listas de abajo.
 */

/** Todos los tags que se pintan en la interfaz, sin duplicados. */
const todosLosTags = (): string[] => {
  const tags = new Set<string>();
  projects.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
  skills.forEach((s) => s.items.forEach((t) => tags.add(t)));
  return [...tags].sort();
};

/**
 * Competencias y prácticas que **no son productos**: no existe un logotipo
 * que ponerles, así que el glifo genérico es la respuesta correcta y no un
 * fallo. Decisión deliberada, ver T2-22.
 */
const SIN_LOGOTIPO_POR_DISENO = [
  "Control de acceso por rol",
  "Detección de reúso de token",
  "OAuth 2.0 con PKCE",
  "Pruebas de carga",
  "Rate limiting",
  "Registro de decisiones técnicas (ADRs)",
];

/**
 * Productos que **sí** deberían tener icono y todavía no lo tienen.
 * Es una deuda conocida, no una decisión: la cierra T2-22 añadiendo los SVG.
 * La lista se comprueba exacta más abajo para que no crezca en silencio ni
 * se quede obsoleta cuando alguien añada uno.
 */
const PENDIENTES_DE_ICONO = ["Jest", "Playwright (E2E)", "Supertest", "TanStack Query"];

const EXCEPCIONES = new Set([...SIN_LOGOTIPO_POR_DISENO, ...PENDIENTES_DE_ICONO]);

describe("pickIcon sobre los tags reales", () => {
  it.each(todosLosTags().filter((t) => !EXCEPCIONES.has(t)))("resuelve %s", (tag) => {
    expect(pickIcon(tag), `"${tag}" cae al glifo genérico: añade su icono en TechIcon.tsx o justifícalo en una de las dos listas de este test`).not.toBeNull();
  });

  /* Guarda contra la podredumbre: si alguien añade el icono de Jest pero se
     olvida de sacarlo de la lista, este test lo dice. Y si aparece un tag
     nuevo sin icono, el `it.each` de arriba lo caza. */
  it("la lista de pendientes coincide exactamente con lo que falta", () => {
    const realmenteSinIcono = todosLosTags().filter((t) => pickIcon(t) === null);
    expect(realmenteSinIcono.sort()).toEqual([...SIN_LOGOTIPO_POR_DISENO, ...PENDIENTES_DE_ICONO].sort());
  });

  /* La regla era /windows.*forms/ y el dato dice "WinForms", que no contiene
     "windows": nunca casaba pese a existir la entrada. Corregido; que no
     vuelva a pasar. */
  it("resuelve WinForms, que antes nunca casaba", () => {
    expect(pickIcon("WinForms")).not.toBeNull();
    expect(pickColor("WinForms")).toBe(pickColor("Windows Forms"));
  });
});

describe("pickColor", () => {
  it("devuelve un color válido para todos los tags, incluso sin icono", () => {
    todosLosTags().forEach((tag) => {
      expect(pickColor(tag), `"${tag}"`).toMatch(/^#[0-9a-f]{3,8}$/i);
    });
  });

  it("no distingue mayúsculas en la coincidencia exacta", () => {
    expect(pickColor("react")).toBe(pickColor("React"));
    expect(pickColor("TYPESCRIPT")).toBe(pickColor("TypeScript"));
  });

  it("cae a un color de respaldo si no hay nombre", () => {
    expect(pickColor(undefined)).toMatch(/^#[0-9a-f]{3,8}$/i);
    expect(pickColor("")).toMatch(/^#[0-9a-f]{3,8}$/i);
  });
});
