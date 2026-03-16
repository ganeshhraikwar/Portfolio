import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Review, OperationType } from '../types';
import { handleFirestoreError } from '../utils/error-handler';
import { Star, Trash2, CheckCircle, XCircle, User, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData);
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'reviews'));

    return unsubscribe;
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (error: any) {
      console.error("Error deleting review:", error);
      alert(`Failed to delete review: ${error.message}`);
    }
  };

  const toggleApproval = async (review: Review) => {
    try {
      await updateDoc(doc(db, 'reviews', review.id), {
        approved: !review.approved
      });
    } catch (error: any) {
      console.error("Error updating review:", error);
      alert(`Failed to update review: ${error.message}`);
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
        <h1 className="text-5xl font-light tracking-tight text-white">Reviews</h1>
        <p className="text-white/40 mt-2 font-light">Manage and approve client testimonials.</p>
      </motion.header>

      <div className="grid grid-cols-1 gap-6">
        {reviews.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-20 rounded-[2.5rem] text-center"
          >
            <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-6" />
            <p className="text-white/30 font-light italic">No reviews yet.</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {reviews.map((review, index) => (
              <motion.div 
                key={review.id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="glass p-8 rounded-[2.5rem] relative group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 flex-1">
                    {review.avatarUrl ? (
                      <img src={review.avatarUrl} alt={review.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl object-cover grayscale" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 glass rounded-2xl flex items-center justify-center text-white/20">
                        <User className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <h3 className="text-base sm:text-lg font-medium text-white">{review.name}</h3>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                             <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{review.role || 'Client'}</p>
                      <p className="text-white/60 font-light italic text-sm">"{review.content}"</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
                    <button 
                      onClick={() => toggleApproval(review)}
                      className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                        review.approved 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                          : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'
                      }`}
                    >
                      {review.approved ? <CheckCircle className="w-4 h-4 mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                      {review.approved ? 'Approved' : 'Pending'}
                    </button>
                    <button 
                      onClick={() => handleDelete(review.id)}
                      className="p-2 sm:p-3 glass rounded-2xl text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
