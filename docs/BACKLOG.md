# Backlog — superado

> **Este archivo ya no se mantiene.** El 2026-09-08 su contenido se migró a
> [`ROADMAP.md`](../ROADMAP.md), en la raíz del repositorio.

## Por qué

El backlog no tenía IDs de tarea, así que ninguna de sus entradas vivía todavía en commits ni
issues y se podía renumerar sin coste. Se pasó al esquema por severidad `T{tier}-{nn}` que usa el
proceso de auditoría, y cada tarea heredada indica su origen (`viene de BACKLOG 1.1`). A partir de
ahí, **los IDs son permanentes**.

Se mantiene un solo archivo de pendientes a propósito: dos listas se desincronizan.

## Dónde fue cada cosa

| Backlog anterior | Ahora |
|---|---|
| Tier 0 — Desbloquear | `T0-01` a `T0-03` (cerradas) |
| Tier 1.1 — Convertir imágenes a WebP | `T2-01` a `T2-03` — ⚠️ la tabla de imágenes estaba desactualizada; corregida en `T2-02` |
| Tier 1.2 — Imagen Open Graph propia | `T2-15` |
| Tier 1.3 — Jerarquía del Hero | `T2-16`, `T2-17`, `T2-18` |
| Tier 2 — Pulido visual | `T3-08` a `T3-12` (ahora con medidas reales, no estimaciones) |
| Tier 3 — Tema claro / oscuro | `T3-05` a `T3-07` |
| Tier 4.1 — Lighthouse CI | `T2-08` |
| Tier 4.2 — axe-core | `T2-09` |
| Tier 4.3 — Playwright | `T2-10` |
| Tier 4.4 — Snapshots visuales | `T2-11` |
| Tier 4.5 — Vitest funciones puras | `T2-07` |
| Tier 4.6 — Análisis de bundle | `T2-06` |
| Tier 5 — `skills-lock.json` | `T4-06` |
| Notas y trampas conocidas | [`CONTEXT.md`](../CONTEXT.md) → *Trampas conocidas* |

## Los tres archivos

| Archivo | Pregunta que responde |
|---|---|
| [`ROADMAP.md`](../ROADMAP.md) | Qué falta por hacer |
| [`CHANGELOG.md`](../CHANGELOG.md) | Qué cambió en cada versión |
| [`CONTEXT.md`](../CONTEXT.md) | Qué se decidió, por qué, y qué se aprendió |
