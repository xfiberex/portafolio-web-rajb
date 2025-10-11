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
        <p className="mt-2 text-zinc-400">Conoce más sobre mi trayectoria y experiencia</p>

        <div className="mt-8 space-y-4 text-zinc-300 max-w-3xl leading-relaxed">
          <p>
            Mi camino en la tecnología no ha sido una línea recta, y eso es lo que lo hace interesante. 
            Vengo de un fondo en TI, pero la curiosidad y el deseo de construir me llevaron a sumergirme de lleno 
            en el desarrollo de software. Fue en mis tiempos libres y a través de proyectos freelance donde encontré 
            mi verdadera pasión. Actualmente me enfoco en el stack MERN y .NET
          </p>
        </div>
      </motion.div>
    </section>
  )
}

export default About