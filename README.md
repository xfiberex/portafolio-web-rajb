# 🚀 Portfolio Web - Ricky Angel Jiménez Bueno

Un portafolio web moderno, seguro y responsivo construido con las últimas tecnologías web. Este proyecto presenta mis habilidades, experiencia, proyectos y certificaciones de manera profesional e interactiva, con un enfoque en rendimiento, seguridad y experiencia de usuario.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.0+-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0+-38bdf8?logo=tailwindcss&logoColor=white)
![Security](https://img.shields.io/badge/Security-A+-success?logo=netlify&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

![Portafolio-web-rajb](public/projects/Porfolio-web-rajb.webp)

## ✨ Características - [Demostración](https://portafolio-web-rajb.netlify.app/)

- **🎨 Diseño Moderno**: Interfaz limpia y profesional con animaciones suaves
- **📱 Totalmente Responsivo**: Optimizado para dispositivos móviles, tablets y escritorio
- **🌟 Animaciones Interactivas**: Implementadas con Framer Motion
- **⚡ Rendimiento Optimizado**: Construido con Vite 7 para carga ultrarrápida
- **🛡️ Seguridad Reforzada**: Headers HTTP de seguridad, CSP estricto, protección anti-clickjacking
- **🔒 Protección de Datos**: Email sin `mailto:` en el HTML, enlaces externos con `rel="noopener noreferrer"`
- **🎯 Type-Safe**: Desarrollo con TypeScript para mayor confiabilidad
- **📧 Email no rastreable a la primera**: lo ensambla JavaScript; en el `<noscript>` va ofuscado
- **🔍 SEO Optimizado**: Meta tags y estructura semántica

## 🛠️ Tecnologías Utilizadas

### Core Technologies
- **React 19** - Biblioteca moderna para interfaces de usuario reactivas
- **TypeScript 5** - Superset de JavaScript con tipado estático
- **Vite 7** - Build tool de próxima generación, ultrarrápido
- **Tailwind CSS 4** - Framework de CSS utility-first con nuevas capacidades
- **Framer Motion 12** - Biblioteca avanzada de animaciones para React

### UI & Icons
- **lucide-react** - Iconos modernos y consistentes
- **react-type-animation** - Animaciones de texto tipo máquina de escribir

### Security & Best Practices
- **Netlify Security Headers** - CSP, HSTS, X-Frame-Options, Permissions-Policy
- **Email ensamblado en JavaScript** - Sin `mailto:` ni dirección literal en el HTML
- **Secure External Links** - rel="noopener noreferrer" en todos los enlaces

### Development Tools
- **ESLint 9** - Linter moderno para TypeScript/React
- **typescript-eslint** - Parser y reglas para análisis de archivos TypeScript/TSX
- **Vite Plugin React** - Plugin oficial optimizado para React

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js **20.19+** o **22.12+** (recomendado: 22, la versión que usan CI y Netlify)
- npm o yarn

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/portafolio-web.git
   cd portafolio-web
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Ejecuta el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador**
   ```
   http://localhost:5173
   ```

### Scripts Disponibles

```bash
# Servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de la construcción
npm run preview

# Ejecutar linter
npm run lint

# Verificar tipos TypeScript
npm run type-check

# Convertir a WebP las capturas nuevas de public/projects/
# (se corre a mano al añadir una captura, no en cada build)
npm run images:webp
npm run images:webp -- --clean   # y borra los PNG de origen
```

## 📁 Estructura del Proyecto

```
portafolio-web/
├── public/
│   ├── assets/                     Los dos PDF del CV
│   ├── fonts/                      Inter auto-hospedada (.woff2) + licencia SIL OFL
│   ├── projects/                   Capturas de los proyectos (.webp)
│   ├── favicon.svg
│   ├── og-image.jpg                Tarjeta social 1200×630
│   ├── placeholder.svg             Reemplazo si falla la carga de una captura
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/
│   └── images-to-webp.mjs          Conversión con sharp (npm run images:webp)
├── src/
│   ├── components/
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx     Dos disposiciones: "featured" y "row"
│   │   │   └── ProjectLinks.tsx    Repo, ampliar, frontend, backend, demo
│   │   ├── ui/
│   │   │   ├── ErrorBoundary.tsx   Fallback cuando el árbol React revienta
│   │   │   ├── Lightbox.tsx        Visor modal con contrato de diálogo
│   │   │   ├── ObfuscatedEmail.tsx Ensambla el email en JavaScript
│   │   │   ├── Section.tsx         Ritmo vertical, ancho y scroll-margin del navbar
│   │   │   ├── SectionHeader.tsx   h2 + subtítulo
│   │   │   ├── SkipLink.tsx        Salta la navegación; visible al recibir foco
│   │   │   └── TechTags.tsx        Lista de tecnologías
│   │   ├── About.tsx
│   │   ├── Certificates.tsx
│   │   ├── Contact.tsx
│   │   ├── Education.tsx
│   │   ├── Experience.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   └── TechIcon.tsx            Colores de marca, rutas SVG y resolución por heurística
│   ├── data/                       Contenido tipado: editar aquí, no en los componentes
│   │   ├── certificates.ts
│   │   ├── education.ts
│   │   ├── experience.ts
│   │   ├── projects.ts
│   │   └── skills.ts
│   ├── hooks/
│   │   ├── usePrefersReducedMotion.ts
│   │   └── useScrollspy.ts
│   ├── lib/
│   │   ├── animations.ts           Variantes de Framer Motion
│   │   ├── assets.ts               toAssetUrl y safeExternalUrl
│   │   └── contact.ts              Email y rutas de los CV
│   ├── types/index.ts
│   ├── App.tsx
│   ├── index.css                   Design system en dos capas
│   └── main.tsx
├── index.html
├── netlify.toml
├── lychee.toml
├── eslint.config.js
└── vite.config.ts
```

## 🎨 Secciones del Portfolio

- **🏠 Hero**: Presentación principal con animación de texto
- **👨‍💻 Sobre Mí**: Información personal y profesional
- **🚀 Proyectos**: Showcase de proyectos destacados
- **💼 Experiencia**: Historial laboral y profesional
- **🛠️ Habilidades**: Tecnologías y herramientas
- **🎓 Educación**: Formación académica
- **📜 Certificaciones**: Cursos y certificaciones
- **📞 Contacto**: Email directo y redes sociales (no hay formulario)
- **🚫 Sin JavaScript**: un bloque `<noscript>` con nombre, rol, email y enlaces a CV, GitHub
  y LinkedIn, para que la página nunca quede en blanco

## 🌐 Despliegue

### Netlify (Recomendado)
Este proyecto está optimizado para Netlify con configuración de seguridad incluida:

1. Conecta tu repositorio de GitHub con Netlify
2. Configura el comando de construcción: `npm run build`
3. Directorio de publicación: `dist`
4. El archivo `netlify.toml` incluye:
   - Headers de seguridad HTTP
   - Cache optimizado para assets
   - `Content-Type` explícito para `/sitemap.xml`
   - Configuración para deploy previews

**Validar seguridad post-deploy:**
- [SecurityHeaders.com](https://securityheaders.com) - Debería dar A+
- [Mozilla Observatory](https://observatory.mozilla.org) - Verificar CSP

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### GitHub Pages
```bash
npm run build
# Sube el contenido de la carpeta 'dist' a tu repositorio gh-pages
```

## 🔧 Personalización

### Modificar Datos Personales
Edita los archivos TypeScript en la carpeta `src/data/`:
- `projects.ts` - Tus proyectos
- `experience.ts` - Experiencia laboral
- `skills.ts` - Habilidades técnicas
- `education.ts` - Formación académica
- `certificates.ts` - Certificaciones

Todos los archivos están tipados para evitar errores y mejorar la experiencia de desarrollo.

### Cambiar Colores y Estilos
Los estilos están definidos en `src/index.css` y utilizan Tailwind CSS 4. Puedes personalizar:
- Colores primarios
- Tipografías
- Espaciados
- Animaciones

### Configurar Variables de Entorno
1. Crea un archivo `.env` en la raíz del proyecto
2. Configura tus claves API (si usas servicios externos como EmailJS)
3. Solo las variables con prefijo `VITE_` son accesibles en el frontend

### Añadir Nuevas Secciones
1. Crea un nuevo componente TypeScript en `src/components/`
2. Define los tipos necesarios en `src/types/`
3. Importa y añade el componente en `App.tsx`
4. Actualiza la navegación en `Navbar.tsx`

## 📈 Características Técnicas

### Performance
- Build ultrarrápido con Vite 7
- Cache inmutable en `/assets/*` — pendiente acotarlo a los archivos con hash, que hoy
  alcanza también a los PDF del CV (T2-06 no, **T2-20**)
- Imágenes con `loading="lazy"` nativo
- **Sin code splitting**: el build produce un único chunk (~124 kB gzip). Si conviene
  dividirlo está por decidir — ver T2-06 en [ROADMAP.md](ROADMAP.md)

### Seguridad (Security Score: A+)
- **Content Security Policy (CSP)** estricto pero funcional
- **HSTS** con preload para forzar HTTPS
- **X-Frame-Options: DENY** contra clickjacking
- **Permissions-Policy** bloqueando APIs innecesarias
- **Cross-Origin Policies** para protección adicional
- La dirección literal no está en el HTML servido (0 ocurrencias de `usuario@dominio` en
  `dist/index.html`): el JS la ensambla a partir de sus partes, y el bloque `<noscript>` la
  muestra ofuscada (`[at]`/`[dot]`) y sin `mailto:`. Frena a los scrapers que **no** ejecutan
  JavaScript; los que sí lo ejecutan la leen del DOM igualmente
- Enlaces externos con `rel="noopener noreferrer"`

### Code Quality
- **Type Safety** completo con TypeScript 5
- **Clean Code**: Estructura modular y componentes reutilizables
- **Responsive**: Mobile-first design
- **Animations**: Smooth animations con Framer Motion 12
- **Accesibilidad**: contraste AA verificado en botones, badges y texto de acento;
  `prefers-reduced-motion` respetado también en el texto animado; skip link y foco
  visible. **No hay auditoría completa todavía** — pendiente axe en CI (T2-09)
- **SEO**: Meta tags optimizados y estructura semántica

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

**Ricky Angel Jiménez Bueno**
<!-- - Portfolio: [tu-portfolio.com](https://tu-portfolio.com) -->
- LinkedIn: [linkedin.com/in/tu-perfil](www.linkedin.com/in/ricky-angel-jimenez-bueno-52659928a)
- GitHub: [github.com/tu-usuario](https://github.com/xfiberex)
- Email: rickyjimenez1820@gmail.com

## 🙏 Agradecimientos

- [React](https://reactjs.org/) - Biblioteca de JavaScript
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons
- [Lucide](https://lucide.dev/) - Beautiful & consistent icon toolkit

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!