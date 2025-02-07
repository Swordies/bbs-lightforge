
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PostContainer } from "@/components/bbs/PostContainer";
import { PostForm } from "@/components/bbs/PostForm";
import { channels } from "@/constants/channels";

const generateRandomId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 15; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

interface Post {
  id: string;
  content: string;
  author: string;
  authorIcon?: string;
  createdAt: Date;
  replies?: Post[];
}

const Channel = () => {
  const { channelId } = useParams();
  const { user, getChannelPosts, savePosts } = useAuth();
  const channel = channels[channelId as keyof typeof channels];
  
  const [posts, setPosts] = useState<Post[]>(getChannelPosts(channelId || ''));
  const [newPost, setNewPost] = useState("");
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  if (!channel) {
    return <div>Channel not found</div>;
  }

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
    savePosts(channelId || '', updatedPosts);
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
    savePosts(channelId || '', updatedPosts);
    setEditingPost(null);
    setEditContent("");
  };

  const handleDelete = (postId: string) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
    savePosts(channelId || '', updatedPosts);
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
    savePosts(channelId || '', updatedPosts);
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
    savePosts(channelId || '', updatedPosts);
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
    savePosts(channelId || '', updatedPosts);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto px-2">
      <div className="border-2 border-primary/50 p-4 mb-6">
        <div className="flex items-center gap-4">
          <img
            src={channel.image}
            alt={channel.title}
            className="w-16 h-16 object-cover border border-primary/50"
          />
          <div>
            <h1 className="text-2xl font-bold">{channel.title}</h1>
          </div>
        </div>
      </div>

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
            handleEditReply={handleEditReply}
            handleDeleteReply={handleDeleteReply}
          />
        ))}
      </div>
    </div>
  );
};

export default Channel;
