import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectCarouselProps {
  projects: Project[];
  category: string;
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ projects, category }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const containerRef = useRef<HTMLDivElement>(null);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      filter: 'blur(10px)',
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      filter: 'blur(10px)',
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    const nextIndex = currentIndex + newDirection;
    if (nextIndex < 0) {
      setCurrentIndex(projects.length - 1);
    } else if (nextIndex >= projects.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const currentProject = projects[currentIndex];

  if (!projects.length) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="mb-32"
    >
      <div className="flex items-end justify-between mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-4 block">Category</span>
          <h3 className="text-3xl md:text-5xl font-light tracking-tight">{category}</h3>
        </motion.div>
        <div className="flex gap-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(-1)}
            className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(1)}
            className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="relative h-[400px] md:h-[600px] overflow-hidden rounded-[2.5rem]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentProject.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 200, damping: 25 },
              opacity: { duration: 0.6 },
              scale: { duration: 0.6 },
              filter: { duration: 0.6 }
            }}
            className="absolute inset-0"
          >
            <Link to={`/project/${currentProject.id}`} className="block w-full h-full group">
              <div className="relative w-full h-full overflow-hidden">
                {currentProject.imageUrl ? (
                  <img 
                    src={currentProject.imageUrl} 
                    alt={currentProject.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/10 font-mono text-[10px] uppercase tracking-[0.3em]">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                
                <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                  <div className="max-w-xl">
                    <h4 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-6 group-hover:translate-x-4 transition-transform duration-500">
                      {currentProject.title}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {currentProject.tags?.map(tag => (
                        <span key={tag} className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/40">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-full glass flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex justify-center mt-8 gap-2">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentIndex ? 'w-12 bg-white' : 'w-4 bg-white/10'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectCarousel;
