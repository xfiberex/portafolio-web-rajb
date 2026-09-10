import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],

  test: {
    // Vitest solo corre los unitarios de src/. Sin esto recogía también
    // e2e/*.spec.ts —su patrón por defecto incluye *.spec.*— e intentaba
    // ejecutar los tests de Playwright, que fallan fuera de su runner.
    // Los e2e se lanzan con `npm run test:e2e`.
    include: ["src/**/*.test.{ts,tsx}"],
  },
})
