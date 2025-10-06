"use client"

import { useRef } from "react"
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"
import { projects } from "../data/projects"
import TechIcon from "./TechIcon"

const Projects = () => {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="projects" className="py-16 sm:py-24 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-white"
        >
          Proyectos
        </motion.h2>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((p, idx) => (
            <motion.article
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm hover:shadow-lg hover:border-indigo-500/50 transition-all duration-300 overflow-hidden"
            >
              {p.image && (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                  {p.title}
                </h3>
                {p.subtitle && <p className="text-xs text-zinc-400 mt-1 font-medium">{p.subtitle}</p>}
                <p className="mt-3 text-sm text-zinc-300 leading-relaxed">{p.description}</p>

                {p.features && (
                  <ul className="mt-4 space-y-2">
                    {p.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs text-zinc-400">
                        <span className="text-indigo-400 mt-0.5">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags?.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 font-medium hover:bg-indigo-900/30 hover:text-indigo-300 transition-all duration-300 flex items-center gap-1.5"
                  >
                    <TechIcon 
                      name={t} 
                      className="w-3.5 h-3.5" 
                      withBg={false}
                    />
                    <span>{t}</span>
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-white hover:text-indigo-400 transition-colors"
                  >
                    <Github size={16} />
                    Repo
                  </a>
                )}
                {p.frontend && (
                  <a
                    href={p.frontend}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-white hover:text-indigo-400 transition-colors"
                  >
                    <ExternalLink size={16} />
                    Frontend
                  </a>
                )}
                {p.backend && (
                  <a
                    href={p.backend}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-white hover:text-indigo-400 transition-colors"
                  >
                    <ExternalLink size={16} />
                    Backend
                  </a>
                )}
                {p.demo && p.demo !== "#" && (
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-white hover:text-indigo-400 transition-colors"
                  >
                    <ExternalLink size={16} />
                    Demo
                  </a>
                )}
              </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Projects