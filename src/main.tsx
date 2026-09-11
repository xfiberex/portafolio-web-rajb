import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import Raiz from "./Raiz";

const contenedor = document.getElementById("root")!;

/*
 * En el build, `#root` ya trae el HTML prerenderizado (T4-04) y React solo
 * lo hidrata. En `vite dev` no hay prerender y llega vacío: ahí se monta
 * desde cero. Hidratar un contenedor vacío no falla, pero lo recrea entero
 * y avisa en consola de un desajuste en cada recarga.
 */
if (contenedor.hasChildNodes()) {
  hydrateRoot(contenedor, <Raiz />);
} else {
  createRoot(contenedor).render(<Raiz />);
}
