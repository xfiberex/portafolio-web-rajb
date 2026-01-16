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
