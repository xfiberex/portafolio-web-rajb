import { motion } from "framer-motion";
import { fadeUpVariant, sectionViewport, staggerContainer } from "../../lib/animations";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

/**
 * SectionHeader Component
 * ─────────────────────────────────────────────────────────────
 * Encabezado h2 + subtítulo con tamaños y espaciado únicos para
 * todas las secciones. Antes cada sección declaraba los suyos y
 * habían divergido (text-3xl vs text-3xl sm:text-4xl, subtítulos
 * en text-base / text-lg / sin tamaño).
 */
const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => (
  <motion.div
    variants={staggerContainer}
    initial="hidden"
    whileInView="visible"
    viewport={sectionViewport}
    className="mb-10 sm:mb-12"
  >
    <motion.h2 variants={fadeUpVariant} className="text-4xl font-bold text-foreground">
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p variants={fadeUpVariant} className="mt-3 max-w-2xl text-lg text-muted">
        {subtitle}
      </motion.p>
    )}
  </motion.div>
);

export default SectionHeader;
