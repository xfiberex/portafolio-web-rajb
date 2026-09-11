import { toAssetUrl } from "./assets";

/**
 * Datos de contacto compartidos.
 * ─────────────────────────────────────────────────────────────
 * Viven aquí y no en cada componente porque los usan tres sitios
 * (Hero, Contact y el fallback de ErrorBoundary) y el nombre del
 * PDF lleva la fecha dentro: al actualizar el CV hay que cambiarlo
 * en un solo lugar o los enlaces se quedan apuntando a un 404.
 */

/** El correo va partido para que no aparezca literal en el HTML servido. */
export const EMAIL_PARTS: [string, string, string] = ["rickyjimenez1820", "gmail", "com"];

export const buildEmail = ([user, domain, tld]: [string, string, string]): string => `${user}@${domain}.${tld}`;

/**
 * La forma legible para personas pero no para un rastreador de HTML plano.
 * Es la que queda en el HTML prerenderizado (T4-04) y la del <noscript>.
 */
export const buildEmailOfuscado = ([user, domain, tld]: [string, string, string]): string =>
  `${user} [at] ${domain} [dot] ${tld}`;

export const CV_URL = toAssetUrl("assets/CV-Ricky Angel Jiménez Bueno-07-09-2026.pdf");
export const CV_ATS_URL = toAssetUrl("assets/ATS-CV-Ricky Angel Jiménez Bueno-07-09-2026.pdf");
