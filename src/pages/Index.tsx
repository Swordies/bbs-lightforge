
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PostContainer } from "@/components/bbs/PostContainer";
import { PostForm } from "@/components/bbs/PostForm";
import { WelcomeMessage } from "@/components/bbs/WelcomeMessage";
import { usePosts } from "@/hooks/usePosts";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface EditingState {
  postId: string | null;
  content: string;
}

interface ReplyingState {
  postId: string | null;
  content: string;
}

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { posts, isLoading, error, handleCreatePost, handleEdit, handleDelete, handleReply } = usePosts();
  const [newPost, setNewPost] = useState("");
  const [editing, setEditing] = useState<EditingState>({ postId: null, content: "" });
  const [replying, setReplying] = useState<ReplyingState>({ postId: null, content: "" });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handlePostEdit = async (id: string) => {
    const post = posts.find(p => p.id === id);
    if (post) {
      setEditing({ postId: id, content: post.content });
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (editing.content.trim().length === 0) return;
    
    if (await handleEdit(id, editing.content)) {
      setEditing({ postId: null, content: "" });
    }
  };

  const handlePostReply = async (postId: string) => {
    if (!user) return;
    if (replying.content.trim().length === 0) return;
    
    if (await handleReply(postId, replying.content, user.id)) {
      setReplying({ postId: null, content: "" });
    }
  };

  if (!user) {
    return (
      <div className="text-center space-y-4">
        <p>Please log in to view and interact with posts.</p>
        <Button onClick={() => navigate("/auth")}>Go to Login</Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        {error instanceof Error ? error.message : "An error occurred while loading posts"}
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
            if (newPost.trim().length === 0) return;
            
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
              editingPost={editing.postId}
              editContent={editing.content}
              replyingTo={replying.postId}
              replyContent={replying.content}
              setEditContent={(content) => setEditing(prev => ({ ...prev, content }))}
              setReplyContent={(content) => setReplying(prev => ({ ...prev, content }))}
              setReplyingTo={(postId) => setReplying({ postId, content: "" })}
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
