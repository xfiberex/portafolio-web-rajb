import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import useScrollspy from "../hooks/useScrollspy";

const MENU_ID = "menu-principal";

const sections = ["home", "about", "projects", "experience", "skills", "education", "certificates", "contact"];

const navItems = [
  { id: "about", label: "Sobre mí" },
  { id: "projects", label: "Proyectos" },
  { id: "experience", label: "Experiencia" },
  { id: "skills", label: "Competencias" },
  { id: "education", label: "Educación" },
  { id: "certificates", label: "Certificados" },
  { id: "contact", label: "Contacto" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const active = useScrollspy(sections, { rootMargin: "-90px 0px -30% 0px", threshold: 0.1 });

  const closeMenu = useCallback(() => setIsOpen(false), []);

  // Escape cierra el menú y devuelve el foco al botón que lo abrió
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      toggleRef.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-header max-w-6xl items-center justify-between px-gutter" aria-label="Navegación principal">
        <a
          href="#home"
          className="-mx-2 inline-flex min-h-11 items-center rounded-md px-2 text-lg font-bold text-foreground hover:text-primary"
          onClick={closeMenu}
        >
          Inicio
        </a>

        <div className="flex items-center gap-2">
          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id} className="relative">
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`inline-block rounded-md px-3 py-3 text-sm ${
                      isActive ? "font-medium text-foreground" : "text-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </a>
                  {/*
                    Indicador de sección activa. El estado activo no puede
                    depender solo del color (WCAG: no usar color como único
                    portador de información).
                  */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="rounded-md p-3 text-muted hover:bg-surface-hover hover:text-foreground lg:hidden"
            aria-expanded={isOpen}
            aria-controls={MENU_ID}
            aria-label={isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          >
            {isOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          /*
            `absolute` en lugar de estar en el flujo: al cerrarse no cambia
            el alto del header, así que no desplaza las secciones. Eso es lo
            que permite usar anchors nativos (antes hacía falta un
            setTimeout de 100ms + scrollTo manual para compensar el salto).
          */
          <motion.div
            id={MENU_ID}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full overflow-hidden border-b border-border bg-background lg:hidden"
          >
            <ul className="px-gutter py-3">
              {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={closeMenu}
                      aria-current={isActive ? "true" : undefined}
                      className={`flex items-center gap-3 rounded-md py-3 pr-3 text-sm ${
                        isActive ? "font-medium text-foreground" : "text-muted"
                      }`}
                    >
                      <span
                        className={`h-5 w-0.5 rounded-full ${isActive ? "bg-primary" : "bg-transparent"}`}
                        aria-hidden="true"
                      />
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
