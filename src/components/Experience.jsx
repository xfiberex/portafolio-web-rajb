"use client"

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
    <section id="experience" className="py-16 sm:py-24 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-white"
        >
          Experiencia
        </motion.h2>

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
              className="relative rounded-xl border border-zinc-800 p-6 bg-zinc-900 shadow-sm hover:shadow-md hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-900/30 text-indigo-400 flex-shrink-0">
                  <Briefcase size={24} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold text-white">{e.role}</h3>
                    <span className="text-sm text-zinc-400 font-medium">{e.period}</span>
                  </div>
                  <p className="text-sm text-zinc-300 mt-1">
                    {e.company} — {e.location}
                  </p>
                  <ul className="mt-4 list-disc marker:text-indigo-500 pl-5 text-sm text-zinc-300 space-y-2 leading-relaxed">
                    {e.achievements?.map((a, i) => (
                      <li key={i}>{a}</li>
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


