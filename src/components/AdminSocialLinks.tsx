import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { SocialLink } from '../types';
import { Plus, Trash2, Save, GripVertical } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminSocialLinks() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [newLink, setNewLink] = useState({ title: '', url: '', icon: '' });

  useEffect(() => {
    const q = query(collection(db, 'socialLinks'), orderBy('order', 'asc'));
    return onSnapshot(q, (snapshot) => {
      setLinks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialLink)));
    });
  }, []);

  const addLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = Date.now().toString();
    await setDoc(doc(db, 'socialLinks', id), {
      ...newLink,
      order: links.length,
      createdAt: serverTimestamp()
    });
    setNewLink({ title: '', url: '', icon: '' });
  };

  const deleteLink = async (id: string) => {
    await deleteDoc(doc(db, 'socialLinks', id));
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Manage Social Links</h2>
      <form onSubmit={addLink} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <input type="text" placeholder="Title" value={newLink.title} onChange={e => setNewLink({...newLink, title: e.target.value})} className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl" required />
        <input type="url" placeholder="URL" value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl" required />
        <input type="text" placeholder="Icon (e.g., github)" value={newLink.icon} onChange={e => setNewLink({...newLink, icon: e.target.value})} className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl" />
        <button type="submit" className="bg-zinc-900 text-white px-4 py-2 rounded-xl flex items-center justify-center hover:bg-zinc-800">
          <Plus className="w-5 h-5 mr-2" /> Add
        </button>
      </form>
      <div className="space-y-4">
        {links.map((link) => (
          <div key={link.id} className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-2xl">
            <div className="flex items-center">
              <GripVertical className="w-5 h-5 text-zinc-400 mr-4" />
              <div>
                <p className="font-semibold">{link.title}</p>
                <p className="text-sm text-zinc-500">{link.url}</p>
              </div>
            </div>
            <button onClick={() => deleteLink(link.id)} className="text-red-500 hover:text-red-700">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
