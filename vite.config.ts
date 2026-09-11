import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type { PluginOption } from "vite";

/**
 * `mode` en vez de una variable de entorno: `ANALYZE=1 vite build` no
 * funciona en PowerShell, y --mode es nativo de Vite y multiplataforma.
 *
 * El analizador se importa de forma perezosa **a propósito**. Con un import
 * de nivel superior, un entorno que no instale devDependencies no fallaria
 * al analizar: fallaria al cargar este archivo, y con el el build entero de
 * produccion. Asi el riesgo se queda dentro del modo "analyze".
 */
export default defineConfig(async ({ mode }) => {
  const analizador: PluginOption[] = [];

  if (mode === "analyze") {
    const { visualizer } = await import("rollup-plugin-visualizer");
    analizador.push(
      visualizer({
        filename: "stats.html",
        template: "treemap",
        gzipSize: true,
        brotliSize: true,
      }) as PluginOption,
    );
  }

  return {
    plugins: [react(), tailwindcss(), ...analizador],

    test: {
      // Vitest solo corre los unitarios de src/. Sin esto recogía también
      // e2e/*.spec.ts —su patrón por defecto incluye *.spec.*— e intentaba
      // ejecutar los tests de Playwright, que fallan fuera de su runner.
      // Los e2e se lanzan con `npm run test:e2e`.
      include: ["src/**/*.test.{ts,tsx}"],
    },
  };
});
