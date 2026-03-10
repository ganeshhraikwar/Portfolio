import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const projectsData = [
  // Graphic Designing
  {
    title: "Minimalist Poster Series",
    description: "A series of minimalist posters exploring geometric shapes and bold typography.",
    tags: ["Graphic Designing", "Poster", "Minimalism"],
    imageUrl: "https://picsum.photos/seed/graphic1/1200/800"
  },
  {
    title: "Digital Illustration Pack",
    description: "Custom vector illustrations designed for a modern fintech application.",
    tags: ["Graphic Designing", "Illustration", "Vector"],
    imageUrl: "https://picsum.photos/seed/graphic2/1200/800"
  },
  {
    title: "Social Media Campaign",
    description: "Comprehensive social media kit for a summer fashion launch.",
    tags: ["Graphic Designing", "Social Media", "Marketing"],
    imageUrl: "https://picsum.photos/seed/graphic3/1200/800"
  },
  {
    title: "Magazine Layout Design",
    description: "Editorial design for an independent architecture and design magazine.",
    tags: ["Graphic Designing", "Editorial", "Layout"],
    imageUrl: "https://picsum.photos/seed/graphic4/1200/800"
  },

  // Video Editing
  {
    title: "Cinematic Travel Vlog",
    description: "High-energy travel montage with custom color grading and sound design.",
    tags: ["Video Editing", "Travel", "Cinematic"],
    imageUrl: "https://picsum.photos/seed/video1/1200/800"
  },
  {
    title: "Product Commercial - Tech",
    description: "A 30-second commercial spot for a new smartphone release.",
    tags: ["Video Editing", "Commercial", "Tech"],
    imageUrl: "https://picsum.photos/seed/video2/1200/800"
  },
  {
    title: "Music Video - Urban Vibes",
    description: "Dynamic music video editing with rhythmic cuts and visual effects.",
    tags: ["Video Editing", "Music Video", "Urban"],
    imageUrl: "https://picsum.photos/seed/video3/1200/800"
  },
  {
    title: "Short Film - The Silent City",
    description: "Narrative short film editing focusing on atmosphere and pacing.",
    tags: ["Video Editing", "Short Film", "Storytelling"],
    imageUrl: "https://picsum.photos/seed/video4/1200/800"
  },

  // Web Designing
  {
    title: "Luxury Watch E-commerce",
    description: "High-end e-commerce experience with a focus on product storytelling.",
    tags: ["Web Designing", "E-commerce", "UI/UX"],
    imageUrl: "https://picsum.photos/seed/web1/1200/800"
  },
  {
    title: "Creative Agency Portfolio",
    description: "Interactive portfolio site for a boutique design studio.",
    tags: ["Web Designing", "Portfolio", "Interaction"],
    imageUrl: "https://picsum.photos/seed/web2/1200/800"
  },
  {
    title: "SaaS Landing Page",
    description: "Conversion-optimized landing page for a cloud-based productivity tool.",
    tags: ["Web Designing", "SaaS", "Landing Page"],
    imageUrl: "https://picsum.photos/seed/web3/1200/800"
  },
  {
    title: "Food Delivery App UI",
    description: "Mobile-first user interface design for a local food delivery service.",
    tags: ["Web Designing", "Mobile", "App Design"],
    imageUrl: "https://picsum.photos/seed/web4/1200/800"
  },

  // Brand Design
  {
    title: "Coffee House Branding",
    description: "Complete visual identity including logo, packaging, and interior signage.",
    tags: ["Brand Design", "Identity", "Packaging"],
    imageUrl: "https://picsum.photos/seed/brand1/1200/800"
  },
  {
    title: "Tech Startup Identity",
    description: "Modern and scalable branding system for a Silicon Valley startup.",
    tags: ["Brand Design", "Logo", "Startup"],
    imageUrl: "https://picsum.photos/seed/brand2/1200/800"
  },
  {
    title: "Eco-Friendly Packaging",
    description: "Sustainable packaging design for a range of organic skincare products.",
    tags: ["Brand Design", "Sustainability", "Packaging"],
    imageUrl: "https://picsum.photos/seed/brand3/1200/800"
  },
  {
    title: "Fashion Label Guidelines",
    description: "Comprehensive brand book and visual guidelines for a luxury fashion house.",
    tags: ["Brand Design", "Guidelines", "Fashion"],
    imageUrl: "https://picsum.photos/seed/brand4/1200/800"
  },

  // Photography
  {
    title: "Urban Street Life",
    description: "A collection of candid street photography capturing the essence of city life.",
    tags: ["Photography", "Street", "Urban"],
    imageUrl: "https://picsum.photos/seed/photo1/1200/800"
  },
  {
    title: "Mountain Landscapes",
    description: "Breathtaking landscape photography from the heart of the Himalayas.",
    tags: ["Photography", "Landscape", "Nature"],
    imageUrl: "https://picsum.photos/seed/photo2/1200/800"
  },
  {
    title: "Portrait Study - Shadows",
    description: "Experimental portrait photography exploring light and shadow.",
    tags: ["Photography", "Portrait", "Studio"],
    imageUrl: "https://picsum.photos/seed/photo3/1200/800"
  },
  {
    title: "Night Sky Long Exposure",
    description: "Astrophotography series capturing the beauty of the Milky Way.",
    tags: ["Photography", "Astrophotography", "Night"],
    imageUrl: "https://picsum.photos/seed/photo4/1200/800"
  }
];

const reviewsData = [
  {
    name: "Alex Johnson",
    role: "CEO, TechFlow",
    content: "Working with this studio was a game-changer for our brand. The attention to detail in the web design and branding was exceptional.",
    rating: 5,
    avatarUrl: "https://i.pravatar.cc/150?u=alex",
    approved: true
  },
  {
    name: "Sarah Miller",
    role: "Marketing Director, EcoStyle",
    content: "The video editing quality is top-notch. They captured our brand's voice perfectly in the commercial spot.",
    rating: 5,
    avatarUrl: "https://i.pravatar.cc/150?u=sarah",
    approved: true
  },
  {
    name: "David Chen",
    role: "Founder, Urban Eats",
    content: "Highly professional and creative. The photography for our menu launch was stunning and really helped our sales.",
    rating: 4,
    avatarUrl: "https://i.pravatar.cc/150?u=david",
    approved: true
  }
];

export const seedProjects = async () => {
  const projectsCol = collection(db, 'projects');
  const reviewsCol = collection(db, 'reviews');

  const projectPromises = projectsData.map((project, index) => 
    addDoc(projectsCol, {
      ...project,
      order: index,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  );

  const reviewPromises = reviewsData.map(review => 
    addDoc(reviewsCol, {
      ...review,
      createdAt: serverTimestamp()
    })
  );

  await Promise.all([...projectPromises, ...reviewPromises]);
};
