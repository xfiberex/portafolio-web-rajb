import type { Skill } from "../types";

export const skills: Skill[] = [
  {
    category: "Frontend",
    items: [
      "React 19",
      "Next.js (App Router)",
      "TypeScript",
      "Blazor WebAssembly",
      "Vite",
      "Tailwind CSS",
      "TanStack Query",
      "Zustand",
      "Zod",
      "HTML5",
      "CSS3",
      "Bootstrap",
    ],
  },
  {
    category: "Backend",
    items: ["C#", ".NET 10", "ASP.NET Core (MVC, Web API)", "Node.js", "Express 5", "APIs REST", "Swagger / OpenAPI"],
  },
  {
    category: "Bases de datos & ORMs",
    items: [
      "SQL Server",
      "PostgreSQL",
      "MongoDB",
      "MySQL",
      "Entity Framework Core",
      "Prisma",
      "ADO.NET",
      "Mongoose",
      "Firebase",
    ],
  },
  {
    category: "Seguridad",
    items: [
      "JWT con refresh rotativo",
      "Detección de reúso de token",
      "OAuth 2.0 con PKCE",
      "Control de acceso por rol",
      "Rate limiting",
      "Mitigación de XSS, CSRF e inyección SQL",
    ],
  },
  {
    category: "Testing",
    items: ["xUnit", "Jest", "Vitest", "Playwright (E2E)", "Supertest", "Pruebas de carga"],
  },
  {
    category: "Escritorio (Windows)",
    items: ["WinUI 3", "WPF (MVVM)", "WinForms", "Tauri + Rust", "Inno Setup"],
  },
  {
    category: "Herramientas & DevOps",
    items: ["Git", "GitHub", "Docker", "Docker Compose", "Visual Studio", "VS Code", "Postman", "Prisma Studio"],
  },
  {
    category: "Principios",
    items: [
      "Programación Orientada a Objetos (POO)",
      "Principios SOLID",
      "Arquitectura en capas",
      "MVC - Modular por dominios - Feature Based",
      "Diseño de APIs REST",
      "Registro de decisiones técnicas (ADRs)",
    ],
  },
  {
    category: "IAs & Herramientas de Desarrollo",
    items: ["Claude Code", "Prompt Engineering"],
  },
];
