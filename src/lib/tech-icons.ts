/**
 * Resolución de icono y color por nombre de tecnología.
 * ─────────────────────────────────────────────────────────────
 * ~75 heurísticas regex evaluadas **en orden**: la primera que casa gana.
 * Es el punto más frágil del proyecto, porque al añadir una tecnología a
 * `src/data/` nada avisa de que se quedó sin icono — el fallo es silencioso
 * y solo sale el glifo genérico. Por eso hay un test de tabla que recorre
 * todos los tags reales (T2-07).
 *
 * Vive aparte del componente desde T3-16: antes `TechIcon.tsx` mezclaba
 * datos, resolución y render en 550 líneas, y exportar funciones desde un
 * archivo de componente obligaba a silenciar `react-refresh`.
 *
 * Ojo al orden: una regla general **tapa** a las que vengan después. Se
 * eliminaron 15 ramas que nunca podían ejecutarse por eso (T3-14); antes de
 * añadir una nueva, comprobar que ninguna anterior la subsume.
 */
import { BRAND_COLORS, FALLBACK_COLOR, ICON_PATHS } from "../data/tech-icons";

export { FALLBACK_COLOR };

export function pickColor(name?: string): string {
  if (!name) return FALLBACK_COLOR;
  const n = String(name);
  // Exact match first (case-insensitive, no regex pitfalls)
  const exactKey = Object.keys(BRAND_COLORS).find((key) => key.toLowerCase() === n.toLowerCase())
  if (exactKey) return BRAND_COLORS[exactKey]
  // Heuristics
  if (/react/i.test(n)) return BRAND_COLORS.React
  if (/javascript.*es6|javascript/i.test(n)) return BRAND_COLORS.JavaScript
  if (/html/i.test(n)) return BRAND_COLORS.HTML5
  if (/css/i.test(n) && !/tailwind/i.test(n)) return BRAND_COLORS.CSS3
  if (/tailwind/i.test(n)) return BRAND_COLORS.TailwindCSS
  if (/bootstrap/i.test(n)) return BRAND_COLORS.Bootstrap
  if (/node\.js|node/i.test(n)) return BRAND_COLORS["Node.js"]
  if (/mongodb|mongo/i.test(n)) return BRAND_COLORS.MongoDB
  if (/c#/i.test(n)) return BRAND_COLORS.Csharp
  if (/\.net.*core|asp\.net.*core|dotnet/i.test(n)) return BRAND_COLORS.DotNet
  if (/sql.*server|sql/i.test(n)) return BRAND_COLORS.SQL
  if (/express/i.test(n)) return BRAND_COLORS.Express
  if (/firebase/i.test(n)) return BRAND_COLORS.Firebase
  if (/github/i.test(n)) return BRAND_COLORS.GitHub
  if (/\bgit\b/i.test(n)) return BRAND_COLORS.Git
  if (/visual.*studio/i.test(n) && !/code/i.test(n)) return BRAND_COLORS["Visual Studio"]
  if (/vs.*code|vscode/i.test(n)) return BRAND_COLORS["VS Code"]
  if (/postman/i.test(n)) return BRAND_COLORS.Postman
  if (/jwt/i.test(n)) return BRAND_COLORS.JWT
  if (/entity.*framework/i.test(n)) return BRAND_COLORS["Entity Framework"]
  if (/mongoose/i.test(n)) return BRAND_COLORS.Mongoose
  if (/clean.*code/i.test(n)) return BRAND_COLORS["Clean Code"]
  if (/solid/i.test(n)) return BRAND_COLORS.SOLID
  if (/mvc/i.test(n)) return BRAND_COLORS.MVC
  if (/responsive.*design/i.test(n)) return BRAND_COLORS.CSS3
  if (/restful.*api/i.test(n)) return BRAND_COLORS.Express
  if (/diseño.*bd/i.test(n)) return BRAND_COLORS.SQL
  if (/arquitectura.*capas/i.test(n)) return BRAND_COLORS.SOLID
  if (/autenticación|autorización/i.test(n)) return BRAND_COLORS.JWT
  if (/blazor/i.test(n)) return BRAND_COLORS.Blazor
  if (/webassembly/i.test(n)) return BRAND_COLORS.WebAssembly
  if (/swagger|openapi/i.test(n)) return BRAND_COLORS["Swagger/OpenAPI"]
  if (/pdf.*reports?/i.test(n)) return BRAND_COLORS["PDF Reports"]
  if (/background.*services?/i.test(n)) return BRAND_COLORS["Background Services"]
  if (/\.net.*\d+/i.test(n)) return BRAND_COLORS.DotNet
  if (/ef.*core/i.test(n)) return BRAND_COLORS["Entity Framework"]
  if (/ado\.net/i.test(n)) return BRAND_COLORS["ADO.NET"]
  if (/cypress/i.test(n)) return BRAND_COLORS.Cypress
  if (/programación.*orientada.*objetos|poo/i.test(n)) return BRAND_COLORS["Programación Orientada a Objetos (POO)"]
  if (/github.*copilot/i.test(n)) return BRAND_COLORS["GitHub Copilot"]
  if (/chatgpt/i.test(n)) return BRAND_COLORS.ChatGPT
  if (/claude/i.test(n)) return BRAND_COLORS.Claude
  if (/gemini/i.test(n)) return BRAND_COLORS.Gemini
  if (/cursor.*ide/i.test(n)) return BRAND_COLORS["Cursor IDE"]
  if (/ai.*code.*review/i.test(n)) return BRAND_COLORS["AI Code Review"]
  if (/prompt.*engineering/i.test(n)) return BRAND_COLORS["Prompt Engineering"]
  if (/vitest/i.test(n)) return BRAND_COLORS.Vitest
  if (/vite/i.test(n)) return BRAND_COLORS.Vite
  if (/framer.*motion/i.test(n)) return BRAND_COLORS["Framer Motion"]
  if (/typescript/i.test(n)) return BRAND_COLORS.TypeScript
  if (/next\.?js/i.test(n)) return BRAND_COLORS["Next.js"]
  if (/postgresql|postgres/i.test(n)) return BRAND_COLORS.PostgreSQL
  if (/prisma/i.test(n)) return BRAND_COLORS.Prisma
  if (/zustand/i.test(n)) return BRAND_COLORS.Zustand
  if (/zod/i.test(n)) return BRAND_COLORS.Zod
  if (/cloudinary/i.test(n)) return BRAND_COLORS.Cloudinary
  if (/swr/i.test(n)) return BRAND_COLORS.SWR
  if (/win(dows)?\s*forms/i.test(n)) return BRAND_COLORS["Windows Forms"]
  if (/\.net.*framework/i.test(n)) return BRAND_COLORS[".NET Framework"]
  if (/minimal.*apis?/i.test(n)) return BRAND_COLORS["Minimal APIs"]
  if (/neon/i.test(n)) return BRAND_COLORS.Neon
  if (/netlify/i.test(n)) return BRAND_COLORS.Netlify
  if (/vercel/i.test(n)) return BRAND_COLORS.Vercel
  if (/docker/i.test(n)) return BRAND_COLORS.Docker
  if (/xunit/i.test(n)) return BRAND_COLORS.xUnit
  if (/dise[ñn]o.*apis?.*rest|apis?\s*rest/i.test(n)) return BRAND_COLORS["Diseño de APIs REST"]
  if (/antigravity/i.test(n)) return BRAND_COLORS["Google Antigravity"]
  if (/winui/i.test(n)) return BRAND_COLORS["WinUI 3"]
  if (/windows.*app.*sdk/i.test(n)) return BRAND_COLORS["Windows App SDK"]
  if (/mvvm/i.test(n)) return BRAND_COLORS.MVVM
  if (/tauri/i.test(n)) return BRAND_COLORS["Tauri 2"]
  if (/\brust\b/i.test(n)) return BRAND_COLORS.Rust
  if (/python/i.test(n)) return BRAND_COLORS.Python
  if (/inno.*setup/i.test(n)) return BRAND_COLORS["Inno Setup"]
  if (/\.net/i.test(n)) return BRAND_COLORS[".NET"]
  return FALLBACK_COLOR
}
/**
 * Devuelve la **clave** de `ICON_PATHS`, no el dibujo.
 *
 * Es deliberado: varias claves comparten el mismo `path` —`.NET`, `.NET 8`
 * y `DotNet` dan el mismo logo— así que devolver el path haría imposible
 * saber qué entrada se eligió, y el test de inventario colapsaría las
 * duplicadas dando entradas huérfanas de mentira. Pasó al montar T3-16.
 */
export function pickIconKey(name?: string): string | null {
  if (!name) return null;
  const n = String(name);
  // Exact key match (case-insensitive)
  const exactKey = Object.keys(ICON_PATHS).find((key) => key.toLowerCase() === n.toLowerCase())
  if (exactKey) return exactKey
  if (/javascript.*es6|javascript/i.test(n)) return "JavaScript"
  if (/express/i.test(n)) return "Express"
  if (/c#|csharp/i.test(n)) return "Csharp"
  if (/\.net.*core|asp\.net.*core|dotnet/i.test(n)) return "DotNet"
  if (/sql.*server|sql/i.test(n)) return "SQL"
  if (/node\.js|node/i.test(n)) return "Node.js"
  if (/mongodb|mongo/i.test(n)) return "MongoDB"
  if (/tailwind/i.test(n)) return "TailwindCSS"
  if (/bootstrap/i.test(n)) return "Bootstrap"
  if (/html/i.test(n)) return "HTML5"
  if (/css/i.test(n)) return "CSS3"
  if (/react/i.test(n)) return "React"
  if (/firebase/i.test(n)) return "Firebase"
  if (/github/i.test(n)) return "GitHub"
  if (/\bgit\b/i.test(n)) return "Git"
  if (/visual.*studio/i.test(n) && !/code/i.test(n)) return "Visual Studio"
  if (/vs.*code|vscode/i.test(n)) return "VS Code"
  if (/postman/i.test(n)) return "Postman"
  if (/jwt/i.test(n)) return "JWT"
  if (/entity.*framework/i.test(n)) return "Entity Framework"
  if (/mongoose/i.test(n)) return "Mongoose"
  if (/clean.*code/i.test(n)) return "Clean Code"
  if (/solid/i.test(n)) return "SOLID"
  if (/mvc/i.test(n)) return "MVC"
  if (/responsive.*design/i.test(n)) return "CSS3"
  if (/restful.*api/i.test(n)) return "Express"
  if (/diseño.*bd/i.test(n)) return "SQL"
  if (/arquitectura.*capas/i.test(n)) return "SOLID"
  if (/autenticación|autorización/i.test(n)) return "JWT"
  if (/blazor/i.test(n)) return "Blazor"
  if (/webassembly/i.test(n)) return "WebAssembly"
  if (/swagger|openapi/i.test(n)) return "Swagger/OpenAPI"
  if (/pdf.*reports?/i.test(n)) return "PDF Reports"
  if (/background.*services?/i.test(n)) return "Background Services"
  if (/\.net.*\d+/i.test(n)) return "DotNet"
  if (/ef.*core/i.test(n)) return "Entity Framework"
  if (/ado\.net/i.test(n)) return "ADO.NET"
  if (/cypress/i.test(n)) return "Cypress"
  if (/programación.*orientada.*objetos|poo/i.test(n)) return "Programación Orientada a Objetos (POO)"
  if (/github.*copilot/i.test(n)) return "GitHub Copilot"
  if (/chatgpt/i.test(n)) return "ChatGPT"
  if (/claude/i.test(n)) return "Claude"
  if (/gemini/i.test(n)) return "Gemini"
  if (/cursor.*ide/i.test(n)) return "Cursor IDE"
  if (/ai.*code.*review/i.test(n)) return "AI Code Review"
  if (/prompt.*engineering/i.test(n)) return "Prompt Engineering"
  if (/vitest/i.test(n)) return "Vitest"
  if (/vite/i.test(n)) return "Vite"
  if (/framer.*motion/i.test(n)) return "Framer Motion"
  if (/typescript/i.test(n)) return "TypeScript"
  if (/next\.?js/i.test(n)) return "Next.js"
  if (/postgresql|postgres/i.test(n)) return "PostgreSQL"
  if (/prisma/i.test(n)) return "Prisma"
  if (/zustand/i.test(n)) return "Zustand"
  if (/zod/i.test(n)) return "Zod"
  if (/cloudinary/i.test(n)) return "Cloudinary"
  if (/swr/i.test(n)) return "SWR"
  if (/win(dows)?\s*forms/i.test(n)) return "Windows Forms"
  if (/\.net.*framework/i.test(n)) return ".NET Framework"
  if (/minimal.*apis?/i.test(n)) return "DotNet"
  if (/neon/i.test(n)) return "Neon"
  if (/netlify/i.test(n)) return "Netlify"
  if (/vercel/i.test(n)) return "Vercel"
  if (/docker/i.test(n)) return "Docker"
  if (/xunit/i.test(n)) return "xUnit"
  if (/\bjest\b/i.test(n)) return "Jest"
  if (/tanstack/i.test(n)) return "TanStack Query"
  if (/dise[ñn]o.*apis?.*rest|apis?\s*rest/i.test(n)) return "Diseño de APIs REST"
  if (/antigravity/i.test(n)) return "Google Antigravity"
  if (/winui/i.test(n)) return "WinUI 3"
  if (/windows.*app.*sdk/i.test(n)) return "Windows App SDK"
  if (/mvvm/i.test(n)) return "MVVM"
  if (/tauri/i.test(n)) return "Tauri 2"
  if (/\brust\b/i.test(n)) return "Rust"
  if (/python/i.test(n)) return "Python"
  if (/inno.*setup/i.test(n)) return "Inno Setup"
  if (/\.net/i.test(n)) return ".NET"
  return null
}