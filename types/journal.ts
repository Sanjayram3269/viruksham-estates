export interface JournalAuthor {
  name: string;
  role?: string;
}

export interface JournalPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt: string;
  author: JournalAuthor;
  coverMedia?: string;
}
