import { describe, expect, it } from "vitest";
import { pickColor, pickIconKey } from "./tech-icons";
import { ICON_PATHS } from "../data/tech-icons";
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
    expect(
      pickIconKey(tag),
      `"${tag}" cae al glifo genérico: añade su icono en src/data/tech-icons.ts o justifícalo en una de las dos listas de este test`,
    ).not.toBeNull();
  });

  /* Guarda contra la podredumbre: si alguien añade el icono de Jest pero se
     olvida de sacarlo de la lista, este test lo dice. Y si aparece un tag
     nuevo sin icono, el `it.each` de arriba lo caza. */
  it("la lista de pendientes coincide exactamente con lo que falta", () => {
    const realmenteSinIcono = todosLosTags().filter((t) => pickIconKey(t) === null);
    expect(realmenteSinIcono.sort()).toEqual([...SIN_LOGOTIPO_POR_DISENO, ...PENDIENTES_DE_ICONO].sort());
  });

  /* La regla era /windows.*forms/ y el dato dice "WinForms", que no contiene
     "windows": nunca casaba pese a existir la entrada. Corregido; que no
     vuelva a pasar. */
  it("resuelve WinForms, que antes nunca casaba", () => {
    expect(pickIconKey("WinForms")).not.toBeNull();
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
    expect(pickIconKey(variante), `"${variante}" no casa con ninguna regla`).toBe(pickIconKey(canonico));
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

describe("las versiones concretas siguen resolviendo sin rama propia (T3-14)", () => {
  /* Había ramas dedicadas para «.NET 9», «React 19», «Tailwind CSS 4»…
     todas **inalcanzables**: una regla anterior más general las tapaba
     (`/react/` antes que `/react.*19/`, `/\.net.*\d+/` antes que
     `/\.net.*9/`). Se borraron. Estas aserciones fijan que los nombres
     siguen resolviendo igual, para que nadie las reponga «por si acaso». */
  it.each([
    [".NET 8", ".NET"],
    [".NET 9", ".NET"],
    [".NET 10", ".NET"],
    ["React 19", "React"],
    ["Tailwind CSS 4", "TailwindCSS"],
    ["Next.js 16", "Next.js"],
    ["Prisma 7", "Prisma"],
    ["Principios SOLID", "SOLID"],
    ["Arquitectura MVC", "MVC"],
    ["EF Core", "Entity Framework"],
  ])("%s resuelve a un icono", (nombre, familia) => {
    expect(pickIconKey(nombre), `"${nombre}" dejó de resolver`).not.toBeNull();
    expect(pickColor(nombre)).toMatch(/^#[0-9a-f]{3,8}$/i);
    // La familia existe: si alguien borra el icono base, esto lo dice.
    expect(pickIconKey(familia), `falta el icono base "${familia}"`).not.toBeNull();
  });
});

/**
 * Entradas de `ICONS` que existen pero que **ningún tag de `src/data/`
 * alcanza hoy**. No son deuda: son inventario.
 *
 * Se midió antes de decidir (T3-15). Las 18 suman **1,6 kB gzip, el 1,3 %
 * del bundle**, contra un presupuesto de 160 kB del que se usan 124. A ese
 * precio, borrarlas solo conseguiría que el día que se añada «Python» o
 * «Docker» a las competencias salga el glifo genérico — el fallo silencioso
 * que este archivo de test existe para evitar.
 *
 * Lo que sí hacía falta era que la lista no creciera a escondidas, y de eso
 * se encarga la comprobación de abajo: es exacta en los dos sentidos.
 */
const ICONOS_EN_RESERVA = [
  ".NET",
  ".NET Framework",
  "AI Code Review",
  "Arquitectura MVC",
  "ChatGPT",
  "Clean Code",
  "Cursor IDE",
  "Cypress",
  "Gemini",
  "GitHub Copilot",
  "Google Antigravity",
  "JavaScript",
  "Neon",
  "Netlify",
  "Python",
  "Rust",
  "Vercel",
  "Windows App SDK",
];

describe("inventario de iconos (T3-15)", () => {
  /* Qué claves de ICON_PATHS alcanza realmente algún tag.
     `pickIconKey` devuelve la clave y no el dibujo justamente para esto:
     varias claves comparten `path` (`.NET`, `.NET 8` y `DotNet` dan el
     mismo logo) y comparar por valor las colapsaría, inventando entradas
     huérfanas. */
  const alcanzadas = () => {
    const vistas = new Set<string>();
    for (const tag of todosLosTags()) {
      const clave = pickIconKey(tag);
      if (clave) vistas.add(clave);
    }
    return vistas;
  };

  it("la lista de reserva coincide exactamente con lo que no se usa", () => {
    const vistas = alcanzadas();
    const reserva = Object.keys(ICON_PATHS)
      .filter((k) => !vistas.has(k))
      .sort();
    expect(
      reserva,
      "cambió el inventario: si añadiste un tag que ya tenía icono, sácalo de ICONOS_EN_RESERVA; si añadiste un icono nuevo sin usar, méteselo",
    ).toEqual([...ICONOS_EN_RESERVA].sort());
  });

  it("las de reserva siguen resolviendo si alguien las usa mañana", () => {
    for (const nombre of ICONOS_EN_RESERVA) {
      expect(pickIconKey(nombre), `"${nombre}" está en reserva pero ya no resuelve`).not.toBeNull();
    }
  });
});
