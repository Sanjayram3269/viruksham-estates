export type ProjectCategory = "RESIDENTIAL" | "PLOTS" | "CONSTRUCTION" | "COMMERCIAL";

export type ProjectStatus = "LIVE" | "ONGOING" | "COMPLETED" | "UPCOMING" | "SOLD_OUT";

export interface ProjectMedia {
  cover?: string;
  gallery?: string[];
  masterplan?: string;
  walkthrough?: string;
}

export interface ProjectCoordinates {
  lat: number;
  lng: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  location: string;
  description: string;
  overview?: string;
  highlights?: string[];
  amenities?: string[];
  media?: ProjectMedia;
  masterplan?: string;
  walkthrough?: string;
  pricing?: string;
  availability?: string;
  coordinates?: ProjectCoordinates;
}
