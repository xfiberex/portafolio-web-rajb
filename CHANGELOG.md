# Changelog

Todos los cambios relevantes de este proyecto se documentan aquí.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto se
adhiere a [Versionado Semántico](https://semver.org/lang/es/).

Para saber **por qué** se tomó una decisión, ver [CONTEXT.md](CONTEXT.md).
Para saber **qué falta**, ver [ROADMAP.md](ROADMAP.md).

> ⚠️ **Reconstrucción aproximada.** El repositorio **no tiene ningún tag de git**, pese a que
> `package.json` declara `version: 2.0.0`. Las versiones de abajo se reconstruyeron a partir del
> historial de commits el 2026-09-08: las fechas son reales, los números de versión son una
> propuesta retrospectiva y nunca se publicaron como release. A partir de la próxima versión hay
> que etiquetar de verdad (tarea **T2-21**).

---

## [Sin publicar]

### Añadido

- **Error boundary** (`src/components/ui/ErrorBoundary.tsx`). Sin él, una excepción en cualquier
  componente dejaba la página en blanco y sin mensaje. El fallback no importa Framer Motion,
  lucide-react ni componentes propios: lo que se pinta cuando la UI se rompe no debe depender de
  la UI rota. Cubre el árbol de componentes, **no** los errores de importación ni de `main.tsx`.
- **`<noscript>`** en `index.html` con nombre, rol, email ofuscado y enlaces a CV, GitHub y
  LinkedIn. Sin JavaScript la página pasa de **0 a 268 caracteres** visibles.
- **`public/robots.txt`** y **`public/sitemap.xml`**, con el `Content-Type` del sitemap declarado
  en `netlify.toml` en vez de depender del MIME por defecto de Netlify.
- **Inter auto-hospedada** en `public/fonts/` (fuente variable, subsets `latin` y `latin-ext`) con
  `@font-face` y `<link rel="preload">`. Licencia SIL OFL incluida.
- **`public/og-image.jpg`** 1200×630 para las tarjetas sociales, más `og:image:width/height`.
- **`usePrefersReducedMotion`** (`useSyncExternalStore` sobre `matchMedia`).
- **`src/lib/contact.ts`**: email y rutas de los CV en un solo sitio. El nombre de los PDF lleva la
  fecha dentro, así que duplicarlos garantizaba enlaces rotos al actualizarlos.
- **`scripts/images-to-webp.mjs`** y `npm run images:webp` (dependencia nueva: `sharp`).

### Cambiado

- **Contraste WCAG AA.** El acento se separó en dos tokens porque cumplía dos papeles con
  requisitos opuestos: `--value-primary` (62.8 %, acento sobre superficie oscura) y
  `--value-primary-strong` (56 %, relleno de botón). Botones **3.45 → 4.56:1**, estado *hover*
  **4.42 → 5.91:1**, badge de Educación **4.43 → 4.66:1**.
- **Capturas de proyecto a WebP**: **1123 kB → 291 kB (-74 %)**, sin respaldo PNG.
- **`useScrollspy`** cachea la geometría de la página en vez de leer `scrollHeight` en cada frame
  de scroll: coste de lecturas de layout **740.6 ms → 0.5 ms** (móvil, Slow 4G, CPU 4×).
- **CSP** cerrado a `style-src 'self' 'unsafe-inline'` y `font-src 'self'` al desaparecer Google
  Fonts. Cero peticiones a terceros.
- Requisito de Node en el README: de «18 o superior» a **≥ 20.19 (recomendado 22)**, que es lo que
  exigen Vite 7 y ESLint 10 y lo que ya usaban CI y Netlify.

### Corregido

- **El texto animado del Hero ignoraba `prefers-reduced-motion`** (WCAG 2.2.2, nivel **A**).
  Ninguna regla CSS podía pararlo: `react-type-animation` teclea con `setTimeout`. Ahora se
  renderiza texto fijo. Efecto colateral: con movimiento reducido el CLS pasa a ser exactamente 0.
- **Soft 404 en todo el dominio.** El fallback SPA `/* → /index.html 200` estaba declarado dos
  veces y el sitio no usa router. Cualquier ruta inexistente devolvía 200 con la página completa.
- **Los deploy previews servían la build de desarrollo de React** (66 % más de JS), así que
  cualquier medición sobre una URL de preview medía otra aplicación.
- **Ocho afirmaciones falsas del README**, entre ellas «code splitting» (no hay ningún `import()`
  dinámico), «cumple WCAG 2.1» y «formulario de contacto» (no existe ningún `<form>`).

### Eliminado

- `public/_redirects` y el bloque `[[redirects]]` de `netlify.toml`.
- Dos capturas huérfanas (0.58 MB) que ya no referenciaba ningún proyecto pero se seguían
  publicando.
- `--value-primary-hover`, que solo usaban los botones ahora migrados a `primary-strong`.

### Interno

- Auditoría técnica completa de las 13 áreas, con verificación sobre la aplicación desplegada
  (Chrome DevTools + Lighthouse) además de la revisión de código. Se midieron por primera vez
  Core Web Vitals, contraste real, áreas táctiles, peso de bundle y comportamiento con
  `prefers-reduced-motion`. Ver el registro de sesión en [CONTEXT.md](CONTEXT.md).
- `docs/BACKLOG.md` migrado a [ROADMAP.md](ROADMAP.md) en la raíz, renumerado al esquema
  `T{tier}-{nn}` por severidad. 27 tareas heredadas + 33 nuevas.
- Añadidos [CHANGELOG.md](CHANGELOG.md) y [CONTEXT.md](CONTEXT.md).
- Capturas de evidencia de la auditoría en `docs/auditoria-2026-09-08/`.
- **Dos diagnósticos de la auditoría resultaron incorrectos al aplicarlos** y están corregidos en
  `CONTEXT.md`: la solución prescrita para el contraste habría roto `text-primary`, y el reflow
  forzado venía del scrollspy, no de Framer Motion.

> **Pendiente de verificar en un deploy preview** (no se puede en local): tamaño del bundle en
> preview, 404 real, Lighthouse SEO = 100 y `Content-Type: application/xml` del sitemap.
---

## [2.0.0] — 2026-09-07

Revisión completa del contenido para alinearlo con el CV actualizado, y rediseño del sistema de
estilos sobre tokens semánticos.

### Añadido

- Dos proyectos nuevos en el portafolio: **TrackerMultimedia** (ASP.NET Core 10 + React 19) y
  **Stockly** (Express 5 + React), con sus capturas.
- Visor de imagen a pantalla completa (*lightbox*) para las capturas de proyecto, con soporte
  completo de teclado: Escape para cerrar, foco atrapado dentro del diálogo y devuelto al botón
  que lo abrió.
- Enlace "Saltar al contenido" para quien navega con teclado.
- Metadatos para compartir en redes: Open Graph, Twitter Card, URL canónica y datos estructurados
  `schema.org/Person`. Antes, compartir el portafolio en LinkedIn o X mostraba solo la URL pelada.
- Indicador de sección activa en la navegación, que sigue el desplazamiento de la página.
- Segunda versión del CV en formato compatible con sistemas de selección automatizados.

### Cambiado

- Las secciones de Experiencia, Educación, Competencias y Sobre mí se reescribieron para reflejar
  la trayectoria actual.
- La sección de Proyectos ahora separa "Destacados" de "Otros proyectos", en lugar de mostrar un
  corte sin explicar.
- Los tamaños de los títulos se adaptan de forma continua al ancho de la pantalla, en vez de saltar
  entre puntos fijos.
- El texto animado del Hero ya no desplaza el contenido de abajo cada vez que cambia de frase.

### Corregido

- El menú móvil ya no desplaza las secciones al abrirse y cerrarse, así que los enlaces del menú
  llevan al sitio correcto.
- Los enlaces de las secciones aterrizan en el lugar correcto en lugar de quedar tapados por la
  barra de navegación.
- Las imágenes que no cargan muestran una imagen de reemplazo en vez de un icono roto.

### Eliminado

- Dos proyectos archivados que ya no estaban disponibles.
- La entrada de "proyectos propios" de la sección de Experiencia, que duplicaba lo que ya cuenta
  la sección de Proyectos.

### Interno

- Componentes duplicados unificados: las dos tarjetas de proyecto pasaron a ser un solo
  `ProjectCard`; la fila de enlaces, `ProjectLinks`; los tags, `TechTags`; los encabezados de
  sección, `SectionHeader`.
- Sistema de animación centralizado en `src/lib/animations.ts`. Antes cada sección redeclaraba sus
  propias variantes (5 copias).
- Sistema de diseño reorganizado en dos capas (valores crudos en `:root`, capa semántica en
  `@theme inline`) para que añadir un tema claro sea un bloque de overrides y no un refactor.
- `toAssetUrl` unificado en `src/lib/assets.ts`; antes estaba duplicado en `Hero.tsx` y
  `Projects.tsx` con implementaciones distintas.

---

## [1.1.0] — 2026-07-29

Infraestructura de calidad: el proyecto pasa a validarse solo.

### Añadido

- Integración continua (`ci.yml`): chequeo de tipos, lint y build de producción en cada push y
  cada pull request.
- Verificación semanal de enlaces externos (`links.yml`): comprueba repositorios, demos y
  certificados, y abre un issue si alguno se cae. *El peor fallo posible de un portafolio es un
  reclutador haciendo clic en una demo caída.*
- `docs/BACKLOG.md` con el trabajo pendiente organizado por tiers.

### Corregido

- **El proyecto no compilaba.** `package.json` declaraba ESLint 10 con un plugin incompatible y el
  lock tenía una combinación imposible de resolver. Se regeneró el lock, se actualizó la ruta del
  flat config y se fijó Node 22 en Netlify para no depender del valor por defecto.
- El verificador de enlaces revisaba 3 de 23 enlaces: al pasarle un directorio, `lychee` filtraba
  por extensión conocida y se saltaba los `.ts`, es decir, todos los enlaces a repositorios, demos
  y certificados. Pasaba en verde sin comprobar nada.
- Los iconos duplicados en la sección de Competencias ya no se anuncian dos veces a los lectores
  de pantalla (`TechIcon` acepta ahora la propiedad `decorative`).

---

## [1.0.0] — 2026-02-27

Migración a TypeScript y endurecimiento de la seguridad.

### Añadido

- Cabeceras de seguridad HTTP en Netlify: política de seguridad de contenido (CSP), HSTS,
  protección anti-clickjacking, política de permisos y políticas cross-origin.
- Validación de las URLs externas antes de renderizarlas, para bloquear esquemas peligrosos como
  `javascript:` y `data:`.
- Licencia MIT.
- Ofuscación del email de contacto.

### Cambiado

- Todo el código migrado de JavaScript a TypeScript, con los datos del portafolio tipados
  (`projects.ts`, `skills.ts`, `experience.ts`, `education.ts`, `certificates.ts`).
- Los enlaces externos abren en pestaña nueva con `rel="noopener noreferrer"`.

### Corregido

- Los CV volvieron a estar disponibles para descarga (habían quedado deshabilitados mientras se
  actualizaban).

---

## [0.1.0] — 2025-10-08

Primera versión pública del portafolio.

### Añadido

- Portafolio de una sola página con las secciones Inicio, Sobre mí, Proyectos, Experiencia,
  Competencias, Educación, Certificados y Contacto.
- Construido con React, Vite y Tailwind CSS, con animaciones de Framer Motion y texto animado en
  la presentación.
- Publicado en Netlify.

---

[Sin publicar]: https://github.com/xfiberex/portafolio-web-rajb/compare/main...HEAD
[2.0.0]: https://github.com/xfiberex/portafolio-web-rajb/commits/main
