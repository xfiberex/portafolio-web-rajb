# Contexto — Portafolio Web

Qué se decidió, por qué, y qué se aprendió. Este archivo existe para poder retomar el proyecto
meses después, o desde otro equipo y otra sesión de chat, sin perder nada de lo hablado.

**Reglas de mantenimiento** (aplican a este archivo):

- Se actualiza **en el mismo commit** que el cambio que documenta, para que el contexto viaje con
  el código.
- Las fechas son **siempre absolutas**. Nunca "ayer" ni "la semana pasada".
- Si una decisión se revierte, **no se borra**: se marca como superada y se explica qué la cambió.
- Ante la duda entre este archivo y `CHANGELOG.md`: el *qué* va al changelog, el *por qué* aquí.

---

## Estado

| | |
|---|---|
| **Repositorio** | https://github.com/xfiberex/portafolio-web-rajb |
| **Producción** | https://portafolio-web-rajb.netlify.app/ |
| **Versión declarada** | `2.0.0` en `package.json` — **sin ningún tag de git** (ver T2-21) |
| **Stack** | React 19.2 · TypeScript 5.9 · Vite 7.3 · Tailwind CSS 4.1 · Framer Motion 12.23 |
| **Node** | 22 en CI y en Netlify. Mínimo real: ≥ 20.19 (Vite 7 y ESLint 10) |
| **Despliegue** | Netlify, build `npm run build`, publica `dist/` |
| **Nº de pruebas** | **0.** No hay ningún archivo de test en el repositorio |
| **Build medido** | 382.32 kB JS (124.06 kB gzip) · 29.36 kB CSS (6.02 kB gzip) · un solo chunk |
| **Planificación** | [ROADMAP.md](ROADMAP.md) — 57 tareas abiertas, ninguna de Tier 0 |
| **Historial** | [CHANGELOG.md](CHANGELOG.md) |
| **Última actualización** | 2026-09-08 |

---

## Qué es

Portafolio personal de una sola página: presentación, trayectoria, proyectos, competencias,
educación, certificados y contacto. Es un **sitio estático puro**, renderizado en el cliente y
servido desde Netlify.

Lo que **deliberadamente no hace**, y conviene no proponerlo como si faltara:

- **No tiene backend, base de datos ni autenticación.** Todo el contenido vive en archivos
  TypeScript tipados dentro de `src/data/`.
- **No tiene router.** Es una sola página con anclas; no hay rutas que resolver.
- **No tiene formulario de contacto.** El contacto es un `mailto:` — así no hay que gestionar
  spam, ni un servicio de correo, ni datos personales de terceros.
- **No tiene cookies, analítica ni almacenamiento.** Verificado en la pestaña de red el
  2026-09-08: cero peticiones a terceros salvo la fuente Inter de Google.
- **No tiene internacionalización.** Está solo en español, y así se queda.

---

## Arquitectura

```
portafolio-web-rajb/
├── index.html                  Punto de entrada. Aquí viven title, meta, Open Graph,
│                               canonical y el JSON-LD de schema.org/Person.
├── netlify.toml                Build, cabeceras de seguridad, caché y redirects.
│                               Es la única capa de "servidor" del proyecto.
├── lychee.toml                 Config del verificador de enlaces (exclusiones deliberadas).
├── eslint.config.js            Flat config. No respeta .gitignore: las carpetas de
│                               herramientas IA se excluyen a mano.
├── public/
│   ├── assets/                 Los dos PDF del CV. ⚠️ Netlify les aplica cache immutable
│   │                           a un año (ver Trampas conocidas).
│   ├── projects/               Capturas de los proyectos.
│   ├── favicon.svg
│   ├── placeholder.svg         Imagen de reemplazo cuando falla la carga de una captura.
│   └── _redirects              Fallback SPA duplicado con netlify.toml. Ninguno hace falta.
├── src/
│   ├── main.tsx                Monta React. Envuelve la app en <MotionConfig reducedMotion=
│   │                           "user">, que solo cubre Framer Motion (ver Trampas conocidas).
│   ├── App.tsx                 Compone las 8 secciones en orden. Nada más.
│   ├── index.css               Design system. Dos capas a propósito: valores crudos en
│   │                           :root (--value-*) y capa semántica en @theme inline.
│   ├── components/
│   │   ├── Layout.tsx          Estructura global: skip link, gradiente, navbar, main, footer.
│   │   ├── Navbar.tsx          Navegación sticky, menú móvil y scrollspy.
│   │   ├── Hero.tsx            Portada. El texto animado usa react-type-animation.
│   │   ├── About/Experience/Skills/Education/Certificates/Contact.tsx
│   │   │                       Una sección cada uno; leen su archivo de src/data/.
│   │   ├── Footer.tsx
│   │   ├── TechIcon.tsx        541 líneas: 78 colores de marca, ~69 rutas SVG y ~90
│   │   │                       heurísticas regex que resuelven un nombre a un icono.
│   │   │                       Es el archivo más frágil del proyecto.
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx    Dos disposiciones: "featured" (grilla) y "row" (lista).
│   │   │   └── ProjectLinks.tsx   Fila de acciones: repo, ampliar, frontend, backend, demo.
│   │   └── ui/
│   │       ├── Section.tsx        Único responsable del ritmo vertical, el ancho de
│   │       │                      contenedor y el scroll-margin-top del navbar sticky.
│   │       ├── SectionHeader.tsx  h2 + subtítulo, con tamaños únicos para todas las secciones.
│   │       ├── SkipLink.tsx       Salta los 8 enlaces del nav. Invisible hasta recibir foco.
│   │       ├── TechTags.tsx       Lista de tecnologías, compartida por proyectos y competencias.
│   │       ├── Lightbox.tsx       Visor modal con el contrato completo de diálogo.
│   │       └── ObfuscatedEmail.tsx  ⚠️ Su rama de render por defecto es código muerto.
│   ├── data/                   Contenido del portafolio, tipado. Editar aquí, no en los
│   │                           componentes.
│   ├── hooks/useScrollspy.ts   IntersectionObserver + listener de scroll throttleado con rAF.
│   ├── lib/
│   │   ├── animations.ts       Variantes de Framer Motion. Fuente única de verdad.
│   │   └── assets.ts           toAssetUrl (BASE_URL) y safeExternalUrl (bloquea javascript:).
│   └── types/index.ts          Las 5 interfaces de datos.
├── docs/
│   ├── BACKLOG.md              Superado por ROADMAP.md el 2026-09-08.
│   └── auditoria-2026-09-08/   Capturas de evidencia de la auditoría.
└── .github/workflows/
    ├── ci.yml                  Tipos + lint + build. En push y PR a main.
    └── links.yml               Enlaces externos. Cron semanal, no en PR (decisión, ver abajo).
```

---

## Estado actual

**Recién cerrado (2026-09-08):** auditoría técnica completa de las 13 áreas, con verificación
sobre la aplicación desplegada además de la revisión de código. Es la primera vez que se **miden**
Core Web Vitals, contraste, peso real y comportamiento con `prefers-reduced-motion` en vez de
estimarlos.

**Abierto:** las 57 tareas de [ROADMAP.md](ROADMAP.md). Ninguna es de Tier 0. Lo más urgente:

- **T1-01** — contraste 3.44:1 en el botón primario (WCAG 1.4.3 AA).
- **T1-02** — el texto animado del Hero ignora `prefers-reduced-motion` (WCAG 2.2.2, nivel A).
- **T1-04** — los deploy previews sirven la build de desarrollo de React (66 % más de JS).
- **T1-06** — cualquier ruta inexistente devuelve 200 con la página completa.
- **T1-07** — 0.58 MB de imágenes huérfanas que se siguen publicando.

**No empezado:** la Fase 2 (aplicar correcciones). La auditoría entregó el informe y los tres
archivos; no se tocó ni una línea de código de la aplicación.

---

## Decisiones y convenciones clave

### El sistema de diseño tiene dos capas por un motivo

`src/index.css` separa los valores crudos (`:root`, prefijo `--value-*`) de la capa semántica
(`@theme inline`). El `inline` hace que Tailwind emita `var(--…)` en lugar de copiar el valor.

**Problema que lo provocó:** un tema claro añadido sobre valores copiados obliga a un refactor
completo. Con esta separación, añadir un tema es un bloque de overrides.
**Alternativa descartada:** declarar los colores directamente en `@theme` (más simple de leer,
imposible de cambiar en caliente).

### Solo los tamaños de display son fluidos

`--text-3xl` a `--text-6xl` usan `clamp`. Los tamaños de cuerpo usan los valores por defecto de
Tailwind **a propósito**: 16 px mínimo en móvil, sin sorpresas de legibilidad.
**No reabrir.**

### El menú móvil es `absolute`, no está en el flujo

**Problema real:** al abrirse y cerrarse cambiaba el alto del header, lo que desplazaba todas las
secciones y hacía que los anclajes nativos aterrizaran en el sitio equivocado. Se compensaba con
un `setTimeout` de 100 ms y un `scrollTo` manual.
**Solución:** sacarlo del flujo con `absolute`. El header mantiene 65 px con el menú abierto
(medido), así que los `href="#seccion"` nativos vuelven a funcionar sin JavaScript de por medio.
**No reabrir.**

### El `min-h-[3.6em]` del Hero es deuda deliberada

Reserva el alto de las dos líneas que llega a ocupar la frase más larga del texto animado. Deja un
hueco visible cuando muestra una frase corta.
**Problema que lo provocó:** sin él, el texto que se escribe y se borra empujaba todo el contenido
de abajo en cada ciclo, justo sobre el fold.
**Resultado medido (2026-09-08): CLS = 0.00.** Se puede afinar (T3-10), pero no a costa del CLS.

### El verificador de enlaces no corre en cada PR

Los enlaces externos flaquean por causas ajenas al commit, y romper PRs por eso entrena a la gente
a ignorar el CI. Corre por cron semanal y abre un issue.
**No reabrir.**

### Los tags de tecnología no tienen estado hover

No son interactivos, y el hover que tenían prometía un click que no existe.

### Sin banner de cookies

El sitio no usa cookies, ni analítica, ni almacenamiento local, ni formularios. Verificado en la
pestaña de red el 2026-09-08. Un banner aquí sería teatro de cumplimiento.
**Revisar solo si se añade analítica** (T4-03).

### Sin tests de componentes que solo renderizan datos estáticos

Afirmarían que `map` funciona. El valor está en las funciones puras — `pickColor`, `pickIcon`,
`safeExternalUrl` (T2-07) — y en los flujos de interacción (T2-10).

### `ROADMAP.md` sustituye a `docs/BACKLOG.md` (2026-09-08)

**Decisión de la auditoría.** El backlog anterior no tenía IDs de tarea, así que nada vivía en
commits ni issues y se podía renumerar sin coste. Se pasó al esquema por severidad `T{tier}-{nn}`
del proceso de auditoría, y cada tarea heredada indica su origen (`viene de BACKLOG 1.1`).
**Alternativa descartada:** mantener los dos archivos. Dos listas de pendientes se desincronizan.
**A partir de aquí los IDs son permanentes**, incluso los de tareas eliminadas.

---

## Trampas conocidas

Las que costaron un fallo real. Leer antes de tocar la zona correspondiente.

### `prefers-reduced-motion` NO detiene el texto del Hero *(descubierto 2026-09-08)*

Hay tres mecanismos y **ninguno cubre el caso**:

1. `<MotionConfig reducedMotion="user">` en `main.tsx` — solo cubre Framer Motion.
2. La media query de `index.css:139` con `animation-duration: .01ms !important` — solo apaga
   **`@keyframes` de CSS**, y lo único que `react-type-animation` declara así es el parpadeo del
   cursor.
3. El tecleo en sí lo mueve `setTimeout`/`requestAnimationFrame`. Ninguna regla CSS puede pararlo.

Verificado en el código de la librería: **cero** referencias a `reduced`, **cero** llamadas a
`matchMedia`. Con `repeat={Infinity}` el texto se mueve para siempre.
El comentario de `index.css:135-138` afirma lo contrario y **es incorrecto**. Ver T1-02.

### Las animaciones `whileInView` invalidan las auditorías automáticas *(descubierto 2026-09-08)*

Con las variantes en su estado inicial (`opacity: 0`), **23 de los 29 elementos interactivos de
`<main>` están invisibles** cuando Lighthouse o axe miden. Las herramientas automáticas no
auditan lo que no se ve.

La puntuación de accesibilidad de 96 del 2026-09-08 se calculó sobre poco más que el Hero. **No es
una medida del sitio.** Cualquier scan automático tiene que recorrer la página y esperar a que las
animaciones terminen, o forzar `prefers-reduced-motion`. Ver T2-09.

Corolario para quien mida a mano: si un elemento sale con `transform` distinto de `none`, la
animación no ha acabado y las medidas de tamaño y posición **no valen**. Durante esta auditoría eso
produjo dos falsos positivos (desbordamiento horizontal y áreas táctiles de 41 px) que
desaparecieron al dejar que las animaciones terminaran.

### `NODE_ENV=development` en los deploy previews infla el bundle un 66 % *(descubierto 2026-09-08)*

`netlify.toml` lo fija en `[context.deploy-preview.environment]` con el comentario "menos
restrictivo para testing", que sugiere que solo afecta a cabeceras. **No:** hace que Vite empaquete
la build de desarrollo de React.

Medido: **635.58 kB** en preview frente a **382.32 kB** en producción. Cualquier Lighthouse sobre
una URL de preview mide una aplicación que no es la que se publica. Ver T1-04.

### El fallback SPA convierte todo el dominio en un soft 404

`/* → /index.html 200` está declarado **dos veces** (`netlify.toml` y `public/_redirects`) y el
sitio **no usa router**. Consecuencia verificada en producción: `/robots.txt`, `/sitemap.xml`,
`/ruta-que-no-existe` y hasta `/assets/index-*.js.map` devuelven todos `200 text/html`. Lighthouse
puntúa `robots-txt` = 0 por eso. Ver T1-06.

*(Efecto secundario benigno: los sourcemaps no están expuestos — no existen. Lo que devuelve 200 es
la página, no un mapa.)*

### El reflow forzado viene de Framer Motion, no del scrollspy

La traza de producción acusa 540 ms de *forced reflow*. La sospecha natural es `useScrollspy`, que
lee `scrollHeight`/`innerHeight`. **No es él.** Atribuido con sourcemap a
`framer-motion/batcher.mjs` llamado desde `PopChild.mjs`. El hook ya está throttleado con `rAF`
justamente por eso. Ver T2-05.

### `lychee` necesita globs explícitos, no directorios

Pasándole `src/`, filtra por extensión conocida y se saltea los `.ts`: revisaba **3 enlaces de
23**, sin verificar ni un repositorio, demo ni certificado. Hay que pasar `'src/**/*.ts'` y
`'src/**/*.tsx'`.

El workflow "pasaba en verde" mientras no comprobaba nada. **Lo que hay que mirar es el resumen de
lychee (`Total`, `Excluded`), no el check verde.**

### Los enlaces root-relative necesitan `--root-dir` *y* `--scheme` juntos

El fallo ocurre al *resolver* el enlace, antes de que se aplique el filtro de esquema, así que
`--scheme` solo no alcanza. `--root-dir` hace que resuelva (da igual a dónde apunte) y
`--scheme http/https` deja el `file://` resultante fuera del chequeo.

### `lychee.toml` tiene exclusiones deliberadas

LinkedIn devuelve **999** a todo cliente sin sesión de navegador, y los orígenes de `preconnect`
(`fonts.googleapis.com`, `fonts.gstatic.com`) devuelven 404 porque no son documentos. Ambas
verificadas con `curl`. Sin esas exclusiones habría un issue de falsos positivos cada lunes.

### ESLint ignora las carpetas de herramientas IA

El flat config **no respeta `.gitignore`**, así que `.agents`, `.claude` y `.codegraph` están en
`globalIgnores`. Sin eso, el lint evaluaba scripts de terceros y un commit ajeno podía romper el CI.

### Los cron de GitHub se apagan solos

En repositorios públicos, GitHub desactiva los workflows programados después de **60 días sin
commits**. Avisa por email y se reactivan con un clic desde Actions. Para un portafolio que puede
quedarse quieto meses, el chequeo semanal de enlaces se apagaría justo cuando más se necesita: las
demos en tiers gratuitos se caen sin que nadie esté mirando.

### Netlify reescribe la cabecera HSTS

`netlify.toml` declara `max-age=63072000` (2 años); la respuesta real trae `31536000` (1 año).
Netlify la normaliza en dominios `*.netlify.app`. Además `preload` no puede surtir efecto ahí:
`netlify.app` está en la Public Suffix List. **El archivo miente sobre lo que se sirve.** Ver T4-02.

### La regla de caché `/assets/*` alcanza a los PDF del CV

`max-age=31536000, immutable` es correcto para los JS y CSS de Vite, que llevan hash de contenido.
Los PDF del CV están en la misma carpeta y **no** llevan hash: hoy solo se salvan porque llevan la
fecha en el nombre. El día que se actualice un CV conservando el nombre, quien ya lo descargó verá
el viejo durante un año. Ver T2-20.

### `WinForms` no casa con `/windows.*forms/i`

En `TechIcon.tsx` existe la entrada `"Windows Forms"` y la regla `/windows.*forms/i`, pero
`src/data/skills.ts` escribe `"WinForms"` — que no contiene "windows". Cae al glifo genérico.

Es el caso diagnosticado de un problema más amplio: **14 de 109 tags (13 %) muestran el icono
genérico**, medido el 2026-09-08. Ver T2-22.

---

## Tareas comunes

| Comando | Para qué | Requisitos |
|---|---|---|
| `npm install` | Instalar dependencias | Node ≥ 20.19 (recomendado 22). **No sirve Node 18**, pese a lo que dice hoy el README |
| `npm run dev` | Servidor de desarrollo en `localhost:5173` | — |
| `npm run build` | Build de producción a `dist/` | Corre `tsc` antes que Vite: falla ante cualquier error de tipos |
| `npm run preview` | Servir el `dist/` ya construido | Requiere `npm run build` antes |
| `npm run type-check` | Solo chequeo de tipos | — |
| `npm run lint` | ESLint sobre 34 archivos | — |
| `npm audit` | Vulnerabilidades de dependencias | Las 3 actuales son transitivas y solo de desarrollo |
| `npx vite build --sourcemap --outDir dist-map` | Build con sourcemaps para atribuir código minificado de una traza | Directorio temporal: **borrarlo después**, no está en `.gitignore` |

**No hay comando de test**: no existe suite (T2-07, T2-10).

---

## Qué queda fuera, y por qué

- **Backend, base de datos y autenticación** — no los necesita un portafolio estático.
- **Formulario de contacto** — un `mailto:` evita gestionar spam, un servicio de correo y datos
  personales de terceros.
- **Analítica** — a cambio, no hay banner de cookies ni política de privacidad que mantener.
  Si algún día se añade, cambia el análisis legal completo (T4-03).
- **Internacionalización** — solo español.
- **Router** — una sola página con anclas.
- **Asesoramiento jurídico** — la auditoría del 2026-09-08 señala qué falta o está desactualizado,
  pero todo lo que dependa de interpretación normativa o de la jurisdicción concreta queda marcado
  como *requiere revisión legal*.

---

## Registro de cambios de sesión

### 2026-09-08 — Auditoría técnica completa (13 áreas)

**Qué se hizo.** Auditoría de las 13 áreas del proceso de revisión, con las dos mitades del
trabajo: revisión de código y **ejercicio de la aplicación desplegada** con Chrome DevTools sobre
`portafolio-web-rajb.netlify.app`, más un build local para comparar. Se verificó que el hash del
bundle desplegado (`index-BUMFo4--.js`) coincide con el del build del commit actual, así que lo
medido es exactamente el código del repositorio.

**Qué se encontró.** 60 hallazgos, ninguno de Tier 0. Los cinco más graves:

1. **Contraste 3.44:1 en el botón primario** (WCAG 1.4.3 AA) — afecta a 4 componentes que comparten
   el par de tokens `--value-primary` / `--value-primary-foreground`.
2. **El texto animado del Hero ignora `prefers-reduced-motion`** (WCAG 2.2.2, nivel **A**), y el
   comentario del CSS que afirma lo contrario es incorrecto.
3. **Los deploy previews sirven la build de desarrollo de React**: 635.58 kB frente a 382.32 kB.
4. **Soft 404 en todo el dominio**: cualquier ruta devuelve 200 con la página completa, `robots.txt`
   incluido.
5. **0.58 MB de imágenes huérfanas** que se siguen publicando, y el plan de conversión a WebP del
   backlog anterior apuntaba justamente a ellas.

**Qué se descubrió por el camino** (lo que no se buscaba y salió):

- La puntuación de accesibilidad de Lighthouse **no es fiable en este sitio**: las animaciones
  `whileInView` dejan 23 de 29 elementos interactivos a `opacity: 0` cuando la herramienta mide.
- Los 540 ms de *forced reflow* son de Framer Motion, no de `useScrollspy` como sugería la
  sospecha razonable.
- La tabla de imágenes del `docs/BACKLOG.md` estaba desactualizada: listaba 2 imágenes muertas y
  omitía 2 vivas.
- Dos afirmaciones del README las desmiente una medición ("code splitting" — hay un solo chunk;
  "cumple WCAG 2.1" — hay tres fallos) y una tercera ("protección anti-scraping") la desmiente el
  propio código.
- El README pide Node 18, con el que el proyecto **no compila**.

**Lo que se verificó funcionando** y conviene no romper: el contrato completo del lightbox (foco al
cierre, `aria-modal`, Escape, foco devuelto, scroll bloqueado y restaurado), el menú móvil
(`aria-expanded`, Escape, foco de retorno, header de alto constante), el orden de foco con el skip
link primero, el scrollspy marcando `aria-current`, cero áreas táctiles bajo 44 px, cero scroll
horizontal a 320/360/768/1280/1440 px, **CLS 0.00**, consola de producción limpia, sin sourcemaps
expuestos y las cabeceras de seguridad aplicándose de verdad.

**Qué quedó a medias.** Nada de la auditoría. **No se aplicó ninguna corrección**: la Fase 2
requiere aprobación explícita y no se pidió. El repositorio quedó sin cambios de código; solo se
añadieron `ROADMAP.md`, `CHANGELOG.md`, este archivo y `docs/auditoria-2026-09-08/`.

**Zonas no cubiertas.** Ver la sección correspondiente del informe: la emulación de
`prefers-reduced-motion` no estaba disponible en el MCP usado (se resolvió inspeccionando el código
de la librería, que es concluyente), no se probó en Safari, iOS ni Firefox, y no se ejercitó un
deploy preview real para confirmar de punta a punta el efecto de `NODE_ENV=development` sobre el
sitio servido — la medición se hizo reproduciendo el build localmente con esa variable.
