import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { fadeUpVariant, sectionViewport } from "../lib/animations";
import Section from "./ui/Section";
import SectionHeader from "./ui/SectionHeader";
import { buildEmail, buildEmailOfuscado, EMAIL_PARTS } from "../lib/contact";
import useHidratado from "../hooks/useHidratado";

/**
 * El correo se ensambla en tiempo de ejecución a partir de sus tres partes:
 * así el literal `usuario@dominio.tld` no existe en el HTML servido ni en
 * el bundle, y los rastreadores que leen el HTML plano no lo encuentran. En
 * el <noscript> aparece a propósito en forma `[at]`/`[dot]`.
 *
 * Antes esto vivía en un componente `ObfuscatedEmail` con un estado
 * `isRevealed` y una rama de render por defecto que **nunca se ejecutaban**:
 * sus dos únicos usos pasaban render prop, y uno de ellos ya pintaba el
 * correo en claro en el primer render (T3-13).
 *
 * Con el prerender (T4-04) el primer render ocurre en Node y **se escribe en
 * `dist/index.html`**: pintar `{email}` ahí deshacía toda la ofuscación.
 * Hasta hidratar se muestra la forma `[at]`/`[dot]`; `scripts/prerender.mjs`
 * falla el build si el literal llega al HTML.
 */
const Contact = () => {
  const hidratado = useHidratado();
  const email = buildEmail(EMAIL_PARTS);
  const abrirClienteDeCorreo = () => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <Section id="contact">
      {/* Usa SectionHeader como el resto de secciones: antes duplicaba su
        markup a mano, que es justo lo que el componente existe para evitar
        (T3-18). Hereda el `text-center` del contenedor. */}
      <div className="mx-auto max-w-2xl text-center">
        <SectionHeader
          title="Conectemos"
          subtitle="¿Cuentas con una oportunidad laboral disponible? Me encantaría conocer más detalles sobre la oferta. Siempre estoy dispuesto a asumir nuevos retos y colaboraciones que impulsen mi crecimiento profesional."
        />

        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          className="flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <button
            type="button"
            onClick={abrirClienteDeCorreo}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-strong px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary-strong-hover"
          >
            <Send size={18} aria-hidden="true" />
            Enviar email
          </button>

          <button
            type="button"
            onClick={abrirClienteDeCorreo}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-muted hover:bg-surface-hover hover:text-foreground"
          >
            <Mail size={18} aria-hidden="true" />
            {hidratado ? email : buildEmailOfuscado(EMAIL_PARTS)}
          </button>
        </motion.div>
      </div>
    </Section>
  );
};

export default Contact;
