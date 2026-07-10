export interface Hike {
  id: string;
  name: string;
  location: string;
  region: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Hard';
  duration: string;
  distance: string;
  maxElevation: number;
  bestSeason: string[];
  description: string;
  highlights: string[];
  image: string;
  gallery: string[];
  featured: boolean;
  price: number;
  groupSize: string;
  rating: number;
  reviewCount: number;
}

export interface Donation {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  category: 'environmental' | 'community' | 'infrastructure' | 'education';
  image: string;
  donorsCount: number;
  endDate?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  website: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  description: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: 'hikes' | 'nature' | 'community' | 'events';
  location?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Hike {
  id: string;
  name: string;
  location: string;
  region: string;

  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Hard';
  duration: string;
  distance: string;

  maxElevation: number;
  bestSeason: string[];

  description: string;
  highlights: string[];

  image: string;
  gallery: string[];

  featured: boolean;

  price: number;
  groupSize: string;

  rating: number;
  reviewCount: number;
}