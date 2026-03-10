import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link to={`/project/${project.id}`} className="block">
        <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem] bg-white/5 mb-8">
          {project.imageUrl ? (
            <img 
              src={project.imageUrl} 
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/10 font-mono text-[10px] uppercase tracking-[0.3em]">
              No Image
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
          
          {/* Overlay Info */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="glass rounded-full px-4 py-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-white">View Project</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-start px-2">
          <div>
            <h3 className="text-3xl font-light tracking-tight text-white mb-3 group-hover:text-white/70 transition-colors">
              {project.title}
            </h3>
            <div className="flex flex-wrap gap-3">
              {project.tags?.map(tag => (
                <span key={tag} className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/30">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};


export default ProjectCard;

