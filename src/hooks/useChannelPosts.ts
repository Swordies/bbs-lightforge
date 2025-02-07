
import { useState } from "react";
import { Post } from "@/types/channel";
import { useAuth } from "@/hooks/useAuth";

const generateRandomId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 15; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const useChannelPosts = (channelId: string) => {
  const { user, getChannelPosts, savePosts } = useAuth();
  const [posts, setPosts] = useState<Post[]>(getChannelPosts(channelId));
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

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    savePosts(channelId, updatedPosts);
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
    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, content: editContent } : post
    );
    setPosts(updatedPosts);
    savePosts(channelId, updatedPosts);
    setEditingPost(null);
    setEditContent("");
  };

  const handleDelete = (postId: string) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
    savePosts(channelId, updatedPosts);
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

    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? { ...post, replies: [...(post.replies || []), reply] }
        : post
    );
    setPosts(updatedPosts);
    savePosts(channelId, updatedPosts);
    setReplyingTo(null);
    setReplyContent("");
  };

  const handleEditReply = (postId: string, replyId: string, newContent: string) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId && post.replies) {
        return {
          ...post,
          replies: post.replies.map((reply) =>
            reply.id === replyId ? { ...reply, content: newContent } : reply
          ),
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    savePosts(channelId, updatedPosts);
  };

  const handleDeleteReply = (postId: string, replyId: string) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId && post.replies) {
        return {
          ...post,
          replies: post.replies.filter((reply) => reply.id !== replyId),
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    savePosts(channelId, updatedPosts);
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
    handleEditReply,
    handleDeleteReply,
  };
};

