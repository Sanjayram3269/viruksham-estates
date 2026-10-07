export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface CompanyValue {
  id: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role?: string;
  quote: string;
  projectTitle?: string;
}
