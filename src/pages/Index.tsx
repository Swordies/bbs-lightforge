
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PostContainer } from "@/components/bbs/PostContainer";
import { PostForm } from "@/components/bbs/PostForm";
import { usePostOperations } from "@/hooks/usePostOperations";
import { useReplyOperations } from "@/hooks/useReplyOperations";

const Index = () => {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState("");
  
  const {
    posts,
    isLoading,
    editingPost,
    editContent,
    setEditingPost,
    setEditContent,
    createPost,
    editPost,
    deletePost
  } = usePostOperations(user);

  const {
    replyingTo,
    replyContent,
    setReplyingTo,
    setReplyContent,
    createReply
  } = useReplyOperations(user);

  const handlePost = () => {
    if (!user || !newPost.trim()) return;
    createPost.mutate(newPost);
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
    editPost.mutate({ id: postId, content: editContent });
  };

  const handleDelete = (postId: string) => {
    deletePost.mutate(postId);
  };

  const handleReply = (postId: string) => {
    if (!user || !replyContent.trim()) return;
    createReply.mutate({ postId, content: replyContent });
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
