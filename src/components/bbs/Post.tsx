
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Edit2, Trash2, Reply as ReplyIcon } from "lucide-react";
import { Reply } from "./Reply";
import { ReplyForm } from "./ReplyForm";

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
  return (
    <div className="bbs-card fade-in">
      <div className="flex items-start gap-4">
        {post.authorIcon ? (
          <img
            src={post.authorIcon}
            alt={post.author}
            className="w-[100px] h-[100px] rounded-full object-cover"
          />
        ) : (
          <MessageSquare className="w-[100px] h-[100px]" />
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold">{post.author}</span>
            <span className="text-sm text-muted-foreground">
              {post.createdAt.toLocaleString()}
            </span>
          </div>

          {editingPost === post.id ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="bbs-input w-full"
              />
              <Button
                onClick={() => handleSaveEdit(post.id)}
                className="bbs-button"
              >
                Save
              </Button>
            </div>
          ) : (
            <p className="mb-4">{post.content}</p>
          )}

          {!editingPost && (
            <div className="flex items-center gap-2">
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(post.id)}
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
                  >
                    <Edit2 className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
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

          {post.replies && post.replies.length > 0 && (
            <div className="mt-4 space-y-4 pl-4 border-l border-border">
              {post.replies.map((reply) => (
                <Reply key={reply.id} reply={reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
