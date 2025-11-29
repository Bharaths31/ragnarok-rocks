export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  link: string;
}

export interface NewsTopic {
  id: string;
  topic: string; // e.g., "Quantum Computing", "Indie Games"
  enabled: boolean;
}

export interface Guide {
  id: string;
  name: string;
  url: string;
  logoUrl: string;
}

export interface UserProfile {
  handles: { platform: string; url: string; icon?: string }[];
  contactEmail: string;
  bio: string;
}