import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { experience } from "../data/experience";
import { sectionViewport, slideLeftVariant, staggerContainer } from "../lib/animations";
import Section from "./ui/Section";
import SectionHeader from "./ui/SectionHeader";

const Experience = () => (
  <Section id="experience">
    <SectionHeader title="Experiencia" subtitle="Mi trayectoria profesional" />

    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      className="space-y-6"
    >
      {experience.map((item) => (
        <motion.article
          key={`${item.role}-${item.company}-${item.period}`}
          variants={slideLeftVariant}
          className="group rounded-card border border-border bg-surface p-6 shadow-lg transition-[box-shadow,border-color] duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 sm:p-8"
        >
          <div className="flex items-start gap-4 sm:gap-6">
            <div
              className="hidden h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary-soft text-primary transition-colors duration-300 group-hover:border-primary/40 sm:flex"
              aria-hidden="true"
            >
              <Briefcase size={24} strokeWidth={2} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                  {item.role}
                </h3>
                <span className="rounded-full border border-border bg-surface-hover px-3 py-1 text-sm font-semibold text-muted">
                  {item.period}
                </span>
              </div>

              <p className="mb-4 font-medium text-muted">
                {item.company} <span className="text-subtle">•</span> <span className="text-subtle">{item.location}</span>
              </p>

              {item.achievements?.length ? (
                <ul className="mt-4 space-y-3">
                  {item.achievements.map((achievement) => (
                    <li key={achievement} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                      <span
                        className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"
                        aria-hidden="true"
                      />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  </Section>
);

export default Experience;
