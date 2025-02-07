
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostWithReplies } from "@/types/bbs";
import { toast } from "@/hooks/use-toast";

export const usePostOperations = (user: { id: string } | null) => {
  const queryClient = useQueryClient();
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // Fetch posts with authors and replies
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles(*),
          replies(
            *,
            author:profiles(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return posts.map((post: PostWithReplies) => ({
        id: post.id,
        content: post.content,
        author: post.author.username,
        authorIcon: post.author.icon_url,
        createdAt: new Date(post.created_at),
        replies: post.replies?.map(reply => ({
          id: reply.id,
          content: reply.content,
          author: reply.author.username,
          authorIcon: reply.author.icon_url,
          createdAt: new Date(reply.created_at)
        }))
      }));
    }
  });

  // Create post mutation
  const createPost = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("Must be logged in to post");
      
      const { error } = await supabase
        .from('posts')
        .insert({
          content,
          author_id: user.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Success",
        description: "Post created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Edit post mutation
  const editPost = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      if (!user) throw new Error("Must be logged in to edit");
      
      const { error } = await supabase
        .from('posts')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setEditingPost(null);
      setEditContent("");
      toast({
        title: "Success",
        description: "Post updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete post mutation
  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Must be logged in to delete");
      
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    posts,
    isLoading,
    editingPost,
    editContent,
    setEditingPost,
    setEditContent,
    createPost,
    editPost,
    deletePost
  };
};
