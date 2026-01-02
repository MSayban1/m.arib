
export interface Profile {
  name: string;
  headlines: string[];
  intro: string;
  profilePic: string;
  experienceYears: number;
  clientsCompleted: number;
  email: string;
  linkedin: string;
  facebook: string;
  instagram: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  reviews?: Record<string, Review>;
}

export interface ClientWork {
  id: string;
  clientName: string;
  reviewText: string;
  image: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
}

export interface Feedback {
  id: string;
  name: string;
  rating: number;
  message: string;
  isVisible: boolean;
  date: string;
}

export interface HireRequest {
  id: string;
  serviceId: string;
  serviceTitle: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export interface Analytics {
  ip: string;
  page: string;
  timestamp: string;
}
