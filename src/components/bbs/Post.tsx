
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PostAuthor } from "./PostAuthor";
import { PostContent } from "./PostContent";
import { Reply } from "./Reply";

interface PostProps {
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
}

export const Post = ({
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
}: PostProps) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = () => {
      if (deleteConfirmId) {
        setDeleteConfirmId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [deleteConfirmId]);

  const handlePermalink = (postId: string) => {
    navigate(`/thread/${postId}`);
  };

  const handleDeleteClick = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleteConfirmId === postId) {
      handleDelete(postId);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(postId);
    }
  };

  return (
    <div className="space-y-2">
      <div className="bbs-card fade-in">
        <div className="flex items-start gap-4">
          <PostAuthor author={post.author} authorIcon={post.authorIcon} />
          <PostContent
            post={post}
            user={user}
            editingPost={editingPost}
            editContent={editContent}
            replyingTo={replyingTo}
            replyContent={replyContent}
            deleteConfirmId={deleteConfirmId}
            setEditContent={setEditContent}
            setReplyContent={setReplyContent}
            setReplyingTo={setReplyingTo}
            handleEdit={handleEdit}
            handleDeleteClick={handleDeleteClick}
            handleSaveEdit={handleSaveEdit}
            handleReply={handleReply}
            handlePermalink={handlePermalink}
          />
        </div>
      </div>

      {post.replies && post.replies.length > 0 && (
        <div className="pl-8 space-y-2">
          {post.replies.map((reply) => (
            <Reply key={reply.id} reply={reply} />
          ))}
        </div>
      )}
    </div>
  );
};
