# Backlog — Portafolio Web

Trabajo pendiente organizado por tier. Cada tier es autocontenido: se puede
implementar y desplegar sin depender de los siguientes.

Los datos entre paréntesis son **medidos**, no estimados, salvo donde diga
"estimado".

---

## Estado actual

| Área | Estado |
|---|---|
| Design system | Tokens semánticos en dos capas (`:root` + `@theme inline`), listos para tema claro |
| Accesibilidad | Focus trap, `aria-expanded`/`aria-current`, skip link, reduced-motion, targets ≥44px |
| Performance | `lazy`/`decoding` en imágenes, CLS del Hero resuelto, scrollspy con rAF |
| SEO / social | Open Graph, Twitter Card, canonical, JSON-LD `Person` |
| Verificación | `tsc` limpio · `eslint` 34 archivos, 0 errores · build 29.11 kB CSS / 380.56 kB JS (123.15 kB gzip) |
| CI | `ci.yml` (tipos + lint + build) y `links.yml` (enlaces, cron semanal) |

Verificado en navegador a 375 / 768 / 1440 px: sin scroll horizontal, 0 de 41
elementos interactivos bajo 44 px, ciclo de foco del lightbox completo.

---

## Tier 0 — Desbloquear ✅

- [x] Commitear y pushear `docs/BACKLOG.md`, `.github/workflows/`, `lychee.toml` y `eslint.config.js` — PR #1
- [x] Verificar que `ci.yml` pasa — verde en 36 s, 7 pasos, una sola corrida (sin duplicado push/PR)
- [x] Disparar `links.yml` a mano y confirmar que no genera falsos positivos — 23 enlaces, 19 OK, 4 excluidos, **0 errores**

La corrida manual encontró que el workflow estaba roto: sólo revisaba 3
enlaces de 23. Corregido en PR #5 (ver *Trampas conocidas*).

---

## Tier 1 — Alto impacto, esfuerzo bajo

Lo que más mueve la aguja para un portafolio: que cargue rápido y que se vea
bien cuando lo compartís.

### 1.1 Convertir las imágenes a WebP

Es la mayor ganancia de performance que le queda al sitio.

| Archivo | Peso actual |
|---|---|
| `GestorTareasMERN.png` | 512 KB |
| `S-Blazor-TDApp.png` | 268 KB |
| `Porfolio-web-rajb.png` | 224 KB |
| `kiosgo-uno.png` | 204 KB |
| `SistemasVenta-ASPNET-Core-MVC.png` | 116 KB |
| `SistemaVentasDesktop.png` | 84 KB |
| **Total** | **1.4 MB** |

Reducción esperada en WebP: 60–80 % (*estimado*).

- [ ] Elegir herramienta: `sharp` (script de build) o `vite-imagetools` (transforma en el import)
- [ ] Convertir los 6 assets y actualizar las rutas en `src/data/projects.ts`
- [ ] Mantener un fallback PNG con `<picture>`, o confirmar que el soporte de WebP alcanza
- [ ] Volver a medir el peso total

**Esfuerzo:** S · **Requiere:** decidir una dependencia nueva

### 1.2 Imagen Open Graph propia (1200×630)

Hoy `og:image` apunta a `projects/Porfolio-web-rajb.png`, que funciona pero no
tiene la proporción correcta: LinkedIn la recorta.

- [ ] Diseñar una imagen 1200×630 con nombre, rol y stack principal
- [ ] Guardarla en `public/` y actualizar `og:image` y `twitter:image` en `index.html`
- [ ] Validar con el post inspector de LinkedIn y el card validator de X

**Esfuerzo:** S

### 1.3 Jerarquía del Hero

Hay 8 acciones compitiendo arriba del fold: Ver proyectos, Contactar, Descargar
CV, CV-ATS, GitHub, LinkedIn. La regla es **un** CTA primario.

- [ ] Dejar "Ver proyectos" como único botón primario; bajar el resto a secundario o terciario
- [ ] Renombrar "CV-ATS" — es jerga que un reclutador no descifra. Alternativa: un solo botón de CV con las dos variantes en un menú
- [ ] Reemplazar el wordmark "Inicio" del navbar por el nombre o un logo: es el lugar de mayor jerarquía de marca y está desperdiciado

**Esfuerzo:** S · **Requiere:** decisión de diseño

---

## Tier 2 — Pulido visual

Detalles observados en el pase visual. Ninguno es un bug; todos son cosas que
un ojo entrenado nota.

- [ ] **Vacío en la grilla de proyectos.** La tarjeta con menos contenido queda con ~230 px de hueco entre los tags y el divisor (*observado en captura, no medido*). Es inherente a grilla de alto igual con contenido variable. Opciones: igualar la cantidad de features entre proyectos, o `items-start` para que cada tarjeta mida según su contenido
- [ ] **Títulos desalineados.** "KiosGo - Sistema de Kiosko de Comida" ocupa 2 líneas y los otros 1, así que subtítulo y descripción arrancan a distinta altura. Se resuelve con un `min-h` en el bloque de encabezado
- [ ] **Hueco bajo el texto animado del Hero.** El `min-h-[3.6em]` reserva las 2 líneas de la frase más larga, así que se ve un gap cuando muestra una corta. Es el precio correcto de no tener CLS, pero se puede afinar midiendo la altura real en lugar de estimarla
- [ ] **Certificados.** 5 tarjetas idénticas, todas de Udemy, mismo icono, sin fechas. Una lista compacta comunica lo mismo en un tercio del espacio
- [ ] **Competencias.** 45 items en 6 categorías, todos con el mismo peso visual, lo que diluye tu señal fuerte (.NET + React). Además "Principios" mete frases largas ("Arquitectura MVC - Modular por dominios - Feature Based") en pills de tag, y esas no son tags

**Esfuerzo:** M en total, pero cada item es independiente

---

## Tier 3 — Tema claro / oscuro

El fundamento ya está listo: `src/index.css` separa los valores crudos
(`:root`, prefijo `--value-*`) de la capa semántica (`@theme inline`), justamente
para que agregar un tema sea un bloque de overrides y no un refactor.

- [ ] Definir los valores del tema claro en un bloque `[data-theme="light"]`
- [ ] Toggle con persistencia en `localStorage` y respeto de `prefers-color-scheme` como default
- [ ] Evitar el flash de tema incorrecto: aplicar el atributo antes del primer paint
- [ ] Verificar contraste **por separado** en ambos temas (los valores de uno no se heredan al otro)
- [ ] Revisar que el gradiente de `Layout.tsx` y los `shadow-primary/10` funcionen en claro

**Esfuerzo:** M

---

## Tier 4 — QA avanzado

Los tiers 1–3 del plan de QA ya están (lint arreglado, CI, link checker). Estos
son los que siguen.

### 4.1 Lighthouse CI

- [ ] `@lhci/cli` en un workflow, contra `vite preview` o la URL del deploy preview
- [ ] **Budgets que fallen el build**, no solo reportar: scores mínimos de perf/a11y/best-practices/SEO más umbrales de LCP, CLS y TBT
- [ ] Alternativa más barata si no querés configurar: `@netlify/plugin-lighthouse`, corre en cada deploy con menos control

### 4.2 axe-core

- [ ] Scan de axe en CI. El score de a11y de Lighthouse es superficial; axe detecta bastante más
- [ ] Sirve de red de seguridad para todo el trabajo de accesibilidad ya hecho

### 4.3 Playwright

Congelar lo que hoy está verificado sólo a mano:

- [ ] Ciclo de foco del lightbox: abre → foco al cierre → Escape → vuelve al disparador
- [ ] Menú móvil: `aria-expanded`, Escape, foco de retorno
- [ ] Skip link y `aria-current` siguiendo la sección al scrollear
- [ ] Cero scroll horizontal a 375 px
- [ ] **`prefers-reduced-motion`** — Playwright sí puede emularlo. Es el único punto que no se pudo probar: hoy sólo está verificado que la regla CSS llega bien formada al CSSOM, no su comportamiento con la preferencia activa

### 4.4 Snapshots visuales

- [ ] `toHaveScreenshot()` de Playwright a 375 / 768 / 1440
- [ ] **Requisito:** forzar reduced-motion y enmascarar la línea de texto animado, o los snapshots van a ser inestables por Framer Motion y `react-type-animation`

### 4.5 Vitest — sólo funciones puras

Nada de tests de componentes que renderizan datos estáticos: es ceremonia.

- [ ] **`pickColor` / `pickIcon` de `TechIcon.tsx`** — el que más vale. Son ~90 heurísticas con regex donde el orden importa. Un test de tabla que recorra cada tag de `projects.ts` y `skills.ts` afirmando que resuelve a un icono real atrapa el bug de "agregué una tecnología y salió el círculo genérico"
- [ ] `safeExternalUrl` de `lib/assets.ts` — relevante para seguridad, con casos borde
- [ ] `toAssetUrl` — unión con `BASE_URL`

### 4.6 Análisis de bundle

- [ ] El JS pesa 380.56 kB (123.15 kB gzip) para un sitio estático. Correr un analizador para identificar al mayor contribuyente antes de decidir si vale optimizarlo — *no medido todavía, no asumir cuál es*

**Esfuerzo:** L en total · 4.1 y 4.2 son los de mejor retorno

---

## Tier 5 — Menor

- [ ] **`skills-lock.json` no es JSON válido.** El primer byte es `@` (`0x40`), así que empieza con `@{` y `JSON.parse` falla en el carácter 1. Probablemente un `Out-File` de PowerShell que arrastró el `@` de un literal `@{`. Se arregla borrando un carácter. Decidido dejarlo, pero tenerlo presente si la herramienta de skills empieza a fallar al leer el lock
- [ ] **El lock está desactualizado:** 17 skills instaladas en `.claude/skills`, 10 fijadas. Sin pinear: `banner-design`, `brand`, `design`, `design-system`, `slides`, `ui-styling`, `ui-ux-pro-max`. Sólo importa si algún día se decide versionarlo

---

## Notas y trampas conocidas

- **Los cron se apagan solos.** En repos públicos, GitHub desactiva los workflows programados después de **60 días sin commits**. Avisa por email y se reactivan con un clic desde Actions. Para un portafolio que puede quedarse quieto meses, el chequeo semanal de enlaces se apagaría justo cuando más se necesita — las demos en tiers gratuitos se caen sin que nadie esté mirando
- **Actions es gratis acá.** El repo es público, así que los runners estándar no consumen minutos. La cuota de 2.000 min/mes del plan Free aplica sólo a repos privados (donde estos dos workflows gastarían ~50 min/mes, un 2,5 %). Los planes de GitHub cambian: confirmar en la página de billing antes de decidir en base a esto
- **El link checker no corre en PR a propósito.** Los enlaces externos flaquean por causas ajenas al commit, y romper PRs por eso entrena a ignorar el CI
- **lychee necesita globs explícitos, no directorios.** Pasándole `src/`, filtra por extensión conocida y se saltea los `.ts` — revisaba 3 enlaces de 23, sin verificar ni un repo, demo ni certificado. Hay que pasar `'src/**/*.ts'` y `'src/**/*.tsx'`. El workflow "pasaba en verde" mientras no comprobaba nada: el resumen de lychee (`Total`, `Excluded`) es lo que hay que mirar, no el check verde
- **Los enlaces root-relative necesitan `--root-dir` *y* `--scheme` juntos.** El fallo ocurre al resolver el enlace, antes de que se aplique el filtro de esquema, así que `--scheme` solo no alcanza. `--root-dir` hace que resuelva (da igual a dónde apunte) y `--scheme http/https` deja el `file://` resultante fuera del chequeo
- **`lychee.toml` tiene exclusiones deliberadas.** LinkedIn devuelve 999 a todo cliente sin sesión de navegador, y los orígenes de `preconnect` (`fonts.googleapis.com`, `fonts.gstatic.com`) devuelven 404 porque no son documentos. Ambas verificadas con `curl`. Sin esas exclusiones habría un issue de falsos positivos cada lunes
- **Estado de los enlaces al último chequeo:** los 6 repos, 3 demos y 5 certificados devuelven 200. Simulación de la config final: 3 excluidos, 19 OK, 0 falsos fallos
- **ESLint ignora las carpetas de herramientas IA.** El flat config no respeta `.gitignore`, así que `.agents`, `.claude` y `.codegraph` están en `globalIgnores`. Sin eso, el lint evaluaba scripts de terceros y un commit ajeno podía romper el CI
