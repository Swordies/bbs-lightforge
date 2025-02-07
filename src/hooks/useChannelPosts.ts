
import { useCallback, useMemo, useState } from "react";
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
  const [posts, setPosts] = useState<Post[]>(() => getChannelPosts(channelId));
  const [newPost, setNewPost] = useState("");
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handlePost = useCallback(() => {
    if (!user || !newPost.trim()) return;

    const post: Post = {
      id: generateRandomId(),
      content: newPost,
      author: user.username,
      authorIcon: user.iconUrl,
      createdAt: new Date(),
      replies: [],
    };

    setPosts(prevPosts => [post, ...prevPosts]);
    savePosts(channelId, [post, ...posts]);
    setNewPost("");
  }, [user, newPost, channelId, posts, savePosts]);

  const handleEdit = useCallback((postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setEditingPost(postId);
      setEditContent(post.content);
    }
  }, [posts]);

  const handleSaveEdit = useCallback((postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post =>
        post.id === postId ? { ...post, content: editContent, editedAt: new Date() } : post
      )
    );
    savePosts(channelId, posts.map(post =>
      post.id === postId ? { ...post, content: editContent, editedAt: new Date() } : post
    ));
    setEditingPost(null);
    setEditContent("");
  }, [channelId, editContent, posts, savePosts]);

  const handleDelete = useCallback((postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    savePosts(channelId, posts.filter(post => post.id !== postId));
  }, [channelId, posts, savePosts]);

  const handleReply = useCallback((postId: string) => {
    if (!user || !replyContent.trim()) return;

    const reply: Post = {
      id: generateRandomId(),
      content: replyContent,
      author: user.username,
      authorIcon: user.iconUrl,
      createdAt: new Date(),
    };

    setPosts(prevPosts => prevPosts.map(post =>
      post.id === postId
        ? { ...post, replies: [...(post.replies || []), reply] }
        : post
    ));
    savePosts(channelId, posts.map(post =>
      post.id === postId
        ? { ...post, replies: [...(post.replies || []), reply] }
        : post
    ));
    setReplyingTo(null);
    setReplyContent("");
  }, [user, replyContent, channelId, posts, savePosts]);

  const handleEditReply = useCallback((postId: string, replyId: string, newContent: string) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId && post.replies) {
        return {
          ...post,
          replies: post.replies.map(reply =>
            reply.id === replyId ? { ...reply, content: newContent, editedAt: new Date() } : reply
          ),
        };
      }
      return post;
    }));
    savePosts(channelId, posts);
  }, [channelId, posts, savePosts]);

  const handleDeleteReply = useCallback((postId: string, replyId: string) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId && post.replies) {
        return {
          ...post,
          replies: post.replies.filter(reply => reply.id !== replyId),
        };
      }
      return post;
    }));
    savePosts(channelId, posts);
  }, [channelId, posts, savePosts]);

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
