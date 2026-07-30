import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { certificates } from "../data/certificates";
import { cardLift, scaleUpVariant, sectionViewport, staggerContainer } from "../lib/animations";
import { safeExternalUrl } from "../lib/assets";
import Section from "./ui/Section";
import SectionHeader from "./ui/SectionHeader";

const Certificates = () => (
  <Section id="certificates">
    <SectionHeader title="Certificados" subtitle="Certificaciones y cursos completados" />

    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {certificates.map((certificate) => {
        const url = safeExternalUrl(certificate.link);

        return (
          <motion.article
            key={`${certificate.name}-${certificate.issuer}`}
            variants={scaleUpVariant}
            whileHover={cardLift}
            className="group flex flex-col rounded-card border border-border bg-surface p-6 shadow-lg transition-[box-shadow,border-color] duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
          >
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary-soft text-primary transition-colors duration-300 group-hover:border-primary/40"
                aria-hidden="true"
              >
                <Award size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-base leading-snug font-bold text-foreground transition-colors group-hover:text-primary">
                  {certificate.name}
                </h3>
                <p className="mt-1 text-sm text-subtle">{certificate.issuer}</p>
              </div>
            </div>

            {url && (
              <div className="mt-auto -mb-1.5 -ml-3 pt-4">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-primary hover:bg-surface-hover"
                >
                  Ver certificado
                  <ExternalLink size={14} aria-hidden="true" />
                  <span className="sr-only">de {certificate.name}</span>
                </a>
              </div>
            )}
          </motion.article>
        );
      })}
    </motion.div>
  </Section>
);

export default Certificates;
