import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

/**
 * Enlaces de los .md que lychee **no puede** revisar.
 *
 * Al cerrar T2-12 se lanzó el verificador a mano: 76 enlaces, cero errores
 * — y sin embargo el README tenía uno roto de verdad, un destino sin
 * esquema `](www.linkedin.com/in/…)`. Se le escapa por dos motivos que se
 * suman:
 *
 *  1. `lychee.toml` excluye LinkedIn a propósito, porque responde 999 a
 *     cualquier cliente sin sesión de navegador y sería un falso positivo
 *     permanente.
 *  2. El workflow pasa `--scheme http --scheme https`, así que un destino
 *     sin esquema ni siquiera entra en la lista de candidatos.
 *
 * Y es un fallo real: GitHub interpreta `](www.ejemplo.com)` como **ruta
 * relativa**, así que el enlace acaba en un 404 dentro del repositorio.
 * Nada lo detectaba. Esto sí.
 */

const DOCS = ["README.md", "ROADMAP.md", "CONTEXT.md", "CHANGELOG.md"];

/** Destinos que sí son rutas relativas legítimas dentro del repositorio. */
const esRelativoLegitimo = (destino: string) =>
  destino.startsWith("#") ||
  destino.startsWith("./") ||
  destino.startsWith("../") ||
  destino.startsWith("/") ||
  /^[\w.-]+\.(md|png|jpg|jpeg|svg|webp|ts|tsx|json|toml|yml|html)(#.*)?$/i.test(destino) ||
  /^(docs|src|e2e|scripts|public|\.github)\//.test(destino);

const ESQUEMA = /^(https?:|mailto:|tel:)/i;

/* Hay que quitar el código antes de buscar: este repositorio cita el enlace
   roto dentro de backticks para documentarlo, y ahí GitHub no lo renderiza
   como enlace. Sin esta limpieza, la documentación del bug cuenta como el
   bug. */
const sinCodigo = (texto: string) => texto.replace(/```[\s\S]*?```/g, "").replace(/`[^`\r\n]*`/g, "");

describe("enlaces de la documentación", () => {
  it.each(DOCS)("%s no tiene destinos sin esquema que parezcan externos", (archivo) => {
    const texto = sinCodigo(readFileSync(archivo, "utf8"));
    const destinos = [...texto.matchAll(/\]\(([^)\s]+)/g)].map((m) => m[1]);

    const sospechosos = destinos.filter((d) => !ESQUEMA.test(d) && !esRelativoLegitimo(d) && /\.[a-z]{2,}\//i.test(d));

    expect(destinos.length, `no se encontró ningún enlace en ${archivo}`).toBeGreaterThan(0);
    expect(
      [...new Set(sospechosos)],
      "parecen URLs externas pero les falta el esquema; GitHub las resuelve como ruta relativa y quedan rotas. Añade https://",
    ).toEqual([]);
  });

  it("no quedan marcadores de posición", () => {
    const culpables = DOCS.filter((f) => /tu-usuario|tu-perfil|tu-email/.test(sinCodigo(readFileSync(f, "utf8"))));
    expect(culpables, "quedan marcadores `tu-usuario` / `tu-perfil` sin sustituir (T3-01)").toEqual([]);
  });
});
