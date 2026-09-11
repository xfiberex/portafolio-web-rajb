import { Fragment } from "react";
import { motion } from "framer-motion";
import type { Skill } from "../types";
import { skills } from "../data/skills";
import { scaleUpVariant, sectionViewport, staggerContainer } from "../lib/animations";
import Section from "./ui/Section";
import SectionHeader from "./ui/SectionHeader";
import TechTags from "./ui/TechTags";

const COLUMNAS = [1, 2, 3] as const;

const Contenido = ({ grupo }: { grupo: Skill }) => {
  if (grupo.formato === "principal") {
    return <TechTags tags={grupo.items} size="md" label={`Tecnologías de ${grupo.category}`} />;
  }

  if (grupo.formato === "lista") {
    return (
      <ul className="space-y-2">
        {grupo.items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
            <span className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    );
  }

  /* Sigue siendo una <ul>: se lee "lista, 9 elementos", no una frase larga.

     Cómo parte la línea, que costó dos intentos:
     - El espacio va FUERA de cada <li>: es la oportunidad de corte entre
       elementos. Dentro no sirve; con él dentro, la lista entera era una
       línea irrompible que desbordaba la página.
     - Cada <li> es `inline-block max-w-full` y no `whitespace-nowrap`. Un
       nombre salta entero a la línea siguiente si no cabe («SQL Server» no
       se parte), pero si es más ancho que la línea entera se parte por
       dentro. Con `nowrap`, «Mitigación de XSS, CSRF e inyección SQL»
       desbordaba 22 px a 320 px de ancho. Ambos los cazó responsive.spec.ts. */
  return (
    <ul className="text-sm leading-7 text-muted" aria-label={`Tecnologías de ${grupo.category}`}>
      {grupo.items.map((item) => (
        <Fragment key={item}>
          <li className="inline-block max-w-full after:mx-1.5 after:text-subtle after:content-['·'] last:after:content-none">
            {item}
          </li>{" "}
        </Fragment>
      ))}
    </ul>
  );
};

/**
 * Skills Component
 * ─────────────────────────────────────────────────────────────
 * T3-12: jerarquía en tres niveles (principal / texto / lista) y, en
 * escritorio, tres columnas sin huecos verticales que cierran en un
 * rectángulo: la última tarjeta de cada columna crece lo que falte.
 *
 * Por debajo de `lg` los contenedores de columna son `display: contents`,
 * así que las tarjetas vuelven a la grilla normal. El `order` inline es el
 * índice en los datos: abajo de `lg` restaura el orden de lectura original
 * (Frontend, Backend, Bases de datos...), y dentro de cada columna de
 * escritorio coincide con el orden de la columna, porque el reparto
 * respeta ese índice creciente.
 */
const Skills = () => (
  <Section id="skills">
    <SectionHeader title="Competencias" subtitle="Tecnologías y herramientas que domino" />

    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {COLUMNAS.map((columna) => {
        const grupos = skills.filter((g) => g.columna === columna);
        return (
          <div key={columna} className="contents lg:flex lg:flex-col lg:gap-6" data-columna={columna}>
            {grupos.map((grupo, i) => {
              const principal = grupo.formato === "principal";
              const ultima = i === grupos.length - 1;
              return (
                <motion.div
                  key={grupo.category}
                  variants={scaleUpVariant}
                  style={{ order: skills.indexOf(grupo) }}
                  className={`group rounded-card border shadow-lg transition-[box-shadow,border-color] duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 ${
                    principal
                      ? "border-primary/45 bg-gradient-to-b from-primary-soft to-surface to-60% p-6"
                      : "border-border bg-surface px-6 py-5"
                  } ${ultima ? "lg:flex-1" : ""}`}
                >
                  {principal && (
                    <p className="mb-2 text-xs font-bold tracking-widest text-primary uppercase">Stack principal</p>
                  )}
                  <h3
                    className={`font-bold text-foreground transition-colors duration-300 group-hover:text-primary ${
                      principal ? "mb-4 text-lg" : "mb-2 text-base"
                    }`}
                  >
                    {grupo.category}
                  </h3>
                  <Contenido grupo={grupo} />
                </motion.div>
              );
            })}
          </div>
        );
      })}
    </motion.div>
  </Section>
);

export default Skills;
