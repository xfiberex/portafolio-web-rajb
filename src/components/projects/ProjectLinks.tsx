import { ExternalLink, Github, Maximize2 } from "lucide-react";
import type { Project } from "../../types";
import { safeExternalUrl } from "../../lib/assets";

interface ProjectLinksProps {
  project: Project;
  onPreview: () => void;
}

/** Padding vertical suficiente para llegar al mínimo de 44px de área táctil. */
const linkClass =
  "inline-flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-muted hover:bg-surface-hover hover:text-primary";

/**
 * ProjectLinks Component
 * ─────────────────────────────────────────────────────────────
 * Fila de acciones de un proyecto. Este bloque estaba duplicado
 * entre la tarjeta destacada y la de lista, y ya había divergido
 * entre ambas copias.
 */
const ProjectLinks = ({ project, onPreview }: ProjectLinksProps) => {
  const externals = [
    { key: "frontend", url: project.frontend, label: "Frontend" },
    { key: "backend", url: project.backend, label: "Backend" },
    { key: "demo", url: project.demo === "#" ? undefined : project.demo, label: "Demo" },
  ];

  return (
    /* El borde va en el contenedor exterior y el -mx-3 en el interior:
       si van juntos, la línea divisoria sobresale del padding de la tarjeta. */
    <div className="mt-6 border-t border-border pt-4">
      <div className="-mx-3 flex flex-wrap items-center gap-1">
        {project.github && (
          <a href={safeExternalUrl(project.github)} target="_blank" rel="noopener noreferrer" className={linkClass}>
            <Github size={18} aria-hidden="true" />
            Repo
          </a>
        )}

        {project.image && (
          <button
            type="button"
            onClick={onPreview}
            className={linkClass}
            aria-label={`Ampliar imagen de ${project.title}`}
          >
            <Maximize2 size={18} aria-hidden="true" />
            Ver
          </button>
        )}

        {externals.map(({ key, url, label }) => {
          const safeUrl = safeExternalUrl(url);
          if (!safeUrl) return null;
          return (
            <a key={key} href={safeUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              <ExternalLink size={18} aria-hidden="true" />
              {label}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectLinks;
