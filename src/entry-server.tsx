import { renderToString } from "react-dom/server";
import Raiz from "./Raiz";
import { buildEmail, EMAIL_PARTS } from "./lib/contact";

/** Para que `prerender.mjs` compruebe que el correo no se filtra al HTML. */
export const correoLiteral = buildEmail(EMAIL_PARTS);

/**
 * Entrada del prerender (T4-04). La compila `vite build --ssr` y la ejecuta
 * `scripts/prerender.mjs` en Node, que inyecta el resultado en el `#root` de
 * `dist/index.html`. No se sirve nunca: solo existe durante el build.
 */
export const render = (): string => renderToString(<Raiz />);
