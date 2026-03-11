import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { SocialLink } from '../types';
import { motion } from 'motion/react';

export default function Links() {
  const [links, setLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'socialLinks'), orderBy('order', 'asc'));
    return onSnapshot(q, (snapshot) => {
      setLinks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialLink)));
    });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-zinc-900 overflow-hidden relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-2xl" />
          
          <div className="text-center mb-8 mt-6">
            <div className="w-24 h-24 rounded-full bg-zinc-200 mx-auto mb-4" />
            <h1 className="text-xl font-bold">Your Name</h1>
            <p className="text-zinc-500 text-sm">Digital Creator</p>
          </div>

          <div className="space-y-4">
            {links.map((link) => (
              <a 
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 px-6 bg-zinc-100 hover:bg-zinc-200 rounded-2xl text-center font-semibold transition-all"
              >
                {link.title}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
