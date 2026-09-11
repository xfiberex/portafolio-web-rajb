import type { SyntheticEvent } from "react";
import { motion } from "framer-motion";
import type { Project } from "../../types";
import { cardLift, fadeUpVariant } from "../../lib/animations";
import { placeholderImage, toAssetUrl } from "../../lib/assets";
import ProjectLinks from "./ProjectLinks";
import TechTags from "../ui/TechTags";

interface ProjectCardProps {
  project: Project;
  /** `featured` = imagen arriba, para la grilla. `row` = imagen a la izquierda, para la lista. */
  layout?: "featured" | "row";
  onPreview: (src: string, alt: string) => void;
}

/** Un solo reintento hacia el placeholder para no entrar en bucle de onError. */
const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
  const img = event.currentTarget;
  if (img.src.endsWith("placeholder.svg")) return;
  img.src = placeholderImage;
};

const cardClass =
  "group relative rounded-card border border-border bg-surface shadow-lg transition-[box-shadow,border-color] duration-300 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10";

/**
 * Tope de features en la grilla de destacados (T3-08). Las tres tarjetas
 * miden lo mismo, así que la que más features tiene fijaba el alto de las
 * otras dos y les dejaba 130 px vacíos bajo los tags. Con 4 el hueco más
 * grande queda en ~50 px. La lista completa sigue en el layout `row` y,
 * sobre todo, en el repositorio, que es lo que dice la línea de cierre.
 */
const MAX_FEATURES_DESTACADAS = 4;

const FeatureList = ({ project, max }: { project: Project; max?: number }) => {
  const features = project.features ?? [];
  if (!features.length) return null;

  const visibles = max ? features.slice(0, max) : features;
  const ocultas = features.length - visibles.length;

  return (
    <ul className="mt-5 space-y-2.5">
      {visibles.map((feature) => (
        <li key={feature} className="flex items-start gap-2.5 text-sm text-subtle">
          <span className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden="true" />
          <span className="leading-relaxed">{feature}</span>
        </li>
      ))}
      {ocultas > 0 && <li className="pl-4 text-xs text-subtle">+{ocultas} más en el repositorio</li>}
    </ul>
  );
};

/**
 * h4 porque cada grupo de proyectos ya aporta su propio h3.
 *
 * `alinear` reserva dos líneas de título en la grilla de destacados a partir
 * de `lg` (T3-09): con las tres tarjetas en una fila, un título que parte en
 * dos bajaba su subtítulo 28px respecto a los vecinos. Solo desde `lg` porque
 * en `sm` la grilla es de dos columnas y la tarjeta que parte queda sola en
 * su fila: reservar ahí solo añadiría un hueco a las otras dos.
 */
const Heading = ({ project, alinear = false }: { project: Project; alinear?: boolean }) => (
  <>
    <h4
      className={`text-xl font-bold text-foreground transition-colors group-hover:text-primary ${alinear ? "lg:min-h-[2lh]" : ""}`}
    >
      {project.title}
    </h4>
    {project.subtitle && (
      <p className="mt-1.5 text-xs font-semibold tracking-wide text-primary uppercase">{project.subtitle}</p>
    )}
  </>
);

/**
 * ProjectCard Component
 * ─────────────────────────────────────────────────────────────
 * Reemplaza las dos tarjetas que Projects.tsx tenía copiadas.
 *
 * `transition-[box-shadow,border-color]` en vez de `transition-all`:
 * el desplazamiento vertical lo maneja Framer Motion con transform,
 * que es lo único que el compositor puede animar sin recalcular layout.
 */
const ProjectCard = ({ project, layout = "featured", onPreview }: ProjectCardProps) => {
  const imageSrc = toAssetUrl(project.image);
  const preview = () => onPreview(imageSrc, project.title);

  if (layout === "row") {
    return (
      <motion.article variants={fadeUpVariant} className={`${cardClass} p-6`}>
        <div className="flex items-start gap-6">
          {project.image && (
            <div className="hidden w-52 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-surface-hover sm:block">
              <div className="aspect-video w-full">
                <img
                  src={imageSrc}
                  alt={`Captura de ${project.title}`}
                  loading="lazy"
                  decoding="async"
                  onError={handleImageError}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="min-w-0 flex-1">
            <Heading project={project} />
            <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>
            <FeatureList project={project} />
            <TechTags tags={project.tags} className="mt-5" />
            <ProjectLinks project={project} onPreview={preview} />
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      variants={fadeUpVariant}
      whileHover={cardLift}
      className={`${cardClass} flex flex-col overflow-hidden`}
    >
      {project.image && (
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src={imageSrc}
            alt={`Captura de ${project.title}`}
            loading="lazy"
            decoding="async"
            onError={handleImageError}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"
            aria-hidden="true"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <Heading project={project} alinear />
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted">{project.description}</p>
        <FeatureList project={project} max={MAX_FEATURES_DESTACADAS} />
        <TechTags tags={project.tags} className="mt-5" />
        {/* mt-auto alinea la fila de enlaces entre tarjetas de distinto alto */}
        <div className="mt-auto">
          <ProjectLinks project={project} onPreview={preview} />
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
