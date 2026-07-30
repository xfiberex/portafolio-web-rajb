import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "../data/projects";
import { sectionViewport, staggerContainer } from "../lib/animations";
import Section from "./ui/Section";
import SectionHeader from "./ui/SectionHeader";
import Lightbox from "./ui/Lightbox";
import ProjectCard from "./projects/ProjectCard";

interface Preview {
  src: string;
  alt: string;
}

const FEATURED_COUNT = 3;

/** Rotula los dos grupos: antes la grilla y la lista se veían como un corte arbitrario. */
const groupLabelClass = "mb-6 text-sm font-semibold tracking-widest text-subtle uppercase";

const Projects = () => {
  const [preview, setPreview] = useState<Preview | null>(null);

  const openPreview = useCallback((src: string, alt: string) => setPreview({ src, alt }), []);
  const closePreview = useCallback(() => setPreview(null), []);

  const featured = projects.slice(0, FEATURED_COUNT);
  const rest = projects.slice(FEATURED_COUNT);

  return (
    <Section id="projects">
      <SectionHeader title="Proyectos" subtitle="Una selección de mis trabajos personales más destacados" />

      <h3 className={groupLabelClass}>Destacados</h3>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {featured.map((project) => (
          <ProjectCard key={project.title} project={project} layout="featured" onPreview={openPreview} />
        ))}
      </motion.div>

      {rest.length > 0 && (
        <>
          <h3 className={`mt-14 ${groupLabelClass}`}>Otros proyectos</h3>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            className="space-y-6"
          >
            {rest.map((project) => (
              <ProjectCard key={project.title} project={project} layout="row" onPreview={openPreview} />
            ))}
          </motion.div>
        </>
      )}

      <AnimatePresence>
        {preview && <Lightbox src={preview.src} alt={preview.alt} onClose={closePreview} />}
      </AnimatePresence>
    </Section>
  );
};

export default Projects;
