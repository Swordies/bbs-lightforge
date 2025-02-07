
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Post {
  id: string;
  content: string;
  author: {
    username: string;
    icon_url?: string;
  };
  author_id: string;
  created_at: string;
  replies?: Post[];
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles!posts_author_id_fkey(username, icon_url),
      replies:replies(
        *,
        author:profiles!replies_author_id_fkey(username, icon_url)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const usePosts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error loading posts",
          description: error.message || "Failed to load posts",
          variant: "destructive",
        });
      }
    }
  });

  const handleCreatePost = async (content: string, userId: string) => {
    const { error } = await supabase
      .from('posts')
      .insert({
        content,
        author_id: userId
      });

    if (error) {
      toast({
        title: "Error creating post",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    await queryClient.invalidateQueries({ queryKey: ['posts'] });
    toast({
      title: "Post created",
      description: "Your post has been published successfully.",
    });
    return true;
  };

  const handleEdit = async (id: string, content: string) => {
    const { error } = await supabase
      .from('posts')
      .update({ content })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error updating post",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    await queryClient.invalidateQueries({ queryKey: ['posts'] });
    toast({
      title: "Post updated",
      description: "Your post has been updated successfully.",
    });
    return true;
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error deleting post",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    await queryClient.invalidateQueries({ queryKey: ['posts'] });
    toast({
      title: "Post deleted",
      description: "Your post has been deleted successfully.",
    });
    return true;
  };

  const handleReply = async (postId: string, content: string, userId: string) => {
    const { error } = await supabase
      .from('replies')
      .insert({
        content,
        post_id: postId,
        author_id: userId
      });

    if (error) {
      toast({
        title: "Error posting reply",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    await queryClient.invalidateQueries({ queryKey: ['posts'] });
    toast({
      title: "Reply added",
      description: "Your reply has been posted successfully.",
    });
    return true;
  };

  return {
    posts,
    isLoading,
    error,
    handleCreatePost,
    handleEdit,
    handleDelete,
    handleReply
  };
};
