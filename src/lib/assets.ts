/**
 * Helpers de URL para assets y enlaces externos.
 * Antes `toAssetUrl` estaba duplicado en Hero.tsx y Projects.tsx
 * con implementaciones distintas.
 */

const withBase = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

/** Imagen de reemplazo cuando falta el asset o falla la carga. */
export const placeholderImage = withBase("placeholder.svg");

/** Resuelve rutas relativas contra BASE_URL; deja pasar las absolutas. */
export const toAssetUrl = (path?: string): string => {
  if (!path) return placeholderImage;
  if (/^(https?:)?\/\//i.test(path)) return path;
  return withBase(path);
};

/**
 * Valida que la URL use protocolo http/https.
 * Bloquea inyección de `javascript:` y `data:` en enlaces externos.
 */
export const safeExternalUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  try {
    const { protocol } = new URL(url);
    return protocol === "https:" || protocol === "http:" ? url : undefined;
  } catch {
    return undefined;
  }
};
