
import { useCallback, useMemo, useState } from "react";
import { Post } from "@/types/channel";
import { useAuth } from "@/hooks/useAuth";

const generateRandomId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 15 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};

export const useChannelPosts = (channelId: string) => {
  const { user, getChannelPosts, savePosts } = useAuth();
  const [posts, setPosts] = useState<Post[]>(() => getChannelPosts(channelId));
  const [newPost, setNewPost] = useState("");
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Memoize posts array to prevent unnecessary re-renders
  const sortedPosts = useMemo(() => [...posts], [posts]);

  const handlePost = useCallback(() => {
    if (!user || !newPost.trim()) return;

    const post: Post = {
      id: generateRandomId(),
      content: newPost.trim(),
      author: user.username,
      authorIcon: user.iconUrl,
      createdAt: new Date(),
      replies: [],
    };

    setPosts(prevPosts => {
      const updatedPosts = [post, ...prevPosts];
      savePosts(channelId, updatedPosts);
      return updatedPosts;
    });
    setNewPost("");
  }, [user, newPost, channelId, savePosts]);

  const handleEdit = useCallback((postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setEditingPost(postId);
      setEditContent(post.content);
    }
  }, [posts]);

  const handleSaveEdit = useCallback((postId: string) => {
    if (!editContent.trim()) return;
    
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post =>
        post.id === postId ? { ...post, content: editContent.trim(), editedAt: new Date() } : post
      );
      savePosts(channelId, updatedPosts);
      return updatedPosts;
    });
    setEditingPost(null);
    setEditContent("");
  }, [channelId, editContent, savePosts]);

  const handleDelete = useCallback((postId: string) => {
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.filter(post => post.id !== postId);
      savePosts(channelId, updatedPosts);
      return updatedPosts;
    });
  }, [channelId, savePosts]);

  const handleReply = useCallback((postId: string) => {
    if (!user || !replyContent.trim()) return;

    const reply: Post = {
      id: generateRandomId(),
      content: replyContent.trim(),
      author: user.username,
      authorIcon: user.iconUrl,
      createdAt: new Date(),
    };

    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post =>
        post.id === postId
          ? { ...post, replies: [...(post.replies || []), reply] }
          : post
      );
      savePosts(channelId, updatedPosts);
      return updatedPosts;
    });
    setReplyingTo(null);
    setReplyContent("");
  }, [user, replyContent, channelId, savePosts]);

  const handleEditReply = useCallback((postId: string, replyId: string, newContent: string) => {
    if (!newContent.trim()) return;

    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post => {
        if (post.id === postId && post.replies) {
          return {
            ...post,
            replies: post.replies.map(reply =>
              reply.id === replyId ? { ...reply, content: newContent.trim(), editedAt: new Date() } : reply
            ),
          };
        }
        return post;
      });
      savePosts(channelId, updatedPosts);
      return updatedPosts;
    });
  }, [channelId, savePosts]);

  const handleDeleteReply = useCallback((postId: string, replyId: string) => {
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post => {
        if (post.id === postId && post.replies) {
          return {
            ...post,
            replies: post.replies.filter(reply => reply.id !== replyId),
          };
        }
        return post;
      });
      savePosts(channelId, updatedPosts);
      return updatedPosts;
    });
  }, [channelId, savePosts]);

  return {
    posts: sortedPosts,
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
