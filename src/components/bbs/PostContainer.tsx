
import { Reply } from "./Reply";
import { Post } from "./Post";

interface PostContainerProps {
  post: {
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
  };
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
  handleEditReply: (postId: string, replyId: string, newContent: string) => void;
  handleDeleteReply: (postId: string, replyId: string) => void;
}

export const PostContainer = ({
  post,
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
  handleEditReply,
  handleDeleteReply,
}: PostContainerProps) => {
  return (
    <div className="space-y-2">
      <Post
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

      {post.replies && post.replies.length > 0 && (
        <div className="pl-8 space-y-2">
          {post.replies.map((reply) => (
            <Reply 
              key={reply.id} 
              reply={reply} 
              user={user}
              postId={post.id}
              onEdit={handleEditReply}
              onDelete={handleDeleteReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};
