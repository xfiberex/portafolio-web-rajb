# Roadmap — Portafolio Web

Qué falta por hacer. Para *qué cambió* ver [CHANGELOG.md](CHANGELOG.md); para *por qué se
decidió así* ver [CONTEXT.md](CONTEXT.md).

> **Origen.** Este archivo sustituye a `docs/BACKLOG.md` (auditoría del 2026-09-08).
> El backlog anterior no tenía IDs de tarea, así que nada vivía todavía en commits ni
> issues: se renumeró entero al esquema por severidad `T{tier}-{nn}`. Cada tarea heredada
> indica su origen. A partir de aquí **los IDs son permanentes**.

Los datos entre paréntesis son **medidos**, no estimados, salvo donde diga *estimado*.

---

## Índice

| Tier | Tema | Tareas | Abiertas | Esfuerzo |
|---|---|---:|---:|---|
| **Tier 0** | Crítico / bloqueante | 3 | 0 | — (cerrado) |
| **Tier 1** | Alta prioridad — accesibilidad AA, build y documentación que engaña | 9 | 9 | bajo·8 medio·1 |
| **Tier 2** | Mejoras sustanciales — rendimiento, QA, SEO, contenido | 22 | 22 | bajo·13 medio·8 alto·1 |
| **Tier 3** | Pulido y mantenimiento | 20 | 20 | bajo·15 medio·5 |
| **Tier 4** | Futuro / opcional | 6 | 6 | bajo·5 alto·1 |
| | **Total** | **60** | **57** | |

**No hay ninguna tarea de Tier 0 abierta.** La auditoría del 2026-09-08 no encontró
vulnerabilidades explotables, pérdida de datos ni fallos que rompan producción. Las tres
tareas de Tier 0 son las del backlog anterior, ya cerradas.

**Lo más urgente son T1-01 y T1-02**: dos incumplimientos de WCAG 2.2 medidos sobre la app
en producción, uno de ellos de nivel A.

---

## Tier 0 — Crítico / bloqueante ✅ (cerrado 2026-07-28)

- [x] **[T0-01] Publicar la configuración de CI y calidad**
  - **Área:** DevOps · **Cerrada:** 2026-07-28 (PR #1)
  - Commit y push de `docs/BACKLOG.md`, `.github/workflows/`, `lychee.toml` y `eslint.config.js`.

- [x] **[T0-02] Verificar que `ci.yml` pasa**
  - **Área:** DevOps · **Cerrada:** 2026-07-28
  - Verde en 36 s, 7 pasos, una sola corrida (sin duplicado push/PR).

- [x] **[T0-03] Disparar `links.yml` a mano y descartar falsos positivos**
  - **Área:** QA · **Cerrada:** 2026-07-28 (PR #5)
  - 23 enlaces, 19 OK, 4 excluidos, 0 errores. La corrida manual destapó que el workflow
    revisaba 3 de 23 enlaces; corregido. Ver *Trampas conocidas* en [CONTEXT.md](CONTEXT.md).

---

## Tier 1 — Alta prioridad

### Accesibilidad (WCAG 2.2 — fallos medidos en producción)

- [ ] **[T1-01] Subir el contraste del texto sobre el botón primario a 4.5:1**
  - **Área:** Accesibilidad · **Severidad:** Alto
  - **Ubicación:** `src/index.css:32-35` (tokens) · `src/components/Hero.tsx:60` ·
    `src/components/Contact.tsx:35` · `src/components/ui/SkipLink.tsx:10` ·
    `src/components/ui/Lightbox.tsx:108`
  - **Qué hacer:** el par `--value-primary` (`#487fff`) + `--value-primary-foreground`
    (`#f8f8f8`) da **3.44:1**, por debajo del 4.5:1 que exige WCAG 1.4.3 para texto normal
    (los botones usan `text-sm` = 14 px). Oscurecer `--value-primary` hasta llegar a 4.5:1
    (bajar la L de `oklch(62.8% 0.2 264)` a ~54-55 % lo consigue manteniendo el tono), o subir
    el texto a 18.66 px + bold para entrar en "texto grande" (3:1). Preferible lo primero:
    cambia un token y arregla los 4 componentes de golpe. Revisar después que
    `--value-primary-hover` siga siendo distinguible.
  - **Criterio de aceptación:** los 4 componentes ≥ 4.5:1 medido con axe o DevTools, y
    `--value-ring` mantiene ≥ 3:1 sobre `--value-background`.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T1-02] Permitir detener la animación de texto del Hero y respetar `prefers-reduced-motion`**
  - **Área:** Accesibilidad · **Severidad:** Alto (WCAG 2.2.2 *Pause, Stop, Hide* — nivel **A**)
  - **Ubicación:** `src/components/Hero.tsx:36-49` · `src/index.css:135-152`
  - **Qué hacer:** `react-type-animation` escribe y borra con `setTimeout`/`rAF` y
    `repeat={Infinity}`. Verificado en su código: **cero** referencias a `reduced` y **cero**
    llamadas a `matchMedia`. La regla `animation-duration: .01ms !important` de `index.css`
    solo apaga el parpadeo del cursor (un `@keyframes`), no el tecleo; y
    `<MotionConfig reducedMotion="user">` únicamente cubre Framer Motion. Resultado: con la
    preferencia activa el texto sigue moviéndose para siempre. Leer la preferencia con
    `useSyncExternalStore` sobre `matchMedia('(prefers-reduced-motion: reduce)')` y, cuando esté
    activa, renderizar el texto fijo (la primera frase) en lugar de `<TypeAnimation>`.
  - **Criterio de aceptación:** con `prefers-reduced-motion: reduce` emulado, el texto del Hero
    no cambia en 15 s. Sin la preferencia, sigue animando.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T1-03] Subir el contraste del badge de periodo en Educación**
  - **Área:** Accesibilidad · **Severidad:** Medio (WCAG 1.4.3 AA)
  - **Ubicación:** `src/components/Education.tsx:40-42`
  - **Qué hacer:** `#487fff` sobre `#162137` da **4.4:1** a 12 px, justo por debajo de 4.5:1.
    Lo resuelve T1-01 si el token primario se oscurece lo suficiente; si no, hay que aclarar el
    texto u oscurecer `bg-primary-soft`.
  - **Criterio de aceptación:** ≥ 4.5:1 medido.
  - **Esfuerzo:** bajo · **Depende de:** T1-01

### Build y despliegue

- [ ] **[T1-04] Quitar `NODE_ENV=development` de los deploy previews**
  - **Área:** DevOps · **Severidad:** Alto
  - **Ubicación:** `netlify.toml:145-147`
  - **Qué hacer:** el bloque `[context.deploy-preview.environment]` fija
    `NODE_ENV = "development"`, lo que hace que Vite empaquete la build de desarrollo de React.
    **Medido:** 635.58 kB / 186.11 kB gzip en preview frente a 382.32 kB / 124.06 kB en
    producción — un 66 % más de JS. El comentario del archivo dice "menos restrictivo para
    testing", dando a entender que solo afecta a cabeceras. Consecuencia real: cualquier
    Lighthouse o prueba manual sobre una URL de preview mide una aplicación que no es la que se
    publica. Eliminar el bloque `environment`; conservar el `X-Robots-Tag: noindex` de debajo,
    que sí es correcto.
  - **Criterio de aceptación:** un deploy preview sirve un bundle del mismo tamaño que
    producción (±2 kB).
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T1-05] Corregir el requisito de Node en el README**
  - **Área:** Documentación · **Severidad:** Alto
  - **Ubicación:** `README.md:56`
  - **Qué hacer:** dice "Node.js (versión 18 o superior)". Vite 7 exige
    `^20.19.0 || >=22.12.0` y ESLint 10 exige `^20.19.0 || ^22.13.0 || >=24`. Quien siga el
    README con Node 18 no consigue arrancar el proyecto. Poner el requisito real y alinearlo con
    el `NODE_VERSION = "22"` de `netlify.toml` y el `node-version: 22` de `ci.yml`.
  - **Criterio de aceptación:** el README declara Node ≥ 20.19 (recomendado 22) y coincide con
    CI y Netlify.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T1-06] Eliminar el soft 404 y publicar un `robots.txt`**
  - **Área:** SEO · **Severidad:** Alto
  - **Ubicación:** `netlify.toml:135-139` · `public/_redirects:1`
  - **Qué hacer:** el fallback SPA `/* → /index.html 200` hace que **cualquier** ruta
    inexistente devuelva 200 con la página completa. Verificado en producción:
    `/ruta-que-no-existe`, `/robots.txt` y `/sitemap.xml` devuelven todas `200 text/html`.
    Lighthouse puntúa `robots-txt` = 0 por eso. El sitio **no usa router**: el fallback no hace
    falta (el propio comentario del archivo dice "necesario para React Router (si lo usas)").
    Quitar el redirect de los dos sitios donde está declarado y añadir `public/robots.txt` con
    `User-agent: *`, `Allow: /` y la línea `Sitemap:` (ver T2-13).
  - **Criterio de aceptación:** `/ruta-que-no-existe` devuelve 404; `/robots.txt` devuelve 200
    con `text/plain`; Lighthouse SEO = 100.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

### Peso y robustez

- [ ] **[T1-07] Borrar las dos imágenes huérfanas**
  - **Área:** Refactorización · **Severidad:** Alto (impacto alto, esfuerzo mínimo)
  - **Ubicación:** `public/projects/GestorTareasMERN.png` (512 KB) ·
    `public/projects/SistemaVentasDesktop.png` (84 KB)
  - **Qué hacer:** ningún proyecto de `src/data/projects.ts` las referencia desde que se
    sustituyeron por TrackerMultimedia y Stockly (commit `57e4320`), pero se siguen copiando a
    `dist/projects/` y publicando. **0.58 MB** de descarga potencial muerta, y la mayor de las
    dos es el archivo más pesado del repositorio.
  - **Criterio de aceptación:** `dist/projects/` contiene exactamente las 6 imágenes
    referenciadas; el peso total de imágenes baja de 1.68 MB a 1.10 MB.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T1-08] Añadir un Error Boundary de React**
  - **Área:** Auditoría de código · **Severidad:** Medio
  - **Ubicación:** `src/main.tsx:7-19` · `src/App.tsx:11-24`
  - **Qué hacer:** no hay ningún límite de error. Una excepción en cualquier componente deja la
    página **completamente en blanco**, el mismo síntoma que tener JavaScript desactivado, y sin
    ningún mensaje. Envolver `<App />` en un error boundary que pinte un mensaje mínimo con el
    email de contacto y un enlace al CV.
  - **Criterio de aceptación:** forzar un `throw` en un componente muestra el mensaje de respaldo
    en vez de una página vacía.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T1-09] Corregir las afirmaciones falsas del README**
  - **Área:** Documentación · **Severidad:** Medio
  - **Ubicación:** `README.md:22,32,151-153,159-160,166`
  - **Qué hacer:** tres afirmaciones que la auditoría contradice con medición:
    1. *"Optimizado con lazy loading y code splitting"* — no hay ningún `import()` dinámico y el
       build produce **un solo chunk** de 382 kB. El `loading="lazy"` de las imágenes sí es
       cierto; el code splitting no.
    2. *"Accesibilidad: Cumple con estándares WCAG 2.1"* — hay dos fallos AA medidos (T1-01,
       T1-03) y uno de nivel A (T1-02).
    3. *"Contacto Seguro: Sistema de contacto con protección anti-scraping"* — el email en claro
       se renderiza en el DOM en el primer pintado (ver T3-13). Protege de bots que no ejecutan
       JavaScript, no de los que sí.
  - **Criterio de aceptación:** ninguna afirmación del README queda desmentida por una medición.
  - **Esfuerzo:** bajo · **Depende de:** T1-01, T1-02, T1-03

---

## Tier 2 — Mejoras sustanciales

### Rendimiento

- [ ] **[T2-01] Elegir herramienta de conversión a WebP** *(viene de BACKLOG 1.1)*
  - **Área:** Rendimiento · **Ubicación:** `package.json`, `vite.config.ts`
  - **Qué hacer:** decidir entre `sharp` (script de build) y `vite-imagetools` (transforma en el
    import). Registrar la decisión y la alternativa descartada en `CONTEXT.md`.
  - **Criterio de aceptación:** decisión escrita en `CONTEXT.md` y dependencia instalada.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T2-02] Convertir a WebP las 6 imágenes que sí se usan** *(corrige BACKLOG 1.1)*
  - **Área:** Rendimiento · **Ubicación:** `public/projects/` ·
    `src/data/projects.ts:9,37,64,80,102,116`
  - **Qué hacer:** ⚠️ **la tabla del backlog anterior estaba desactualizada**: listaba
    `GestorTareasMERN.png` y `SistemaVentasDesktop.png`, que ya no usa ningún proyecto (ver
    T1-07), y **omitía** `TrackerMultimedia.png` y `Stockly.png`, que sí se usan. La lista
    correcta y su peso medido hoy:

    | Archivo | Peso |
    |---|---:|
    | `S-Blazor-TDApp.png` | 266 KB |
    | `Porfolio-web-rajb.png` | 220 KB |
    | `TrackerMultimedia.png` | 212 KB |
    | `kiosgo-uno.png` | 201 KB |
    | `SistemasVenta-ASPNET-Core-MVC.png` | 112 KB |
    | `Stockly.png` | 110 KB |
    | **Total** | **1.10 MB** |

    Reducción esperada en WebP: 60-80 % (*estimado*).
  - **Criterio de aceptación:** las 6 rutas de `projects.ts` apuntan a WebP y el peso total baja
    al menos un 50 %, vuelto a medir.
  - **Esfuerzo:** bajo · **Depende de:** T1-07, T2-01

- [ ] **[T2-03] Decidir sobre el respaldo PNG** *(viene de BACKLOG 1.1)*
  - **Área:** Rendimiento · **Ubicación:** `src/components/projects/ProjectCard.tsx:66,94`
  - **Qué hacer:** mantener un `<picture>` con respaldo PNG, o confirmar que el soporte de WebP
    alcanza al mínimo de navegadores declarado (ver T2-19, que es quien lo declara).
  - **Criterio de aceptación:** decisión registrada en `CONTEXT.md`.
  - **Esfuerzo:** bajo · **Depende de:** T2-02, T2-19

- [ ] **[T2-04] Auto-hospedar la fuente Inter**
  - **Área:** Rendimiento · **Ubicación:** `index.html:46-51` · `netlify.toml:29-31`
  - **Qué hacer:** la hoja de estilos de Google Fonts es el mayor coste de bloqueo de render del
    sitio. **Medido en producción** (móvil, Slow 4G, CPU 4×): 602 ms de duración total frente a
    6 ms del CSS propio, con un ahorro estimado por DevTools de **507 ms de FCP y LCP**.
    Descargar los `.woff2` de Inter a `public/fonts/`, declarar `@font-face` con
    `font-display: swap` en `index.css` y eliminar los `preconnect` y el `<link>` a Google.
    Permite además cerrar `font-src` y `style-src` a `'self'` en el CSP. Resuelve también el
    punto de privacidad de T4-03.
  - **Criterio de aceptación:** cero peticiones a `fonts.googleapis.com` y `fonts.gstatic.com` en
    la pestaña de red; LCP vuelto a medir en las mismas condiciones.
  - **Esfuerzo:** medio · **Depende de:** ninguna

- [ ] **[T2-05] Reducir el reflow forzado de Framer Motion**
  - **Área:** Rendimiento · **Ubicación:** `src/lib/animations.ts` · todas las secciones con
    `whileInView`
  - **Qué hacer:** la traza de producción acusa **540 ms de forced reflow**. Atribuido con
    sourcemap a `framer-motion/batcher.mjs` llamado desde `PopChild.mjs` — es decir, al bucle de
    render de la librería, **no** a `useScrollspy` como cabría suponer. El sitio anima ~56
    elementos con `whileInView`. Reducir el número de elementos animados (animar el contenedor de
    cada sección en vez de cada tarjeta y cada párrafo) y volver a medir.
  - **Criterio de aceptación:** el insight *ForcedReflow* baja de 200 ms en la misma traza
    (móvil, Slow 4G, CPU 4×).
  - **Esfuerzo:** medio · **Depende de:** ninguna

- [ ] **[T2-06] Analizar el bundle y decidir si dividirlo** *(viene de BACKLOG 4.6)*
  - **Área:** Rendimiento · **Ubicación:** `vite.config.ts`
  - **Qué hacer:** 382.32 kB (124.06 kB gzip) en **un solo chunk** para un sitio estático. El LCP
    medido es de 3.011 s con **2.946 s de render delay** — el 98 % del LCP es esperar a que React
    arranque, no red (TTFB 65 ms). Correr `rollup-plugin-visualizer` para identificar al mayor
    contribuyente antes de decidir — *no medido todavía, no asumir cuál es*.
  - **Criterio de aceptación:** informe del analizador guardado y decisión escrita en `CONTEXT.md`.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

### QA y testing

- [ ] **[T2-07] Vitest sobre las funciones puras** *(viene de BACKLOG 4.5)*
  - **Área:** QA · **Ubicación:** `src/components/TechIcon.tsx:283-464` · `src/lib/assets.ts:13,23`
  - **Qué hacer:** nada de tests de componentes que renderizan datos estáticos. Los que valen:
    - **`pickColor`/`pickIcon`** — ~90 heurísticas regex donde el orden importa. Un test de tabla
      que recorra cada tag de `projects.ts` y `skills.ts` afirmando que resuelve a un icono real.
      **Hoy fallaría**: 14 de 109 tags (13 %) caen al glifo genérico (ver T2-22).
    - **`safeExternalUrl`** — relevante para seguridad, con casos borde (`javascript:`, `data:`,
      protocolo relativo, cadena vacía).
    - **`toAssetUrl`** — unión con `BASE_URL`.
  - **Criterio de aceptación:** `npm test` verde en CI y el test de tabla falla si se añade una
    tecnología sin icono.
  - **Esfuerzo:** medio · **Depende de:** ninguna

- [ ] **[T2-08] Lighthouse CI con budgets que fallen el build** *(viene de BACKLOG 4.1)*
  - **Área:** QA · **Ubicación:** `.github/workflows/`
  - **Qué hacer:** `@lhci/cli` contra `vite preview` o la URL del deploy preview. **Budgets que
    fallen**, no solo reporten. Línea base medida el 2026-09-08 en producción (móvil):
    accesibilidad 96, buenas prácticas 100, SEO 92, LCP 3.011 s, CLS 0.00. Alternativa más
    barata: `@netlify/plugin-lighthouse`.
  - **Criterio de aceptación:** el workflow falla si SEO < 100, accesibilidad < 100 o LCP > 2.5 s.
  - **Esfuerzo:** medio · **Depende de:** T1-04, T1-06

- [ ] **[T2-09] axe-core en CI** *(viene de BACKLOG 4.2)*
  - **Área:** QA · **Ubicación:** `.github/workflows/`
  - **Qué hacer:** el score de accesibilidad de Lighthouse es superficial; axe detecta bastante
    más. ⚠️ **Trampa descubierta el 2026-09-08:** con las animaciones `whileInView` en su estado
    inicial, **23 de los 29 elementos interactivos de `<main>` están a `opacity: 0`** cuando la
    herramienta mide, y las herramientas automáticas no auditan lo invisible. El 96 de Lighthouse
    se calculó sobre poco más que el Hero. El scan de axe **debe** recorrer la página y esperar a
    que las animaciones terminen antes de medir, o forzar `prefers-reduced-motion`.
  - **Criterio de aceptación:** el scan cubre las 8 secciones (comprobable por el número de nodos
    auditados) y falla el build ante cualquier violación *serious* o *critical*.
  - **Esfuerzo:** medio · **Depende de:** T1-02

- [ ] **[T2-10] Playwright: congelar lo verificado a mano** *(viene de BACKLOG 4.3)*
  - **Área:** QA · **Ubicación:** nuevo `e2e/`
  - **Qué hacer:** todo esto se verificó funcionando el 2026-09-08 sobre producción y hoy no
    tiene red de seguridad:
    - Ciclo de foco del lightbox: abre → foco al cierre → `aria-modal` → Escape → foco de vuelta
      al disparador → scroll del body bloqueado y restaurado.
    - Menú móvil: `aria-expanded` alterna, Escape cierra y devuelve el foco, el header no cambia
      de alto.
    - Skip link primero en el orden de foco, y `aria-current` siguiendo la sección al scrollear.
    - Cero scroll horizontal a 320 / 360 / 768 / 1280 / 1440.
    - **`prefers-reduced-motion`** — Playwright sí puede emularlo. Es la prueba que cierra T1-02.
  - **Criterio de aceptación:** los 5 bloques en verde en CI.
  - **Esfuerzo:** alto · **Depende de:** T1-02

- [ ] **[T2-11] Snapshots visuales** *(viene de BACKLOG 4.4)*
  - **Área:** QA · **Ubicación:** `e2e/`
  - **Qué hacer:** `toHaveScreenshot()` a 375 / 768 / 1440. **Requisito:** forzar reduced-motion
    y enmascarar la línea de texto animado, o los snapshots serán inestables por Framer Motion y
    `react-type-animation`.
  - **Criterio de aceptación:** tres corridas seguidas sin diferencias.
  - **Esfuerzo:** medio · **Depende de:** T2-10

- [ ] **[T2-12] Que el verificador de enlaces cubra el README y `docs/`**
  - **Área:** QA · **Ubicación:** `.github/workflows/links.yml:40-48`
  - **Qué hacer:** los globs actuales son `index.html`, `src/**/*.ts` y `src/**/*.tsx`. El
    `README.md` queda fuera y contiene enlaces rotos hoy mismo (ver T3-01). Añadir `README.md`,
    `ROADMAP.md`, `CONTEXT.md` y `docs/**/*.md`.
  - **Criterio de aceptación:** el resumen de lychee muestra un `Total` mayor que 23 y detecta el
    enlace de LinkedIn sin esquema del README.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

### SEO y contenido

- [ ] **[T2-13] Publicar `sitemap.xml`**
  - **Área:** SEO · **Ubicación:** `public/`
  - **Qué hacer:** una sola URL, pero es lo que enlaza el `robots.txt` de T1-06 y lo que consume
    Search Console.
  - **Criterio de aceptación:** `/sitemap.xml` devuelve 200 con `application/xml`.
  - **Esfuerzo:** bajo · **Depende de:** T1-06

- [ ] **[T2-14] Añadir un `<noscript>`**
  - **Área:** SEO / UX · **Ubicación:** `index.html:96-99`
  - **Qué hacer:** el `<body>` solo contiene `<div id="root"></div>`. Sin JavaScript el visitante
    ve una página **completamente en blanco**, sin una sola palabra. Añadir un `<noscript>` con
    el nombre, el rol, el email y los enlaces al CV, GitHub y LinkedIn — lo mínimo para que un
    reclutador con un proxy corporativo restrictivo siga teniendo cómo contactar.
  - **Criterio de aceptación:** con JavaScript desactivado se ve nombre, rol y datos de contacto.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T2-15] Imagen Open Graph propia de 1200×630** *(viene de BACKLOG 1.2)*
  - **Área:** SEO · **Ubicación:** `index.html:35,44`
  - **Qué hacer:** hoy `og:image` apunta a `projects/Porfolio-web-rajb.png`, que funciona pero no
    tiene la proporción correcta: LinkedIn la recorta. Diseñar una imagen 1200×630 con nombre,
    rol y stack principal, guardarla en `public/` y actualizar `og:image` y `twitter:image`.
    Añadir de paso `og:image:width` y `og:image:height`, que hoy faltan.
  - **Criterio de aceptación:** validada con el post inspector de LinkedIn y el card validator de
    X, sin recorte.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T2-16] Un solo CTA primario en el Hero** *(viene de BACKLOG 1.3)*
  - **Área:** UI/UX · **Ubicación:** `src/components/Hero.tsx:57-104`
  - **Qué hacer:** hay 8 acciones compitiendo arriba del fold (Inicio, menú, Ver proyectos,
    Contactar, Descargar CV, CV-ATS, GitHub, LinkedIn). La regla es **un** CTA primario. Dejar
    "Ver proyectos" como único botón primario y bajar el resto a secundario o terciario.
  - **Criterio de aceptación:** un solo elemento con `bg-primary` sobre el fold.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T2-17] Renombrar "CV-ATS"** *(viene de BACKLOG 1.3)*
  - **Área:** Ortografía y redacción · **Ubicación:** `src/components/Hero.tsx:78-81`
  - **Qué hacer:** "CV-ATS" es jerga que un reclutador no descifra. Alternativa: un solo botón de
    CV con las dos variantes en un menú, o etiquetas explícitas ("CV en PDF" / "CV en texto
    plano").
  - **Criterio de aceptación:** ninguna etiqueta visible usa siglas sin explicar.
  - **Esfuerzo:** bajo · **Depende de:** T2-16

- [ ] **[T2-18] Sustituir el wordmark "Inicio" por el nombre o un logo** *(viene de BACKLOG 1.3)*
  - **Área:** UI/UX · **Ubicación:** `src/components/Navbar.tsx:44-50`
  - **Qué hacer:** es el lugar de mayor jerarquía de marca de la página y está desperdiciado en
    una palabra genérica.
  - **Criterio de aceptación:** el wordmark muestra el nombre o un logo.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

### Mantenimiento e infraestructura

- [ ] **[T2-19] Declarar los navegadores soportados**
  - **Área:** DevOps · **Ubicación:** `package.json`
  - **Qué hacer:** no hay `browserslist`, ni polyfills, ni una línea en el README que diga contra
    qué se prueba. Sin soporte declarado nadie puede decidir si un fallo es un bug o un navegador
    fuera de alcance — y bloquea T2-03 (¿alcanza el soporte de WebP?) y cualquier prueba en
    Safari/iOS.
  - **Criterio de aceptación:** `package.json` declara `browserslist` y el README dice cuál es el
    mínimo.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T2-20] Arreglar el `Cache-Control` de los CV**
  - **Área:** DevOps · **Ubicación:** `netlify.toml:113-116`
  - **Qué hacer:** la regla `for = "/assets/*"` aplica `max-age=31536000, immutable` a todo lo que
    hay en esa carpeta. Verificado en producción: el PDF del CV (650 KB) se sirve con `immutable`
    a un año. Los JS y CSS de Vite llevan hash de contenido y lo aguantan; los PDF **no** — hoy
    solo se salvan porque llevan la fecha en el nombre. El día que se actualice un CV conservando
    el nombre, quien ya lo descargó seguirá viendo el viejo durante un año. Separar la regla:
    hash → `immutable`; PDF → `max-age=86400` o `must-revalidate`.
  - **Criterio de aceptación:** el PDF del CV se sirve sin `immutable`; los assets con hash lo
    conservan.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T2-21] Empezar a etiquetar versiones en git**
  - **Área:** DevOps · **Ubicación:** `package.json:4` · repositorio
  - **Qué hacer:** `package.json` declara `version: 2.0.0` y el repositorio no tiene **ni un
    tag**. El `CHANGELOG.md` creado en esta auditoría reconstruye el historial de forma
    aproximada; a partir de aquí, etiquetar cada versión publicada.
  - **Criterio de aceptación:** existe el tag `v2.0.0` apuntando al commit correspondiente y el
    changelog lo enlaza.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T2-22] Corregir los tags que caen al icono genérico**
  - **Área:** Auditoría de código · **Ubicación:** `src/components/TechIcon.tsx:443,455-461`
  - **Qué hacer:** **medido sobre la app corriendo: 14 de 109 tags (13 %) muestran el glifo de
    respaldo**, en 11 tecnologías distintas: TanStack Query, Jest, Playwright (E2E), Supertest,
    Pruebas de carga, WinForms, Detección de reúso de token, OAuth 2.0 con PKCE, Control de
    acceso por rol, Rate limiting y Registro de decisiones técnicas (ADRs). Un caso está
    diagnosticado: la regla es `/windows.*forms/i` y el dato dice `"WinForms"` — "winforms" no
    contiene "windows", así que nunca casa pese a existir la entrada `"Windows Forms"`. Añadir
    los iconos que falten o aceptar el glifo genérico de forma deliberada para las competencias
    que no son productos (las 4 de Seguridad, ADRs).
  - **Criterio de aceptación:** el test de tabla de T2-07 pasa, o los tags sin icono propio son
    una lista explícita y justificada.
  - **Esfuerzo:** medio · **Depende de:** ninguna

---

## Tier 3 — Pulido y mantenimiento

- [ ] **[T3-01] Sustituir los marcadores de posición del README**
  - **Área:** Ortografía y redacción · **Ubicación:** `README.md:60,186-188`
  - **Qué hacer:** quedan sin sustituir `git clone https://github.com/tu-usuario/portafolio-web.git`,
    `[github.com/tu-usuario]` y `[linkedin.com/in/tu-perfil]`. Además el enlace de LinkedIn apunta
    a `www.linkedin.com/in/...` **sin esquema**, así que GitHub lo interpreta como ruta relativa y
    queda roto.
  - **Criterio de aceptación:** ningún `tu-usuario`/`tu-perfil` en el archivo y todos los enlaces
    con `https://`.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T3-02] Actualizar el árbol de estructura del README**
  - **Área:** Documentación · **Ubicación:** `README.md:98-140`
  - **Qué hacer:** el árbol omite la carpeta `components/projects/`, `lib/assets.ts` y 5 de los 6
    componentes de `components/ui/`; dice `hooks/useScrollspy.tsx` cuando el archivo es `.ts`.
  - **Criterio de aceptación:** el árbol coincide con `src/`.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T3-03] Limpiar la documentación muerta del README**
  - **Área:** Documentación · **Ubicación:** `README.md:39,163-166,171-175,196-203`
  - **Qué hacer:** dice "ESLint 9" (es 10); documenta cómo configurar variables de entorno y
    EmailJS cuando el proyecto **no usa ninguna** variable de entorno; da instrucciones de GitHub
    Pages que fallarían sin configurar `base` en Vite y que perderían todas las cabeceras de
    `netlify.toml`; agradece **Heroicons**, que no se usa en ninguna parte del código. Añadir en
    cambio una mención a `ROADMAP.md`, `CONTEXT.md` y los dos workflows de CI.
  - **Criterio de aceptación:** cada sección del README describe algo que existe.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T3-04] Declarar las licencias de terceros**
  - **Área:** Legal · **Ubicación:** `README.md:205-212`
  - **Qué hacer:** el proyecto es MIT y usa `lucide-react` (ISC), la fuente Inter (SIL OFL) y
    React/Framer Motion/Tailwind (MIT). Todas compatibles, sin conflicto — pero la sección de
    agradecimientos no declara ninguna licencia y sí menciona una librería que no se usa.
    Convertirla en una lista de atribuciones con licencia.
  - **Criterio de aceptación:** cada dependencia visible al usuario aparece con su licencia.
  - **Esfuerzo:** bajo · **Depende de:** T3-03

- [ ] **[T3-05] Definir el tema claro** *(viene de BACKLOG 3)*
  - **Área:** UI/UX · **Ubicación:** `src/index.css:17-44`
  - **Qué hacer:** el fundamento ya está: `index.css` separa los valores crudos (`:root`, prefijo
    `--value-*`) de la capa semántica (`@theme inline`) justamente para que añadir un tema sea un
    bloque de overrides y no un refactor. Definir los valores en `[data-theme="light"]`.
  - **Criterio de aceptación:** el bloque existe y todos los tokens tienen valor claro.
  - **Esfuerzo:** medio · **Depende de:** T1-01

- [ ] **[T3-06] Conmutador de tema con persistencia** *(viene de BACKLOG 3)*
  - **Área:** UI/UX · **Ubicación:** `src/components/Navbar.tsx` · `index.html`
  - **Qué hacer:** `localStorage` y `prefers-color-scheme` como valor por defecto. Evitar el flash
    de tema incorrecto aplicando el atributo antes del primer pintado (script inline en el
    `<head>` — ojo: el CSP actual es `script-src 'self'`, así que hará falta un hash).
  - **Criterio de aceptación:** recargar con tema claro no produce destello oscuro, y el CSP sigue
    sin `'unsafe-inline'` en `script-src`.
  - **Esfuerzo:** medio · **Depende de:** T3-05

- [ ] **[T3-07] Verificar contraste en ambos temas** *(viene de BACKLOG 3)*
  - **Área:** Accesibilidad · **Ubicación:** `src/index.css`
  - **Qué hacer:** los valores de un tema no se heredan al otro: hay que medir por separado.
    Revisar además que el gradiente de `Layout.tsx:25` y los `shadow-primary/10` funcionen en
    claro.
  - **Criterio de aceptación:** axe en verde con `[data-theme="light"]` activo.
  - **Esfuerzo:** medio · **Depende de:** T3-05, T2-09

- [ ] **[T3-08] Igualar el alto útil de las tarjetas de proyecto** *(viene de BACKLOG 2)*
  - **Área:** UI/UX · **Ubicación:** `src/components/Projects.tsx:39` ·
    `src/components/projects/ProjectCard.tsx:109-118`
  - **Qué hacer:** **medido a 1440 px**: el hueco entre los tags y la fila de enlaces es de 200,
    **334** y 328 px en las tres tarjetas destacadas (el backlog anterior lo estimaba en ~230 px
    sin medir). Es inherente a una grilla de alto igual con contenido variable. Opciones: igualar
    la cantidad de features entre proyectos, o `items-start` para que cada tarjeta mida según su
    contenido.
  - **Criterio de aceptación:** ninguna tarjeta destacada supera 120 px de hueco, vuelto a medir.
  - **Esfuerzo:** medio · **Depende de:** ninguna

- [ ] **[T3-09] Alinear los encabezados de las tarjetas** *(viene de BACKLOG 2)*
  - **Área:** UI/UX · **Ubicación:** `src/components/projects/ProjectCard.tsx:39-44`
  - **Qué hacer:** **medido a 1440 px**: "KiosGo - Sistema de Kiosko de Comida" ocupa 2 líneas y
    los otros 1, así que su subtítulo arranca **28 px** más abajo. Se resuelve con un `min-h` en
    el bloque de encabezado.
  - **Criterio de aceptación:** los tres subtítulos arrancan a la misma altura.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T3-10] Afinar el hueco bajo el texto animado del Hero** *(viene de BACKLOG 2)*
  - **Área:** UI/UX · **Ubicación:** `src/components/Hero.tsx:35`
  - **Qué hacer:** el `min-h-[3.6em]` reserva las 2 líneas de la frase más larga, así que se ve un
    hueco cuando muestra una corta. Es el precio correcto de no tener CLS (**CLS medido: 0.00** —
    no romperlo), pero se puede afinar midiendo la altura real en lugar de estimarla.
  - **Criterio de aceptación:** el hueco se reduce y el CLS sigue en 0.00.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T3-11] Compactar la sección de Certificados** *(viene de BACKLOG 2)*
  - **Área:** UI/UX · **Ubicación:** `src/components/Certificates.tsx` · `src/data/certificates.ts`
  - **Qué hacer:** 5 tarjetas idénticas, todas de Udemy, mismo icono, sin fechas. Una lista
    compacta comunica lo mismo en un tercio del espacio.
  - **Criterio de aceptación:** la sección ocupa menos de la mitad de alto.
  - **Esfuerzo:** medio · **Depende de:** ninguna

- [ ] **[T3-12] Jerarquizar Competencias** *(viene de BACKLOG 2)*
  - **Área:** UI/UX · **Ubicación:** `src/components/Skills.tsx` · `src/data/skills.ts:80-89`
  - **Qué hacer:** 45 items en 9 categorías, todos con el mismo peso visual, lo que diluye la
    señal fuerte (.NET + React). Además "Principios" mete frases largas ("MVC - Modular por
    dominios - Feature Based") en pills de tag, y esas no son tags.
  - **Criterio de aceptación:** las categorías principales destacan y "Principios" no usa pills.
  - **Esfuerzo:** medio · **Depende de:** ninguna

- [ ] **[T3-13] Eliminar el código muerto de `ObfuscatedEmail`**
  - **Área:** Refactorización · **Ubicación:** `src/components/ui/ObfuscatedEmail.tsx:11,19-23,36-46` ·
    `src/components/Contact.tsx:43-53`
  - **Qué hacer:** el componente promete en su propio comentario construir el email "en memoria,
    no en DOM" y ofrece un estado `isRevealed` con una versión ofuscada. Pero sus **dos únicos
    usos** pasan render prop, y el segundo (`Contact.tsx:50`) renderiza `{email}` en claro en el
    primer pintado. Resultado: `isRevealed`, `obfuscatedDisplay` y toda la rama de render por
    defecto **nunca se ejecutan**. Decidir una de dos: usar de verdad el patrón de revelado, o
    borrar el estado muerto y quedarse con un helper que solo ensamble el `mailto:`. La protección
    real que queda es que el email no está en el HTML de origen, solo lo ensambla el JS — eso sí
    frena a los scrapers que no ejecutan JavaScript, y conviene decirlo así (T1-09).
  - **Criterio de aceptación:** no queda código inalcanzable en el componente y el README describe
    la protección real.
  - **Esfuerzo:** bajo · **Depende de:** T1-09

- [ ] **[T3-14] Eliminar las ramas regex inalcanzables de `TechIcon`**
  - **Área:** Refactorización · **Ubicación:** `src/components/TechIcon.tsx:311,323,328,345-346,355-357,392,435,436,445-446`
  - **Qué hacer:** verificado con pruebas directas de las expresiones: `/solid/` precede a
    `/principios.*solid/`, `/mvc/` a `/arquitectura.*mvc/`, `/\.net.*\d+/` a `/\.net.*9/` y
    `/\.net.*8/`, `/react/` a `/react.*19/`, `/tailwind/` a `/tailwind.*css.*4/`, y `/ef.*core/`
    aparece **dos veces**. Todas las segundas ramas son inalcanzables. No cambian el resultado (la
    búsqueda por clave exacta del principio ya cubre esos nombres), pero son ~10 líneas que
    aparentan hacer algo. Simplificar también `/next\.?js.*16|next\.?js/` y `/prisma.*7|prisma/`,
    donde la primera alternativa es redundante.
  - **Criterio de aceptación:** ninguna rama posterior queda tapada por una anterior; el test de
    tabla de T2-07 sigue verde.
  - **Esfuerzo:** bajo · **Depende de:** T2-07

- [ ] **[T3-15] Limpiar entradas de `BRAND_COLORS`/`ICONS` sin uso**
  - **Área:** Refactorización · **Ubicación:** `src/components/TechIcon.tsx:4-83`
  - **Qué hacer:** al menos 11 entradas no corresponden a ninguna tecnología de `src/data/`:
    Cypress, GitHub Copilot, ChatGPT, Gemini, Cursor IDE, AI Code Review, Google Antigravity,
    Neon, Python, Windows Forms y Clean Code. Son restos de versiones anteriores de la lista de
    competencias.
  - **Criterio de aceptación:** cada entrada corresponde a un tag realmente listado, o se
    documenta por qué se conserva.
  - **Esfuerzo:** bajo · **Depende de:** T2-22

- [ ] **[T3-16] Sacar los datos de iconos fuera del componente**
  - **Área:** Arquitectura · **Ubicación:** `src/components/TechIcon.tsx` (541 líneas)
  - **Qué hacer:** el archivo mezcla 78 colores de marca, ~69 rutas SVG y la lógica de resolución.
    Mover los dos diccionarios a `src/data/tech-icons.ts` y dejar en el componente solo
    `pickColor`, `pickIcon` y el render.
  - **Criterio de aceptación:** `TechIcon.tsx` baja de 150 líneas.
  - **Esfuerzo:** medio · **Depende de:** T3-14, T3-15

- [ ] **[T3-17] Unificar el estilo de código**
  - **Área:** Refactorización · **Ubicación:** `src/components/ui/ObfuscatedEmail.tsx` ·
    `src/components/TechIcon.tsx`
  - **Qué hacer:** estos dos archivos usan comillas simples y omiten el punto y coma; el resto del
    proyecto usa comillas dobles y punto y coma. No hay Prettier ni regla de estilo en ESLint que
    lo impida. Añadir Prettier (o las reglas equivalentes) y pasarlo una vez.
  - **Criterio de aceptación:** `npx prettier --check .` en verde, y el paso añadido a `ci.yml`.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T3-18] Correcciones menores de código**
  - **Área:** Auditoría de código
  - **Qué hacer:** cuatro arreglos de una línea cada uno:
    - `src/components/Contact.tsx:33,45` — los dos `<button>` no declaran `type="button"`.
    - `src/components/projects/ProjectLinks.tsx:25` — el centinela mágico `project.demo === "#"`;
      mejor omitir el campo en los datos que codificar un "vacío" como `"#"`.
    - `src/components/Contact.tsx:18-20` — duplica el markup del `<h2>` de `SectionHeader` en
      lugar de usar el componente, que existe justamente para eso.
    - `src/components/Navbar.tsx:44-50` — el wordmark nunca recibe `aria-current` aunque "home"
      sea la sección activa, porque `navItems` no incluye "home".
  - **Criterio de aceptación:** los cuatro puntos aplicados, lint y tipos en verde.
  - **Esfuerzo:** bajo · **Depende de:** T2-18

- [ ] **[T3-19] Correcciones menores de estilos y configuración**
  - **Área:** UI/UX · DevOps
  - **Qué hacer:**
    - `src/index.css:84` — `--spacing-header: 4rem` (64 px) no cuenta el `border-b` del header,
      que mide 65 px de alto real; las anclas dejan **1 px** de la sección tapado. Medido.
    - `src/components/Layout.tsx:20` — el `<body>` no tiene fondo propio (computa
      `rgba(0,0,0,0)`); el color lo pone un `div` interior y el lienzo lo salva
      `color-scheme: dark`. Frágil de cara a T3-05: poner el token de fondo en `body`.
    - `src/index.css:135-138` — el comentario afirma que la media query cubre "cualquier
      `@keyframes` de librería (react-type-animation)". Solo cubre el cursor. Corregirlo al cerrar
      T1-02.
    - `netlify.toml:135-139` y `public/_redirects` — el fallback SPA está declarado dos veces.
      T1-06 lo elimina; borrar también el archivo `_redirects` si queda vacío.
  - **Criterio de aceptación:** los cuatro puntos aplicados.
  - **Esfuerzo:** bajo · **Depende de:** T1-02, T1-06

- [ ] **[T3-20] Correcciones de redacción y metadatos**
  - **Área:** Ortografía y redacción
  - **Qué hacer:**
    - `index.html:8` vs `:32` — el `<title>` dice "Ricky Jiménez - Desarrollador Full-Stack" y el
      `og:title` "Ricky Jiménez — Desarrollador **Web** Full-Stack": distinto texto y distinto
      guion. Igualarlos.
    - `index.html:11` vs `:38` — la `description` dice "MERN stack" y la `og:description`
      "MERN/PERN". Igualarlas.
    - `src/components/Hero.tsx:42` — "Creador de interfaces modernas con agentes IA" → "con
      agentes **de** IA".
    - `src/components/Hero.tsx:53` — "enfoque en performance" mezcla anglicismo con el
      "rendimiento" que usan el README y la meta description. Elegir uno.
    - `src/data/projects.ts:76` — "Sistema de Ventas WEB": "WEB" en mayúsculas sin motivo.
    - `public/projects/Porfolio-web-rajb.png` — errata en el nombre del archivo ("Porfolio" por
      "Portfolio"), visible hoy en la URL pública de la tarjeta social. Renombrarlo al hacer
      T2-02, que ya toca esas rutas.
  - **Criterio de aceptación:** los seis puntos aplicados y coherentes entre sí.
  - **Esfuerzo:** bajo · **Depende de:** T2-02, T2-15

---

## Tier 4 — Futuro / opcional

- [ ] **[T4-01] Actualizar dependencias y cerrar los avisos de `npm audit`**
  - **Área:** Seguridad · **Ubicación:** `package.json`, `package-lock.json`
  - **Qué hacer:** `npm audit` reporta 3 vulnerabilidades (2 altas, 1 moderada), todas
    **transitivas y solo de desarrollo**: `eslint → minimatch → brace-expansion` (DoS),
    `eslint → @humanfs/node` (copia recursiva por symlink) y `vite → postcss → nanoid`. Ninguna
    llega al bundle publicado, así que el riesgo para el sitio es nulo; el riesgo es para la
    máquina que construye. `npm audit fix` las resuelve. Hay además 17 dependencias con versión
    nueva disponible, incluidos saltos mayores (Vite 8, Framer Motion 13, lucide-react 1,
    TypeScript 7) que merecen su propia sesión.
  - **Criterio de aceptación:** `npm audit` sin vulnerabilidades y CI en verde.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T4-02] Ajustar tres cabeceras de seguridad**
  - **Área:** Seguridad · **Ubicación:** `netlify.toml:23-38,66,75`
  - **Qué hacer:** detalles menores verificados sobre las cabeceras reales de producción:
    - `X-XSS-Protection: 1; mode=block` está obsoleta; todos los navegadores modernos eliminaron
      el auditor de XSS y la recomendación actual es `0` (Google Fonts ya la sirve así). No hay
      riesgo activo, es ruido.
    - `Strict-Transport-Security` declara `max-age=63072000` (2 años) pero **la respuesta real
      trae `31536000`** (1 año): Netlify la normaliza en dominios `*.netlify.app`. Además
      `preload` no puede surtir efecto en un subdominio de `netlify.app`, que está en la Public
      Suffix List. Alinear el archivo con la realidad o documentar por qué difiere.
    - `img-src 'self' data: https:` acepta imágenes de cualquier origen HTTPS. Como todas las
      imágenes son propias, se puede cerrar a `'self' data:`.
  - **Criterio de aceptación:** las cabeceras servidas coinciden con las declaradas.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [ ] **[T4-03] Decidir sobre privacidad y datos personales**
  - **Área:** Legal · **Severidad:** *requiere revisión legal*
  - **Ubicación:** `index.html:46-51`
  - **Qué hacer:** hoy el sitio **no** usa cookies, ni analítica, ni almacenamiento, ni
    formularios — verificado en la pestaña de red: cero peticiones a terceros salvo Google Fonts.
    Por eso **no** necesita banner de cookies. El único punto abierto es que cargar Inter desde
    `fonts.gstatic.com` transmite la IP del visitante a Google; hay jurisprudencia europea
    (Múnich, 2022) que lo ha considerado tratamiento sin base legal. Con la normativa declarada
    para este proyecto ("ninguna") no es exigible, pero **T2-04 lo elimina de paso** al
    auto-hospedar la fuente. Si algún día se añade analítica o un formulario de contacto, habrá
    que publicar política de privacidad y consentimiento — y eso sí requiere revisión legal.
  - **Criterio de aceptación:** T2-04 cerrada, o decisión explícita registrada en `CONTEXT.md`.
  - **Esfuerzo:** bajo · **Depende de:** T2-04

- [ ] **[T4-04] Evaluar prerender / SSG**
  - **Área:** Rendimiento / SEO
  - **Qué hacer:** el LCP medido es 3.011 s con **2.946 s de render delay** — el cuello de botella
    es que no hay ni un carácter de contenido en el HTML hasta que React arranca. Prerenderizar el
    HTML en build (`vite-plugin-prerender`, o migrar a Astro/Next) atacaría la causa raíz, en vez
    de los 507 ms de T2-04 o los 540 ms de T2-05. Es un cambio de arquitectura: evaluar solo si
    T2-04/T2-05/T2-06 no bastan.
  - **Criterio de aceptación:** decisión registrada en `CONTEXT.md`, con o sin implementación.
  - **Esfuerzo:** alto · **Depende de:** T2-04, T2-05, T2-06

- [ ] **[T4-05] Publicar un `llms.txt`**
  - **Área:** SEO · **Ubicación:** `public/`
  - **Qué hacer:** la categoría *Agentic Browsing* de Lighthouse puntúa 67 y señala la ausencia de
    `llms.txt`. Es una convención emergente, no un estándar; para un portafolio que cada vez leen
    más herramientas de reclutamiento automatizadas, tiene sentido. Bajo impacto, coste mínimo.
  - **Criterio de aceptación:** `/llms.txt` existe con un H1 y enlaces.
  - **Esfuerzo:** bajo · **Depende de:** T1-06

- [ ] **[T4-06] `skills-lock.json`: JSON inválido y desactualizado** *(viene de BACKLOG 5)*
  - **Área:** Herramientas · **Ubicación:** `skills-lock.json` (fuera del repositorio, en `.gitignore`)
  - **Qué hacer:** el primer byte es `@` (`0x40`), así que el archivo empieza con `@{` y
    `JSON.parse` falla en el carácter 1 — probablemente un `Out-File` de PowerShell que arrastró
    el `@` de un literal `@{`. Se arregla borrando un carácter. Además el lock está
    desactualizado: 17 skills instaladas, 10 fijadas. **Ya se decidió dejarlo** (ver *Decisiones
    cerradas*); queda aquí solo como recordatorio por si la herramienta de skills empieza a fallar
    al leerlo.
  - **Criterio de aceptación:** ninguno — tarea de vigilancia, no de ejecución.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

---

## Progreso

| Fecha | Qué se cerró | Notas |
|---|---|---|
| 2026-07-28 | T0-01, T0-02, T0-03 | Tier 0 completo. PR #1 y PR #5. |
| 2026-09-08 | — | Auditoría completa de las 13 áreas (código y navegador). Se migró `docs/BACKLOG.md` a este archivo, se numeraron las 27 tareas heredadas y se añadieron 33 nuevas. Ninguna corrección aplicada: la Fase 2 no estaba aprobada. |

---

## Decisiones cerradas

Lo que se decidió **no** hacer, y por qué. No volver a proponerlo sin un hecho nuevo que invalide
la decisión.

| Decisión | Motivo | Fecha |
|---|---|---|
| **El verificador de enlaces no corre en cada PR** | Los enlaces externos flaquean por causas ajenas al commit, y romper PRs por eso entrena a ignorar el CI. Corre por cron semanal y abre un issue. | 2026-07-28 |
| **`lychee` excluye LinkedIn** | Devuelve 999 a todo cliente sin sesión de navegador. Sería un falso positivo permanente. Verificado con `curl`. | 2026-07-28 |
| **`lychee` excluye las raíces de `fonts.googleapis.com` y `fonts.gstatic.com`** | Son orígenes de `preconnect`, no documentos: su raíz devuelve 404. El ancla `/?$` deja que sí se compruebe la URL real del CSS de Inter. | 2026-07-28 |
| **No arreglar `skills-lock.json`** | Es una herramienta local, está en `.gitignore` y no afecta al proyecto. Se deja documentado en T4-06 por si algún día molesta. | 2026-07-28 |
| **Sin banner de cookies** | El sitio no usa cookies, ni analítica, ni almacenamiento local, ni formularios. Verificado en la pestaña de red el 2026-09-08: cero peticiones a terceros salvo la fuente. Un banner aquí sería teatro de cumplimiento. Revisar solo si se añade analítica (T4-03). | 2026-09-08 |
| **Sin tests de componentes que solo renderizan datos estáticos** | Es ceremonia: afirmarían que `map` funciona. El valor está en las funciones puras (T2-07) y en los flujos de interacción (T2-10). | 2026-07-28 |
| **Los tamaños de texto de cuerpo no son fluidos** | Solo los de display (`--text-3xl` a `--text-6xl`) usan `clamp`. Los de cuerpo usan los valores por defecto de Tailwind a propósito: 16 px mínimo en móvil, sin sorpresas de legibilidad. | 2026-07-28 |
