import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { ContactMessage, OperationType } from '../types';
import { handleFirestoreError } from '../utils/error-handler';
import { Mail, Trash2, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContactMessage[];
      setMessages(messagesData);
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'messages'));

    return unsubscribe;
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'messages', id));
      setStatusMessage('Message deleted successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `messages/${id}`);
    }
  };

  if (loading) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32"
    >
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="h-[1px] w-8 bg-white/30" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30">Admin</span>
        </div>
        <h1 className="text-5xl font-light tracking-tight text-white">Messages</h1>
        <p className="text-white/40 mt-2 font-light">View and manage inquiries from your contact form.</p>
      </motion.header>

      <AnimatePresence>
        {statusMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-4 bg-emerald-500/10 text-emerald-400 text-xs rounded-2xl border border-emerald-500/20 text-center font-bold uppercase tracking-widest"
          >
            {statusMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-20 rounded-[2.5rem] text-center"
          >
            <Mail className="w-12 h-12 text-white/10 mx-auto mb-6" />
            <p className="text-white/30 font-light italic">No messages received yet.</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div 
                key={message.id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="glass p-8 rounded-[2.5rem] relative group"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] uppercase tracking-widest font-bold text-white/30">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-2" /> {message.name}
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-2" /> <span className="break-all">{message.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-2" /> 
                        {message.createdAt?.toDate ? format(message.createdAt.toDate(), 'MMM d, yyyy HH:mm') : 'Just now'}
                      </div>
                    </div>
                    <p className="text-white/70 font-light leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                      {message.message}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDelete(message.id)}
                    className="p-3 sm:p-4 glass rounded-2xl text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all self-start"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
