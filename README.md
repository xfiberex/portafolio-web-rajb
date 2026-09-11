# 🚀 Portfolio Web - Ricky Angel Jiménez Bueno

Un portafolio web moderno, seguro y responsivo construido con las últimas tecnologías web. Este proyecto presenta mis habilidades, experiencia, proyectos y certificaciones de manera profesional e interactiva, con un enfoque en rendimiento, seguridad y experiencia de usuario.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.0+-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0+-38bdf8?logo=tailwindcss&logoColor=white)
![Security](https://img.shields.io/badge/Security-A+-success?logo=netlify&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

![Portafolio-web-rajb](public/projects/Portfolio-web-rajb.webp)

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
- **ESLint 10** - Linter moderno para TypeScript/React
- **typescript-eslint** - Parser y reglas para análisis de archivos TypeScript/TSX
- **Vite Plugin React** - Plugin oficial optimizado para React

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js **20.19+** o **22.12+** (recomendado: 22, la versión que usan CI y Netlify)
- npm o yarn

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/xfiberex/portafolio-web-rajb.git
   cd portafolio-web-rajb
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

# Tema: el sitio arranca en el tema del sistema y recuerda tu eleccion.
# El script que lo resuelve va inline en index.html porque tiene que
# correr antes del primer pintado; el CSP lo autoriza por hash sha256.
# Si tocas ese script, `npm test` recalcula el hash y falla hasta que lo
# actualices en netlify.toml. No lo saltes: sin eso el fallo aparece por
# primera vez en produccion, con la pagina en blanco.

# Formato (Prettier). CI corre `format:check`, que falla si algo esta sin
# formatear. Los .md quedan fuera a proposito: ROADMAP y CONTEXT estan
# maquetados a mano y Prettier reflotaria sus tablas.
npm run format
npm run format:check

# Tests unitarios (Vitest). Solo funciones puras; corre tambien en CI
npm test
npm run test:watch

# End-to-end (Playwright) sobre el build: accesibilidad con axe-core, ciclo de foco
# del lightbox, menu movil, skip link, cero scroll horizontal y movimiento reducido
npm run build && npm run test:e2e

# Snapshots visuales del pliegue a 375/768/1440 (comparacion EXACTA)
npm run test:visual

# Presupuestos de Lighthouse: falla si a11y/SEO/buenas practicas bajan de 100,
# si el LCP pasa de 2,5 s o si el JS transferido pasa de 160 kB. Corre en CI.
npm run lighthouse

# Medir FCP/LCP/CLS del build (requiere `npm run preview` en otra terminal)
npm run medir:lcp
npm run medir:lcp -- --lento    # 4G lento + CPU x4
npm run medir:lcp -- --movil    # viewport 412x823: el elemento LCP cambia con el ancho

# Analizar el bundle: genera stats.html (treemap). Ver T2-06
npm run analyze

# Convertir a WebP las capturas nuevas de public/projects/
# (se corre a mano al añadir una captura, no en cada build)
npm run images:webp
npm run images:webp -- --clean   # y borra los PNG de origen, solo si el WebP salio menor
```

## 🌐 Navegadores soportados

| Navegador | Mínimo |
|---|---|
| Chrome / Edge | **111** (marzo 2023) |
| Safari / iOS Safari | **16.4** (marzo 2023) |
| Firefox | **128** (julio 2024) |

Declarado en `browserslist` (`package.json`). El mínimo **lo fija Tailwind CSS 4**, que depende de
`@property` y `color-mix()` y no funciona por debajo de esos números; no es una elección del
proyecto. Por eso tampoco hay respaldo PNG para las imágenes WebP: cualquier navegador de este
rango las soporta desde hace años.

> Ojo: ni Vite ni Tailwind leen ese `browserslist` — Tailwind tiene sus objetivos fijos y Vite usa
> su propio `build.target`. Sirve para **declarar el soporte**, que es lo que permite decidir si un
> fallo reportado es un bug o un navegador fuera de alcance.

## 🖼️ Snapshots visuales

`npm run test:visual` compara el pliegue a 375/768/1440 contra imágenes de referencia, **pixel a
pixel y sin tolerancia**. Corren aparte de `npm run test:e2e` a propósito: son la única parte de
la suite que depende de la plataforma.

Las líneas base llevan el sistema en el nombre (`pliegue-1440-chromium-linux.png` frente a
`-win32.png`) porque el renderizado de fuentes difiere lo bastante entre sistemas como para que
una imagen de Windows nunca case en Linux. Hay **las dos**: las de Windows para trabajar en
local, las de Linux porque es lo que corre CI.

**Cuando cambies el diseño a propósito**, el paso de CI fallará hasta que regeneres las dos:

```bash
# 1. Las de tu maquina
npm run test:visual:update

# 2. Las de Linux, en el contenedor oficial de Playwright (misma version que
#    @playwright/test). El volumen sobre node_modules es OBLIGATORIO: sin el,
#    el `npm ci` de dentro pisa los binarios de Windows y rompe tu entorno.
#    MSYS_NO_PATHCONV: sin el, Git Bash traduce `-w /work` a una ruta de
#    Windows y docker rechaza el comando. Probado.
MSYS_NO_PATHCONV=1 docker run --rm -v "$(pwd -W):/work" -v /work/node_modules -w /work \
  mcr.microsoft.com/playwright:v1.63.0-noble \
  bash -c "npm ci && npm run build && npm run test:visual:update"
```

Si el fallo **no** era intencionado, el informe con las tres imágenes —esperada, obtenida y
diferencia— queda como artefacto de la corrida de CI.

## 📚 Documentación del proyecto

Este README explica **cómo usar** el proyecto. Lo demás vive en tres archivos con un
propósito distinto cada uno, y conviene no mezclarlos:

| Archivo | Responde a |
|---|---|
| [ROADMAP.md](ROADMAP.md) | **Qué falta.** 61 tareas con ID permanente, ordenadas por severidad, con criterio de aceptación y una nota de cierre que dice cómo se verificó. |
| [CONTEXT.md](CONTEXT.md) | **Por qué se decidió así.** Trampas encontradas, mediciones y decisiones con su razón. Antes de cambiar algo que parezca raro, mirar aquí. |
| [CHANGELOG.md](CHANGELOG.md) | **Qué cambió**, en formato Keep a Changelog. |

### Integración continua

Dos workflows en [`.github/workflows/`](.github/workflows/):

- **CI** (`ci.yml`) — en cada push y PR a `main`. Tipos → lint → unitarios → build →
  accesibilidad con axe-core → snapshots visuales → presupuestos de Lighthouse. Los
  presupuestos **fallan el build**, no solo informan.
- **Enlaces** (`links.yml`) — los lunes, y a mano desde la pestaña Actions. Revisa los
  enlaces externos de la documentación y del contenido, y abre un issue si alguno cae. No
  corre en cada PR a propósito: los enlaces externos flaquean por motivos ajenos al commit,
  y romper PRs por eso enseña a ignorar el CI.

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
├── e2e/                            End-to-end con Playwright (24 + 3 visuales)
│   ├── util/pagina.ts              Revelado de la página y detección de desbordes
│   ├── a11y.spec.ts                axe-core sobre la página revelada
│   ├── lightbox.spec.ts            Contrato de diálogo modal: foco, Tab, Escape, scroll
│   ├── navegacion.spec.ts          Menú móvil, skip link y `aria-current`
│   ├── responsive.spec.ts          Cero scroll horizontal a 320/360/768/1280/1440
│   ├── movimiento-reducido.spec.ts `prefers-reduced-motion` en los dos sentidos
│   └── visual.spec.ts              Snapshots del pliegue (npm run test:visual)
├── scripts/
│   ├── images-to-webp.mjs          Conversión con sharp (npm run images:webp)
│   ├── medir-lcp.mjs               FCP/LCP/CLS con cada candidato (npm run medir:lcp)
│   └── resumen-lighthouse.mjs      Una línea con las métricas, para el log de CI
├── src/
│   ├── components/
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx     Dos disposiciones: "featured" y "row"
│   │   │   └── ProjectLinks.tsx    Repo, ampliar, frontend, backend, demo
│   │   ├── ui/
│   │   │   ├── ErrorBoundary.tsx   Fallback cuando el árbol React revienta
│   │   │   ├── Lightbox.tsx        Visor modal con contrato de diálogo
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
│   │   ├── TechIcon.tsx            Colores de marca, rutas SVG y resolución por heurística
│   │   └── TechIcon.test.ts        Test de tabla: cada tag de src/data/ debe resolver
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
│   │   ├── assets.test.ts          Casos borde de ambos helpers
│   │   └── contact.ts              Email y rutas de los CV
│   ├── types/index.ts
│   ├── App.tsx
│   ├── index.css                   Design system en dos capas
│   └── main.tsx
├── index.html
├── playwright.config.ts
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

> **GitHub Pages no está soportado, y es a propósito.** Necesitaría fijar `base` en
> `vite.config.ts` y, sobre todo, perdería **todas** las cabeceras de `netlify.toml`: el CSP,
> el `Cache-Control` por tipo de archivo y el `Content-Type` del sitemap. Media docena de
> tareas del roadmap viven en ese archivo.

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

### Variables de entorno

**El proyecto no usa ninguna.** No hay `.env`, ni claves de API, ni backend: el botón de
contacto abre el cliente de correo con un `mailto:`. Si algún día hiciera falta, Vite solo
expone al frontend las variables con prefijo `VITE_`.

### Añadir Nuevas Secciones
1. Crea un nuevo componente TypeScript en `src/components/`
2. Define los tipos necesarios en `src/types/`
3. Importa y añade el componente en `App.tsx`
4. Actualiza la navegación en `Navbar.tsx`

## 📈 Características Técnicas

### Performance
- Build ultrarrápido con Vite 7
- Cache inmutable **solo** en lo que lleva hash de contenido (`/assets/*.js`, `/assets/*.css`)
  y en las fuentes, cuyo nombre se cambia al actualizarlas. Los PDF del CV comparten carpeta
  con el build pero **no** llevan hash, así que van a un día con `must-revalidate` (T2-20)
- Imágenes con `loading="lazy"` nativo
- **Sin code splitting, y es deliberado**: un único chunk de ~127 kB gzip. Medido con
  `npm run analyze`, dividirlo no ayudaría al LCP — `Hero.tsx` y `Navbar.tsx` importan Framer
  Motion, así que diferir lo de debajo del pliegue no lo sacaría del camino crítico. El
  razonamiento completo está en [docs/analisis-bundle-2026-09-09.md](docs/analisis-bundle-2026-09-09.md)

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
- Portafolio: [portafolio-web-rajb.netlify.app](https://portafolio-web-rajb.netlify.app)
- LinkedIn: [linkedin.com/in/ricky-angel-jimenez-bueno-52659928a](https://www.linkedin.com/in/ricky-angel-jimenez-bueno-52659928a)
- GitHub: [github.com/xfiberex](https://github.com/xfiberex)
- Email: rickyjimenez1820@gmail.com

## 📜 Licencias de terceros

Este proyecto es MIT. Todo lo que se distribuye con él lleva licencia compatible:

| Dependencia | Uso | Licencia |
|---|---|---|
| [React](https://react.dev/) y React DOM | Interfaz | MIT |
| [Vite](https://vite.dev/) | Build | MIT |
| [Tailwind CSS](https://tailwindcss.com/) | Estilos | MIT |
| [Framer Motion](https://motion.dev/) | Animaciones | MIT |
| [Lucide](https://lucide.dev/) | Iconos de interfaz | ISC |
| [react-type-animation](https://react-type-animation.netlify.app/) | Texto del Hero | MIT |
| [Inter](https://rsms.me/inter/) | Tipografía auto-hospedada | SIL OFL 1.1 |
| [simple-icons](https://simpleicons.org/) | Siluetas de Jest y TanStack Query | CC0 1.0 |

La licencia completa de Inter viaja con la fuente, en
[`public/fonts/LICENSE.txt`](public/fonts/LICENSE.txt), como exige la SIL OFL.

> Antes esta sección agradecía a **Heroicons**, que no se usa en ninguna parte del código, y
> no declaraba ni una licencia.

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!