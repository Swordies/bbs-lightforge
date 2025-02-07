
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

const fetchPosts = async () => {
  console.log('Fetching posts...');
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

  if (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
  
  console.log('Posts fetched:', data);
  return data;
};

export const usePosts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    meta: {
      onError: (error: Error) => {
        console.error('Query error:', error);
        toast({
          title: "Error loading posts",
          description: error.message || "Failed to load posts",
          variant: "destructive",
        });
      }
    }
  });

  const handleCreatePost = async (content: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          content,
          author_id: userId
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error creating post",
        description: error instanceof Error ? error.message : "Failed to create post",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleEdit = async (id: string, content: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ content })
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Post updated",
        description: "Your post has been updated successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error updating post",
        description: error instanceof Error ? error.message : "Failed to update post",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Post deleted",
        description: "Your post has been deleted successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error deleting post",
        description: error instanceof Error ? error.message : "Failed to delete post",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleReply = async (postId: string, content: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('replies')
        .insert({
          content,
          post_id: postId,
          author_id: userId
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Reply added",
        description: "Your reply has been posted successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error creating reply:', error);
      toast({
        title: "Error posting reply",
        description: error instanceof Error ? error.message : "Failed to post reply",
        variant: "destructive",
      });
      return false;
    }
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
