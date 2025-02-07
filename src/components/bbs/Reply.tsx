
import { MessageSquare, Edit2, Trash2 } from "lucide-react";
import { formatText } from "@/lib/formatText";
import { Button } from "@/components/ui/button";
import { PostForm } from "./PostForm";

interface ReplyProps {
  reply: {
    id: string;
    content: string;
    author: string;
    authorIcon?: string;
    createdAt: Date;
  };
  user: { username: string } | null;
  postId: string;
  onEdit: (postId: string, replyId: string, newContent: string) => void;
  onDelete: (postId: string, replyId: string) => void;
}

export const Reply = ({ reply, user, postId, onEdit, onDelete }: ReplyProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(reply.content);
  };

  const handleSaveEdit = () => {
    onEdit(postId, reply.id, editContent);
    setIsEditing(false);
  };

  const handleDeleteClick = (replyId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (deleteConfirmId === replyId) {
      onDelete(postId, replyId);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(replyId);
    }
  };

  return (
    <div className="bbs-card fade-in">
      <div className="flex items-start gap-4 flex-row-reverse">
        <div className="flex-shrink-0">
          {reply.authorIcon ? (
            <img
              src={reply.authorIcon}
              alt={reply.author}
              className="w-[100px] h-[100px] rounded-none border border-primary/50 object-cover"
            />
          ) : (
            <MessageSquare className="w-[100px] h-[100px]" />
          )}
          <div className="text-sm mt-2 text-center font-bold px-2 py-1 border border-primary/50">
            {reply.author}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="speech-bubble speech-bubble-right">
            <div className="text-sm text-muted-foreground border border-primary/20 px-2 mb-4 inline-block">
              {reply.createdAt.toLocaleString()}
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
};
