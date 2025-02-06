
import { memo } from "react";
import { Post } from "./Post";

interface PostListProps {
  posts: Array<{
    id: string;
    content: string;
    author: string;
    authorIcon?: string;
    createdAt: Date;
    replies?: Array<{
      id: string;
      content: string;
      author: string;
      authorIcon?: string;
      createdAt: Date;
    }>;
  }>;
  user: { username: string } | null;
  editingPost: string | null;
  editContent: string;
  replyingTo: string | null;
  replyContent: string;
  setEditContent: (content: string) => void;
  setReplyContent: (content: string) => void;
  setReplyingTo: (id: string | null) => void;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  handleSaveEdit: (id: string) => void;
  handleReply: (id: string) => void;
}

export const PostList = memo(({
  posts,
  user,
  editingPost,
  editContent,
  replyingTo,
  replyContent,
  setEditContent,
  setReplyContent,
  setReplyingTo,
  handleEdit,
  handleDelete,
  handleSaveEdit,
  handleReply,
}: PostListProps) => {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Post
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
  );
});

PostList.displayName = "PostList";
