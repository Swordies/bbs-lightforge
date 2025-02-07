
export interface Post {
  id: string;
  content: string;
  author: string;
  authorIcon?: string;
  createdAt: Date;
  editedAt?: Date;
  replies?: Post[];
}

