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
| **Nº de pruebas** | **87** unitarios (Vitest) + **21** e2e (Playwright: axe-core, foco, navegación, reflow, movimiento reducido). Ambos en CI |
| **Build medido** | 384.50 kB JS (124.71 kB gzip) · 30.50 kB CSS (6.38 kB gzip) · un solo chunk |
| **Imágenes publicadas** | 342 kB (6 capturas WebP + la tarjeta social). Antes: 1.68 MB |
| **Peticiones a terceros** | **0.** La fuente se auto-hospeda desde 2026-09-08 |
| **Planificación** | [ROADMAP.md](ROADMAP.md) — 40 tareas abiertas; Tier 0 y Tier 1 cerrados |
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
│   ├── assets/                 Los dos PDF del CV. Comparten carpeta con el build de
│   │                           Vite, y por eso la regla de caché va por extensión.
│   ├── projects/               Capturas de los proyectos, en WebP (ver decisiones).
│   ├── fonts/                  Inter auto-hospedada (variable, subsets latin y latin-ext)
│   │                           y su licencia SIL OFL.
│   ├── og-image.jpg            Tarjeta social 1200×630.
│   ├── robots.txt              Enlaza el sitemap.
│   ├── sitemap.xml             Una sola URL; su Content-Type se declara en netlify.toml.
│   ├── favicon.svg
│   └── placeholder.svg         Imagen de reemplazo cuando falla la carga de una captura.
├── src/
│   ├── main.tsx                Monta React. ErrorBoundary + <MotionConfig reducedMotion=
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
│   │       ├── ErrorBoundary.tsx   Fallback sin dependencias cuando el árbol React revienta.
│   │       └── ObfuscatedEmail.tsx  ⚠️ Su rama de render por defecto es código muerto.
│   ├── data/                   Contenido del portafolio, tipado. Editar aquí, no en los
│   │                           componentes.
│   ├── hooks/
│   │   ├── useScrollspy.ts     IntersectionObserver + scroll con rAF. Cachea la geometría
│   │   │                       para no leer layout al scrollear (ver Trampas conocidas).
│   │   └── usePrefersReducedMotion.ts   useSyncExternalStore sobre matchMedia.
│   ├── lib/
│   │   ├── animations.ts       Variantes de Framer Motion. Fuente única de verdad.
│   │   ├── assets.ts           toAssetUrl (BASE_URL) y safeExternalUrl (bloquea javascript:).
│   │   └── contact.ts          Email y rutas de los CV, en un solo sitio.
│   └── types/index.ts          Las 5 interfaces de datos.
├── scripts/
│   └── images-to-webp.mjs      Conversión con sharp. Se corre a mano, no en el build.
├── docs/
│   ├── BACKLOG.md              Superado por ROADMAP.md el 2026-09-08.
│   └── auditoria-2026-09-08/   Capturas de evidencia de la auditoría.
└── .github/workflows/
    ├── ci.yml                  Tipos + lint + build. En push y PR a main.
    └── links.yml               Enlaces externos. Cron semanal, no en PR (decisión, ver abajo).
```

---

## Estado actual

**Recién cerrado (2026-09-08):** la auditoría técnica de las 13 áreas **y la primera tanda de
correcciones**. Tier 0 y **Tier 1 completos**, más T2-01…T2-05, T2-13, T2-14, T3-02 y T4-03.

Lo medido antes y después, en las mismas condiciones:

| | Antes | Ahora |
|---|---|---|
| Contraste del botón primario | 3.45:1 ❌ | **4.56:1** ✅ |
| Contraste en `hover` | 4.42:1 ❌ | **5.91:1** ✅ |
| `prefers-reduced-motion` en el Hero | ignorado (WCAG A) | respetado; CLS pasa a **0** |
| Peticiones a terceros | 1 (Google Fonts) | **0** |
| Peso de las imágenes | 1.68 MB | **342 kB** |
| Coste de lecturas de layout al scrollear | 740.6 ms | **0.5 ms** |
| Ruta inexistente | 200 con la página completa | **404** |
| Contenido sin JavaScript | 0 caracteres | **268** |

**Abierto:** las 40 tareas restantes de [ROADMAP.md](ROADMAP.md). Ninguna de Tier 0 ni Tier 1.
Lo siguiente por valor medido:

- **T2-06** — el LCP sigue dominado por el arranque de React, no por la red. Falta correr el
  analizador de bundle antes de decidir nada.
- **T2-07 / T2-09 / T2-10** — no hay **ni un test**. Todo lo verificado en esta sesión se
  comprobó a mano y hoy no tiene red de seguridad.
- **T2-15** — la tarjeta social ya tiene la proporción correcta, pero sigue siendo una captura
  recortada, no una pieza diseñada.
- **T2-19** — sin `browserslist` declarado; T2-03 se cerró asumiendo un mínimo de 2020.

✅ **Verificado en producción el 2026-09-08**, tras desplegar Tier 1 y T2-04/05/13/14:

| Comprobación | Resultado |
|---|---|
| `/ruta-que-no-existe` | **404** (era 200 con la página completa) |
| `/robots.txt` | 200 `text/plain` |
| `/sitemap.xml` | 200 **`application/xml; charset=utf-8`** |
| Lighthouse móvil | SEO **100**, Accesibilidad **100**, Buenas prácticas **100** — 48 auditorías, 0 fallos |
| CSP servido | cerrado a `'self'`; **cero errores y cero avisos** en consola |
| Fuente | `/fonts/inter-latin.woff2`; ninguna referencia a Google |

Con eso quedan cerrados los criterios de **T1-06** y **T2-13**.

⚠️ **Queda uno solo sin verificar: T1-04**, el tamaño del bundle en un deploy preview. Ese sí
necesita una *pull request*, porque el contexto `deploy-preview` de Netlify no existe en
producción ni en un build local.

📌 **Dos cifras de la auditoría quedaron desfasadas al alza:** la accesibilidad de Lighthouse
subió de 96 a 100, y *Agentic Browsing* de 67 a 100 — esta última **sin** publicar `llms.txt`,
así que la premisa de T4-05 ya no se sostiene tal como está escrita. Ojo igualmente: sigue en pie
la trampa de que las animaciones `whileInView` dejan invisible buena parte de `<main>` cuando
estas herramientas miden (T2-09), así que ese 100 de accesibilidad **no** es una medida del sitio
completo.

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
**Resultado medido (2026-09-08): CLS ≈ 0.006**, no 0.00 como se anotó primero. Ese 0.00 salía de
una traza de carga corta; observando `layout-shift` durante 6 s se acumulan ~100 desplazamientos
diminutos, y se siguen acumulando mientras el Hero teclea. Verificado que la causa es el propio
texto animado: con `prefers-reduced-motion` el CLS es **exactamente 0**. Sigue muy por debajo
del umbral 0.1, pero partir de «CLS = 0.00» hace creer que cualquier valor distinto es una
regresión propia. Se puede afinar (T3-10), sin empeorar esa línea base real.

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

### `prefers-reduced-motion` no detenía el texto del Hero ✅ *(resuelto 2026-09-08, T1-02)*

> **Corregido.** `usePrefersReducedMotion` desmonta `<TypeAnimation>` y renderiza texto fijo.
> Se conserva el diagnóstico porque explica por qué no bastaba con CSS.

Había tres mecanismos y **ninguno cubría el caso**:

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

### `NODE_ENV=development` inflaba el bundle de los previews un 66 % ✅ *(resuelto 2026-09-08, T1-04)*

> **Corregido:** el bloque `[context.deploy-preview.environment]` ya no existe. Se conserva
> porque explica por qué las mediciones sobre previews anteriores a esta fecha no valen.

`netlify.toml` lo fijaba en `[context.deploy-preview.environment]` con el comentario "menos
restrictivo para testing", que sugiere que solo afecta a cabeceras. **No:** hace que Vite empaquete
la build de desarrollo de React.

Medido: **635.58 kB** en preview frente a **382.32 kB** en producción. Cualquier Lighthouse sobre
una URL de preview mide una aplicación que no es la que se publica. Ver T1-04.

### El fallback SPA convertía todo el dominio en un soft 404 ✅ *(resuelto 2026-09-08, T1-06)*

> **Corregido:** eliminado de `netlify.toml` y `public/_redirects` borrado. Ahora una ruta
> inexistente devuelve 404 y existen `robots.txt` y `sitemap.xml`.

`/* → /index.html 200` estaba declarado **dos veces** (`netlify.toml` y `public/_redirects`) y el
sitio **no usa router**. Consecuencia verificada en producción: `/robots.txt`, `/sitemap.xml`,
`/ruta-que-no-existe` y hasta `/assets/index-*.js.map` devuelven todos `200 text/html`. Lighthouse
puntúa `robots-txt` = 0 por eso. Ver T1-06.

*(Efecto secundario benigno: los sourcemaps no están expuestos — no existen. Lo que devuelve 200 es
la página, no un mapa.)*

### El reflow forzado SÍ venía del scrollspy *(corregido 2026-09-08)*

> **Esta entrada decía lo contrario y estaba equivocada.** Se conserva el error porque explica
> por qué la tarea T2-05 prescribía la solución incorrecta.

La versión anterior afirmaba: *«la sospecha natural es `useScrollspy`. **No es él.** Atribuido con
sourcemap a `framer-motion/batcher.mjs` llamado desde `PopChild.mjs`»*.

**Por qué era falso.** `PopChild.mjs` es código de `AnimatePresence mode="popLayout"`, que este
proyecto no usa en ninguna parte: la atribución por sourcemap sobre un bundle minificado había
caído en un tramo de la librería que no se ejecuta. La lección general: en un bundle de una sola
línea, resolver una columna a un archivo de `node_modules` no prueba que ese código corriera.

**Lo que sí ocurría**, medido instrumentando los getters de layout y cronometrando cada lectura
durante un recorrido completo (móvil, Slow 4G, CPU 4×):

| Origen | Lecturas | Coste |
|---|---:|---:|
| `useScrollspy` (`scrollHeight` + `offsetTop`) | 582 | **740.2 ms** |
| Framer Motion (`scrollTop` + `getBoundingClientRect`) | 20 | 0.4 ms |

El `rAF` throttle no ayudaba: limita a una lectura *por frame*, pero `scrollHeight` fuerza un
layout síncrono en **cada** una de esas lecturas mientras haya estilos invalidados — y con ~56
elementos animándose los hay casi siempre. Corregido cacheando la geometría y refrescándola solo
al redimensionar y vía `ResizeObserver`: **740.6 ms → 0.5 ms**. Ver T2-05.

### Convertir imágenes: `sharp` en un script, no `vite-imagetools` *(2026-09-08)*

**Decisión:** `sharp` en `scripts/images-to-webp.mjs`, ejecutado a mano (`npm run images:webp`),
con los `.webp` commiteados.

**Por qué no `vite-imagetools`**, que era la alternativa: transforma en el *import*, y aquí las
capturas viven en `public/` y se referencian como **cadenas** en `src/data/projects.ts`, que
`toAssetUrl` resuelve en runtime. Usarlo obligaba a mover las imágenes a `src/`, convertir la capa
de datos a imports estáticos o `import.meta.glob`, y tocar `ProjectCard` y `Lightbox` — un
refactor de la capa de datos para obtener una conversión que se hace una vez. No lo descarta el
gusto, lo descarta la arquitectura.

Como el script no corre en el build, ni el build ni el CI pagan la conversión, y el resultado se
revisa en el diff. Calidad 85, elegida midiendo sobre una captura real de 1919×918: 80 % menos que
el PNG y el texto de las UI sigue nítido a escala 1:1 en el lightbox (verificado). Por debajo de 80
aparecen artefactos en los bordes del texto.

### Sin respaldo PNG para las imágenes WebP *(2026-09-08)*

**Decisión:** no hay `<picture>` con respaldo. Los PNG se borraron; siguen en el historial de git.

WebP es universal desde Safari 14 (2020): Chrome 32, Firefox 65, Edge 18. Un navegador sin WebP
tampoco ejecuta este sitio, que usa React 19, Tailwind 4 y `oklch()`. Mantener un respaldo
duplicaría el peso publicado —1.10 MB de PNG que ya nadie descargaría— para cubrir un navegador
que de todas formas vería la página rota.

⚠️ Esto **cierra T2-03 antes de que T2-19 declare el `browserslist`**. Si al declararlo el mínimo
resultara ser anterior a 2020, hay que revisar esta decisión.

### Vitest recoge los `.spec.ts` de Playwright si no se le acota *(descubierto 2026-09-09)*

El patrón por defecto de Vitest incluye `**/*.spec.*`, así que arrastraba `e2e/a11y.spec.ts`
e intentaba ejecutarlo fuera del runner de Playwright. El error que sale no menciona a
Vitest y despista: *«Playwright Test did not expect test.describe() to be called here»*,
con una lista de causas probables donde ninguna es la real.

Resuelto acotando `test.include` a `src/**/*.test.{ts,tsx}` en `vite.config.ts`. Convención
del repositorio, y conviene mantenerla:

| | Sufijo | Carpeta | Se lanza con |
|---|---|---|---|
| Unitarios | `.test.ts` | `src/` | `npm test` |
| End-to-end | `.spec.ts` | `e2e/` | `npm run test:e2e` |

⚠️ `tsconfig.json` incluye solo `src`, así que **`e2e/` no pasa por `tsc`**. Su red es el
propio Playwright en CI, que sí ejecuta el código; un error de tipos allí se manifiesta como
fallo de prueba, no de compilación.

Nota sobre `vite.config.ts`: el `defineConfig` se importa de `vitest/config`, no de `vite`,
para que la clave `test` tenga tipos. **Sin** triple-slash reference: la regla
`@typescript-eslint/triple-slash-reference` la rechaza y el import ya trae los tipos.

### Una prueba que pasa a la primera no prueba nada todavía *(T2-10, 2026-09-09)*

Los 18 e2e de T2-10 salieron en verde en la primera ejecución. Eso es exactamente lo que
también haría una prueba vacua —un selector que no encuentra nada, una aserción que se
cumple sola—, así que el verde inicial no distingue entre «el código funciona» y «la prueba
no mira».

Se validaron **rompiendo el código a propósito** y comprobando que fallaba la prueba
correcta, con el mensaje correcto:

| Sabotaje | Debía fallar | Falló |
|---|---|---|
| `{false ? (` en el condicional del Hero (montar siempre `<TypeAnimation>`) | movimiento reducido | ✅ y la de «sin preferencia» siguió pasando |
| Quitar `return () => trigger?.focus?.()` del lightbox | retorno del foco | ✅ (las 2 del lightbox) |
| Cortar la rama de `Tab` del lightbox | trampa de foco | ✅ con el `Tab` exacto que se escapó |
| Inyectar un `div` de 2000 px en el Hero | scroll horizontal | ✅ los 5 anchos, con los px de desborde |

El par de movimiento reducido merece un apunte: la prueba «sin preferencia» existe solo para
que la otra no sea vacua. Si el Hero mostrara texto fijo **siempre** —por un fallo en el
hook— la prueba de `reduce` pasaría igual sin demostrar nada. Una prueba de que algo *no*
ocurre necesita a su lado la prueba de que sí puede ocurrir.

### Congelar un bug conocido en vez de saltárselo *(T2-10, 2026-09-09)*

El wordmark «Inicio» nunca recibe `aria-current`: `navItems` no incluye `home`, así que
arriba del todo el scrollspy marca una sección que ningún enlace refleja. Es un punto de
**T3-18** y arreglarlo no tocaba aquí.

La opción fácil era no probar esa zona. En su lugar la prueba **afirma el comportamiento
actual** —cero enlaces con `aria-current` en el tope— con el mensaje de fallo escrito para
quien lo arregle: *«alguien añadió `home` al nav: T3-18 está resuelto, actualizar esta
prueba»*. Así el hueco queda documentado en código ejecutable, y el arreglo futuro no puede
aterrizar sin cobertura.

### Una opacidad intermedia falsea la regla de contraste de axe *(descubierto 2026-09-09)*

Ampliación de la trampa de las animaciones `whileInView`, y más sutil que la original.
Sabíamos que a `opacity: 0` las herramientas no auditan nada. Lo que no sabíamos: axe
**mezcla el color de primer plano con el de fondo según la opacidad heredada**. Una tarjeta
a mitad de revelarse (0.93) hace que `text-primary` (`#487fff`, 5.07:1 real) se reporte
como `#4376ec` con 4.47:1 — una violación *serious* que no existe.

Aparecieron dos así en Certificados al montar T2-09. Por eso `e2e/a11y.spec.ts` no espera a
que la opacidad sea «distinta de 0» sino a que la **heredada sea exactamente 1**, y hay un
test que comprueba esa condición *antes* del scan: si falla, el verde de axe no significa
nada.

Corolario: `reducedMotion: "reduce"` **no basta**. Quita la duración de la animación pero no
los `delayChildren`/`staggerChildren` del contenedor, así que hay que recorrer la página y
esperar a la condición de todas formas.

### `toAssetUrl` trata cualquier ruta que empiece por `//` como externa *(descubierto 2026-09-09)*

La comprobación de «es absoluta» es `^(https?:)?//`, así que **cualquier** cadena que empiece
por dos barras se devuelve intacta. `//projects/x.webp` no se resuelve contra `BASE_URL`: el
navegador lo lee como protocolo relativo y va a buscar el host `projects`.

No hay ningún dato así hoy, y el comportamiento es correcto para `//cdn.example.com/x.png`.
Queda fijado por un test para que nadie escriba `//algo` en `src/data/` creyendo que es una
ruta del sitio. Descubierto escribiendo los tests de T2-07, con una expectativa equivocada.

### Los tests solo cubren funciones puras, y `TechIcon` paga un precio por ello *(2026-09-09)*

`pickColor` y `pickIcon` tuvieron que **exportarse** para poder testearlas, y eso dispara
`react-refresh/only-export-components`: el archivo mezcla un componente con sus utilidades.
La regla tiene razón y la solución de fondo es **T3-16** (sacar diccionarios y resolutores a
su propio módulo). Mientras tanto la excepción de lint va **acotada a esas dos líneas**, no al
archivo, para que siga avisando de cualquier otra mezcla.

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

LinkedIn devuelve **999** a todo cliente sin sesión de navegador; verificado con `curl`. Sin esa
exclusión habría un issue de falsos positivos cada lunes.

La exclusión de `fonts.googleapis.com` y `fonts.gstatic.com` **se retiró el 2026-09-08**: eran
orígenes de `preconnect` y el sitio ya no enlaza a Google Fonts (T2-04).

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

### Las reglas de caché de Netlify se escriben para no solaparse *(T2-20, 2026-09-09)*

Había un único `/assets/*` con `max-age=31536000, immutable`. Es correcto para los JS y CSS de
Vite, que llevan hash de contenido, pero los PDF del CV están en **la misma carpeta** y no lo
llevan. Medido en producción antes de arreglarlo:

```
/assets/index-mekZ0vce.js   public,max-age=31536000,immutable   ✅ lleva hash
/assets/CV-….pdf            public,max-age=31536000,immutable   ❌ no lleva hash
```

Lo interesante fue **cómo** arreglarlo. La primera idea —dejar que `/*.js` y `/*.css` cubrieran
los bundles y acotar `/assets/*` a los PDF— resultó apoyarse en dos supuestos que la
documentación de Netlify **no** respalda:

1. Que el comodín cruza segmentos de ruta. La doc solo dice que `*` casa *«inside of a path
   segment»*, así que `/*.js` probablemente **no** alcanzaba `/assets/index-abc.js` — y esas
   dos reglas llevaban tiempo sin cubrir nada.
2. Que hay una precedencia definida cuando dos reglas chocan. No está documentada, y la doc sí
   menciona que varios `cache-control` se **concatenan**, que sería lo peor de los dos mundos.

Por eso las reglas se reescribieron para **no solaparse** en vez de depender de un desempate:
`/assets/*.js` y `/assets/*.css` inmutables, `/assets/*.pdf` a un día con `must-revalidate`, y
los `/*.js` y `/*.css` de raíz eliminados —inútiles bajo la lectura estricta, redundantes bajo
la amplia—. Todos los patrones caben dentro de un solo segmento, que es lo único garantizado.

⚠️ Efecto secundario a vigilar: si algún día se importa una imagen desde `src/`, Vite la emitirá
en `dist/assets/` con hash y **ninguna** regla la cubrirá — se servirá con el `max-age=0` por
defecto de Netlify. Es un fallo seguro (cachea de menos, nunca de más), pero hay que añadir la
extensión.

### El LCP no era el arranque de React, era la animación del Hero *(T2-06, 2026-09-09)*

Tres tareas del ROADMAP —T2-06, T2-08 y T4-04— repetían el mismo diagnóstico heredado de la
auditoría: *«el 98 % del LCP es esperar a que React arranque»*. Es falso, y llevaba a la
solución equivocada (dividir el bundle, prerenderizar).

Lo que lo destapó fue capturar **cada candidato de LCP**, no solo el valor final:

```
 108 ms  <A>  "Competencias"              ← primer candidato: el navbar ya está pintado
 776 ms  <H1> "Ricky Angel Jiménez Bueno" ← candidato final
```

React arranca y pinta a los 108 ms. Los ~670 ms restantes son la animación de entrada.
Comprobado poniendo las duraciones de `animations.ts` a cero y reconstruyendo: **LCP 776 →
148 ms, un 81 % menos**.

La trampa que casi me lleva a la conclusión contraria: probé primero con
`prefers-reduced-motion: reduce` esperando que el LCP se desplomara, y **no bajó** (780 ms
frente a 752). Estuve a punto de descartar la hipótesis. El motivo es que
`<MotionConfig reducedMotion="user">` desactiva las animaciones de *transform* y *layout*
pero **mantiene las de opacidad** —se consideran seguras para trastornos vestibulares—, y la
opacidad es justo lo que retiene al H1. Un experimento que no distingue lo que crees que
distingue no es evidencia de nada.

Esto también explica por qué `e2e/a11y.spec.ts` tiene que esperar a opacidad exactamente 1
aunque los tests corran con movimiento reducido: la preferencia no quita esos fundidos.

### Decisión: el bundle no se divide *(T2-06, 2026-09-09)*

126,61 kB gzip en un solo chunk. Medido con `rollup-plugin-visualizer` (`npm run analyze`),
el mayor contribuyente evitable es **Framer Motion con el 33,6 %** sumando sus tres paquetes
—`react-dom` pesa más, 52,4 %, pero no se puede quitar de una app React—. El informe
completo está en [docs/analisis-bundle-2026-09-09.md](docs/analisis-bundle-2026-09-09.md).

No se divide, y el motivo no es el tamaño sino la topología: el elemento LCP es el `<h1>` del
Hero, y para pintarlo hacen falta React, el CSS y Framer Motion, porque **`Hero.tsx` y
`Navbar.tsx` lo importan los dos**. Diferir las secciones de debajo del pliegue no sacaría
Framer Motion del camino crítico, y el código propio del proyecto es solo el 9,3 % del total.
Se dividiría lo que no cuesta y seguiría cargándose lo que sí.

Se revisa si el bundle pasa de ~200 kB gzip, o si se deja de usar Framer Motion por encima
del pliegue — entonces sí tendría sentido aislarlo en un chunk diferido.

### Los iconos que faltaban, y por qué dos siguen faltando *(T2-22, cerrada 2026-09-09)*

El caso que lo destapó: `TechIcon.tsx` tenía la entrada `"Windows Forms"` y la regla
`/windows.*forms/i`, pero `src/data/skills.ts` escribe `"WinForms"` — que no contiene
"windows", así que la regla no casaba nunca pese a existir el icono. Corregida a
`/win(dows)?\s*forms/i`.

Recuento medido, no estimado:

| | Ocurrencias con glifo genérico | Tags únicos sin icono |
|---|---:|---:|
| 2026-09-08 | 14 de 109 (13 %) | 11 |
| 2026-09-09 | **8 de 109 (7 %)** | **8** |

Los paths de **Jest** y **TanStack Query** se sacaron de `simple-icons` (CC0-1.0), que usa el
mismo `viewBox="0 0 24 24"`, y se comprobaron **renderizándolos a PNG y mirándolos**: los
demás iconos del archivo están escritos a mano, y dibujar un logotipo de memoria es
exactamente lo que sale mal sin poder verlo.

**Playwright y Supertest no se añadieron.** Se buscó en los 3459 iconos del set y no están —
Puppeteer sí, Playwright no—. Dibujarlos a mano sería inventarse una marca ajena, así que
pasan a la lista de excepciones justificadas junto a las seis competencias que no son
productos. Las ocho que quedan son ahora **una decisión**, no deuda; y el test exige que la
lista coincida **exactamente** con lo que falta, en los dos sentidos: si alguien añade un
icono sin sacarlo de la lista, falla igual que si añade un tag sin icono.

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
