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
 * Cosas para las que **no existe un logotipo que poner**, así que el glifo
 * genérico es la respuesta correcta y no un fallo. Decisión deliberada,
 * cerrada con T2-22. Dos motivos distintos, y conviene no mezclarlos:
 *
 * a) Competencias y prácticas que no son productos.
 * b) Productos reales cuya marca no está en simple-icons —el set CC0 del
 *    que salen los demás iconos de este archivo—. Se comprobó sobre sus
 *    3459 iconos: Playwright y Supertest no están. Dibujarlos a mano sería
 *    inventarse una marca ajena, así que se acepta el glifo genérico hasta
 *    que haya una fuente con licencia clara.
 */
const SIN_LOGOTIPO_POR_DISENO = [
  // (a) competencias, no productos
  "Control de acceso por rol",
  "Detección de reúso de token",
  "OAuth 2.0 con PKCE",
  "Pruebas de carga",
  "Rate limiting",
  "Registro de decisiones técnicas (ADRs)",
  // (b) productos sin marca disponible en simple-icons
  "Playwright (E2E)",
  "Supertest",
];

/**
 * Productos que **sí** deberían tener icono y todavía no lo tienen.
 * Vacía desde T2-22: Jest y TanStack Query se añadieron con sus paths
 * oficiales. Se conserva la lista, y no se borra, porque es donde va lo
 * siguiente que falte — y la comprobación de abajo obliga a mantenerla al
 * día en los dos sentidos.
 */
const PENDIENTES_DE_ICONO: string[] = [];

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

  /* Las variantes NO están en `src/data/`, así que el `it.each` de arriba
     no las toca: ahí "Jest" y "TanStack Query" resuelven por coincidencia
     exacta de clave y su regla podría estar muerta sin que nadie lo note.
     Pasó de verdad al cerrar T2-22: el `` de `/jest/i` se coló como
     carácter de retroceso () y los 89 tests siguieron en verde — lo
     cazó ESLint (`no-control-regex`), no este archivo. Que no se repita. */
  it.each([
    ["jest", "Jest"],
    ["Jest 29", "Jest"],
    ["TanStack Router", "TanStack Query"],
    ["tanstack table", "TanStack Query"],
  ])("la regla, y no la clave exacta, resuelve %s", (variante, canonico) => {
    expect(pickIcon(variante), `"${variante}" no casa con ninguna regla`).toBe(pickIcon(canonico));
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
