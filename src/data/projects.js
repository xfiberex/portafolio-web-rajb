import { FeatherIcon } from "lucide-react";

export const projects = [
  {
    title: "Portafolio Web — RAJB",
    subtitle: "React · Vite · Tailwind CSS · Sitio personal",
    description:
      "Portafolio profesional con diseño moderno, animaciones fluidas y secciones completas para mostrar habilidades, experiencia, proyectos, educación y certificaciones.",
    image: "/projects/Porfolio-web-rajb.png",
    features: [
      "Animaciones y transiciones suaves con Framer Motion",
      "Diseño responsive mobile‑first y accesible",
      "Secciones: Sobre mí, Proyectos, Experiencia, Habilidades, Educación, Certificados y Contacto"
    ],
    tags: ["React", "TailwindCSS", "JavaScript", "Framer Motion", "GitHub"],
    github: "https://github.com/xfiberex/portafolio-web-rajb",
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
    title: "Gestor de Tareas",
    subtitle: "Full Stack MERN · Gestión de tareas con cuentas de Usuario y Perfil",
    description:
      "Aplicación web para gestión personal de tareas con autenticación completa y interfaz responsiva optimizada para móviles.",
    image: "/projects/GestorTareasMERN.png",
    features: [
      "Sistema completo de autenticación de usuarios",
      "CRUD de tareas con filtros avanzados por prioridad y fechas",
      "Interfaz responsiva con FABs optimizada para móvil"
    ],
    tags: ["React", "Node.js", "Express", "MongoDB", "JWT", "TailwindCSS"],
    frontend: "https://github.com/xfiberex/todolist-frontend",
    backend: "https://github.com/xfiberex/todolist-backend",
  },
  {
    title: "Sistema de Gestión de Tareas Recurrentes",
    subtitle: ".NET Blazor · Aplicación Web Full-Stack con Blazor WebAssembly y .NET 9",
    description:
      "Aplicación empresarial para gestión de tareas recurrentes con calendario interactivo y servicios automatizados.",
    image: "/projects/TareasRecurrentes-S-Blazor-TDApp.png",
    features: [
      "Calendario interactivo con programación de tareas por días específicos",
      "Panel de reportes y seguimiento de procesos completados",
      "API RESTful documentada con Swagger y servicios en segundo plano"
    ],
    tags: ["Blazor", ".NET 9", "WebAssembly", "EF Core", "SQL Server", "Swagger/OpenAPI", "Background Services"],
    github: "https://github.com/xfiberex/S_Blazor_TDApp",
  },
  {
    title: "Sistema de Ventas Desktop",
    subtitle: "C# · Windows Forms · Arquitectura en capas con SQL Server",
    description:
      "Sistema integral de gestión de ventas con arquitectura n-tier, desarrollado desde cero con Windows Forms. Incluye gestión completa de usuarios, inventario, ventas y reportes financieros.",
    image: "/projects/SistemaVentasDesktop.png",
    features: [
      "Arquitectura en 4 capas (Datos, Entidades, Negocio, Presentación)",
      "Sistema de autenticación con roles y permisos de usuario",
      "Gestión completa de inventario, clientes, proveedores y ventas",
      "Módulo de reportes detallados y análisis financiero"
    ],
    tags: ["C#", ".NET Framework", "Windows Forms", "SQL Server", "Arquitectura en capas"],
    github: "https://github.com/xfiberex/Sistema_Ventas_Completo",
  }
]
