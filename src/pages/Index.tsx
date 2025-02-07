
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Post } from "@/components/bbs/Post";
import { PostForm } from "@/components/bbs/PostForm";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface Post {
  id: string;
  content: string;
  author: {
    email: string;
    avatar_url?: string;
  };
  created_at: string;
  replies?: Post[];
}

const Index = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        content,
        created_at,
        author:author_id(
          email,
          raw_user_meta_data
        )
      `)
      .is('parent_id', null)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive",
      });
      return;
    }

    const postsWithReplies = await Promise.all(
      (data || []).map(async (post) => {
        const { data: replies } = await supabase
          .from('posts')
          .select(`
            id,
            content,
            created_at,
            author:author_id(
              email,
              raw_user_meta_data
            )
          `)
          .eq('parent_id', post.id)
          .order('created_at', { ascending: true });

        return {
          ...post,
          replies: replies || [],
          author: {
            email: post.author.email,
            avatar_url: post.author.raw_user_meta_data?.avatar_url,
          },
        };
      })
    );

    setPosts(postsWithReplies);
  };

  const handlePost = async () => {
    if (!user || !newPost.trim()) return;

    try {
      const { error } = await supabase.from('posts').insert({
        content: newPost,
        author_id: user.id,
      });

      if (error) throw error;

      setNewPost("");
      fetchPosts();
      toast({
        title: "Success",
        description: "Post created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setEditingPost(postId);
      setEditContent(post.content);
    }
  };

  const handleSaveEdit = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ content: editContent })
        .eq('id', postId);

      if (error) throw error;

      setEditingPost(null);
      setEditContent("");
      fetchPosts();
      toast({
        title: "Success",
        description: "Post updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      fetchPosts();
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handleReply = async (postId: string) => {
    if (!user || !replyContent.trim()) return;

    try {
      const { error } = await supabase.from('posts').insert({
        content: replyContent,
        author_id: user.id,
        parent_id: postId,
      });

      if (error) throw error;

      setReplyingTo(null);
      setReplyContent("");
      fetchPosts();
      toast({
        title: "Success",
        description: "Reply posted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply",
        variant: "destructive",
      });
    }
  };

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
        {posts.map((post) => (
          <Post
            key={post.id}
            post={{
              ...post,
              author: post.author.email,
              authorIcon: post.author.avatar_url,
              createdAt: new Date(post.created_at),
            }}
            user={user ? { username: user.email } : null}
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
        ))}
      </div>
    </div>
  );
};

export default Index;
