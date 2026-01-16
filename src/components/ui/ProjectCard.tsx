import { motion } from "framer-motion";
import { ExternalLink, Github, Maximize2 } from "lucide-react";
import { fadeUpVariant, cardHoverEffect } from "../../lib/animations";
import TechIcon from "../TechIcon";
import type { Project } from "../../types";

interface ProjectCardProps {
    project: Project;
    onImageClick?: (src: string, alt: string) => void;
}

const ProjectCard = ({ project, onImageClick }: ProjectCardProps) => {
    const { title, subtitle, description, image, tags, features, github, frontend, backend, demo } = project;

    return (
        <motion.article
            variants={fadeUpVariant}
            whileHover={cardHoverEffect}
            className="
        group relative 
        rounded-2xl 
        border border-zinc-800
        bg-gradient-to-b from-zinc-900 to-zinc-900/50
        shadow-xl 
        hover:shadow-2xl hover:shadow-indigo-500/10 
        hover:border-indigo-500/60
        transition-all duration-300 
        overflow-hidden
      "
        >
            {/* Image Container */}
            {image && (
                <div className="relative aspect-video w-full overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent opacity-60" />

                    {/* Hover Overlay with View Button */}
                    <div
                        className="absolute inset-0 bg-zinc-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                        <button
                            type="button"
                            onClick={() => onImageClick?.(image, title)}
                            className="
                p-3 rounded-full 
                bg-zinc-800 border border-zinc-700
                text-zinc-200 hover:text-white
                hover:bg-indigo-600 hover:border-indigo-600
                transition-all duration-300
                shadow-lg
              "
                            aria-label={`Ver imagen de ${title} en pantalla completa`}
                        >
                            <Maximize2 size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-300">
                    {title}
                </h3>

                {/* Subtitle */}
                {subtitle && (
                    <p className="text-xs text-indigo-400 mt-1.5 font-semibold uppercase tracking-wide">
                        {subtitle}
                    </p>
                )}

                {/* Description */}
                <p className="mt-4 text-sm text-zinc-300 leading-relaxed line-clamp-3">
                    {description}
                </p>

                {/* Features List */}
                {features && features.length > 0 && (
                    <ul className="mt-5 space-y-2.5">
                        {features.map((feature, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-2.5 text-xs text-zinc-400"
                            >
                                <span className="text-indigo-500 mt-0.5 font-bold">▸</span>
                                <span className="leading-relaxed">{feature}</span>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Tech Tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                    {tags?.map((tag) => (
                        <span
                            key={tag}
                            className="
                text-xs px-3 py-1.5 rounded-full 
                bg-zinc-800/80 
                text-zinc-300 font-medium 
                border border-zinc-700/50
                hover:bg-indigo-500/20 
                hover:text-indigo-300 
                hover:border-indigo-500/50
                transition-all duration-300 
                flex items-center gap-1.5
              "
                        >
                            <TechIcon name={tag} className="w-3.5 h-3.5" withBg={false} />
                            <span>{tag}</span>
                        </span>
                    ))}
                </div>

                {/* Action Links */}
                <div className="mt-6 pt-5 border-t border-zinc-800 flex flex-wrap gap-4 text-sm">
                    {github && (
                        <ActionLink href={github} icon={<Github size={18} />} label="Repo" />
                    )}
                    {frontend && (
                        <ActionLink href={frontend} icon={<ExternalLink size={18} />} label="Frontend" />
                    )}
                    {backend && (
                        <ActionLink href={backend} icon={<ExternalLink size={18} />} label="Backend" />
                    )}
                    {demo && demo !== "#" && (
                        <ActionLink href={demo} icon={<ExternalLink size={18} />} label="Demo" />
                    )}
                </div>
            </div>
        </motion.article>
    );
};

// Sub-component for action links
interface ActionLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
}

const ActionLink = ({ href, icon, label }: ActionLinkProps) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-zinc-300 hover:text-indigo-400 font-medium transition-colors"
    >
        {icon}
        {label}
    </a>
);

export default ProjectCard;
