import TechIcon from "../TechIcon";

interface TechTagsProps {
  tags?: string[];
  /** `sm` para tags de proyecto, `md` para la grilla de competencias. */
  size?: "sm" | "md";
  className?: string;
  /** Nombre accesible de la lista. */
  label?: string;
}

const styles = {
  sm: { item: "gap-1.5 rounded-full px-3 py-1.5 text-xs", icon: "h-3.5 w-3.5" },
  md: { item: "gap-2 rounded-lg px-3 py-2 text-xs", icon: "h-4 w-4" },
} as const;

/**
 * TechTags Component
 * ─────────────────────────────────────────────────────────────
 * Lista de tecnologías, compartida por las tarjetas de proyecto y
 * la sección de competencias (antes eran dos markups distintos).
 *
 * Sin estados hover a propósito: los tags no son interactivos, y el
 * hover que tenían prometía un click que no existe.
 */
const TechTags = ({ tags, size = "sm", className = "", label = "Tecnologías" }: TechTagsProps) => {
  if (!tags?.length) return null;

  const style = styles[size];

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label={label}>
      {tags.map((tag) => (
        <li
          key={tag}
          className={`inline-flex items-center border border-border bg-surface font-medium text-muted ${style.item}`}
        >
          <TechIcon name={tag} className={style.icon} withBg={false} decorative />
          <span>{tag}</span>
        </li>
      ))}
    </ul>
  );
};

export default TechTags;
