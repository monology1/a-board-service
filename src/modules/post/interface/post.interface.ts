export interface Post {
  id: number;
  author: string;
  category: string;
  title: string;
  excerpt: string;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}