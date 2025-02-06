
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Post } from "@/components/bbs/Post";
import { PostForm } from "@/components/bbs/PostForm";

interface Post {
  id: string;
  content: string;
  author: string;
  authorIcon?: string;
  createdAt: Date;
  replies?: Post[];
}

const Index = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "welcome",
      content: "Welcome to ASCII BBS! This is a minimalist bulletin board system where you can share your thoughts and connect with others. Feel free to register and join the conversation!",
      author: "Admin",
      authorIcon: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop",
      createdAt: new Date("2024-01-01T12:00:00"),
      replies: [
        {
          id: "welcome-reply",
          content: "Thanks for creating this space! The retro aesthetic brings back memories of the early internet days.",
          author: "RetroFan",
          authorIcon: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=100&h=100&fit=crop",
          createdAt: new Date("2024-01-01T12:30:00"),
        },
      ],
    },
  ]);
  const [newPost, setNewPost] = useState("");
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handlePost = () => {
    if (!user || !newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      content: newPost,
      author: user.username,
      authorIcon: user.iconUrl,
      createdAt: new Date(),
      replies: [],
    };

    setPosts([post, ...posts]);
    setNewPost("");
  };

  const handleEdit = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setEditingPost(postId);
      setEditContent(post.content);
    }
  };

  const handleSaveEdit = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, content: editContent } : post
      )
    );
    setEditingPost(null);
    setEditContent("");
  };

  const handleDelete = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleReply = (postId: string) => {
    if (!user || !replyContent.trim()) return;

    const reply: Post = {
      id: Date.now().toString(),
      content: replyContent,
      author: user.username,
      authorIcon: user.iconUrl,
      createdAt: new Date(),
    };

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, replies: [...(post.replies || []), reply] }
          : post
      )
    );
    setReplyingTo(null);
    setReplyContent("");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4">
      {user && (
        <PostForm
          newPost={newPost}
          setNewPost={setNewPost}
          handlePost={handlePost}
        />
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
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
        ))}
      </div>
    </div>
  );
};

export default Index;
