
import { useState } from "react";

interface Post {
  id: string;
  content: string;
  author: string;
  authorIcon?: string;
  createdAt: Date;
  replies?: Post[];
}

export const usePostManagement = (initialPosts: Post[]) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPost, setNewPost] = useState("");
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handlePost = (user: { username: string; iconUrl?: string } | null) => {
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

  const handleReply = (postId: string, user: { username: string; iconUrl?: string } | null) => {
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

  return {
    posts,
    newPost,
    editingPost,
    editContent,
    replyingTo,
    replyContent,
    setNewPost,
    setEditContent,
    setReplyContent,
    setReplyingTo,
    handlePost,
    handleEdit,
    handleDelete,
    handleSaveEdit,
    handleReply,
  };
};
