import { FALLBACK_PATH, ICON_PATHS } from "../data/tech-icons";
import { pickColor, pickIconKey } from "../lib/tech-icons";

/**
 * TechIcon Component
 * ─────────────────────────────────────────────────────────────
 * Pinta la silueta de una tecnología con su color de marca.
 *
 * Solo render: los diccionarios están en `src/data/tech-icons.ts` y la
 * resolución nombre → icono en `src/lib/tech-icons.ts` (T3-16). Antes los
 * tres vivían aquí, en 550 líneas, y exportar las funciones desde un
 * archivo de componente obligaba a silenciar `react-refresh` dos veces.
 */
interface TechIconProps {
  name?: string;
  /** Tamaño en px. Alternativa: pasar clases de Tailwind en `className`. */
  size?: number;
  className?: string;
  /** Añade un círculo de fondo tenue detrás de la silueta. */
  withBg?: boolean;
  /** Texto visible junto al icono. */
  label?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  /** Nombre accesible; por defecto, `name`. */
  title?: string;
  /**
   * Oculta el icono a los lectores de pantalla. Usar cuando el nombre de la
   * tecnología ya se pinta como texto al lado, o se anuncia dos veces
   * ("React React").
   */
  decorative?: boolean;
}

export default function TechIcon({
  name,
  size,
  className = "w-5 h-5",
  withBg = false,
  label,
  labelClassName = "ml-2 text-sm",
  wrapperClassName = "inline-flex items-center",
  title,
  decorative = false,
}: TechIconProps) {
  const px = typeof size === "number" ? size : undefined;
  const clave = pickIconKey(name);
  const glifo = <path d={clave ? ICON_PATHS[clave] : FALLBACK_PATH} />;

  const contenido = (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": title || name })}
      width={px}
      height={px}
      className={className}
      style={{ color: pickColor(name) }}
      fill="currentColor"
    >
      {withBg && <circle cx="12" cy="12" r="11" fill="currentColor" fillOpacity="0.1" />}
      {glifo}
    </svg>
  );

  if (!label) return contenido;

  return (
    <span className={wrapperClassName} title={title || name}>
      {contenido}
      <span className={labelClassName}>{label}</span>
    </span>
  );
}
