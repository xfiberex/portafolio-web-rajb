"use client"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="about" className="py-16 sm:py-24 border-t border-zinc-800">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-3xl font-bold text-white">Sobre mí</h2>
        <div className="mt-6 space-y-4 text-zinc-300 max-w-3xl leading-relaxed">
          <p>
            Desarrollador Web Full‑Stack con 2 años de experiencia práctica construyendo aplicaciones web robustas y
            escalables con los stacks
            <strong> .NET</strong> y <strong> MERN</strong>. Sólida experiencia en diseño de bases de datos, desarrollo
            de APIs RESTful y creación de interfaces de usuario interactivas y accesibles.
          </p>
          <p>
            Actualmente trabajo como Operador de Sistemas TI en Banco Múltiple Ademi y busco activamente mi primer rol
            profesional formal en el desarrollo web fullstack para aportar mi pasión por la tecnología y la resolución
            de problemas en un equipo de desarrollo innovador.
          </p>
          <p>
            Tecnologías con las que trabajo: React, Node.js, Express, C#/.NET, SQL Server y MongoDB; con enfoque en
            buenas prácticas, rendimiento y mantenibilidad.
          </p>
        </div>
      </motion.div>
    </section>
  )
}

export default About


