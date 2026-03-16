import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, getCountFromServer } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { Briefcase, User, Eye, Plus, ArrowRight, Database, Loader2, Mail, MessageSquare, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { seedProjects } from '../utils/seedData';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, messages: 0, reviews: 0 });
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      const [projectsCount, messagesCount, reviewsCount] = await Promise.all([
        getCountFromServer(collection(db, 'projects')),
        getCountFromServer(collection(db, 'messages')),
        getCountFromServer(collection(db, 'reviews'))
      ]);
      
      setStats({ 
        projects: projectsCount.data().count,
        messages: messagesCount.data().count,
        reviews: reviewsCount.data().count
      });
    };
    fetchStats();
  }, []);

  const handleSeedData = async () => {
    // We will just proceed without confirm for now to avoid iframe issues
    setIsSeeding(true);
    setSeedMessage('');
    try {
      await seedProjects();
      setSeedMessage('Sample data added successfully!');
      // Refresh stats
      const [projectsCount, messagesCount, reviewsCount] = await Promise.all([
        getCountFromServer(collection(db, 'projects')),
        getCountFromServer(collection(db, 'messages')),
        getCountFromServer(collection(db, 'reviews'))
      ]);
      setStats({ 
        projects: projectsCount.data().count,
        messages: messagesCount.data().count,
        reviews: reviewsCount.data().count
      });
      setTimeout(() => setSeedMessage(''), 3000);
    } catch (error) {
      console.error('Error seeding data:', error);
      setSeedMessage('Failed to add sample data.');
      setTimeout(() => setSeedMessage(''), 3000);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16 sm:pt-40">
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="h-[1px] w-8 bg-white/30" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30">Management</span>
        </div>
        <h1 className="text-5xl font-light tracking-tight text-white">Dashboard</h1>
        <p className="text-white/40 mt-2 font-light">Welcome back. Here's an overview of your professional space.</p>
      </motion.header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <StatCard 
          title="Projects" 
          value={stats.projects} 
          icon={<Briefcase className="w-5 h-5" />} 
          link="/admin/projects"
          index={0}
        />
        <StatCard 
          title="Messages" 
          value={stats.messages} 
          icon={<Mail className="w-5 h-5" />} 
          link="/admin/messages"
          index={1}
        />
        <StatCard 
          title="Reviews" 
          value={stats.reviews} 
          icon={<Star className="w-5 h-5" />} 
          link="/admin/reviews"
          index={2}
        />
        <StatCard 
          title="Live Site" 
          value="View" 
          icon={<Eye className="w-5 h-5" />} 
          link="/"
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass p-6 sm:p-10 rounded-[2.5rem]"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-light tracking-tight">Quick Actions</h2>
          </div>
          <div className="space-y-4">
            {seedMessage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-emerald-500/10 text-emerald-400 text-[10px] rounded-2xl border border-emerald-500/20 text-center font-bold uppercase tracking-widest"
              >
                {seedMessage}
              </motion.div>
            )}
            <button 
              onClick={handleSeedData}
              disabled={isSeeding}
              className="w-full flex items-center justify-between p-4 sm:p-6 bg-white/5 rounded-3xl hover:bg-white/10 transition-all group border border-white/5 disabled:opacity-50"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 glass rounded-2xl flex items-center justify-center mr-4 sm:mr-6">
                  {isSeeding ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin" /> : <Database className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                </div>
                <span className="font-medium tracking-tight text-sm sm:text-base">Seed Sample Data</span>
              </div>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/20 group-hover:translate-x-1 transition-transform group-hover:text-white" />
            </button>
            <Link to="/admin/messages" className="flex items-center justify-between p-4 sm:p-6 bg-white/5 rounded-3xl hover:bg-white/10 transition-all group border border-white/5">
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 glass rounded-2xl flex items-center justify-center mr-4 sm:mr-6">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="font-medium tracking-tight text-sm sm:text-base">Check Messages</span>
              </div>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/20 group-hover:translate-x-1 transition-transform group-hover:text-white" />
            </Link>
            <Link to="/admin/reviews" className="flex items-center justify-between p-4 sm:p-6 bg-white/5 rounded-3xl hover:bg-white/10 transition-all group border border-white/5">
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 glass rounded-2xl flex items-center justify-center mr-4 sm:mr-6">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="font-medium tracking-tight text-sm sm:text-base">Manage Reviews</span>
              </div>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/20 group-hover:translate-x-1 transition-transform group-hover:text-white" />
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="glass p-6 sm:p-10 rounded-[2.5rem] flex flex-col justify-center items-center text-center"
        >
          <div className="w-20 h-20 glass rounded-full flex items-center justify-center mb-6">
            <MessageSquare className="w-10 h-10 text-white/20" />
          </div>
          <h2 className="text-xl font-light tracking-tight mb-3">Client Feedback</h2>
          <p className="text-white/40 text-sm font-light mb-8 max-w-xs leading-relaxed">Approve and showcase testimonials from your clients to build trust and credibility.</p>
          <Link to="/admin/reviews" className="px-8 py-3 bg-white text-black rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-white/90 transition-colors">
            Go to Reviews
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, link, index }: { title: string, value: string | number, icon: React.ReactNode, link: string, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      <Link to={link} className="glass p-8 rounded-[2.5rem] hover:bg-white/10 transition-all border border-white/5 group block h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            {icon}
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-2">{title}</p>
          <p className="text-3xl font-light tracking-tight text-white">{value}</p>
        </div>
      </Link>
    </motion.div>
  );
}

