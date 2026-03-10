import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Star, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function ReviewForm() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        ...formData,
        approved: false,
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      setFormData({ name: '', role: '', content: '', rating: 5 });
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-light text-white mb-2">Thank you!</h3>
        <p className="text-white/40 font-light mb-8">Your review has been submitted for moderation.</p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="text-[10px] uppercase tracking-widest font-bold text-white/60 hover:text-white transition-colors underline underline-offset-8"
        >
          Submit another
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-2"
        >
          <label className="text-[10px] uppercase tracking-widest font-bold text-white/30 ml-4">Full Name</label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
          />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-2"
        >
          <label className="text-[10px] uppercase tracking-widest font-bold text-white/30 ml-4">Role / Company</label>
          <input
            required
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="CEO at TechFlow"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
          />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-2"
      >
        <label className="text-[10px] uppercase tracking-widest font-bold text-white/30 ml-4">Rating</label>
        <div className="flex gap-2 px-4 py-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, rating: star })}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-125"
            >
              <Star 
                className={`w-6 h-6 ${
                  star <= (hoveredRating || formData.rating) 
                    ? 'text-white fill-white' 
                    : 'text-white/10'
                } transition-colors`}
              />
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-2"
      >
        <label className="text-[10px] uppercase tracking-widest font-bold text-white/30 ml-4">Your Experience</label>
        <textarea
          required
          rows={4}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Share your thoughts on our collaboration..."
          className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
        />
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        type="submit"
        disabled={isSubmitting}
        className="w-full py-5 bg-white text-black rounded-full font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Review'
        )}
      </motion.button>
    </form>
  );
}
