# 🚀 Portfolio Web - Ricky Angel Jiménez Bueno

Un portafolio web moderno y responsivo construido con React, Vite y Tailwind CSS. Este proyecto presenta mis habilidades, experiencia, proyectos y certificaciones de manera profesional e interactiva.

![Portfolio Preview](https://img.shields.io/badge/React-18+-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.0+-green.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0+-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Características

- **🎨 Diseño Moderno**: Interfaz limpia y profesional con animaciones suaves
- **📱 Totalmente Responsivo**: Optimizado para dispositivos móviles, tablets y escritorio
- **🌟 Animaciones Interactivas**: Implementadas con Framer Motion
- **⚡ Rendimiento Optimizado**: Construido con Vite para carga rápida
- **🎯 Navegación Suave**: Scroll suave entre secciones
- **📧 Formulario de Contacto**: Sistema de contacto funcional
- **🔍 SEO Optimizado**: Meta tags y estructura semántica

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** - Biblioteca de JavaScript para interfaces de usuario
- **Vite** - Herramienta de construcción rápida
- **Tailwind CSS** - Framework de CSS utilitario
- **Framer Motion** - Biblioteca de animaciones para React

### Bibliotecas y Dependencias
- **@heroicons/react** - Iconos SVG para React
- **lucide-react** - Iconos modernos
- **react-intersection-observer** - Observador de intersección para animaciones
- **react-type-animation** - Animaciones de texto tipo máquina de escribir

### Herramientas de Desarrollo
- **ESLint** - Linter para JavaScript/React
- **Vite Plugin React** - Plugin oficial de React para Vite

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/portafolio-web.git
   cd portafolio-web
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Ejecuta el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador**
   ```
   http://localhost:5173
   ```

### Scripts Disponibles

```bash
# Servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de la construcción
npm run preview

# Ejecutar linter
npm run lint
```

## 📁 Estructura del Proyecto

```
portafolio-web/
├── public/
│   ├── assets/           # CVs y documentos
│   ├── projects/         # Imágenes de proyectos
│   ├── favicon.svg       # Icono del sitio
│   └── _redirects        # Configuración de redirects
├── src/
│   ├── components/       # Componentes de React
│   │   ├── About.jsx
│   │   ├── Certificates.jsx
│   │   ├── Contact.jsx
│   │   ├── Education.jsx
│   │   ├── Experience.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── Projects.jsx
│   │   ├── Skills.jsx
│   │   └── TechIcon.jsx
│   ├── data/             # Datos estáticos
│   │   ├── certificates.js
│   │   ├── education.js
│   │   ├── experience.js
│   │   ├── projects.js
│   │   └── skills.js
│   ├── hooks/            # Hooks personalizados
│   │   ├── useMediaQuery.jsx
│   │   ├── useScrollAnimation.jsx
│   │   └── useScrollspy.jsx
│   ├── helpers/          # Funciones auxiliares
│   │   ├── animations.js
│   │   ├── constants.js
│   │   └── utils.js
│   ├── App.jsx           # Componente principal
│   ├── main.jsx          # Punto de entrada
│   └── index.css         # Estilos globales
├── eslint.config.js      # Configuración de ESLint
├── vite.config.js        # Configuración de Vite
└── package.json          # Dependencias del proyecto
```

## 🎨 Secciones del Portfolio

- **🏠 Hero**: Presentación principal con animación de texto
- **👨‍💻 Sobre Mí**: Información personal y profesional
- **🚀 Proyectos**: Showcase de proyectos destacados
- **💼 Experiencia**: Historial laboral y profesional
- **🛠️ Habilidades**: Tecnologías y herramientas
- **🎓 Educación**: Formación académica
- **📜 Certificaciones**: Cursos y certificaciones
- **📞 Contacto**: Formulario de contacto y redes sociales

## 🌐 Despliegue

### Netlify
Este proyecto está configurado para despliegue en Netlify:

1. Conecta tu repositorio de GitHub con Netlify
2. Configura el comando de construcción: `npm run build`
3. Directorio de publicación: `dist`
4. El archivo `_redirects` maneja las rutas SPA

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### GitHub Pages
```bash
npm run build
# Sube el contenido de la carpeta 'dist' a tu repositorio gh-pages
```

## 🔧 Personalización

### Modificar Datos Personales
Edita los archivos en la carpeta `src/data/`:
- `projects.js` - Tus proyectos
- `experience.js` - Experiencia laboral
- `skills.js` - Habilidades técnicas
- `education.js` - Formación académica
- `certificates.js` - Certificaciones

### Cambiar Colores y Estilos
Los estilos están definidos en `src/index.css` y utilizan Tailwind CSS. Puedes personalizar:
- Colores primarios
- Tipografías
- Espaciados
- Animaciones

### Añadir Nuevas Secciones
1. Crea un nuevo componente en `src/components/`
2. Importa y añade el componente en `App.jsx`
3. Actualiza la navegación en `Navbar.jsx`

## 📈 Características Técnicas

- **Performance**: Optimizado con lazy loading y code splitting
- **Accesibilidad**: Cumple con estándares WCAG 2.1
- **SEO**: Meta tags optimizados y estructura semántica
- **Responsive**: Mobile-first design
- **Animations**: Smooth animations con Framer Motion
- **Clean Code**: Estructura modular y componentes reutilizables

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

**Ricky Angel Jiménez Bueno**
<!-- - Portfolio: [tu-portfolio.com](https://tu-portfolio.com) -->
- LinkedIn: [linkedin.com/in/tu-perfil](www.linkedin.com/in/ricky-angel-jimenez-bueno-52659928a)
- GitHub: [github.com/tu-usuario](https://github.com/xfiberex)
- Email: rickyjimenez1820@gmail.com

## 🙏 Agradecimientos

- [React](https://reactjs.org/) - Biblioteca de JavaScript
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons
- [Lucide](https://lucide.dev/) - Beautiful & consistent icon toolkit

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!