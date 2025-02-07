
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PostContainer } from "@/components/bbs/PostContainer";
import { PostForm } from "@/components/bbs/PostForm";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface Post {
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

const WelcomeMessage = () => (
  <div className="bbs-card fade-in">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        <img
          src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop"
          alt="ASCII BBS"
          className="w-[100px] h-[100px] rounded-none border border-primary/50 object-cover"
        />
        <div className="text-sm mt-2 text-center font-bold px-2 py-1 border border-primary/50">
          ASCII BBS
        </div>
      </div>
      <div className="flex-1">
        <div className="speech-bubble">
          <div className="text-sm text-muted-foreground border border-primary/20 px-2 inline-block mb-4">
            {new Date().toLocaleString()}
          </div>
          <div className="mb-4 [&_strong]:font-bold [&_em]:italic [&_s]:line-through [&_br]:block">
            <strong>Welcome to ASCII BBS!</strong><br /><br />
            This is a <em>minimalist</em> bulletin board system where you can:
            <br />- Share your thoughts
            <br />- Connect with others
            <br />- Use <strong>text formatting</strong>
            <br /><br />
            Feel free to register and join the conversation!
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Index = () => {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState("");
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  // Add handler functions
  const handleEdit = async (id: string) => {
    const post = posts.find(p => p.id === id);
    if (post) {
      setEditingPost(id);
      setEditContent(post.content);
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
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error deleting post",
        description: error instanceof Error ? error.message : "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ content: editContent })
        .eq('id', id);

      if (error) throw error;

      setEditingPost(null);
      setEditContent("");
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Post updated",
        description: "Your post has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error updating post",
        description: error instanceof Error ? error.message : "Failed to update post",
        variant: "destructive",
      });
    }
  };

  const handleReply = async (postId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('replies')
        .insert({
          content: replyContent,
          post_id: postId,
          author_id: user.id
        });

      if (error) throw error;

      setReplyingTo(null);
      setReplyContent("");
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Reply added",
        description: "Your reply has been posted successfully.",
      });
    } catch (error) {
      console.error('Error creating reply:', error);
      toast({
        title: "Error posting reply",
        description: error instanceof Error ? error.message : "Failed to post reply",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading posts: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center animate-pulse">Loading posts...</div>;
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto px-2">
      {user && (
        <PostForm
          newPost={newPost}
          setNewPost={setNewPost}
          handlePost={async () => {
            try {
              const { error } = await supabase
                .from('posts')
                .insert({
                  content: newPost,
                  author_id: user.id
                });

              if (error) throw error;

              setNewPost("");
              queryClient.invalidateQueries({ queryKey: ['posts'] });
              toast({
                title: "Post created",
                description: "Your post has been published successfully.",
              });
            } catch (error) {
              console.error('Error creating post:', error);
              toast({
                title: "Error creating post",
                description: error instanceof Error ? error.message : "Failed to create post",
                variant: "destructive",
              });
            }
          }}
        />
      )}

      <div className="space-y-6">
        {posts.length === 0 ? (
          <WelcomeMessage />
        ) : (
          posts.map((post) => (
            <PostContainer
              key={post.id}
              post={{
                ...post,
                author: post.author.username,
                authorIcon: post.author.icon_url,
                createdAt: new Date(post.created_at),
                replies: post.replies?.map(reply => ({
                  ...reply,
                  author: reply.author.username,
                  authorIcon: reply.author.icon_url,
                  createdAt: new Date(reply.created_at)
                }))
              }}
              user={user}
              editingPost={editingPost}
              editContent={editContent}
              replyingTo={replyingTo}
              replyContent={replyContent}
              setEditContent={setEditContent}
              setReplyContent={setReplyContent}
              setReplyingTo={setReplyingTo}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleSaveEdit={handleSaveEdit}
              handleReply={handleReply}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Index;
