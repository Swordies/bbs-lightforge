
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Edit2, Trash2, Reply as ReplyIcon } from "lucide-react";
import { Reply } from "./Reply";
import { ReplyForm } from "./ReplyForm";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    const handleClickOutside = () => {
      if (deleteConfirmId) {
        setDeleteConfirmId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [deleteConfirmId]);

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
    <div className="space-y-4">
      <div className="bbs-card fade-in">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-primary">
                {"["}
                {post.author}
                {"]"}
              </span>
              <span className="text-sm text-muted-foreground font-mono">
                {post.createdAt.toLocaleString()}
              </span>
            </div>

            {editingPost === post.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="bbs-input w-full font-mono"
                />
                <Button
                  onClick={() => handleSaveEdit(post.id)}
                  className="bbs-button font-mono"
                >
                  Save
                </Button>
              </div>
            ) : (
              <pre className="mb-4 whitespace-pre-wrap font-mono">{post.content}</pre>
            )}

            {!editingPost && (
              <div className="flex items-center gap-2">
                {user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(post.id)}
                    className="font-mono"
                  >
                    <ReplyIcon className="w-4 h-4 mr-1" /> Reply
                  </Button>
                )}
                {user && user.username === post.author && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(post.id)}
                      className="font-mono"
                    >
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant={deleteConfirmId === post.id ? "destructive" : "ghost"}
                      size="sm"
                      onClick={(e) => handleDeleteClick(post.id, e)}
                      className="font-mono"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </>
                )}
              </div>
            )}

            {replyingTo === post.id && !editingPost && (
              <ReplyForm
                replyContent={replyContent}
                setReplyContent={setReplyContent}
                handleReply={() => handleReply(post.id)}
                onCancel={() => setReplyingTo(null)}
              />
            )}
          </div>
          {post.authorIcon && (
            <img
              src={post.authorIcon}
              alt={post.author}
              className="w-[50px] h-[50px] object-cover border border-primary/50"
            />
          )}
        </div>
      </div>

      {post.replies && post.replies.length > 0 && (
        <div className="pl-8 space-y-4 border-l border-border/30">
          {post.replies.map((reply) => (
            <Reply key={reply.id} reply={reply} />
          ))}
        </div>
      )}
    </div>
  );
};
