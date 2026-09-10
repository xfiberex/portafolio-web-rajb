# Análisis del bundle — 2026-09-09

Informe de la tarea **T2-06**. Reproducible con `npm run analyze`, que genera `stats.html`
(treemap interactivo, ~1 MB, ignorado por git porque se regenera en un comando).

Herramienta: `rollup-plugin-visualizer` 7.1.1, activado solo con `vite build --mode analyze`.

> ⚠️ **`stats.html` tiene que estar en `.gitignore`, y no solo por limpieza.** Tailwind 4
> detecta el contenido automáticamente y **excluye lo ignorado por git**. Mientras no lo
> estuvo, ese HTML de ~1 MB entró en el escaneo y el CSS del build creció de 30,75 a
> **30,81 kB** con clases inventadas. Se detectó porque el tamaño del CSS cambió entre dos
> builds que debían ser idénticos.

> El plugin se importa de forma **perezosa** dentro de `vite.config.ts`: con un import de
> nivel superior, un entorno que no instalara devDependencies no fallaría al analizar sino al
> cargar la configuración, tumbando el build de producción. Comprobado escondiendo el paquete
> de `node_modules` y verificando que `npm run build` sigue en exit 0.

## Tamaño publicado

| Archivo | Sin comprimir | gzip |
|---|---:|---:|
| `assets/index-*.js` | 388,85 kB | **126,61 kB** |
| `assets/index-*.css` | 30,81 kB | 6,43 kB |
| `index.html` | 7,36 kB | 2,54 kB |

Un solo chunk de JS. No hay code splitting.

## Quién ocupa el bundle

Agrupado por paquete, sobre el código ya tree-shaken y **antes** de minificar
(`renderedLength` del analizador; total 1046,4 kB):

| Paquete | kB | % |
|---|---:|---:|
| `react-dom` | 548,2 | 52,4 % |
| `framer-motion` | 238,4 | 22,8 % |
| `motion-dom` | 105,6 | 10,1 % |
| código del proyecto (`src/`) | 97,6 | 9,3 % |
| `react` | 19,8 | 1,9 % |
| `scheduler` | 11,2 | 1,1 % |
| `lucide-react` | 9,1 | 0,9 % |
| `react-type-animation` | 8,1 | 0,8 % |
| `motion-utils` | 7,1 | 0,7 % |
| otros | 1,3 | 0,1 % |

**Framer Motion sumando sus tres paquetes (`framer-motion` + `motion-dom` + `motion-utils`)
son 351,1 kB, el 33,6 %.** Es el mayor contribuyente evitable: `react-dom` pesa más, pero no
se puede quitar de una aplicación React.

La tarea pedía identificar al mayor contribuyente «*no medido todavía, no asumir cuál es*».
Medido: es Framer Motion.

## La premisa de la tarea era falsa

T2-06 partía de que *«el 98 % del LCP es esperar a que React arranque»*. No es así.

Medido sobre el build local (`npm run preview`, sin estrangular), capturando **cada candidato
de LCP** con un `PerformanceObserver` y no solo el valor final:

```
 108 ms  <A>  "Competencias"              ← primer candidato: el navbar
 776 ms  <H1> "Ricky Angel Jiménez Bueno" ← candidato final
```

React arranca y pinta el navbar a los **108 ms**. Los ~670 ms restantes no son arranque: son
la **animación de entrada del Hero**.

Dos experimentos lo confirman:

| Variante | LCP (mediana de 3) |
|---|---:|
| Normal | 752 ms |
| Con `prefers-reduced-motion: reduce` | 780 ms |
| Con las duraciones de `animations.ts` a **0** | **148 ms** |

Poner las animaciones a cero baja el LCP un **81 %**. Y `prefers-reduced-motion` **no** lo
arregla: `<MotionConfig reducedMotion="user">` desactiva las animaciones de *transform* y
*layout*, pero mantiene las de **opacidad**, que son justo las que retienen el H1.

Con estrangulamiento (4G lento, CPU ×4), el hueco FCP→LCP se mantiene:

| | FCP | LCP | hueco |
|---|---:|---:|---:|
| Producción | 4716 ms | 5372 ms | 656 ms |
| Build local | 1676 ms | 2008 ms | 332 ms |

## Decisión: **no dividir el bundle**

1. **No atacaría el LCP.** El elemento LCP es el `<h1>` del Hero. Para pintarlo hace falta
   React, `react-dom`, el CSS y Framer Motion — porque `Hero.tsx` **y** `Navbar.tsx` lo
   importan. Diferir las secciones de debajo del pliegue no saca a Framer Motion del camino
   crítico.
2. **Lo diferible es poco.** Todo el código del proyecto son 97,6 kB de 1046,4 (9,3 %), y solo
   una parte está bajo el pliegue.
3. **El coste real está en otro sitio:** 628 ms de LCP en la animación de entrada, frente a un
   bundle que se descarga en milisegundos.
4. Un chunk único evita además cascadas de peticiones, que es el problema opuesto.

**Se revisa si** el bundle pasa de ~200 kB gzip, o si se deja de usar Framer Motion por encima
del pliegue (entonces sí tendría sentido aislarlo en su propio chunk diferido).

## Consecuencia

Se abre **T2-23** para el coste real: la animación de entrada del Hero.
Y la premisa de **T4-04** (prerender/SSG) queda corregida: el HTML sin contenido no es el
cuello de botella que se creía, y prerenderizar por sí solo no lo arreglaría, porque al
hidratar, Framer volvería a poner el H1 a `opacity: 0`.
