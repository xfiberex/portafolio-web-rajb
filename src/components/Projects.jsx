"use client"

import { useEffect, useRef, useState } from "react"
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "framer-motion"
import { ExternalLink, Github, Maximize2, X } from "lucide-react"
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

  const topThree = projects.slice(0, 3)
  const rest = projects.slice(3)

  // Lightbox state to show images fullscreen
  const [lightbox, setLightbox] = useState({ open: false, src: "", alt: "" })
  const openLightbox = (src, alt) => setLightbox({ open: true, src, alt })
  const closeLightbox = () => setLightbox({ open: false, src: "", alt: "" })

  useEffect(() => {
    if (!lightbox.open) return
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightbox.open])

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

        {/* Top row: first 3 projects in a standard grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {topThree.map((p, idx) => (
            <motion.article
              key={`top-${idx}`}
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
                {p.image && (
                  <button
                    type="button"
                    onClick={() => openLightbox(p.image, p.title)}
                    className="inline-flex items-center gap-1.5 text-white hover:text-indigo-400 transition-colors"
                    aria-label={`Ver imagen de ${p.title} en pantalla completa`}
                  >
                    <Maximize2 size={16} />
                    Ver imagen
                  </button>
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

        {rest.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mt-8 space-y-6"
          >
            {rest.map((p, idx) => (
              <motion.article
                key={`rest-${idx}`}
                variants={itemVariants}
                className="relative rounded-xl border border-zinc-800 p-6 bg-zinc-900 shadow-sm hover:shadow-md hover:border-indigo-500/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {p.image && (
                    <div className="hidden sm:block w-40 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800/50">
                      <div className="aspect-video w-full h-auto">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                    </div>
                    {p.subtitle && (
                      <p className="text-xs text-zinc-400 mt-1 font-medium">{p.subtitle}</p>
                    )}
                    <p className="mt-3 text-sm text-zinc-300 leading-relaxed">{p.description}</p>

                    {p.features && (
                      <ul className="mt-4 list-disc marker:text-indigo-500 pl-5 text-sm text-zinc-300 space-y-2 leading-relaxed">
                        {p.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tags?.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 font-medium hover:bg-indigo-900/30 hover:text-indigo-300 transition-all duration-300 flex items-center gap-1.5"
                        >
                          <TechIcon name={t} className="w-3.5 h-3.5" withBg={false} />
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
                      {p.image && (
                        <button
                          type="button"
                          onClick={() => openLightbox(p.image, p.title)}
                          className="inline-flex items-center gap-1.5 text-white hover:text-indigo-400 transition-colors"
                          aria-label={`Ver imagen de ${p.title} en pantalla completa`}
                        >
                          <Maximize2 size={16} />
                          Ver imagen
                        </button>
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
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
      {/* Lightbox overlay for fullscreen image view */}
      {lightbox.open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-[2px] flex items-center justify-center p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Visor de imagen en pantalla completa"
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative max-w-6xl w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute -top-3 -right-3 sm:top-2 sm:right-2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800/80 text-zinc-200 hover:text-white hover:bg-zinc-700 transition"
              aria-label="Cerrar visor de imagen"
            >
              <X size={20} />
            </button>
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-h-[85vh] max-w-[95vw] sm:max-w-[90vw] rounded-lg object-contain shadow-xl"
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

export default Projects