
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PostContainer } from "@/components/bbs/PostContainer";
import { PostForm } from "@/components/bbs/PostForm";

interface Post {
  id: string;
  content: string;
  author: string;
  authorIcon?: string;
  createdAt: Date;
  replies?: Post[];
}

const generateRandomId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 15; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const Index = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "xK9nM2pQ5vR8sT3",
      content: "Welcome to **ASCII BBS**!\n\nThis is a _minimalist_ bulletin board system where you can:\n- Share your thoughts\n- Connect with others\n- Use __text formatting__\n\nFeel free to register and join the conversation!",
      author: "Admin",
      authorIcon: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop",
      createdAt: new Date("2024-01-01T12:00:00"),
      replies: [
        {
          id: "hJ4wL7yB9cN6mD1",
          content: "Thanks for creating this space! The **retro aesthetic** brings back _memories_ of the __early internet__ days.",
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
      id: generateRandomId(),
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
      id: generateRandomId(),
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
          <PostContainer
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

