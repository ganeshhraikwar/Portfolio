import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Profile } from '../types';
import { Instagram, Twitter, Linkedin, Github, Facebook, Youtube, Dribbble, Globe } from 'lucide-react';

export default function Footer() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'profile'), (snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.data() as Profile);
      }
    });
    return unsubscribe;
  }, []);

  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github': return <Github className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      case 'dribbble': return <Dribbble className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const SOCIAL_BASE_URLS: Record<string, string> = {
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/in/',
    twitter: 'https://twitter.com/',
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    youtube: 'https://youtube.com/@',
    dribbble: 'https://dribbble.com/',
    behance: 'https://behance.net/'
  };

  return (
    <footer className="py-12 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
              © {new Date().getFullYear()} {profile?.name || 'Portfolio'}. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {profile?.socialLinks && Object.entries(profile.socialLinks).map(([platform, username]) => {
              if (!username || typeof username !== 'string') return null;
              const baseUrl = SOCIAL_BASE_URLS[platform] || '';
              const href = username.startsWith('http') ? username : `${baseUrl}${username.replace(/^@/, '')}`;
              
              return (
                <a 
                  key={platform}
                  href={href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300"
                  title={platform}
                >
                  {getIcon(platform)}
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

