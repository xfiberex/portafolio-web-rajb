import { useRef } from "react"
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "framer-motion"
import { skills } from "../data/skills"
import TechIcon from "./TechIcon"

const Skills = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  }

  return (
    <section id="skills" className="py-16 sm:py-24 border-t border-zinc-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-3"
          >
            Competencias
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-zinc-400 text-lg"
          >
            Tecnologías y herramientas que domino
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {skills.map((group, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group rounded-xl border border-zinc-800/80 p-6 bg-gradient-to-br from-zinc-900 to-zinc-900/50 shadow-lg hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1"
            >
              <h3 className="text-lg font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors duration-300">
                {group.category}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-xs px-3 py-2 rounded-lg bg-zinc-800/80 text-zinc-300 font-medium hover:bg-indigo-900/40 hover:text-indigo-300 hover:scale-105 transition-all duration-300 flex items-center gap-2 border border-zinc-700/50 hover:border-indigo-500/50"
                  >
                    <TechIcon name={item} className="w-4 h-4" withBg={false} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Skills