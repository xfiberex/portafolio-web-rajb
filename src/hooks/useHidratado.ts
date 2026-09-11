import { useSyncExternalStore } from "react";

const sinSuscripcion = () => () => {};

/**
 * `false` al prerenderizar y durante la hidratación; `true` a partir de ahí.
 *
 * Existe por el prerender (T4-04): el HTML de `dist/index.html` se genera en
 * Node, y lo que solo puede saberse en el navegador —o lo que no debe quedar
 * escrito en el HTML, como el correo— tiene que renderizarse igual que en el
 * servidor durante la hidratación y cambiar después. `useSyncExternalStore`
 * hace exactamente eso con su snapshot de servidor, sin el render doble ni el
 * aviso de desajuste que daría un `useState` + `useEffect`.
 */
export default function useHidratado(): boolean {
  return useSyncExternalStore(
    sinSuscripcion,
    () => true,
    () => false,
  );
}
