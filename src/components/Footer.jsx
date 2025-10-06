import { Github, Linkedin, Heart } from "lucide-react"

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-zinc-800 py-8 text-sm text-zinc-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="flex items-center gap-1.5">
            © {new Date().getFullYear()} Ricky Jiménez. Hecho con{" "}
            <Heart size={14} className="text-red-500 fill-red-500" /> desde República Dominicana
          </p>

          <div className="flex gap-6">
            <a
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
              href="https://github.com/xfiberex"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <Github size={16} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
              href="https://www.linkedin.com/in/ricky-angel-jimenez-bueno-52659928a"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


