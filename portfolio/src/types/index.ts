export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  link?: string;
  github?: string;
}

export interface Handle {
  id: string;
  platform: string;
  username: string;
  url: string;
  iconUrl?: string; // Auto-fetched if possible
}

export interface NewsTopic {
  id: string;
  topic: string;
}

export interface Guide {
  id: string;
  name: string;
  url: string;
  logoUrl?: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  address?: string;
}

export interface UserProfile {
  name: string;
  bio: string;
  avatarUrl: string;
  role: 'admin' | 'user';
}
