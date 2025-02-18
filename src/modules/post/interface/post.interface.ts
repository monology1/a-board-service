export interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  author: string;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  excerpt?: string | null;
  commentsCount: number;
  comments?: Comment[];
}