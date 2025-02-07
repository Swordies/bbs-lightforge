
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PostContainer } from "@/components/bbs/PostContainer";
import { PostForm } from "@/components/bbs/PostForm";
import { ChannelHeader } from "@/components/bbs/ChannelHeader";
import { useChannelPosts } from "@/hooks/useChannelPosts";
import { channels } from "@/constants/channels";
import { useEffect } from "react";

const Channel = () => {
  const { channelId } = useParams();
  const { hash } = useLocation();
  const { user } = useAuth();
  const channel = channels[channelId as keyof typeof channels];
  
  const {
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
  } = useChannelPosts(channelId || '');

  // Handle permalink scrolling
  useEffect(() => {
    if (hash) {
      const postId = hash.slice(1); // Remove the # from the hash
      const element = document.getElementById(postId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Add a temporary highlight effect
        element.classList.add('highlight-post');
        setTimeout(() => {
          element.classList.remove('highlight-post');
        }, 2000);
      }
    }
  }, [hash, posts]);

  if (!channel) {
    return <div>Channel not found</div>;
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto px-2">
      <ChannelHeader channelId={channelId || ''} />

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
