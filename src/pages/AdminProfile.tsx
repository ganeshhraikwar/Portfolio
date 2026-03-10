import React, { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Profile, OperationType } from '../types';
import { handleFirestoreError } from '../utils/error-handler';
import { Save, User, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminProfile() {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    title: '',
    bio: '',
    about: '',
    email: '',
    avatarUrl: '',
    socialLinks: { github: '', linkedin: '', twitter: '' }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'settings', 'profile'),
      (snapshot) => {
        if (snapshot.exists()) {
          setProfile(snapshot.data() as Profile);
        }
        setLoading(false);
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'settings/profile')
    );
    return unsubscribe;
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await setDoc(doc(db, 'settings', 'profile'), profile);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32"
    >
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="h-[1px] w-8 bg-white/30" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30">Settings</span>
        </div>
        <h1 className="text-5xl font-light tracking-tight text-white">Profile Settings</h1>
        <p className="text-white/40 mt-2 font-light">Customize your public portfolio information.</p>
      </motion.header>

      <form onSubmit={handleSave} className="space-y-12">
        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="p-4 bg-emerald-500/10 text-emerald-400 text-xs rounded-2xl border border-emerald-500/20 text-center font-bold uppercase tracking-widest"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="glass p-6 sm:p-10 rounded-[2.5rem] space-y-8"
        >
          <div className="flex items-center space-x-4 sm:space-x-6 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 glass rounded-2xl flex items-center justify-center">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-light tracking-tight">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Full Name</label>
              <input 
                type="text" 
                value={profile.name} 
                onChange={e => setProfile({...profile, name: e.target.value})}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Professional Title</label>
              <input 
                type="text" 
                value={profile.title} 
                onChange={e => setProfile({...profile, title: e.target.value})}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Short Bio</label>
              <input 
                type="text" 
                value={profile.bio} 
                onChange={e => setProfile({...profile, bio: e.target.value})}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Avatar URL</label>
              <input 
                type="url" 
                value={profile.avatarUrl} 
                onChange={e => setProfile({...profile, avatarUrl: e.target.value})}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light"
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass p-6 sm:p-10 rounded-[2.5rem] space-y-8"
        >
          <div className="flex items-center space-x-4 sm:space-x-6 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 glass rounded-2xl flex items-center justify-center">
              <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-light tracking-tight">Social Links</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">GitHub</label>
              <input 
                type="url" 
                value={profile.socialLinks?.github || ''} 
                onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, github: e.target.value}})}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">LinkedIn</label>
              <input 
                type="url" 
                value={profile.socialLinks?.linkedin || ''} 
                onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, linkedin: e.target.value}})}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Twitter / X</label>
              <input 
                type="url" 
                value={profile.socialLinks?.twitter || ''} 
                onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, twitter: e.target.value}})}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light"
              />
            </div>
          </div>
        </motion.div>

        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          type="submit" 
          disabled={saving}
          className="w-full flex items-center justify-center px-8 py-5 bg-white text-black rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all disabled:opacity-50"
        >
          <Save className="w-5 h-5 mr-3" /> {saving ? 'Saving...' : 'Save Profile Settings'}
        </motion.button>
      </form>
    </motion.div>
  );
}

