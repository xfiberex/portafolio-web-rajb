"use client"

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
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-white"
        >
          Educación
        </motion.h2>

        <div ref={ref} className="mt-8 space-y-6">
          {education.map((e, idx) => (
            <motion.article
              key={idx}
              variants={itemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="rounded-xl border border-zinc-800 p-6 bg-zinc-900 shadow-sm hover:shadow-md hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-900/30 text-indigo-400 flex-shrink-0">
                  <GraduationCap size={24} />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{e.degree}</h3>
                  <p className="text-sm text-zinc-300 mt-1">
                    {e.institution} — {e.location}
                  </p>
                  <p className="mt-2 text-sm text-zinc-400 font-medium">{e.period}</p>
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


