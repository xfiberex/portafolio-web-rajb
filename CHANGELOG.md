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

- **Snapshots visuales** del pliegue a 375/768/1440 (`npm run test:visual`), comparación
  exacta y sin tolerancia. Corren en CI con líneas base de Linux generadas en el contenedor
  oficial de Playwright; las de Windows se conservan para trabajar en local. Verificados con
  tres corridas idénticas en cada plataforma.
- **`npm run analyze`**: `rollup-plugin-visualizer` detrás de `vite build --mode analyze`, así
  que no entra ni en el build normal ni en CI. Informe y decisión en
  [docs/analisis-bundle-2026-09-09.md](docs/analisis-bundle-2026-09-09.md).
- **`npm run medir:lcp`**: mide FCP, LCP y CLS del build registrando **cada candidato** de LCP
  y tomando la mediana de 3 corridas. Con `-- --lento`, a 4G lento y CPU ×4.
- **Presupuestos de rendimiento que fallan el build** (`lighthouserc.json` + paso en CI).
  Accesibilidad, SEO y buenas prácticas tienen que seguir en **100**; LCP ≤ 2,5 s, CLS ≤ 0,1,
  TBT ≤ 300 ms y el JS transferido ≤ 160 kB. Los umbrales salen de una línea base medida, no
  de valores por defecto, y se validaron rompiéndolos a propósito uno por uno.
- **Resumen de Lighthouse en el log de CI** (`scripts/resumen-lighthouse.mjs`): una línea con
  las cuatro puntuaciones, LCP, TBT, CLS, peso del JS y **qué elemento** es el LCP, con su
  umbral al lado. Sin esto, `lhci` en verde no imprime ningún número y el margen contra los
  presupuestos solo se conocería el día que rompan.

- **Los primeros tests del repositorio**: 93 unitarios con Vitest, integrados en CI antes del build.
  Solo funciones puras, que es donde está el valor: la resolución de iconos (~90 heurísticas
  regex donde el orden importa) y los helpers de URL. El test de tabla recorre los 78 tags
  reales de `src/data/` y **falla si se añade una tecnología sin icono** — hasta ahora ese
  fallo era silencioso: salía el glifo genérico y nadie se enteraba.
- **Red de pruebas de comportamiento (18 e2e)**: Playwright congela lo que hasta ahora solo
  se había verificado a mano — el ciclo de foco del lightbox (que es un diálogo modal escrito
  a mano, no un `<dialog>` nativo), el menú móvil, el skip link, `aria-current`, cero scroll
  horizontal a 320/360/768/1280/1440 y `prefers-reduced-motion`. Este último **cierra la
  reserva de T1-02**: en su día hubo que parchear `matchMedia` a mano porque la herramienta
  no emulaba la preferencia; Playwright sí la emula. Los cinco bloques se validaron
  **rompiendo el código a propósito** para comprobar que fallan cuando deben.
- **Accesibilidad automatizada en CI**: Playwright + `@axe-core/playwright` audita el build con
  la página completamente revelada — **1586 nodos, 37 reglas**— y falla ante cualquier violación
  *serious* o *critical*. Un test previo se niega a auditar si queda algo a opacidad < 1, porque
  entonces axe mezcla los colores con el fondo y el resultado no significaría nada.
- **`browserslist`** en `package.json`: Chrome/Edge 111, Safari/iOS 16.4, Firefox 128. El
  mínimo lo fija Tailwind CSS 4; no es una elección del proyecto.
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

- **El Hero pasa de 8 acciones a 5, y de tres filas a una.** Los dos CV se funden en un solo
  control «Descargar CV» —un `<details>` nativo, con Escape y clic fuera añadidos a mano— y
  sus etiquetas dejan la jerga: «CV-ATS» ahora es **«CV en texto plano (ATS)»**. GitHub y
  LinkedIn pasan a iconos de 44×44 con borde y nombre accesible, en la misma fila, y
  `Contactar` baja de `border-2` a `border`.
- **El wordmark «Inicio» pasa a un monograma RAJB + «Ricky Jiménez».** Era el sitio de mayor
  jerarquía de marca de la página y estaba gastado en una palabra genérica. El nombre va
  escrito, y no solo las iniciales, porque quien llega a una sección interna por un enlace
  directo no ve el `<h1>`.
- **Tarjeta social propia** de 1200×630 en vez del recorte de la captura del portafolio,
  generada con la tipografía y los tokens reales del sitio.
- `summary` se añade al selector de `:focus-visible`, donde faltaba.

- **El `<h1>` del Hero ya no anima y `staggerContainer` solo orquesta.** El nombre aparece de
  inmediato y el resto del Hero sigue entrando en cascada a su alrededor. **LCP 748 → 108 ms**
  (−86 %); a 4G lento con CPU ×4, 2008 → 1656 ms, donde ya coincide con el FCP. El motivo es
  que el LCP se registra cuando la animación **termina**, así que la duración de la entrada
  del elemento LCP se suma entera — y las animaciones anidadas se encadenan: quitar solo una
  de las dos no cambiaba nada. En móvil el elemento LCP resultó ser otro —el párrafo de
  descripción, no el `<h1>`—, así que el bloque de rol y descripción también dejó de animar:
  LCP móvil **2292 → 1624 ms**.

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

- **El resumen de Lighthouse anunciaba el doble de corridas de las que hubo** (decía «mediana
  de 6» con 3). `lhci` deja cada informe **dos veces** —el crudo en `.lighthouseci/` y una
  copia en el `outputDir`— y el script los contaba por archivo. La mediana era correcta
  igualmente, porque los duplicados van en pares, pero el número mentía. Deduplicado por
  `fetchTime`.
- **`npm run images:webp -- --clean` borraba el PNG original sin comprobar nada.** Ahora solo
  lo borra si el WebP existe y **es más pequeño**; si no, lo conserva, lo dice y sale con
  código 1. Con capturas de pocos colores el WebP puede salir mayor, y ahí el PNG es la
  versión buena: borrarlo perdía calidad y espacio a la vez, y no tiene vuelta atrás.
- **`npm run medir:lcp` solo medía en escritorio**, que es justo cómo se me coló el LCP móvil
  en T2-23. Nueva bandera `--movil` (412×823). Y el navegador se cierra en un `finally`: si
  `evaluate` lanzaba, quedaba un Chromium huérfano ocupando el puerto.

- **El diagnóstico del LCP que arrastraban tres tareas del ROADMAP.** Se repetía que «el 98 %
  del LCP es esperar a que React arranque». Midiendo *cada candidato* de LCP en vez de solo el
  final: el navbar ya está pintado a los **108 ms**, y lo que retrasa el `<h1>` hasta los
  776 ms es la animación de entrada del Hero. Con las duraciones a cero, LCP **148 ms (−81 %)**.
  Corregidas las premisas de T2-06, T2-08 y T4-04, y abierta T2-23 para la causa real.

- **Los iconos de Jest y TanStack Query**, que caían al glifo genérico. Las ocurrencias con
  icono de respaldo bajan de **14 a 8 sobre 109**. Las 8 restantes son deliberadas y están en
  una lista que el test comprueba exacta: seis son competencias sin logotipo posible, y
  Playwright y Supertest no tienen marca en el set CC0 del que salen los demás.
- **El PDF del CV se servía con cache `immutable` a un año.** Los JS y CSS de Vite llevan hash
  de contenido y lo aguantan; los PDF comparten carpeta con ellos pero no llevan hash, así que
  actualizar un CV conservando el nombre habría dejado a quien ya lo descargó con el viejo
  durante un año. Las reglas de `netlify.toml` pasan a ir por extensión y a no solaparse entre
  sí, en vez de depender de una precedencia que Netlify no documenta.

- **El icono de WinForms nunca se mostraba**: la regla era `/windows.*forms/i` y el dato dice
  `"WinForms"`, que no contiene «windows». El icono existía desde el principio.
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

- El verificador de enlaces (`links.yml`) ahora cubre `README.md`, `ROADMAP.md`, `CONTEXT.md`,
  `CHANGELOG.md` y `docs/**/*.md`: las URLs vigiladas pasan de 21 a 42.
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
