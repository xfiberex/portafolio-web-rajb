import type { Project } from "../types";

export const projects: Project[] = [
  {
    title: "TrackerMultimedia",
    subtitle: "ASP.NET Core 10 + React 19 · Seguimiento de anime, manga y manhwa",
    description:
      "Aplicación full-stack para gestionar y descubrir contenido multimedia, con catálogo personal por usuario y búsqueda externa contra la API de Jikan. Backend en capas y frontend SPA en repositorios separados.",
    image: "/placeholder.svg",
    features: [
      "Autenticación JWT con refresh rotativo y detección de reúso de token",
      "OAuth con Google y GitHub implementando PKCE",
      "API organizada en capas (Domain, Contracts, Services, Infrastructure) con EF Core y migraciones versionadas",
      "Suite de tests que cubre aislamiento entre usuarios, autorización y endpoints operativos",
    ],
    tags: [
      "ASP.NET Core 10",
      "C#",
      "Entity Framework Core",
      "PostgreSQL",
      "React 19",
      "TypeScript",
      "TanStack Query",
      "Tailwind CSS",
      "xUnit",
    ],
    frontend: "https://github.com/xfiberex/TrackerMultimedia_Frontend",
    backend: "https://github.com/xfiberex/TrackerMultimedia_Backend",
  },
  {
    title: "Stockly",
    subtitle: "Express 5 + React · Inventario con órdenes de compra y venta",
    description:
      "Sistema de gestión de inventario con control de existencias, órdenes de compra y venta, proveedores y auditoría. Construido con atención al comportamiento bajo concurrencia y a la operación en producción.",
    image: "/placeholder.svg",
    features: [
      "Control de concurrencia en stock mediante decremento condicional en una sola sentencia",
      "Decisiones de arquitectura registradas y versionadas como ADRs",
      "Observabilidad con Prometheus, Alertmanager y logs estructurados",
      "Suite de tests con umbrales de cobertura, contratos de OpenAPI y pruebas de carga propias",
    ],
    tags: [
      "Node.js",
      "Express 5",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "React",
      "TanStack Query",
      "Tailwind CSS",
      "Jest",
      "Prometheus",
      "Docker",
    ],
    frontend: "https://github.com/xfiberex/Stockly-F",
    backend: "https://github.com/xfiberex/Stockly-B",
  },
  {
    title: "KiosGo - Sistema de Kiosko de Comida",
    subtitle: "Next.js 16 · Sistema de punto de venta tipo kiosko para restaurantes",
    description:
      "Aplicación web completa que permite a clientes realizar pedidos de forma autónoma desde un kiosko, con panel de administración en tiempo real para gestión de productos y órdenes.",
    image: "/projects/kiosgo-uno.png",
    features: [
      "Navegación por categorías con carrito de compras (Zustand)",
      "Panel de administración completo con CRUD de productos",
      "Gestión de órdenes en tiempo real con SWR y polling automático",
      "Medidas de seguridad implementadas: CSP, CSRF, rate limiting y validación robusta"
    ],
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "PostgreSQL", "Prisma 7", "Zustand", "Zod", "Cloudinary", "SWR"],
    github: "https://github.com/xfiberex/kiosgo",
    demo: "https://kiosgo-two.vercel.app",
  },
  {
    title: "Sistema de Ventas WEB",
    subtitle: "ASP.NET Core MVC · Gestión de ventas con arquitectura en capas",
    description:
      "Sistema integral de gestión comercial con dashboard ejecutivo, control de inventario y generación automática de reportes.",
    image: "/projects/SistemasVenta-ASPNET-Core-MVC.png",
    features: [
      "Dashboard ejecutivo con métricas en tiempo real",
      "Gestión completa de usuarios, productos e inventario",
      "Generación automática de facturas y reportes PDF"
    ],
    tags: [
      "C#",
      "ASP.NET Core MVC",
      "Arquitectura en capas",
      "Entity Framework Core",
      "SQL Server",
      "Firebase",
      "PDF Reports",
    ],
    github: "https://github.com/xfiberex/SistemaVenta_ASP.NET_CORE_MVC",
  },
  {
    title: "Sistema de Gestión de Tareas Recurrentes",
    subtitle: ".NET Blazor · Aplicación Web Full-Stack con Blazor WebAssembly y .NET 9",
    description:
      "Aplicación empresarial para gestión de tareas recurrentes con calendario interactivo y servicios automatizados.",
    image: "/projects/S-Blazor-TDApp.png",
    features: [
      "Calendario interactivo con programación de tareas por días específicos",
      "Panel de reportes y seguimiento de procesos completados",
      "API RESTful documentada con Swagger y servicios en segundo plano"
    ],
    tags: ["Blazor", ".NET 9", "WebAssembly", "EF Core", "SQL Server", "Swagger/OpenAPI", "Background Services"],
    github: "https://github.com/xfiberex/S_Blazor_TDApp",
  },
  {
    title: "Portafolio Web — RAJB",
    subtitle: "Sitio personal",
    description:
      "Portafolio profesional con diseño moderno, animaciones fluidas y secciones completas para mostrar habilidades, experiencia, proyectos, educación y certificaciones.",
    image: "/projects/Porfolio-web-rajb.png",
    features: [
      "Animaciones y transiciones suaves con Framer Motion",
      "Diseño responsive mobile-first y accesible",
      "Secciones: Sobre mí, Proyectos, Experiencia, Habilidades, Educación, Certificados y Contacto"
    ],
    tags: ["React", "TailwindCSS", "TypeScript", "Framer Motion", "GitHub"],
    github: "https://github.com/xfiberex/portafolio-web-rajb",
    demo: "https://portafolio-web-rajb.netlify.app",
  },
]
