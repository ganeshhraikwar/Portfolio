export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface SocialLink {
  id: string;
  title: string;
  url: string;
  icon?: string; // e.g., 'instagram', 'github', 'linkedin', 'twitter'
  order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  content?: string;
  imageUrl?: string;
  tags?: string[];
  link?: string;
  github?: string;
  clientRequest?: string;
  solution?: string;
  beforeImage?: string;
  afterImage?: string;
  galleryImages?: string[];
  createdAt: any;
  updatedAt?: any;
  order?: number;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  about: string;
  email: string;
  avatarUrl: string;
  aboutImage?: string;
  skills?: string[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    dribbble?: string;
    behance?: string;
  };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: any;
}

export interface Review {
  id: string;
  name: string;
  role?: string;
  content: string;
  rating: number;
  avatarUrl?: string;
  approved: boolean;
  createdAt: any;
}
