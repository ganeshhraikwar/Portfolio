import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Project, OperationType } from '../types';
import { handleFirestoreError } from '../utils/error-handler';
import { Plus, Trash2, Edit2, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
        setProjects(data);
        setLoading(false);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'projects')
    );
    return unsubscribe;
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...currentProject,
        updatedAt: serverTimestamp(),
        order: currentProject.order || projects.length,
        tags: typeof currentProject.tags === 'string' ? (currentProject.tags as string).split(',').map(t => t.trim()) : currentProject.tags || []
      };

      if (currentProject.id) {
        const { id, ...updateData } = data;
        await updateDoc(doc(db, 'projects', id), updateData);
      } else {
        await addDoc(collection(db, 'projects'), {
          ...data,
          createdAt: serverTimestamp()
        });
      }
      setIsEditing(false);
      setCurrentProject({});
    } catch (error: any) {
      console.error("Error saving project:", error);
      alert(`Failed to save project: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error: any) {
      console.error("Error deleting project:", error);
      alert(`Failed to delete project: ${error.message}`);
    }
  };

  const populateSampleDetails = async () => {
    if (!confirm('This will add sample details (client request, solution, images) to all your existing projects based on their tags. Proceed?')) return;
    try {
      for (const p of projects) {
        const tagsLower = (p.tags || []).map(t => t.toLowerCase());
        const isWeb = tagsLower.some(t => t.includes('web') || t.includes('react') || t.includes('ui') || t.includes('app'));
        const isVideo = tagsLower.some(t => t.includes('video') || t.includes('film') || t.includes('edit'));
        const isBrand = tagsLower.some(t => t.includes('brand') || t.includes('logo') || t.includes('identity') || t.includes('packag'));
        const isPhoto = tagsLower.some(t => t.includes('photo') || t.includes('camera') || t.includes('shoot'));

        let clientRequest = "";
        let solution = "";
        let content = "";
        let beforeImage = "";
        let afterImage = "";
        let galleryImages: string[] = [];

        if (isVideo) {
          clientRequest = "The client needed a high-energy promotional video to showcase their new product line. They wanted dynamic transitions, color grading that matched their brand, and engaging sound design to capture the audience's attention on social media.";
          solution = "We edited the raw footage into a fast-paced, 60-second promo. We applied custom LUTs for a cinematic look, added motion graphics for key features, and mixed a high-impact audio track. The final video increased their social engagement by 300%.";
          beforeImage = `https://picsum.photos/seed/vidbefore${p.id}/800/600`;
          afterImage = `https://picsum.photos/seed/vidafter${p.id}/800/600`;
          galleryImages = [
            `https://picsum.photos/seed/vid1${p.id}/800/800`,
            `https://picsum.photos/seed/vid2${p.id}/800/800`
          ];
        } else if (isBrand) {
          clientRequest = "The client was launching a new business and needed a complete brand identity from scratch. This included a versatile logo, color palette, typography, business cards, letterheads, and product packaging concepts that reflected their premium positioning.";
          solution = "We developed a minimalist and elegant brand identity. We designed a timeless logo, selected a sophisticated color palette, and created comprehensive brand guidelines. We also delivered print-ready assets for business cards, invoices, and premium packaging mockups.";
          beforeImage = `https://picsum.photos/seed/brandbefore${p.id}/800/600`;
          afterImage = `https://picsum.photos/seed/brandafter${p.id}/800/600`;
          galleryImages = [
            `https://picsum.photos/seed/brand1${p.id}/800/800`,
            `https://picsum.photos/seed/brand2${p.id}/800/800`,
            `https://picsum.photos/seed/brand3${p.id}/800/800`,
            `https://picsum.photos/seed/brand4${p.id}/800/800`
          ];
        } else if (isPhoto) {
          clientRequest = "The client required a professional photoshoot for their upcoming editorial campaign. They needed high-resolution images with specific lighting setups to highlight the textures and details of their subjects in various environments.";
          solution = "We conducted a multi-day shoot using advanced lighting techniques. Post-production involved meticulous retouching, color correction, and compositing to achieve the desired mood. The final gallery provided a cohesive visual narrative for their campaign.";
          beforeImage = `https://picsum.photos/seed/photobefore${p.id}/800/600`;
          afterImage = `https://picsum.photos/seed/photoafter${p.id}/800/600`;
          galleryImages = [
            `https://picsum.photos/seed/photo1${p.id}/800/800`,
            `https://picsum.photos/seed/photo2${p.id}/800/800`,
            `https://picsum.photos/seed/photo3${p.id}/800/800`,
            `https://picsum.photos/seed/photo4${p.id}/800/800`
          ];
        } else if (isWeb) {
          clientRequest = "The client approached us with a vision to modernize their digital presence. They needed a solution that would not only look visually stunning but also improve user engagement and conversion rates. The main challenge was to keep their existing brand identity while giving it a fresh, modern twist.";
          solution = "We designed a comprehensive digital strategy, starting with a complete UI/UX overhaul. By introducing a modern design system, fluid animations, and a responsive layout, we transformed their platform into an immersive experience. We also optimized the performance to ensure fast loading times across all devices.";
          content = `
            <h2>The Challenge</h2>
            <p>The client approached us with an outdated website that was suffering from high bounce rates and low conversion. Their primary goals were to:</p>
            <ul>
              <li>Modernize the visual identity while retaining brand recognition.</li>
              <li>Improve the user experience (UX) to guide visitors towards key conversion points.</li>
              <li>Ensure the website is fully responsive and performs well on mobile devices.</li>
              <li>Implement a robust Content Management System (CMS) for easy updates.</li>
            </ul>
            <p>The main challenge was balancing a highly creative, visually engaging design with strict performance requirements and accessibility standards.</p>
            
            <h2>Our Approach & Solution</h2>
            <p>We started with a deep dive into their user analytics to identify the main drop-off points. Based on this data, we restructured the site architecture and created wireframes focused on a clear user journey.</p>
            <h3>1. Design System & UI</h3>
            <p>We developed a new design system featuring a refined color palette, modern typography, and custom iconography. We utilized subtle micro-interactions and smooth page transitions to create a premium feel without sacrificing performance.</p>
            <h3>2. Technical Implementation</h3>
            <p>The frontend was built using <strong>React</strong> and <strong>Tailwind CSS</strong>, allowing for rapid development and a highly customized UI. We implemented server-side rendering (SSR) to ensure optimal SEO performance and fast initial load times.</p>
            <h3>3. Results</h3>
            <p>Post-launch, the client saw significant improvements across all key metrics:</p>
            <ul>
              <li><strong>45% increase</strong> in mobile conversion rate.</li>
              <li><strong>60% reduction</strong> in average page load time.</li>
              <li><strong>30% decrease</strong> in bounce rate.</li>
            </ul>
            <p>You can view the live project <a href="#" target="_blank">here</a>.</p>
          `;
          beforeImage = `https://picsum.photos/seed/webbefore${p.id}/800/600`;
          afterImage = `https://picsum.photos/seed/webafter${p.id}/800/600`;
          galleryImages = [
            `https://picsum.photos/seed/web1${p.id}/800/800`,
            `https://picsum.photos/seed/web2${p.id}/800/800`,
            `https://picsum.photos/seed/web3${p.id}/800/800`,
            `https://picsum.photos/seed/web4${p.id}/800/800`
          ];
        } else {
          clientRequest = "The client needed a creative solution to elevate their project and stand out in their industry. They were looking for an innovative approach that combined aesthetics with functional design to achieve their specific goals.";
          solution = "We delivered a custom-tailored solution that addressed all their requirements. Through iterative design and close collaboration, we produced high-quality deliverables that exceeded their expectations and provided a strong foundation for their future growth.";
          beforeImage = `https://picsum.photos/seed/otherbefore${p.id}/800/600`;
          afterImage = `https://picsum.photos/seed/otherafter${p.id}/800/600`;
          galleryImages = [
            `https://picsum.photos/seed/other1${p.id}/800/800`,
            `https://picsum.photos/seed/other2${p.id}/800/800`
          ];
        }

        await updateDoc(doc(db, 'projects', p.id), {
          clientRequest,
          solution,
          content,
          beforeImage,
          afterImage,
          galleryImages
        });
      }
      alert('Sample details added to all projects successfully!');
    } catch (error: any) {
      console.error("Error adding sample details:", error);
      alert(`Failed to add sample details: ${error.message}`);
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
          <h1 className="text-3xl font-bold text-zinc-900">Projects</h1>
          <p className="text-zinc-500">Manage your portfolio works.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={populateSampleDetails}
            className="flex items-center px-4 sm:px-6 py-2 bg-white text-zinc-900 border border-zinc-200 rounded-full hover:bg-zinc-50 transition-colors text-xs sm:text-sm font-medium"
          >
            Add Sample Details
          </button>
          <button
            onClick={() => { setIsEditing(true); setCurrentProject({}); }}
            className="flex items-center px-4 sm:px-6 py-2 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-colors text-xs sm:text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Project
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
              className="relative bg-white rounded-3xl shadow-xl border border-zinc-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold">{currentProject.id ? 'Edit Project' : 'New Project'}</h2>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-zinc-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Title</label>
                    <input 
                      required
                      type="text" 
                      value={currentProject.title || ''} 
                      onChange={e => setCurrentProject({...currentProject, title: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Short Description</label>
                    <textarea 
                      required
                      value={currentProject.description || ''} 
                      onChange={e => setCurrentProject({...currentProject, description: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none h-24"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Detailed Content</label>
                    <div className="bg-white rounded-2xl overflow-hidden border border-zinc-200 focus-within:ring-2 focus-within:ring-zinc-900">
                      <ReactQuill 
                        theme="snow" 
                        value={currentProject.content || ''} 
                        onChange={content => setCurrentProject({...currentProject, content})}
                        className="h-48 mb-12"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Image URL</label>
                    <input 
                      type="url" 
                      value={currentProject.imageUrl || ''} 
                      onChange={e => setCurrentProject({...currentProject, imageUrl: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none"
                      placeholder="https://picsum.photos/seed/project/800/600"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Live Link</label>
                      <input 
                        type="url" 
                        value={currentProject.link || ''} 
                        onChange={e => setCurrentProject({...currentProject, link: e.target.value})}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">GitHub Link</label>
                      <input 
                        type="url" 
                        value={currentProject.github || ''} 
                        onChange={e => setCurrentProject({...currentProject, github: e.target.value})}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Client Request</label>
                    <textarea 
                      value={currentProject.clientRequest || ''} 
                      onChange={e => setCurrentProject({...currentProject, clientRequest: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none h-24"
                      placeholder="What did the client ask for?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Solution</label>
                    <textarea 
                      value={currentProject.solution || ''} 
                      onChange={e => setCurrentProject({...currentProject, solution: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none h-24"
                      placeholder="What was your solution?"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Before Image URL</label>
                      <input 
                        type="url" 
                        value={currentProject.beforeImage || ''} 
                        onChange={e => setCurrentProject({...currentProject, beforeImage: e.target.value})}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">After Image URL</label>
                      <input 
                        type="url" 
                        value={currentProject.afterImage || ''} 
                        onChange={e => setCurrentProject({...currentProject, afterImage: e.target.value})}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Gallery Images (comma separated URLs)</label>
                    <input 
                      type="text" 
                      value={Array.isArray(currentProject.galleryImages) ? currentProject.galleryImages.join(', ') : currentProject.galleryImages || ''} 
                      onChange={e => setCurrentProject({...currentProject, galleryImages: e.target.value.split(',').map(url => url.trim()).filter(Boolean)})}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none"
                      placeholder="https://image1.jpg, https://image2.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      value={Array.isArray(currentProject.tags) ? currentProject.tags.join(', ') : currentProject.tags || ''} 
                      onChange={e => setCurrentProject({...currentProject, tags: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none"
                      placeholder="React, Firebase, Tailwind"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Order</label>
                    <input 
                      type="number" 
                      value={currentProject.order || 0} 
                      onChange={e => setCurrentProject({...currentProject, order: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="submit" className="flex-grow flex items-center justify-center px-6 py-4 bg-zinc-900 text-white rounded-2xl font-semibold hover:bg-zinc-800 transition-all">
                    <Save className="w-5 h-5 mr-2" /> Save Project
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
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Project</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Order</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Tags</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
            {projects.map((project, index) => (
              <motion.tr 
                key={project.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-zinc-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 mr-4 overflow-hidden border border-zinc-200">
                      {project.imageUrl && <img src={project.imageUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />}
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-900">{project.title}</div>
                      <div className="text-xs text-zinc-400 truncate max-w-[200px]">{project.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-500 font-mono">{project.order}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {project.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                    {project.tags && project.tags.length > 2 && <span className="text-[10px] text-zinc-400">+{project.tags.length - 2}</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => { setIsEditing(true); setCurrentProject(project); }} className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(project.id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {projects.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-zinc-400 italic">No projects found. Add your first one!</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
