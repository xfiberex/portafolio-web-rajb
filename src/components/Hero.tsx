import { ArrowRight, Download, Github, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { fadeUpVariant, staggerContainer } from "../lib/animations";
import { CV_ATS_URL, CV_URL } from "../lib/contact";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import Section from "./ui/Section";

/** py suficiente para el mínimo táctil de 44px sobre un texto de 20px de alto. */
const socialLinkClass =
  "inline-flex items-center gap-2 rounded-lg px-3 py-3 text-sm text-muted hover:bg-surface-hover hover:text-foreground";

const secondaryButtonClass =
  "inline-flex items-center gap-2 rounded-lg border border-border-strong px-4 py-3 text-sm text-muted hover:border-primary/50 hover:bg-surface-hover hover:text-foreground";

const ROLES = [
  "Desarrollador Web Full-Stack",
  "Especialista en .NET & MERN/PERN",
  "Creador de interfaces modernas con agentes IA",
] as const;

/** react-type-animation intercala la pausa en ms detrás de cada frase. */
const TYPE_SEQUENCE = ROLES.flatMap((role) => [role, 2000]);

const typedTextClass = "font-medium text-primary";

const Hero = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

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
            min-h reserva el alto de las dos líneas que llega a ocupar la frase
            más larga en móvil. Sin esto, el texto que se escribe y se borra
            empuja todo el contenido de abajo en cada ciclo (CLS sobre el fold).
          */}
          <div className="flex min-h-[3.6em] items-start sm:min-h-[2.4em]" data-testid="hero-rol">
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
            Construyo aplicaciones modernas, escalables y accesibles con enfoque en performance y buenas prácticas.
          </p>
        </div>

        <motion.div variants={fadeUpVariant} className="mt-8 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-strong px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary-strong-hover"
          >
            Ver proyectos
            <ArrowRight size={16} aria-hidden="true" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center rounded-lg border-2 border-border-strong px-6 py-3 text-sm font-medium text-foreground hover:border-primary/50 hover:bg-surface-hover"
          >
            Contactar
          </a>
        </motion.div>

        <motion.div variants={fadeUpVariant} className="mt-6 flex flex-wrap gap-3">
          <a href={CV_URL} download className={secondaryButtonClass}>
            <Download size={16} aria-hidden="true" />
            Descargar CV
          </a>
          <a href={CV_ATS_URL} download className={secondaryButtonClass}>
            <Download size={16} aria-hidden="true" />
            CV-ATS
          </a>
        </motion.div>

        <motion.div variants={fadeUpVariant} className="mt-8 -ml-3 flex flex-wrap items-center gap-1">
          <span className="px-3 text-sm text-subtle">Encuéntrame en:</span>
          <a
            href="https://github.com/xfiberex"
            target="_blank"
            rel="noopener noreferrer"
            className={socialLinkClass}
          >
            <Github size={20} aria-hidden="true" />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/ricky-angel-jimenez-bueno-52659928a"
            target="_blank"
            rel="noopener noreferrer"
            className={socialLinkClass}
          >
            <Linkedin size={20} aria-hidden="true" />
            LinkedIn
          </a>
        </motion.div>
      </motion.div>
    </Section>
  );
};

export default Hero;
