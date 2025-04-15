
import type { Tables } from "@/integrations/supabase/types";

export type Author = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

export type BlogPost = Tables<'blogs'> & {
  author?: Author;
};

// For backwards compatibility with BlogPreview component
export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with React',
    excerpt: 'Learn the basics of React and how to build your first component.',
    content: 'Content goes here...',
    cover_image: 'https://placeimg.com/800/450/tech/1',
    author_id: 'author-1',
    published: true,
    premium: false,
    price: 0,
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z',
    author: {
      id: 'author-1',
      username: 'reactdev',
      full_name: 'React Developer',
      avatar_url: null
    }
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    excerpt: 'Explore advanced TypeScript patterns for building scalable applications.',
    content: 'Content goes here...',
    cover_image: 'https://placeimg.com/800/450/tech/2',
    author_id: 'author-2',
    published: true,
    premium: false,
    price: 0,
    created_at: '2023-02-20T00:00:00Z',
    updated_at: '2023-02-20T00:00:00Z',
    author: {
      id: 'author-2',
      username: 'tsdev',
      full_name: 'TypeScript Expert',
      avatar_url: null
    }
  },
  {
    id: '3',
    title: 'Building with Tailwind CSS',
    excerpt: 'Learn how to use Tailwind CSS to create beautiful, responsive UIs.',
    content: 'Content goes here...',
    cover_image: 'https://placeimg.com/800/450/tech/3',
    author_id: 'author-3',
    published: true,
    premium: false,
    price: 0,
    created_at: '2023-03-10T00:00:00Z',
    updated_at: '2023-03-10T00:00:00Z',
    author: {
      id: 'author-3',
      username: 'cssmaster',
      full_name: 'CSS Master',
      avatar_url: null
    }
  }
];

// For backwards compatibility with AdminBlog component
export type BlogComment = {
  id: string;
  post_id: string;
  user_id: string;
  name: string;
  email: string;
  content: string;
  approved: boolean;
  created_at: string;
};

export const mockComments: BlogComment[] = [
  {
    id: '1',
    post_id: '1',
    user_id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    content: 'Great article! Really helped me understand React better.',
    approved: true,
    created_at: '2023-01-16T12:30:00Z'
  },
  {
    id: '2',
    post_id: '1',
    user_id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    content: 'I have a question about hooks. Can you explain useEffect more?',
    approved: true,
    created_at: '2023-01-17T09:15:00Z'
  }
];
