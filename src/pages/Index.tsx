
import { useAuth } from "@/hooks/useAuth";
import { PostList } from "@/components/bbs/PostList";
import { PostForm } from "@/components/bbs/PostForm";
import { usePostManagement } from "@/hooks/usePostManagement";

const initialPosts = [
  {
    id: "welcome",
    content: "Welcome to ASCII BBS! This is a minimalist bulletin board system where you can share your thoughts and connect with others. Feel free to register and join the conversation!",
    author: "Admin",
    authorIcon: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop",
    createdAt: new Date("2024-01-01T12:00:00"),
    replies: [
      {
        id: "welcome-reply",
        content: "Thanks for creating this space! The retro aesthetic brings back memories of the early internet days.",
        author: "RetroFan",
        authorIcon: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=100&h=100&fit=crop",
        createdAt: new Date("2024-01-01T12:30:00"),
      },
    ],
  },
];

const Index = () => {
  const { user } = useAuth();
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
  } = usePostManagement(initialPosts);

  return (
    <div className="space-y-4 max-w-5xl mx-auto px-2">
      {user && (
        <PostForm
          newPost={newPost}
          setNewPost={setNewPost}
          handlePost={() => handlePost(user)}
        />
      )}

      <PostList
        posts={posts}
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
        handleReply={(id) => handleReply(id, user)}
      />
    </div>
  );
};

export default Index;
