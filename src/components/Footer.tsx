import { motion } from 'motion/react';
import { Instagram, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">P</div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
              © {new Date().getFullYear()} Portfolio. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

