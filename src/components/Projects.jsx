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
          className="text-3xl font-bold text-white mb-2"
        >
          Proyectos
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-zinc-400 text-base"
        >
          Una selección de mis trabajos más destacados
        </motion.p>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {topThree.map((p, idx) => (
            <motion.article
              key={`top-${idx}`}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group relative rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-900/50 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/60 transition-all duration-300 overflow-hidden"
            >
              {p.image && (
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={p.image || "/placeholder.svg"}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent opacity-60" />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {p.title}
                </h3>
                {p.subtitle && (
                  <p className="text-xs text-indigo-400 mt-1.5 font-semibold uppercase tracking-wide">{p.subtitle}</p>
                )}
                <p className="mt-4 text-sm text-zinc-300 leading-relaxed line-clamp-3">{p.description}</p>

                {p.features && (
                  <ul className="mt-5 space-y-2.5">
                    {p.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-xs text-zinc-400">
                        <span className="text-indigo-500 mt-0.5 font-bold">▸</span>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tags?.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-3 py-1.5 rounded-full bg-zinc-800/80 text-zinc-300 font-medium border border-zinc-700/50 hover:bg-indigo-500/20 hover:text-indigo-300 hover:border-indigo-500/50 transition-all duration-300 flex items-center gap-1.5"
                    >
                      <TechIcon name={t} className="w-3.5 h-3.5" withBg={false} />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-zinc-800 flex flex-wrap gap-4 text-sm">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-zinc-300 hover:text-indigo-400 font-medium transition-colors"
                    >
                      <Github size={18} />
                      Repo
                    </a>
                  )}
                  {p.image && (
                    <button
                      type="button"
                      onClick={() => openLightbox(p.image, p.title)}
                      className="inline-flex items-center gap-2 text-zinc-300 hover:text-indigo-400 font-medium transition-colors"
                      aria-label={`Ver imagen de ${p.title} en pantalla completa`}
                    >
                      <Maximize2 size={18} />
                      Ver
                    </button>
                  )}
                  {p.frontend && (
                    <a
                      href={p.frontend}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-zinc-300 hover:text-indigo-400 font-medium transition-colors"
                    >
                      <ExternalLink size={18} />
                      Frontend
                    </a>
                  )}
                  {p.backend && (
                    <a
                      href={p.backend}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-zinc-300 hover:text-indigo-400 font-medium transition-colors"
                    >
                      <ExternalLink size={18} />
                      Backend
                    </a>
                  )}
                  {p.demo && p.demo !== "#" && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-zinc-300 hover:text-indigo-400 font-medium transition-colors"
                    >
                      <ExternalLink size={18} />
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
                className="relative rounded-2xl border border-zinc-800 p-6 bg-gradient-to-br from-zinc-900 to-zinc-900/50 shadow-lg hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-500/40 transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  {p.image && (
                    <div className="hidden sm:block w-48 flex-shrink-0 rounded-xl overflow-hidden bg-zinc-800/50 border border-zinc-700/50">
                      <div className="aspect-video w-full h-auto relative">
                        <img src={p.image || "/placeholder.svg"} alt={p.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-zinc-900/30" />
                      </div>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white">{p.title}</h3>
                    {p.subtitle && (
                      <p className="text-xs text-indigo-400 mt-1.5 font-semibold uppercase tracking-wide">
                        {p.subtitle}
                      </p>
                    )}
                    <p className="mt-3 text-sm text-zinc-300 leading-relaxed">{p.description}</p>

                    {p.features && (
                      <ul className="mt-4 space-y-2">
                        {p.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2.5 text-sm text-zinc-400">
                            <span className="text-indigo-500 mt-0.5 font-bold">▸</span>
                            <span className="leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2">
                      {p.tags?.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-3 py-1.5 rounded-full bg-zinc-800/80 text-zinc-300 font-medium border border-zinc-700/50 hover:bg-indigo-500/20 hover:text-indigo-300 hover:border-indigo-500/50 transition-all duration-300 flex items-center gap-1.5"
                        >
                          <TechIcon name={t} className="w-3.5 h-3.5" withBg={false} />
                          <span>{t}</span>
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 pt-5 border-t border-zinc-800 flex flex-wrap gap-4 text-sm">
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-zinc-300 hover:text-indigo-400 font-medium transition-colors"
                        >
                          <Github size={18} />
                          Repo
                        </a>
                      )}
                      {p.image && (
                        <button
                          type="button"
                          onClick={() => openLightbox(p.image, p.title)}
                          className="inline-flex items-center gap-2 text-zinc-300 hover:text-indigo-400 font-medium transition-colors"
                          aria-label={`Ver imagen de ${p.title} en pantalla completa`}
                        >
                          <Maximize2 size={18} />
                          Ver
                        </button>
                      )}
                      {p.frontend && (
                        <a
                          href={p.frontend}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-zinc-300 hover:text-indigo-400 font-medium transition-colors"
                        >
                          <ExternalLink size={18} />
                          Frontend
                        </a>
                      )}
                      {p.backend && (
                        <a
                          href={p.backend}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-zinc-300 hover:text-indigo-400 font-medium transition-colors"
                        >
                          <ExternalLink size={18} />
                          Backend
                        </a>
                      )}
                      {p.demo && p.demo !== "#" && (
                        <a
                          href={p.demo}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-zinc-300 hover:text-indigo-400 font-medium transition-colors"
                        >
                          <ExternalLink size={18} />
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

      {lightbox.open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Visor de imagen en pantalla completa"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative max-w-6xl w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute -top-4 -right-4 sm:top-2 sm:right-2 inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800 text-zinc-200 hover:text-white hover:bg-indigo-600 transition-all shadow-lg border border-zinc-700"
              aria-label="Cerrar visor de imagen"
            >
              <X size={22} />
            </button>
            <img
              src={lightbox.src || "/placeholder.svg"}
              alt={lightbox.alt}
              className="max-h-[85vh] max-w-[95vw] sm:max-w-[90vw] rounded-2xl object-contain shadow-2xl border border-zinc-800"
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

export default Projects