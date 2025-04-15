
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  cover_image?: string;
  created_at: string;
  updated_at?: string;
  published: boolean;
}

export interface BlogComment {
  id: string;
  post_id: string;
  name: string;
  email: string;
  content: string;
  created_at: string;
  approved: boolean;
}
