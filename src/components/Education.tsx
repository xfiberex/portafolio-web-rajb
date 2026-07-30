import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { education } from "../data/education";
import { fadeUpVariant, sectionViewport, staggerContainer } from "../lib/animations";
import Section from "./ui/Section";
import SectionHeader from "./ui/SectionHeader";

const Education = () => (
  <Section id="education">
    <SectionHeader title="Educación" subtitle="Mi formación académica y trayectoria educativa" />

    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      className="space-y-6"
    >
      {education.map((item) => (
        <motion.article
          key={`${item.degree}-${item.institution}-${item.period}`}
          variants={fadeUpVariant}
          className="group rounded-card border border-border bg-surface p-6 shadow-lg transition-[box-shadow,border-color] duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
        >
          <div className="flex items-start gap-4">
            <div
              className="hidden h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary-soft text-primary transition-colors duration-300 group-hover:border-primary/40 sm:flex"
              aria-hidden="true"
            >
              <GraduationCap size={24} />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                {item.degree}
              </h3>
              <p className="mt-1 text-sm text-muted">
                {item.institution} — {item.location}
              </p>
              <span className="mt-3 inline-block rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
                {item.period}
              </span>
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  </Section>
);

export default Education;
