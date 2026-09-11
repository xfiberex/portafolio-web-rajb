// Types for data structures

export interface Project {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: string[];
  tags: string[];
  github?: string;
  frontend?: string;
  backend?: string;
  demo?: string;
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  achievements: string[];
}

export interface Skill {
  category: string;
  items: string[];
  /**
   * Como se pinta la categoria (T3-12). `principal` = pills con icono y
   * tarjeta destacada; `texto` = nombres separados por puntos; `lista` =
   * lista con vinetas, para frases que no son etiquetas (Principios).
   */
  formato: "principal" | "texto" | "lista";
  /**
   * Columna en escritorio (lg). El reparto NO es arbitrario: sale de probar
   * los 2187 repartos posibles con los altos reales de cada tarjeta y quedarse
   * con el de menor desnivel (17 px). Si cambia el contenido y el desnivel
   * crece, `e2e/pulido.spec.ts` lo detecta.
   */
  columna: 1 | 2 | 3;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
}

export interface Certificate {
  name: string;
  issuer: string;
  link: string;
}
