
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PostContainer } from "@/components/bbs/PostContainer";
import { PostForm } from "@/components/bbs/PostForm";
import { WelcomeMessage } from "@/components/bbs/WelcomeMessage";
import { usePosts } from "@/hooks/usePosts";

const Index = () => {
  const { user } = useAuth();
  const { posts, isLoading, error, handleCreatePost, handleEdit, handleDelete, handleReply } = usePosts();
  const [newPost, setNewPost] = useState("");
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handlePostEdit = async (id: string) => {
    const post = posts.find(p => p.id === id);
    if (post) {
      setEditingPost(id);
      setEditContent(post.content);
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (await handleEdit(id, editContent)) {
      setEditingPost(null);
      setEditContent("");
    }
  };

  const handlePostReply = async (postId: string) => {
    if (!user) return;
    if (await handleReply(postId, replyContent, user.id)) {
      setReplyingTo(null);
      setReplyContent("");
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading posts: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center animate-pulse">Loading posts...</div>;
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto px-2">
      {user && (
        <PostForm
          newPost={newPost}
          setNewPost={setNewPost}
          handlePost={async () => {
            if (await handleCreatePost(newPost, user.id)) {
              setNewPost("");
            }
          }}
        />
      )}

      <div className="space-y-6">
        {posts.length === 0 ? (
          <WelcomeMessage />
        ) : (
          posts.map((post) => (
            <PostContainer
              key={post.id}
              post={{
                ...post,
                author: post.author.username,
                authorIcon: post.author.icon_url,
                createdAt: new Date(post.created_at),
                replies: post.replies?.map(reply => ({
                  ...reply,
                  author: reply.author.username,
                  authorIcon: reply.author.icon_url,
                  createdAt: new Date(reply.created_at)
                }))
              }}
              user={user}
              editingPost={editingPost}
              editContent={editContent}
              replyingTo={replyingTo}
              replyContent={replyContent}
              setEditContent={setEditContent}
              setReplyContent={setReplyContent}
              setReplyingTo={setReplyingTo}
              handleEdit={handlePostEdit}
              handleDelete={handleDelete}
              handleSaveEdit={handleSaveEdit}
              handleReply={handlePostReply}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Index;
