import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { OperationType } from '../types';
import { handleFirestoreError } from '../utils/error-handler';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      // Save to Firebase Database
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp()
      });

      // Send email to ganeshhraikwar@gmail.com via FormSubmit
      await fetch('https://formsubmit.co/ajax/ganeshhraikwar@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `New Portfolio Message from ${formData.name}`,
          _template: 'box'
        })
      });

      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error: any) {
      console.error(error);
      setSuccess(false);
      setError("Failed to send message. Please try again later.");
      setTimeout(() => setError(''), 5000);
      handleFirestoreError(error, OperationType.CREATE, 'messages');
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      onSubmit={handleSubmit} 
      className="space-y-6"
    >
      {success && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-emerald-500/10 text-emerald-400 text-xs rounded-2xl border border-emerald-500/20 text-center font-bold uppercase tracking-widest"
        >
          Message sent successfully!
        </motion.div>
      )}
      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-red-500/10 text-red-400 text-xs rounded-2xl border border-red-500/20 text-center font-bold uppercase tracking-widest"
        >
          {error}
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Name</label>
          <input 
            type="text" 
            required
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light"
            placeholder="Your name"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Email</label>
          <input 
            type="email" 
            required
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light"
            placeholder="Your email"
          />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Message</label>
        <textarea 
          required
          rows={5}
          value={formData.message}
          onChange={e => setFormData({...formData, message: e.target.value})}
          className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-white/20 outline-none transition-all text-white font-light resize-none"
          placeholder="How can I help you?"
        />
      </motion.div>

      <motion.button 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        type="submit" 
        disabled={sending}
        className="w-full flex items-center justify-center px-8 py-5 bg-white text-black rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all disabled:opacity-50"
      >
        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 mr-3" />}
        {sending ? 'Sending...' : 'Send Message'}
      </motion.button>
    </motion.form>
  );
}
