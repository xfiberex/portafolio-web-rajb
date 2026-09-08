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

### Interno

- Auditoría técnica completa de las 13 áreas, con verificación sobre la aplicación desplegada
  (Chrome DevTools + Lighthouse) además de la revisión de código. Se midieron por primera vez
  Core Web Vitals, contraste real, áreas táctiles, peso de bundle y comportamiento con
  `prefers-reduced-motion`. Ver el registro de sesión en [CONTEXT.md](CONTEXT.md).
- `docs/BACKLOG.md` migrado a [ROADMAP.md](ROADMAP.md) en la raíz, renumerado al esquema
  `T{tier}-{nn}` por severidad. 27 tareas heredadas + 33 nuevas.
- Añadidos [CHANGELOG.md](CHANGELOG.md) y [CONTEXT.md](CONTEXT.md).
- Capturas de evidencia de la auditoría en `docs/auditoria-2026-09-08/`.

**Sin cambios de código.** La auditoría se entregó como informe; las correcciones están
pendientes de aprobación (Fase 2).

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
