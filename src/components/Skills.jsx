"use client"

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
    <section id="skills" className="py-16 sm:py-24 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-white"
        >
          Competencias
        </motion.h2>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {skills.map((group, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="rounded-xl border border-zinc-800 p-6 bg-zinc-900 shadow-sm hover:shadow-md hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white">{group.category}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-xs px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-300 font-medium hover:bg-indigo-900/30 hover:text-indigo-300 transition-all duration-300 flex items-center gap-1.5"
                  >
                    <TechIcon 
                      name={item} 
                      className="w-3.5 h-3.5" 
                      withBg={false}
                    />
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


