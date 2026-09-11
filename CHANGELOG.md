# Changelog

Todos los cambios relevantes de este proyecto se documentan aquí.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto se
adhiere a [Versionado Semántico](https://semver.org/lang/es/).

Para saber **por qué** se tomó una decisión, ver [CONTEXT.md](CONTEXT.md).
Para saber **qué falta**, ver [ROADMAP.md](ROADMAP.md).

> ⚠️ **Reconstrucción aproximada hasta la 2.0.0.** Las versiones de abajo se reconstruyeron a
> partir del historial de commits el 2026-09-08: las fechas son reales, pero los números de 0.1.0,
> 1.0.0 y 1.1.0 son una propuesta retrospectiva y no tienen tag. **`v2.0.0` sí está etiquetada**
> (2026-09-11, sobre `710f799`, el último commit del 2026-09-07). A partir de aquí, cada versión
> publicada se etiqueta (tarea **T2-21**).

---

## [Sin publicar]

### Añadido

- **Tema claro y conmutador**, con la preferencia del sistema como valor por defecto y
  `localStorage` cuando eliges tú. El tema se resuelve en un script inline del `<head>`,
  antes del primer pintado: **destello cero**, comprobado midiendo la luminancia de los 68
  fotogramas de una carga a 4G lento con la CPU a un cuarto. El CSP sigue sin
  `unsafe-inline`; el script se autoriza por hash sha256 y un test recalcula ese hash para
  que no pueda desincronizarse sin que nadie se entere.
- **Los 17 tokens del tema claro** salen de resolver la luminosidad que iguala el contraste
  que ya tenía el tema oscuro, no de elegir grises. La calculadora se validó antes contra
  los ratios que el propio repositorio había medido en T1-01. axe pasa en los dos temas y
  ninguna pareja de contraste se aleja más del 4 % de su equivalente oscura.
- **Prettier con paso propio en CI** (`npm run format` / `format:check`). `printWidth: 120`
  se eligió midiendo los anchos reales del repositorio (p90 = 79, p99 = 192), no por
  defecto. Los `.md` quedan **fuera a propósito**: ROADMAP y CONTEXT están maquetados a
  mano y Prettier reflota sus tablas. Validado por mutación: con un archivo mal formateado
  el paso sale con 1.
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
- **Prerender del HTML en el build**: la página llega pintada desde el servidor y React solo
  la hidrata, en vez de construirla desde cero al arrancar. **FCP y LCP reales bajan un 45 %**
  a 4G lento con la CPU a un cuarto (1924 → 1060 ms), medido con cuatro medianas de tres
  corridas por configuración. Lighthouse puntúa un punto menos porque simula la descarga del
  documento, que crece 18 kB; el navegador real dice lo contrario y es el que manda.
  El build falla si el correo literal se cuela en el HTML generado.
- **`public/llms.txt`**: resumen del portafolio para herramientas automatizadas —perfil, los
  dos CV, proyectos con su stack y enlaces—, con el email ofuscado como en el `<noscript>`.
  Lo revisa el verificador de enlaces, porque repite las rutas de los CV.

### Cambiado

- **Competencias con jerarquía**: Frontend y Backend destacados como «Stack principal»; el
  resto en texto, y Principios como lista en vez de etiquetas. En escritorio, tres columnas
  sin huecos que cierran en un rectángulo. La sección mide un 38 % menos en escritorio y un
  23 % menos en móvil.
- **Certificados en una sola tarjeta** con una fila por curso, en lugar de cinco tarjetas
  idénticas: −27 % de alto en escritorio y −29 % en móvil.
- **Las tarjetas de proyecto destacadas muestran como mucho 4 features** («+N más en el
  repositorio»). El hueco bajo las etiquetas pasa de 134 px a 49 px como máximo.
- **Títulos alineados en los destacados**: un título en dos líneas ya no baja su subtítulo
  28 px respecto a los vecinos.
- **El hueco bajo el texto animado del Hero es exacto**: la reserva se mide en alturas de
  línea (`lh`) y coincide al píxel con la frase más larga en cada ancho. Antes sobraban 9 px
  en móvil y 20 px en escritorio.
- **Título y descripción coherentes entre `<title>`, `description` y Open Graph**: eran
  cuatro textos distintos con dos guiones distintos. Se unificó en «MERN/PERN» tras
  comprobar en los datos que es lo cierto —PostgreSQL en tres proyectos— y no «MERN stack».
- **`TechIcon` pasa de 550 a 74 líneas**, partido en datos
  (`src/data/tech-icons.ts`), resolución (`src/lib/tech-icons.ts`) y componente. Con ello
  desaparecen los dos `eslint-disable` de `react-refresh` que hacían falta solo porque un
  archivo de componente exportaba funciones. Verificado que no cambia ni un color ni un
  dibujo: misma huella de 89 nombres antes y después.
- **El README describe lo que existe**: ESLint 10 y no 9, sin instrucciones de EmailJS ni de
  variables de entorno que el proyecto no usa, y sin una guía de GitHub Pages que perdería
  todas las cabeceras de `netlify.toml`. Añadida una tabla que dice a qué pregunta responde
  cada documento y qué hace cada workflow.
- **«Agradecimientos» pasa a «Licencias de terceros»**, con las 8 licencias leídas de
  `node_modules` y no de memoria. Fuera Heroicons, que se agradecía sin usarse.
- **Limpieza de `TechIcon`**: 15 ramas regex que **nunca podían ejecutarse** —tapadas por
  una regla anterior más general— y 4 alternativas redundantes. Verificado capturando la
  resolución de icono y color de 89 nombres antes y después: idéntica.
- **`ObfuscatedEmail` desaparece.** Prometía revelar el correo bajo demanda, pero sus dos
  únicos usos pasaban render prop y uno ya lo pintaba en claro, así que el estado y la rama
  de render por defecto nunca se ejecutaban. Contact ensambla el correo con `buildEmail`. La
  protección que sí era real —que el literal no exista en el HTML ni en el bundle— queda
  fijada por un test.
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

- **Dos datos no coincidían con el CV.** La carrera empezaba en 05/2019 en el portafolio y en
  01/2019 en el CV, y el gestor de tareas en Blazor figuraba con .NET 9 cuando usa .NET 10.
  Se tomó el CV como fuente de verdad.
- **Dependencias**: `npm audit fix` sin cambios mayores; producción pasa a 0
  vulnerabilidades. Las 12 restantes son todas de `@lhci/cli`, solo de desarrollo, y su
  código vulnerable no se ejecuta en este uso (detalle en ROADMAP, T4-01).
- **Prueba intermitente de accesibilidad.** La guarda que impide que axe audite contenido
  invisible fallaba 1 de cada ~4 veces bajo carga: la espera daba la página por revelada
  mientras la animación de opacidad de Contacto aún terminaba. Ahora espera a que no quede
  ninguna animación en marcha. Bajo carga: 120 de 120. Y cuando falle dirá qué elementos,
  no solo cuántos.
- **CI no guardaba nada útil cuando fallaba una prueba de navegador.** Subía
  `playwright-report/`, que en CI nunca se genera (el reporter es `github` + `list`), y la
  traza se grababa solo en el reintento, es decir, en el intento que pasa. Ahora se graba la
  traza de todo intento fallido y se sube `test-results/` tras cada paso de Playwright,
  también cuando una prueba sale «flaky» y el job termina en verde.
- **El `theme-color` no correspondía a ningún color del sitio.** Declaraba `#1a1c22` cuando
  el fondo real es `#080c11`, así que la barra del navegador móvil se pintaba más clara que
  la página. Ahora, además, sigue al tema.
- **El velo del visor de imágenes no aislaba en tema claro.** Medido como desviación de
  luminancia sobre la franja del velo: 7.47 frente a 2.43 en oscuro, tres veces más
  contenido colándose. Igualada la opacidad a la del tema oscuro: 2.41.
- **Las anclas de sección dejaban 1px tapado bajo la barra.** Un solo token,
  `--spacing-header`, hacía dos trabajos incompatibles: el alto del `<nav>` (4rem) y el
  offset de scroll, que debe contar también el `border-b` del `<header>` (65px). Separado
  en dos tokens; solape medido antes y después: 1px → **0**.
- **El `<body>` no tenía fondo propio** (computaba `rgba(0, 0, 0, 0)`): el color lo ponía un
  `div` interior y el lienzo lo salvaba `color-scheme: dark`.
- **Redacción**: «agentes IA» → «agentes **de** IA», «enfoque en performance» → «en
  rendimiento», «Sistema de Ventas WEB» → «Web», y la errata «Porfolio» del nombre de un
  archivo de imagen.
- **El comando de Docker del README no funcionaba en Git Bash**: sin `MSYS_NO_PATHCONV=1`
  traduce `-w /work` a una ruta de Windows y docker lo rechaza. Probado.
- **Los marcadores de posición del README** (`tu-usuario`, `tu-perfil`) y el enlace de
  LinkedIn **sin esquema**, que GitHub resolvía como ruta relativa y llevaba a un 404. El
  verificador de enlaces no podía detectarlo —LinkedIn está excluido y un destino sin
  esquema no es una URL http—, así que ahora lo cubre un test propio sobre los `.md`.
- **El wordmark no recibía `aria-current`** aunque «Inicio» fuera la sección activa, porque
  `navItems` no incluye `home`. Quien navega con lector de pantalla no tenía forma de saber
  dónde estaba al principio de la página.
- **Los dos `<button>` de Contacto no declaraban `type="button"`**, así que dentro de un
  `<form>` habrían hecho submit.
- **Contacto duplicaba a mano el markup de `SectionHeader`** en lugar de usar el componente,
  y había divergido en espaciado respecto a las otras seis secciones.
- Eliminado el centinela mágico `project.demo === "#"`, que ya no correspondía a ningún dato.
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

### Seguridad

- El CSP ya no acepta imágenes de cualquier origen HTTPS: `img-src 'self' data:`. Todas las
  imágenes del sitio son propias.
- `X-XSS-Protection` pasa de `1; mode=block` a `0`, la recomendación actual: el auditor de
  XSS ya no existe en los navegadores modernos y en los antiguos podía abrir fugas.
- La cabecera HSTS de `netlify.toml` declara ahora lo que Netlify sirve de verdad (1 año, no
  2), en vez de un valor que el hosting reescribía sin avisar.

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

[Sin publicar]: https://github.com/xfiberex/portafolio-web-rajb/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/xfiberex/portafolio-web-rajb/releases/tag/v2.0.0
