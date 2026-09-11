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
| **Tier 2** | Mejoras sustanciales — rendimiento, QA, SEO, contenido | 23 | 0 | — (cerrado) |
| **Tier 3** | Pulido y mantenimiento | 20 | 0 | — (cerrado) |
| **Tier 4** | Futuro / opcional | 6 | 2 | bajo·2 |
| | **Total** | **61** | **2** | |

**No hay ninguna tarea de Tier 0 abierta.** La auditoría del 2026-09-08 no encontró
vulnerabilidades explotables, pérdida de datos ni fallos que rompan producción. Las tres
tareas de Tier 0 son las del backlog anterior, ya cerradas.

**Tiers 0, 1, 2 y 3 están cerrados**; solo quedan las opcionales de Tier 4. El repositorio pasó de **cero pruebas**
(2026-09-08) a **117 unitarias + 46 e2e + 6 snapshots visuales** (2026-09-10), todas en CI,
junto con axe en los dos temas, formato con Prettier y presupuestos de Lighthouse que fallan
el build.

> 📌 **Estado al 2026-09-11 (para retomar en otro equipo).**
> - Todo subido; CI verde en `main` y producción revisada por el dueño del repo.
> - `v2.0.0` etiquetada y publicada (T2-21). **Los tags se suben aparte:** `git push origin <tag>`.
> - T4-02 (cabeceras) y T4-05 (`llms.txt`) cerradas y verificadas en producción.
> - **Abiertas (2):** **T4-01** y **T4-06**, y ninguna tiene trabajo pendiente: T4-01 espera a
>   que `@lhci/cli` publique versión nueva (hoy 0.15.1) y T4-06 es solo de vigilancia.
> - El build prerenderiza (T4-04). Si algún día el LCP de `lhci` rompe, mirar primero cuánto
>   ha crecido `dist/index.html`: el margen es de 112 ms.
> - Si un equipo no compila con `Cannot find module 'vitest'`, es `node_modules` desfasado
>   respecto al lockfile: `npm ci`.
> - El aviso `GitHub token not set` de Lighthouse CI es informativo y se deja así a propósito:
>   el token solo añadiría un *status check* duplicado, sin enlace al informe porque el
>   `upload.target` es `filesystem`.
> - Los snapshots visuales se regeneran con el comando de Docker del README; en Git Bash hace
>   falta `MSYS_NO_PATHCONV=1`, y Docker Desktop tiene que estar arrancado.

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
    **Cerrado el 2026-09-09 por T2-10**: Playwright sí emula la preferencia de verdad, y
    la prueba se validó por mutación —forzando `<TypeAnimation>` siempre— para comprobar
    que falla cuando debe.

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

- [x] **[T2-06] Analizar el bundle y decidir si dividirlo** *(viene de BACKLOG 4.6)*
  - **Área:** Rendimiento · **Ubicación:** `vite.config.ts`
  - **Qué hacer:** 382.32 kB (124.06 kB gzip) en **un solo chunk** para un sitio estático. El LCP
    medido es de 3.011 s con **2.946 s de render delay** — el 98 % del LCP es esperar a que React
    arranque, no red (TTFB 65 ms). Correr `rollup-plugin-visualizer` para identificar al mayor
    contribuyente antes de decidir — *no medido todavía, no asumir cuál es*.
  - **Criterio de aceptación:** informe del analizador guardado y decisión escrita en `CONTEXT.md`.
  - **Esfuerzo:** bajo · **Depende de:** ninguna
  - **Cerrada:** 2026-09-09 · informe en [docs/analisis-bundle-2026-09-09.md](docs/analisis-bundle-2026-09-09.md),
    reproducible con `npm run analyze`. **Decisión: no se divide.**
    ⚠️ **La premisa de esta tarea era falsa.** No es cierto que el 98 % del LCP sea esperar a
    React: capturando *cada candidato* de LCP y no solo el final, el navbar ya está pintado a
    los **108 ms** y el H1 del Hero no aparece hasta los 776 ms. Los ~670 ms de en medio son la
    **animación de entrada**; con las duraciones a cero el LCP cae a **148 ms (−81 %)**.
    El mayor contribuyente del bundle, que la tarea pedía no asumir, es **Framer Motion
    (33,6 %)**; `react-dom` pesa más (52,4 %) pero no es evitable. No se divide porque
    `Hero.tsx` **y** `Navbar.tsx` importan Framer Motion, así que diferir lo de debajo del
    pliegue no lo sacaría del camino crítico, y el código propio es solo el 9,3 % del total.
    Abre **T2-23** para el coste real.

- [x] **[T2-23] Bajar el coste de la animación de entrada del Hero en el LCP**
  - **Área:** Rendimiento · **Ubicación:** `src/lib/animations.ts` · `src/components/Hero.tsx`
  - **Qué hacer:** medido en T2-06: la animación de entrada del Hero es **628 ms de los 776 ms**
    de LCP en local, y el hueco FCP→LCP se mantiene con estrangulamiento (332 ms en local,
    656 ms en producción, a 4G lento y CPU ×4). El `<h1>` es el elemento LCP y entra con
    `fadeUpVariant` (opacidad + `y` + `blur`) detrás de un `staggerContainer`
    (`delayChildren: 0.05`, `staggerChildren: 0.08`, `duration: 0.5`).
    ⚠️ **`prefers-reduced-motion` no lo arregla**: `<MotionConfig reducedMotion="user">`
    desactiva *transform* y *layout* pero **mantiene la opacidad**, que es lo que retiene al H1.
    Opciones, de menos a más invasiva: excluir el `<h1>` del stagger y mostrarlo de entrada;
    bajar `duration` en el Hero; o animar solo lo de debajo del pliegue. **No** hace falta
    quitar la animación de la página entera.
  - **Criterio de aceptación:** LCP del build local por debajo de **300 ms** sin estrangular,
    midiendo con el mismo método de T2-06 (candidatos de LCP, mediana de 3 corridas), y el
    Hero sigue teniendo animación de entrada visible.
  - **Esfuerzo:** bajo · **Depende de:** T2-06
  - **Cerrada:** 2026-09-09 · **LCP 748 → 108 ms (−86 %)**, mediana de 3 corridas.

    | | Antes | Después |
    |---|---:|---:|
    | LCP sin estrangular | 748 ms | **108 ms** |
    | LCP a 4G lento + CPU ×4 | 2008 ms | **1656 ms** |
    | Hueco FCP→LCP | 332–656 ms | **0 ms** |

    Dos cambios, los dos guiados por medición y no por intuición:
    **(1)** `staggerContainer` deja de animar su propia opacidad — era un doble fundido, y los
    nueve sitios que lo usan tienen hijos que ya se funden solos; **(2)** el `<h1>` deja de ser
    `motion.h1`.
    ⚠️ **Ninguno de los dos por separado sirve de nada** (748 → 748 ms y 748 → 412 ms): son dos
    puertas encadenadas y hay que abrir las dos. Quitar solo la opacidad tampoco servía: el
    coste no es la opacidad, es que **el LCP se registra cuando la animación termina**.
    Verificado que el Hero sigue animando con capturas a 150/400/700/1200 ms.
    CLS 0,0003 (el 0,00 anterior venía de una traza redondeada a 2 decimales: no es regresión).
    Reproducible con `npm run medir:lcp` (y `-- --lento`).
    🔁 **Ampliada el mismo día al montar T2-08.** El criterio que escribí solo hablaba del
    build local sin estrangular, y lo verifiqué **solo en escritorio**. En viewport móvil el
    elemento LCP no es el `<h1>` sino el párrafo «Construyo aplicaciones modernas…», que
    seguía animando: el LCP móvil real seguía en **2292 ms**. Se sacó también del envoltorio
    animado el bloque de rol + descripción, y bajó a **1624 ms**, otra vez igual al FCP.
    Lección: el elemento LCP **cambia con el viewport**, así que medir uno solo no basta.
    ✅ **Verificado en producción el 2026-09-10** (4G lento + CPU ×4, mediana de 3):
    FCP 1784 ms y **LCP 1784 ms — el hueco es cero**, que es lo que esta tarea perseguía.
    ⚠️ No comparar el absoluto con los 5372 ms de la medición anterior: el FCP de producción
    oscila muchísimo según lo caliente que esté el CDN (en estas mismas 3 corridas, la
    primera dio 4492 ms en frío y las otras dos 1764 y 1784). Lo atribuible a T2-23 es el
    **hueco FCP→LCP: 656 ms → 0**.

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

- [x] **[T2-08] Lighthouse CI con budgets que fallen el build** *(viene de BACKLOG 4.1)*
  - **Área:** QA · **Ubicación:** `.github/workflows/`
  - **Qué hacer:** `@lhci/cli` contra `vite preview` o la URL del deploy preview. **Budgets que
    fallen**, no solo reporten. Alternativa más barata: `@netlify/plugin-lighthouse`.
    ⚠️ **La línea base de esta tarea está desfasada.** Decía accesibilidad 96, SEO 92 y LCP
    3.011 s (2026-09-08); desde entonces se cerraron T1-06, T2-04, T2-05 y T2-13, y
    producción da **accesibilidad 100, buenas prácticas 100, SEO 100**. **Volver a medir
    antes de fijar los budgets**, o se fijarán contra una foto vieja.
    Y ojo con el umbral de LCP: el método importa tanto como el número. Ver T2-06 —el LCP de
    esta página lo domina la animación de entrada del Hero, que T2-23 va a cambiar—.
  - **Criterio de aceptación:** el workflow falla si SEO < 100, accesibilidad < 100 o LCP > 2.5 s.
  - **Esfuerzo:** medio · **Depende de:** T1-04, T1-06
  - **Cerrada:** 2026-09-09 · `@lhci/cli` en `lighthouserc.json` + paso en CI.

    Línea base **vuelta a medir** (móvil, build local), que era lo primero que pedía la nota:

    | | Auditoría 2026-09-08 | Hoy | Umbral |
    |---|---:|---:|---:|
    | Accesibilidad | 96 | **100** | = 100 |
    | SEO | 92 | **100** | = 100 |
    | Buenas prácticas | 100 | **100** | = 100 |
    | Rendimiento | — | **98** | ≥ 95 *(aviso)* |
    | LCP | 3011 ms | **2334 ms** | ≤ 2500 ms |
    | TBT | — | **15 ms** | ≤ 300 ms |
    | CLS | 0.00 | **0.001** | ≤ 0.1 |
    | JS transferido | — | **124 kB** | ≤ 160 kB |

    El margen del LCP es solo del 7 %, lo que normalmente sería temerario en CI. Aquí no:
    **la estimación de Lighthouse para esta página no depende de la CPU** —comprobado con
    `cpuSlowdownMultiplier` a 4, 6 y 8: 2329 ms en los tres casos—, sino del grafo de red.
    Es decir, es determinista frente a lo cargado que esté el runner, y lo que sí la movería
    es que crezca el bundle. Que es exactamente lo que un presupuesto debe cazar.
    Los ocho umbrales se validaron **por mutación**, no por salir en verde.
    ✅ **Confirmado en la primera corrida de CI (2026-09-10, 2m03s):** `ubuntu-latest` trae
    **Google Chrome 152.0.7977.82**, el patrón de arranque del servidor casa (sin aviso de
    *timeout*) y las **3 corridas** se completan en Linux —el `EPERM` era solo de Windows—.
    El log dice *«Checking assertions against 1 URL(s), **3 total run(s)**»*, que es lo que
    hay que mirar: en local llegué a tener un «All results processed» **sobre 0 informes**,
    un verde que no significaba nada.
    🔁 Añadido después un paso **«Resumen de Lighthouse»** (`if: always()`), porque `lhci` en
    verde no imprime ni un número y así solo se conocería el margen el día que rompa.

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

- [x] **[T2-10] Playwright: congelar lo verificado a mano** *(viene de BACKLOG 4.3)*
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
  - **Cerrada:** 2026-09-09 · **18 pruebas nuevas** en `e2e/lightbox.spec.ts`,
    `e2e/navegacion.spec.ts`, `e2e/responsive.spec.ts` y `e2e/movimiento-reducido.spec.ts`;
    el helper de revelado se extrajo a `e2e/util/pagina.ts`. Total del repositorio: **87
    unitarios + 21 e2e**.
    Los cinco bloques **se validaron por mutación**, no solo por salir en verde: se rompió
    a propósito el condicional del Hero, el retorno de foco y la trampa de Tab del
    lightbox, y se inyectó un elemento de 2000 px — y en cada caso falló exactamente la
    prueba que debía, con el diagnóstico útil. Tres corridas seguidas sin reintentos.
    ⚠️ Se dejó **congelado un hueco conocido**: el wordmark «Inicio» nunca recibe
    `aria-current` porque `navItems` no incluye `home`. La prueba afirma que hay **cero**
    enlaces marcados arriba del todo, así que cuando **T3-18** lo arregle, fallará y
    obligará a actualizarla en vez de quedar el arreglo sin cobertura.

- [x] **[T2-11] Snapshots visuales** *(viene de BACKLOG 4.4)*
  - **Área:** QA · **Ubicación:** `e2e/`
  - **Qué hacer:** `toHaveScreenshot()` a 375 / 768 / 1440. **Requisito:** forzar reduced-motion
    y enmascarar la línea de texto animado, o los snapshots serán inestables por Framer Motion y
    `react-type-animation`.
  - **Criterio de aceptación:** tres corridas seguidas sin diferencias.
  - **Esfuerzo:** medio · **Depende de:** T2-10 ✅ (desbloqueada el 2026-09-09)
  - **Cerrada:** 2026-09-10 · `e2e/visual.spec.ts`, 3 snapshots a 375/768/1440.
    Criterio cumplido **por duplicado**: tres corridas idénticas en Windows y otras tres en
    Linux, dentro del contenedor oficial de Playwright.

    Tres decisiones que se apartan del enunciado, todas por un motivo medido:

    1. **No se enmascara la línea de texto animado.** El requisito daba por hecho que
       `react-type-animation` seguiría corriendo, pero desde **T1-02** el Hero no la monta
       con `prefers-reduced-motion`, que es como corre toda la suite. Enmascararla solo
       escondería regresiones reales.
    2. **Se captura el pliegue, no la página entera.** Con `fullPage`, añadir un proyecto o
       un certificado —contenido que sale de `src/data/`— pondría en rojo los tres
       snapshots. Una suite que falla por lo que se espera que pase se acaba ignorando.
       De paso, las imágenes bajan de **5,9 MB a 332 kB**.
       Contrapartida asumida: no cubre regresiones por debajo del pliegue.
    3. **Sin `maxDiffPixelRatio`.** Se probó con 0.002 —que suena a margen mínimo— y era un
       colador: cambiar «Contactar» por «Contáctame» **pasó sin rechistar**, porque un
       ratio sobre una imagen grande tolera miles de píxeles. Sin tolerancia, el mismo
       sabotaje falla señalando 67 píxeles.

    ⚠️ **Coste de mantenimiento, para tenerlo claro:** las líneas base son por plataforma
    (`-chromium-win32` / `-chromium-linux`), así que **cada cambio de diseño intencionado
    rompe CI** hasta regenerar las dos, y las de Linux necesitan Docker (imagen de 3,5 GB).
    El procedimiento está en el README. Si estorba más de lo que aporta, pasar el paso a
    `continue-on-error: true` es una línea.
    Los visuales corren en `npm run test:visual`, **fuera** de `npm run test:e2e`.

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
  - ✅ **Lanzado a mano el 2026-09-10** (13 s, `workflow_dispatch`). Primera mitad del criterio
    cumplida de sobra:

    | | Enlaces revisados | Errores |
    |---|---:|---:|
    | Corrida del 2026-09-07 (globs viejos) | **3** | 1 |
    | Corrida del 2026-09-10 (globs nuevos) | **76** | 0 |

    De paso corrige dos cifras del propio enunciado: la base no eran 23 enlaces sino **3**
    —lychee filtra por extensión y se saltaba los `.ts`, así que solo miraba `index.html`—,
    y la estimación de «21 → 42» se quedó corta.
  - ❌ **La segunda mitad del criterio era insatisfacible, y eso es el hallazgo.** El
    verificador **no puede** cazar ese enlace, por dos motivos que se suman: `lychee.toml`
    **excluye LinkedIn a propósito** (devuelve 999 a clientes sin sesión y sería un falso
    positivo permanente), y el workflow pasa `--scheme http --scheme https`, así que un
    destino sin esquema ni siquiera entra en la lista de candidatos. Errores: 0 con el cebo
    puesto.
    El hueco es real —GitHub resuelve `](www.ejemplo.com)` como ruta relativa y da 404— así
    que se cubrió con un test propio, `src/lib/docs.test.ts`, que revisa los `.md` buscando
    destinos sin esquema y marcadores sin sustituir. Ignora el código en línea: este mismo
    repositorio cita el enlace roto entre backticks para documentarlo, y sin esa limpieza la
    documentación del bug contaba como el bug.
    Verificado en el orden correcto: el test **falla** con el README roto y pasa tras T3-01.
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

- [x] **[T2-15] Imagen Open Graph propia de 1200×630** *(viene de BACKLOG 1.2)*
  - **Área:** SEO · **Ubicación:** `index.html:35,44`
  - **Qué hacer:** ⚠️ **medio hecha el 2026-09-09, sin querer.** Al pasar las capturas a WebP
    (T2-01) se borró el PNG al que apuntaba `og:image` y la etiqueta quedó rota; se generó
    `public/og-image.jpg` de 1200×630 para taparlo, y de paso se añadieron `og:image:width`,
    `og:image:height` y `og:image:alt`. Así que la **proporción ya es correcta**, pero la
    imagen es un recorte de la captura del portafolio, **no** la tarjeta diseñada con nombre,
    rol y stack que pedía esta tarea. Falta eso y la validación con los inspectores.
  - **Criterio de aceptación:** validada con el post inspector de LinkedIn y el card validator de
    X, sin recorte.
  - **Esfuerzo:** bajo · **Depende de:** ninguna
  - **Cerrada:** 2026-09-10 · tarjeta 1200×630 (41 kB) con nombre, rol, stack y dominio.
    Generada **renderizando el sitio real** y leyendo los colores de elementos existentes, no
    aproximándolos: así usa la Inter auto-hospedada y los tokens exactos y no puede
    desviarse de la web. El primer intento salió en blanco sobre blanco por leer
    `--color-*`, que Tailwind 4 no expone en runtime (ver CONTEXT.md).
    ⏳ Queda validarla en los inspectores de LinkedIn y X, que necesitan la URL ya desplegada.

- [x] **[T2-16] Un solo CTA primario en el Hero** *(viene de BACKLOG 1.3)*
  - **Área:** UI/UX · **Ubicación:** `src/components/Hero.tsx:57-104`
  - **Qué hacer:** hay 8 acciones compitiendo arriba del fold (Inicio, menú, Ver proyectos,
    Contactar, Descargar CV, CV-ATS, GitHub, LinkedIn). La regla es **un** CTA primario. Dejar
    "Ver proyectos" como único botón primario y bajar el resto a secundario o terciario.
  - **Criterio de aceptación:** un solo elemento con `bg-primary` sobre el fold.
  - **Esfuerzo:** bajo · **Depende de:** ninguna
  - **Cerrada:** 2026-09-10 · ⚠️ **el criterio estaba mal formulado y ya se cumplía**:
    `Contactar` solo tenía borde, así que `bg-primary` aparecía una sola vez desde el
    principio. El problema real que describe la tarea son las **8 acciones compitiendo**, y
    es contra eso que se cerró: **de 8 a 5, y de tres filas a una**.
    Los dos CV se funden en un único disclosure `Descargar CV`; GitHub y LinkedIn pasan a
    iconos de 44×44 **con borde**, en la misma fila; y `Contactar` baja de `border-2` a
    `border`. Los cinco controles miden 44 px de alto, así que la línea alinea sin ajustes
    y en móvil envuelve a dos filas por sí sola. Eran tres filas separadas —CTAs, CV,
    sociales— y eso era justo lo que hacía que ocho acciones parecieran ocho decisiones.

- [x] **[T2-17] Renombrar "CV-ATS"** *(viene de BACKLOG 1.3)*
  - **Área:** Ortografía y redacción · **Ubicación:** `src/components/Hero.tsx:78-81`
  - **Qué hacer:** "CV-ATS" es jerga que un reclutador no descifra. Alternativa: un solo botón de
    CV con las dos variantes en un menú, o etiquetas explícitas ("CV en PDF" / "CV en texto
    plano").
  - **Criterio de aceptación:** ninguna etiqueta visible usa siglas sin explicar.
  - **Esfuerzo:** bajo · **Depende de:** T2-16
  - **Cerrada:** 2026-09-10 · «CV-ATS» → **«CV en texto plano (ATS)»**, y el otro a «CV en
    PDF». La sigla se conserva entre paréntesis porque quien la busca la reconoce, pero ya
    no hay que saberla para entender el botón. Ambos dentro del disclosure de T2-16.

- [x] **[T2-18] Sustituir el wordmark "Inicio" por el nombre o un logo** *(viene de BACKLOG 1.3)*
  - **Área:** UI/UX · **Ubicación:** `src/components/Navbar.tsx:44-50`
  - **Qué hacer:** es el lugar de mayor jerarquía de marca de la página y está desperdiciado en
    una palabra genérica.
  - **Criterio de aceptación:** el wordmark muestra el nombre o un logo.
  - **Esfuerzo:** bajo · **Depende de:** ninguna
  - **Cerrada:** 2026-09-10 · monograma **RAJB** sobre `bg-primary-strong` + **«Ricky
    Jiménez»**. Se construyeron y capturaron tres variantes (nombre solo, monograma +
    nombre, monograma solo) para decidir viéndolas, no describiéndolas.
    Cumple el criterio por las dos vías: nombre **y** logo.
    Se probó una cuarta, «RAJB Inicio», y se descartó: quita ruido visual pero deja el
    nombre solo en el `<h1>`, y quien llega a una sección interna por un enlace directo no
    lo ve. En el navbar el nombre sale gratis —cabe de sobra incluso a 390 px— así que no
    había razón para sacrificarlo.
    El monograma lleva `aria-hidden`: el nombre de al lado ya da el nombre accesible.
    ⚠️ **No cambia el hueco de `aria-current` de T3-18**: `navItems` sigue sin incluir
    `home`, y la prueba que lo congela sigue en verde.

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

- [x] **[T2-20] Arreglar el `Cache-Control` de los CV**
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
  - **Cerrada:** 2026-09-09 · confirmado primero **contra producción** que el PDF salía con
    `immutable` a un año. El arreglo no fue el obvio: acotar `/assets/*` a los PDF y dejar los
    `/*.js` y `/*.css` cubriendo los bundles se apoyaba en dos supuestos que la doc de Netlify
    **no** respalda —que el comodín cruza segmentos de ruta y que hay una precedencia definida
    cuando dos reglas chocan (la doc menciona que los `cache-control` se *concatenan*)—. Las
    reglas se reescribieron para **no solaparse**: `/assets/*.js` y `/assets/*.css` inmutables,
    `/assets/*.pdf` a `max-age=86400, must-revalidate`, y los `/*.js` y `/*.css` de raíz
    eliminados por inútiles. Ver la entrada de CONTEXT.md.
    ✅ **Verificado en producción el 2026-09-10** tras el despliegue:

    | Recurso | `Cache-Control` |
    |---|---|
    | `/assets/index-*.js` y `*.css` | `public,max-age=31536000,immutable` |
    | `/assets/CV-….pdf` y `/assets/ATS-CV-….pdf` | `public,max-age=86400,must-revalidate` |
    | `/fonts/inter-latin.woff2` | `public,max-age=31536000,immutable` |

    De paso resuelve la ambigüedad de la documentación de Netlify: **el comodín `*` dentro de
    un segmento sí funciona** (`/assets/*.js` casa), que era el supuesto sobre el que se
    construyeron las reglas nuevas.

- [x] **[T2-21] Empezar a etiquetar versiones en git**
  - **Área:** DevOps · **Ubicación:** `package.json:4` · repositorio
  - **Qué hacer:** `package.json` declara `version: 2.0.0` y el repositorio no tiene **ni un
    tag**. El `CHANGELOG.md` creado en esta auditoría reconstruye el historial de forma
    aproximada; a partir de aquí, etiquetar cada versión publicada.
  - **Criterio de aceptación:** existe el tag `v2.0.0` apuntando al commit correspondiente y el
    changelog lo enlaza.
  - **Esfuerzo:** bajo · **Depende de:** ninguna
  - **Cerrada:** 2026-09-11 · tag anotado `v2.0.0` sobre **`710f799`**, el último commit del
    2026-09-07 — la fecha de la sección [2.0.0] del changelog, y ya con `version: 2.0.0` en
    `package.json`. Lo posterior (desde `a75744c`) queda en [Sin publicar]. Las versiones
    anteriores (0.1.0, 1.0.0, 1.1.0) se dejan sin tag: son reconstruidas y no se publicaron.
    ⚠️ **El primer intento se quedó a medias:** el commit que enlazaba el tag desde el changelog
    (`cdaf5ce`) se subió, pero el tag no — `git push` no sube tags, hace falta
    `git push origin v2.0.0`. Durante ese hueco los dos enlaces del changelog daban 404.
    Verificado con `git ls-remote --tags origin`, no con el tag local.

- [x] **[T2-22] Corregir los tags que caen al icono genérico**
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
  - **Cerrada:** 2026-09-09 · **de 14 ocurrencias con glifo genérico a 8** (de 13 % a 7 %),
    medido, no estimado. Se añadieron **Jest** y **TanStack Query** con sus paths oficiales de
    `simple-icons` (CC0-1.0, mismo `viewBox` 24×24), verificados **renderizándolos a PNG y
    mirándolos** — el resto del archivo está dibujado a mano y un logotipo de memoria sale mal.
    **Playwright y Supertest no están en los 3459 iconos del set** (Puppeteer sí), así que se
    aceptan con glifo genérico de forma deliberada antes que inventarse una marca ajena.
    Cierra por la **segunda** vía del criterio: `PENDIENTES_DE_ICONO` queda vacía y las 8
    excepciones son una lista justificada que el test comprueba exacta en ambos sentidos.

---

## Tier 3 — Pulido y mantenimiento

- [x] **[T3-01] Sustituir los marcadores de posición del README**
  - **Área:** Ortografía y redacción · **Ubicación:** `README.md:60,186-188`
  - **Qué hacer:** quedan sin sustituir `git clone https://github.com/tu-usuario/portafolio-web.git`,
    `[github.com/tu-usuario]` y `[linkedin.com/in/tu-perfil]`. Además el enlace de LinkedIn apunta
    a `www.linkedin.com/in/...` **sin esquema**, así que GitHub lo interpreta como ruta relativa y
    queda roto.
  - **Criterio de aceptación:** ningún `tu-usuario`/`tu-perfil` en el archivo y todos los enlaces
    con `https://`.
  - **Esfuerzo:** bajo · **Depende de:** ninguna
  - **Cerrada:** 2026-09-10 · `git clone` apunta al repositorio real, el enlace de LinkedIn
    lleva `https://` y el texto de los enlaces ya no dice `tu-usuario`. Se descomentó la
    línea del portafolio, que ahora tiene URL de verdad.
    El criterio queda **fijado por un test** (`src/lib/docs.test.ts`), no solo aplicado: es
    la clase de cosa que vuelve sola al copiar una plantilla.
    ℹ️ **Nota aparte:** el README publica el correo en claro. Es deliberado en un repo
    público y distinto de la ofuscación del sitio (T3-13), pero conviene saber que un
    rastreador que lea GitHub lo encuentra igual.

- [x] **[T3-02] Actualizar el árbol de estructura del README**
  - **Área:** Documentación · **Ubicación:** `README.md:98-140`
  - **Qué hacer:** el árbol omite la carpeta `components/projects/`, `lib/assets.ts` y 5 de los 6
    componentes de `components/ui/`; dice `hooks/useScrollspy.tsx` cuando el archivo es `.ts`.
  - **Criterio de aceptación:** el árbol coincide con `src/`.
  - **Cerrada:** 2026-09-08 · reescrito entero contra un listado real de archivos, no a ojo.
    Incluye lo añadido en esta tanda (`ui/ErrorBoundary.tsx`, `hooks/usePrefersReducedMotion.ts`,
    `lib/contact.ts`, `public/fonts/`, `scripts/`) y corrige la extensión de `useScrollspy`.
  - **Esfuerzo:** bajo · **Depende de:** ninguna

- [x] **[T3-03] Limpiar la documentación muerta del README**
  - **Área:** Documentación · **Ubicación:** `README.md:39,163-166,171-175,196-203`
  - **Qué hacer:** dice "ESLint 9" (es 10); documenta cómo configurar variables de entorno y
    EmailJS cuando el proyecto **no usa ninguna** variable de entorno; da instrucciones de GitHub
    Pages que fallarían sin configurar `base` en Vite y que perderían todas las cabeceras de
    `netlify.toml`; agradece **Heroicons**, que no se usa en ninguna parte del código. Añadir en
    cambio una mención a `ROADMAP.md`, `CONTEXT.md` y los dos workflows de CI.
  - **Criterio de aceptación:** cada sección del README describe algo que existe.
  - **Esfuerzo:** bajo · **Depende de:** ninguna
  - **Cerrada:** 2026-09-10 · «ESLint 9» → **10** (verificado en `package.json`).
    La sección de variables de entorno decía cómo configurar `.env` y EmailJS: ahora dice
    que **no se usa ninguna**, que es la información útil.
    Las instrucciones de GitHub Pages se sustituyen por el motivo de que no esté soportado:
    perdería **todas** las cabeceras de `netlify.toml` —CSP, `Cache-Control` por tipo,
    `Content-Type` del sitemap—, donde vive media docena de tareas de este roadmap.
    Añadida la sección que faltaba: el README **no mencionaba ni una vez** ROADMAP.md,
    CONTEXT.md, CHANGELOG.md ni los dos workflows. Ahora hay una tabla que dice a qué
    pregunta responde cada archivo, y qué hace cada workflow.

- [x] **[T3-04] Declarar las licencias de terceros**
  - **Área:** Legal · **Ubicación:** `README.md:205-212`
  - **Qué hacer:** el proyecto es MIT y usa `lucide-react` (ISC), la fuente Inter (SIL OFL) y
    React/Framer Motion/Tailwind (MIT). Todas compatibles, sin conflicto — pero la sección de
    agradecimientos no declara ninguna licencia y sí menciona una librería que no se usa.
    Convertirla en una lista de atribuciones con licencia.
  - **Criterio de aceptación:** cada dependencia visible al usuario aparece con su licencia.
  - **Esfuerzo:** bajo · **Depende de:** T3-03
  - **Cerrada:** 2026-09-10 · «Agradecimientos» pasa a **«Licencias de terceros»**, una tabla
    de 8 filas con dependencia, uso y licencia. **Licencias leídas de `node_modules`, no de
    memoria**: React/Vite/Tailwind/Framer Motion/react-type-animation MIT, Lucide **ISC**,
    Inter **SIL OFL 1.1** y simple-icons **CC0 1.0** (de ahí salen los dibujos de Jest y
    TanStack Query, que la tarea no contemplaba porque son posteriores).
    Todas compatibles con MIT. Se enlaza `public/fonts/LICENSE.txt`, que viaja con la fuente
    como exige la OFL. Y desaparece **Heroicons**, que se agradecía sin usarse.

- [x] **[T3-05] Definir el tema claro** *(viene de BACKLOG 3)*
  - **Área:** UI/UX · **Ubicación:** `src/index.css:17-44`
  - **Qué hacer:** el fundamento ya está: `index.css` separa los valores crudos (`:root`, prefijo
    `--value-*`) de la capa semántica (`@theme inline`) justamente para que añadir un tema sea un
    bloque de overrides y no un refactor. Definir los valores en `[data-theme="light"]`.
  - **Criterio de aceptación:** el bloque existe y todos los tokens tienen valor claro.
  - **Esfuerzo:** medio · **Depende de:** T1-01
  - **Cerrada:** 2026-09-10 · bloque `[data-theme="light"]` con los **17 tokens**. La apuesta
    de la arquitectura se cumplió: la capa semántica (`@theme inline`) **no cambió ni una
    línea**, y la app estaba tan tokenizada que en todo `src/` solo había un color crudo
    (`text-red-500`, el corazón del Footer, que funciona en ambos temas).

    Ningún valor se eligió a ojo. Se escribió una calculadora de contraste de oklch a sRGB y
    se **validó primero contra los tres ratios que este repositorio ya había medido en
    T1-01** (5.38, 5.08 y 4.57): los reprodujo exactos. Luego se resolvió, para cada token,
    la luminosidad que alcanza el ratio que el tema oscuro ya tenía. Tabla en T3-07.

    Dos inversiones que el enunciado no anticipaba:
    - **La elevación cambia de sentido.** En oscuro elevar es aclarar; en claro es blanquear.
      El fondo pasa a gris claro y las tarjetas a blanco, no al revés.
    - **El conflicto de T1-01 desaparece.** En oscuro `primary` exige ser claro y
      `primary-strong` exige ser oscuro, y por eso son dos tokens. En claro los dos papeles
      piden lo mismo y sus valores convergen.

    De paso: el `theme-color` del `<head>` declaraba `#1a1c22`, que **no es ningún color del
    sitio**. El fondo real es `#080c11` (comprobado convirtiendo el token en Chromium), así
    que la barra del navegador móvil llevaba tiempo pintándose más clara que la página.

- [x] **[T3-06] Conmutador de tema con persistencia** *(viene de BACKLOG 3)*
  - **Área:** UI/UX · **Ubicación:** `src/components/Navbar.tsx` · `index.html`
  - **Qué hacer:** `localStorage` y `prefers-color-scheme` como valor por defecto. Evitar el flash
    de tema incorrecto aplicando el atributo antes del primer pintado (script inline en el
    `<head>` — ojo: el CSP actual es `script-src 'self'`, así que hará falta un hash).
  - **Criterio de aceptación:** recargar con tema claro no produce destello oscuro, y el CSP sigue
    sin `'unsafe-inline'` en `script-src`.
  - **Esfuerzo:** medio · **Depende de:** T3-05
  - **Cerrada:** 2026-09-10 · script inline en el `<head>`, hook `useTheme`, botón en la barra
    y `theme-color` que sigue al tema. Los dos criterios, medidos:

    **Destello: cero.** No se miró a ojo. Se grabó la carga entera con `Page.startScreencast`
    a 4G lento + CPU x4 y se midió la luminancia del fondo en **cada fotograma**: 68
    fotogramas, **0 oscuros**, mínimo 0.947. Y el detector se validó introduciendo un
    destello de verdad (el mismo script diferido 300 ms): 71 de 71 fotogramas oscuros,
    luminancia 0.045. Congelado además en `e2e/tema.spec.ts` con una prueba que **bloquea el
    bundle**: si el tema dependiera de React, con el JS abortado el atributo no aparecería.

    **CSP sin unsafe-inline:** el script se autoriza por hash sha256. Ese hash es frágil de la
    peor manera —Vite no aplica CSP en desarrollo, así que un hash desincronizado se vería
    **por primera vez en producción, con la página en blanco**—, y por eso
    `src/lib/csp.test.ts` lo recalcula desde `index.html` y lo compara con `netlify.toml`.
    Validado por mutación.

    **El hash depende de los saltos de línea.** Con `core.autocrlf=true` el árbol de trabajo
    en Windows tiene CRLF y el checkout de CI en Linux tiene LF: dos hashes para el mismo
    archivo, y el fallo aparecería solo en el sitio desplegado. Se fijó con `.gitattributes`
    (`index.html text eol=lf`) y el test lo verifica explícitamente.

    **Un bug que solo apareció al escribir la prueba.** La primera versión del hook persistía
    el tema en cada montaje. Parece inofensivo y no lo es: con **una simple visita** la
    preferencia quedaba congelada y cambiar el tema del sistema operativo ya no tenía ningún
    efecto sobre el sitio. Ahora solo se guarda cuando el usuario pulsa el botón. Lo destapó
    la prueba que carga con el sistema en claro y recarga con el sistema en oscuro.

- [x] **[T3-07] Verificar contraste en ambos temas** *(viene de BACKLOG 3)*
  - **Área:** Accesibilidad · **Ubicación:** `src/index.css`
  - **Qué hacer:** los valores de un tema no se heredan al otro: hay que medir por separado.
    Revisar además que el gradiente de `Layout.tsx:25` y los `shadow-primary/10` funcionen en
    claro.
  - **Criterio de aceptación:** axe en verde con `[data-theme="light"]` activo.
  - **Esfuerzo:** medio · **Depende de:** T3-05, T2-09
  - **Cerrada:** 2026-09-10 · **axe en verde en los dos temas**, 1588 nodos cada uno. La suite
    de accesibilidad se parametrizó por tema, y el tema no se fuerza escribiendo el atributo
    sino con `prefers-color-scheme`, para que la prueba recorra el camino real del visitante.
    Lleva una guarda propia —afirma que el atributo aplicado es el esperado— porque sin ella
    un fallo del script inline haría que las dos vueltas auditaran el tema oscuro y la
    segunda saliera verde **sin medir nada**.

    Ratios medidos, tema contra tema:

    | Par | Oscuro | Claro | Mínimo AA |
    |---|---:|---:|---:|
    | foreground / background | 18.54 | 17.52 | 4.5 |
    | muted / background | 9.82 | 9.66 | 4.5 |
    | subtle / background | 5.40 | 5.34 | 4.5 |
    | foreground / surface | 17.49 | 19.39 | 4.5 |
    | muted / surface | 9.26 | 10.70 | 4.5 |
    | subtle / surface | 5.09 | 5.91 | 4.5 |
    | primary / background | 5.38 | 5.36 | 4.5 |
    | primary / surface | 5.08 | 5.94 | 4.5 |
    | primary-foreground / primary-strong | 4.57 | 5.85 | 4.5 |
    | primary-foreground / strong-hover | 5.94 | 7.98 | 4.5 |
    | ring / background | 7.19 | 6.92 | 3 |

    Ninguna pareja se aleja más del 4 % de su equivalente oscura y seis salen mejor.

    **Lo que axe no vio.** El gradiente de `Layout.tsx` está tokenizado y funciona, pero el
    **scrim del lightbox no aislaba**: con el 60 % que parecía razonable sobre una página
    clara, la página de detrás seguía leyéndose. Medido como desviación de luminancia en la
    franja del velo: **7.47 frente a 2.43** en oscuro, tres veces más contenido colándose.
    Con la varianza del fondo se despejó la opacidad necesaria (~87 %) y se igualó a la del
    oscuro, 88 %: ahora **2.41 frente a 2.43**.

    **La suite visual auditaba el tema claro por accidente.** El valor por defecto de
    `colorScheme` en Playwright es `light`, así que en cuanto el tema empezó a seguir a
    `prefers-color-scheme` los tres snapshots pasaron a capturar la paleta clara —lo cazaron
    ellos solos, con un 92 % de píxeles distintos—. Se fijó `colorScheme: "dark"` en
    `playwright.config.ts` y los snapshots pasan a **seis**: los dos temas por tres anchos, en
    las dos plataformas.

- [x] **[T3-08] Igualar el alto útil de las tarjetas de proyecto** *(viene de BACKLOG 2)*
  - **Área:** UI/UX · **Ubicación:** `src/components/Projects.tsx:39` ·
    `src/components/projects/ProjectCard.tsx:109-118`
  - **Qué hacer:** **medido a 1440 px**: el hueco entre los tags y la fila de enlaces es de 200,
    **334** y 328 px en las tres tarjetas destacadas (el backlog anterior lo estimaba en ~230 px
    sin medir). Es inherente a una grilla de alto igual con contenido variable. Opciones: igualar
    la cantidad de features entre proyectos, o `items-start` para que cada tarjeta mida según su
    contenido.
  - **Criterio de aceptación:** ninguna tarjeta destacada supera 120 px de hueco, vuelto a medir.
  - **Esfuerzo:** medio · **Depende de:** ninguna
  - **Cerrada:** 2026-09-10 · como mucho **4 features** en la grilla de destacados; si hay más, una
    línea «+N más en el repositorio». Vuelto a medir a 1440 px: huecos de **0 / 26 / 49 px**
    (antes 0 / 134 / 129; el enunciado decía 200 / 334 / 328, pero el contenido había cambiado
    desde entonces y se remidió antes de tocar nada). La lista completa sigue en el layout de
    fila y en el repositorio.

    Se eligió frente a `items-start` (huecos 0 / 0 / 0) tras comparar las dos variantes con
    capturas: con `items-start` no se oculta nada, pero los bordes inferiores de la fila
    quedan escalonados.

- [x] **[T3-09] Alinear los encabezados de las tarjetas** *(viene de BACKLOG 2)*
  - **Área:** UI/UX · **Ubicación:** `src/components/projects/ProjectCard.tsx:39-44`
  - **Qué hacer:** **medido a 1440 px**: "KiosGo - Sistema de Kiosko de Comida" ocupa 2 líneas y
    los otros 1, así que su subtítulo arranca **28 px** más abajo. Se resuelve con un `min-h` en
    el bloque de encabezado.
  - **Criterio de aceptación:** los tres subtítulos arrancan a la misma altura.
  - **Esfuerzo:** bajo · **Depende de:** ninguna
  - **Cerrada:** 2026-09-10 · `lg:min-h-[2lh]` en el título de las tarjetas destacadas. Vuelto a
    medir: a 1024 px los tres subtítulos arrancan a **258 / 258 / 258** y a 1440 a
    **281 / 281 / 281** (antes 253 / 253 / 281).

    En `lh` y no en px: reserva exactamente dos alturas de línea del propio título, así que
    sigue siendo correcto si cambia el tamaño de fuente. Solo desde `lg` a propósito: en `sm`
    la grilla es de dos columnas y la tarjeta que parte en dos queda **sola en su fila**
    (a 768 px: 254 / 254 / 282, sin vecina con la que desalinearse); reservar ahí solo
    añadiría 28 px de hueco a las otras dos.

- [x] **[T3-10] Afinar el hueco bajo el texto animado del Hero** *(viene de BACKLOG 2)*
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
  - **Cerrada:** 2026-09-10 · `min-h-[3.6em] sm:min-h-[2.4em]` → `min-h-[2lh] sm:min-h-[1lh]`.

    Se midió el alto real de **cada frase en cada ancho** (320 a 1440) en vez de estimarlo.
    La estimación en `em` sobraba en los dos tramos: 65 px reservados donde la frase más
    larga ocupa 56 en móvil, y 48 donde ocupa 28 desde `sm` (desde 640 px las tres frases
    caben en una línea). Ahora la reserva coincide **al píxel** en todos los anchos: 0 px de
    sobra.

    CLS con el tecleo activo, 6 s: **0.0026 / 0.0015 / 0.0005** a 375 / 768 / 1440, frente a
    0.0035 / 0.0016 / 0.0007 antes. No empeora; mejora un poco. La línea base del enunciado
    (~0.006) ya no era la actual cuando se retomó la tarea, así que se remidió antes de tocar.

    Lo que **no** se puede quitar: en móvil, con la frase corta, siguen viéndose 28 px vacíos.
    Es el hueco de la segunda línea que usa la frase larga, y quitarlo es volver a tener CLS.

- [x] **[T3-11] Compactar la sección de Certificados** *(viene de BACKLOG 2)*
  - **Área:** UI/UX · **Ubicación:** `src/components/Certificates.tsx` · `src/data/certificates.ts`
  - **Qué hacer:** 5 tarjetas idénticas, todas de Udemy, mismo icono, sin fechas. Una lista
    compacta comunica lo mismo en un tercio del espacio.
  - **Criterio de aceptación:** la sección ocupa menos de la mitad de alto.
  - **Esfuerzo:** medio · **Depende de:** ninguna
  - **Cerrada:** 2026-09-10 · **una sola tarjeta con una fila por curso**. Contenido de la sección:
    **390 → 286 px** a 1440 y **1000 → 706 px** a 375 (medido contra producción, que aún tenía
    la versión anterior).

    ⚠️ **El criterio escrito no se cumple, y es una decisión consciente.** Se construyeron dos
    variantes: una lista en dos columnas que sí bajaba de la mitad (155 px, 40 %) y esta, que
    se queda en el 73 %. Se eligió esta al verlas lado a lado. Además, «menos de la mitad» es
    inalcanzable para cualquier variante con filas: cada fila lleva un enlace de **44 px**
    (área táctil mínima, WCAG 2.5.8), así que cinco filas ya ocupan más de 195 px. Y medido
    sobre la sección entera tampoco era posible: cabecera y padding fijos suman 322 px de los
    712.

- [x] **[T3-12] Jerarquizar Competencias** *(viene de BACKLOG 2)*
  - **Área:** UI/UX · **Ubicación:** `src/components/Skills.tsx` · `src/data/skills.ts:80-89`
  - **Qué hacer:** 45 items en 9 categorías, todos con el mismo peso visual, lo que diluye la
    señal fuerte (.NET + React). Además "Principios" mete frases largas ("MVC - Modular por
    dominios - Feature Based") en pills de tag, y esas no son tags.
  - **Criterio de aceptación:** las categorías principales destacan y "Principios" no usa pills.
  - **Esfuerzo:** medio · **Depende de:** ninguna
  - **Cerrada:** 2026-09-10 · tres niveles en los datos (`formato` en `Skill`): **Frontend y
    Backend** como «Stack principal» con pills e icono; el resto como **texto separado por
    puntos**; **Principios** como lista con viñetas. Contenido: **1078 → 670 px** a 1440
    (−38 %) y **2620 → 2025 px** a 375 (−23 %).

    Pedido explícito al elegir la variante: **sin huecos verticales y todo dentro de un
    rectángulo**. La grilla no puede hacerlo (cada fila mide lo que su tarjeta más alta), así
    que en escritorio son tres columnas explícitas y la última tarjeta de cada una crece lo que
    falte. El reparto (`columna` en los datos) no es a ojo: se probaron los **2187 repartos**
    posibles con los altos reales y se eligió el de menor desnivel. Estiramiento resultante:
    26 / 0 / 31 px a 1440. Por debajo de `lg` los contenedores son `display: contents` y un
    `order` inline devuelve el orden de lectura de los datos.

    Tres fallos que cazaron las pruebas y no la vista:
    - **Scroll horizontal en todos los anchos.** El espacio que permite partir la línea
      estaba *dentro* de cada `<li>` con `whitespace-nowrap`, y cada lista era una línea
      irrompible (hasta 860 px de desborde).
    - **22 px de desborde a 320 px** después de arreglar lo anterior: una sola entrada larga
      no cabía. Resuelto con `inline-block max-w-full`, que mantiene los nombres enteros y
      solo los parte si son más anchos que la línea.
    - **Una prueba que daba verde sin proteger nada.** La del rectángulo medía los
      contenedores de columna, que la grilla iguala siempre. La mutación lo destapó; ahora
      mide la última tarjeta.

    Congelado en `e2e/pulido.spec.ts` junto con T3-08, T3-09 y T3-10. Las seis pruebas se
    validaron por mutación, y en el proceso apareció una trampa del propio método: una
    mutación que deja una variable sin usar **no compila**, y la prueba corre sobre el build
    anterior y sale verde. El script de mutación ahora aborta si el build falla.

    Límite conocido: a 1024 px la tercera columna se estira 80 px, porque el reparto está
    optimizado para 1440. La prueba mide 1440.

- [x] **[T3-13] Eliminar el código muerto de `ObfuscatedEmail`**
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
  - **Cerrada:** 2026-09-10 · se eligió la segunda opción: borrar el estado muerto.
    `ObfuscatedEmail.tsx` desaparece; Contact ensambla el correo con `buildEmail` y comparte
    un solo manejador entre los dos botones. Se van con él `isRevealed`,
    `obfuscatedDisplay`, la prop `className` y la rama de render por defecto — nada de eso
    llegaba a ejecutarse.
    **Lo que sí importaba se conservó y ahora está fijado por un test:** el literal
    `usuario@dominio.tld` no aparece en `src/`, ni en `index.html`, ni en el bundle.
    Comprobado también sobre `dist/` tras el cambio: solo sale dentro de los **PDF del CV**,
    donde debe estar. En el `<noscript>` va a propósito en forma `[at]`/`[dot]`.
    Validado por mutación: escribir el correo a mano en Contact hace fallar el test.

- [x] **[T3-14] Eliminar las ramas regex inalcanzables de `TechIcon`**
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
  - **Cerrada:** 2026-09-10 · **15 ramas eliminadas y 4 alternativas redundantes
    simplificadas** (`/next\.?js.*16|next\.?js/` → `/next\.?js/`, ídem Prisma), en
    `pickColor` y `pickIcon`. Todas estaban estrictamente subsumidas por una regla anterior:
    `/solid/` antes que `/principios.*solid/`, `/\.net.*\d+/` antes que `/\.net.*9/`…
    y `/ef.*core/` aparecía dos veces.
    **No se borró nada por confianza en la descripción de la tarea:** se capturó una huella
    de icono + color para **89 nombres** (los 78 tags reales más los que tenían rama propia)
    antes y después, y salió **idéntica**. Añadido un test que fija que «.NET 9», «React 19»,
    «Tailwind CSS 4», «Next.js 16», «Prisma 7», «EF Core» y compañía siguen resolviendo, para
    que nadie reponga las ramas «por si acaso».

- [x] **[T3-15] Limpiar entradas de `BRAND_COLORS`/`ICONS` sin uso**
  - **Área:** Refactorización · **Ubicación:** `src/components/TechIcon.tsx:4-83`
  - **Qué hacer:** al menos 11 entradas no corresponden a ninguna tecnología de `src/data/`:
    Cypress, GitHub Copilot, ChatGPT, Gemini, Cursor IDE, AI Code Review, Google Antigravity,
    Neon, Python, Windows Forms y Clean Code. Son restos de versiones anteriores de la lista de
    competencias.
  - **Criterio de aceptación:** cada entrada corresponde a un tag realmente listado, o se
    documenta por qué se conserva.
  - **Esfuerzo:** bajo · **Depende de:** T2-22
  - **Cerrada:** 2026-09-10 · **por la segunda vía del criterio: se conservan, documentadas.**
    Recuento real: **18 de 71** entradas de `ICONS` no las alcanza ningún tag — ni las 11 que
    decía la tarea ni las 25 de un primer análisis mío, que identificaba los iconos por su
    `path` y colapsaba los que comparten dibujo; se rehízo por identidad de referencia.
    **Medido antes de decidir:** esas 18 suman **1,6 kB gzip, el 1,3 %** de un bundle de
    124 kB contra un presupuesto de 160. A ese precio, borrarlas solo lograría que el día que
    se añada «Python» o «Docker» salga el glifo genérico, que es el fallo silencioso que T2-07
    existe para evitar. No son deuda: son inventario.
    Lo que sí faltaba era que la lista no creciera a escondidas, y de eso se encarga un test
    que la comprueba **exacta en los dos sentidos** (requiere exportar `ICONS`).

- [x] **[T3-16] Sacar los datos de iconos fuera del componente**
  - **Área:** Arquitectura · **Ubicación:** `src/components/TechIcon.tsx` (541 líneas)
  - **Qué hacer:** el archivo mezcla 78 colores de marca, ~69 rutas SVG y la lógica de resolución.
    Mover los dos diccionarios a `src/data/tech-icons.ts` y dejar en el componente solo
    `pickColor`, `pickIcon` y el render.
  - **Criterio de aceptación:** `TechIcon.tsx` baja de 150 líneas.
  - **Esfuerzo:** medio · **Depende de:** T3-14, T3-15
  - **Cerrada:** 2026-09-10 · **550 → 74 líneas**, holgadamente bajo el criterio. Partido en
    tres en vez de dos: `src/data/tech-icons.ts` (los diccionarios, 251 líneas),
    `src/lib/tech-icons.ts` (la resolución, 197) y el componente, que ya solo pinta.
    Efecto colateral bueno: **desaparecen los dos `eslint-disable` de `react-refresh`**,
    que existían solo porque un archivo de componente exportaba funciones.
    Dos cambios de diseño sobre el enunciado:
    1. Los iconos pasan de elementos JSX a **cadenas `path`**, así que el archivo de datos
       no importa React y es datos de verdad.
    2. `pickIcon` pasa a ser **`pickIconKey`**: devuelve la clave, no el dibujo. Hizo falta
       porque varias claves comparten `path` —`.NET`, `.NET 8` y `DotNet` dan el mismo
       logo— y con el dibujo era imposible saber qué entrada se eligió: el test de
       inventario de T3-15 colapsaba las duplicadas e inventaba huérfanas. Se detectó
       porque ese test se puso rojo a mitad del refactor.
    Verificado que no cambia nada: se regeneró la **misma huella de 89 nombres** (color +
    dibujo) usada en T3-14 y salió idéntica, y se comprobó a ojo que los 61 iconos de
    Competencias siguen pintando con su color.

- [x] **[T3-17] Unificar el estilo de código**
  - **Área:** Refactorización · **Ubicación:** `src/components/ui/ObfuscatedEmail.tsx` ·
    `src/components/TechIcon.tsx`
  - **Qué hacer:** estos dos archivos usan comillas simples y omiten el punto y coma; el resto del
    proyecto usa comillas dobles y punto y coma. No hay Prettier ni regla de estilo en ESLint que
    lo impida. Añadir Prettier (o las reglas equivalentes) y pasarlo una vez.
  - **Criterio de aceptación:** `npx prettier --check .` en verde, y el paso añadido a `ci.yml`.
  - **Esfuerzo:** bajo · **Depende de:** ninguna
  - **Cerrada:** 2026-09-10 · Prettier 3.9.6 + `.prettierrc.json` (printWidth 120, comillas
    dobles, punto y coma, `endOfLine: auto`) y `.prettierignore`. Scripts `format` y
    `format:check`, y paso **Formato (Prettier)** en `ci.yml` tras el lint.

    Los dos archivos que la tarea señalaba ya no existían como tales: `ObfuscatedEmail.tsx`
    se borró en T3-13 y `TechIcon.tsx` se reescribió en T3-16. Pero **Prettier destapó que
    el defecto había migrado**: `src/lib/tech-icons.ts`, creado hace unas horas en T3-16,
    heredó el estilo sin punto y coma del archivo del que salió. Ese es justo el argumento
    de la tarea —sin regla, el estilo se propaga por copia— y lo confirmó sola.

    23 de ~50 archivos reformateados (+394/-370). `printWidth: 120` se eligió midiendo la
    distribución real de anchos del repo (p90 = 79, p99 = 192), no por defecto: con los 80
    de Prettier el diff habría sido varias veces mayor. `endOfLine: auto` respeta que
    `index.css` sea CRLF y los `.tsx` LF.

    **Los `.md` quedan fuera** (`.prettierignore`): ROADMAP y CONTEXT están maquetados a
    mano —tablas, sangrías de continuación— y Prettier los reflota. La tarea habla del
    estilo del código; la decisión queda escrita en el propio ignore y en el paso de CI.

    Verificado por mutación: con un archivo mal formateado `format:check` sale con **1**;
    sin él, con **0**.

- [x] **[T3-18] Correcciones menores de código**
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
  - **Cerrada:** 2026-09-10 · los cuatro:
    1. `type="button"` en los dos `<button>` de Contact.
    2. El centinela `project.demo === "#"` **ya era código muerto**: en `src/data/` no queda
       ningún `demo: "#"`, solo dos URLs reales. Se eliminó la rama, no hizo falta tocar
       los datos.
    3. Contact pasa a usar `SectionHeader`. Cambia ligeramente el espaciado —el subtítulo
       va a `mt-3` y el bloque gana el `mb-10 sm:mb-12` del componente— y eso es el punto:
       ahora es consistente con las otras seis secciones. Verificado con captura.
    4. El wordmark recibe `aria-current` cuando «home» es la sección activa.

    🎯 **El punto 4 validó el mecanismo de T2-10.** Aquella prueba congelaba el hueco
    afirmando que arriba del todo no había ningún enlace marcado, con un mensaje escrito
    para quien lo arreglara: *«alguien añadió `home` al nav: T3-18 está resuelto,
    actualizar esta prueba»*. Al aplicar el arreglo **falló con ese mensaje exacto**, que
    era justo su razón de ser. Se convirtió en dos pruebas que afirman el comportamiento
    correcto, incluida la de que wordmark y enlace del nav no queden marcados a la vez.
    Ambas validadas por mutación.

- [x] **[T3-19] Correcciones menores de estilos y configuración**
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
  - **Cerrada:** 2026-09-10 · los dos que quedaban, ambos medidos en el navegador sobre
    `dist/` servido antes y después:

    1. **El 1px del ancla.** Confirmado exacto: `<header>` 65px, `<nav>` 64px, `border-b`
       1px, `scroll-margin-top` 64px, solape **1px**. La causa era un token haciendo dos
       trabajos: `--spacing-header` alimentaba tanto `h-header` (alto del `<nav>`) como
       `scroll-mt-header` (offset, que debe contar el borde). Se separó en dos, como en
       T1-01: `--spacing-header` sigue siendo 4rem y se añade
       `--spacing-header-total: calc(var(--spacing-header) + 1px)`, que es el que usa
       `Section.tsx`. Tras el cambio: `scroll-margin-top` 65px, **solape 0**.
    2. **El fondo del `body`.** Confirmado: computaba `rgba(0, 0, 0, 0)`. Ahora declara
       `background-color: var(--color-background)` y `color: var(--color-foreground)`.
       Efecto secundario útil de cara a T3-05: referenciar los tokens desde CSS de autor
       impide que `@theme inline` los pode de `:root` por usarse solo desde utilidades
       —el mismo mecanismo que hizo fallar la tarjeta OG en T2-15—.

- [x] **[T3-20] Correcciones de redacción y metadatos**
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
  - **Cerrada:** 2026-09-10 · los seis:

    1. `<title>` → «Ricky Jiménez — Desarrollador Web Full-Stack», idéntico al `og:title`
       (mismo texto y mismo guion largo).
    2. `description` igualada a la `og:description`, palabra por palabra. Se eligió
       **«MERN/PERN»** y no «MERN stack» tras comprobar en `src/data/` que es lo cierto:
       PostgreSQL aparece en tres proyectos y MongoDB en competencias.
    3. «agentes IA» → «agentes **de** IA».
    4. «enfoque en performance» → «enfoque en **rendimiento**», que es el término que ya
       usaban el README y la meta description.
    5. «Sistema de Ventas WEB» → «Sistema de Ventas Web».
    6. `Porfolio-web-rajb.webp` → `Portfolio-web-rajb.webp` (`git mv`), con las dos
       referencias vivas actualizadas (`projects.ts`, README). Nota: desde T2-15 ese
       archivo **ya no es la tarjeta social** —esa es `og-image.jpg`—, así que la errata
       había dejado de ser pública; se corrige igual.

    Los puntos 3 y 4 mueven texto del pliegue, así que **las tres pruebas visuales
    fallaron**, que es su trabajo. Revisadas las tres imágenes de diferencia: la única
    zona marcada es la segunda línea del tagline, en los tres anchos. Referencias
    regeneradas para `win32` y para `linux` (en el contenedor de Playwright).

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
  - **Avance 2026-09-10 (sigue abierta):** el aviso ya no era de 3 sino de **15** (2 bajas,
    4 moderadas, 9 altas). `npm audit fix` **sin** `--force`, que solo cambia
    `package-lock.json`, resolvió las que tenían arreglo compatible: `nanoid` 3.3.19 (la
    única que figuraba como de producción, vía `postcss`, y que no entra en el bundle),
    `brace-expansion` 5.0.9 y `@humanfs/node` 0.16.8. **Producción: 0 vulnerabilidades.**

    Quedan **12, todas dentro de `@lhci/cli`** (`lighthouse`, `puppeteer-core`,
    `extract-zip`, `tmp`, `uuid`, `inquirer`, y `express`/`qs` de su servidor). La 0.15.1
    instalada es la última publicada y fija esas versiones, así que ninguna actualización lo
    arregla; el «arreglo» que propone npm es bajar a la 0.1.0, que es más antigua. Riesgo
    real, revisado contra cómo se usa aquí: CI lanza `lhci autorun` con el Chrome del
    sistema (no descarga navegador, así que `@puppeteer/browsers` y `extract-zip` no se
    ejecutan), sube a `filesystem` (no arranca el servidor `express`) y no usa el asistente
    interactivo (`inquirer`). **El código vulnerable no se ejecuta.**

    Para cumplir el criterio sin tocar ese riesgo: quitar `@lhci/cli` de `devDependencies` y
    lanzarlo con `npx @lhci/cli@0.15.1 autorun` en CI. El árbol vulnerable dejaría de estar en
    el lockfile del proyecto y `npm audit` quedaría en 0. A cambio, `npm run lighthouse` en
    local descargaría la herramienta la primera vez.

    **Decidido 2026-09-10: se deja como está.** Las 12 restantes dependen por completo de
    `@lhci/cli`, no se ejecutan en este uso y moverla a `npx` solo limpiaría el informe, no el
    riesgo. La tarea sigue abierta a propósito, pero ya no por trabajo pendiente: se cierra en
    cuanto `@lhci/cli` publique una versión que actualice `lighthouse`, `tmp` y `uuid`. Para
    comprobarlo: `npm view @lhci/cli version` (hoy 0.15.1, de junio de 2025).

- [x] **[T4-02] Ajustar tres cabeceras de seguridad**
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
  - **Cerrada:** 2026-09-11 · `X-XSS-Protection: 0`; HSTS declarado como
    `max-age=31536000; includeSubDomains; preload`, que es **exactamente** lo que producción
    sirve hoy (medido con `curl -I`), con el porqué comentado en el archivo; e `img-src
    'self' data:`. Antes de cerrar `img-src` se buscó cualquier imagen de otro origen en
    `src/` e `index.html`: solo aparecen URLs `https://` dentro de tests unitarios.
    ⚠️ **Ni las e2e ni Lighthouse CI pueden cazar un fallo aquí:** corren contra
    `vite preview`, que no aplica las cabeceras de `netlify.toml`. La verificación es en
    producción: `curl -I` de las tres cabeceras y consola sin errores de CSP con las 6
    capturas de proyecto cargadas.
    ✅ **Verificado en producción** (`94fb968`): las tres cabeceras servidas coinciden
    carácter a carácter con las declaradas. En navegador, contexto aislado a 1280 px: **6/6
    capturas cargadas, las 6 peticiones en 200, cero mensajes de consola** y ninguna imagen
    de otro origen.
    ⚠️ **Falso positivo evitado:** en la primera pasada, con la ventana estrecha, 3 de 6
    imágenes no cargaban y parecía que el CSP nuevo las bloqueaba. No: son las miniaturas de
    «Otros proyectos», que viven en un `hidden sm:block` (`ProjectCard.tsx:95`), y un
    `loading="lazy"` con `display: none` **nunca se pide**. Lo delató que estaban en
    `complete: false` sin error en consola — un bloqueo de CSP deja `complete: true`, tamaño
    0 y un error. Al verificar imágenes perezosas, hacerlo por encima de `sm`.

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

- [x] **[T4-04] Evaluar prerender / SSG**
  - **Área:** Rendimiento / SEO
  - **Qué hacer:** ⚠️ **premisa corregida el 2026-09-09 por T2-06.** Decía que el cuello de
    botella era no tener ni un carácter en el HTML hasta que React arranca (LCP 3.011 s con
    2.946 s de render delay). Medido de nuevo: React pinta el navbar a los **108 ms** y lo que
    retrasa el LCP es la animación de entrada del Hero, no el arranque. Prerenderizar por sí
    solo **no lo arreglaría**: al hidratar, Framer Motion volvería a poner el `<h1>` a
    `opacity: 0`. **T2-23 se cerró el 2026-09-09** y dejó el LCP local en 108 ms y en 1656 ms
    a 4G lento + CPU ×4, donde ya coincide con el FCP: lo que quede por ganar es **arranque y
    red**, que es justo lo que atacaría prerenderizar. Ahí sí tiene sentido reevaluarlo, pero
    con la línea base nueva, no con los 3.011 s de la auditoría.
  - **Criterio de aceptación:** decisión registrada en `CONTEXT.md`, con o sin implementación.
  - **Esfuerzo:** alto · **Depende de:** T2-04, T2-05, T2-06, **T2-23**
  - **Cerrada:** 2026-09-11 · **implementado.** `vite build --ssr src/entry-server.tsx` +
    `scripts/prerender.mjs` inyectan 114 kB de HTML en el `#root` de `dist/index.html`, y
    `main.tsx` pasa a `hydrateRoot` (sigue con `createRoot` si el contenedor está vacío, que
    es el caso de `vite dev`). Medido a 4G lento + CPU ×4, **4 medianas de 3 corridas por
    configuración**:

    | | Sin prerender | Con prerender |
    |---|---:|---:|
    | FCP/LCP escritorio | 1924 / 1944 ms | **1200 / 1060 ms** |
    | FCP/LCP móvil | 1932 / 1912 ms | **1056 / 1028 ms** |
    | `dist/index.html` | 3,2 kB gzip | 21,1 kB gzip |

    **≈45 % menos de FCP y LCP**, y ya no hacen falta los 127 kB de JS para ver nada.

    ⚠️ **Las dos herramientas dicen lo contrario, y hay que saber por qué.** Lighthouse
    empeora con el prerender: LCP simulado **2218 → 2388 ms** y rendimiento 98 → 97. No es
    ruido —se repitió en 3 tandas de 3 corridas— sino su modelo: Lantern *simula* la descarga
    del documento, y el HTML es 18 kB gzip más grande. El navegador real, con red y CPU
    estranguladas de verdad, mide justo lo contrario. **Se decide por la medición real**; la
    de Lighthouse queda como presupuesto, no como verdad.
    ⚠️ **Margen del presupuesto: 112 ms (4,5 %)**, antes 282 ms. Es lo que hay que vigilar:
    si alguien añade contenido al prerender, el primero en romper será el LCP de `lhci`.
    ⚠️ **Mi primera medición dijo −17 %, no −45 %:** la tomé con el build y los tests
    compitiendo por la CPU. Una sola tanda no decide nada; estas son cuatro por configuración.

    Tres cosas que el prerender obligó a cambiar, todas por el mismo motivo —lo que se genera
    en Node tiene que coincidir con lo que hidrata el navegador—:
    1. **El correo** (`Contact.tsx`) se pintaba en claro y habría quedado escrito en
       `dist/index.html`, deshaciendo T3-13. Hasta hidratar se muestra `[at]`/`[dot]`, y
       `prerender.mjs` **falla el build** si el literal aparece en el HTML. `contact.test.ts`
       no lo habría visto: solo mira el código fuente.
    2. **El icono del tema** lo elige ahora el CSS por `data-theme`, no el estado de React: el
       HTML es el mismo para los dos temas y quien usa el claro habría visto el icono
       equivocado hasta hidratar. La etiqueta, que no puede venir del CSS, usa `useHidratado`.
    3. **`useTheme`** ya no toca `document` fuera del navegador.

    Verificado: 117 unitarios, 46 e2e, 6 visuales y los presupuestos de Lighthouse en verde;
    **cero mensajes de consola** al cargar en tema claro y en oscuro, que es donde aparecería
    un desajuste de hidratación.
  - ✅ **Verificado en producción el 2026-09-11** (`35177fb`, CI en verde): el HTML servido
    trae el contenido dentro de `#root` (126,7 kB) y **cero** apariciones del correo literal.
    Medido a 4G lento + CPU ×4, mediana de 3: **FCP/LCP 1544 ms en escritorio y 1528 ms en
    móvil**. Consola **limpia en los dos temas**, con el icono y la etiqueta correctos en cada
    uno y el correo ya ensamblado tras hidratar.
    ⚠️ La primera corrida dio 4088 ms con el CDN frío, frente a 1544 y 1376 las otras dos. Es
    el mismo comportamiento anotado en T2-23: en producción hay que mirar la mediana, no la
    primera carga.
  - 📌 **El `<noscript>` se queda.** Parecía que sobraba —el HTML ya llega pintado—, pero sin
    JavaScript las secciones heredan `opacity: 0` de `whileInView`: medido, el email del
    bloque Contacto está en el DOM y **no se ve**. Sigue siendo la única vía de contacto sin
    JS. Contrapartida asumida: sin JS se ven dos `<h1>`.

- [x] **[T4-05] Publicar un `llms.txt`**
  - **Área:** SEO · **Ubicación:** `public/`
  - **Qué hacer:** ⚠️ **premisa desfasada (2026-09-08): esa categoría ya puntúa 100 en producción
    sin `llms.txt`**, así que el motivo original desapareció; reevaluar antes de hacerla. Decía:
    la categoría *Agentic Browsing* de Lighthouse puntúa 67 y señala la ausencia de
    `llms.txt`. Es una convención emergente, no un estándar; para un portafolio que cada vez leen
    más herramientas de reclutamiento automatizadas, tiene sentido. Bajo impacto, coste mínimo.
  - **Criterio de aceptación:** `/llms.txt` existe con un H1 y enlaces.
  - **Esfuerzo:** bajo · **Depende de:** T1-06
  - **Cerrada:** 2026-09-11 · `public/llms.txt` con el formato de
    llmstxt.org — H1, resumen en cita, CV (los dos PDF), proyectos con su stack, GitHub y
    LinkedIn —, sacado de `src/data/projects.ts`, `src/lib/contact.ts` y el `schema.org/Person`
    de `index.html`. Tres decisiones:
    - **El email va ofuscado** (`[at]`/`[dot]`), igual que en el `<noscript>` de T2-14: un
      archivo pensado para que lo lean máquinas es justo lo que la ofuscación quiere evitar.
    - **Añadido a `links.yml`.** Duplica las rutas de los CV, que llevan la fecha en el nombre;
      al actualizar el CV este archivo se quedaría apuntando a un 404 sin que nada avisara.
    - **`Content-Type: text/plain; charset=utf-8` declarado en `netlify.toml`**, como el
      sitemap en T2-13: sin charset, las tildes pueden llegar como mojibake.
    ⚠️ Deuda asumida: los proyectos quedan **duplicados a mano** respecto a `projects.ts`.
    Generarlo en el build sería lo robusto, pero es más código que el propio archivo.
    ✅ **Verificado en producción** (`94fb968`): `/llms.txt` → **200**,
    `Content-Type: text/plain; charset=utf-8`, tildes legibles y contenido **idéntico byte a
    byte** al de `public/`. 13 de sus 14 URLs responden 200; la de LinkedIn da 999, que es su
    bloqueo anti-bots y ya está excluida en `lychee.toml`.

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
| 2026-09-10 | T2-08, T2-10, T2-11, T2-20, T2-22, T2-23 | Playwright ampliado a **25 e2e + 3 visuales** y Lighthouse CI con presupuestos. El diagnóstico del ROADMAP sobre el LCP era falso: no era el arranque de React —el navbar pinta a 108 ms— sino el final de la animación de entrada del Hero. LCP **748→108 ms** en escritorio y **2292→1624 ms** en móvil, donde el elemento LCP es otro. |
| 2026-09-10 | T2-15, T2-16, T2-17, T2-18, T3-01 | Bloque de contenido del Hero: de 8 acciones compitiendo a 5 en una sola fila, wordmark «RAJB · Ricky Jiménez» y desplegable de CV con Escape y clic fuera. Tres variantes construidas y comparadas con capturas antes de elegir. |
| 2026-09-10 | T3-13, T3-14, T3-15, T3-16 | `TechIcon.tsx` de **550 a 74 líneas** en tres archivos (datos / lógica / componente). El análisis de iconos sin usar dio 25 en el primer intento y **18** en el correcto: identificaba los iconos por su `path` y colapsaba las claves que comparten dibujo. Ese mismo error volvió a morder durante el refactor, y por eso `pickIconKey` devuelve la clave y no el icono. |
| 2026-09-10 | T3-03, T3-04, T3-17, T3-19, T3-20 | Prettier + paso en CI, con los `.md` fuera a propósito. Destapó que el estilo sin punto y coma había **migrado** al archivo recién creado en T3-16. El README describía ESLint 9 (es 10), variables de entorno que no existen y un despliegue a GitHub Pages que perdería todas las cabeceras de `netlify.toml`. Arreglado el solape de 1px de las anclas separando el token del header en dos. |
| 2026-09-10 | T3-05, T3-06, T3-07 | **Tema claro.** La capa semantica no cambio ni una linea, que era la apuesta de la arquitectura. Los 17 tokens salen de resolver la luminosidad que iguala el contraste del tema oscuro, con una calculadora validada primero contra los ratios que el propio repositorio ya habia medido. Destello **cero**, comprobado midiendo la luminancia de los 68 fotogramas de la carga a 4G lento. El scrim del lightbox no aislaba en claro (7.47 de desviacion frente a 2.43) y se corrigio a 2.41. La suite visual se auto-delato: pasaba a auditar el tema claro por el `colorScheme` por defecto de Playwright. |
| 2026-09-10 | T3-08 … T3-12 | **Tier 3 completo.** Las cinco tareas se remidieron antes de tocarlas: los números del enunciado eran de antes de los cambios de contenido. T3-09 y T3-10 con `lh` (reserva del Hero exacta al píxel, CLS con tecleo 0.0035 → 0.0026). T3-08, T3-11 y T3-12 con variantes construidas y elegidas con capturas; Competencias −38 % y sin huecos, con un reparto en columnas elegido entre 2187. T3-11 no cumple el criterio escrito, por decisión y con el motivo anotado. Seis pruebas nuevas, todas validadas por mutación. |
| 2026-09-11 | T4-04 | **Prerender.** FCP/LCP reales **−45 %** a 4G lento + CPU ×4 (1924 → 1060 ms en escritorio, 1912 → 1028 en móvil), con 4 medianas de 3 corridas por configuración. Lighthouse dice lo contrario (2218 → 2388 ms) porque *simula* la descarga del documento, que crece 18 kB gzip: se decide por el navegador real. Obligó a sacar el correo del HTML generado (habría deshecho T3-13; el build ahora falla si se filtra) y a que el icono del tema lo elija el CSS. El `<noscript>` se queda: sin JS el email hereda `opacity: 0`. |
| 2026-09-11 | T2-21, T4-02, T4-05 | **Tier 2 completo.** Tag `v2.0.0` sobre `710f799`; el primer push no lo subió (`git push` no sube tags) y los enlaces del changelog dieron 404 hasta subirlo aparte. Cabeceras alineadas con lo que Netlify sirve de verdad y `img-src` cerrado a `'self' data:`. `llms.txt` con charset declarado y bajo el verificador de enlaces. Las dos verificadas en producción: una primera pasada con la ventana estrecha pareció mostrar el CSP bloqueando 3 capturas, pero eran miniaturas `hidden sm:block` con `loading="lazy"` que nunca se piden. |
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
