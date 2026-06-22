export interface Project {
  id?: string;
  title: string;
  type: string;
  description: string;
  content: string;
  features: string[];
  challenges: string;
  results: string;
  demoUrl: string;
  githubUrl: string;
  images: string[];
  techStack: string[];
  category: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  readingTime: string;
  status: "draft" | "published";
  createdAt: string;
  publishedAt?: string;
  updatedAt: string;
}

export interface CaseStudy {
  id?: string;
  title: string;
  slug: string;
  client: string;
  description: string;
  problem: string;
  solution: string;
  process: string;
  results: string;
  lessons: string;
  coverImage: string;
  images: string[];
  techStack: string[];
  createdAt: string;
}

export interface Service {
  id?: string;
  title: string;
  icon: string;
  description: string;
  benefits: string[];
  techStack: string[];
  useCases: string[];
  order: number;
}

export interface Skill {
  id?: string;
  name: string;
  category: "Web Development" | "Mobile App Development" | "API / Backend" | "AI / Smart Integrations" | "Workflow Automation";
  level: number; // 0-100
  order: number;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  message: string;
  createdAt: string;
  status: "unread" | "read";
}

export interface SiteSettings {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  github: string;
}

export interface SeoSettings {
  id?: string;
  page: string;
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

export interface MediaItem {
  id?: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
}
