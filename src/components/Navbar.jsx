"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion"
import useScrollspy from "../hooks/useScrollspy"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const sections = ["home", "about", "projects", "experience", "skills", "education", "certificates", "contact"]
  const active = useScrollspy(sections, { 
    rootMargin: "-90px 0px -45% 0px", 
    threshold: 0.1 
  })
  const baseLink = "hover:text-white transition-colors"
  const activeLink = "text-white font-medium"

  const navItems = [
    { id: "about", label: "Sobre mí" },
    { id: "projects", label: "Proyectos" },
    { id: "experience", label: "Experiencia" },
    { id: "skills", label: "Competencias" },
    { id: "education", label: "Educación" },
    { id: "certificates", label: "Certificados" },
    { id: "contact", label: "Contacto" },
  ]

  const handleLinkClick = (sectionId) => {
    setIsOpen(false)
    
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        const headerHeight = 64
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }, 100)
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-zinc-900/80 border-b border-zinc-800">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a
          href="#home"
          className="font-bold text-lg text-zinc-100 hover:text-indigo-400 transition-colors"
          onClick={(e) => {
            e.preventDefault()
            handleLinkClick('home')
          }}
        >
          Ricky Jiménez
        </a>

        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-6 text-sm text-zinc-300">
            {navItems.map((item) => (
              <li key={item.id}>
                <a 
                  className={`${active === item.id ? activeLink : baseLink}`} 
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick(item.id)
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-zinc-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-zinc-800 bg-zinc-900"
          >
            <ul className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    className={`block py-2 text-sm ${active === item.id ? activeLink : baseLink}`}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      handleLinkClick(item.id)
                    }}
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar


