import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLogin() {
  const { user, isAdmin, loading } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (loading) return null;
  if (user && isAdmin) return <Navigate to="/admin" />;

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user.email !== "ganeshhraikwar@gmail.com") {
        await auth.signOut();
        setError("Access denied. Only the administrator can log in.");
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError("This domain is not authorized for Google Login. Please go to Firebase Console -> Authentication -> Settings -> Authorized domains, and add your Vercel domain.");
      } else {
        setError(err.message || "An error occurred during login.");
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/5 rounded-full blur-[100px] -z-10" 
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full glass rounded-[2.5rem] p-12"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 glass rounded-3xl flex items-center justify-center mx-auto mb-8"
          >
            <LogIn className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl font-light tracking-tight text-white"
          >
            Admin Access
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-white/40 mt-3 text-sm font-light"
          >
            Sign in with <strong className="text-white">ganeshhraikwar@gmail.com</strong> to manage your professional space
          </motion.p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-4 bg-red-500/10 text-red-400 text-xs rounded-2xl border border-red-500/20 text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          onClick={handleLogin}
          className="w-full flex items-center justify-center px-6 py-5 bg-white text-black rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all active:scale-[0.98]"
        >
          <img src="https://www.gstatic.com/firebase/anonymous-scan.png" className="w-5 h-5 mr-4" alt="" />
          Continue with Google
        </motion.button>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center text-[10px] uppercase tracking-widest text-white/20 leading-relaxed font-bold"
        >
          Authorized access only
        </motion.p>
      </motion.div>
    </div>
  );
}

