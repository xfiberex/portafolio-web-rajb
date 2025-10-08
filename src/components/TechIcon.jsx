// Brand colors for known technologies
const BRAND_COLORS = {
  React: "#61DAFB",
  JavaScript: "#F7DF1E",
  HTML5: "#E34F26",
  CSS3: "#1572B6",
  TailwindCSS: "#38BDF8",
  Bootstrap: "#7952B3",
  "Node.js": "#339933",
  MongoDB: "#47A248",
  Csharp: "#9B4F96",
  DotNet: "#512BD4",
  SQL: "#CC2927",
  Express: "#000000",
  Firebase: "#FFCA28",
  Git: "#F05032",
  GitHub: "#181717",
  "Visual Studio": "#5C2D91",
  "VS Code": "#007ACC",
  Postman: "#FF6C37",
  JWT: "#000000",
  "Entity Framework": "#512BD4",
  Mongoose: "#880000",
  "Clean Code": "#4CAF50",
  SOLID: "#2196F3",
  MVC: "#FF9800",
  Blazor: "#512BD4",
  WebAssembly: "#654FF0",
  "Swagger/OpenAPI": "#85EA2D",
  "PDF Reports": "#DC143C",
  "Background Services": "#512BD4",
  "ADO.NET": "#512BD4",
  Cypress: "#17202C",
  "Programación Orientada a Objetos (POO)": "#4CAF50",
  "Principios SOLID": "#2196F3",
  "Arquitectura MVC": "#FF9800",
  "GitHub Copilot": "#24292e",
  ChatGPT: "#00A67E",
  Claude: "#D97757",
  Gemini: "#4285F4",
  "Cursor IDE": "#000000",
  "AI Code Review": "#7C3AED",
  "Prompt Engineering": "#F59E0B",
  Vite: "#646CFF",
  "Framer Motion": "#FF0055",
}

const FALLBACK_COLOR = "#94a3b8" // slate-400

// Minimal inline SVG paths for common tech logos (single <path> each to keep it light)
const ICONS = {
  React: (
    <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26s-1.18-1.63-3.28-2.26c-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26s1.18 1.63 3.28 2.26c.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96a22.7 22.7 0 0 1 2.4-.36c.48-.67.99-1.31 1.51-1.9z" />
  ),
  JavaScript: (
    <path d="M3 3h18v18H3V3m4.73 15.04c.4.85 1.19 1.55 2.54 1.55 1.5 0 2.53-.8 2.53-2.55v-5.78h-1.7V17c0 .86-.35 1.08-.9 1.08-.58 0-.82-.4-1.09-.87l-1.38.83m5.98-.18c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.83-1.15.83-.83 0-1.31-.43-1.67-1.03l-1.38.8z" />
  ),
  HTML5: (
    <path d="M12 17.56l4.07-1.13.55-6.1H9.38L9.2 8.3h7.6l.2-1.99H7l.56 6.01h6.89l-.23 2.58-2.22.6-2.22-.6-.14-1.66h-2l.29 3.19L12 17.56M4.07 3h15.86L18.5 19.2 12 21l-6.5-1.8L4.07 3z" />
  ),
  CSS3: (
    <path d="M5 3l-.65 3.34h13.59L17.5 8.5H3.92l-.66 3.33h13.59l-.76 3.81-5.48 1.81-4.75-1.81.33-1.64H2.85l-.79 4 7.85 3 9.05-3 1.2-6.03.24-1.21L21.94 3H5z" />
  ),
  TailwindCSS: (
    <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.61 7.15 14.5 6 12 6m-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C8.39 16.85 9.5 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C10.61 13.15 9.5 12 7 12z" />
  ),
  Bootstrap: (
    <path d="M11.77 11.24H9.956V8.202h2.152c1.17 0 1.834.522 1.834 1.466 0 1.008-.773 1.572-2.174 1.572m.324 1.206H9.957v3.348h2.231c1.459 0 2.232-.585 2.232-1.685s-.795-1.663-2.326-1.663M5.5 4.994v14.012h13V4.994zm8.066 9.232c1.277.479 2.044 1.485 2.044 2.854 0 2.523-1.705 3.904-4.218 3.904H7.957V8.016h3.121c2.232 0 3.666 1.02 3.666 2.942 0 1.354-.668 2.368-1.178 2.268z" />
  ),
  "Node.js": (
    <path d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.95.46 1.27.47 1.71.47 1.4 0 2.21-.85 2.21-2.33V8.44c0-.12-.1-.22-.22-.22H8.5c-.13 0-.23.1-.23.22v8.47c0 .66-.68 1.31-1.77.76L4.45 16.5a.26.26 0 0 1-.11-.21V7.71c0-.09.04-.17.11-.21l7.44-4.29c.06-.04.16-.04.22 0l7.44 4.29c.07.04.11.12.11.21v8.58c0 .08-.04.16-.11.21l-7.44 4.29c-.06.04-.16.04-.23 0L10 19.65c-.08-.03-.16-.04-.21-.01-.53.3-.63.36-1.12.51-.12.04-.31.11.07.32l2.48 1.47c.24.14.5.21.78.21s.54-.07.78-.21l7.44-4.29c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.5-.2-.78-.2M14 8c-2.12 0-3.39.89-3.39 2.39 0 1.61 1.26 2.08 3.3 2.28 2.43.24 2.62.6 2.62 1.08 0 .83-.67 1.18-2.23 1.18-1.98 0-2.4-.49-2.55-1.47a.226.226 0 0 0-.22-.18h-.96c-.12 0-.21.09-.21.22 0 1.24.68 2.74 3.94 2.74 2.35 0 3.7-.93 3.7-2.55 0-1.61-1.08-2.03-3.37-2.34-2.31-.3-2.54-.46-2.54-1 0-.45.2-1.05 1.91-1.05 1.5 0 2.09.33 2.32 1.36.02.1.11.17.21.17h.97c.05 0 .11-.02.15-.07.04-.04.07-.1.05-.16C17.56 8.82 16.38 8 14 8z" />
  ),
  MongoDB: (
    <path d="M12.5 2.5c.3.6 3.3 2.5 4.6 8.1 1.3 5.6-.7 8.9-4.45 10.9-.25.1-.4.1-.7 0C7.2 19.5 5.2 16.2 6.5 10.6 7.8 5 10.8 3.1 11.1 2.5c.2-.3.4-.5.4-.5s.2.2.4.5Z" />
  ),
  Csharp: (
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm3.5 6h-1L12 6.5 9.5 8h-1l3-2.25L14.5 8zM8.5 12v4l2-1.2L12 16l1.5-1.2L16 16v-4l-1.5 1.2L12 12l-2.5 1.2L8.5 12zm7 4h-1L12 17.5 9.5 16h-1l3 2.25L14.5 16z" />
  ),
  DotNet: (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-.5 15h-3v-3h1v2h2v1zm0-4h-3v-1h1v-2h-1v-1h3v4zm4.5 4h-3v-1h2v-2h1v3zm0-4h-3v-4h3v1h-2v2h2v1z" />
  ),
  SQL: (
    <path d="M12 4c4.3 0 7.8 1.3 7.8 3s-3.5 3-7.8 3S4.2 8.7 4.2 7 7.7 4 12 4Zm-7.8 6.2c0 1.6 3.5 3 7.8 3s7.8-1.4 7.8-3v2c0 1.7-3.5 3-7.8 3s-7.8-1.3-7.8-3v-2Zm0 4.9c0 1.7 3.5 3 7.8 3s7.8-1.3 7.8-3v2c0 1.7-3.5 3-7.8 3s-7.8-1.3-7.8-3v-2Z" />
  ),
  Express: <path d="M2 12h4l3-7h2l3 7h4v1H2v-1zm7.5-3.5L12 4.5l2.5 4H9.5z" />,
  Firebase: (
    <path d="M6 17.5 8.2 6.8c.1-.7 1-.9 1.4-.3l1.6 2.6 1.8-3.1c.3-.5 1-.5 1.3 0l3.6 6.1-6.8 5.4c-.3.2-.6.2-.8 0L6 17.5Z" />
  ),
  Git: (
    <path d="M21.6 11.1 12.9 2.4c-.3-.3-.9-.3-1.2 0L9.3 4.8l2 2c.5-.2 1.2-.1 1.6.4.5.5.5 1.3 0 1.8-.5.5-1.3.5-1.8 0-.5-.4-.6-1.1-.4-1.6l-2-2-6 6c-.3.3-.3.9 0 1.2l8.7 8.7c.3.3.9.3 1.2 0l8.7-8.7c.3-.3.3-.9 0-1.2Z" />
  ),
  GitHub: (
    <path d="M12 .7a9.9 9.9 0 0 0-3.1 19.3c.5.1.7-.2.7-.5v-1.7c-3 .7-3.6-1.3-3.6-1.3-.4-1-1-1.3-1-1.3-.8-.6.1-.6.1-.6.9.1 1.3.9 1.3.9.8 1.3 2.2.9 2.7.7.1-.6.3-1 .6-1.2-2.4-.3-5-1.2-5-5.4 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.6.1-3.3 0 0 .9-.3 3.1 1.1.9-.3 1.8-.4 2.8-.4s1.9.1 2.8.4c2.2-1.5 3.1-1.1 3.1-1.1.6 1.7.2 3 .1 3.3.7.8 1.1 1.8 1.1 3 0 4.2-2.6 5.1-5 5.4.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A9.9 9.9 0 0 0 12 .7Z" />
  ),
  "Visual Studio": (
    <path d="M17.31 2.59 9.66 10.11 4.36 6.05l-1.64.75v10.38l1.64.77 5.3-4.08 7.65 7.54V2.59zM4.72 15.56V8.43L7.5 12l-2.78 3.56zm8.94-3.56L9.9 7.8l9.41-3.39v11.17L9.9 16.2l3.76-4.2z" />
  ),
  "VS Code": (
    <path d="M22.14 2.15 14.7 1.09c-.4-.06-.8.04-1.1.25L2.89 11.76c-.23.22-.25.58-.02.82l1.29 1.32c.2.21.53.22.74.03l11.32-9.48 6.46 4.95c.31.23.75.18 1-.13l.59-.73c.1-.12.14-.27.12-.42L22.14 2.15zM1.61 13.44l.69.71c.2.2.52.21.74.03l11.9-9.96 6.46 4.95c.31.23.75.18 1-.13l.59-.73c.1-.12.14-.27.12-.42L22.14 2.15 14.7 1.09c-.4-.06-.8.04-1.1.25L2.89 11.76c-.23.22-.25.58-.02.82zm20.53-5.29-6.46-4.95L4.36 13.16c-.21.18-.23.5-.05.71l.69.71c.18.18.46.2.66.04L16.98 4.7l6.46 4.95c.31.23.75.18 1-.13l.59-.73c.1-.12.14-.27.12-.42z" />
  ),
  Postman: (
    <path d="M13.11 10.75c.29-.42.47-.93.47-1.5 0-1.38-1.12-2.5-2.5-2.5s-2.5 1.12-2.5 2.5c0 .57.18 1.08.47 1.5L12 14l2.89-3.25c.07-.08.15-.15.22-.24z" />
  ),
  JWT: (
    <path d="M10.2 2.29c.98-.98 2.56-.98 3.54 0l1.06 1.06c.98.98.98 2.56 0 3.54L12 9.69 9.17 6.86c-.98-.98-.98-2.56 0-3.54l1.03-1.03zm1.8 9.42L12 9.69l2.83 2.83c.98.98.98 2.56 0 3.54l-1.06 1.06c-.98.98-2.56.98-3.54 0l-1.06-1.06c-.98-.98-.98-2.56 0-3.54z" />
  ),
  "Entity Framework": <path d="M2 4v16h20V4H2zm18 14H4V6h16v12zm-2-10H6v2h12V8zm0 4H6v2h12v-2z" />,
  Mongoose: (
    <path d="M12.5 2.5c.3.6 3.3 2.5 4.6 8.1 1.3 5.6-.7 8.9-4.45 10.9-.25.1-.4.1-.7 0C7.2 19.5 5.2 16.2 6.5 10.6 7.8 5 10.8 3.1 11.1 2.5c.2-.3.4-.5.4-.5s.2.2.4.5Z" />
  ),
  "Clean Code": <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />,
  SOLID: (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
  ),
  MVC: (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8V9h2c.55 0 1-.45 1-1V6h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  ),
  Blazor: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  WebAssembly: (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.97.17-1.9.48-2.75L7 12l3 3 2-6 2 6 3-3 2.52-2.75c.31.85.48 1.78.48 2.75 0 4.41-3.59 8-8 8z" />
  ),
  "Swagger/OpenAPI": (
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2zm0 4.5L9.5 10 12 11.5 14.5 10 12 6.5z" />
  ),
  "PDF Reports": <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />,
  "Background Services": (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  ),
  "ADO.NET": (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8V9h2c.55 0 1-.45 1-1V6h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  ),
  Cypress: (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM8.5 16L12 13.5 15.5 16 12 18.5 8.5 16z" />
  ),
  "Programación Orientada a Objetos (POO)": (
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2zm0 4.5L9.5 10 12 11.5 14.5 10 12 6.5z" />
  ),
  "Principios SOLID": (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
  ),
  "Arquitectura MVC": (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8V9h2c.55 0 1-.45 1-1V6h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  ),
  "GitHub Copilot": (
    <path d="M12 0C8.74 0 6.11 3.15 6.11 7.03c0 3.17 2.09 5.86 4.97 6.8.36.07.49-.16.49-.35 0-.17-.01-.73-.01-1.32-3.27.71-3.96-1.39-3.96-1.39-.33-.83-.8-1.05-.8-1.05-.65-.45.05-.44.05-.44.72.05 1.1.74 1.1.74.64 1.1 1.68.78 2.09.6.06-.47.25-.78.45-.96-1.59-.18-3.26-.8-3.26-3.55 0-.78.28-1.42.74-1.92-.07-.18-.32-.91.07-1.9 0 0 .6-.19 1.97.73a6.8 6.8 0 0 1 1.79-.24c.61 0 1.22.08 1.79.24 1.37-.92 1.97-.73 1.97-.73.39.99.14 1.72.07 1.9.46.5.74 1.14.74 1.92 0 2.76-1.68 3.37-3.27 3.55.26.22.49.66.49 1.33 0 .96-.01 1.74-.01 1.97 0 .19.13.42.5.35A7.03 7.03 0 0 0 17.89 7.03C17.89 3.15 15.26 0 12 0z" />
  ),
  ChatGPT: (
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2zm0 4.5L9.5 10 12 11.5 14.5 10 12 6.5z" />
  ),
  Claude: (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.97.17-1.9.48-2.75L7 12l3 3 2-6 2 6 3-3 2.52-2.75c.31.85.48 1.78.48 2.75 0 4.41-3.59 8-8 8z" />
  ),
  Gemini: (
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2zm0 4.5L9.5 10 12 11.5 14.5 10 12 6.5z" />
  ),
  "Cursor IDE": <path d="M3 3v18h18V3H3zm2 2h14v14H5V5zm2 2v10h10V7H7zm2 2h6v6H9V9z" />,
  "AI Code Review": (
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2zm-1 7v6h2V9h-2z" />
  ),
  "Prompt Engineering": (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  ),
  Vite: <path d="M12 2l7 4-2 10-5 6-5-6-2-10 7-4zm0 3.2L8 7.2l1.2 6L12 18l2.8-4.8 1.2-6-4-2z" />,
  "Framer Motion": <path d="M6 4h12v4H10l4 4-4 4h8v4H6l8-8-8-8z" />,
}

function pickColor(name) {
  if (!name) return FALLBACK_COLOR
  const n = String(name)
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
  if (/principios.*solid/i.test(n)) return BRAND_COLORS["Principios SOLID"]
  if (/arquitectura.*mvc/i.test(n)) return BRAND_COLORS["Arquitectura MVC"]
  if (/tailwind.*css/i.test(n)) return BRAND_COLORS.TailwindCSS
  if (/github.*copilot/i.test(n)) return BRAND_COLORS["GitHub Copilot"]
  if (/chatgpt/i.test(n)) return BRAND_COLORS.ChatGPT
  if (/claude/i.test(n)) return BRAND_COLORS.Claude
  if (/gemini/i.test(n)) return BRAND_COLORS.Gemini
  if (/cursor.*ide/i.test(n)) return BRAND_COLORS["Cursor IDE"]
  if (/ai.*code.*review/i.test(n)) return BRAND_COLORS["AI Code Review"]
  if (/prompt.*engineering/i.test(n)) return BRAND_COLORS["Prompt Engineering"]
  if (/vite/i.test(n)) return BRAND_COLORS.Vite
  if (/framer.*motion/i.test(n)) return BRAND_COLORS["Framer Motion"]
  return FALLBACK_COLOR
}

function pickIcon(name) {
  if (!name) return null
  const n = String(name)
  // Exact key match (case-insensitive)
  const exactKey = Object.keys(ICONS).find((key) => key.toLowerCase() === n.toLowerCase())
  if (exactKey) return ICONS[exactKey]
  if (/javascript.*es6|javascript/i.test(n)) return ICONS.JavaScript
  if (/express/i.test(n)) return ICONS.Express
  if (/c#|csharp/i.test(n)) return ICONS.Csharp
  if (/\.net.*core|asp\.net.*core|dotnet/i.test(n)) return ICONS.DotNet
  if (/sql.*server|sql/i.test(n)) return ICONS.SQL
  if (/node\.js|node/i.test(n)) return ICONS["Node.js"]
  if (/mongodb|mongo/i.test(n)) return ICONS.MongoDB
  if (/tailwind/i.test(n)) return ICONS.TailwindCSS
  if (/bootstrap/i.test(n)) return ICONS.Bootstrap
  if (/html/i.test(n)) return ICONS.HTML5
  if (/css/i.test(n)) return ICONS.CSS3
  if (/react/i.test(n)) return ICONS.React
  if (/firebase/i.test(n)) return ICONS.Firebase
  if (/github/i.test(n)) return ICONS.GitHub
  if (/\bgit\b/i.test(n)) return ICONS.Git
  if (/visual.*studio/i.test(n) && !/code/i.test(n)) return ICONS["Visual Studio"]
  if (/vs.*code|vscode/i.test(n)) return ICONS["VS Code"]
  if (/postman/i.test(n)) return ICONS.Postman
  if (/jwt/i.test(n)) return ICONS.JWT
  if (/entity.*framework/i.test(n)) return ICONS["Entity Framework"]
  if (/mongoose/i.test(n)) return ICONS.Mongoose
  if (/clean.*code/i.test(n)) return ICONS["Clean Code"]
  if (/solid/i.test(n)) return ICONS.SOLID
  if (/mvc/i.test(n)) return ICONS.MVC
  if (/responsive.*design/i.test(n)) return ICONS.CSS3
  if (/restful.*api/i.test(n)) return ICONS.Express
  if (/diseño.*bd/i.test(n)) return ICONS.SQL
  if (/arquitectura.*capas/i.test(n)) return ICONS.SOLID
  if (/autenticación|autorización/i.test(n)) return ICONS.JWT
  if (/blazor/i.test(n)) return ICONS.Blazor
  if (/webassembly/i.test(n)) return ICONS.WebAssembly
  if (/swagger|openapi/i.test(n)) return ICONS["Swagger/OpenAPI"]
  if (/pdf.*reports?/i.test(n)) return ICONS["PDF Reports"]
  if (/background.*services?/i.test(n)) return ICONS["Background Services"]
  if (/\.net.*\d+/i.test(n)) return ICONS.DotNet
  if (/ef.*core/i.test(n)) return ICONS["Entity Framework"]
  if (/ado\.net/i.test(n)) return ICONS["ADO.NET"]
  if (/cypress/i.test(n)) return ICONS.Cypress
  if (/programación.*orientada.*objetos|poo/i.test(n)) return ICONS["Programación Orientada a Objetos (POO)"]
  if (/principios.*solid/i.test(n)) return ICONS["Principios SOLID"]
  if (/arquitectura.*mvc/i.test(n)) return ICONS["Arquitectura MVC"]
  if (/tailwind.*css/i.test(n)) return ICONS.TailwindCSS
  if (/github.*copilot/i.test(n)) return ICONS["GitHub Copilot"]
  if (/chatgpt/i.test(n)) return ICONS.ChatGPT
  if (/claude/i.test(n)) return ICONS.Claude
  if (/gemini/i.test(n)) return ICONS.Gemini
  if (/cursor.*ide/i.test(n)) return ICONS["Cursor IDE"]
  if (/ai.*code.*review/i.test(n)) return ICONS["AI Code Review"]
  if (/prompt.*engineering/i.test(n)) return ICONS["Prompt Engineering"]
  if (/vite/i.test(n)) return ICONS.Vite
  if (/framer.*motion/i.test(n)) return ICONS["Framer Motion"]
  return null
}

const FallbackGlyph = () => (
  <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm-2 6h4v7h-2v-5h-2v-2Z" />
)

// Props
// - name: string (required)
// - size: number (px) optional; or use className like w-5 h-5
// - className: Tailwind size classes
// - withBg: boolean adds a subtle background circle
// - label: optional text next to the icon
// - labelClassName, wrapperClassName: styling hooks
// - title: accessible label (defaults to name)
export default function TechIcon(props) {
  const {
    name,
    size,
    className = "w-5 h-5",
    withBg = false,
    label,
    labelClassName = "ml-2 text-sm",
    wrapperClassName = "inline-flex items-center",
    title,
  } = props || {}
  const color = pickColor(name)
  const px = typeof size === "number" ? size : undefined

  const svgProps = {
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    role: "img",
    "aria-label": title || name,
    width: px,
    height: px,
    className,
    style: { color },
    fill: "currentColor",
  }

  const glyph = pickIcon(name)

  const content = (
    <svg {...svgProps}>
      {withBg ? (
        <>
          <circle cx="12" cy="12" r="11" fill="currentColor" fillOpacity="0.1" />
          <g>{glyph || <FallbackGlyph />}</g>
        </>
      ) : (
        glyph || <FallbackGlyph />
      )}
    </svg>
  )

  if (!label) return content
  return (
    <span className={wrapperClassName} title={title || name}>
      {content}
      <span className={labelClassName}>{label}</span>
    </span>
  )
}
