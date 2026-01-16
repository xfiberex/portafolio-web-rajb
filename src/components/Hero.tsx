import { Github, Linkedin, Download, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { TypeAnimation } from "react-type-animation"
import { staggerContainer, fadeUpVariant } from "../lib/animations"

const Hero = () => {
  return (
    <section id="home" className="py-20 sm:py-32">
      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.p variants={fadeUpVariant} className="text-sm uppercase tracking-widest text-indigo-400 font-semibold">
          Hola, soy
        </motion.p>

        <motion.h1
          variants={fadeUpVariant}
          className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
        >
          Ricky Angel Jiménez Bueno
        </motion.h1>

        <motion.div variants={fadeUpVariant} className="mt-6 text-lg sm:text-xl text-zinc-300 max-w-3xl leading-relaxed">
          <TypeAnimation
            sequence={[
              "Desarrollador Web Full-Stack",
              2000,
              "Especialista en .NET & MERN",
              2000,
              "Creador de interfaces modernas con agentes IA",
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="text-indigo-400 font-medium"
          />
          <p className="mt-4">
            Construyo aplicaciones modernas, escalables y accesibles con enfoque en performance y buenas prácticas.
          </p>
        </motion.div>

        <motion.div variants={fadeUpVariant} className="mt-8 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/30"
          >
            Ver proyectos
            <ArrowRight size={16} />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center rounded-lg border-2 border-zinc-700 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
          >
            Contactar
          </a>
        </motion.div>

        <motion.div variants={fadeUpVariant} className="mt-6 flex flex-wrap gap-3">
          <a
            href="/assets/CV-Ricky Angel Jiménez Bueno-11-10-2025.pdf"
            download
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <Download size={16} />
            Descargar CV
          </a>
          <a
            href="/assets/ATS-CV-Ricky Angel Jiménez Bueno-11-10-2025.pdf"
            download
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <Download size={16} />
            CV-ATS
          </a>
        </motion.div>

        <motion.div variants={fadeUpVariant} className="mt-8 flex items-center gap-4">
          <span className="text-sm text-zinc-400">Encuéntrame en:</span>
          <a
            href="https://github.com/xfiberex"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <Github size={20} />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/ricky-angel-jimenez-bueno-52659928a"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
            <span className="hidden sm:inline">LinkedIn</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
