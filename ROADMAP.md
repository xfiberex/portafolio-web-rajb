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
| **Tier 1** | Alta prioridad — accesibilidad AA, build y documentación que engaña | 9 | 0 | — (cerrado) |
| **Tier 2** | Mejoras sustanciales — rendimiento, QA, SEO, contenido | 22 | 11 | bajo·6 medio·4 alto·1 |
| **Tier 3** | Pulido y mantenimiento | 20 | 19 | bajo·14 medio·5 |
| **Tier 4** | Futuro / opcional | 6 | 5 | bajo·4 alto·1 |
| | **Total** | **60** | **35** | |

**No hay ninguna tarea de Tier 0 abierta.** La auditoría del 2026-09-08 no encontró
vulnerabilidades explotables, pérdida de datos ni fallos que rompan producción. Las tres
tareas de Tier 0 son las del backlog anterior, ya cerradas.

**Tier 1 quedó cerrado el 2026-09-08**, junto con T2-13. Lo siguiente es Tier 2, donde el
mayor retorno medido está en T2-04 (507 ms de FCP/LCP) y T2-05 (540 ms de forced reflow).

> ✅ **Verificado en producción el 2026-09-08:** `/ruta-que-no-existe` → **404**, `/robots.txt`
> 200 `text/plain`, `/sitemap.xml` 200 **`application/xml`**, Lighthouse móvil **SEO 100 ·
> Accesibilidad 100 · Buenas prácticas 100** (48 auditorías, 0 fallos) y consola limpia con el
> CSP cerrado a `'self'`. Cierra los criterios de **T1-06** y **T2-13**.
>
> ⚠️ **Queda solo T1-04**: el tamaño del bundle en un *deploy preview*, que necesita una pull
> request — el contexto `deploy-preview` no existe ni en producción ni en un build local.

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

## Tier 1 — Alta prioridad ✅ (cerrado 2026-09-08)

### Accesibilidad (WCAG 2.2 — fallos medidos en producción)

- [x] **[T1-01] Subir el contraste del texto sobre el botón primario a 4.5:1**
  - **Área:** Accesibilidad · **Severidad:** Alto
  - **Ubicación:** `src/index.css:32-35` (tokens) · `src/components/Hero.tsx:60` ·
    `src/components/Contact.tsx:35` · `src/components/ui/SkipLink.tsx:10` ·
    `src/components/ui/Lightbox.tsx:108`
  - **Qué hacer:** ⚠️ *prescripción original, conservada como registro —* **no funciona**,
    ver la nota de cierre abajo antes de reutilizar este razonamiento.
    El par `--value-primary` (`#487fff`) + `--value-primary-foreground`
    (`#f8f8f8`) da **3.44:1**, por debajo del 4.5:1 que exige WCAG 1.4.3 para texto normal
    (los botones usan `text-sm` = 14 px). Oscurecer `--value-primary` hasta llegar a 4.5:1
    (bajar la L de `oklch(62.8% 0.2 264)` a ~54-55 % lo consigue manteniendo el tono), o subir
    el texto a 18.66 px + bold para entrar en "texto grande" (3:1). Preferible lo primero:
    cambia un token y arregla los 4 componentes de golpe. Revisar después que
    `--value-primary-hover` siga siendo distinguible.
  - **Criterio de aceptación:** los 4 componentes ≥ 4.5:1 medido con axe o DevTools, y
    `--value-ring` mantiene ≥ 3:1 sobre `--value-background`.
  - **Esfuerzo:** bajo · **Depende de:** ninguna
  - **Cerrada:** 2026-09-08 · ⚠️ **resuelta de otra forma que la prescrita.** Oscurecer
    `--value-primary` a 54-55 % **no funciona**: ese token cumple dos papeles con
    requisitos opuestos. Como relleno de botón necesita L ≤ 56.5 % (para que el texto
    claro encima llegue a 4.5:1); como `text-primary` sobre superficie oscura —14 usos,
    varios a `text-xs`— necesita L ≥ 59.5 %. **Los dos rangos no se solapan.** A L=54 %
    los botones habrían pasado a 4.99:1 pero `text-primary` habría caído a 3.72:1 y el
    badge de T1-03 a 3.18:1: la corrección habría *roto* la tarea que decía arreglar.
    Solución aplicada: separar los papeles. `--value-primary` se queda en 62.8 % (ya
    cumplía: 5.38:1 sobre fondo) y se añaden `--value-primary-strong` (56 %) y
    `--value-primary-strong-hover` (50 %) para los rellenos. `--value-primary-hover`
    se elimina: sólo lo usaban esos botones. Medido en navegador: botones 4.56:1,
    hover 5.91:1, ring 6.98:1.
  - **Hallazgo extra:** el estado `hover` de los botones estaba a **4.42:1** y tampoco
    cumplía. No figuraba en la auditoría del 2026-09-08.

- [x] **[T1-02] Permitir detener la animación de texto del Hero y respetar `prefers-reduced-motion`**
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
  - **Cerrada:** 2026-09-08 · hook `usePrefersReducedMotion` con `useSyncExternalStore`.
    Verificado los dos sentidos: sin preferencia **16 valores distintos en 6 s**, con
    preferencia **1 solo valor en 15.1 s**. ⚠️ El MCP de Chrome DevTools no emula
    `prefers-reduced-motion`, así que se parcheó `matchMedia` antes de los scripts: eso
    prueba la lógica y la query, **no** que el navegador resuelva la media query real.
    Eso lo cierra T2-10 con Playwright, que sí la emula.

- [x] **[T1-03] Subir el contraste del badge de periodo en Educación**
  - **Área:** Accesibilidad · **Severidad:** Medio (WCAG 1.4.3 AA)
  - **Ubicación:** `src/components/Education.tsx:40-42`
  - **Qué hacer:** `#487fff` sobre `#162137` da **4.4:1** a 12 px, justo por debajo de 4.5:1.
    Lo resuelve T1-01 si el token primario se oscurece lo suficiente; si no, hay que aclarar el
    texto u oscurecer `bg-primary-soft`.
  - **Criterio de aceptación:** ≥ 4.5:1 medido.
  - **Esfuerzo:** bajo · **Depende de:** T1-01
  - **Cerrada:** 2026-09-08 · **no lo resolvió T1-01**, al contrario (ver su nota). Se bajó
    el alpha de `--value-primary-soft` de 12 % a 8 %, que oscurece el fondo del badge y sube
    el contraste. Medido en navegador: **4.66:1**.

### Build y despliegue

- [x] **[T1-04] Quitar `NODE_ENV=development` de los deploy previews**
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
  - **Cerrada:** 2026-09-08 · bloque `environment` eliminado, `X-Robots-Tag` conservado.
    ⏳ **El criterio queda pendiente de un deploy preview real.**
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [x] **[T1-05] Corregir el requisito de Node en el README**
  - **Área:** Documentación · **Severidad:** Alto
  - **Ubicación:** `README.md:56`
  - **Qué hacer:** dice "Node.js (versión 18 o superior)". Vite 7 exige
    `^20.19.0 || >=22.12.0` y ESLint 10 exige `^20.19.0 || ^22.13.0 || >=24`. Quien siga el
    README con Node 18 no consigue arrancar el proyecto. Poner el requisito real y alinearlo con
    el `NODE_VERSION = "22"` de `netlify.toml` y el `node-version: 22` de `ci.yml`.
  - **Criterio de aceptación:** el README declara Node ≥ 20.19 (recomendado 22) y coincide con
    CI y Netlify.
  - **Cerrada:** 2026-09-08
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [x] **[T1-06] Eliminar el soft 404 y publicar un `robots.txt`**
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
  - **Cerrada:** 2026-09-08 · fallback eliminado de `netlify.toml` y `public/_redirects`
    borrado. Verificado sirviendo `dist/` con un servidor estático plano (`vite preview`
    hace su propio fallback SPA y habría enmascarado el resultado): 404 correcto y
    `robots.txt` 200 `text/plain`.
  - ✅ **Confirmado en producción 2026-09-08:** `/ruta-que-no-existe` devuelve 404 y
    **Lighthouse SEO = 100** (móvil, 48 auditorías, 0 fallos). Criterio completo.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

### Peso y robustez

- [x] **[T1-07] Borrar las dos imágenes huérfanas**
  - **Área:** Refactorización · **Severidad:** Alto (impacto alto, esfuerzo mínimo)
  - **Ubicación:** `public/projects/GestorTareasMERN.png` (512 KB) ·
    `public/projects/SistemaVentasDesktop.png` (84 KB)
  - **Qué hacer:** ningún proyecto de `src/data/projects.ts` las referencia desde que se
    sustituyeron por TrackerMultimedia y Stockly (commit `57e4320`), pero se siguen copiando a
    `dist/projects/` y publicando. **0.58 MB** de descarga potencial muerta, y la mayor de las
    dos es el archivo más pesado del repositorio.
  - **Criterio de aceptación:** `dist/projects/` contiene exactamente las 6 imágenes
    referenciadas; el peso total de imágenes baja de 1.68 MB a 1.10 MB.
  - **Cerrada:** 2026-09-08 · medido tras el build: 6 archivos, **1.10 MB**. Desbloquea T2-02.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [x] **[T1-08] Añadir un Error Boundary de React**
  - **Área:** Auditoría de código · **Severidad:** Medio
  - **Ubicación:** `src/main.tsx:7-19` · `src/App.tsx:11-24`
  - **Qué hacer:** no hay ningún límite de error. Una excepción en cualquier componente deja la
    página **completamente en blanco**, el mismo síntoma que tener JavaScript desactivado, y sin
    ningún mensaje. Envolver `<App />` en un error boundary que pinte un mensaje mínimo con el
    email de contacto y un enlace al CV.
  - **Criterio de aceptación:** forzar un `throw` en un componente muestra el mensaje de respaldo
    en vez de una página vacía.
  - **Cerrada:** 2026-09-08 · `ErrorBoundary` envolviendo `<App />`. El fallback no importa
    Framer Motion, lucide-react ni componentes propios: lo que se pinta cuando la UI se rompe
    no debe depender de la UI rota. Verificado con un `throw` real.
  - ⚠️ **Límite conocido:** un error *de importación* o en `main.tsx` sigue dando página en
    blanco. Los error boundaries sólo capturan durante el render del árbol de componentes.
    Para el caso sin JS, ver T2-14.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [x] **[T1-09] Corregir las afirmaciones falsas del README**
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
  - **Cerrada:** 2026-09-08 · además de las tres listadas aparecieron **cinco más**:
    «Redirects para SPA» (que T1-06 acababa de eliminar), «Formulario de contacto» (no hay
    ningún `<form>`) y la afirmación anti-scraping repetida en 4 sitios distintos. Sobre WCAG
    se evitó sustituir una afirmación no verificada por otra: el README ahora lista lo medido
    y dice explícitamente que no hay auditoría completa.
  - **Esfuerzo:** bajo · **Depende de:** T1-01, T1-02, T1-03

---

## Tier 2 — Mejoras sustanciales

### Rendimiento

- [x] **[T2-01] Elegir herramienta de conversión a WebP** *(viene de BACKLOG 1.1)*
  - **Área:** Rendimiento · **Ubicación:** `package.json`, `vite.config.ts`
  - **Qué hacer:** decidir entre `sharp` (script de build) y `vite-imagetools` (transforma en el
    import). Registrar la decisión y la alternativa descartada en `CONTEXT.md`.
  - **Criterio de aceptación:** decisión escrita en `CONTEXT.md` y dependencia instalada.
  - **Cerrada:** 2026-09-08 · **`sharp`** en `scripts/images-to-webp.mjs` (`npm run images:webp`).
    `vite-imagetools` queda descartado por arquitectura, no por gusto: transforma en el *import*, y
    aquí las capturas viven en `public/` referenciadas como cadenas que `toAssetUrl` resuelve en
    runtime. Habría exigido moverlas a `src/`, pasar la capa de datos a `import.meta.glob` y tocar
    `ProjectCard` y `Lightbox` — un refactor para una conversión que se hace una vez. El script no
    corre en el build: ni build ni CI pagan la conversión.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [x] **[T2-02] Convertir a WebP las 6 imágenes que sí se usan** *(corrige BACKLOG 1.1)*
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
  - **Cerrada:** 2026-09-08 · **1123 kB → 291 kB (-74 %)**, muy por encima del 50 % pedido. Calidad
    85, elegida midiendo; verificado en el lightbox a escala casi 1:1 (1150×765 sobre un original de
    1304×867) que el texto de las capturas sigue nítido. Las 6 cargan, ninguna rota.
  - **Actualización 2026-09-08:** se reemplazó la captura del propio portafolio por una del diseño
    nuevo (1120×848) y se convirtió con el mismo script: **281 kB → 74 kB (-74 %)**. `og-image.jpg`
    se regeneró desde ella, porque deriva de esa captura y si no la tarjeta social seguiría
    mostrando el diseño anterior. Total de imágenes publicadas: **342 kB** (6 WebP + la OG).
  - ⚠️ **Rompí la tarjeta social y lo arreglé en el acto:** `og:image` apuntaba a
    `projects/Porfolio-web-rajb.png`, que este cambio borra. Se generó `public/og-image.jpg`
    **1200×630** (90 kB) y se apuntaron ahí `og:image` y `twitter:image`, añadiendo
    `og:image:width/height`. Eso cubre la parte medible de **T2-15** (proporción correcta, sin
    recorte en LinkedIn) pero **no su intención de diseño**: sigue siendo una captura recortada, no
    una pieza con nombre, rol y stack. T2-15 queda abierta para eso. De paso, la URL pública deja de
    arrastrar la errata «Porfolio» (T3-20).
  - **Nota:** el banner del README también apuntaba al PNG borrado. Corregido. Es exactamente el
    fallo que T2-12 quiere que el verificador de enlaces detecte solo.
  - **Esfuerzo:** bajo · **Depende de:** T1-07, T2-01

- [x] **[T2-03] Decidir sobre el respaldo PNG** *(viene de BACKLOG 1.1)*
  - **Área:** Rendimiento · **Ubicación:** `src/components/projects/ProjectCard.tsx:66,94`
  - **Qué hacer:** mantener un `<picture>` con respaldo PNG, o confirmar que el soporte de WebP
    alcanza al mínimo de navegadores declarado (ver T2-19, que es quien lo declara).
  - **Criterio de aceptación:** decisión registrada en `CONTEXT.md`.
  - **Cerrada:** 2026-09-08 · **sin respaldo PNG.** WebP es universal desde Safari 14 (2020);
    un navegador sin WebP tampoco ejecuta React 19, Tailwind 4 ni `oklch()`. Mantener el respaldo
    duplicaba el peso publicado para cubrir un navegador que vería la página rota igualmente.
  - ⚠️ **Se cierra antes que T2-19**, de la que depende formalmente. Si al declarar el
    `browserslist` el mínimo resultara anterior a 2020, hay que revisar esta decisión.
  - **Esfuerzo:** bajo · **Depende de:** T2-02, T2-19

- [x] **[T2-04] Auto-hospedar la fuente Inter**
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
  - **Cerrada:** 2026-09-08 · **cero peticiones a terceros** (7 en total, todas propias).
    Se sirve la fuente **variable** de Inter: un archivo por subset cubre los 4 pesos, así que
    son 2 `@font-face` con `font-weight: 400 700`, no 8. `latin-ext` se declara pero **no llega
    a descargarse** — el `unicode-range` lo impide y ningún carácter del contenido lo necesita
    (medido: 0 de 12 no-ASCII). Se añadió `<link rel=preload>`: sin él la fuente no se descubre
    hasta parsear el CSS. Verificado que es la petición **#2**, antes del JS y del CSS.
  - **A/B medido** (dos contextos aislados, mismas condiciones, servidos ambos desde localhost):

    | | Antes | Después |
    |---|---:|---:|
    | FCP | 276 ms | **104 ms** |
    | LCP | 924 ms | **740 ms** |
    | Peticiones a terceros | 1 | **0** |
    | Coste de la hoja de estilos | 167 ms | 5 ms (propia) |

    ⚠️ El coste del CSS de Google **varía muchísimo** según la conexión esté fría o caliente:
    medido **1175 ms** en la primera carga sin caché y **167 ms** con DNS/TLS ya establecido.
    Los 507 ms que estimó la auditoría sobre producción caen entre ambos. Lo que no varía es
    que era una dependencia de terceros en el camino crítico, y ya no existe.
  - **CSP cerrado:** `style-src 'self' 'unsafe-inline'` y `font-src 'self'`. Se retiró también
    la exclusión de Google Fonts de `lychee.toml`, que quedaba muerta.
  - **Licencia:** Inter es SIL OFL 1.1; se publica `public/fonts/LICENSE.txt` junto a los
    `.woff2`. Auto-hospedar la fuente hace la atribución obligatoria — ver T3-04.
  - **Esfuerzo:** medio · **Depende de:** ninguna

- [x] **[T2-05] Reducir el reflow forzado**
  - **Área:** Rendimiento · **Ubicación:** `src/lib/animations.ts` · todas las secciones con
    `whileInView`
  - **Qué hacer:** ⚠️ *diagnóstico original — **la atribución era incorrecta**, ver la nota de
    abajo antes de actuar sobre él.* La traza de producción acusa **540 ms de forced reflow**.
    Atribuido con sourcemap a `framer-motion/batcher.mjs` llamado desde `PopChild.mjs` — es decir,
    al bucle de render de la librería, **no** a `useScrollspy` como cabría suponer. El sitio anima
    ~56 elementos con `whileInView`. Reducir el número de elementos animados (animar el contenedor
    de cada sección en vez de cada tarjeta y cada párrafo) y volver a medir.
  - **Criterio de aceptación:** el insight *ForcedReflow* baja de 200 ms en la misma traza
    (móvil, Slow 4G, CPU 4×).

  - 🔍 **Corrección del diagnóstico (2026-09-08).** La atribución por sourcemap era engañosa:
    `PopChild.mjs` es código de `AnimatePresence mode="popLayout"`, que este proyecto **no usa**.
    Medido instrumentando los getters de layout y cronometrando cada lectura durante un recorrido
    completo (móvil, Slow 4G, CPU 4×):

    | Origen | Lecturas | Coste |
    |---|---:|---:|
    | `useScrollspy` (`scrollHeight` + `offsetTop`) | 582 | **740.2 ms** |
    | Framer Motion (`scrollTop` + `getBoundingClientRect`) | 20 | 0.4 ms |

    **El 99.9 % del coste era `useScrollspy`, no la librería.** `checkIfAtBottom()` leía
    `document.documentElement.scrollHeight` en cada frame de scroll, y esa propiedad fuerza un
    layout síncrono cuando los estilos están invalidados — que con ~56 elementos animándose es
    casi siempre. Reducir los elementos animados, que es lo que prescribía la tarea, habría
    tocado el 0.05 % del problema.

  - ✅ **Aplicado 2026-09-08:** `useScrollspy` cachea la geometría (alto de página y `offsetTop`
    de cada sección) y la refresca solo al redimensionar y vía `ResizeObserver` —nunca al
    scrollear—. Resultado medido en idénticas condiciones: **740.6 ms → 0.5 ms** de coste de
    lecturas de layout, de 602 lecturas a 39. Comportamiento verificado idéntico al original:
    7/7 secciones, fin de página y estado inicial (una primera versión sí introdujo una
    regresión ahí —marcaba una sección arbitraria arriba del todo— y se corrigió).

  - **Criterio reescrito y cerrada: 2026-09-09.** El criterio original —que el *insight*
    ForcedReflow de DevTools bajara de 200 ms— **no sirve para decidir aquí**: no mide el coste de
    las lecturas de layout sino la duración de las tareas que las contienen, DevTools reporta
    *estimated savings: none* sobre él, y en dos trazas de la misma página el LCP varió de 1281 a
    2471 ms. Se sustituye por la métrica determinista y causal: **el coste de las lecturas de
    layout durante un recorrido completo, que pasó de 740.6 ms a 0.5 ms.**
  - 📌 **Lo que queda, si alguien quiere seguirlo:** el insight sigue marcando ~670 ms, atribuidos
    a las tareas de animación de Framer Motion, no a lecturas de layout. Ese es el mismo cuello que
    describe T4-04 (el 98 % del LCP es esperar a que React arranque) y se ataca desde ahí, no desde
    este hook.
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

- [x] **[T2-07] Vitest sobre las funciones puras** *(viene de BACKLOG 4.5)*
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
  - **Cerrada:** 2026-09-09 · Vitest, **87 tests**, paso `Tests` añadido a `ci.yml` antes del build.
  - **Criterio verificado de verdad, no asumido:** se añadió una tecnología ficticia a `skills.ts` y
    **el test falló**, con un mensaje que dice qué hacer. Lo cazan dos comprobaciones: el `it.each`
    por tag y una que exige que la lista de pendientes coincida **exactamente** con lo que falta,
    para que no se pudra cuando alguien añada un icono y olvide sacarlo de la lista.
  - **Recuento real:** 78 tags únicos, 11 sin icono — no los «14 de 109» del enunciado, que contaba
    apariciones y además partía de datos ya cambiados.
  - **Dos hallazgos al escribir los tests:**
    1. `toAssetUrl` trata como absoluta **cualquier** ruta que empiece por `//`, así que
       `//projects/x.webp` apuntaría al host `projects`, no a una carpeta local. No hay ningún dato
       así hoy; queda fijado por un test para que nadie lo escriba creyéndolo local.
    2. Exportar las dos funciones dispara `react-refresh/only-export-components`, que tiene razón:
       el archivo mezcla el componente con sus utilidades. Excepción acotada a dos líneas; la
       solución de fondo es **T3-16**.
  - **Esfuerzo:** medio · **Depende de:** ninguna

- [ ] **[T2-08] Lighthouse CI con budgets que fallen el build** *(viene de BACKLOG 4.1)*
  - **Área:** QA · **Ubicación:** `.github/workflows/`
  - **Qué hacer:** `@lhci/cli` contra `vite preview` o la URL del deploy preview. **Budgets que
    fallen**, no solo reporten. Línea base medida el 2026-09-08 en producción (móvil):
    accesibilidad 96, buenas prácticas 100, SEO 92, LCP 3.011 s, CLS 0.00. Alternativa más
    barata: `@netlify/plugin-lighthouse`.
  - **Criterio de aceptación:** el workflow falla si SEO < 100, accesibilidad < 100 o LCP > 2.5 s.
  - **Esfuerzo:** medio · **Depende de:** T1-04, T1-06

- [x] **[T2-09] axe-core en CI** *(viene de BACKLOG 4.2)*
  - **Área:** QA · **Ubicación:** `.github/workflows/`
  - **Qué hacer:** el score de accesibilidad de Lighthouse es superficial; axe detecta bastante
    más. ⚠️ **Trampa descubierta el 2026-09-08:** con las animaciones `whileInView` en su estado
    inicial, **23 de los 29 elementos interactivos de `<main>` están a `opacity: 0`** cuando la
    herramienta mide, y las herramientas automáticas no auditan lo invisible. El 96 de Lighthouse
    se calculó sobre poco más que el Hero. El scan de axe **debe** recorrer la página y esperar a
    que las animaciones terminen antes de medir, o forzar `prefers-reduced-motion`.
  - **Criterio de aceptación:** el scan cubre las 8 secciones (comprobable por el número de nodos
    auditados) y falla el build ante cualquier violación *serious* o *critical*.
  - **Cerrada:** 2026-09-09 · Playwright + `@axe-core/playwright` en `e2e/a11y.spec.ts`, corriendo
    en CI **después** del build y contra `vite preview`, o sea contra lo que se publica.
    **1586 nodos auditados en 37 reglas**, con el número impreso en el log de CI como evidencia.
    El paso falla ante cualquier violación *serious* o *critical* y sube el informe como artefacto.
  - **La trampa, resuelta y ampliada.** No basta con `reducedMotion: "reduce"`: la preferencia
    quita la duración de la animación pero **no** los `delayChildren`/`staggerChildren`, así que hay
    que recorrer la página igual y luego esperar. Y hubo un segundo nivel que la auditoría no había
    visto: **una opacidad intermedia tampoco es inocua**. La regla de contraste de axe *mezcla el
    color con el fondo* según la opacidad heredada, así que una tarjeta a 0.93 reportaba
    `#4376ec` en vez de `#487fff` y producía una violación fantasma de 4.47:1. Aparecieron dos así
    en Certificados. El test espera a que **toda** la opacidad heredada sea exactamente 1, no
    simplemente distinta de 0.
  - **Un test guarda al otro:** «todo `<main>` está visible cuando se audita» corre antes del scan;
    si falla, el verde de axe no significaría nada. Verificado estable en 3 corridas seguidas.
  - 🔧 **Arreglado el 2026-09-09 tras romper CI (#14):** Vitest recogía `e2e/*.spec.ts` —su
    patrón por defecto incluye `*.spec.*`— e intentaba correr los tests de Playwright.
    Acotado `test.include` a `src/**/*.test.{ts,tsx}` en `vite.config.ts`. Ver *Trampas
    conocidas* en CONTEXT.md.
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

- [x] **[T2-12] Que el verificador de enlaces cubra el README y `docs/`**
  - **Área:** QA · **Ubicación:** `.github/workflows/links.yml:40-48`
  - **Qué hacer:** los globs actuales son `index.html`, `src/**/*.ts` y `src/**/*.tsx`. El
    `README.md` queda fuera y contiene enlaces rotos hoy mismo (ver T3-01). Añadir `README.md`,
    `ROADMAP.md`, `CONTEXT.md` y `docs/**/*.md`.
  - **Criterio de aceptación:** el resumen de lychee muestra un `Total` mayor que 23 y detecta el
    enlace de LinkedIn sin esquema del README.
  - **Cerrada:** 2026-09-09 · añadidos `README.md`, `ROADMAP.md`, `CONTEXT.md`, `CHANGELOG.md` y
    `docs/**/*.md`. Contadas las URLs `http(s)` únicas de los globs: **21 → 42**, así que el `Total`
    superará holgadamente 23.
  - ⏳ **La segunda mitad del criterio la confirma el runner**, no se puede en local (lychee no está
    instalado aquí). Verificado en cambio que el cebo sigue puesto:
    `[linkedin.com/in/tu-perfil](www.linkedin.com/in/ricky-...)` está en el README **sin esquema**.
  - ⚠️ **Orden importante:** ese enlace roto es justo lo que **T3-01** arregla. Conviene lanzar
    `links.yml` a mano (Actions → Enlaces → *Run workflow*) **antes** de cerrar T3-01, para
    comprobar que el verificador lo caza. Si se arregla primero, se pierde el único caso de prueba.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

### SEO y contenido

- [x] **[T2-13] Publicar `sitemap.xml`**
  - **Área:** SEO · **Ubicación:** `public/`
  - **Qué hacer:** una sola URL, pero es lo que enlaza el `robots.txt` de T1-06 y lo que consume
    Search Console.
  - **Criterio de aceptación:** `/sitemap.xml` devuelve 200 con `application/xml`.
  - **Cerrada:** 2026-09-08 · sin `<changefreq>` ni `<priority>` (Google los ignora desde 2023).
    El `Content-Type` se declara en `netlify.toml` en vez de confiar en la tabla MIME por
    defecto de Netlify, que no es contrato público.
  - ✅ **Confirmado en producción 2026-09-08:** `/sitemap.xml` responde 200 con
    **`application/xml; charset=utf-8`**. Criterio completo. Declararlo fue acertado: el
    servidor estático local lo servía como `text/xml`.
  - **Esfuerzo:** bajo · **Depende de:** T1-06

- [x] **[T2-14] Añadir un `<noscript>`**
  - **Área:** SEO / UX · **Ubicación:** `index.html:96-99`
  - **Qué hacer:** el `<body>` solo contiene `<div id="root"></div>`. Sin JavaScript el visitante
    ve una página **completamente en blanco**, sin una sola palabra. Añadir un `<noscript>` con
    el nombre, el rol, el email y los enlaces al CV, GitHub y LinkedIn — lo mínimo para que un
    reclutador con un proxy corporativo restrictivo siga teniendo cómo contactar.
  - **Criterio de aceptación:** con JavaScript desactivado se ve nombre, rol y datos de contacto.
  - **Cerrada:** 2026-09-08 · verificado renderizando la página dentro de un `<iframe sandbox>`
    **sin** `allow-scripts`, que es la condición real que activa `<noscript>`: 268 caracteres
    visibles donde antes había 0, con `<h1>`, rol y los 3 enlaces (CV 200 `application/pdf`,
    GitHub, LinkedIn). Con JS activo el bloque no renderiza nada: un solo `<h1>` y cero
    duplicación de contenido.
  - ⚠️ **Desvío deliberado del enunciado:** la tarea pedía incluir «el email», pero un `mailto:`
    aquí se lo entregaría en bandeja justo a los bots que **no** ejecutan JavaScript — que son
    exactamente de los que protege `ObfuscatedEmail` (T3-13). Va como texto ofuscado
    (`[at]`/`[dot]`), legible para una persona y sin enlace. La dirección literal sigue teniendo
    **0 ocurrencias** en `dist/index.html`. El README se ajustó para no volver a afirmar de más.
  - **Estilos en línea** a propósito: no dependen de que Tailwind escanee `index.html`. El CSP
    ya permite `'unsafe-inline'` en `style-src` por Framer Motion.
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

- [x] **[T2-19] Declarar los navegadores soportados**
  - **Área:** DevOps · **Ubicación:** `package.json`
  - **Qué hacer:** no hay `browserslist`, ni polyfills, ni una línea en el README que diga contra
    qué se prueba. Sin soporte declarado nadie puede decidir si un fallo es un bug o un navegador
    fuera de alcance — y bloquea T2-03 (¿alcanza el soporte de WebP?) y cualquier prueba en
    Safari/iOS.
  - **Criterio de aceptación:** `package.json` declara `browserslist` y el README dice cuál es el
    mínimo.
  - **Cerrada:** 2026-09-09 · **Chrome/Edge 111, Safari/iOS 16.4, Firefox 128.** El mínimo no se
    eligió: lo fija **Tailwind CSS 4**, que depende de `@property` y `color-mix()` — confirmado en su
    documentación oficial, no deducido de las features del proyecto (`oklch()` solo, por ejemplo,
    habría dado Firefox 113).
  - ✅ **Valida retroactivamente T2-03:** WebP necesita Safari 14 y este baseline exige 16.4, así que
    la decisión de no mantener respaldo PNG queda confirmada, no asumida.
  - **Nota:** ni Vite ni Tailwind leen ese `browserslist` (Tailwind tiene objetivos fijos, Vite usa
    su `build.target`). Es una **declaración de soporte**, que es justo lo que pedía la tarea: sin
    ella nadie puede decidir si un fallo es un bug o un navegador fuera de alcance.
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
  - **Avance parcial 2026-09-09 (con T2-07):** corregido el caso ya diagnosticado —la regla pasó a
    `/win(dows)?\s*forms/i` y **WinForms** resuelve. El recuento real hoy es **11 de 78 tags únicos**,
    ya separados en dos listas explícitas dentro de `TechIcon.test.ts`: seis competencias sin
    logotipo posible (decisión, no deuda) y **cuatro productos que sí deberían tenerlo — Jest,
    Playwright (E2E), Supertest y TanStack Query—**, que es lo único que queda de esta tarea.
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

- [x] **[T3-02] Actualizar el árbol de estructura del README**
  - **Área:** Documentación · **Ubicación:** `README.md:98-140`
  - **Qué hacer:** el árbol omite la carpeta `components/projects/`, `lib/assets.ts` y 5 de los 6
    componentes de `components/ui/`; dice `hooks/useScrollspy.tsx` cuando el archivo es `.ts`.
  - **Criterio de aceptación:** el árbol coincide con `src/`.
  - **Cerrada:** 2026-09-08 · reescrito entero contra un listado real de archivos, no a ojo.
    Incluye lo añadido en esta tanda (`ui/ErrorBoundary.tsx`, `hooks/usePrefersReducedMotion.ts`,
    `lib/contact.ts`, `public/fonts/`, `scripts/`) y corrige la extensión de `useScrollspy`.
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
    hueco cuando muestra una corta. Es el precio correcto de no tener CLS, pero se puede afinar
    midiendo la altura real en lugar de estimarla.
  - ⚠️ **Corrección del dato (2026-09-08): el CLS no es 0.00.** Esa cifra sale de una traza de
    carga corta; observando `layout-shift` durante 6 s el sitio acumula **~0.004-0.006 en unos
    100 desplazamientos diminutos**, y sigue acumulando mientras el Hero teclea. Verificado que
    la causa es el propio texto animado: con `prefers-reduced-motion` activo (T1-02) el CLS es
    **exactamente 0, cero desplazamientos**; con el tecleo activo y todo lo demás igual, 102.
    Verificado también que **no lo introdujo T2-04**: antes de auto-hospedar la fuente era
    0.0062/41 desplazamientos y después 0.0064/42 — idéntico dentro del ruido.
    Sigue muy por debajo del umbral 0.1 de *good*, así que no es un defecto; pero partir de
    «CLS = 0.00» lleva a creer que cualquier valor distinto es una regresión propia.
  - **Criterio de aceptación:** el hueco se reduce y el CLS no empeora respecto a la línea base
    real (~0.006 con el tecleo activo, 0 con movimiento reducido).
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

- [ ] **[T3-19] Correcciones menores de estilos y configuración** *(2 de 4 puntos ya aplicados)*
  - **Área:** UI/UX · DevOps
  - **Qué hacer:** quedan los dos primeros; los dos últimos se aplicaron el 2026-09-08 al
    cerrar T1-02 y T1-06.
    - `src/index.css:84` — `--spacing-header: 4rem` (64 px) no cuenta el `border-b` del header,
      que mide 65 px de alto real; las anclas dejan **1 px** de la sección tapado. Medido.
    - `src/components/Layout.tsx:20` — el `<body>` no tiene fondo propio (computa
      `rgba(0,0,0,0)`); el color lo pone un `div` interior y el lienzo lo salva
      `color-scheme: dark`. Frágil de cara a T3-05: poner el token de fondo en `body`.
    - ~~`src/index.css:135-138` — el comentario sobre `@keyframes` de librería es falso.~~
      ✅ Aplicado 2026-09-08: el comentario ahora reparte el trabajo en tres vías
      (Framer Motion, CSS, y lo que anima con `setTimeout`).
    - ~~`netlify.toml` y `public/_redirects` — fallback SPA declarado dos veces.~~
      ✅ Aplicado 2026-09-08 con T1-06: eliminado de ambos y `_redirects` borrado.
  - **Criterio de aceptación:** los cuatro puntos aplicados.
  - **Esfuerzo:** bajo · **Depende de:** ~~T1-02, T1-06~~ ninguna (ya cerradas)

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

- [x] **[T4-03] Decidir sobre privacidad y datos personales**
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
  - **Cerrada:** 2026-09-08 · por T2-04. El sitio ya no hace **ninguna** petición a terceros,
    así que no transmite la IP del visitante a Google ni a nadie. Verificado en la pestaña de
    red: 7 peticiones, todas al propio origen. El punto de privacidad queda cerrado de raíz,
    no mitigado. Sigue sin haber cookies, analítica, almacenamiento ni formularios.
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
  - **Qué hacer:** ⚠️ **premisa desfasada (2026-09-08): esa categoría ya puntúa 100 en producción
    sin `llms.txt`**, así que el motivo original desapareció; reevaluar antes de hacerla. Decía:
    la categoría *Agentic Browsing* de Lighthouse puntúa 67 y señala la ausencia de
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
| 2026-09-08 | T3-02 | Árbol de estructura del README reescrito contra el listado real de archivos. |
| 2026-09-09 | T2-09 | axe-core en CI con Playwright: **1586 nodos auditados**, 0 violaciones serias. Se descubrió que una opacidad intermedia falsea la regla de contraste de axe (dos violaciones fantasma), así que el scan espera a opacidad exactamente 1. |
| 2026-09-09 | T2-05, T2-07, T2-12, T2-19 | Primeros tests del repositorio: **87**, con Vitest en CI. T2-05 cerrada reescribiendo un criterio que no servía para decidir. `browserslist` declarado (lo fija Tailwind 4, confirmado en su documentación) y valida retroactivamente T2-03. Verificador de enlaces ampliado a las docs. |
| 2026-09-08 | T2-01, T2-02, T2-03 | Capturas a WebP con `sharp`: **1123 kB → 291 kB (-74 %)**. Sin respaldo PNG (decisión registrada). Se rompió `og:image` al borrar los PNG y se arregló generando `public/og-image.jpg` 1200×630, que cubre la parte medible de T2-15. |
| 2026-09-08 | T2-14 | `<noscript>` con nombre, rol, email ofuscado y enlaces a CV/GitHub/LinkedIn. Verificado con scripting desactivado de verdad (iframe en sandbox): 0 → 268 caracteres visibles. |
| 2026-09-08 | T2-05 (parcial) | Reflow forzado: **740.6 ms → 0.5 ms** de coste de lecturas de layout. El diagnóstico del ROADMAP era incorrecto — el 99.9 % era `useScrollspy` leyendo `scrollHeight` en cada frame, no Framer Motion. Sigue abierta porque el insight de DevTools, que es lo que pide el criterio, no baja. |
| 2026-09-08 | T2-04, T4-03 | Inter auto-hospedada. **Cero peticiones a terceros.** FCP 276→104 ms y LCP 924→740 ms en A/B controlado; el coste del CSS de Google resultó ser mucho más variable de lo que sugería la estimación única de la auditoría (167 ms en caliente, 1175 ms en frío). CSP cerrado a `'self'`. Cierra T4-03 de raíz. |
| 2026-09-08 | T1-01 … T1-09, T2-13 | **Tier 1 completo.** Contraste verificado en navegador sobre `dist/` servido. La prescripción de T1-01 resultó ser errónea y se resolvió separando el token en dos (ver su nota); el `hover` de los botones fallaba y no estaba en la auditoría. 4 criterios quedan pendientes de un deploy preview. Aplicados de paso 2 de los 4 puntos de T3-19. |

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
| **El acento son dos tokens, no uno** | `--value-primary` (62.8 %, acento sobre superficie oscura) y `--value-primary-strong` (56 %, relleno de botón). No es duplicación: los dos papeles exigen rangos de luminosidad que **no se solapan** (L ≥ 59.5 % vs L ≤ 56.5 %). Unificarlos vuelve a romper uno de los dos. Medido, ver T1-01. | 2026-09-08 |
| **`sitemap.xml` sin `<changefreq>` ni `<priority>`** | Google los ignora desde 2023 y con una sola URL `<priority>` no ordena nada. Serían dos líneas que aparentan hacer algo. | 2026-09-08 |
| **Sin tests de componentes que solo renderizan datos estáticos** | Es ceremonia: afirmarían que `map` funciona. El valor está en las funciones puras (T2-07) y en los flujos de interacción (T2-10). | 2026-07-28 |
| **Los tamaños de texto de cuerpo no son fluidos** | Solo los de display (`--text-3xl` a `--text-6xl`) usan `clamp`. Los de cuerpo usan los valores por defecto de Tailwind a propósito: 16 px mínimo en móvil, sin sorpresas de legibilidad. | 2026-07-28 |
