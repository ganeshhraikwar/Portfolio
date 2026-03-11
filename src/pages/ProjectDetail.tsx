import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Project, OperationType } from '../types';
import { handleFirestoreError } from '../utils/error-handler';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(
      doc(db, 'projects', id),
      (snapshot) => {
        if (snapshot.exists()) {
          setProject({ id: snapshot.id, ...snapshot.data() } as Project);
        }
        setLoading(false);
      },
      (error) => handleFirestoreError(error, OperationType.GET, `projects/${id}`)
    );
    return unsubscribe;
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 bg-white/10 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-white/10 rounded"></div>
      </div>
    </div>
  );
  
  if (!project) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-light text-white mb-4">Project not found</h2>
        <Link to="/" className="text-xs uppercase tracking-widest font-bold text-white/40 hover:text-white transition-colors underline underline-offset-8">Back to Works</Link>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <Link to="/" className="group inline-flex items-center text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 hover:text-white transition-all mb-16">
          <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" /> Back to Selection
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            {project.tags?.map(tag => (
              <span key={tag} className="text-[9px] uppercase tracking-widest font-bold text-white/40 border border-white/10 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-8xl font-light tracking-tight text-white mb-12 leading-[0.9]"
          >
            {project.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="aspect-[16/9] rounded-[2.5rem] overflow-hidden bg-white/5 mb-20 border border-white/5 shadow-2xl"
          >
            {project.imageUrl ? (
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/10 font-mono text-[10px] uppercase tracking-[0.3em]">
                No Visual Asset
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div className="lg:col-span-2 space-y-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-8">01 — Overview</h2>
                <p className="text-2xl text-white/70 font-light leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </motion.div>

              {project.clientRequest && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-8">02 — The Challenge</h2>
                  <p className="text-xl text-white/60 font-light leading-relaxed whitespace-pre-wrap border-l border-white/10 pl-8 py-2">
                    {project.clientRequest}
                  </p>
                </motion.div>
              )}

              {project.solution && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-8">03 — The Solution</h2>
                  <p className="text-xl text-white/60 font-light leading-relaxed whitespace-pre-wrap">
                    {project.solution}
                  </p>
                </motion.div>
              )}
              
              {project.content && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-8">04 — The Process</h2>
                  <div 
                    className="prose prose-invert prose-zinc max-w-none prose-p:text-white/60 prose-p:font-light prose-p:leading-relaxed prose-p:text-lg prose-headings:font-light prose-a:text-white hover:prose-a:text-white/80"
                    dangerouslySetInnerHTML={{ __html: project.content }}
                  />
                </motion.div>
              )}

              {(project.beforeImage || project.afterImage) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="space-y-8"
                >
                  <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-8">Transformation</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {project.beforeImage && (
                      <div className="space-y-4">
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 block">Before</span>
                        <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-white/5 border border-white/5">
                          <img src={project.beforeImage} alt="Before" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                        </div>
                      </div>
                    )}
                    {project.afterImage && (
                      <div className="space-y-4">
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 block">After</span>
                        <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-white/5 border border-white/5">
                          <img src={project.afterImage} alt="After" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {project.galleryImages && project.galleryImages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="space-y-8"
                >
                  <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-8">Gallery</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {project.galleryImages.map((imgUrl, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="aspect-square rounded-[2rem] overflow-hidden bg-white/5 border border-white/5"
                      >
                        <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105" referrerPolicy="no-referrer" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-16">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-8">Details</h2>
                <div className="space-y-6">
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-6 glass rounded-2xl hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 group border border-white/5"
                    >
                      <span className="text-xs font-bold uppercase tracking-widest">Live Experience</span>
                      <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </a>
                  )}
                  {project.github && (
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-6 glass rounded-2xl hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 group border border-white/5"
                    >
                      <span className="text-xs font-bold uppercase tracking-widest">Source Code</span>
                      <Github className="w-4 h-4 text-white/20 group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </a>
                  )}
                </div>
              </motion.div>

              {project.link && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="hidden lg:block"
                >
                  <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-4">Live Preview</h2>
                  <div className="w-full aspect-[9/16] rounded-3xl overflow-hidden glass border border-white/10 shadow-2xl relative group">
                    <div className="absolute inset-x-0 top-0 h-8 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2 z-10 backdrop-blur-md">
                      <div className="w-2 h-2 rounded-full bg-red-500/50" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                      <div className="w-2 h-2 rounded-full bg-green-500/50" />
                    </div>
                    <iframe 
                      src={project.link} 
                      title="Live Preview"
                      className="w-full h-full pt-8 bg-white"
                      sandbox="allow-scripts allow-same-origin"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest pointer-events-auto hover:scale-105 transition-transform">
                        Open Full Screen
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-4">Timeline</h2>
                <p className="text-white/60 font-light text-xl">
                  {project.createdAt?.toDate ? project.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recent'}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
