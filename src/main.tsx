import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/*
      reducedMotion="user" hace que Framer Motion respete
      `prefers-reduced-motion` en toda la app: los transform y opacity
      se aplican de golpe en su valor final, sin animar. Las
      transiciones CSS y el scroll suave los cubre index.css.
    */}
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
);
