import { useRef } from "react"
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "framer-motion"
import { GraduationCap } from "lucide-react"
import { education } from "../data/education"

const Education = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="education" className="py-16 sm:py-24 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white">Educación</h2>
          <p className="mt-2 text-zinc-400">Mi formación académica y trayectoria educativa</p>
        </motion.div>

        <div ref={ref} className="mt-8 space-y-6">
          {education.map((e, idx) => (
            <motion.article
              key={idx}
              variants={itemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="group rounded-xl border border-zinc-800 p-6 bg-gradient-to-br from-zinc-900 to-zinc-900/50 shadow-lg hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex-shrink-0 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 transition-all duration-300">
                  <GraduationCap size={24} />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {e.degree}
                  </h3>
                  <p className="text-sm text-zinc-300 mt-1">
                    {e.institution} — {e.location}
                  </p>
                  <span className="inline-block mt-3 px-3 py-1 text-xs font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                    {e.period}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Education
