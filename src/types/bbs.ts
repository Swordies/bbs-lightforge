
import { Database } from "@/integrations/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type Reply = Database["public"]["Tables"]["replies"]["Row"];

export type PostWithAuthor = Post & {
  author: Profile;
};

export type ReplyWithAuthor = Reply & {
  author: Profile;
};

export type PostWithReplies = PostWithAuthor & {
  replies?: ReplyWithAuthor[];
};
