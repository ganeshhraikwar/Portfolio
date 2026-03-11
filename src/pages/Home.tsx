import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Project, Profile, OperationType, Review, SocialLink } from '../types';
import { handleFirestoreError } from '../utils/error-handler';
import ProjectCarousel from '../components/ProjectCarousel';
import ContactForm from '../components/ContactForm';
import ReviewForm from '../components/ReviewForm';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, Plus, X, Github, Linkedin, Twitter, Instagram, Facebook, Youtube, Dribbble, Globe, ExternalLink } from 'lucide-react';

const CATEGORIES = [
  "Graphic Designing",
  "Video Editing",
  "Web Designing",
  "Brand Design",
  "Photography"
];

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'github': return <Github className="w-4 h-4 mr-2" />;
    case 'linkedin': return <Linkedin className="w-4 h-4 mr-2" />;
    case 'twitter': return <Twitter className="w-4 h-4 mr-2" />;
    case 'instagram': return <Instagram className="w-4 h-4 mr-2" />;
    case 'facebook': return <Facebook className="w-4 h-4 mr-2" />;
    case 'youtube': return <Youtube className="w-4 h-4 mr-2" />;
    case 'dribbble': return <Dribbble className="w-4 h-4 mr-2" />;
    default: return <Globe className="w-4 h-4 mr-2" />;
  }
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    // Fetch Profile
    const profileUnsubscribe = onSnapshot(
      doc(db, 'settings', 'profile'),
      (snapshot) => {
        if (snapshot.exists()) {
          setProfile(snapshot.data() as Profile);
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'settings/profile')
    );

    // Fetch Social Links
    const linksUnsubscribe = onSnapshot(
      query(collection(db, 'socialLinks'), orderBy('order', 'asc')),
      (snapshot) => {
        setSocialLinks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialLink)));
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'socialLinks')
    );

    // Fetch Projects
    const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const projectsUnsubscribe = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const projectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];
        setProjects(projectsData);
        setLoading(false);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'projects')
    );

    // Fetch Approved Reviews
    const reviewsQuery = query(
      collection(db, 'reviews'), 
      where('approved', '==', true),
      orderBy('createdAt', 'desc')
    );
    const reviewsUnsubscribe = onSnapshot(
      reviewsQuery,
      (snapshot) => {
        const reviewsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Review[];
        setReviews(reviewsData);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'reviews')
    );

    return () => {
      profileUnsubscribe();
      linksUnsubscribe();
      projectsUnsubscribe();
      reviewsUnsubscribe();
    };
  }, []);

  const getProjectsByCategory = (category: string) => {
    return projects.filter(p => p.tags?.includes(category));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-white/10 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-32"
        >
          <div className="flex items-center gap-4 mb-8 animate-float">
            <div className="h-[1px] w-12 bg-white/30" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/50 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Available for projects
            </span>
          </div>
          
          <h1 className="text-7xl md:text-[10rem] font-light tracking-tighter leading-[0.85] mb-12 relative group">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/50 bg-[length:200%_auto] animate-gradient text-glow-hover transition-all duration-500">
              {profile?.name || "Your Name"}
            </span>
            <span className="block italic font-serif text-white/20 ml-12 md:ml-24 group-hover:text-white/40 transition-colors duration-700">Portfolio</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
            <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed max-w-xl">
              {profile?.bio || "I build digital experiences that matter. Crafting thoughtful solutions through design and technology."}
            </p>
            <div className="flex md:justify-end gap-8">
              <div className="flex flex-wrap gap-4">
                {socialLinks.map(link => (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors text-xs uppercase tracking-widest font-semibold text-white/70 hover:text-white"
                  >
                    {getSocialIcon(link.icon || '')}
                    {link.title}
                    <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
                  </a>
                ))}
              </div>
              <a href="#works" className="group flex items-center gap-3 text-xs uppercase tracking-widest font-semibold hover:text-white/80 transition-colors">
                <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-500">
                  ↓
                </span>
                Explore Work
              </a>
            </div>
          </div>
        </motion.section>

        {/* About Me Section */}
        {(profile?.about || profile?.aboutImage || (profile?.skills && profile.skills.length > 0)) && (
          <motion.section 
            id="about"
            className="mb-48"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {profile.aboutImage && (
                <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] lg:aspect-square">
                  <img 
                    src={profile.aboutImage} 
                    alt={profile.name} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}
              <div className={`space-y-12 ${!profile.aboutImage ? 'lg:col-span-2' : ''}`}>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-4 block">About Me</span>
                  <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-8">
                    {profile.title || "Creative Professional"}
                  </h2>
                  <p className="text-white/70 font-light text-lg leading-relaxed whitespace-pre-wrap">
                    {profile.about}
                  </p>
                </div>

                {profile.skills && profile.skills.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-6 block">Skills & Expertise</span>
                    <div className="flex flex-wrap gap-3">
                      {profile.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-4 py-2 glass rounded-full text-xs font-medium text-white/80"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* Projects Carousels */}
        <motion.section 
          id="works" 
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-4 block">01 — Selection</span>
              <h2 className="text-4xl md:text-6xl font-light tracking-tight">Selected Works</h2>
            </div>
            <div className="text-right">
              <span className="font-mono text-sm text-white/20">{projects.length.toString().padStart(2, '0')} Projects Total</span>
            </div>
          </div>
          
          <div className="space-y-32">
            {CATEGORIES.map((category) => {
              const categoryProjects = getProjectsByCategory(category);
              if (categoryProjects.length === 0) return null;
              return (
                <ProjectCarousel 
                  key={category} 
                  projects={categoryProjects} 
                  category={category} 
                />
              );
            })}
            
            {projects.length === 0 && (
              <div className="py-32 text-center glass rounded-[2rem]">
                <p className="text-white/40 font-light italic font-serif text-xl">Projects coming soon.</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Reviews Section */}
        <motion.section 
          className="mt-48"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-4 block">02 — Feedback</span>
              <h2 className="text-4xl md:text-6xl font-light tracking-tight">Client Reviews</h2>
            </div>
            <button 
              onClick={() => setShowReviewForm(true)}
              className="px-8 py-3 glass rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-white/10 transition-all flex items-center gap-3"
            >
              <Plus className="w-4 h-4" /> Add Review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div 
                key={review.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass p-8 rounded-[2rem] relative group hover:bg-white/10 transition-all duration-500"
              >
                <Quote className="absolute top-6 right-8 w-10 h-10 text-white/5 group-hover:text-white/10 transition-colors" />
                
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${i < review.rating ? 'text-white fill-white' : 'text-white/20'}`} 
                    />
                  ))}
                </div>

                <p className="text-white/70 font-light leading-relaxed mb-8 italic">
                  "{review.content}"
                </p>

                <div className="flex items-center gap-4">
                  {review.avatarUrl ? (
                    <img 
                      src={review.avatarUrl} 
                      alt={review.name} 
                      className="w-10 h-10 rounded-full object-cover grayscale"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                      {review.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium text-white">{review.name}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-white/30">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {reviews.length === 0 && (
              <div className="col-span-full py-20 text-center glass rounded-[2rem]">
                <p className="text-white/40 font-light italic font-serif text-xl">No reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Review Form Modal */}
        <AnimatePresence>
          {showReviewForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowReviewForm(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl glass p-8 sm:p-12 rounded-[2.5rem] overflow-y-auto max-h-[90vh]"
              >
                <button 
                  onClick={() => setShowReviewForm(false)}
                  className="absolute top-8 right-8 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="mb-12">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-4 block">Share your story</span>
                  <h2 className="text-4xl font-light tracking-tight">Write a Review</h2>
                </div>

                <ReviewForm />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Contact Section */}
        <motion.section 
          id="contact" 
          className="mt-48 mb-32"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-4 block">03 — Connect</span>
              <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-8">Let's create something <span className="italic font-serif text-white/40">extraordinary</span>.</h2>
              <p className="text-white/50 font-light text-lg max-w-md leading-relaxed mb-12">
                Have a project in mind? Or just want to say hi? Feel free to reach out. I'm always open to new opportunities and creative collaborations.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    @
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Email</p>
                    <p className="text-white font-light">{profile?.email || "ganeshhraikwar@gmail.com"}</p>
                  </div>
                </div>

                {profile?.socialLinks && Object.entries(profile.socialLinks).some(([_, username]) => username) && (
                  <div className="pt-8 mt-8 border-t border-white/10">
                    <p className="text-[10px] uppercase tracking-widest text-white/30 mb-6">Social Profiles</p>
                    <div className="flex flex-wrap gap-4">
                      {Object.entries(profile.socialLinks).map(([platform, username]) => {
                        if (!username) return null;
                        
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
                        
                        const baseUrl = SOCIAL_BASE_URLS[platform] || '';
                        // If user accidentally pastes full URL, use it directly, otherwise append to base URL
                        const href = username.startsWith('http') ? username : `${baseUrl}${username.replace(/^@/, '')}`;

                        return (
                          <a 
                            key={platform}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-6 py-3 glass rounded-full text-xs font-medium text-white/80 hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 capitalize group"
                          >
                            <span className="group-hover:text-black transition-colors">{getSocialIcon(platform)}</span>
                            {platform}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass p-10 rounded-[2.5rem]"
            >
              <ContactForm />
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
