import { motion } from "framer-motion";
import { fadeUpVariant, sectionViewport, staggerContainer } from "../lib/animations";
import Section from "./ui/Section";
import SectionHeader from "./ui/SectionHeader";

const About = () => (
  <Section id="about">
    <SectionHeader title="Sobre mí" subtitle="Conoce más sobre mi trayectoria y experiencia" />

    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      /* 65ch mantiene la línea en ~65-75 caracteres, el rango legible */
      className="max-w-[65ch] space-y-4"
    >
      <motion.p variants={fadeUpVariant} className="leading-relaxed text-muted">
        Desarrollador Full-Stack con enfoque especializado en el stack MERN/PERN y .NET. Mi carrera en TI me ha
        proporcionado una sólida base técnica, la cual he expandido de forma proactiva hacia el desarrollo de software a
        través de proyectos personales. Poseo experiencia práctica demostrable en la construcción de aplicaciones web
        completas, desde la creación de APIs REST con Node.js hasta el desarrollo de interfaces de usuario interactivas
        con React o Blazor.
      </motion.p>
    </motion.div>
  </Section>
);

export default About;
