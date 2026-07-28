import type { Skill } from "../types";

export const skills: Skill[] = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Blazor", "HTML5", "CSS3", "Tailwind CSS", "Vite", "Bootstrap"],
  },
  {
    category: "Backend",
    items: ["C#", ".NET", "ASP.NET Core (MVC, Web API)", "Node.js", "Express", "RESTful APIs", "JWT"],
  },
  {
    category: "Bases de datos & ORMs",
    items: ["SQL Server", "PostgreSQL", "MongoDB", "Entity Framework Core", "ADO.NET", "Prisma", "Mongoose", "MySQL", "Firebase"],
  },
  {
    category: "Herramientas, QA & DevOps",
    items: ["Git", "GitHub", "Docker", "Visual Studio", "VS Code", "Postman", "Swagger", "Prisma Studio", "Vitest", "xUnit", "Cypress"],
  },
  {
    category: "Principios",
    items: [
      "Programación Orientada a Objetos (POO)",
      "Principios SOLID",
      "Arquitectura MVC - Modular por dominios - Feature Based",
      "Diseño de APIs REST",
    ],
  },
  {
    category: "IAs & Herramientas de Desarrollo",
    items: ["GitHub Copilot", "ChatGPT", "Claude", "AI Code Review", "Prompt Engineering"],
  },
]
