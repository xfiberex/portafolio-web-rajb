import { useRef } from "react"
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "framer-motion"
import { Briefcase } from "lucide-react"
import { experience } from "../data/experience"

const Experience = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="experience" className="py-16 sm:py-24 border-t border-zinc-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Experiencia</h2>
          <p className="text-zinc-400 text-lg">Mi trayectoria profesional</p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-8 space-y-6"
        >
          {experience.map((e, idx) => (
            <motion.article
              key={idx}
              variants={itemVariants}
              className="group relative rounded-xl border border-zinc-800/80 p-6 sm:p-8 bg-gradient-to-br from-zinc-900 to-zinc-900/50 shadow-lg hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-transparent transition-all duration-300" />

              <div className="relative flex items-start gap-4 sm:gap-6">
                <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-900/40 to-indigo-900/20 text-indigo-400 flex-shrink-0 border border-indigo-500/20 group-hover:border-indigo-500/40 group-hover:shadow-lg group-hover:shadow-indigo-500/20 transition-all duration-300">
                  <Briefcase size={24} strokeWidth={2} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors duration-300">
                      {e.role}
                    </h3>
                    <span className="text-sm text-zinc-400 font-semibold px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50">
                      {e.period}
                    </span>
                  </div>

                  <p className="text-base text-zinc-300 font-medium mb-4">
                    {e.company} <span className="text-zinc-500">•</span>{" "}
                    <span className="text-zinc-400">{e.location}</span>
                  </p>

                  <ul className="mt-4 space-y-3">
                    {e.achievements?.map((a, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-zinc-300 leading-relaxed">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Experience