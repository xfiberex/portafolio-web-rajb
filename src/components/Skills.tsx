import { motion } from "framer-motion";
import { skills } from "../data/skills";
import { scaleUpVariant, sectionViewport, staggerContainer } from "../lib/animations";
import Section from "./ui/Section";
import SectionHeader from "./ui/SectionHeader";
import TechTags from "./ui/TechTags";

const Skills = () => (
  <Section id="skills">
    <SectionHeader title="Competencias" subtitle="Tecnologías y herramientas que domino" />

    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {skills.map((group) => (
        <motion.div
          key={group.category}
          variants={scaleUpVariant}
          className="group rounded-card border border-border bg-surface p-6 shadow-lg transition-[box-shadow,border-color] duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
        >
          <h3 className="mb-4 text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
            {group.category}
          </h3>
          <TechTags tags={group.items} size="md" label={`Tecnologías de ${group.category}`} />
        </motion.div>
      ))}
    </motion.div>
  </Section>
);

export default Skills;
