import { ArrowRight, ChevronDown, Download, Github, Linkedin } from "lucide-react";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { fadeUpVariant, staggerContainer } from "../lib/animations";
import { CV_ATS_URL, CV_URL } from "../lib/contact";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import Section from "./ui/Section";

/** 44x44 exactos: el mínimo táctil de WCAG 2.2 (2.5.8) sin texto al lado.
    Con borde, para que se lean como controles y no como decoración, y para
    que casen con el alto de los demás botones de la fila. */
const socialIconClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border-strong text-muted hover:border-primary/50 hover:bg-surface-hover hover:text-foreground";

const cvItemClass = "rounded-md px-3 py-2 text-sm text-muted hover:bg-surface-hover hover:text-foreground";

const ROLES = [
  "Desarrollador Web Full-Stack",
  "Especialista en .NET & MERN/PERN",
  "Creador de interfaces modernas con agentes de IA",
] as const;

/** react-type-animation intercala la pausa en ms detrás de cada frase. */
const TYPE_SEQUENCE = ROLES.flatMap((role) => [role, 2000]);

const typedTextClass = "font-medium text-primary";

const Hero = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const cvRef = useRef<HTMLDetailsElement>(null);

  /* <details> nativo da teclado y `aria-expanded` gratis, pero no cierra
     con Escape ni al pulsar fuera. Se añade a mano para que se comporte
     como el menú móvil del Navbar y el lightbox, que ya siguen ese
     contrato. */
  useEffect(() => {
    const cerrar = () => {
      if (cvRef.current) cvRef.current.open = false;
    };

    const alPulsarTecla = (evento: KeyboardEvent) => {
      if (evento.key !== "Escape" || !cvRef.current?.open) return;
      cerrar();
      cvRef.current?.querySelector("summary")?.focus();
    };

    const alPulsarFuera = (evento: PointerEvent) => {
      if (!cvRef.current?.open) return;
      if (!cvRef.current.contains(evento.target as Node)) cerrar();
    };

    document.addEventListener("keydown", alPulsarTecla);
    document.addEventListener("pointerdown", alPulsarFuera);
    return () => {
      document.removeEventListener("keydown", alPulsarTecla);
      document.removeEventListener("pointerdown", alPulsarFuera);
    };
  }, []);

  return (
    <Section id="home" divider={false}>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <motion.p variants={fadeUpVariant} className="text-sm font-semibold tracking-widest text-primary uppercase">
          Hola, soy
        </motion.p>

        {/*
          El <h1> NO anima, y es deliberado: es el elemento LCP de la página.
          El LCP se registra cuando **termina** su animación de entrada, no
          cuando empieza, así que cualquier variante aquí se suma entera al
          LCP. Medido (T2-23): con `fadeUpVariant` eran 748 ms; así, 112 ms.
          No es solo rendimiento: el nombre es el contenido principal y no
          tiene por qué hacerse esperar. El resto del Hero sigue entrando
          en cascada a su alrededor.
        */}
        <h1 className="mt-3 text-6xl font-bold text-foreground">Ricky Angel Jiménez Bueno</h1>

        <div className="mt-6 max-w-3xl text-lg text-muted sm:text-xl">
          {/*
            min-h reserva el alto de la frase más larga. Sin esto, el texto
            que se escribe y se borra empuja todo lo de abajo en cada ciclo
            (CLS sobre el pliegue).

            En `lh` y no en `em` (T3-10): antes era 3.6em / 2.4em, una
            estimación que reservaba 65px donde la frase más larga ocupa 56
            en móvil, y 48px donde ocupa 28 desde `sm` (medido de 320 a 1440:
            desde 640px las tres frases caben en una línea). `lh` es la altura
            de línea real, así que 2lh / 1lh reserva exactamente lo que se usa.
          */}
          <div className="flex min-h-[2lh] items-start sm:min-h-[1lh]" data-testid="hero-rol">
            {/*
              Con movimiento reducido no basta con acelerar la animación: hay
              que no montarla. react-type-animation escribe con setTimeout y
              repeat={Infinity}, así que ninguna regla CSS la detiene (T1-02).
            */}
            {prefersReducedMotion ? (
              <span className={typedTextClass}>{ROLES[0]}</span>
            ) : (
              <TypeAnimation
                sequence={TYPE_SEQUENCE}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className={typedTextClass}
              />
            )}
          </div>

          <p className="mt-2 leading-relaxed">
            Construyo aplicaciones modernas, escalables y accesibles con enfoque en rendimiento y buenas prácticas.
          </p>
        </div>

        {/*
          Una sola fila para TODAS las acciones del Hero. Todos los controles
          miden 44px de alto, así que la línea queda alineada sin ajustes.
          Antes eran tres filas (CTAs, CV, sociales), que era justo lo que
          hacía que ocho acciones parecieran ocho decisiones (T2-16).
        */}
        <motion.div variants={fadeUpVariant} className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-strong px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary-strong-hover"
          >
            Ver proyectos
            <ArrowRight size={16} aria-hidden="true" />
          </a>

          <a
            href="#contact"
            className="inline-flex items-center rounded-lg border border-border-strong px-6 py-3 text-sm font-medium text-foreground hover:border-primary/50 hover:bg-surface-hover"
          >
            Contactar
          </a>

          {/*
            Un solo control para los dos CV (T2-16), con las etiquetas dichas
            en claro: "CV-ATS" era jerga que un reclutador no descifra (T2-17).
          */}
          <details ref={cvRef} className="group relative">
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-lg border border-border-strong px-4 py-3 text-sm text-muted hover:border-primary/50 hover:bg-surface-hover hover:text-foreground">
              <Download size={16} aria-hidden="true" />
              Descargar CV
              <ChevronDown size={14} aria-hidden="true" className="transition-transform group-open:rotate-180" />
            </summary>
            {/* `absolute`: abrir el panel no debe empujar la página. */}
            <div className="absolute z-20 mt-2 flex w-max flex-col gap-1 rounded-lg border border-border bg-elevated p-1 shadow-lg">
              <a href={CV_URL} download className={cvItemClass}>
                CV en PDF
              </a>
              <a href={CV_ATS_URL} download className={cvItemClass}>
                CV en texto plano (ATS)
              </a>
            </div>
          </details>

          {/*
            Iconos sin texto: bajan el peso de dos acciones terciarias. El
            nombre accesible lo da `aria-label`; `title` lo muestra al pasar
            el ratón, porque un icono a secas no se identifica.
          */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/xfiberex"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
              className={socialIconClass}
            >
              <Github size={20} aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/ricky-angel-jimenez-bueno-52659928a"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
              className={socialIconClass}
            >
              <Linkedin size={20} aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
};

export default Hero;
