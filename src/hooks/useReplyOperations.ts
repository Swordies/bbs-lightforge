
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export const useReplyOperations = (user: { id: string } | null) => {
  const queryClient = useQueryClient();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Create reply mutation
  const createReply = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      if (!user) throw new Error("Must be logged in to reply");
      
      const { error } = await supabase
        .from('replies')
        .insert({
          content,
          post_id: postId,
          author_id: user.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setReplyingTo(null);
      setReplyContent("");
      toast({
        title: "Success",
        description: "Reply posted successfully",
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
    replyingTo,
    replyContent,
    setReplyingTo,
    setReplyContent,
    createReply
  };
};
