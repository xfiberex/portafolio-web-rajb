import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { certificates } from "../data/certificates";
import { fadeUpVariant, sectionViewport } from "../lib/animations";
import { safeExternalUrl } from "../lib/assets";
import Section from "./ui/Section";
import SectionHeader from "./ui/SectionHeader";

/**
 * Certificates Component
 * ─────────────────────────────────────────────────────────────
 * Una sola tarjeta con una fila por curso (T3-11). Antes eran cinco
 * tarjetas idénticas —mismo emisor, mismo icono, sin fechas— que
 * repetían cinco veces el mismo marco para decir una línea cada una.
 *
 * El enlace conserva `min-h-11` (44 px, área táctil de WCAG 2.5.8):
 * es lo que fija el alto mínimo de cada fila, y por eso esta variante
 * no baja de ~280 px de contenido aunque el texto cupiera en menos.
 */
const Certificates = () => (
  <Section id="certificates">
    <SectionHeader title="Certificados" subtitle="Certificaciones y cursos completados" />

    <motion.ul
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      className="divide-y divide-border overflow-hidden rounded-card border border-border bg-surface shadow-lg"
    >
      {certificates.map((certificate) => {
        const url = safeExternalUrl(certificate.link);

        return (
          <li
            key={`${certificate.name}-${certificate.issuer}`}
            className="flex flex-col gap-1 py-3 pr-3 pl-6 sm:flex-row sm:items-center sm:gap-6 sm:py-1.5"
          >
            <h3 className="flex-1 text-base leading-snug font-semibold text-foreground">{certificate.name}</h3>
            <p className="text-sm text-subtle">{certificate.issuer}</p>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="-ml-3 inline-flex min-h-11 items-center gap-1.5 self-start rounded-lg px-3 text-sm font-medium whitespace-nowrap text-primary hover:bg-surface-hover sm:ml-0 sm:self-auto"
              >
                Ver certificado
                <ExternalLink size={14} aria-hidden="true" />
                <span className="sr-only">de {certificate.name}</span>
              </a>
            )}
          </li>
        );
      })}
    </motion.ul>
  </Section>
);

export default Certificates;
