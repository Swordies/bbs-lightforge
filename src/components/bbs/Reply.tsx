
import { memo, useState, useCallback } from "react";
import { MessageSquare, Edit2, Trash2 } from "lucide-react";
import { formatText } from "@/lib/formatText";
import { Button } from "@/components/ui/button";
import { PostForm } from "./PostForm";
import { getContrastColor } from "@/lib/colorUtils";

interface ReplyProps {
  reply: {
    id: string;
    content: string;
    author: string;
    authorIcon?: string;
    createdAt: Date;
    editedAt?: Date;
  };
  user: { username: string; usernameBoxColor?: string; } | null;
  postId: string;
  onEdit: (postId: string, replyId: string, newContent: string) => void;
  onDelete: (postId: string, replyId: string) => void;
}

export const Reply = memo(({ reply, user, postId, onEdit, onDelete }: ReplyProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditContent(reply.content);
  }, [reply.content]);

  const handleSaveEdit = useCallback(() => {
    onEdit(postId, reply.id, editContent);
    setIsEditing(false);
  }, [postId, reply.id, editContent, onEdit]);

  const handleDeleteClick = useCallback((replyId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (deleteConfirmId === replyId) {
      onDelete(postId, replyId);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(replyId);
    }
  }, [deleteConfirmId, postId, onDelete]);

  return (
    <div className="bbs-card fade-in">
      <div className="flex items-start gap-4 flex-row-reverse">
        <div className="flex-shrink-0">
          {reply.authorIcon ? (
            <img
              src={reply.authorIcon}
              alt={reply.author}
              className="w-[100px] h-[100px] rounded-none border border-primary/50 object-cover"
              loading="lazy"
            />
          ) : (
            <MessageSquare className="w-[100px] h-[100px]" />
          )}
          <div 
            className="text-sm mt-2 text-center font-bold px-2 py-1 border border-primary/50"
            style={{
              backgroundColor: user?.username === reply.author && user?.usernameBoxColor ? user.usernameBoxColor : '#1A1F2C',
              color: user?.username === reply.author && user?.usernameBoxColor ? getContrastColor(user.usernameBoxColor) : '#ffffff'
            }}
          >
            {reply.author}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="speech-bubble speech-bubble-right">
            <div className="text-sm text-muted-foreground">
              <span className="border border-primary/20 px-2 inline-block">
                {reply.createdAt.toLocaleString()}
              </span>
              {reply.editedAt && (
                <span className="ml-2 border border-primary/20 px-2 inline-block">
                  Edited on {reply.editedAt.toLocaleString()}
                </span>
              )}
            </div>
            
            {isEditing ? (
              <PostForm
                newPost={editContent}
                setNewPost={setEditContent}
                handlePost={handleSaveEdit}
                isEditing={true}
              />
            ) : (
              <>
                <div 
                  className="mb-4 [&_strong]:font-bold [&_em]:italic [&_s]:line-through [&_br]:block"
                  dangerouslySetInnerHTML={{ __html: formatText(reply.content) }} 
                />
                {user && user.username === reply.author && (
                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEdit}
                      className="bbs-button hover:bg-[#1A1F2C] hover:text-white"
                    >
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteClick(reply.id, e)}
                      className={`bbs-button hover:bg-[#1A1F2C] hover:text-white ${
                        deleteConfirmId === reply.id ? 'bg-red-500/80 text-white hover:bg-red-600' : ''
                      }`}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

Reply.displayName = "Reply";
