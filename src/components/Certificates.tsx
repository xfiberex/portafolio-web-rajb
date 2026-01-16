import { useRef } from "react"
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "framer-motion"
import { Award, ExternalLink } from "lucide-react"
import { certificates } from "../data/certificates"

const Certificates = () => {
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
    <section id="certificates" className="py-16 sm:py-24 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white">Certificados</h2>
          <p className="mt-2 text-zinc-400">Certificaciones y cursos completados</p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {certificates.map((c, idx) => (
            <motion.article
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group rounded-xl border border-zinc-800 p-6 bg-gradient-to-br from-zinc-900 to-zinc-900/50 shadow-lg hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex-shrink-0 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 transition-all duration-300">
                  <Award size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-indigo-400 transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">{c.issuer}</p>
                </div>
              </div>

              {c.link && (
                <a
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Ver certificado
                  <ExternalLink size={14} />
                </a>
              )}
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Certificates
