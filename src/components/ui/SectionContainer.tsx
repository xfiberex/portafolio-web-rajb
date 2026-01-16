import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { staggerContainer } from "../../lib/animations";

interface SectionContainerProps extends HTMLAttributes<HTMLElement> {
    children: ReactNode;
    /** ID para navegación con anclas */
    id: string;
    /** Mostrar borde superior */
    withBorder?: boolean;
    /** Usar animación de entrada */
    animated?: boolean;
}

const SectionContainer = forwardRef<HTMLElement, SectionContainerProps>(
    ({ children, id, withBorder = true, animated = true, className = "", ...props }, ref) => {
        const internalRef = useRef(null);
        const isInView = useInView(internalRef, { once: true, margin: "-100px" });

        const borderClass = withBorder ? "border-t border-zinc-800" : "";

        const content = (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        );

        if (!animated) {
            return (
                <section
                    ref={ref as React.Ref<HTMLElement>}
                    id={id}
                    className={`py-16 sm:py-24 ${borderClass} ${className}`}
                    {...props}
                >
                    {content}
                </section>
            );
        }

        return (
            <motion.section
                ref={internalRef}
                id={id}
                className={`py-16 sm:py-24 ${borderClass} ${className}`}
                variants={staggerContainer}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                {content}
            </motion.section>
        );
    }
);

SectionContainer.displayName = "SectionContainer";
export default SectionContainer;
