import Layout from "./components/Layout";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Education from "./components/Education";
import Certificates from "./components/Certificates";
import Contact from "./components/Contact";

function App() {
  return (
    <Layout>
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Skills />
      <Education />
      <Certificates />
      <Contact />
    </Layout>
  );
}

export default App;
