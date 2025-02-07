
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PostContainer } from "@/components/bbs/PostContainer";
import { PostForm } from "@/components/bbs/PostForm";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts
  });

  const handlePost = async () => {
    if (!user || !newPost.trim()) return;

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
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleEdit = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setEditingPost(postId);
      setEditContent(post.content);
    }
  };

  const handleSaveEdit = async (postId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('posts')
        .update({ content: editContent })
        .eq('id', postId)
        .eq('author_id', user.id);

      if (error) throw error;

      setEditingPost(null);
      setEditContent("");
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('author_id', user.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleReply = async (postId: string) => {
    if (!user || !replyContent.trim()) return;

    try {
      const { error } = await supabase
        .from('replies')
        .insert({
          content: replyContent,
          author_id: user.id,
          post_id: postId
        });

      if (error) throw error;

      setReplyingTo(null);
      setReplyContent("");
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading posts...</div>;
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto px-2">
      {user && (
        <PostForm
          newPost={newPost}
          setNewPost={setNewPost}
          handlePost={handlePost}
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
