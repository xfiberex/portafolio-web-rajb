import { Github, Heart, Linkedin } from "lucide-react";

const linkClass =
  "inline-flex items-center gap-1.5 rounded-lg px-3 py-3 text-sm text-muted hover:bg-surface-hover hover:text-foreground";

const Footer = () => (
  <footer className="border-t border-border py-8">
    <div className="mx-auto max-w-6xl px-gutter">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="flex items-center gap-1.5 text-sm text-subtle">
          © {new Date().getFullYear()} Ricky Jiménez. Hecho con{" "}
          <Heart size={14} className="fill-red-500 text-red-500" aria-hidden="true" />
          <span className="sr-only">amor</span> desde República Dominicana
        </p>

        <div className="-mx-3 flex gap-1">
          <a href="https://github.com/xfiberex" target="_blank" rel="noopener noreferrer" className={linkClass}>
            <Github size={16} aria-hidden="true" />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/ricky-angel-jimenez-bueno-52659928a"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <Linkedin size={16} aria-hidden="true" />
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
