export type Book = {
  title: string;
  author?: string;
  genres?: string[];
  description?: string;
  coverUrl?: string;
  rating?: number;
  sentimentScore?: number;
  mood?: string[];
  pageCount?: number;
  publishedYear?: number;
};
