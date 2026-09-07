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
        Desarrollador Full-Stack con dos ecosistemas completos: .NET (ASP.NET Core, Blazor, aplicaciones de escritorio)
        y TypeScript (React, Next.js, Node/Express).
      </motion.p>

      <motion.p variants={fadeUpVariant} className="leading-relaxed text-muted">
        Llevo dos años en operaciones de TI en banca, realizando cierres bancarios, monitoreo y escalamiento de
        incidentes. Es una perspectiva poco habitual para escribir software: he estado del lado que recibe los sistemas
        cuando ya fallaron, y eso condiciona cómo los construyo.
      </motion.p>

      <motion.p variants={fadeUpVariant} className="leading-relaxed text-muted">
        En paralelo he construido más de una docena de proyectos propios, con pruebas automatizadas, documentación de
        decisiones técnicas y atención a seguridad y concurrencia. Todo lo que ves aquí está publicado y se puede
        revisar.
      </motion.p>
    </motion.div>
  </Section>
);

export default About;
