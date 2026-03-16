import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { SocialLink, OperationType } from '../types';
import { handleFirestoreError } from '../utils/error-handler';
import { Plus, Trash2, Edit2, X, Save, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLinks() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLink, setCurrentLink] = useState<Partial<SocialLink>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'socialLinks'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SocialLink[];
        setLinks(data);
        setLoading(false);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'socialLinks')
    );
    return unsubscribe;
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...currentLink,
        order: currentLink.order || links.length,
      };

      if (currentLink.id) {
        const { id, ...updateData } = data;
        await updateDoc(doc(db, 'socialLinks', id), updateData);
      } else {
        await addDoc(collection(db, 'socialLinks'), {
          ...data,
          createdAt: serverTimestamp()
        });
      }
      setIsEditing(false);
      setCurrentLink({});
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'socialLinks');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    try {
      await deleteDoc(doc(db, 'socialLinks', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `socialLinks/${id}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Links</h1>
          <p className="text-zinc-500">Manage your social and external links.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => { setIsEditing(true); setCurrentLink({}); }}
            className="flex items-center px-4 sm:px-6 py-2 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-colors text-xs sm:text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Link
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl shadow-xl border border-zinc-200 w-full max-w-lg p-6 sm:p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold">{currentLink.id ? 'Edit Link' : 'New Link'}</h2>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-zinc-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Title</label>
                    <input 
                      required
                      type="text" 
                      value={currentLink.title || ''} 
                      onChange={e => setCurrentLink({...currentLink, title: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none"
                      placeholder="e.g., GitHub, Twitter, Portfolio"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">URL</label>
                    <input 
                      required
                      type="url" 
                      value={currentLink.url || ''} 
                      onChange={e => setCurrentLink({...currentLink, url: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Order</label>
                    <input 
                      type="number" 
                      value={currentLink.order || 0} 
                      onChange={e => setCurrentLink({...currentLink, order: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="submit" className="flex-grow flex items-center justify-center px-6 py-4 bg-zinc-900 text-white rounded-2xl font-semibold hover:bg-zinc-800 transition-all">
                    <Save className="w-5 h-5 mr-2" /> Save Link
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Title</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">URL</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Order</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
            {links.map((link, index) => (
              <motion.tr 
                key={link.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-zinc-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 mr-4 flex items-center justify-center text-zinc-400 border border-zinc-200">
                      <LinkIcon className="w-5 h-5" />
                    </div>
                    <div className="font-semibold text-zinc-900">{link.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-500">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 truncate max-w-[200px] inline-block">
                    {link.url}
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-500 font-mono">{link.order}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => { setIsEditing(true); setCurrentLink(link); }} className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(link.id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {links.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-zinc-400 italic">No links found. Add your first one!</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
