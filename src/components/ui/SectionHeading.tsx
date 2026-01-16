import { motion } from "framer-motion";
import { fadeUpVariant } from "../../lib/animations";

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    centered?: boolean;
}

const SectionHeading = ({ title, subtitle, centered = false }: SectionHeadingProps) => {
    const alignment = centered ? "text-center" : "text-left";

    return (
        <div className={`mb-12 ${alignment}`}>
            <motion.h2
                variants={fadeUpVariant}
                className="text-3xl sm:text-4xl font-bold text-white mb-3"
            >
                {title}
            </motion.h2>
            {subtitle && (
                <motion.p
                    variants={fadeUpVariant}
                    className="text-lg text-zinc-400"
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
};

export default SectionHeading;
