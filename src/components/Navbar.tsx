import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import { LogOut, User, LayoutDashboard, Briefcase, Mail, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-full px-6 py-3 flex justify-between items-center"
        >
          <div className="flex items-center">
            <Link to="/" className="text-lg font-semibold tracking-tighter text-white group flex items-center">
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mr-2 group-hover:bg-white group-hover:text-black transition-colors"
              >
                <span className="text-[10px] font-bold">P</span>
              </motion.div>
              {isAdminPath ? 'Admin' : 'Portfolio'}<span className="text-white/30 group-hover:text-white transition-colors">.</span>
            </Link>
          </div>

          <div className="hidden sm:flex items-center space-x-8">
            <a href="/#about" className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">About</a>
            <a href="/#works" className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">Works</a>
            <a href="/#contact" className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">Contact</a>
            {isAdmin && (
              <>
                <Link to="/admin" className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">Dashboard</Link>
                <button 
                  onClick={() => auth.signOut()}
                  className="flex items-center text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all"
                >
                  <LogOut className="w-3 h-3 mr-2" />
                  Logout
                </button>
              </>
            )}
          </div>

          <div className="sm:hidden flex items-center">
             {isAdmin && <Link to="/admin" className="p-2 text-white/50"><User className="w-5 h-5" /></Link>}
          </div>
        </motion.div>
      </div>
      
      {isAdmin && isAdminPath && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-full px-6 py-2 flex space-x-8 justify-start sm:justify-center items-center overflow-x-auto no-scrollbar"
          >
            <Link to="/admin" className={`text-[9px] uppercase tracking-widest font-bold flex items-center whitespace-nowrap ${location.pathname === '/admin' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}>
              <LayoutDashboard className="w-3 h-3 mr-2" /> Overview
            </Link>
            <Link to="/admin/projects" className={`text-[9px] uppercase tracking-widest font-bold flex items-center whitespace-nowrap ${location.pathname === '/admin/projects' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}>
              <Briefcase className="w-3 h-3 mr-2" /> Projects
            </Link>
            <Link to="/admin/reviews" className={`text-[9px] uppercase tracking-widest font-bold flex items-center whitespace-nowrap ${location.pathname === '/admin/reviews' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}>
              <Star className="w-3 h-3 mr-2" /> Reviews
            </Link>
            <Link to="/admin/messages" className={`text-[9px] uppercase tracking-widest font-bold flex items-center whitespace-nowrap ${location.pathname === '/admin/messages' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}>
              <Mail className="w-3 h-3 mr-2" /> Messages
            </Link>
            <Link to="/admin/links" className={`text-[9px] uppercase tracking-widest font-bold flex items-center whitespace-nowrap ${location.pathname === '/admin/links' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}>
              <LayoutDashboard className="w-3 h-3 mr-2" /> Links
            </Link>
            <Link to="/admin/profile" className={`text-[9px] uppercase tracking-widest font-bold flex items-center whitespace-nowrap ${location.pathname === '/admin/profile' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}>
              <User className="w-3 h-3 mr-2" /> Profile
            </Link>
          </motion.div>
        </div>
      )}
    </nav>
  );
}

