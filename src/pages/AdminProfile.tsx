import React, { useEffect, useState, useRef } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Profile, OperationType } from '../types';
import { handleFirestoreError } from '../utils/error-handler';
import { Save, User, Link as LinkIcon, Upload } from 'lucide-react';
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
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatarUrl' | 'aboutImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

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
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Avatar URL or Upload</label>
              <div className="flex gap-4 items-center">
                <input 
                  type="text" 
                  value={profile.avatarUrl} 
                  onChange={e => setProfile({...profile, avatarUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light"
                />
                <input 
                  type="file" 
                  accept="image/*"
                  ref={avatarInputRef}
                  onChange={(e) => handleImageUpload(e, 'avatarUrl')}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="px-6 py-3 sm:py-4 bg-white/10 hover:bg-white/20 border border-white/5 rounded-2xl transition-all flex items-center gap-2 text-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload</span>
                </button>
              </div>
              {profile.avatarUrl && (
                <div className="mt-4 w-16 h-16 rounded-full overflow-hidden border border-white/10">
                  <img src={profile.avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">About Me</label>
              <textarea 
                rows={4}
                value={profile.about || ''} 
                onChange={e => setProfile({...profile, about: e.target.value})}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light resize-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">About Image URL or Upload</label>
              <div className="flex gap-4 items-center">
                <input 
                  type="text" 
                  value={profile.aboutImage || ''} 
                  onChange={e => setProfile({...profile, aboutImage: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light"
                />
                <input 
                  type="file" 
                  accept="image/*"
                  ref={aboutImageInputRef}
                  onChange={(e) => handleImageUpload(e, 'aboutImage')}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => aboutImageInputRef.current?.click()}
                  className="px-6 py-3 sm:py-4 bg-white/10 hover:bg-white/20 border border-white/5 rounded-2xl transition-all flex items-center gap-2 text-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload</span>
                </button>
              </div>
              {profile.aboutImage && (
                <div className="mt-4 w-32 h-32 rounded-2xl overflow-hidden border border-white/10">
                  <img src={profile.aboutImage} alt="About Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Skills (comma separated)</label>
              <input 
                type="text" 
                value={profile.skills?.join(', ') || ''} 
                onChange={e => setProfile({...profile, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light"
                placeholder="React, TypeScript, Node.js..."
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
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">GitHub Username</label>
              <input 
                type="text" 
                placeholder="username"
                value={profile.socialLinks?.github || ''} 
                onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, github: e.target.value}})}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">LinkedIn Username</label>
              <input 
                type="text" 
                placeholder="username"
                value={profile.socialLinks?.linkedin || ''} 
                onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, linkedin: e.target.value}})}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Twitter / X Username</label>
              <input 
                type="text" 
                placeholder="username"
                value={profile.socialLinks?.twitter || ''} 
                onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, twitter: e.target.value}})}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Instagram Username</label>
              <input 
                type="text" 
                placeholder="username"
                value={profile.socialLinks?.instagram || ''} 
                onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, instagram: e.target.value}})}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Facebook Username</label>
              <input 
                type="text" 
                placeholder="username"
                value={profile.socialLinks?.facebook || ''} 
                onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, facebook: e.target.value}})}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">YouTube Username</label>
              <input 
                type="text" 
                placeholder="channelname or @handle"
                value={profile.socialLinks?.youtube || ''} 
                onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, youtube: e.target.value}})}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Dribbble Username</label>
              <input 
                type="text" 
                placeholder="username"
                value={profile.socialLinks?.dribbble || ''} 
                onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, dribbble: e.target.value}})}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Behance Username</label>
              <input 
                type="text" 
                placeholder="username"
                value={profile.socialLinks?.behance || ''} 
                onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, behance: e.target.value}})}
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

