"use client"

import { useRef } from "react"
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "framer-motion"
import { Mail, Send } from "lucide-react"

const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="contact" className="py-16 sm:py-24 border-t border-zinc-800">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">Conectemos</h2>
          <p className="mt-4 text-lg text-zinc-300 leading-relaxed">
            ¿Cuentas con una oportunidad laboral disponible? Me encantaría conocer más detalles sobre la oferta. 
            Siempre estoy dispuesto a asumir nuevos retos y colaboraciones que impulsen mi crecimiento profesional.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:rickyjimenez1820@gmail.com"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 text-white px-6 py-3 text-sm font-medium hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/30"
            >
              <Send size={18} />
              Enviar email
            </a>

            <a
              href="mailto:rickyjimenez1820@gmail.com"
              className="inline-flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
            >
              <Mail size={18} />
              rickyjimenez1820@gmail.com
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default Contact


