import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { fadeUpVariant, sectionViewport, staggerContainer } from "../lib/animations";
import Section from "./ui/Section";
import ObfuscatedEmail from "./ui/ObfuscatedEmail";

const EMAIL_PARTS: [string, string, string] = ["rickyjimenez1820", "gmail", "com"];

const Contact = () => (
  <Section id="contact">
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      className="mx-auto max-w-2xl text-center"
    >
      <motion.h2 variants={fadeUpVariant} className="text-4xl font-bold text-foreground">
        Conectemos
      </motion.h2>

      <motion.p variants={fadeUpVariant} className="mt-4 text-lg leading-relaxed text-muted">
        ¿Cuentas con una oportunidad laboral disponible? Me encantaría conocer más detalles sobre la oferta. Siempre
        estoy dispuesto a asumir nuevos retos y colaboraciones que impulsen mi crecimiento profesional.
      </motion.p>

      <motion.div
        variants={fadeUpVariant}
        className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <ObfuscatedEmail emailParts={EMAIL_PARTS}>
          {(_, handleClick) => (
            <button
              onClick={handleClick}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary-hover"
            >
              <Send size={18} aria-hidden="true" />
              Enviar email
            </button>
          )}
        </ObfuscatedEmail>

        <ObfuscatedEmail emailParts={EMAIL_PARTS}>
          {(email, handleClick) => (
            <button
              onClick={handleClick}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-muted hover:bg-surface-hover hover:text-foreground"
            >
              <Mail size={18} aria-hidden="true" />
              {email}
            </button>
          )}
        </ObfuscatedEmail>
      </motion.div>
    </motion.div>
  </Section>
);

export default Contact;
