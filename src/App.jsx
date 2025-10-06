import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import About from "./components/About"
import Projects from "./components/Projects"
import Experience from "./components/Experience"
import Skills from "./components/Skills"
import Education from "./components/Education"
import Certificates from "./components/Certificates"
import Contact from "./components/Contact"
import Footer from "./components/Footer"

function App() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Skills />
        <Education />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
