
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

// Mock data to use until Supabase tables are properly set up
export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with React',
    content: '<p>React is a powerful JavaScript library for building user interfaces. This post explores the basics of React and how to get started with it.</p><p>React allows developers to create large web applications that can change data, without reloading the page. Its main purpose is to be fast, scalable, and simple.</p>',
    excerpt: 'A beginner-friendly introduction to React and its core concepts.',
    cover_image: 'https://images.unsplash.com/photo-1633356122102-3fe60d47b2d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    created_at: '2025-04-10T12:00:00Z',
    published: true
  },
  {
    id: '2',
    title: 'Advanced TypeScript Techniques',
    content: '<p>TypeScript adds static typing to JavaScript, making it more robust and maintainable. In this post, we\'ll explore some advanced TypeScript techniques.</p><p>We\'ll cover topics like generics, utility types, and conditional types that can make your code more type-safe and expressive.</p>',
    excerpt: 'Dive deeper into TypeScript with these advanced techniques and patterns.',
    cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    created_at: '2025-04-12T14:30:00Z',
    published: true
  },
  {
    id: '3',
    title: 'Building Responsive UIs with Tailwind CSS',
    content: '<p>Tailwind CSS is a utility-first CSS framework that makes it easy to build responsive user interfaces. This post explores how to use Tailwind effectively.</p><p>We\'ll look at responsive design principles, customizing your Tailwind setup, and creating reusable components.</p>',
    excerpt: 'Learn how to create beautiful, responsive interfaces using Tailwind CSS.',
    cover_image: 'https://images.unsplash.com/photo-1618788372246-79faff0c3742?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    created_at: '2025-04-14T09:15:00Z',
    published: true
  }
];

export const mockComments: BlogComment[] = [
  {
    id: '1',
    post_id: '1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    content: 'Great article! It helped me understand React much better.',
    created_at: '2025-04-11T10:30:00Z',
    approved: true
  },
  {
    id: '2',
    post_id: '2',
    name: 'John Smith',
    email: 'john.smith@example.com',
    content: 'TypeScript has changed how I write JavaScript. Thanks for the tips!',
    created_at: '2025-04-13T15:45:00Z',
    approved: true
  }
];
