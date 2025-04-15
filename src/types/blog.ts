
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
